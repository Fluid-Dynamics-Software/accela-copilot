/*------------------------------------------------------------------------------------------------------/
| Program		: DUA:*-*-*-*.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: YTITI
| Created at	: 08/12/2018 15:21:05
|
/------------------------------------------------------------------------------------------------------*/
java.lang.System.out.println("=== DUA:*-*-*-*: Started!"); 
eval(getScriptText("INCLUDE_RECORD"));

if (typeof publicUser == "undefined" || !publicUser) {  // coming from AV
	setAVUploadedDocumentToApproved();
	updateEXTUploadedDocWithApprovedStatus();
}

var rec = new Record(capId);
updateDocumentAsi(rec);

function setAVUploadedDocumentToApproved() {
	var docList = aa.env.getValue("DocumentModelList");
	try{
		for (var q = 0; q < docList.size(); q++) {
			var docSeq = docList.get(q).getEntityPK().getEntitySeq1();
			var doc = aa.document.getDocumentByPK(String(docSeq));
			if (!doc.getSuccess()) {
				java.lang.System.out.println("ERROR updating Documents: "+ doc.getErrorMessage());
			}
			doc = doc.getOutput();
			doc.setDocStatus("Approved");
			aa.document.updateDocument(doc);
			java.lang.System.out.println("Documents updated to Approved!");
		}		
	}catch(err){
		java.lang.System.out.println("Document Status Update Error in DUA: " + err);
	}

}

function updateEXTUploadedDocWithApprovedStatus(){
	java.lang.System.out.println("about to start updateEXTUploadedDocWithApprovedStatus()");
	var docs = getDocumentListOfAllType(capId);
	var justUploadedDesc = "Just Uploaded";
	
	for ( var d in docs) {
		var row = {};
		var docObj = docs[d];
		var doc = docObj.document;
		var filename = doc.getFileName();
		var comments = doc.getSocComment();
		var desc = String(doc.getDocDescription()).trim();
		java.lang.System.out.println("Document desc: " + desc);
		
		if (desc.indexOf(justUploadedDesc)==0){
			var arabicFileName = desc.replace(justUploadedDesc, "");
			arabicFileName = decodeURIComponent(arabicFileName);
			java.lang.System.out.println("Document about to update: " + filename);
			doc.setDocStatus("Approved");
			//doc.setDocDescription("Latest");
			java.lang.System.out.println("about to replace filename: " + filename + ", with: " + arabicFileName);
			doc.setDocDescription("");
			if (arabicFileName){
				doc.setFileName(arabicFileName);
				doc.setDocName(arabicFileName);
			}
			aa.document.updateDocument(doc);
		}
	}	
}

function getDocumentListOfAllType(recCap, docIDs) {
	recCap = String(recCap).split('-');

	var sql = " SELECT DOC_SEQ_NBR, DOC_CATEGORY, DOC_NAME, FILE_UPLOAD_BY, FILE_UPLOAD_DATE, DOC_STATUS_DATE, DOC_STATUS, DOC_COMMENT, URL FROM BDOCUMENT ";
	sql += " WHERE ";
	sql += " SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "' ";
	sql += " AND B1_PER_ID1 = '" + recCap[0] + "'";
	sql += " AND B1_PER_ID2 = '" + recCap[1] + "'";
	sql += " AND B1_PER_ID3 = '" + recCap[2] + "'";
	sql += " AND DOC_CATEGORY <> 'Inspection Result' "
	java.lang.System.out.println("=== EXT_CUSTOM_HANDLEEVENTS: docIDs ==> " + docIDs);
	if (docIDs){
		docIDs = String(docIDs).trim();
		if (docIDs.length){
			sql += " AND DOC_SEQ_NBR IN (" + docIDs + ") ";			
		}
	}
	sql += " ORDER BY DOC_CATEGORY ASC ";
	java.lang.System.out.println("=== EXT_CUSTOM_HANDLEEVENTS: sql ==> " + sql);
	var aadba = aa.proxyInvoker.newInstance("com.accela.aa.datautil.AADBAccessor").getOutput();
	var aadba = aadba.getInstance();
	var result = aadba.select(sql, null);

	var docListArray = new Array();
	if (result.size() > 0) {
		for (i = 0; i < result.size(); i++) {
			var documentModel = aa.document.getDocumentByPK(result.get(i)[0]).getOutput();
			docListArray.push(
				{
					document: documentModel, 
					"DOC_CATEGORY": result.get(i)[1],
					"DOC_NAME": result.get(i)[2],
					"FILE_UPLOADED_BY": result.get(i)[3],
					"FILE_UPLOAD_DATE": result.get(i)[4],
					"DOC_STATUS_DATE": result.get(i)[5],
					"DOC_STATUS": result.get(i)[6],
					"DOC_COMMENT": result.get(i)[7],
					"URL": result.get(i)[8]
				});
		}
	}

	return docListArray;
}

function updateDocumentAsi(rec) {
	var docList = aa.env.getValue("DocumentModelList");
	for (var q = 0; q < docList.size(); q++) {
		var docSeq = docList.get(q).getEntityPK().getEntitySeq1();
		updateDocumentAsiFromRecord(rec, docSeq);
	}
}

function updateDocumentAsiFromRecord(rec, docSeq) {
	var group = rec.getCapType().getGroup();
	
	var genericTemplate = aa.proxyInvoker.newInstance("com.accela.aa.template.GenericTemplateBusiness").getOutput();
	var doc = aa.document.getDocumentByPK(String(docSeq));
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
				if (group == "PlotsMarkets") {
					fieldName = replaceAll(fieldName, "(", "");
					fieldName = replaceAll(fieldName, ")", "");
					//fieldName = toCamelCase(fieldName);
				}
				fieldName = toCamelCase(fieldName);
				field.setDefaultValue(rec.getASI("", fieldName));
				
			}
		}
	}
	genericTemplate.updateTemplate(template.getEntityPKModel(), template);
}

function toCamelCase(str) {
	str = String(str);
	return str.split(' ').map(function(word, index) {

		if (index == 0) {
			return word.toLowerCase();
		}

		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}).join('');
}

function replaceAll(str, search, replacement) {
	str = String(str);
	str = str.split(search);
    return str.join(replacement);
}