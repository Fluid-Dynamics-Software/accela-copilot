/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_REST_DEVICE_DETAILS_ON_LOAD.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: RSA
| Created at	: 26/07/2022 16:38:42
|
/------------------------------------------------------------------------------------------------------*/

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance(
			"com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName,
				"ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
//eval(getScriptText("INCLUDE_ACABASE"));

eval(getScriptText("DISABLE_ASIT_BUTTONS_ACA"));
//
//ACABASE.prototype.execute = function() {
//	try {
//		var capModel = this.getCapModel();
//		var capId = capModel.getCapID();
//
//		var parentcapID = capModel.getParentCapID();
//		if (capId != null && parentcapID != null) {
			var lang = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale().getLanguage();
//			if (lang == "ar-") {
//				var disableScript = getScriptToDisableButtons("", true,
//						true, true);
//			} else {
				var disableScript = getScriptToDisableButtons("DEVICE DETAILS", false,
						true, false);
//			}
			
			aa.env.setValue("ErrorCode", "1");
			aa.env.setValue("ErrorMessage", disableScript);
//		}
//
//	} catch (e) {
//		this.showMessage("ERROR:" + e+ "");
//	}
//}
//
//run();