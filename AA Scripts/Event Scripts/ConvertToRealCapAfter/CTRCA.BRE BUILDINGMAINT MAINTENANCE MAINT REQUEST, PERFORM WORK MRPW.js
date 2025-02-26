/*------------------------------------------------------------------------------------------------------/
| Rule 			: 858:MRPW_CTRCA_CALCULATE_PRICESES V1.2.0
| Program		: CTRCA.BRE:BUILDINGMAINT/MAINTENANCE/MAINT REQUEST, PERFORM WORK/MRPW
| Event			: ConvertToRealCAPAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: KBAYOQ
| Published at	: 18/12/2018 13:11:41
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: MRPW_CTRCA_CALCULATE_PRICESES
 * RULE ID: 858
 * RULE VERSION: 1.2.0
 */
CTX.RULEID =858;
/** BRE GENERATED SCRIPT*/
//execute Declare Variable IWOASIT
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getASIT(\"INITIAL WORK ORDER DETAILS\")","RuntineVarName":"IWOASIT","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable ParentBUMARec
this.executeAction('DECLAREVAR',{"Value":"new Record(this.Record.ASI['contractid'])","RuntineVarName":"ParentBUMARec","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable ParentBMCORec
this.executeAction('DECLAREVAR',{"Value":"this.Runtime['ParentBUMARec'].getParents(\"BuildingMaint/Maintenance/Prepare Tender/BMCO\",Record,\"R\",false)[0]","RuntineVarName":"ParentBMCORec","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable discountPercentage
this.executeAction('DECLAREVAR',{"Value":"this.Runtime['ParentBMCORec'].getASI('CONTRACT DETAILS','Discount Percentage','')","RuntineVarName":"discountPercentage","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Declare Variable sumTotalPrice
this.executeAction('DECLAREVAR',{"Value":"0","RuntineVarName":"sumTotalPrice","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
for(this.Runtime['I']=0;this.Runtime['IWOASIT'].length>this.Runtime['I'];this.Runtime['I']=this.Runtime['I']+1){
	//execute Run EMSE
	this.executeAction('RUNEMSE',{"script":"this.Runtime['sumTotalPrice'] += parseFloat(this.Runtime['IWOASIT'][this.Runtime['I']]['Total Price'])","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
}
//execute Update ASI
this.executeAction('UPDATEASI',{"FieldName":"INITIAL WORK ORDER DETAILS::Discount Percentage","Value":"this.Runtime['discountPercentage']","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Update ASI
this.executeAction('UPDATEASI',{"FieldName":"INITIAL WORK ORDER DETAILS::Total Price before discount","Value":"this.Runtime['sumTotalPrice']","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Update ASI
this.executeAction('UPDATEASI',{"FieldName":"INITIAL WORK ORDER DETAILS::Discount Amount","Value":"parseFloat(this.Runtime['sumTotalPrice'])*(parseFloat(this.Runtime['discountPercentage'])/100)","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Update ASI
this.executeAction('UPDATEASI',{"FieldName":"INITIAL WORK ORDER DETAILS::Final Price","Value":"parseFloat(this.Runtime['sumTotalPrice'])-(parseFloat(this.Runtime['sumTotalPrice'])*(parseFloat(this.Runtime['discountPercentage'])/100))","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Update ASI
this.executeAction('UPDATEASI',{"FieldName":"FINAL WORK ORDER DETAILS::Discount Percentage","Value":"this.Runtime['discountPercentage']","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});