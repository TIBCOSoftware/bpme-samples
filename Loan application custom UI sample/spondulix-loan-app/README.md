## Setup and Build Instructions:  
  
### Prerequisites  
 1. Node (v12.0.0)   
 2. NPM (v6.9.0)   
 3. Ionic (v6.12.2)
  
### Setup  
1. Check out the project (https://emea-swi-svn.emea.tibco.com/svn/BPMPrototyping/trunk/ACE/Apps/BorroApp) <-- Replace with GitHub repo link  
2. Run `npm install` in the project folder.
3. Run `ng serve` command to run locally.  
  
### Build    
1. Run `ionic build --prod --release -- --base-href=/userapps/<app-name>` command, this  
   command will create deployment files in /www/ folder, create a zip file of these files e.g spondulix.zip  
2. Open ACE and go to App Development in Admin screen then click **'New Upload'** button and select the .zip file that you created in previous step.  
3. Click **'Upload'** button, after upload is completed, file uploaded successfully message will be displayed.  
4. Go to **'All Uploads'** tab and from actions menu of the file uploaded, select **'Publish'** option  
5. Now the app will available, at URL `https://<domain-name>/userapps/<zip-file-name>/`