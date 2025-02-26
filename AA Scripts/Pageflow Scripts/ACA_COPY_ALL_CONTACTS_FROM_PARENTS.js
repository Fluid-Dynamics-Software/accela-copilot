/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_COPY_ALL_CONTACTS_FROM_PARENTS.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 14/09/2020 16:42:11
|
/------------------------------------------------------------------------------------------------------*/

SCRIPT_VERSION = "3.0";
var currentUserID = "ADMIN";
var showDebug = true;
var showDebug = false;


eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

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

var capModel = aa.env.getValue("CapModel");
var parentCapId = capModel.getParentCapID();
var asiGroups = capModel.getAppSpecificInfoGroups();
var partialCapId = capModel.getCapID();
java.lang.System.out.println("capModel = "+capModel);
java.lang.System.out.println("parentCapId = "+parentCapId);
java.lang.System.out.println("partialCapId = "+partialCapId);


//copyCapContact(capModel, parentCapId);
var publicUser =  aa.env.getValue("CurrentUserID");
var puSeq = String(publicUser).replace("PUBLICUSER", "");
var licList = aa.licenseScript.getRefLicProfByOnlineUser(puSeq).getOutput();
var hasLicense = !licList || licList.length == 0 ? false : true;


if(parentCapId !=null && parentCapId !="" && hasLicense){
	copyContactsForACA(aa.cap.getCapViewBySingle4ACA(parentCapId));
	aa.env.setValue("CapModel", capModel);
}

function copyCapContact(capModel, sourceCAPID) {
	var capContactScriptModelList = aa.people.getCapContactByCapID(sourceCAPID).getOutput();
	var capContacts = aa.util.newArrayList();
	for (i in capContactScriptModelList) {
		var capContactModel = capContactScriptModelList[i].getCapContactModel();
		capContactModel.setCapID(capModel.getCapID());
		var sContactType = capContactModel.getContactType();
		java.lang.System.out.println("sContactType = "+sContactType);
		capContacts.add(capContactModel);
	}
	capModel.setContactsGroup(capContacts);
}


function copyContactsForACA(IDBCap) {
	capModel.setContactsGroup(null);

    var contactArray = IDBCap.getContactsGroup().toArray();

    var contactCollection = aa.util.newArrayList();

    for (var contact in contactArray) {
        var thisContact = contactArray[contact];
        thisContact.setComponentName("");
        var contactType = thisContact.getContactType()
        var contactAttributes = thisContact.getPeople().getAttributes().toArray();
        contactCollection.add(thisContact);
    }
    capModel.setContactsGroup(contactCollection);
}