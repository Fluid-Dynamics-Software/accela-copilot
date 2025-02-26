/*------------------------------------------------------------------------------------------------------/
| Rule 			: 2118:MRPW_ASIUB_VALIDATE_BUDGET V1.3.0
| Program		: ASIUB.BRE:BUILDINGMAINT/MAINTENANCE/MAINT REQUEST, PERFORM WORK/MRPW
| Event			: ApplicationSpecificInfoUpdateBefore
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: MNASSAR
| Published at	: 21/06/2020 11:38:48
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: MRPW_ASIUB_VALIDATE_BUDGET
 * RULE ID: 2118
 * RULE VERSION: 1.3.0
 */
CTX.RULEID =2118;
/** BRE GENERATED SCRIPT*/
//execute mrpw
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance(\"INCLUDE_MRPW\",\"MRPW\")","RuntineVarName":"mrpw","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute retMessage
this.executeAction('DECLAREVAR',{"Value":"\"\"","RuntineVarName":"retMessage","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.Runtime['retMessage'] = this.Runtime.mrpw.validateInitialWOASIT(0)","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
if(this.Runtime['retMessage']!=""){
		this.cancel(this.Runtime['retMessage']);
	}
	else{
	}