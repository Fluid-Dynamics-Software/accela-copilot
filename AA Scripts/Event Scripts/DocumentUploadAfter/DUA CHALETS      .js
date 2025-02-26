/*------------------------------------------------------------------------------------------------------/
| Program		: DUA:CHALETS-*-*-*.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 13/02/2019 12:31:32
|
/------------------------------------------------------------------------------------------------------*/

eval(getScriptText("INCLUDE_CHALET"));
//var allowedService = ["ACLA", "UCTR", "ARES", "CCHA", "MACH", "PLIC", "SCHA"];
var allowedService = ["ACLA"];
var serviceCode;

var rec = new Chalet(capId);
copySignedLicense(rec);

function copySignedLicense(rec) {
	javaLog('copySignedLicense REC: ' + rec);
	serviceCode = getServiceCode(rec);
	if(rec.hasDocumentOfType('Chalet License') && isAllowedService(rec)){
		javaLog('Service Allowed');
		var parentsArray = rec.getParents("Chalets/Chalet License/License/NCHL",Record, null, true)
		for(i in parentsArray){
			var parent = parentsArray[i];
			if(parent.getCapStatus() == "Active"){ 
				if(serviceCode != 'SCHA'){
//					copySignedContractDocument(capId, parent.getCapID(), 'Chalet License');
					rec.copySharepointDocuments_chalet(capId, parent.getCapID(), 'Chalet License');
				}else{
					chaletId = parent.getASI("LICENSEDETAILS", "chaletID");
//					copySignedContractDocumentSCHA(capId, parent.getCapID(), 'Chalet License', chaletId);
				rec.copySharepointDocuments_chalet(capId, parent.getCapID(), 'Chalet License', chaletId);
				}
			}
		}
	}
}

//function  copySignedContractDocument(fromCapID, toCapID, documentName) {
//	var capDocResult = aa.document.getDocumentListByEntity(fromCapID, "CAP");
//	if (capDocResult.getSuccess()) {
//		if (capDocResult.getOutput().size() > 0) {
//			for (index = 0; index < capDocResult.getOutput().size(); index++) {
//				var documentModel = capDocResult.getOutput().get(index);
//				if(documentModel.getDocCategory() == documentName){
//					var res = aa.document.createDocumentAssociation(documentModel, toCapID, "CAP");
//				}
//			}
//		}
//	}
//}
//
//function  copySignedContractDocumentSCHA(fromCapID, toCapID, documentName, chaletId) {
//	var capDocResult = aa.document.getDocumentListByEntity(fromCapID, "CAP");
//	if (capDocResult.getSuccess()) {
//		if (capDocResult.getOutput().size() > 0) {
//			for (index = 0; index < capDocResult.getOutput().size(); index++) {
//				var documentModel = capDocResult.getOutput().get(index);
//				if(documentModel.getDocCategory() == documentName && 
//						getAttributValue(documentModel.getEntityPK().getEntitySeq1(), 'Chalet Number') == chaletId	){
//					var res = aa.document.createDocumentAssociation(documentModel, toCapID, "CAP");
//				}
//			}
//		}
//	}
//}

function isAllowedService(rec){
	if(rec == null || rec.getCurrentWorkflowTask() == null || rec.getCurrentWorkflowTask().getTaskDescription() == null){
		return false;
	}
	if(rec.getCurrentWorkflowTask().getTaskDescription() != 'License Signature' ){
		return false;
	}
	
	for(i in allowedService){
		if(serviceCode == allowedService[i]){
			return true;
		}
	}
	
	return false;
}

function getServiceCode(rec){
	var recTypeArray = (rec.getCapType()+"").split('/');
	return recTypeArray[3];
}

function getAttributValue(pk, attName){
	var doc = aa.document.getDocumentByPK(String(pk));
	if (!doc.getSuccess()) {
		throw doc.getErrorMessage();
	}
	doc = doc.getOutput();
	if (!doc.getTemplate()) {
		return;
	}
	var template = doc.getTemplate();
	var tempForms = template.getTemplateForms();
	for (var i = 0; i < tempForms.size(); i++) {
		if (!tempForms.get(i).getSubgroups()) {
			continue;
		}
		
		var subGroups = tempForms.get(i).getSubgroups();
		for (var w = 0; w < subGroups.size(); w++) {
			if (!subGroups.get(w).getFields()) {
				continue;
			}
	
			var fields = subGroups.get(w).getFields();
			for (var x = 0; x < fields.size(); x++) {
				var field = fields.get(x);
				var fieldName = field.getCheckboxDesc();
				if(attName == fieldName){
					aa.print(fieldName + ' = ' + field.getDefaultValue());
					return field.getDefaultValue();
				}
			}
		}
	}
	return "";
}