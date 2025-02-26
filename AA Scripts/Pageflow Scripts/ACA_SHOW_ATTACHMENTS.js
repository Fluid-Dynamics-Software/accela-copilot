/*------------------------------------------------------------------------------------------------------/
| Program : ACA_SHOW_ATTACHMENTS.js
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
|	4. Attach this script (ACA_SHOW_ATTACHMENTS) to the onLoad event of the pageflow
|
|	5. Attach (ACA_VERIFY_ATTACHMENTS) script to the beforeButton event of the pageflow
|
/------------------------------------------------------------------------------------------------------*/

eval(getScriptText("COMMON_PAGEFLOW_FUNCTIONS"));
eval(getScriptText("COMMON_GET_ATTACHMENTS_LIST"));	// Get List of Required Documents
eval(getScriptText("COMMON_SHOW_ATTACHMENTS")); 	// Show attachments in Message Window.

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