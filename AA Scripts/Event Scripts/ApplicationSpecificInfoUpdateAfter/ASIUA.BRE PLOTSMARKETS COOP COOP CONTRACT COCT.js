/*------------------------------------------------------------------------------------------------------/
| Rule 			: 2111:COCT_ASIUA_FILL_ASIS V4.8.0
| Program		: ASIUA.BRE:PLOTSMARKETS/COOP/COOP CONTRACT/COCT
| Event			: ApplicationSpecificInfoUpdateAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: SALAHA
| Published at	: 03/04/2022 13:29:41
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: COCT_ASIUA_FILL_ASIS
 * RULE ID: 2111
 * RULE VERSION: 4.8.0
 */
if ( !this.isPublicUser()){
CTX.RULEID =2111;
/** BRE GENERATED SCRIPT*/
//execute Declare Variable coctObj
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance(\"INCLUDE_COCT\",\"COCT\")","RuntineVarName":"coctObj","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Update ASIs
this.executeAction('RUNEMSE',{"script":"this.Runtime['coctObj'].fillSitesASIs();","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute totalRentFees
this.executeAction('DECLAREVAR',{"Value":"0","RuntineVarName":"totalRentFees","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
for(this.Runtime['I']=0;this.Runtime['I']<this.Record.ASI['contractDurationYears'];this.Runtime['I']=this.Runtime['I']+1){
	//execute annualRentFees
	this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance(\"INCLUDE_COOP\", \"Coop\").calculateAnnualRentFees(this.Runtime['I'])","RuntineVarName":"annualRentFees","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	if(this.Runtime['I']==0){
			//execute update total
			this.executeAction('RUNEMSE',{"script":"this.Runtime['totalRentFees'] = this.Runtime['annualRentFees']","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
			//execute set annual rent fees
			this.executeAction('UPDATEASI',{"FieldName":"CONTRACTDETAILS::annualRentingFees","Value":"this.Runtime['annualRentFees']","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		}
		else{
		}
	if(this.Runtime['I']==1){
			//execute set annual rent fees2
			this.executeAction('UPDATEASI',{"FieldName":"CONTRACTDETAILS::annualRentingFeesSecondYear","Value":"this.Runtime['annualRentFees']","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
			if(this.Runtime['annualRentFees']!=''){
					//execute update total
					this.executeAction('RUNEMSE',{"script":"this.Runtime['totalRentFees'] = this.Runtime['totalRentFees']  + this.Runtime['annualRentFees']","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
				}
				else{
				}
		}
		else{
		}
	if(this.Runtime['I']==2){
			//execute Update ASI
			this.executeAction('UPDATEASI',{"FieldName":"CONTRACTDETAILS::annualRentingFeesThirdYear","Value":"this.Runtime['annualRentFees']","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
			if(this.Runtime['annualRentFees']!=''){
					//execute update total
					this.executeAction('RUNEMSE',{"script":"this.Runtime['totalRentFees'] = this.Runtime['totalRentFees']  + this.Runtime['annualRentFees']","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
				}
				else{
				}
		}
		else{
		}
}
//execute Update ASI
this.executeAction('UPDATEASI',{"FieldName":"CONTRACTDETAILS::totalRentingFees","Value":"parseFloat(this.Runtime['totalRentFees']).toFixed( 3 )","RuntineVarName":"UPDATEDVAR","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.Runtime['coctObj'].updateASITFeeDiffDetails()","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
}