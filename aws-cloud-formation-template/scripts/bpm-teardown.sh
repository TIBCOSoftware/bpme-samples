#!/bin/bash
#
# Copyright © 2021. TIBCO Software Inc.
# This file is subject to the license terms contained
# in the license file that is distributed with this file.
#

. /home/ec2-user/bpmenv.sh

cd /home/ec2-user/k8sconfig

OIDCURL=$(aws --region ${AWS_DEFAULT_REGION} eks describe-cluster --name $CLUSTER_NAME --output json | jq -r .cluster.identity.oidc.issuer | sed -e "s*https://**")
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text | awk '{print $1}')

kubectl delete -f k8s-alb-ingress.yaml
kubectl delete -f k8s-bpm-deployment.yaml


# Ingress deletion will delete the alb, target groups and associated security group, wait for the security group to get deleted before proceeding
INGRESS_SG=notempty
MINS_COUNT=0
while [ "$MINS_COUNT" -le 10 -a ! -z "$INGRESS_SG" ]
do
    sleep 60;
    (( MINS_COUNT++ ))
    echo "Waited for the ingress security group to be removed for $MINS_COUNT minutes"
    INGRESS_SG=$(aws --region ${AWS_DEFAULT_REGION} ec2 describe-security-groups --filters Name=group-name,Values=*ingress* --query "SecurityGroups[*].{Name:GroupName,ID:GroupId}" --output text | awk '{print $1}')
done

# Revoke permissions previously set up to allow the eks nodes to access db and ldap

CLUSTER_SG=$(aws --region ${AWS_DEFAULT_REGION} ec2 describe-security-groups --filters Name=group-name,Values=*eks-cluster-sg* --query "SecurityGroups[*].{Name:GroupName,ID:GroupId}" --output text | awk '{print $1}')


BPM_DB_SG=$(aws --region ${AWS_DEFAULT_REGION} ec2 describe-security-groups --filters Name=group-name,Values=*BPM*DB*SG* --query "SecurityGroups[*].{Name:GroupName,ID:GroupId}"  --output text | awk '{print $1}')

BPM_LDAP_SG=$(aws --region ${AWS_DEFAULT_REGION} ec2 describe-security-groups --filters Name=group-name,Values=*LDAP*Inst*SG* --query "SecurityGroups[*].{Name:GroupName,ID:GroupId}" --output text | awk '{print $1}')


aws --region ${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress \
    --group-id ${BPM_DB_SG} \
    --protocol tcp \
    --port 5432 \
    --source-group ${CLUSTER_SG}

aws --region ${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress \
    --group-id ${BPM_LDAP_SG} \
    --protocol tcp \
    --port 389 \
    --source-group ${CLUSTER_SG}

aws --region ${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress \
    --group-id ${BPM_LDAP_SG} \
    --protocol tcp \
    --port 636 \
    --source-group ${CLUSTER_SG}

eksctl delete iamserviceaccount --cluster ${CLUSTER_NAME} --name bpm-serviceaccount --namespace kube-system

aws iam delete-open-id-connect-provider --open-id-connect-provider-arn arn:aws:iam::$AWS_ACCOUNT_ID:oidc-provider/$OIDCURL

eksctl delete cluster -f k8s-eksctl-cluster.yaml  --verbose 4 --wait

