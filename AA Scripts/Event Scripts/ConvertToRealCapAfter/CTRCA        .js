/*------------------------------------------------------------------------------------------------------/
| Program		: CTRCA.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ISRAA
| Created at	: 26/11/2017 17:47:10
|
/------------------------------------------------------------------------------------------------------*/

eval(getScriptText("MODULENOTIFICATION"));


var pubUserID = aa.env.getValue("CurrentUserID");
var UserSeqNum = String(pubUserID).replace("PUBLICUSER", "");


if(checkRepresentaytiveContact()){
	createCapContact(UserSeqNum);	
}


var gn = new ModuleNotification();
if (gn != null) {
	gn.sendNotification("CTRA", '*', '*');
}


function checkRepresentaytiveContact() {
	var capContactArray = new Array();
	var canCreate = true;
	var capContactResult = aa.people.getCapContactByCapID(capId);
	if (capContactResult.getSuccess()) {
		capContactArray = capContactResult.getOutput();
	}
	if (capContactArray && capContactArray.length > 0) {
		 for (var contact in capContactArray) {
			 var thisContact = capContactArray[contact];
			 var contactType = thisContact.getContactType();
			 if(contactType == "Representative"){
				 return false;
			 }
				 
		 }
	}
	
	return canCreate;
}


function createCapContact(UserSeqNum) {
	var capContactList = aa.people.getCapContactByCapID(capId).getOutput();
	var userContactList = aa.people.getUserAssociatedContact(UserSeqNum).getOutput();

	if (userContactList.size() == 0) {
		return;
	}

	var contactSeqNumber = userContactList.get(0).getStateIDNbr();//CIVIL ID 
	for (var w = 0; w < capContactList.length; w++) {
		if (capContactList[w].getCapContactModel().getPeople().getStateIDNbr() == contactSeqNumber) {
			return;
		}
	}
	var seqNumber = userContactList.get(0).getContactSeqNumber();

	if (seqNumber != null || seqNumber != '') {
		var peopleModel = aa.people.getPeople(seqNumber).getOutput();
		var capType = aa.cap.getCap(this.capId).getOutput().getCapType();
		if (capType == "eXpropriate/To Whom It May Concern/Plot/EXTW") {
			peopleModel.setContactType("Applicant");
		}
		aa.people.createCapContactWithRefPeopleModel(capId, peopleModel);
	}
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

//function createCapContact(UserSeqNum) {
//	aa.print('inside createCapContact ....................');
//	var capContactList = aa.people.getCapContactByCapID(capId).getOutput();
//	// if (!capContactList || capContactList.length == 0) {
//	aa.print('capContactList not exits, Going to make the copy');
//	var userContactList = aa.people.getUserAssociatedContact(UserSeqNum).getOutput();
//	aa.print('userContactList.size: ' + userContactList.size());
//	for (var i = 0; i < userContactList.size(); i++) {
//		var contactSeqNumber = userContactList.get(i).getContactSeqNumber();
//		if (contactSeqNumber != UserSeqNum) {
//			var peopleModel = aa.people.getPeople(contactSeqNumber).getOutput();
//			aa.people.createCapContactWithRefPeopleModel(capId, peopleModel);
//			aa.print('Contact Copied: SEQ: ' + contactSeqNumber);
//		}
//	}
//	/*
//	 * }else{ aa.print('capContactList is Exists, Length: ' +
//	 * capContactList.length); }
//	 */
//}