/*------------------------------------------------------------------------------------------------------/
| Rule 			: 759:MOF_SUBMITTAL_NOTIFICATION V2.1.0
| Rule 			: 1837:CTRCA_GLOBAL_LINK_LICENSE V1.3.0
| Rule 			: 2296:CTRCA_GLOBAL_SETDUEDATETOMORROW V1.1.0
| Program		: CTRCA.BRE:~/~/~/~
| Event			: ConvertToRealCAPAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: MHASHAIKEH
| Published at	: 10/09/2020 13:19:18
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: MOF_SUBMITTAL_NOTIFICATION
 * RULE ID: 759
 * RULE VERSION: 2.1.0
 */
if ( this.isPublicUser()){
CTX.RULEID =759;
/** BRE GENERATED SCRIPT*/
//execute Declare Variable
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance('INCLUDE_GLOBALNOTIFICATIONS','GlobalNotifications')","RuntineVarName":"gNotification","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.Runtime['gNotification'].sendNotification4ACA(\"MOF_SUBMITTAL\");","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
}

/**
 * RULE NAME: CTRCA_GLOBAL_LINK_LICENSE
 * RULE ID: 1837
 * RULE VERSION: 1.3.0
 */
CTX.RULEID =1837;
/** BRE GENERATED SCRIPT*/
//execute currentUserID
this.executeAction('DECLAREVAR',{"Value":"\"\"","RuntineVarName":"currentUserID","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.Runtime['currentUserID'] =  aa.env.getValue(\"CurrentUserID\");","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getPublicUserLicense(this.Runtime['currentUserID'])","RuntineVarName":"hasLicense","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
if(this.Runtime['hasLicense']!=null){
		//execute Link License
		this.executeAction('RUNEMSE',{"script":"this.recordAPI.addLicense(this.Runtime['hasLicense'].getStateLicense())","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}
//execute ConditionLessThan18
this.executeAction('RUNEMSE',{"script":"this.recordAPI.conditionAgeLessThanEighteen()","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});


/**
 * RULE NAME: CTRCA_GLOBAL_SETDUEDATETOMORROW
 * RULE ID: 2296
 * RULE VERSION: 1.1.0
 */
if ( this.isPublicUser()){
CTX.RULEID =2296;
/** BRE GENERATED SCRIPT*/
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.recordAPI.setTaskDueDateToTomorrow();","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
}