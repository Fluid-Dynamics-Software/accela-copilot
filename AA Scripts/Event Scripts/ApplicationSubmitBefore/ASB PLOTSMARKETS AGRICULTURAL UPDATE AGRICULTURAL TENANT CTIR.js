/*------------------------------------------------------------------------------------------------------/
| Program		: ASB:PLOTSMARKETS/AGRICULTURAL/UPDATE AGRICULTURAL TENANT/CTIR.js
| Event			: ApplicationSubmitBefore
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 01/08/2021 00:44:17
|
/------------------------------------------------------------------------------------------------------*/
java.lang.System.out.println("Trying Hisham CTIR Application Submit Before: Started!");
java.lang.System.out.println("CTIR Application Submit Before CapId: " + capId);
var CapIDModel = capId;
var capModel = aa.cap.getCap(capId).getOutput();
java.lang.System.out.println("capModel : " + capModel);

cancel = true;
showMessage = true;

aa.env.setValue("ErrorCode", "-2");
aa.env.setValue("ErrorMessage", "ERROR");
aa.env.setValue("ErrorMessage", "ERROR");
comment(e); 


/*
var finalMessage = "";
var requiredArray = new Array();
var capStatus = capModel.getCapStatus();
var capClass= capModel.getCapClass();
var showMessage = false;
var currentUserID = aa.env.getValue("CurrentUserID"); 

java.lang.System.out.println("capStatus : " + capStatus);

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var sysDate = aa.date.getCurrentDate();
var currentUserID = aa.env.getValue("CurrentUserID");
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var capModel = aa.env.getValue("CapModel");
var message =   "";     
var br = "<BR>";    

//java.lang.System.out.println("CTIR Application Submit Before: Started!");
//eval(getScriptText("COMMON_PAGEFLOW_FUNCTIONS"));
//java.lang.System.out.println("CTIR COMMON_PAGEFLOW_FUNCTIONS: loaded!");
eval(getScriptText("COMMON_GET_ATTACHMENTS_LIST"));	// Get List of Required Documents
//java.lang.System.out.println("CTIR COMMON_GET_ATTACHMENTS_LIST: loaded!");
var capId = CapIDModel;
eval(getScriptText("COMMON_CHECK_REQUIRED_ATTACHMENTS")); 	// Run the Check And Cancel if required documents aren't attached.
//java.lang.System.out.println("CTIR COMMON_CHECK_REQUIRED_ATTACHMENTS: loaded!");

java.lang.System.out.println("Cancel: " + cancel);

if (cancel)
{
	aa.env.setValue("ErrorCode", "-2");
	cancel = true;
	showMessage = true;
	comment(e);
	if (showMessage) aa.env.setValue("ErrorMessage", message);
	if (showDebug) aa.env.setValue("ErrorMessage", debug);
}
else
{
	aa.env.setValue("ErrorCode", "0");
	if (showMessage) aa.env.setValue("ErrorMessage", message);
	if (showDebug) aa.env.setValue("ErrorMessage", debug);
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
*/