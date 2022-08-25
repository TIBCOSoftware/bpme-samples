# WORK IN PROGRESS
There are my notes so far. There are still a lot of changes and updates that needs to be made.

# Azure Sample BPM Enterprise Installation
I have created an Azure Cluster BPM Enterprise Installation and i'd love to share it with anyone interested. 

Please read the provided instructions in the ```CONFIG_HOME/tibco/cfgmgmt/bpm/samples/kubernetes/readme.txt```  folder in conjunction with these instructions. I felt a couple of point were assumed and that why i created this document. Hopefully this will help you getting your server up quicker than i did. 

Youy may have multiple subscriptions, make surte you use the correct one. These commands helps to list and set the correct subscription
```
az account list --output table
az account set --subscription <subscription-id>
```


I created the cluster, the container registry and the database storage and database itself through the Azure web GUI.

## Create Cluster on Azure
mmyburgh-aks-cluster

## Container Registry
mikebpme

## Create Outbound IP Address
AKSOutbountIP

## Create Azure QL DB
DB - bpm
Server - mmyburgh-aks-storage


## Setup database
Make sure you specify the correct driver for Azure SQL 
mssql-jdbc-9.2.1.jre8.jar

The database setup sripts are diffewrent due to the differences in Azure SQL

## Create Azure SQL database with DBAdmin user. 

### As admin user against the Master DB run create db user query
```IF SUSER_ID('bpmuser') IS NULL
CREATE LOGIN bpmuser WITH PASSWORD = 'bpmuser'

IF NOT EXISTS (SELECT * FROM sys.sysdatabases WHERE name = N'bpm')
CREATE DATABASE [bpm]
GO
```

### As admin user against the BPM database execute these statements
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

## Run the utility to configuree the database
This command created the connection to the database for the BPM Enterprise server
```                                                                                                                   
docker run -it --rm tibco/bpm/utility:5.3.0 utility -setupDatabase execute --verbose -dbConfig url='jdbc:sqlserver://mmyburgh-aks-storage.database.windows.net:1433;database=bpm;user=bpmuser@mmyburgh-aks-storage;password=Tibco@123;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;'
```
## Run the utility to configuree the ldap settings
This command stores the ldap settings in the database 
```
docker run -it --rm tibco/bpm/utility:5.3.0 utility -setupAdminUser ldapAlias=system ldapDn='UID=admin, OU=system' displayName=tibco-admin -dbConfig url='jdbc:sqlserver://mmyburgh-aks-storage.database.windows.net:1433;database=bpm;user=bpmuser@mmyburgh-aks-storage;password=Tibco@123;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;' 
```

To create the secrets for the secrets yaml files use the following commands
```
echo -n bpmuser | base64
YnBtdXNlcg==
echo -n Tibco@123 | base64
VGliY29AMTIz
```

To get the Azure instance credentials & Create a registry in Azure to push the bpme runtime too before running yaml files
```
az aks get-credentials --resource-group mmyburgh-aks-RG --name mmyburgh-aks-cluster
az acr create --resource-group mmyburgh-aks-RG --name mikebpme --sku Standard --subscription a3ba1652-a4cd-4544-aae7-aade9b9ba26e
```

Update content-trust policy for an Azure Container Registry

Enable admin and login to docker to allow the tagging å push of the docer image to azure
First get the Get ACR registry username & ACR registry password
```https://docs.microsoft.com/en-us/azure/container-registry/container-registry-authentication?tabs=azure-cli#admin-account```

```
az acr update -n mikebpme --admin-enabled true
$ACR_UNAME=$(az acr credential show -n mikebpme --query="username" -o tsv)
$ACR_PASSWD=$(az acr credential show -n mikebpme --query="passwords[0].value" -o tsv)
docker login mikebpme.azurecr.io -u $ACR_UNAME -p $ACR_PASSWD
```

Tag the az docker image installed during the BPM Enterprise install process and push BPME image to azure cluster
```
docker tag tibco/bpm/runtime:5.3.0 mikebpme.azurecr.io/bpm/runtime:5.3.0
docker push mikebpme.azurecr.io/bpm/runtime:5.3.0
```

To create BPM Namespace before creating the secret
```
kubectl apply -f bpm-namespace.yaml
```
To create secret
```
kubectl create secret docker-registry secret-acr --docker-server=mikebpme.azurecr.io --docker-username=mikebpme --docker-password=Ip5WbYU+5/87MvlzZgxCBCkKNH3ZIQmJ -n bpm
```

#Configure load balancer - public-svc.yaml
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

#Update load balancer
```
az aks update --resource-group mmyburgh-aks-RG --name mmyburgh-aks-cluster --load-balancer-managed-outbound-ip-count 2
```
Retrieve the Azure credentials
```
az aks get-credentials --resource-group mmyburgh-aks-RG --name mmyburgh-aks-cluster
az acr create --resource-group mmyburgh-aks-RG --name mikebpme --sku Standard --subscription a3ba1652-a4cd-4544-aae7-aade9b9ba26e
```

Create A public IP, SKU must be standard (In this example name of the IP is AKSOutboundIP, you can change the name)
```
az network public-ip create -g mmyburgh-aks-RG -n AKSOutboundIP --allocation-method Static --sku Standard
```

Get the ID of the public IP
```
export $PUBLIC_IP_ID=$(az network public-ip show -g mmyburgh-aks-RG -n AKSOutboundIP --query id -o tsv)
```

```Assign outbound public IP to AKS
az aks create --resource-group mmyburgh-aks-RG --name mmyburgh-aks-cluster --node-count 2 --generate-ssh-keys  --load-balancer-outbound-ips /subscriptions/a3ba1652-a4cd-4544-aae7-aade9b9ba26e/resourceGroups/mmyburgh-aks-RG/providers/Microsoft.Network/publicIPAddresses/AKSOutboundIP
```

Or Update AKS
```
az aks update  --resource-group mmyburgh-aks-RG  --name mmyburgh-aks-cluster  --load-balancer-outbound-ips /subscriptions/a3ba1652-a4cd-4544-aae7-aade9b9ba26e/resourceGroups/mmyburgh-aks-RG/providers/Microsoft.Network/publicIPAddresses/AKSOutboundIP
```

IP Address
```
az network public-ip show --ids /subscriptions/a3ba1652-a4cd-4544-aae7-aade9b9ba26e/resourceGroups/mmyburgh-aks-RG/providers/Microsoft.Network/publicIPAddresses/AKSOutboundIP --query ipAddress -o tsv
```
Make sure the Database firewall is open to the Azure cluster IP Address

## Make sure the Directory server is reachable
I tested it with Directory Studio.


## Update the bpm-deployment.yaml 
If you dont use postgres, you need to add the driver class you will be using 
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
```

# Run yaml files
```
kubectl apply -f bpm-namespace.yaml
kubectl apply -f bpm-secrets-ldap.yaml
kubectl apply -f bpm-secrets-db.yaml
kubectl apply -f bpm-deployment.yaml
```

Check if the deployment is successful
```
kubectl get pods -n bpm 
kubectl logs  <pod id> -n bpm
kubectl describe <pod id> -n bpm
```

If something went wrong, to delete a deployment and registry
```
kubectl delete -f bpm-deployment.yaml
```
or to delete the entire namespace and do it all from scratch
```
kubectl delete -f bpm-namespace.yaml
```
