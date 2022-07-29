#Minikube sample implementation

Ubuntu is buggy and i found i had to restart the gnome shell on a regular bases.
gnome-shell –replace

Make sure minikube is started
minikube start

Before running the bpm install, make sure you yse the same terminal to run the installs. The eval command is specific to the terminal windows you are in. and if you try and run the eval in a different terminal, you will not be using the minikube docker repo.
eval $(minikube -p minikube docker-env)

Do a docker ps to confirm you are on the miniukube docker instance



Creating the BPM Enetrprise Schema 
The tibco/bpm/utility is used to do this. The command is below. Prior to running this, make sure your jdbc connection is working. I use the hostname linux command to get the name for my host and port 5432 is the default postgres port

docker run -it --rm tibco/bpm/utility:5.3.0 utility -setupDatabase execute --verbose -dbConfig url='jdbc:postgresql://ip-172-31-29-101:5432/bpmdb' username=bpmuser password=bpmuser
For this to work i had to change my pg_hba.conf file like below. This will be different for oracle and sql.


# DO NOT DISABLE!
# If you change this first entry you will need to make sure that the
# database superuser can access the database using some other method.
# Noninteractive access to all databases is required during automatic
# maintenance (custom daily cronjobs, replication, and similar tasks).
#
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
#local   all             all                                     peer
# IPv4 local connections:

############### Commented this out from the default file ############
#host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
#host    all             all             ::1/128                 md5
############### Commented this out from the default file ############

# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            md5
host    replication     all             ::1/128                 md5
host	all		        all		        all		                md5

Configure the LDAP Directory Server
See this link for how to configure the security details
https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-config-file/

In the LDAP bpm-secret-ldap.yaml
LDAP_SYSTEM_Prinsipal
echo -n 'UID=admin, OU=system' | base64
VUlEPWFkbWluLCBPVT1zeXN0ZW0=


Note : for running the setupAdmin utility command it is important to that you need to include the dbConfig parameter as that is what inserts the info in the database to use whjen the server starts up.
docker run -it --rm tibco/bpm/utility:5.3.0 utility -setupAdminUser ldapAlias=system ldapDn='UID=admin, OU=system' displayName=tibco-admin -dbConfig url='jdbc:postgresql://ip-172-31-29-101:5432/bpmdb' username=bpmuser password=bpmuser

Kubernetes deployment
The sample YAML filed provided by the server install are just that, samples. Ill share my updated files in the GitHub Samples repository. They are very much out dates as it is installed. 

These commands will trigger the server configuration. After the bpm-ingress.yaml, the server will be started. It takes time to get the server up and running. Check the logs to see the server starting up.

kubectl apply -f bpm-namespace.yaml
kubectl apply -f bpm-secrets-ldap.yaml
kubectl apply -f bpm-secrets-db.yaml
kubectl apply -f bpm-deployment.yaml
kubectl apply -f bpm-service.yaml
kubectl apply -f bpm-ingress.yaml

To check if the server starts in the log files

This first commands provides the pod name
kubectl get pods --namespace=bpm

Use the pod name in the command below


kubectl logs bpm-deployment-6574466749-f5xbs --namespace=bpm


Once the server is up and running, you can see the connection details and the general server configuration.
kubectl describe service --namespace=bpm

To delete the yaml’s in case something goes wrong. This command deletes the namespace on minikube and reset the environment. 
kubectl delete -f bpm-namespace.yaml

In my machine, after running the setup, i could not connect from the browser. I had to run the following command to open the prot. This may be a minikube issue

kubectl config set-context --current --namespace=bpm
ssh -i ~/.minikube/machines/minikube/id_rsa docker@$(minikube ip) -NL \*:8181:0.0.0.0:8181

The output of this command will be this section below. You will see it provides a public ip address that you can use to connect with or you can use 0.0.0.0.
 
The authenticity of host '192.168.49.2 (192.168.49.2)' can't be established.
ECDSA key fingerprint is SHA256:BSfbBfRynDYCW1WkazNKuKE4XW9oZqwib/s+YfwW7cc.
Are you sure you want to continue connecting (yes/no/[fingerprint])? y
Please type 'yes', 'no' or the fingerprint: yes
Warning: Permanently added '192.168.49.2' (ECDSA) to the list of known hosts.

Use this url to connect to the workspace.
http://0.0.0.0:8181/apps/work-manager/#/overview
Or in my case 
http://192.168.49.2:8181/apps/login/index.html

Restarting the AMI 
Run these commands to get the server up after restart.
minikube start
docker run -d --name ads -p 389:10389 itzg/apacheds
eval $(minikube -p minikube docker-env)
kubectl config set-context --current --namespace=bpm
ssh -i ~/.minikube/machines/minikube/id_rsa docker@$(minikube ip) -NL \*:8181:0.0.0.0:8181
