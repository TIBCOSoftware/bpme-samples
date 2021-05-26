## How to create and deploy an Organization Model, Business Object Model and a Case Application projects.

Let's take a look at all of these projects one by one:

# Organisation Model:

TIBCO BPM Enterprise provides comprehensive Work Management capabilities. Workforce management enables you to distribute and allocate work to the right resource, in the most effective way. 
It supports flexible and independent organizational models that support the complex relationships between departments, people, systems, roles, virtual
teams, and geographies in your enterprise.

The Organization Modeler allows a developer to create the organizational structure that underpins a Process. The Organization Model consists of elements that represent the organization’s entities,their attributes and the relationships between them.
An Organization Unit represents resources that are associated together because they fulfill a business need within the organization. For example, an Organization Unit can be a department, project or location. An Organization Unit is made up of Positions. A Position represents a set of responsibilities for a job of work to be performed in an Organization Unit. An Organization Unit can have many Positions.

Doc Reference: https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-D941356A-06A8-4293-92C5-A5EC07E27161.html

Refer to Organisation Model project and the related readMe to create and deploy an organization model.

# Business Object Model (BOM):

The BOM or the Case data is business data that is centrally managed by BPM Enterprise and can therefore be accessed and updated by multiple BPM process applications.
Business data is structured data that contains information about real-world entities or business concepts that an organization needs to manipulate, for example: Customer, Order, Orderline, Claim or Policy.
Case data can be used to find in-progress work items and/or process instances that are associated with a particular case. Case data can also be updated in an ad-hoc manner, independent of any enterprise process update - for example, a customer reporting a change of address.

When you create a Business Data Project, the palette in TIBCO Business Studio contains the
Global Data components, as well as all the components available when creating a local data object
model.
The Global Data components are:
Case class
Case Identifier attribute
Case State attribute

A case class is a template for a case object. Case classes must have a single case identifier attribute.
You can create a case object from a case class from within any BPM process application that references that case class.
Unlike local objects, which exist only over the lifespan of a process, case objects are persisted - each case object is stored in the case data tables that represent the case model from which the case object was instantiated.

Doc Reference Business data: https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-BCD75668-27B9-4FD1-ABBA-AB3BA94B8B50.html
Doc Reference Case data: https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-014A963F-5CC8-4442-8009-E5F3B79F53AA.html

Refer to Business Object Model project and the related readMe to create Case Data.

# Process Model:
TIBCO Business Studio™ - BPM Edition is used to model your business processes. A process models the business process, and forms that are used to collect user input in a user task within a business process.
Here in this sample we have taken a Order Case scenario, the user task captures Case details and then the  service task creates case object.
This Process project refers to the BOM's global data created in Business Object Model.
Also the Participant assigned to the user tasks is referring to the Organisation Model mentioned abive.

Refer to the Case Application Project to create and deploy a Case Application. 

Note: While deploying the projects they should be deployed in the below order:
- Orgnanisation Model .rasc
- Business Object Model .rasc
- Process model .rasc

>Before you start working with this sample, you can become familiar with TIBCO Business Studio by completing your First BPM Project tutorial here: https://docs.tibco.com/pub/bpme/5.0.0/doc/html/GUID-FFE072E2-7BEA-4834-BA17-23F6BCAD320A.html
Doc reference for Using Organisation Model: https://docs.tibco.com/pub/business-studio-bpm-edition/5.0.0/doc/html/GUID-D941356A-06A8-4293-92C5-A5EC07E27161.html

