## Create a Custom Loan Process Application

This is a sample application that demonstrates how to use the BPM Enterprise to create a custom user interface (loan process application) and design a workflow for the loan approval process

### Artifacts required
- BankOrganization (Organization project)
- LoanData (Data project)
- LoanLibrary (Library project)
- LoanApplication (Process project)
- UI application (to be uploaded through application development user interface)

**Note:** These artifacts are provided for you.

### Steps to Deploy the Artifacts

 1. Launch the TIBCO® Business Studio.
 2. Import the following projects
     - [BankOrganization](https://github.com/tibco/bpme-samples/tree/master/loan-application-custom-ui-sample/studio-projects/BankOrganization)
     - [LoanData](https://github.com/tibco/bpme-samples/tree/master/loan-application-custom-ui-sample/studio-projects/LoanData)
     - [LoanLibrary](https://github.com/tibco/bpme-samples/tree/master/loan-application-custom-ui-sample/studio-projects/LoanLibrary)
     - [LoanApplication](https://github.com/tibco/bpme-samples/tree/master/loan-application-custom-ui-sample/studio-projects/LoanApplication)
 3. Deploy the projects imported earlier. For details, refer to [Deploying a Project](https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-FCA4287B-7F5B-4098-B980-33FBF80CFAB6.html)
   
**Note**: The deployment of these four projects should be in the following order:

1. BankOrganization

2. LoanData

3. LoanLibrary

4. LoanApplication


## Steps to Deploy the Custom Client UI Application (Spondulix)

1. Download the **spondulix** application from [here](https://github.com/tibco/bpme-samples/tree/master/loan-application-custom-ui-sample/spondulix-loan-app)
2. Build and package the application into a zip file. For details, click [here](https://github.com/tibco/bpme-samples/blob/master/loan-application-custom-ui-sample/spondulix-loan-app/README.md)
3. Go to **App Development** in BPM Enterprise to deploy the UI project.

a. To deploy the UI project, upload the zip file created in step 2.

b. Browse or drag and drop the zip file to App Development.

c. After uploading the zip file, you can view the spondulix application at *BPME-Server/userapps/spondulix*

3. Go to **Work Manager** to view the Loan Application project. The Loan Application project has two processes:

I. Create Customer

II. Loan Application

#### Create Customer

This process is used to create data for the **Spondulix** application, which includes following details:

· Customer details

· Loan details

· Status of the loan (Approved or Rejected)

#### *Steps to Create a Customer*

1. Create a new customer.

2. Once the customer is created, create an account.

3. After creating a customer and an associated account, launch the **Spondulix** application.

**Note**: It is mandatory to create a customer before logging into the application.

#### Loan Application

This process allows the customer to apply for a loan based on few criteria. For example:

- Amount

- Duration

- Reason for loan

- Instalment pay date

- Interest rate

#### *Steps to Create a Loan Application*

1. Sign in to the **Spondulix** application.

2. Validate the customer by providing the email address and last name.

3. If the customer exists, the **Get Started** page displays.

4. View the account details and proceed to apply the loan request.

**Note**: The library project (LoanLibrary) has all the custom components that are used in this loan application.

For further reference on how to create a custom component, please refer to this [link](https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-225D4073-B2DB-4F80-B2D3-A4BAF3B9B02B.html)
