/*------------------------------------------------------------------------------------------------------/
| Rule 			: 689:GL_ASA_Updated_By_Applicant V5.2.0
| Rule 			: 727:MOF_SUBMITTAL_NOTIFICATION V8.0.0
| Rule 			: 2297:ASA_GLOBAL_SETDUEDATETOMORROW V2.0.0
| Program		: ASA.BRE:~/~/~/~
| Event			: ApplicationSubmitAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: SALAHA
| Published at	: 10/04/2023 14:39:03
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: GL_ASA_Updated_By_Applicant
 * RULE ID: 689
 * RULE VERSION: 5.2.0
 */
CTX.RULEID =689;
/** BRE GENERATED SCRIPT*/
//execute Declare Variable
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getCapModel()","RuntineVarName":"capModel","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable
this.executeAction('DECLAREVAR',{"Value":"''","RuntineVarName":"taskName","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"var cap = this.Runtime['capModel'];\nvar wfTaskDetails = cap.getQUD4();\nif(wfTaskDetails != null && wfTaskDetails != \"\")\n{   var res = wfTaskDetails.split(\"::\");  \n if(res.length == 2){ \n   this.Runtime['taskName'] = res[0];  \n }\n}","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
if((this.recordAPI.getCapStatus()=='Waiting on Applicant'||this.recordAPI.getCapStatus()!="Pending Violations")&&this.Runtime['taskName']!=''&&this.recordAPI.getServiceCode()!="MRPW"){
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"var cap = this.Runtime['capModel'];cap.setCapClass(\"COMPLETE\");aa.cap.editCapByPK(cap);this.recordAPI.updateStatus('Updated by Applicant');","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		if(this.recordAPI.getServiceCode()!='ARES'){
				//execute Debug something
				this.executeAction('DEBUG',{"message":"'Current task: ' + this.Runtime['taskName']","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
				//execute Activate Task
				this.executeAction('ACTIVATETASK',{"TaskName":"this.Runtime['taskName']","DeactivateCurrent":false,"STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
			}
			else{
			}
	}
	else{
	}


/**
 * RULE NAME: MOF_SUBMITTAL_NOTIFICATION
 * RULE ID: 727
 * RULE VERSION: 8.0.0
 */
if ( !this.isPublicUser()){
CTX.RULEID =727;
/** BRE GENERATED SCRIPT*/
//execute Declare Variable
this.executeAction('DECLAREVAR',{"Value":"false","RuntineVarName":"isPublic","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.Runtime['isPublic'] = publicUser;","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
if(this.Runtime['isPublic']==false){
		//execute Declare Variable
		this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance('INCLUDE_GLOBALNOTIFICATIONS','GlobalNotifications')","RuntineVarName":"gNotification","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.Runtime['gNotification'].sendNotification(\"MOF_SUBMITTAL\");","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}
}

/**
 * RULE NAME: ASA_GLOBAL_SETDUEDATETOMORROW
 * RULE ID: 2297
 * RULE VERSION: 2.0.0
 */
if ( !this.isPublicUser()){
CTX.RULEID =2297;
/** BRE GENERATED SCRIPT*/
if(this.recordAPI.getCapClass()!="EDITABLE"){
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.recordAPI.setTaskDueDateToTomorrow();","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}
}