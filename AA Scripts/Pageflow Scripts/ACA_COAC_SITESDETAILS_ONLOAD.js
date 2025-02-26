/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_COAC_SITESDETAILS_ONLOAD.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: AOTAIBI
| Created at	: 11/07/2023 10:56:07
|
/------------------------------------------------------------------------------------------------------*/

//ACA_COCT_SITESDETAILS_ONLOAD ---> ACA_COAC_SITESDETAILS_ONLOAD
// check if this file is required to use 

//showDebug=true; 


logDebug("Started ASIT_TEST");
eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
var capModel = aa.env.getValue("CapModel");
var capId = capModel.getCapID();
var capClass = "";

var capModRes = aa.cap.getCap(capId);
if (capModRes.getSuccess()){
	var capMod = capModRes.getOutput();
	if (capModRes){
		capClass = capMod.getCapModel().getCapClass();
	}
}


var logDebug = function(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null) {
		msg2 = "";
	} else {
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2);
};

var asitSource = new ASITNavigator(null, "SITES DETAILS", true);

if (asitSource.rowCount){
	asitSourceData = asitSource.getJSONObject();
	var asitTarget = new ASITNavigator(capId, "SITES DETAILS");
	if (!asitTarget.rowCount){
		//asitTarget.removeAll();
		asitTarget.addRows(asitSourceData);
	}
}


/*
aa.env.setValue("ErrorCode", "-2");
aa.env.setValue("ErrorMessage", "Error: count:" + asitSource.rowCount + " asitSourceData:" +asitSourceData);
 */

function getScriptText(e) {
	var t = aa.getServiceProviderCode();
	if (arguments.length > 1)
		t = arguments[1];
	e = e.toUpperCase();
	var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var r = n.getScriptByPK(t, e, "ADMIN");
		return r.getScriptText() + ""
	} catch (i) {
		return ""
	}
}

function logDebug (msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null) {
		msg2 = "";
	} else {
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2);
};