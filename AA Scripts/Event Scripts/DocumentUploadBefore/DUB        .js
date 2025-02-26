///*------------------------------------------------------------------------------------------------------/
//| Program		: DUB:*-*-*-*.js
//| Event		: 
//|
//| Usage			: 
//| Notes			:  
//| Created by	: Mhamdi
//| Created at	: 07/05/2019 15:00:55
//|
///------------------------------------------------------------------------------------------------------*/
//try{
////logDebug("--->step1");
//var extArr = ['JPG','PNG','JPEG','GIF','BMP','PDF'];
////logDebug("--->step2");
//var allowedExtensions = aa.util.newHashMap();
////logDebug("--->step3");
//allowedExtensions.put('Copy of IDs',['JPG','PNG','JPEG','GIF','BMP','PDF']);
//
////logDebug("--->step4");
//var docValidation = validateAttachments();
//if(docValidation  && docValidation!= null){
// cancel = true;
//        showMessage = true;
//        comment("Invalid Extension------------------");
//}
//function validateAttachments() 
//{
//    var isVlidate = true;
//	var documentModels = aa.env.getValue("DocumentModelList");
//	//logDebug("------------->1"+documentModels.length);
//    var messages = "";
//    for (i = 0; i < documentModels.length; i++) 
//    {
//        var documentModel = documentModels[i];
//        var docType = "";
//        var documentTempType = documentModel.getDocCategory();
//
//        var fileName = documentModel.getFileName();
//		//logDebug("------------->2"+fileName);
//
//        var dotIndex = fileName.lastIndexOf(".");
//        if (dotIndex >= 0 && dotIndex < fileName.length() - 1) 
//        {
//            docType = fileName.substring(dotIndex + 1);
//        }
//         	//	//logDebug("------------->3"+documentTempType+"     "+docType);
//
//        if (!docType.trim().equals("") && allowedExtensions.containsKey(documentTempType))
//        {
//			
//			var extensionNames = allowedExtensions.get(documentTempType);
//            if(extensionNames.indexOf(String(docType).toUpperCase()) == -1)
//            {
//                messages += docType + ";";
//
//            }
//        }
//
//    }
//	         		//logDebug("------------->4  "+messages);
//
//    if(messages != "")
//    {
//        cancel = true;
//        showMessage = true;
//        comment("Invalid Extension------------------");
//
//       return validtionMsg
//    }
//
//    return null;
//}
//}
//catch(e){
//	//logDebug("Exceeeeeeeeeeeeeeeeeeeption "+e);
//}

if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}

/**
 * validates file extension and count of attached files, 
 * depends on Standard Choice: {REC_CATEGORY}_ATTACHMENTS_FILE_EXT
 * @returns {String} validation error message if failed, empty string otherwise
 */
function validateAttachmentsExtAndCount() {

	//TODO add file name to error message
	//TODO put both messages in arabic in translation

	var retMessage = "";
	var invalidCountsMessage = "";
	var invalidExtMessage = "";

	var documentModels = new Array();

	try {
		//append documents added before (Save and Resume Later)
		var documentModelsFromTmpCap = aa.document.getDocumentListByEntity(capId, "TMP_CAP").getOutput();
		if (documentModelsFromTmpCap) {
			documentModelsFromTmpCap = documentModelsFromTmpCap.toArray();
			for ( var dd in documentModelsFromTmpCap) {
				documentModels.push(documentModelsFromTmpCap[dd]);
			}
		}
		java.lang.System.out.println("documentModelsFromTmpCap: " + documentModelsFromTmpCap.length);
		//append documents added before (the SendBack case)
		var documentModelsFromCap = aa.document.getCapDocumentList(capId, currentUserID).getOutput();
		if (documentModelsFromCap != null) {
			for ( var dd in documentModelsFromCap) {
				documentModels.push(documentModelsFromCap[dd]);
			}
		}
		java.lang.System.out.println("documentModelsFromCap: " + documentModelsFromCap.length);

		//append documents being uploaded now
		var documentModelsFromSession = aa.env.getValue("DocumentModelList");
		if (documentModelsFromSession && documentModelsFromSession != null) {
			documentModelsFromSession = documentModelsFromSession.toArray();
			for ( var dd in documentModelsFromSession) {
				documentModels.push(documentModelsFromSession[dd]);
			}
		}
		java.lang.System.out.println("documentModelsFromSession: " + documentModelsFromSession.length);
	} catch (ex) {
		logDebug("**WARN validateAttachmentsExtAndCount() exception while gathering docs " + controlString);
		return false;//?? could be a blocker then? make it true?
	}
	
	java.lang.System.out.println("documentModels Length: " + documentModels.length());
	
	for (d in documentModels){
		java.lang.System.out.println("documentModel: " + documentModels[d]);
		printValues(documentModels[d]);
	}
	
	
	var appType = appTypeArray[3];
	var lookupKey = appType + "_ATTACHMENTS_FILE_EXT";

	//	var incorretExtMsgTmplt = "File type of: $$DOC_CAT$$ not correct, use: $$TYPES$$";
	//	var incorretCountMsgTmplt = "File count exceed limit: $$DOC_CAT$$, max allowed: $$MAX$$";

	var incorretExtMsgTmplt = String(aa.messageResources.getLocalMessage("VALIDATE_FILE_EXT_ERR"));
	var incorretCountMsgTmplt = String(aa.messageResources.getLocalMessage("VALIDATE_FILE_COUNT_ERR"));

	var incorretExtMsgTmplt = String(Record.translate("VALIDATE_FILE_EXT_ERR"));
	var incorretCountMsgTmplt = String(Record.translate("VALIDATE_FILE_COUNT_ERR"));

	//prepare document counts (document list already fetched, this will not be performance issue
	var docCounts = aa.util.newHashMap();
	var lastFilePerType = new Array();
	for ( var dd in documentModels) {
		var documentCatName = documentModels[dd].getDocCategory();
		var docCountVal = docCounts.get(documentCatName);
		if (!docCountVal || docCountVal == null || docCountVal == "") {
			docCountVal = 0;
		}
		++docCountVal;
		lastFilePerType[documentCatName] = documentModels[dd].getFileName();
		java.lang.System.out.println("Document Count: " + documentCatName + ", " + docCountVal);
		docCounts.put(documentCatName, docCountVal);
	}//for all docs
	
	for ( var dd in documentModels) {
		var docModel = documentModels[dd];
		var fileName = docModel.getFileName();
		var documentCatName = docModel.getDocCategory();

		var allowedExtStr = lookup(lookupKey, documentCatName);

		//no type validation required
		if (!allowedExtStr) {
			continue;
		}

		var allowedExtAry = allowedExtStr.split(",");

		//no type validation required
		if (!allowedExtAry || allowedExtAry.length == 0) {
			continue;
		}

		
		var arabicDocType = getArabicDocumentType(documentCatName);
		//validate count (if required), where first element is a NUMBER (max count)
		if (!isNaN(allowedExtAry[0])) {
			allowedMaxCount = parseInt(allowedExtAry[0]);
			if (parseInt(docCounts.get(documentCatName)) > allowedMaxCount) {
				//add count validation message once per document type
				var tmpMsgCount = incorretCountMsgTmplt.replace("$$DOC_CAT$$", arabicDocType).replace("$$MAX$$", allowedMaxCount);
				if (invalidCountsMessage.indexOf(tmpMsgCount) == -1) {
					invalidCountsMessage = tmpMsgCount;
					//invalidCountsMessage += documentCatName + " exceeded max allowed count [" + allowedMaxCount + "]<br/>";
				}//prevent duplicate message for same doc type
			}//count exceeded
		}//count check required

		//no ext validation required (only count)
		if (allowedExtAry.length == 1 && !isNaN(allowedExtAry[0])) {
			continue;
		}

		var fileNameJavaStr = new java.lang.String(fileName);
		var dotIndex = fileNameJavaStr.lastIndexOf(".");
		if (dotIndex >= 0 && dotIndex < fileNameJavaStr.length() - 1) {
			var docExt = fileNameJavaStr.substring(dotIndex + 1);

			docExt = docExt.toUpperCase();
			if (!exists(docExt, allowedExtAry)) {

				if (invalidExtMessage.indexOf(documentCatName) == -1) {
					if (isNaN(allowedExtAry[0])) {
						invalidExtMessage = incorretExtMsgTmplt.replace("$$DOC_CAT$$", arabicDocType + "").replace("$$TYPES$$", allowedExtStr)
						"";
					} else {
						invalidExtMessage = incorretExtMsgTmplt.replace("$$DOC_CAT$$", arabicDocType + "").replace("$$TYPES$$",
								allowedExtStr.substring(allowedExtStr.indexOf(",") + 1))
								+ "";
					}
				
				}//prevent duplicate message for same doc type
			}
		} else {
			//doc file name has no extension?!
			invalidExtMessage += arabicDocType + " : Uploaded document has no extension<br/>";
		}
	}//for all documentModels

	if (invalidExtMessage != "") {
		//"Incorrect File Extensions:<br>" + 
		retMessage += invalidExtMessage + "";
	}
	if (invalidCountsMessage != "") {

		//"Incorrect Counts:<br>" + 
		retMessage += "<br>" + invalidCountsMessage;
	}
	
	
	return retMessage;
}

var validationMsg = validateAttachmentsExtAndCount();

if (validationMsg != "") {
	cancel = true;
	showMessage = true;
	showDebug = false;
	//aa.debug("Show Final Message",finalMessage);
	message = validationMsg;
	//message += "<img id='error_onload' src='../home_images/trans_pixel.png' onLoad=\"$(this).next().hide();$(this).prev().hide();\">"
	//comment(validationMsg);
	if (showMessage) {
		aa.env.setValue("ErrorMessage", message);
		aa.env.setValue("ReturnCode", "-1");
		aa.env.setValue("ReturnMessage", message);
		//aa.env.setValue("ScriptReturnCode", "-1");
		//aa.env.setValue("ScriptReturnMessage", message);
	}
	//if (showDebug)
	//aa.env.setValue("ErrorMessage", debug);
	//throw validationMsg;
}

function getArabicDocumentType(documentType){
	var type = documentType;
	var sql = " SELECT DISTINCT R.DOC_TYPE FROM RDOCUMENT T LEFT JOIN RDOCUMENT_I18N R ON R.RES_ID = T.RES_ID "
		sql += " AND R.Lang_Id = 'ar_AE' AND T.SERV_PROV_CODE = R.SERV_PROV_CODE WHERE T.SERV_PROV_CODE = 'MOFK' "
		sql += " AND T.REC_STATUS='A' AND T.DOC_TYPE='"+documentType+"' "
	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var result = dba.select(sql, []);
	var ret = result.toArray()
	var data = [];
	for ( var x in ret) {
		var o = {};
		type = ret[x][0];
		break;
	}
	return type
}


function printValues(object)
{
    for (x in object.getClass().getMethods())
    {
	try{
		var theName = object.getClass().getMethods()[x].getName();
		var theValue="";
		if (theName.indexOf("get")==0){
			eval("theValue = object."+theName+"();");
			java.lang.System.out.println(object.toString() + " | " + theName + ": " + theValue);
		}
	} catch(e) {
		java.lang.System.out.println("Error: " + e);
	}
    }
    java.lang.System.out.println(" ");
}

