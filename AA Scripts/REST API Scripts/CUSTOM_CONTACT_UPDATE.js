/*------------------------------------------------------------------------------------------------------/
| Program		: CUSTOM_CONTACT_UPDATE.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 29/01/2024 22:28:17
|
/------------------------------------------------------------------------------------------------------*/

//logDebug("CUSTOM_CONTACT_UPDATE :: Start")
eval(getScriptText("INCLUDE_CONT"));
var LANGS = {
	"ar-AE" : "ar_AE",
	"en-US" : "en_US"
}
var res = {};
var altId = aa.env.getValue("capId");
var params = aa.env.getValue("params");
//logDebug("CUSTOM_CONTACT_UPDATE :: params ",JSON.stringify(params))
params = JSON.parse(JSON.parse(params));
//logDebug("CUSTOM_CONTACT_UPDATE :: params ",JSON.stringify(params))
var email = getEmailFromObject(params)
//logDebug("CUSTOM_CONTACT_UPDATE :: email ",JSON.stringify(params))
params.email = email
//logDebug("CUSTOM_CONTACT_UPDATE :: inject ",JSON.stringify(params))
var result = CONT.createUpdateContact(params)

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

function getEmailFromObject(contObj) {
    var obj = contObj.individual;
    var subGroupName = "individual";
    var fieldName = "Email";
    
    if (!obj) {
        obj = contObj.nonIndividual;
        subGroupName = "nonIndividual";
        fieldName = "E-mail"; // Remove 'var' here to update the existing variable
    }
    
    if (contObj[subGroupName.toLowerCase()] && contObj[subGroupName][fieldName]) {
        return contObj[subGroupName][fieldName];
    } else {
        return null; // Return null if any of the required properties are undefined
    }
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
function logDebug(msg) {
	java.lang.System.out.println("===Custom Log for SARI_TEST_TEST ==> " + msg);
}