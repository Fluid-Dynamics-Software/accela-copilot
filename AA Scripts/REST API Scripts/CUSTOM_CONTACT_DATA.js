/*------------------------------------------------------------------------------------------------------/
| Program		: CUSTOM_CONTACT_DATA.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 29/01/2024 19:02:33
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_CONT"));
//eval(getScriptText("INCLUDE_OBACT"));
var LANGS = {
	"ar-AE" : "ar_AE",
	"en-US" : "en_US"
}

var altId = aa.env.getValue("capId");
var params = aa.env.getValue("params");
var thisRecord = new Record(altId);
//var paramsparsed = JSON.parse(JSON.parse(params));

var result = CONT.getContactDataByID(altId);

try {
	aa.env.setValue("Content", result);
	aa.env.setValue("Success", true);
	aa.env.setValue("Message", "Results returned successfully");
} catch (e) {
	aa.env.setValue("ScriptReturnCode", "-1");
	aa.env.setValue("Success", false);
	aa.env.setValue("Message", "Error while executing Workflow Comments. Error: " + e);
	logDebug("Error while executing Workflow Comments. Error: " + e);
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
	if (typeof msg2 === "undefined" || msg2 === null) {
		msg2 = "";
	} else {
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log for SARI_TEST_TEST ==> " + msg + msg2);
}