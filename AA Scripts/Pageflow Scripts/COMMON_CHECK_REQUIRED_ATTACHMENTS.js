/*------------------------------------------------------------------------------------------------------/
| Program : COMMON_CHECK_REQUIRED_ATTACHMENTS.js
| Event   : -
|
| Usage   : .
|
| Notes       	mm/dd/yy	Name                	Action     Method Name
| Created 		07/14/15   	Hisham El Fangary      	Created
/------------------------------------------------------------------------------------------------------*/
java.lang.System.out.println("COMMON_CHECK_REQUIRED_ATTACHMENTS: Started Inside!");
var theLocale = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale().getLanguage();

if (theLocale == "ar"){
	var missingDocumentMappedValueMessage = '{fieldName} التالي: {differenceArray} يلزم تحديده وإرفاقه بمستند من نوع: ';
}else{
	var missingDocumentMappedValueMessage = "the following {fieldName}(s): {differenceArray} need(s) to be selected & attached to a document of type: ";
}
java.lang.System.out.println("before : capModel!");

var finalMessage = "";
var requiredArray = new Array();
var capStatus = capModel.getCapStatus();
var capClass= capModel.getCapClass();
var showMessage = false;

eval(getScriptText("ENCODESCRIPT"));
eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
eval(getScriptText("INCLUDE_AFMS"));
java.lang.System.out.println("loaded : INCLUDE_AFMS!");
var docMappingScript = "";
var docMappingSettings = null;

if (typeof AFMS != "undefined"){
	var afms = AFMS.getAFMS(capId);
	if (afms){
		if (afms.getDocumentMappingForACA){
			docMappingSettings = afms.getDocumentMappingForACA();
			java.lang.System.out.println("=== docMappingSettings ==> " + docMappingSettings);
			if (docMappingSettings){
				attachmentDropDownValues = JSON.stringify(docMappingSettings);
				attachmentDropDownValues = encodeURIComponent(attachmentDropDownValues);
				docMappingScript = " convertAttachmentDescriptionToDropDown(decodeURIComponent('"+attachmentDropDownValues+"')); ";
				java.lang.System.out.println("=== docMappingScript ==> " + docMappingScript);
			}				
		}

	}
}

if(capStatus == "Waiting on Applicant" || capStatus == "Waiting On Applicant" || capClass == "EDITABLE"){
	var submittedDocList = aa.document.getCapDocumentList(capId, currentUserID).getOutput();
}else{
	var submittedDocList = aa.document.getDocumentListByEntity(capId, "TMP_CAP").getOutput().toArray();
}

requiredArray = getRequiredDocuments();
for (var i in requiredArray){
	var requiredDoc = requiredArray[i];
	java.lang.System.out.println("Required Document: " + requiredDoc);
	java.lang.System.out.println("docMappingSettings: " + JSON.stringify(docMappingSettings));
	finalMessage += processCheckDocument(requiredDoc, submittedDocList, docMappingSettings);
}

if (finalMessage == "") {
	// Proceed Normally
}else{
	// Stop Submit
	showError=true;
	cancel = true;
	showMessage = true; 	
	//aa.debug("Show Final Message",finalMessage);	
	message = aa.messageResources.getLocalMessage("CPRE_Please_Submit_The_Below_Documents") + "<br><div style=&#92;&#39;padding: 10px 20px;color: #b52626;border: 1px solid #cb3636;margin: 20px 0px;&#92;&#39; class=&#92;&#39;docs_error_message&#92;&#39;>" +  finalMessage + "</div>"; //"Please upload the Food Items file";
	message += getAttachmentListHTML();
}

if (cancel)
{
	aa.env.setValue("ErrorCode", "-2");
	if (showMessage) aa.env.setValue("ErrorMessage", message);
	if (showDebug) aa.env.setValue("ErrorMessage", debug);
}
else
{
	aa.env.setValue("ErrorCode", "0");
	if (showMessage) aa.env.setValue("ErrorMessage", message);
	if (showDebug) aa.env.setValue("ErrorMessage", debug);
}


function processCheckDocument(requiredDocName, submittedDocArray, mappedSettings){
	var requiredDoc = String(requiredDocName[0]).trim();
	var found = false;
	var submittedValues = [];
	var mappedValues = [];
	var fieldName = "";
	//java.lang.System.out.println("mappedSettings[requiredDocName]: " + mappedSettings[requiredDocName]);
	if (mappedSettings){
		if (mappedSettings[requiredDoc]){
			if (theLocale == "ar"){
				fieldName = mappedSettings[requiredDoc].nameAr;
			}else{
				fieldName = mappedSettings[requiredDoc].name;
			}
			mappedValues = mappedSettings[requiredDoc].values;
		}		
	}

	
	for (var j in submittedDocArray){
		var submittedDoc = String(submittedDocArray[j].getDocCategory()).trim();
		var submittedDesc = String(submittedDocArray[j].getDocDescription()).trim();
		if (requiredDoc == submittedDoc){
			if (submittedDesc){
				submittedValues.push(submittedDesc);
			}
			found = true;
			
			//break;
		}		
	}
	if (!found){
		return " - " + requiredDocName[1] + "<br>"; //"Please upload this file";
	}else{
		java.lang.System.out.println("mappedValues: " + mappedValues.toString());
		java.lang.System.out.println("submittedValues: " + submittedValues.toString());
		
		var difference = mappedValues.filter(function(x) { return submittedValues.indexOf(x) === -1});
		java.lang.System.out.println("difference: " + difference.toString());
		
		if (difference.length){
			missingDocumentMappedValueMessage = replaceAll(missingDocumentMappedValueMessage, "{fieldName}", fieldName);
			missingDocumentMappedValueMessage = replaceAll(missingDocumentMappedValueMessage, "{differenceArray}", difference.toString());
			
			return missingDocumentMappedValueMessage + requiredDocName[1] + "<br />";
		}
		return "";
	}
}

function getAttachmentListHTML(){
	var requiredArray = new Array();
	var showMessage = true;                                                                                    
	var showDebug = false;                                                                                        
	var cancel = false;
	var theMessage = "";
	var preMessage = "<font size=2 color=#07B581>" + requiredMessage + "</font>";
	var q = "&qu ot;";
	q = q.replace(" ", "");   // Have to do this because Accela Script window converts html encoded quotes when retrieving scripts, making the code invalid.
	var i = 0;
	var submittedDocList = aa.document.getDocumentListByEntity(capId, "TMP_CAP").getOutput().toArray();
	
	var finalTippyScript = "";
	requiredArray = getRequiredDocuments();
	try{
		if (requiredArray.length>0){
			message += preMessage;
			for (var i in requiredArray){
				var requiredDoc = String(requiredArray[i][0]).trim();
				var reqDoc1 = String(requiredArray[i][1]);
				// Description
				var description = "";
				if (requiredArray[i].length>2){
					var description = requiredArray[i][2];
					if (description){
						description = replaceAll(description,"'","`");	
						description = replaceAll(description,'"',"``");
						var randomId = generateRandomId();
						var tippyScript = "tippy($('#"+randomId+"').get(0),{content: '"+description+"',interactive: true,arrow: true,placement: 'top'});";
						description = '<span title=&#92;&#39;Help&#92;&#39; id=&#92;&#39;'+randomId+'&#92;&#39; href=&#92;&#39;javascript:void(0);&#92;&#39; style=&#92;&#39;margin: 0px 5px;&#92;&#39; class=&#92;&#39;helpIcon&#92;&#39;><img src=&#92;&#39;../App_Themes/Default/assets/notice_16_new.gif&#92;&#39; style=&#92;&#39;vertical-align: bottom;width: 13px;height: 13px;&#92;&#39; alt=&#92;&#39;Help&#92;&#39;></span>';
						finalTippyScript += tippyScript;
					}
				}
				reqDoc1 = replaceAll(reqDoc1,"'","`");	
				reqDoc1 = replaceAll(reqDoc1,'"',"``");	
				//if(cap.getCapClass() == "EDITABLE"){			
					message += "<div class=&#92;&#39;attachment-item-" + i + "&#92;&#39;> - " + reqDoc1 + " " + description + "<div class=&#92;&#39;attachment-item-status&#92;&#39;></div>"+"<div style=&#92;&#39;display:none&#92;&#39; class=&#92;&#39;attachment-original-name&#92;&#39;>"+reqDoc1+"</div></div>";
				//}else{
				//	message += "<div class=&#92;&#39;attachment-item-" + i + "&#92;&#39;> - " + reqDoc1 + "<div class=&#92;&#39;attachment-item-status&#92;&#39;></div></div>"; 	//"Please upload this file"
				//}
			}
		}
	}catch(err){};


	try {
		var optionalArray = getOptionalDocuments();
		if (optionalArray){
			if (optionalArray.length>0){
				if (message!=""){
					message += "<br>";
				}
				message += "<font size=2 color=#07B581>" + optionalMessage + "</font>";
				logDebug("Optional Array", optionalArray.length);
				for (var j in optionalArray){
					var optionalDoc = String(optionalArray[j][0]).trim();
					var optDoc1 = String(optionalArray[j][1]);
					optDoc1 = replaceAll(optDoc1,"'","`");	
					optDoc1 = replaceAll(optDoc1,'"',"``");				
					// Description
					var description = "";
					if (optionalArray[j].length>2){
						var description = optionalArray[j][2];
						if (description){
							description = replaceAll(description,"'","`");	
							description = replaceAll(description,'"',"``");
							var randomId = generateRandomId();
							var tippyScript = "tippy($('#"+randomId+"').get(0),{content: '"+description+"',interactive: true,arrow: true,placement: 'top'});";
							description = '<span title=&#92;&#39;Help&#92;&#39; id=&#92;&#39;'+randomId+'&#92;&#39; href=&#92;&#39;javascript:void(0);&#92;&#39; class=&#92;&#39;helpIcon&#92;&#39;><img src=&#92;&#39;../App_Themes/Default/assets/notice_16_new.gif&#92;&#39; alt=&#92;&#39;Help&#92;&#39;></span>';
							finalTippyScript += tippyScript;
						}
					}
					var totalCount = i + j;
					//if(cap.getCapClass() == "EDITABLE"){  
			          message += "<div class=&#92;&#39;attachment-item-" + totalCount + "&#92;&#39;> - " + optDoc1 + " " + description + "<div class=&#92;&#39;attachment-item-status&#92;&#39;></div>"+"<div style=&#92;&#39;display:none&#92;&#39; class=&#92;&#39;attachment-original-name&#92;&#39;>"+optDoc1+"</div></div>"; 
			        //}else{
			          //message += "<div class=&#92;&#39;attachment-item-" + totalCount + "&#92;&#39;> - " + optDoc1 + "<div class=&#92;&#39;attachment-item-status&#92;&#39;></div></div>";  //"Please upload this file" 
			        //} 			
				}
			}
		}
	}catch(err){
		logDebug("Error in Optional Documents", err);
	}

	var createTippyScript = 'eval('+encodeWithoutRunning(getScriptText("TIPPYSCRIPT"))+');';
	createTippyScript = createTippyScript.replace('"', "&#39;");
	createTippyScript = createTippyScript.replace('"', "&#39;");

	var theHTML = "<div id="+q+"required_documents"+q+">" + message + "</div>";
	var AttachmentListHTML = "<img src='../App_Themes/Default/assets/spacer.gif' class='attachment_component_message' onLoad=\"debugger;$($('.ACA_Message_Error').get(0)).css('background-image', 'none');$($('.ACA_Message_Error').get(0)).css('background-color', 'rgb(255, 244, 224)');$($('.ACA_Message_Error').get(0)).html('" + theHTML + "');fixRequiredDocumentsMessage();verifyAttachments();"+docMappingScript+" setTimeout(function(){"+createTippyScript+" "+finalTippyScript+"},500); \">"; 
	return AttachmentListHTML;
}

function generateRandomId () {
	// I generate the UID from three parts here
	// to ensure the random number provide enough bits.
	var letterNumber = ((Math.random() * 24) | 0);
	var firstPart = (Math.random() * 46656) | 0;
	var secondPart = (Math.random() * 46656) | 0;
	var thirdPart = (Math.random() * 46656) | 0;

	firstLetter = String.fromCharCode(97 + letterNumber);
	firstPart = ("000" + firstPart.toString(36)).slice(-3);
	secondPart = ("000" + secondPart.toString(36)).slice(-3);
	thirdPart = ("000" + thirdPart.toString(36)).slice(-3);
	return firstLetter + firstPart + secondPart + thirdPart;
}

function escapeRegExp(str) {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}