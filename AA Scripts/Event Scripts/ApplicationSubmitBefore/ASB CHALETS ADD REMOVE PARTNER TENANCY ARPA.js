/*------------------------------------------------------------------------------------------------------/
| Program		: ASB:CHALETS/ADD REMOVE PARTNER/TENANCY/ARPA.js
| Event			: ApplicationSubmitBefore
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ISRAA
| Created at	: 22/11/2017 16:33:44
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_RECORD"));
try{
	if (!publicUser) {
		var licenseNumber = AInfo["License Number"];
		var pcapId= aa.cap.getCapID(licenseNumber).getOutput();
		
		if (pcapId==null){
			throw aa.messageResources
			.getLocalMessage("ARPA_LICENSE_NUMBER_VALIDATION");
		}
		
		var pCapType= aa.cap.getCap(pcapId).getOutput().getCapType();
		if (pCapType=="Chalets/Chalet License/License/NCHL"){
			// check balance
			if (getBal(pcapId)> 0 ){
				throw aa.messageResources
				.getLocalMessage("MMCT.Error.Validate.Balance");
			}
			
			//check violations, get the lock conditions
			var pCapConditions=getParentConditions(pcapId);
			if (pCapConditions!=null && pCapConditions.length){
				throw aa.messageResources
				.getLocalMessage("ARPA_COMPLETE_VIOLATIONS_PROCESS");
			}
								
   }else
	   {
	   // cap type is not NCHL , it is not valid license
	   throw aa.messageResources
		.getLocalMessage("ARPA_LICENSE_NUMBER_VALIDATION");
	   
	   }
}
	
	// check if the civil id in Add partners is match with civil id in remove partner
	var asitRemove=Record.getASITableBefore("PARTNERS TO BE REMOVED");
	var asitAdd=Record.getASITableBefore("PARTNERS TO BE ADDED");
//	aa.debug("asitRemove is : ",asitRemove.length);
//	aa.debug("asitAdd is : ",asitAdd.length);
	var IsMatch=false;			
		for (xx in asitAdd){
			var row1=asitAdd[xx];
			var colVal1 = row1["Civil ID"];
			for (rowIndex in asitRemove){
				var row=asitRemove[rowIndex];
				var colVal = row["Civil ID"];
				if (String(colVal)== String(colVal1)){
					IsMatch=true;
				    break;
				}
		     }
			
				if (IsMatch){
					throw aa.messageResources.getLocalMessage('ARPA_CIVIL_ID_TO_BE_ADDED_VALIDATION');
				}
		   
		}
	
}
	

catch (e) {
	cancel = true;
	showMessage = true;
	comment(e);
}

function getBal (pcapId){
	var capDetailScriptModel = aa.cap.getCapDetail(pcapId)
	.getOutput();
if (capDetailScriptModel != null) {
	var capDetail = capDetailScriptModel.getCapDetailModel();
    return capDetail.getBalance();
}else
	{
	return 0;
	}
}

function getParentConditions(pcapId){
	var condResult = aa.capCondition.getCapConditions(pcapId);
	var resultArray = new Array();
	if (condResult.getSuccess()){
				var capConds = condResult.getOutput();

		for (cc in capConds) {
			var thisCond = capConds[cc];
			var cImpact = thisCond.getImpactCode();
			if (cImpact!="Lock") continue;
			var cStatus = thisCond.getConditionStatus();
			var cDesc = thisCond.getConditionDescription();
			var cType = thisCond.getConditionType();
			var cComment = thisCond.getConditionComment();
			var cExpireDate = thisCond.getExpireDate();

			
				var r = new condMatchObj;
				r.objType = "Record";
				r.object = thisCond;
				r.status = cStatus;
				r.type = cType;
				r.impact = cImpact;
				r.description = cDesc;
				r.comment = cComment;
				r.expireDate = cExpireDate;
				
				var lang = "en_US";
				var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
				if (bizDomainModel4Lang.getSuccess())
					lang = bizDomainModel4Lang.getOutput().getDescription();

				var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

				r.arObject = langCond;
				r.arDescription = langCond.getResConditionDescription();
				r.arComment = langCond.getResConditionComment();

				resultArray.push(r);
			
		       }
		
		}
		return resultArray;
}

function condMatchObj() {
	this.objType = null;
	this.object = null;
	this.contactObj = null;
	this.addressObj = null;
	this.licenseObj = null;
	this.parcelObj = null;
	this.status = null;
	this.type = null;
	this.impact = null;
	this.description = null;
	this.comment = null;
	this.arObject = null;
	this.arDescription = null;
	this.arComment = null;
	this.expireDate = null;
}