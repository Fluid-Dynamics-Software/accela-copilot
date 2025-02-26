/*------------------------------------------------------------------------------------------------------/
| Program		: ASB:EXPROPRIATE/TO WHOM IT MAY CONCERN/PLOT/EXTW.js
| Event			: ApplicationSubmitBefore
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MKABEEL
| Created at	: 22/07/2018 22:10:09
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_EXTW"));
var appSpecificInfoModels = aa.env.getValue('AppSpecificInfoModels');
var appSpecificTableGroupModel = aa.env.getValue('AppSpecificTableGroupModel')
try{
	if (capId) {
		var extw = new EXTW(capId);
		extw.onApplicationSubmitBefore();
	} else {
		var applicantGender = getApplicationSpecificInfo('applicantGender');
		var familyStatus = getApplicationSpecificInfo('familyStatus');
		  java.lang.System.out.println("===EMSE Debug Out==> applicantGender" + applicantGender + ", " + familyStatus);
		if (EXTW.enum.applicationGenderValues.MALE.equals(applicantGender)
				&& EXTW.enum.familyStatusValues.MARRIED.equals(familyStatus)
				&& !isWivesInformationExists()) {
			throw Record.translate('EXTW_WIVES_INFO_REQUIRED');
		}
	}
} catch (e) {
	cancel = true;
	showMessage = true;
	comment(e);
}

function getApplicationSpecificInfo(fieldName) {
	java.lang.System.out.println("===fieldName==> " + fieldName)
	var asiValue = '';
	for (var i = 0 ; i < appSpecificInfoModels.length; i++) {
		java.lang.System.out.println("===EMSE Debug Out==> " + fieldName + ", " + appSpecificInfoModels[i].checkboxDesc + ", " + appSpecificInfoModels[i].checklistComment);
		if (appSpecificInfoModels[i].checkboxDesc == fieldName){
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
		if (asitObj.getTableName().equals(EXTW.ASIT.wifeInformation.TableName)) {
			if (!asitObj.rowIndex.isEmpty()) {
				isWivesInformationExists = true;
				break;
			}
		}
	}

	return isWivesInformationExists;
}