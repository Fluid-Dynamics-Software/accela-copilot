/*------------------------------------------------------------------------------------------------------/
| Rule 			: 1809:MARKET_ASA_SETAPPLICATIONNAME_AFTER_SUBMISSION V3.0.0
| Program		: ASA.BRE:PLOTSMARKETS/MARKETS/~/~
| Event			: ApplicationSubmitAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: MHASHAIKEH
| Published at	: 26/02/2020 17:45:12
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: MARKET_ASA_SETAPPLICATIONNAME_AFTER_SUBMISSION
 * RULE ID: 1809
 * RULE VERSION: 3.0.0
 */
if ( !this.isPublicUser()){
CTX.RULEID =1809;
/** BRE GENERATED SCRIPT*/
//execute Declare Variable recordObj
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance(\"INCLUDE_RECORD\",\"Record\")","RuntineVarName":"recordObj","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.Runtime['recordObj'].setApplicationNameAfterSubmission_Market();","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
}