This sample provides Cloud formation template for EKS deployment on AWS

The Cloud formation templates will deploy:
- a VPC with bastion, public and private subnets
- ec2 instance which runs the BPME installer and orchestrates the provisioning of the AWS EKS cluster with kubectl.
- ec2 instance hosting an LDAP directory server
- aurora postgresql instance
- load balancers for access to BPME and LDAP
- associated security groups

The procedure is described in [Using the TIBCO BPM Enterprise on Amazon Web Services Cloud Sample](../wiki/Using-the-TIBCO-BPM-Enterprise-on-Amazon-Web-Services-Cloud-Sample)
