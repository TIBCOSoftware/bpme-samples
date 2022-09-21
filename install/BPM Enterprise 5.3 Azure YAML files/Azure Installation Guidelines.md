# WORK IN PROGRESS
I have completed a successfull installation using the instractions below. Im working on testing these out, but would appreciate any feedback.

# Azure Sample BPM Enterprise Installation
Please read the provided instructions in the ```CONFIG_HOME/tibco/cfgmgmt/bpm/samples/kubernetes/readme.txt```  folder in conjunction with these instructions. I felt a couple of point were assumed and that why i created this document. Hopefully this will help you getting your server up quicker than i did. I shared my Yaml files as the provided samples were slightly different from what is provided with installation binaries.

Youy may have multiple Azure subscriptions, make sure you use the correct one. These commands helps to list and set the correct subscription
```
az login
az account list --output table
```
Copy the desired <subscription-id>
  
```
az account set --subscription <subscription-id>
```

I created the cluster, the container registry and the database storage and database itself through the Azure web GUI.

## Create Cluster on Azure
  
e.g. bpme-aks-cluster

## Container Registry
This registry will contain the docker containers installed by the BPM Enterprise installer. The name should be all lower case - e.g. bpmecr

## Create Outbound IP Address (Optional)
AKSOutboundIP - Used to configure port access to the LDAP server if it is on a Azure instance, like it was in my case.

## Create Azure SQL DB
Create a Azure SQL database with the name "bpm". The creation will also create a SQL instance, mine is called - bpme-aks-storage

## Setup database
Make sure you specify the correct driver for Azure SQL 
mssql-jdbc-9.2.1.jre8.jar

The database setup sripts are diffewrent due to the differences in Azure SQL fdrom SQL Server

## Create Azure SQL database with a DBAdmin user. 

### As admin user against the Master DB run create db user query
```IF SUSER_ID('bpmuser') IS NULL
CREATE LOGIN bpmuser WITH PASSWORD = 'bpmuser'

IF NOT EXISTS (SELECT * FROM sys.sysdatabases WHERE name = N'bpm')
CREATE DATABASE [bpm]
GO
```

### As admin user against the BPM database execute these statements

You may get one error in executing this script. I ignored it and never had a problem.
  
```
ALTER DATABASE [bpm] SET AUTO_UPDATE_STATISTICS ON 
ALTER DATABASE [bpm] SET AUTO_UPDATE_STATISTICS_ASYNC ON 
GO
ALTER DATABASE [bpm] SET ALLOW_SNAPSHOT_ISOLATION ON
GO
ALTER DATABASE [bpm] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [bpm] COLLATE Latin1_General_CS_AS 
GO
IF NOT EXISTS (SELECT * from sys.change_tracking_databases WHERE database_id = DB_ID('bpm'))
ALTER DATABASE [bpm] SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON)
GO
-- ALTER LOGIN [bpmuser] WITH DEFAULT_DATABASE = [bpm] -- GO
USE [bpm]
GO
-- Check database user
IF USER_ID('bpmuser') IS NULL
CREATE USER [bpmuser] FOR LOGIN [bpmuser] WITH DEFAULT_SCHEMA = [bpm]
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'bpm')
EXEC( 'CREATE SCHEMA [bpm] AUTHORIZATION [bpmuser]' ) 
GO
-- Add the user and configure
USE [bpm] exec sp_addrolemember 'db_ddladmin', 'bpmuser' 
GO
USE [bpm] exec sp_addrolemember 'db_datareader', 'bpmuser' 
GO
USE [bpm] exec sp_addrolemember 'db_owner', 'bpmuser'
GO
-- Gives user ability control the DBO schema
GRANT CONTROL ON SCHEMA::dbo TO [bpmuser] WITH GRANT OPTION 
GO
-- Needed to execute showplan
GRANT SHOWPLAN TO [bpmuser]
GO
-- Needed to manipulate application roles GRANT ALTER ANY APPLICATION ROLE TO [bpmuser] GO
-- Needed to manipulate roles
GRANT ALTER ANY ROLE TO [bpmuser]
GO
-- Needed to view definitions of objects
GRANT VIEW DEFINITION TO [bpmuser]
GO
-- Needed to create schemas
GRANT CREATE SCHEMA TO [bpmuser]
GO
-- Needed for database-level DMVs
GRANT VIEW DATABASE STATE TO [bpmuser]
GO

GRANT CONTROL ON DATABASE::bpm TO bpmuser

```

## Run the utility to configure the database
This command creates the connection to the database for the BPM Enterprise server
```                                                                                                                   
docker run -it --rm tibco/bpm/utility:5.3.0 utility -setupDatabase execute --verbose -dbConfig url='jdbc:sqlserver://bpme-aks-storage.database.windows.net:1433;database=bpm;user=bpmuser@bbpme-aks-storage;password=Tibco@123;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;'
```
## Run the utility to configuree the ldap settings
This command stores the ldap settings in the bpm database 
```
docker run -it --rm tibco/bpm/utility:5.3.0 utility -setupAdminUser ldapAlias=system ldapDn='UID=admin, OU=system' displayName=tibco-admin -dbConfig url='jdbc:sqlserver://bpme-aks-storage.database.windows.net:1433;database=bpm;user=bpmuser@bpme-aks-storage;password=Tibco@123;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;' 
```

To create the secrets for the secrets yaml files use the following commands
```
echo -n bpmuser | base64
YnBtdXNlcg==
echo -n Tibco@123 | base64
VGliY29AMTIz
```

Make sure your ldap can receive the call from the BPME server. This means you will have to open the incomming port 10389 needs to be able to receive the Outbound cluster IP address. You will have to configure an outbound ip adress for the bpm cluster running the BPM Enterprise server.

Note : “&” is being treated like a variable. On the principal, it got replaced by __PRINCIPAL__. So to avoid that, we need to introduce the escape character (\) and also since it is an xml file, the & would need to be &amp;.
 
So if your scring looks like this ```CN=tibco_ldap_user,OU=Application Admins,OU=Guest & App & Shared Logins,DC=incomeresearch,DC=com```  

You will need to change the string into: ```CN=tibco_ldap_user,OU=Application Admins,OU=Guest \&amp; App \&amp; Shared Logins,DC=incomeresearch,DC=com```
  
## Configure the Azure instance credentials  
  
This command gets the Azure instance credentials & create a registry in Azure. This is to push the bpme runtime container to, before running yaml the files
```
az aks get-credentials --resource-group bpme-aks-RG --name bpme-aks-cluster
az acr create --resource-group bpme-aks-RG --name bpmecr --sku Standard --subscription a3ba1652-a4cd-4544-aae7-aade9b9ba26e
```

## Update content-trust policy for an Azure Container Registry

Enable admin and login to docker to allow the tagging å push of the docer image to azure
First get the Get ACR registry username & ACR registry password. See this link for more information.
```https://docs.microsoft.com/en-us/azure/container-registry/container-registry-authentication?tabs=azure-cli#admin-account```

```
az acr update -n bpmecr --admin-enabled true
$ACR_UNAME=$(az acr credential show -n bpmecr --query="username" -o tsv)
$ACR_PASSWD=$(az acr credential show -n bpmecr --query="passwords[0].value" -o tsv)
docker login bpmecr.azurecr.io -u $ACR_UNAME -p $ACR_PASSWD
```

Tag the az docker image installed during the BPM Enterprise install process and push BPME image to azure cluster
```
docker tag tibco/bpm/runtime:5.3.0 bpmecr.azurecr.io/bpm/runtime:5.3.0
docker push bpmecr.azurecr.io/bpm/runtime:5.3.0
```

Create BPM Namespace before creating the secret
```
kubectl apply -f bpm-namespace.yaml
```

To create secret that is used in the bpm-deployment.yaml file execute the following line. The last line of the yaml should include the secret name "secret-bpme-acr". Tghis secret gived the deployment access rights to pull the docker container to deploy it. If you get an error unable to pull, then this could be a problem.
  
```
kubectl create secret docker-registry secret-bpme-acr --docker-server=bpmecr.azurecr.io --docker-username=mikebpme --docker-password=Ip5WbYU+5/87MvlzZgxCBCkKNH3ZIQmJ -n bpm
```

## Configure load balancer - public-svc.yaml (Optional - Only if you want to expose the server publically)
```
apiVersion: v1
kind: Service
metadata:
  name: public-svc
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: public-app
```

Apply the yaml to create the load balancer 
```
kubectl apply -f public-svc.yaml
```

### Update load balancer
```
az aks update --resource-group mmyburgh-aks-RG --name mmyburgh-aks-cluster --load-balancer-managed-outbound-ip-count 2
```

Create A public IP, SKU must be standard (In this example name of the IP is AKSOutboundIP, you can change the name)
```
az network public-ip create -g mmyburgh-aks-RG -n AKSOutboundIP --allocation-method Static --sku Standard
```

Get the ID of the public IP & Assign outbound public IP to AKS
```
export $PUBLIC_IP_ID=$(az network public-ip show -g mmyburgh-aks-RG -n AKSOutboundIP --query id -o tsv)
az aks create --resource-group mmyburgh-aks-RG --name mmyburgh-aks-cluster --node-count 2 --generate-ssh-keys  --load-balancer-outbound-ips /subscriptions/a3ba1652-a4cd-4544-aae7-aade9b9ba26e/resourceGroups/mmyburgh-aks-RG/providers/Microsoft.Network/publicIPAddresses/AKSOutboundIP
```

Or Update AKS
```
az aks update  --resource-group bpme-aks-RG  --name bpme-aks-cluster  --load-balancer-outbound-ips /subscriptions/a3ba1652-a4cd-4544-aae7-aade9b9ba26e/resourceGroups/mmyburgh-aks-RG/providers/Microsoft.Network/publicIPAddresses/AKSOutboundIP
```

IP Address
```
az network public-ip show --ids /subscriptions/a3ba1652-a4cd-4544-aae7-aade9b9ba26e/resourceGroups/bpme-aks-RG/providers/Microsoft.Network/publicIPAddresses/AKSOutboundIP --query ipAddress -o tsv
```
Make sure the Database firewall is open to the Azure cluster IP Address

## Make sure the Apache Directory Server is reachable
I tested it with Directory Studio.


## Update the bpm-deployment.yaml 
If you don't use postgres, you need to add the driver class you will be using 
refer to this link for details ```https://docs.tibco.com/pub/bpme/5.3.0/doc/html/installation/create-a-kubernetes-deployment.htm```
e.g.
```
env:
          - name: JDBC_DRIVERCLASS
            value: com.microsoft.sqlserver.jdbc.SQLServerDriver
          - name: JDBC_URL
            value: "jdbc:sqlserver://mmyburgh-aks-storage.database.windows.net:1433;database=bpm"
          - name: LDAP_SYSTEM_ALIAS
            value: "system"
          - name: LDAP_SYSTEM_URL
            value: "ldap://137.135.74.160:10389/ou=system"
          - name: LDAP_EASYAS_ALIAS
            value: "easyAs"
          - name: LDAP_EASYAS_URL
            value: "ldap://bpm-apacheds:10389/o=easyAsInsurance" 
```

# Run yaml files
```
#The bpm-namespace.yaml file was already executed earlier
kubectl apply -f bpm-namespace.yaml  
kubectl apply -f bpm-secrets-ldap.yaml
kubectl apply -f bpm-secrets-db.yaml
kubectl apply -f bpm-deployment.yaml
kubectl apply -f bpm-service.yaml
```

Check if the deployment is successful
```
kubectl get pods -n bpm 
kubectl logs  <pod id> -n bpm
kubectl describe <pod id> -n bpm
```
To login, you will have to do one of 2 things.
  1. Configure ingress with a load balancer : I will not explain this in this document as it requires knowledge of securing the load balancer that is very important to keep your environment safe.
  2. Do a port forward of the service to allow you to login : Execute the following command and then login to the server from the browser.
  ```
  kubectl port-forward service/bpm-service 8181:8181 -n bpm
  ```
  Login to the server
  ```
  http://localhost:8181/apps/login/index.html
  ```
  
  
If something went wrong, to delete a deployment and registry
```
kubectl delete -f bpm-deployment.yaml
```
or to delete the entire namespace and do it all from scratch
```
kubectl delete -f bpm-namespace.yaml
```
