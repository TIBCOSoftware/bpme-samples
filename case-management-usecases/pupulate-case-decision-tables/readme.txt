This BW and BPME project loads the decision tables (State Locaitons and State Rules tables) from JSON data into the respective bpm cases. 
A attach the BW project and a BPME 5.3 project to illistrate this capability. BPME 5.3 is required as the rest service that starts the pageflow 
responsible for the case creattion takes in a array parameter that did not work in pre-5.3 BPME engines.

The BPME project case)_salesServices has 2 pageflows that is triggered by the BW project. These are Import Case State Locations and Import Case State Rules. You require the 2 JSON data sets also attached in this locaiton as samples. The easiest way to get these is to open the dev environment database and copy the json from the case tables. 
