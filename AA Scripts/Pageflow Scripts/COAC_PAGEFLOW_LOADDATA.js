try {

    eval(getScriptText("COMMON_PAGEFLOW_FUNCTIONS"));
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
    if (typeof COAC === "undefined")
	{
		eval(getScriptText("INCLUDE_COAC"));
	}  
    ////var SCRIPT_VERSION = "3" 
 //var capModel = aa.env.getValue("CapModel");
 var coac = new COAC(capModel.getCapID());
 coac.ACAonloadPageFlow();
 coac.copyASITFromParentACA();	 
 
/*
 aa.env.setValue("ErrorCode", "-2");
 aa.env.setValue("ErrorMessage", "Error: ");
*/
 
 
} catch (e) {

    aa.env.setValue("ErrorCode", "-2");
    aa.env.setValue("ErrorMessage", "Error: " + e);


}

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = com.accela.aa.emse.dom.service.CachedService.getInstance().getEMSEService();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}