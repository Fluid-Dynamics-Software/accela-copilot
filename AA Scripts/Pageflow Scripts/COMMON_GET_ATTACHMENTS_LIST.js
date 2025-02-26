/*------------------------------------------------------------------------------------------------------/
| Program : COMMON_GET_ATTACHMENTS_LIST.js
| Event   : -
|
| Usage   : .
|
| Notes       	mm/dd/yy	Name                	Action     Method Name
| Created 		09/15/15   	Hisham El Fangary      	Created
/------------------------------------------------------------------------------------------------------
|
|	1. Create Standard Choice (translated to both languages) for Required Attachments Named: [capCategory]_REQUIRED_ATTACHMENTS
|		Example: BBCE_REQUIRED_ATTACHMENTS
|
|	2. Create Standard Choice (translated to both languages) for Optional Attachments Named: [capCategory]_OPTIONAL_ATTACHMENTS
|		Example: BBCE_OPTIONAL_ATTACHMENTS
|
|	3. Make sure to add the Attachments (translated to both languages) in the Document Group as well for this service.
|
|	4. Attach (COMMON_SHOW_ATTACHMENTS) to the onLoad event of the pageflow
|
|	5. Attach this script (COMMON_CHECK_ATTACHMENTS) script to the beforeButton event of the pageflow
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("DBA.QUERY.TOOLS"))
var theLocale = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale().getLanguage();
var requiredMessage = "";
var optionalMessage = "";
requiredEN = 'The following documents are required:<BR>';
requiredAR = 'يرجى إرفاق المستندات الإجبارية التالية: <BR>';
optionalEN = 'The following documents are optional:<BR>';
optionalAR = 'الوثائق التالية اختيارية: <BR>';

if (theLocale == "ar"){
	requiredMessage = requiredAR;
	optionalMessage = optionalAR;
}else{
	requiredMessage = requiredEN;
	optionalMessage = optionalEN;
}

if (typeof capModel !== 'undefined'){
	var cap = capModel;
}else{
	var cap = aa.cap.getCap(capId).getOutput().getCapModel();
}
var capTypeModel = cap.getCapType();
var capGroup = capTypeModel.getGroup();
var capType = capTypeModel.getType();
var capSubType = capTypeModel.getSubType();
var capCategory = capTypeModel.getCategory();

var requiredSDChoiceName = capCategory + "_REQUIRED_ATTACHMENTS";
var optionalSDChoiceName = capCategory + "_OPTIONAL_ATTACHMENTS";
var conditionalScript = capCategory + "_ATTACHMENT_CONDITIONS";
try{
	eval(getScriptText(conditionalScript)); 	// Load Any functions used to determine the conditions
}catch(err){}

var documentsDetails = getDocumentsDetails();

function getDocumentsDetails(){
	var servProvCode =  aa.getServiceProviderCode();

	var sql=	" SELECT [R1_PER_GROUP] " + 
	"       ,[R1_PER_TYPE] " + 
	"       ,[R1_PER_SUB_TYPE] " + 
	"       ,[R1_PER_CATEGORY] " + 
	"       ,[R1_DOC_CODE] " + 
	"       ,[R1_DOC_CODE_FOR_ACA] " + 
	" 	  ,doc.DOC_TYPE " + 
	" 	  ,doc.DOC_COMMENT " + 
	"  FROM [R3APPTYP] app " + 
	"  JOIN RDOCUMENT doc  " + 
	"  ON app.[R1_DOC_CODE_FOR_ACA] = doc.DOC_CODE " + 
	"  WHERE app.REC_STATUS = 'A' AND app.SERV_PROV_CODE = '"+servProvCode+"' AND doc.REC_STATUS = 'A' AND doc.SERV_PROV_CODE = '"+servProvCode+"' " + 
	"  AND app.[R1_PER_GROUP] = '"+capGroup+"' " + 
	"  AND app.[R1_PER_TYPE] = '"+capType+"' " + 
	"  AND app.[R1_PER_SUB_TYPE] = '"+capSubType+"' " + 
	"  AND app.[R1_PER_CATEGORY] = '"+capCategory+"' ";
	var documentsData = execQuery(sql);
	var documents = {};
	for (var d in documentsData){
		var documentData = documentsData[d];
		if (documentData.DOC_TYPE){
			var comments = String(documentData.DOC_COMMENT).trim();
			var descAr = "";
			var descEn = "";
			if (comments){
				var commentsArr = comments.split("\n");
				if (commentsArr.length){
					descEn = String(commentsArr[0]).trim();
					if (commentsArr.length>1){
						descAr = String(commentsArr[1]).trim();
					}else{
						descAr = descEn;
					}
				}
			}
			documents[documentData.DOC_TYPE] = {description:{ar:descAr, en:descEn}}			
		}
	}
	return documents;
}


//var test = lookupMultiLanguage(requiredSDChoiceName, "Manufacturer");
//aa.print(test);

function getRequiredDocuments(){
	var reqList = new Array();
	reqList = getAttachmentsList(requiredSDChoiceName);
	//reqList.push(["Manufacturer's Certificate of Conformity for the product (i.e. DCLD, Solar Keymark, etc.)", "SRRE.documents.Manufacturer.Certificate.Conformity"]);
	return reqList;
}

function getOptionalDocuments(){
	var optList = new Array();
	optList = getAttachmentsList(optionalSDChoiceName);
	return optList;
}

function getAttachmentsList(SChoiceName){
	var strControl;
	var strControlAr;
	var strCondition;
	var bizDomScriptResult = aa.bizDomain.getBizDomain(SChoiceName);
	var attachmentList;
	if (bizDomScriptResult.getSuccess()){
			var bizDomScriptObj = bizDomScriptResult.getOutput();
			//aa.print();
			//printClasses(bizDomScriptObj );	
			attachmentList = new Array();			
			for (i=0;i<bizDomScriptObj.size();i++){
				strControl = "" + bizDomScriptObj.get(i).getBizdomainValue(); // had to do this or it bombs.  who knows why?
				strControlAr = "" + bizDomScriptObj.get(i).getDispBizdomainValue(); // had to do this or it bombs.  who knows why?
				strCondition = "" + bizDomScriptObj.get(i).getDescription(); // had to do this or it bombs.  who knows why?
				strCondition = strCondition.trim();
				
				var addAttachment = true;
				if (strCondition != "" && strCondition != "null"){
					try{
						addAttachment = eval(strCondition);
					}catch(err){};
				}				
				if (addAttachment){
					// Add Description To Attachments if Exists!
					var description = ""
					if (documentsDetails[strControl]){
						description = documentsDetails[strControl].description;
						if (description){
							if (theLocale == "ar"){
								description = description.ar;
							}else{
								description = description.en;								
							}							
						}
					}
					attachmentList.push([strControl, strControlAr, description]);
				}
			}
			//aa.print("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
			return attachmentList;
	}else{
			return null;
	}
}

function trimCharacters(sTrim) {
   return String(sTrim).replace(/[^a-zA-Z0-9]+/g,''); 
}

function getScriptText(vScriptName){
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();	
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
		return emseScript.getScriptText() + "";	
		} catch(err) {
		return "";
	}
}
/*
function lookupMultiLanguage(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDispDescription(); // had to do this or it bombs.  who knows why?
		//aa.print("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		//aa.debug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
	}


getAttachmentsList("SD BBCE Applicant Type");
function getAttachmentsList(SChoiceName){
	var strControl;
	var strControlAr;
	var bizDomScriptResult = aa.bizDomain.getBizDomain(SChoiceName);
	var attachmentList = new Array();
	if (bizDomScriptResult.getSuccess())
		{
			var bizDomScriptObj = bizDomScriptResult.getOutput();
			//aa.print();
			//printClasses(bizDomScriptObj );		
			for (i=0;i<bizDomScriptObj.size();i++){
				strControl = "" + bizDomScriptObj.get(i).getBizdomainValue(); // had to do this or it bombs.  who knows why?
				strControlAr = "" + bizDomScriptObj.get(i).getDispBizdomainValue(); // had to do this or it bombs.  who knows why?
				aa.print("lookup(" + strControl + ") = " + strControlAr);
				
			}
		}
	else
		{
		}
}

function printClasses(object)
{
    for (x in object)
    {
        aa.print(""+x);
    }
	aa.print(""+" ");
}
*/