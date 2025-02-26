logDebug("Sites Details befoer click started!");

eval(getScriptText("COMMON_PAGEFLOW_FUNCTIONS"));
eval(getScriptText("Include_RECORD"));
eval(getScriptText("CLASS_ASIT_NAVIGATOR"));

var capModel = aa.env.getValue("CapModel");
var capId = capModel.getCapID();
var currRecord = new Record(capId);

var capClass = "";

var capModRes = aa.cap.getCap(capId);
if (capModRes.getSuccess()){
	var capMod = capModRes.getOutput();
	if (capModRes){
		capClass = capMod.getCapModel().getCapClass();
	}
}

var rec = new Record(capId);
var asit = new ASITNavigator(rec.capId, "SITES DETAILS");

//if (capClass != "EDITABLE"){
	//var asit2 = new ASITNavigator(rec.capId, "SITES INFORMATION");
	var sitesDetailsJSON = asit.getJSON();
	//var sitesInformationJSON = asit2.getJSON();
	
	editAppSpecific("SITES DETAILS", sitesDetailsJSON);
	//editAppSpecific("SITES INFORMATION", sitesInformationJSON);
	
	logDebug("Sites Details table saved:", sitesDetailsJSON);
	//logDebug("Sites Information table saved:", sitesInformationJSON);
	
	/*
	 var activitiesASIT = currRecord.loadASITForACA("SITES DETAILS");	 
	*/
//}

if (asit.rowCount == 0 ) {
	aa.env.setValue("ErrorCode", "-2");
	aa.env.setValue("ErrorMessage", aa.messageResources.getLocalMessage("COCT.addSiteDetails"));
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}


function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null){
		msg2 = "";
	}else{
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2); 
}
