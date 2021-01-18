#!/bin/bash
#
# Copyright © 2021. TIBCO Software Inc.
# This file is subject to the license terms contained
# in the license file that is distributed with this file.
#

. /home/ec2-user/bpmenv.sh

echo "Provision k8s cluster - started"


#
# K8S secret values need to be base64 encoded, so generate
#
export BPM_DB_USERNAME_SECRET=`echo -n $BPM_DB_USERNAME | base64`
export BPM_DB_PASSWORD_SECRET=`echo -n $BPM_DB_PASSWORD | base64`
export LDAP_DN_SECRET=`echo -n $LDAP_DN | base64`
export LDAP_CLOUD_ADMIN_PASSWORD_SECRET=`echo -n $LDAP_CLOUD_ADMIN_PASSWORD | base64`

#
# Generate k8s yaml files from templates
#

for K8STEMPLATE in *.yaml.template
do
	K8SCONFIG=$(basename ${K8STEMPLATE} .yaml.template)
	echo "Generating ${K8SCONFIG}.yaml"
	cat ${K8STEMPLATE} | envsubst > ${K8SCONFIG}.yaml
done

# Create the EKS cluster and fargate profile

eksctl create cluster -f k8s-eksctl-cluster.yaml



#
# Test kubectl access
#

kubectl get svc
ret_code=$?
if [ $ret_code != 0 ]
then
        echo "Unable to access cluster with: kubectl get svc"
        exit $ret_code
fi

# Store config for ec2-user access

echo "export KUBECONFIG=/home/ec2-user/k8sconfig/.kube/config" >> /home/ec2-user/.bash_profile
chown -R ec2-user:ec2-user /home/ec2-user/k8sconfig

kubectl get nodes
ret_code=$?
if [ $ret_code != 0 ]
then
        echo "Unable to access worker nodes with: kubectl get nodes"
        exit $ret_code
fi

curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-alb-ingress-controller/v1.1.8/docs/examples/iam-policy.json

aws iam create-policy --policy-name bpm-eks-fargate-iam-policy --policy-document file://iam-policy.json

# Enable IAM roles for service accounts on the cluster

eksctl  --region ${AWS_DEFAULT_REGION} utils associate-iam-oidc-provider --cluster ${CLUSTER_NAME} --approve

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text | awk '{print $1}')

eksctl  --region ${AWS_DEFAULT_REGION} create iamserviceaccount --name bpm-serviceaccount --namespace kube-system --cluster ${CLUSTER_NAME} --attach-policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/bpm-eks-fargate-iam-policy --approve --override-existing-serviceaccounts

export BPM_SERVICE_ACCOUNT_ROLE_ARN=$(eksctl --region ${AWS_DEFAULT_REGION} get iamserviceaccount --cluster ${CLUSTER_NAME} --name bpm-serviceaccount --namespace kube-system |grep bpm-serviceaccount | awk '{print $3}')

echo "Generating k8s-rbac-role.yaml"
cat k8s-rbac-role.yaml.template | envsubst > k8s-rbac-role.yaml


kubectl apply -f k8s-rbac-role.yaml

#
# Create specific namespace for BPM, secrets, deployment, service and ingress will be deployed in this namespace
#

kubectl apply -f k8s-bpm-namespace.yaml

#
# Deploy the secrets required to support the BPM deployment
#

kubectl apply -f k8s-bpm-secrets-db.yaml
kubectl apply -f k8s-bpm-secrets-ldap.yaml

# Add EKS cluster security group as a source for LDAP and RDS to allow access from pods

CLUSTER_SG=$(aws --region ${AWS_DEFAULT_REGION} ec2 describe-security-groups --filters Name=group-name,Values=*eks-cluster-sg* --query "SecurityGroups[*].{Name:GroupName,ID:GroupId}" --output text | awk '{print $1}')


BPM_DB_SG=$(aws --region ${AWS_DEFAULT_REGION} ec2 describe-security-groups --filters Name=group-name,Values=*BPM*DB*SG* --query "SecurityGroups[*].{Name:GroupName,ID:GroupId}"  --output text | awk '{print $1}')

BPM_LDAP_SG=$(aws --region ${AWS_DEFAULT_REGION} ec2 describe-security-groups --filters Name=group-name,Values=*LDAP*Inst*SG* --query "SecurityGroups[*].{Name:GroupName,ID:GroupId}" --output text | awk '{print $1}')

aws --region ${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress \
    --group-id ${BPM_DB_SG} \
    --protocol tcp \
    --port 5432 \
    --source-group ${CLUSTER_SG}

aws --region ${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress \
    --group-id ${BPM_LDAP_SG} \
    --protocol tcp \
    --port 389 \
    --source-group ${CLUSTER_SG}

aws --region ${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress \
    --group-id ${BPM_LDAP_SG} \
    --protocol tcp \
    --port 636 \
    --source-group ${CLUSTER_SG}


#
# Start BPM deployment, number of pods started will depend on replica set config of deployment
#

kubectl apply -f k8s-bpm-deployment.yaml

#
# rollout command will wait until deployment has ready status
#

time kubectl rollout status deployment.v1.apps/bpm-deployment -n ${K8SNAMESPACE} --timeout=600s


#
# Deploy ingress controller in the cluster
#

kubectl apply -f k8s-alb-ingress-controller.yaml

#
# Deploy service so that load balancer can route to BPM pods
#

kubectl apply -f k8s-bpm-service.yaml


#
# Find the Bastion Subnets ...
#
export SUBNET_LIST="bastion-subnets.json"
aws --region ${AWS_DEFAULT_REGION} ec2 describe-subnets --filters "Name=vpc-id,Values=$BASTION_VPCID" > "$SUBNET_LIST"
ret_code=$?
if [ $ret_code != 0 ]
then
        echo "Describe Bastion Stack subnets failed with return code $ret_code"
        exit $ret_code
fi
export SUBNET_PUB1=`cat "$SUBNET_LIST" | jq -r ".Subnets[] | select(.Tags[] | select (.Key == \"Name\") | .Value | contains (\"Public subnet 1\")) | .SubnetId"`
export SUBNET_PUB2=`cat "$SUBNET_LIST" | jq -r ".Subnets[] | select(.Tags[] | select (.Key == \"Name\") | .Value | contains (\"Public subnet 2\")) | .SubnetId"`
export SUBNET_PRIV1A=`cat "$SUBNET_LIST" | jq -r ".Subnets[] | select(.Tags[] | select (.Key == \"Name\") | .Value | contains (\"Private subnet 1A\")) | .SubnetId"`
export SUBNET_PRIV2A=`cat "$SUBNET_LIST" | jq -r ".Subnets[] | select(.Tags[] | select (.Key == \"Name\") | .Value | contains (\"Private subnet 2A\")) | .SubnetId"`

#
# Tag the subnets so they can be found by kubernetes load balancer ingress provisioning
#

aws --region ${AWS_DEFAULT_REGION} ec2 create-tags --resources $SUBNET_PRIV1A  --tags 'Key="kubernetes.io/role/internal-elb",Value=1'
aws --region ${AWS_DEFAULT_REGION} ec2 create-tags --resources $SUBNET_PRIV2A  --tags 'Key="kubernetes.io/role/internal-elb",Value=1'
aws --region ${AWS_DEFAULT_REGION} ec2 create-tags --resources $SUBNET_PUB1  --tags 'Key="kubernetes.io/role/elb",Value=1'
aws --region ${AWS_DEFAULT_REGION} ec2 create-tags --resources $SUBNET_PUB2  --tags 'Key="kubernetes.io/role/elb",Value=1'
aws --region ${AWS_DEFAULT_REGION} ec2 create-tags --resources $SUBNET_PUB1  --tags Key="kubernetes.io/cluster/${CLUSTER_NAME}",Value=shared
aws --region ${AWS_DEFAULT_REGION} ec2 create-tags --resources $SUBNET_PUB2  --tags Key="kubernetes.io/cluster/${CLUSTER_NAME}",Value=shared
#

#
# Deploy load balancer, this will create AWS application load balancer
#

kubectl apply -f k8s-alb-ingress.yaml

#
# Deploy metrics server
#

kubectl apply -f k8s-metrics-server.yaml

#
# Deploy horizontal autoscaler
#

kubectl apply -f k8s-bpm-hpa.yaml

echo "Provision k8s cluster - completed"
