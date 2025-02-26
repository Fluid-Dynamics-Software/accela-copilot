/*------------------------------------------------------------------------------------------------------/
| Program		: ASB:ACQUISITION/TO WHOM IT MAY CONCERN/PLOTS/AQTW.js
| Event			: ApplicationSubmitBefore
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ATARAZI
| Created at	: 20/12/2018 19:27:55
|
/------------------------------------------------------------------------------------------------------*/

var appSpecificInfoModels = aa.env.getValue('AppSpecificInfoModels');
var appSpecificTableGroupModel = aa.env.getValue('AppSpecificTableGroupModel')
try {
	if (!publicUser) {
		var applicantGender = getApplicationSpecificInfo('Applicant Gender');
		var familyStatus = getApplicationSpecificInfo('Family Status');
		var onBehalf = getApplicationSpecificInfo('onBehalf');

		java.lang.System.out.println("===EMSE Debug Out==> applicantGender" + applicantGender + ", " + familyStatus);
		if (applicantGender == "Male" && familyStatus == "Married" && !isWivesInformationExists()) {
			throw aa.messageResources.getLocalMessage('AQTW_WIVES_INFO_REQUIRED');
		}
//		if(onBehalf =="Yes"){
//
//		    var cap = aa.cap.getCap(capId).getOutput().getCapModel();
//
//		    var submittedDocList = aa.document.getDocumentListByEntity(capId, "CAP").getOutput().toArray(); 
//
//		  var isOnHalfUploaded = false;
//		 
//		  if(submittedDocList!=null){
//		  for(var i in submittedDocList){
//		    if(submittedDocList[i].getDocCategory()=="Copy of Residential Right Certificate"){
//		    	isOnHalfUploaded = true;
//		    	break;
//		    }
//		   
//		  }
//		  }
//		  
//		  if(!isOnHalfUploaded){
//		    msg += "<li>" + aa.messageResources.getLocalMessage("isOnHalfUploaded") + "</li>";
//		  }
//		  
//		  if (msg != "")
//		    {
//		      cancel = true;
//		       showMessage = true;
//		       message = aa.messageResources.getLocalMessage("uploadDocs") + msg;
//		    }
//		}
	}
} catch (e) {
	cancel = true;
	showMessage = true;
	comment(e);
}

function getApplicationSpecificInfo(fieldName) {
	java.lang.System.out.println("===fieldName==> " + fieldName)
	var asiValue = '';
	for (var i = 0; i < appSpecificInfoModels.length; i++) {
		java.lang.System.out.println("===EMSE Debug Out==> " + fieldName + ", " + appSpecificInfoModels[i].checkboxDesc + ", " + appSpecificInfoModels[i].checklistComment);
		if (appSpecificInfoModels[i].checkboxDesc == fieldName) {
			asiValue = appSpecificInfoModels[i].checklistComment;
			break;
		}
	}

	return asiValue;
}

function isWivesInformationExists() {
	var isWivesInformationExists = false
	var tablesMap = appSpecificTableGroupModel.getTablesMap();
	var iterator = tablesMap.values().iterator();
	while (iterator.hasNext()) {
		var asitObj = iterator.next();
		if (asitObj.getTableName().equals("WIFE INFORMATION")) {
			if (!asitObj.rowIndex.isEmpty()) {
				isWivesInformationExists = true;
				break;
			}
		}
	}

	return isWivesInformationExists;
}