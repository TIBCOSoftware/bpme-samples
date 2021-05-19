## Setup and Build Instructions:  
  
### Prerequisites  
 1. Node (v12.0.0 or above)  
 2. NPM (v6.9.0 or above)
 3. Ionic (v6.12.2 or above)

#### Installing Node
1. Go to https://nodejs.org/en/download/ and download the LTS installer for your OS. (Latest LTS version includes latest npm version)
#### Installing Ionic Framework
1. Run `npm install -g @ionic/cli` command in terminal or command prompt.
  
### Setup  
1. Check out the project (https://github.com/tibco/bpme-samples/tree/master/loan-application-custom-ui-sample/spondulix-loan-app)  
2. Run `npm install` in the project folder.
3. Run `ng serve` command to run locally.  
  
### Build    
1. Run `ionic build --prod --release -- --base-href=/userapps/<app-name>/` command, this  
   command will create deployment files in /www/ folder, create a zip file of these files e.g spondulix.zip  
2. Open TIBCO BPM Enterprise UI and go to App Development in Admin screen then click **'New Upload'** button and select the .zip file that you created in previous step.  
3. Click **'Upload'** button, after upload is completed, file uploaded successfully message will be displayed.  
4. Go to **'All Uploads'** tab and from actions menu of the file uploaded, select **'Publish'** option  
5. Now the app will available, at URL `https://<domain-name>/userapps/<zip-file-name>/`
