/*------------------------------------------------------------------------------------------------------/
| Rule 			: 2090:PLOTMARKET_ASA_UPDATEDBYAPPLICANT V2.1.0
| Rule 			: 2138:PLTMRKT_ASA_HANDLE_SENDBACKSUBMIT V5.2.0
| Program		: ASA.BRE:PLOTSMARKETS/~/~/~
| Event			: ApplicationSubmitAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: SALAHA
| Published at	: 17/12/2020 12:53:39
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: PLOTMARKET_ASA_UPDATEDBYAPPLICANT
 * RULE ID: 2090
 * RULE VERSION: 2.1.0
 */
if ( this.isPublicUser()){
CTX.RULEID =2090;
/** BRE GENERATED SCRIPT*/
if(this.recordAPI.getCapClass()=="EDITABLE"){
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.recordAPI.setCapClass(\"COMPLETE\");","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Update Record Status
		this.executeAction('UPDATERECORDSTATUS',{"Status":"\"Updated by Applicant\"","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}
}

/**
 * RULE NAME: PLTMRKT_ASA_HANDLE_SENDBACKSUBMIT
 * RULE ID: 2138
 * RULE VERSION: 5.2.0
 */
CTX.RULEID =2138;
/** BRE GENERATED SCRIPT*/
if(this.recordAPI.isTaskActive('Violation Process')==false&&this.recordAPI.getCapStatus()=='Waiting on Applicant'){
		//execute Activate Task
		this.executeAction('ACTIVATETASK',{"TaskName":"'Initial Review'","DeactivateCurrent":true,"STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Update Record Status
		this.executeAction('UPDATERECORDSTATUS',{"Status":"'Updated by Applicant'","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}
if(this.recordAPI.isTaskActive('Violation Process')==true&&this.recordAPI.getCapStatus()=='Pending Violations'){
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"//this.recordAPI.updateTaskAndHandleDisposition('Violation Process', 'Violations Solved', ''); this is to activate HOS Review","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}