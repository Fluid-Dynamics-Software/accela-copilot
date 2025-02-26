/*------------------------------------------------------------------------------------------------------/
| Rule 			: 720:RMCT_CTRCA_RESET_START_DATE V2.1.0
| Program		: CTRCA.BRE:PLOTSMARKETS/MARKETS/RENEW MARKET CONTRACT/RMCT
| Event			: ConvertToRealCAPAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: MHASHAIKEH
| Published at	: 03/06/2020 12:53:35
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: RMCT_CTRCA_RESET_START_DATE
 * RULE ID: 720
 * RULE VERSION: 2.1.0
 */
CTX.RULEID =720;
/** BRE GENERATED SCRIPT*/
//execute startDate
this.executeAction('UPDATEASI',{"FieldName":"CONTRACTDETAILS::contractStartDate","Value":"\"\"","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute durationYears
this.executeAction('UPDATEASI',{"FieldName":"CONTRACTDETAILS::contractDurationYears","Value":"\"\"","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});