/*------------------------------------------------------------------------------------------------------/
| Rule 			: 2124:MRPW_ASB_VALIDATE_IWO_STATUS V1.0.0
| Program		: ASB.BRE:BUILDINGMAINT/MAINTENANCE/MAINT REQUEST, PERFORM WORK/MRPW
| Event			: ApplicationSubmitBefore
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: MNASSAR
| Published at	: 21/06/2020 23:04:05
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: MRPW_ASB_VALIDATE_IWO_STATUS
 * RULE ID: 2124
 * RULE VERSION: 1.0.0
 */
CTX.RULEID =2124;
/** BRE GENERATED SCRIPT*/
//execute mrpw
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance(\"INCLUDE_MRPW\",\"MRPW\")","RuntineVarName":"mrpw","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute retMessage
this.executeAction('DECLAREVAR',{"Value":"\"\"","RuntineVarName":"retMessage","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.Runtime['retMessage'] = this.Runtime.mrpw.validateInitialWOASIT_ACA()","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
if(this.Runtime['retMessage']!=""){
		this.cancel(this.Runtime['retMessage']);
	}
	else{
	}