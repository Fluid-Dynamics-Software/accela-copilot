/*------------------------------------------------------------------------------------------------------/
| Rule 			: 718:RMCT_ASA_COPY_ASSETS V3.1.0
| Rule 			: 726:RMCT_ASA_COPY_CONTACT_AA V3.1.0
| Program		: ASA.BRE:PLOTSMARKETS/MARKETS/RENEW MARKET CONTRACT/RMCT
| Event			: ApplicationSubmitAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: MHASHAIKEH
| Published at	: 15/09/2020 11:04:42
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: RMCT_ASA_COPY_ASSETS
 * RULE ID: 718
 * RULE VERSION: 3.1.0
 */
CTX.RULEID =718;
/** BRE GENERATED SCRIPT*/
if(this.recordAPI.getCapClass()!="EDITABLE"){
		//execute Copy Assets
		this.executeAction('COPYASSETS',{"RecordID":"this.Record.ASI['currentContractLicenseNumber']","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}


/**
 * RULE NAME: RMCT_ASA_COPY_CONTACT_AA
 * RULE ID: 726
 * RULE VERSION: 3.1.0
 */
CTX.RULEID =726;
/** BRE GENERATED SCRIPT*/
if(this.recordAPI.getCapClass()!="EDITABLE"){
		//execute Declare Variable rmctObj
		this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance(\"INCLUDE_RMCT\",\"RMCT\")","RuntineVarName":"rmctObj","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute parent
		this.executeAction('DECLAREVAR',{"Value":"new Record(this.Record.ASI['currentContractLicenseNumber'])","RuntineVarName":"parent","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.Runtime['rmctObj'].copyDetailsForNewANMCs(this.recordAPI, this.Runtime.parent);","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Declare Variable currentUserID
		this.executeAction('DECLAREVAR',{"Value":"aa.env.getValue(\"CurrentUserID\")","RuntineVarName":"currentUserID","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Declare Variable hasLicense
		this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getPublicUserLicense(this.Runtime['currentUserID'])","RuntineVarName":"hasLicense","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		if(this.Runtime['hasLicense']==null){
				//execute copyContacts
				this.executeAction('RUNEMSE',{"script":"this.recordAPI.copyContacts(this.Runtime.parent)","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
			}
			else{
			}
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.recordAPI.addParent(this.Record.ASI['currentContractLicenseNumber'],null);","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}