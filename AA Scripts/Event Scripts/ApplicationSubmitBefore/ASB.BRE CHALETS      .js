/*------------------------------------------------------------------------------------------------------/
| Rule 			: 1311:CHALET_ASB_AGENCY V5.0.0
| Program		: ASB.BRE:CHALETS/~/~/~
| Event			: ApplicationSubmitBefore
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: MHASHAIKEH
| Published at	: 22/03/2019 00:38:07
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: CHALET_ASB_AGENCY
 * RULE ID: 1311
 * RULE VERSION: 5.0.0
 */
if ( !this.isPublicUser()){
CTX.RULEID =1311;
/** BRE GENERATED SCRIPT*/
//execute Declare Variable chaletObj
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance(\"INCLUDE_CHALET\",\"Chalet\")","RuntineVarName":"chaletObj","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable licenseNumber
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getASI(\"APPLICATIONDETAILS\", \"licenseNumber\", \"\")","RuntineVarName":"licenseNumber","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable parentRec
this.executeAction('DECLAREVAR',{"Value":"new Record(this.Runtime['licenseNumber'])","RuntineVarName":"parentRec","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable errorMessage
this.executeAction('DECLAREVAR',{"Value":"this.Runtime['chaletObj'].validateParentHasViolation(this.Runtime['parentRec']);","RuntineVarName":"errorMessage","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Debug something
this.executeAction('DEBUG',{"message":"this.Runtime.errorMessage","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
if(this.Runtime['errorMessage']!=null&&this.Runtime['errorMessage']!=''){
		this.cancel(this.Runtime['errorMessage']);
	}
	else{
	}
}