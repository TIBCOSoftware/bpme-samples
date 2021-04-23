### Create and Deploy an Order Case Application project

This sample will be using the Organisation Model Project and Business Object model Project in the How-To-samples folder. The project shows an Order case Application which shows how to fetch user details in a form and create a new Order Case for it. Using the ‘UpdateOrder’ Case Action you may update the Case details and Case States.

Before you start working with this sample, 
>you can become familiar with TIBCO Business Studio by completing your First BPM Project tutorial here: https://docs.tibco.com/pub/bpme/5.0.0/doc/html/GUID-FFE072E2-7BEA-4834-BA17-23F6BCAD320A.html
> and try out the Organisation Model Project and Business Object model Project in the How-To-samples folder
 

Step 1: Create a BPM Process Project

![ ](import-screenshots/1.png)

![ ](import-screenshots/2.png)

Step 2: Create Local and Global Data Fields

![ ](import-screenshots/3.png)

For Local Data - select BOM type and map it to Order (BOM created in Object model Project in the How-To-samples folder)

![ ](import-screenshots/4.png)     ![ ](import-screenshots/5.png)

For Global Data - select Case Class Reference and map it to Case Class type: Order

![ ](import-screenshots/6.png)

Check Documentation for further details:https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-9F7A9C03-2F47-4269-81D2-883DA14DA3B6.html
https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-7708D645-786B-4E4A-8A1D-2AEF2C43343C.html
 
Step 3: Create a Participant
Create a ‘CustomerServiceRepresentative’ Participant which is mapped to External Reference the Customer Service Group of the Organisation Model Project.

Doc reference: https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-301FD6F2-0769-4E10-892C-5281B671B160.html

