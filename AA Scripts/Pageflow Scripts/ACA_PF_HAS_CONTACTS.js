/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_PF_HAS_CONTACTS.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 10/09/2020 14:58:01
|
/------------------------------------------------------------------------------------------------------*/

eval(getScriptText("COMMON_PAGEFLOW_FUNCTIONS"));

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

function ifContactACA() {
    var contactList = capModel.getContactsGroup();
    if (contactList != null && contactList.size() > 0) {
        for (var i = contactList.size(); i > 0; i--) {
            var contactModel = contactList.get(i - 1);
			java.lang.System.out.println(contactModel);
			return true;
        }
    }
} 

var contacts = ifContactACA();

if (!contacts) {
	var errorMessage = aa.messageResources.getLocalMessage("ACLA_ADD_TENANTS")
	aa.env.setValue("ErrorCode", "-2");
	aa.env.setValue("ErrorMessage", errorMessage);
}