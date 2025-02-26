/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_USRG.js

| Event			: N/A
|
| Usage			: contains all the record's specific script
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MDERNAIKA
| Created at	: 04/07/2021 12:36:39
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText('INCLUDE_UTILS'));
if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}
if (typeof SPSABASE === "undefined") {
	eval(getScriptText("INCLUDE_SPSABASE"));
}
function USRG(capId) {
	SPSABASE.call(this, capId);
};
USRG.prototype = Object.create(SPSABASE.prototype);
USRG.prototype.constructor = USRG;
/*----------------------------------------------------ASI-----------------------------------------------*/
USRG.RECORD_TYPE = "OSHJ/User Profile/User Registration/USRG";
USRG.ASI = {};
USRG.ASI.loginInformation = {};
USRG.ASI.loginInformation.TableName = "LOGIN INFORMATION";
USRG.ASI.loginInformation.userName = "User Name";
USRG.ASI.loginInformation.eMailAddress = "E-mail Address";
USRG.ASI.loginInformation.password = "Password";
USRG.ASI.loginInformation.typePasswordAgain = "Type Password Again";
USRG.ASI.loginInformation.enterSecurityQuestion = "Enter Security Question";
USRG.ASI.loginInformation.answer = "Answer";
USRG.ASI.loginInformation.usertype = "UserType";
USRG.ASI.loginInformation.wasverified = "wasVerified";
USRG.ASI.loginInformation.otpValue = "OTP Value";
USRG.ASI.loginInformation.otpTime = "OTP Time";
USRG.ASI.loginInformation.otpVerfiedNumber = "OTP Verfied Number";

USRG.ASI.userInformation = {};
USRG.ASI.userInformation.TableName = "USER INFORMATION";
USRG.ASI.userInformation.firstNameOfPerson = "First Name of Person";
USRG.ASI.userInformation.lastNameOfPerson = "Last Name of Person";
USRG.ASI.userInformation.professionalTitle = "Professional Title";
USRG.ASI.userInformation.gender = "Gender";
USRG.ASI.userInformation.nationality = "Nationality";
USRG.ASI.userInformation.emiratesId = "Emirates ID";
USRG.ASI.userInformation.uuid = "UUID";
USRG.ASI.userInformation.passportNumber = "Passport Number";
USRG.ASI.userInformation.passportIssueDate = "Passport Issue Date";
USRG.ASI.userInformation.passportIssueCountry = "Passport Issue Country";
USRG.ASI.userInformation.passportExpiryDate = "Passport Expiry Date";
USRG.ASI.userInformation.address = "Address";
USRG.ASI.userInformation.mobileNumberUaePass = "Mobile Number UAE Pass";
USRG.ASI.userInformation.mobileNumber = "Mobile Number";

USRG.ASI.otpVerfication = {};
USRG.ASI.otpVerfication.TableName = "OTP VERFICATION";
USRG.ASI.otpVerfication.otpPassword = "OTP Password";
USRG.ASI.otpVerfication.verfiedMobileNumber = "Verfied Mobile Number";

/*----------------------------------------------------ASIT----------------------------------------------*/
USRG.ASIT = {};
USRG.prototype.createPublicUser = function() {
	var utility = aa.proxyInvoker.newInstance("com.accela.security.Utility").getOutput();

	var publicUser = aa.publicUser.getPublicUserModel();
	var password = this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.password);
	// var name = this.getASI(USRG.ASI.userInformation.TableName,
	// USRG.ASI.userInformation.nameOfPerson);
	var Fname = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.firstNameOfPerson);
	var Lname = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.lastNameOfPerson);
	publicUser.setFirstName(Fname);
	publicUser.setLastName(Lname);
	publicUser.setEmail(String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.eMailAddress)));
	publicUser.setUserID(String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.userName)));
	publicUser.setPassword(utility.encryptPassword(password));
	publicUser.setAuditID(aa.getAuditID());
	publicUser.setAuditStatus("A");

	var question = String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.enterSecurityQuestion));

	var answer = String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.answer));
	publicUser.setPasswordRequestAnswer(String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.answer)));
	publicUser.setPasswordRequestQuestion(String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.enterSecurityQuestion)));
	publicUser.setNeedChangePassword('N');

	var result = aa.publicUser.createPublicUser(publicUser);

	var userSeqNum;

	if (result.getSuccess()) {
		userSeqNum = result.getOutput();
		var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()
		aa.publicUser.createPublicUserForAgency(userModel);
		var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
		userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(aa.getServiceProviderCode(), userSeqNum, "ADMIN");
		this.addContact(userSeqNum);

		Record.require('DAO');

		var fieledsParam = {};

		var dao = new DAO('PUBLICUSER_QUESTIONS');
		fieledsParam['USER_SEQ_NBR'] = userSeqNum;
		fieledsParam['QUESTION'] = question;
		fieledsParam['ANSWERS'] = answer;
		fieledsParam['SORT_ORDER'] = 1;
		fieledsParam['REC_DATE'] = new Date();
		fieledsParam['REC_FUL_NAM'] = aa.getAuditID();
		fieledsParam['REC_STATUS'] = 'A';
		dao.execInsert(fieledsParam);
	}

	return userSeqNum;
}
USRG.prototype.addContact = function(userSeqNum, recCapId) {
	if (recCapId == null) {
		recCapId = this.capId;
	}
	var contSeqNbr = null;
	var password = this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.password);

	var Fname = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.firstNameOfPerson);
	var Lname = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.lastNameOfPerson);

	var email = String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.eMailAddress));
	var emiratesId = String(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.emiratesId));
	var phoneNumber = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.mobileNumber)

//	var contact = Utils.getContactDataByEmailID(email);
//	if (contact != null) {
//		var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(this.getCapID(), contact);
//		if (!createCapContactResult.getSuccess()) {
//			throw "**ERROR create CapContact association :" + createCapContactResult.getErrorMessage();
//		} else {
//			// contSeqNbr = contact.getContactSeqNumber();
//			var contSeqNbr = "";
//			var contacts = this.getContacts();
//			if (contacts.length > 0) {
//				contSeqNbr = contacts[0].getCapContactModel().getRefContactNumber()
//			}
//		}
//	} else {
//		var contact = Utils.getContactDataByPhoneNumber(phoneNumber);
//		if (contact != null) {
//			var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(this.getCapID(), contact);
//			if (!createCapContactResult.getSuccess()) {
//				throw "**ERROR create CapContact association :" + createCapContactResult.getErrorMessage();
//			} else {
//				var contSeqNbr = "";
//				var contacts = this.getContacts();
//				if (contacts.length > 0) {
//					contSeqNbr = contacts[0].getCapContactModel().getRefContactNumber()
//				}
//			}
//		} else {
			var contact = Utils.getContactDataByEmirateID(emiratesId);
			if (contact != null) {
				contact.setFirstName(Fname)
				contact.setLastName(Lname)
				contact.setPhone1(phoneNumber)
				contact.setEmail(email)
				contact.setContactType("Applicant");
				var a = contact.getAttributes();
				var refContactNum = contact.getContactSeqNumber()

				var r = aa.people.editPeopleWithAttribute(contact, contact.getAttributes());

				if (!r.getSuccess())
					throw("WARNING: couldn't refresh reference people : " + r.getErrorMessage());
				
				//update internal contacts on records after registration
				this.updateInternalContacts(contact);
				
				var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(this.getCapID(), contact);
				if (!createCapContactResult.getSuccess()) {
					throw "**ERROR create CapContact association :" + createCapContactResult.getErrorMessage();
				} else {
					var contSeqNbr = "";
					var contacts = this.getContacts();
					if (contacts.length > 0) {
						contSeqNbr = contacts[0].getCapContactModel().getRefContactNumber()
					}
				}
			} else {
				var peopleScriptModel = aa.people.createPeopleModel().getOutput();

				var peopleModel = peopleScriptModel.getPeopleModel();
				peopleModel.setContactType("Applicant");
				peopleModel.setFirstName(Fname);
				peopleModel.setLastName(Lname);
				peopleModel.setEmail(email);
				peopleModel.setPhone1(phoneNumber);

				var country = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.nationality)
				var countryCode = Utils.getCountryCodeByName(country)
				peopleModel.setCountryCode(countryCode)
				peopleModel.setCountry(country)

				peopleModel.setTitle(String(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.professionalTitle)))

				var genderValue = "";
				var gender = String(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.gender))
				if (gender.toLowerCase() == "female") {
					genderValue = "F";
				} else {
					genderValue = "M";
				}
				peopleModel.setGender(genderValue)

				peopleModel.setPassportNumber(String(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.passportNumber)))

				var passportIssueDate = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.passportIssueDate);
				if (!Utils.isBlankOrNull(passportIssueDate)) {
					peopleModel.setBirthDate(new Date(passportIssueDate))
				}

				peopleModel.setBirthRegion(String(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.passportIssueCountry)))

				var passportExpiryDate = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.passportExpiryDate);

				if (!Utils.isBlankOrNull(passportExpiryDate)) {
					var passportExpiryDate = new Date(passportExpiryDate)

					passportExpiryDate = Utils.formatDate(passportExpiryDate, "dd/MM/yyyy")
					peopleModel.setDeceasedDate(new Date(passportExpiryDate))
				}

				peopleModel.setDriverLicenseNbr(String(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.uuid)))

				peopleModel.setStateIDNbr(emiratesId)

				var cModel = peopleModel.getCompactAddress();
				cModel.setAddressLine1(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.address))
				cModel.setCountry(country);
				cModel.setCountryCode(countryCode);
				peopleModel.setCompactAddress(cModel);

				peopleModel.setAuditStatus("Active");
				peopleModel.setServiceProviderCode(aa.getServiceProviderCode());

				var createPeopleResult = aa.people.createPeople(peopleModel);

				if (!createPeopleResult.getSuccess()) {
					throw "**ERROR create people:" + createPeopleResult.getErrorMessage();
				} else {
					contSeqNbr = peopleModel.getContactSeqNumber();
					var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(recCapId, peopleModel);

					if (!createCapContactResult.getSuccess()) {
						throw "**ERROR create people:" + createCapContactResult.getErrorMessage();
					}
				}
			}
//		}
//	}

	var linkResult = aa.licenseScript.associateContactWithPublicUser(userSeqNum, contSeqNbr);

	if (linkResult.getSuccess()) {
		logDebug("Successfully linked public user " + userSeqNum + " to contact " + contSeqNbr);
	} else {
		logDebug("Failed to link contact to public user");
	}

	return linkResult.getSuccess();

}

USRG.prototype.createLicenseProfessional = function(rlpId, rlpType, subGroup, skipAssociate) {
	if (typeof skipAssociate === 'undefined') {
		skipAssociate = false;
	}

	var sysDate = aa.date.getCurrentDate();

	var currentUserID = "ADMIN"

	var newLic = aa.licenseScript.createLicenseScriptModel();
	newLic.setBusinessName(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.eMailAddress));
	newLic.setCity(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.nationality));
	newLic.setState("AL");
	newLic.setPhone1(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.mobileNumber));
	newLic.setEMailAddress(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.eMailAddress));
	newLic.setAgencyCode(aa.getServiceProviderCode());
	newLic.setAuditDate(sysDate);
	newLic.setAuditID(currentUserID);
	newLic.setAuditStatus("A");
	newLic.setLicenseType(rlpType);
	newLic.setLicState("AL");
	newLic.setStateLicense(rlpId);
	myResult = aa.licenseScript.createRefLicenseProf(newLic);

	if (!skipAssociate) {
		var licResult = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), this.getCustomID());

		if (licResult.getSuccess()) {
			var licObj = licResult.getOutput();

			if (licObj != null) {
				licObj = licObj[0];
				this.associateLicensetoPublicUser(licObj);
			}
		}
	}

	return myResult;
}

USRG.prototype.associateLicensetoPublicUser = function(newLic) {
	try {
		var pu = aa.publicUser.getPublicUserByPUser(this.getCreatedBy());
		var publicUserModel = pu.getOutput();
		if (publicUserModel != null) {
			var res = aa.licenseScript.associateLpWithPublicUser(publicUserModel, newLic);
		}

	} catch (e) {
		Utils.printErrorLog("associateLicensetoPublicUser", e);
	}
}

USRG.prototype.registerUsers = function() {
	var userSeqNum = this.createPublicUser();
	this.setCreatedBy('PUBLICUSER' + userSeqNum);
	return userSeqNum;
}

USRG.prototype.addLicenseProf = function() {
	try {
		var lp = this.createLicenseProfessional(this.getCustomID(), 'Individual', USRG.ASI.userInformation.TableName).getOutput();

		this.addLicense(this.getCustomID());
		return lp;
	} catch (ex) {

	}
}

USRG.prototype.onApplicationSubmitAfter = function() {
}

USRG.prototype.createPublicUserUAE = function(uaePassUserInfo) {
	var publicUserModel = aa.publicUser.getPublicUserModel();
	publicUserModel.setFirstName(uaePassUserInfo.firstnameEN);
	publicUserModel.setLastName(uaePassUserInfo.lastnameEN);
	publicUserModel.setEmail(uaePassUserInfo.email);
	publicUserModel.setAuditID(aa.getAuditID());
	publicUserModel.setAuditStatus("A");
	publicUserModel.setNeedChangePassword('N');
	publicUserModel.setUserID(uaePassUserInfo.username);
	publicUserModel.setPasswordRequestAnswer(String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.answer)));
	publicUserModel.setPasswordRequestQuestion(String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.enterSecurityQuestion)));

	// set random password
	var hasedPassword = java.util.UUID.randomUUID().toString();
	var encryptPassRes = aa.publicUser.encryptPassword(hasedPassword);
	if (!encryptPassRes.getSuccess() || encryptPassRes.getOutput() == null) {
		//throw encryptPassRes.getErrorMessage();
	} else {
		hasedPassword = encryptPassRes.getOutput();
	}
	publicUserModel.setPassword(hasedPassword);

	var result = aa.publicUser.createPublicUser(publicUserModel);
	
	if (result.getSuccess()) {
		userSeqNum = result.getOutput();
		var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()
		
		// Security Question is not needed for UAE Pass users, put random question and answer
		// var question = String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.enterSecurityQuestion));
		// var answer = String(this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.answer));
		var question = "What is the agency code?";
		var answer = "SPSA";
		
		var fieledsParam = {};
		fieledsParam['USER_SEQ_NBR'] = userSeqNum;
		fieledsParam['QUESTION'] = question;
		fieledsParam['ANSWERS'] = answer;
		fieledsParam['SORT_ORDER'] = 1;
		fieledsParam['REC_DATE'] = new Date();
		fieledsParam['REC_FUL_NAM'] = aa.getAuditID();
		fieledsParam['REC_STATUS'] = 'A';
		
		Record.require('DAO');
		var dao = new DAO('PUBLICUSER_QUESTIONS');
		dao.execInsert(fieledsParam);
	}
	
	return result;
}

USRG.prototype.createContactUAE = function(uaePassUserInfo) {
	var peopleScriptModel = aa.people.createPeopleModel().getOutput();
	var peopleModel = peopleScriptModel.getPeopleModel();
	var compactAddress = peopleModel.getCompactAddress();
	compactAddress.setAddressLine1(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.address));
	compactAddress.setAddressLine3(uaePassUserInfo.uuid);
	peopleModel.setCompactAddress(compactAddress);
	peopleModel.setContactType("Applicant");
	peopleModel.setFirstName(uaePassUserInfo.firstnameEN);
	peopleModel.setLastName(uaePassUserInfo.lastnameEN);
	peopleModel.setEmail(uaePassUserInfo.email);
	peopleModel.setPhone1(uaePassUserInfo.mobile);
	
	if (!Utils.isBlankOrNull(uaePassUserInfo.UAEPassMobile)) {
		peopleModel.setPhone3(uaePassUserInfo.UAEPassMobile);
	}
	
	if (uaePassUserInfo.nationalityEN)
		peopleModel.setCountryCode(Utils.convertCountryCodeToIso2(uaePassUserInfo.nationalityEN));

	if (uaePassUserInfo.gender.toLowerCase() == "female") {
		peopleModel.setGender("F");
	} else if (uaePassUserInfo.gender.toLowerCase() == "male") {
		peopleModel.setGender("M");
	}
	
	peopleModel.setStateIDNbr(uaePassUserInfo.idn);
	peopleModel.setAuditStatus("A");
	peopleModel.setServiceProviderCode(aa.getServiceProviderCode());
	peopleModel.setTitle(uaePassUserInfo.titleEN);

	var createPeopleResult = aa.people.createPeople(peopleModel);

	if (!createPeopleResult.getSuccess()) {
		throw "**ERROR create people:" + createPeopleResult.getErrorMessage();
	}

	return peopleModel.getContactSeqNumber();
}

USRG.prototype.updateContactUAE = function(contact, uaePassUserInfo) {
	var seqNum = contact.getContactSeqNumber();
	
	contact.setAuditStatus("A");
	contact.setServiceProviderCode(aa.getServiceProviderCode());

	if (!Utils.isBlankOrNull(uaePassUserInfo.titleEN))
		contact.setTitle(uaePassUserInfo.titleEN);

	contact.setFirstName(uaePassUserInfo.firstnameEN);
	contact.setLastName(uaePassUserInfo.lastnameEN);
	contact.setEmail(uaePassUserInfo.email);

	var compactAddress = contact.getCompactAddress();
	compactAddress.setAddressLine1(this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.address));
	compactAddress.setAddressLine3(uaePassUserInfo.uuid);
	contact.setCompactAddress(compactAddress);

	contact.setStateIDNbr(uaePassUserInfo.idn);

	// Update UAE Phone Numbers Only in Phone 1
	if (!Utils.isBlankOrNull(uaePassUserInfo.mobile)) {
		contact.setPhone1(uaePassUserInfo.mobile);
	}
	if (!Utils.isBlankOrNull(uaePassUserInfo.UAEPassMobile)) {
		contact.setPhone3(uaePassUserInfo.UAEPassMobile);
	}

	if (!Utils.isBlankOrNull(uaePassUserInfo.nationalityEN))
		contact.setCountryCode(Utils.getCountryCodeByName(uaePassUserInfo.nationalityEN));

	if (uaePassUserInfo.gender.toLowerCase() == "female") {
		contact.setGender("F");
	} else if (uaePassUserInfo.gender.toLowerCase() == "male") {
		contact.setGender("M");
	}

	var updatePeopleResult = aa.people.editPeople(contact);
	if (!updatePeopleResult.getSuccess()) {
		throw "**ERROR Update Contact " + updatePeopleResult.getErrorMessage();
	}
	return aa.people.getPeople(seqNum).getOutput();
}

USRG.prototype.getContactByUUID = function(uuid) {
	var po = aa.people.getPeopleModel();
	po.setAuditStatus("A");
	po.setServiceProviderCode(aa.getServiceProviderCode());
	po.getCompactAddress().setAddressLine3(uuid);
	var ModelArray = aa.people.getPeopleByPeopleModel(po).getOutput();
	for ( var c in ModelArray) {
		var pModel = ModelArray[c].getPeopleModel();
		if (pModel) {
			return pModel;
		}
	}
	return null;
}

USRG.prototype.getPublicUserIdByContactNbr = function(contactSeqNbr) {
	try {
		var res = aa.publicUser.getPublicUserListByContactNBR(aa.util.parseLong(contactSeqNbr));
		if (!res.getSuccess()) {
			throw "Failed to get Public User by contact nbr " + contactNbr;
		}

		var puList = res.getOutput();
		if (!puList) {
			return null;
		}
		if (puList.size() == 0) {
			return null;
		}
		if (puList.size() > 1) {
			throw "Multiple users associated with Contact UAE Pass UUID";
		}

		return puList.get(0).getUserID() + "";
	} catch (e) {
		Utils.printErrorLog("Error at INCLUDE_USRG.getPublicUserByContactNbr: ", e, true);
	}

	return null;
}

USRG.prototype.createPublicUserForContact = function(contSeqNbr, uaePassUserInfo) {
	var res = this.createPublicUserUAE(uaePassUserInfo);
	if (!res.getSuccess()) {
		throw "**ERROR Creating Public User: " + res.getErrorMessage();
	}
	var userSeqNum = res.getOutput();
	var linkResult = aa.licenseScript.associateContactWithPublicUser(userSeqNum, contSeqNbr);
	if (linkResult.getSuccess()) {
		Utils.printLog("Successfully linked public user " + userSeqNum + " to contact " + contSeqNbr);
	} else {
		throw "**ERROR failed to associate public user " + userSeqNum + " to contact " + contSeqNbr + " " + linkResult.getErrorMessage();
	}

	var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput();
	aa.publicUser.createPublicUserForAgency(userModel);
	
	var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
	userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(aa.getServiceProviderCode(), userSeqNum, "ADMIN");

	return userSeqNum;
}

USRG.prototype.onConvertToRealCapUAE = function() {
	var uaePassUserInfo = {};
	uaePassUserInfo.uuid = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.uuid);
	uaePassUserInfo.idn = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.emiratesId);
	uaePassUserInfo.firstnameEN = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.firstNameOfPerson);
	uaePassUserInfo.lastnameEN = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.lastNameOfPerson);
	uaePassUserInfo.titleEN = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.professionalTitle);
	uaePassUserInfo.gender = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.gender);
	uaePassUserInfo.nationalityEN = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.nationality);
	uaePassUserInfo.mobile = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.mobileNumber);
	uaePassUserInfo.UAEPassMobile = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.mobileNumberUaePass);
	uaePassUserInfo.email = this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.eMailAddress);
	uaePassUserInfo.username = this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.userName);

	var publicUserId = null;

	// Get contact by UUID
	var uContact = this.getContactByUUID(uaePassUserInfo.uuid);
	if (uContact == null) {
		// if not found, try to get contact by IDN
		uContact = Utils.getContactDataByEmirateID(uaePassUserInfo.idn);
	}
	if (uContact != null) {
		// Get associated PU
		publicUserId = this.getPublicUserIdByContactNbr(uContact.getContactSeqNumber());
		if (publicUserId != null) {
			throw "Already linked with other user";
		} else {
			// Create Public User
			publicUserId = this.createPublicUserForContact(uContact.getContactSeqNumber(), uaePassUserInfo);
		}
		// Update Contact Information
		uContact = this.updateContactUAE(uContact, uaePassUserInfo);
		
		//Jason Institute License Number - start
		if(!Utils.isBlankOrNull(uContact.getDriverLicenseNbr())){
			Utils.printLog("Institute License Number>>" + uContact.getDriverLicenseNbr());
			var getLpResult = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), uContact.getDriverLicenseNbr());
			if(getLpResult.getSuccess()){
				var lpModel = getLpResult.getOutput()[0];
				var publicUserModel =aa.publicUser.getPublicUserByUserId(publicUserId).getOutput();
				var res = aa.licenseScript.associateLpWithPublicUser(publicUserModel, lpModel);
				if(!res.getSuccess()){
					Utils.printLog("Error in INCLUDE_USRG>> associateLpWithPublicUser>>" + res.getErrorMessage());
				}
			}
		}
		//Jason Institute License Number - end
		
		//update internal contacts on records after registration
		this.updateInternalContacts(uContact);
		
	} else {
		// Create new Contact and Public User
		var newContSeqNbr = this.createContactUAE(uaePassUserInfo);
		uContact = aa.people.getPeople(newContSeqNbr).getOutput();
		publicUserSeqNum = this.createPublicUserForContact(newContSeqNbr, uaePassUserInfo);
	}
	
	var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(this.getCapID(), uContact);
	if (!createCapContactResult.getSuccess()) {
		throw "**ERROR create CapContact association :" + createCapContactResult.getErrorMessage();
	}
	
	this.addLicenseProf();

	this.updateTaskAndHandleDisposition("Review", "Auto Approve", "Updated by the system");
	this.updateStatus("Completed");
	
	// Send Notification
	eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
	var emailsArr = [];
	var emailParameters = aa.util.newHashtable();
	
	var firstNameEN = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.firstNameOfPerson) + "";
	var lastNameEN = this.getASI(USRG.ASI.userInformation.TableName, USRG.ASI.userInformation.lastNameOfPerson) + "";
	addParameter(emailParameters, "$$FULL_NAME$$", firstNameEN + " " + lastNameEN);
	var contactArr = aa.people.getCapContactByCapID(this.getCapID()).getOutput();
	if (contactArr.length > 0) {
		for (var q = 0; q < contactArr.length; q++) {
			var contactOBj = new Object();
			var contactModel = contactArr[q].getCapContactModel();
			var contactType = contactModel.getContactType();
			var email = contactModel.getEmail();
			if (email && email != "") {
				emailsArr.push(email);
			}
		}

		var gn = new GlobalNotifications(capId);
		gn.sendNotification("Custom", "*", "UAEPASS", emailParameters, null, null, null, emailsArr);
	}
	
	return publicUserSeqNum;
}

USRG.prototype.onConvertToRealCapDefault = function() {
	eval(getScriptText("PUBLICUSER_ACTIVATE_RESET_PASSWORD"));
	var userSeqNum = this.registerUsers();
	this.addLicenseProf();

	this.updateTaskAndHandleDisposition("Review", "Auto Approve", "Updated by the system");
	this.updateStatus("Completed")

	capId = this.getCapID();
	var url = getResetURL(userSeqNum);

	// Send Notification
	eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
	var emailsArr = [];
	var emailParameters = aa.util.newHashtable();
	addParameter(emailParameters, "$$URL$$", url);
	var contactArr = aa.people.getCapContactByCapID(this.getCapID()).getOutput();
	if (contactArr.length > 0) {
		for (var q = 0; q < contactArr.length; q++) {
			var contactOBj = new Object();
			var contactModel = contactArr[q].getCapContactModel();
			var contactType = contactModel.getContactType();
			var email = contactModel.getEmail();
			if (email && email != "") {
				emailsArr.push(email);
			}
		}

		var gn = new GlobalNotifications(capId);
		gn.sendNotification("Custom", "*", "*", emailParameters, null, null, null, emailsArr);
	}
}

USRG.prototype.onConvertToRealCAPAfter = function() {
	var userType = this.getASI(USRG.ASI.loginInformation.TableName, USRG.ASI.loginInformation.usertype);
	if (userType == "UAEPASS") {
		this.onConvertToRealCapUAE();
	} else {
		this.onConvertToRealCapDefault();
	}
}

USRG.prototype.onWorkflowTaskUpdateBefore = function() {
	var validEscalateUser = this.validateEscalateUser(wfTask, wfStatus, wfProcess);
	if (validEscalateUser != "") {
		cancel = true;
		showMessage = true;
		showDebug = false;
		message = validEscalateUser;
	}
	
}

USRG.prototype.updateInternalContacts = function(contact) {
	contSeqNbr = contact.getContactSeqNumber();
	var useEmiratesId = true;
	var key = contact.getStateIDNbr();
	if (Utils.isBlankOrNull(key)) {
		useEmiratesId = false;
		key = contact.getPassportNumber();
	}

	var psm = aa.people.createPeopleModel().getOutput()

	var peopleModel = psm.getPeopleModel();
	psm.setContactSeqNumber(contSeqNbr);

	var capIds = aa.people.getCapIDsByRefContact(psm).getOutput()
	aa.print(capIds.length)
	for ( var x in capIds) {
		var capId = capIds[x].getCapID();
		var record = new Record(capId)

		record = new Record(record.getCustomID());

		var recordContacts = record.getContacts()

		for ( var y in recordContacts) {
			seqNumber = recordContacts[y].getCapContactModel()
					.getRefContactNumber();

			if (seqNumber == contSeqNbr) {

				recordContacts[y].getCapContactModel().setInternalUserFlag("");
				aa.people
						.editCapContact(recordContacts[y].getCapContactModel());
				break;
			}
		}

		var capType = record.getCapType();
		if (capType == "OSHJ/Classification/Entity Registration/ERCL"
				|| capType == "OSHJ/Profile/Entity Profile/EPRF"
				|| capType == "OSHJ/Profile/Update Entity Profile/UEPR") {
			var representatives = record.getASIT("REPRESENTATIVES DETAILS");
			
			var fieldName = "Emirates ID";
			if (!useEmiratesId) {
				fieldName = "Passport Number"
			}
			for ( var i in representatives) {
				if (representatives[i][fieldName] == key) {
					aa.print("Is Registred udated for " + record.getCustomID())
					record.updateASITColumn("REPRESENTATIVES DETAILS", i,
							"Is Registered", "CHECKED");
				}

			}
		}
		//Jason Institute License Number - start
		if (capType == "SALAMA/INSTITUTE/Institute Registration/IRNE"
			|| capType == "SALAMA/INSTITUTE/NOC To Operate/NOCO"
			|| capType == "SALAMA/INSTITUTE/Modify NoC to Operate/MNOP"){
			var representatives = record.getASIT("REPRESENTATIVE DETAILS");
			
			var fieldName = "Emirates ID";
			for ( var i in representatives) {
				if (representatives[i][fieldName] == key) {
					record.updateASITColumn("REPRESENTATIVE DETAILS", i,"Is Registered", "CHECKED");
				}

			}
		}
		//Jason Institute License Number - end
	}

}