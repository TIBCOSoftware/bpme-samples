###############################################################################

TIBCO BPM Enterprise Azure Sample

###############################################################################

This folder contains scripts and files that are required to get a basic BPM 
Enterprise system up and running on Azure. You must have access to the Azure 
subscription and must be familiar with the creation of Azure resources,both
manually and through Azure CLI. You must be used to creating and deploying 
resources into Kubernetes, in this case AKS.

###############################################################################

Prerequisites

###############################################################################

You are required to install the following software to create everything in Azure:

	- Azure CLI (az)
	- Docker

###############################################################################

Setup Instructions

###############################################################################

This sample contains the following folders:

	helm
	scripts

Before running any of the scripts provided by these samples you should check out
the following file:

	scripts/environment

Set up and configure the BPM Enterprise system using properties in this 
environment file. In the environment file, some properties are intentionally 
left blank. You must fill in these properties before executing the scripts.

In addition to the software pre‐requisites required on the client machine,
BPM Enterprise requires an LDAP from which users can be sourced. In the case
of Azure, this should be an instance of Azure Active Directory.

BPM Enterprise does not consider this instance of Azure Active Directory
different from any other LDAP you use with the product. You must specify 
details of how to contact the instance, which SSL certificate to use, which
DN and password to use for the primary "system" connection to LDAP, which is
used for the "tibco‐admin" user. These properties begin with "LDAP_" in the
environment file.

The scripts folder contains the following files:

	setup               -	Creates all the required Azure resources
	upload              -	Re-tags and uploads BPM Enterprise docker images to ACR				
	deploy-cert-manager -	Deploys Certificate Manager to the Azure setup prepared
							by running the previous two scripts
	deploy              -	Deploys BPM Enterprise to the Azure setup prepared
							by running the previous two scripts
	undeploy            -	Does the reverse of deploy, removing BPM Enterprise
							from Azure
	cleanup             -	Deletes all Azure resources

These scripts are idempotent, so can be used to create and delete partially
setup systems.

The helm folder contains all the Helm charts and Kubernetes templates required to
deploy a basic BPM Enterprise system into the running AKS cluster.

The setup scripts checks if you have this software on the path and exits at the
first pre-requisite it finds missing. The machine must be a Linux machine but
can be any of the Linux variants supported by BPM Enterprise.The samples are
tested on Ubuntu.

Both the setup and cleanup scripts require that you first login to Azure with
the CLI using the following command:

	az login

One logged in you can run the setup via:

	./setup

This essentially does the following:

	1. Creates an Azure resource group to contain all the deployed resources
	2. Create an Azure Virtual Network and Subnet to attach AKS and Azure SQL
	3. Creates an Azure Container Registry (ACR) to manage the docker images
	4. Creates an Azure Kubernetes Service (AKS) to run the containers
	5. Connects the ACR to the AKS so that Kubernetes can pull images
	6. Creates an Azure managed PostgreSQL instance for BPM Enterprise with 
           BPM user and schema
	7. Grants AKS access to the PostgreSQL database via the Virtual Network

Use the Azure CLI to upload the BPM Enterprise docker images to ACR. You need to 
first install BPM Enterprise onto the Linux machine, which has done the Azure 
resources setup. When installing BPM Enterprise you need to ensure you select the 
"Kubernetes" installation profile and choose "SQL Server" as the database choice, 
supplying the correct driver. For more information on installation please see the 
install guide. Assuming the docker images have been successfully created run the
following script:

	./upload

This essentially does the following:

	1. Logs into the Azure ACR
	2. Re-tags the utility and runtime images to be pushed to ACR
	3. Pushes the images
	4. Logs out of ACR

Now you are ready to start deploying the AKS resources via the deployment yaml
files. This can be done dy running the following commands:

	./deploy-cert-manager
	./deploy

The latter runs the full BPM Enterprise Helm chart, which essentially does
the following:

	1. Creates the BPM namespace in AKS
	2. Runs the Kubernetes job to create the database schema in Azure SQL
	3. Runs the Kubernetes job to configure the BPM Enterprise admin user into the Azure ldap
	4. Creates the database secrets in Kubernetes
	5. Creates the LDAP secrets in Kubernetes
	6. Deploys BPM Enterprise into Kubernetes
	7. Creates the Kubernetes service for BPM Enterprise
	8. Creates the Kubernetes ingress for BPM Enterprise

But it also updates some scripts to use the latest IP or DNS values deployed in Azure.

These scripts create a private AKS cluster. As such you cannot connect to it directly
from an external machine, such as the one used to run these scripts. The simplest way
to look at the status of objects in AKS is via the Azure client. For example,
you can get the status of pods with the following command:

	az aks command invoke --resource-group bpme-dev-resource-group --name bpme-aks --command "kubectl get pods -n bpm"

This pattern can be used to direct any kubectl command to the AKS cluster through the
Azure client.

It generally take a while for the ingress to get picked up fully but after a few minutes
you should find the server is available in a URL similar to:

	https://bpm-deployment-3w37kmie9zbh.northeurope.cloudapp.azure.com/apps/login

Though the scripts echo out the correct URL each time you run them, you 
need to check the details of the ingress you have created to be sure.

###############################################################################

Cleanup Instructions

###############################################################################

Cleanup is performed by simply running the following scripts in order:

	./undeploy
	./cleanup
