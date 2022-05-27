# BPM 5.x Installation - Quick guide


<div class="warning" style='background-color:#b1d1f1; color: #000000; border-left: solid #3E8EDE 4px; border-radius: 4px; padding:0.7em;'>
<span>
<p style='margin-top:1em; text-align:left'>
<b> Note: </b>
This document does not replace the official documentation available on <a href="https://docs.tibco.com/products/tibco-bpm-enterprise-5-2-0">Tibco documentation</a>.
</p>
<p style='margin-bottom:1em; margin-right:1em; text-align:right;'> </i>
</p></span>
</div>

---

This guide is made with BPME 5.2.1 but the installation processes are the same for all 5.x versions (tested up to 5.3).

**TIBCO BPM Enterprise** can be installed in two configurations - one intended for development use, one for production. You can download the TIBCO BPM Enterprise software package from [edelivery.tibco.com](http://edelivery.tibco.com/).


## BPM Developer Server

Once the package has been downloaded and extracted, you can run the installation file via the command:

```console
$ ./TIBCOUniversalInstaller-lnx-x86-64.bin -console
```
The steps to follow during the installation phase are:

1. Set up the **TIBCO_HOME**;
2. Choose the configuration you want to install, Developer Server or Kubernetes;
3. JDBC driver packages can also be added to the installation;
4. What type of database you want to use;
5. Set up the **CONFIG_HOME**. 

Below are the important configuration steps during installation:

<!---  /opt/tibco/BPM/5.2.1/tibcoHome 
/opt/tibco/BPM/5.2.1/tibcoCfgHome -->

```
Choose one or more installation profiles. Installation Profiles
preselect the installation features for you. You will have the
option to customize your selections after making your profile choices.


   1. [x] BPM Developer Server
   2. [ ] BPM for Kubernetes

```

```
Do you want to customize the install feature selections? [Yes] 

TIBCO ® BPM Enterprise 5.2.1 - Feature Selection
------------------------------------------------

Choose the features to install.


   1. [X] BPM Core Runtime
   2. [ ] Package JDBC Driver
   3. [X] Build Docker Images

To select an item, enter its number. Enter '0' when you are finished. 2

   1. [X] BPM Core Runtime
   2. [X] Package JDBC Driver
   3. [X] Build Docker Images

To select an item, enter its number. Enter '0' when you are finished. 
```

```
TIBCO Universal Installer - Database Type
-----------------------------------------

Choose the Database Type


   1. PostgreSQL
   2. Oracle
   3. SQL Server

Select an option by entering its number from the list above. [1] 
```
The installer completes the following tasks:

 - processes and copies the required TIBCO BPM Enterprise files to TIBCO_HOME
 - configures the TIBCO BPM Enterprise software, copying the required files to CONFIG_HOME
 - builds Docker images of the PostgreSQL, ApacheDS LDAP server, and TIBCO BPM Enterprise application
 - starts the TIBCO BPM Enterprise Developer Server (using docker-compose up), which exposes the PostgreSQL, ApacheDS LDAP server, and TIBCO BPM Enterprise application as services.

Once the installation is complete, there will be four images: the BPM runtime, Database, LDAP and an image called utility that is used to configure the database and LDAP. Using **docker images** command you should have something like this:

| REPOSITORY    | TAG     | IMAGE ID     | CREATED        | SIZE         |
| :---                 | :----:  |    :----:    |    :----:      |         ---: |
| tibco/bpm/utility    | 5.2.1   | 94ca01a3c515 | 23 minutes ago | 248MB        |
| tibco/bpm/runtime    | 5.2.1   | 515c527fc129 | 23 minutes ago | 614MB        |
| tibco/bpm/apacheds   | 1.5.6   | 50e7aaab090b | 23 minutes ago | 300MB        |
| tibco/bpm/postgresql | 11.8    | 308e7a2072de | 23 minutes ago | 156MB        |

You can log into TIBCO BPM Enterprise UI on the following URL:

```
http://localhost/apps/login/index.html
```
with the following credentials: 

 - username: tibco-admin 
 - password: secret

In case you need to start the containers manually, you can use the dockerfiles present in the Config Home:

```console
$ cd CONFIG_HOME/tibco/cfgmgmt/bpm/samples/bpm-compose
$ docker-compose up -d
```

---

## BPM for Kubernetes

Once the package has been downloaded and extracted, you can run the installation file via the command:

```console
$ ./TIBCOUniversalInstaller-lnx-x86-64.bin -console
```
The steps to follow during the installation phase are:

1. Set up the **TIBCO_HOME**;
2. Choose the configuration you want to install, Developer Server or Kubernetes;
3. JDBC driver packages can also be added to the installation;
4. What type of database you want to use. If you select the Oracle database, click Browse to navigate to the location of the Oracle Database 19c JDBC Driver ojdbc8.jar file;
5. Set up the **CONFIG_HOME**. 

Below are the important configuration steps during installation:

```
Choose one or more installation profiles. Installation Profiles
preselect the installation features for you. You will have the
option to customize your selections after making your profile choices.


   1. [ ] BPM Developer Server
   2. [ ] BPM for Kubernetes

To select an item, enter its number. Enter '0' when you are finished. 2

   1. [ ] BPM Developer Server
   2. [X] BPM for Kubernetes

To select an item, enter its number. Enter '0' when you are finished. 0

Do you want to customize the install feature selections? [Yes] 

TIBCO ® BPM Enterprise 5.2.1 - Feature Selection
------------------------------------------------

Choose the features to install.


   1. [X] BPM Core Runtime
   2. [X] Package JDBC Driver
   3. [X] Build Docker Images

To select an item, enter its number. Enter '0' when you are finished. 
```

```
Choose a folder to be used as the TIBCO configuration destination for this installation environment. The configuration directory is used to store product configuration information. The folder must not already exist as a configuration destination for another TIBCO installation environment. Subdirectories tibco/cfgmgmt will be appended to this directory.

TIBCO Configuration Directory: [/home/tibco/TIBCO_HOME2] /opt/tibco/BPM/5.2.1/tibcoCfgHome

Enter '1' to continue, '2' to go back to the previous panel, or '3' cancel: [1] 

TIBCO Universal Installer - Database Type
-----------------------------------------

Choose the Database Type


   1. PostgreSQL
   2. Oracle
   3. SQL Server
```

The installer completes the following tasks:

 - processes and copies the required TIBCO BPM Enterprise files to TIBCO_HOME;
 - configures the TIBCO BPM Enterprise software, copying the required files to CONFIG_HOME;
 - builds the Docker image of the TIBCO BPM Enterprise application, which you can then add to Kubernetes.

Once the installation is complete, there will be two images: the BPM runtime and an image called utility that is used to configure the database and LDAP.

### Database configuration

During the installation you will be asked to choose which database to use. Let's take PostgreSQL as an example.

Create a new database with a suitable name. For example: bpmdb.
In the *CONFIG_HOME/tibco/cfgmgmt/bpm/database* folder there are folders for all types of databases. Enter the PostgreSQL database folder and run the script **createuser.sql**:

```sql
DO
$do$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='bpmuser')
	THEN
		CREATE ROLE bpmuser LOGIN PASSWORD 'bpmuser' NOINHERIT VALID UNTIL 'infinity';
		GRANT bpmuser TO postgres;
		CREATE SCHEMA bpm AUTHORIZATION bpmuser;
		ALTER USER bpmuser SET search_path TO bpm,public;
	END IF;
END
$do$
```
To create a database schema run the -setupDatabase option with the execute argument: 
```
docker run -it --rm tibco/bpm/utility:5.2.1 utility -setupDatabase execute -dbConfig url=jdbc:postgresql://<host>:<port>/bpmdb username=bpmuser password=bpmuser 
```
Alternatively, to create a database schema running the utility as a Kubernetes job, use:
```yaml
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: utility
  namespace: bpme
spec:
  template:
    spec:
      hostPID: true
      containers:
      - name: utility
        image: tibco/bpm/utility:5.2.1 
        command: ["utility","-dbConfig","url=jdbc:postgresql://<postgres-service>:<port>/bpmdb  username=xxx password=xxx","-setupDatabase execute"]
      restartPolicy: Never 
 EOF
```

### LDAP configuration

Use the provided "utility" Docker image to configure the tibco-admin LDAP user:
```
docker run -it --rm tibco/bpm/utility:5.2.1 utility -dbConfig url=jdbc:postgresql://<host>:<port>/bpmdb username=bpmuser password=bpmuser -setupAdminUser ldapAlias=system ldapDn='uid=admin,ou=system' displayName=Administrator
```

### Kubernetes yaml file

A sample deployment file is included in the TIBCO BPM Enterprise installation in the 
*CONFIG_HOME/tibco/cfgmgmt/bpm/samples/kubernetes* folder. This section will show the main files:

 - bpm-deployment.yaml
 - bpm-ingress.yaml
 - bpm-namespace.yaml
 - bpm-secrets-db.yaml
 - bpm-secrets-ldap.yaml
 - bpm-service.yaml

<div class="warning" style='background-color:#b1d1f1; color: #000000; border-left: solid #3E8EDE 4px; border-radius: 4px; padding:0.7em;'>
<span>
<p style='margin-top:1em; text-align:left'>
<b> Note: </b>
In order to encrypt passwords in base64 for database and LDAP yaml files you can use the following command:<br> <br>
$ echo -n **password** | base64  <br> <br>
For the LDAP_SYSTEM_PRINCIPAL you have to use the same value used in the docker run command during the LDAP configuration. Pay attention to include quotes during the encryption.<br>
To verify the correct value use the following command: <br><br>
$ echo -n **encrypted_password** | base64
<br> 
</p> 
<p style='margin-bottom:1em; margin-right:1em; text-align:right;'> </i>
</p></span>
</div>
