/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_CONT.js
| Event			: N/A
|
| Usage			: contains all the record's specific script
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 13/11/2022 10:39:36
|
/------------------------------------------------------------------------------------------------------*/
if (typeof SHCC === "undefined"){
	eval(getScriptText("INCLUDE_SHCC"));
}

function CONT(capId){
	Record.call(this, capId);
};
CONT.prototype = Object.create(Record.prototype);
CONT.prototype.constructor = CONT;
/*----------------------------------------------------ASI-----------------------------------------------*/
CONT.RECORD_TYPE = "Objects/General/Contact Object/CONT";
CONT.ASI = {};
CONT.ASI.referenceContact = {};
CONT.ASI.referenceContact.TableName = "REFERENCE CONTACT";
CONT.ASI.referenceContact.refContactId = "Ref Contact ID";
CONT.ASI.referenceContact.contactType = "Contact Type";

CONT.ASI.roles = {};
CONT.ASI.roles.TableName = "ROLES";
CONT.ASI.roles.applicant = "Applicant";
CONT.ASI.roles.businessConsultantDirector = "Business Consultant Director";
CONT.ASI.roles.businessConsultantIndividual = "Business Consultant Individual";
CONT.ASI.roles.businessConsultantManager = "Business Consultant Manager";
CONT.ASI.roles.businessConsultantOwnerInvestor = "Business Consultant Owner-Investor";
CONT.ASI.roles.businessConsultantSecretary = "Business Consultant Secretary";
CONT.ASI.roles.businessConsultantTypist = "Business Consultant Typist";
CONT.ASI.roles.designConsultant = "Design Consultant";
CONT.ASI.roles.director = "Director";
CONT.ASI.roles.employee = "Employee";
CONT.ASI.roles.healthProfessional = "Health Professional";
CONT.ASI.roles.manager = "Manager";
CONT.ASI.roles.owner = "Owner";
CONT.ASI.roles.ownerInvestor = "Owner-Investor";
CONT.ASI.roles.secretary = "Secretary";
CONT.ASI.roles.shareholder = "Shareholder";
CONT.ASI.roles.shareholderPartner = "Shareholder-Partner";
CONT.ASI.roles.supervisingConsultant = "Supervising Consultant";
CONT.ASI.roles.typist = "Typist";
CONT.ASI.roles.companyPro = "Company PRO";
CONT.ASI.roles.consultantEngineer = "Consultant Engineer";
CONT.ASI.roles.contractorEngineer = "Contractor Engineer";

CONT.ASI.individual = {};
CONT.ASI.individual.TableName = "INDIVIDUAL";
CONT.ASI.individual.doesTheBeneficiaryHaveAResidenceVisa = "Does the Beneficiary have a residence Visa";
CONT.ASI.individual.currentNationality = "Current Nationality";
CONT.ASI.individual.beneficiaryCurrentResidenceVisaStatus = "Beneficiary current Residence Visa Status";
CONT.ASI.individual.didTheApplicantVisitEnterUaeInThePast = "Did the applicant visit/enter  UAE in the past?";
CONT.ASI.individual.didApplicantPossessEidInThePast = "Did applicant possess EID in the past";
CONT.ASI.individual.isTheEidNumberAvailable = "Is the EID Number available?";
CONT.ASI.individual.eidNumber = "EID Number";
CONT.ASI.individual.eidIssueDate = "EID Issue Date";
CONT.ASI.individual.eidExpiryDate = "EID Expiry Date";
CONT.ASI.individual.unifiedIdentificationNumberUid = "Unified Identification Number (UID)";
CONT.ASI.individual.firstNameEn = "First Name EN";
CONT.ASI.individual.middleNameEn = "Middle Name EN";
CONT.ASI.individual.lastNameEn = "Last Name EN";
CONT.ASI.individual.firstNameAr = "First Name AR";
CONT.ASI.individual.middleNameAr = "Middle Name AR";
CONT.ASI.individual.lastNameAr = "Last Name AR";
CONT.ASI.individual.fathersNameAr = "Fathers Name AR";
CONT.ASI.individual.mothersNameAr = "Mothers Name AR";
CONT.ASI.individual.fathersNameEn = "Fathers Name EN";
CONT.ASI.individual.mothersNameEn = "Mothers Name EN";
CONT.ASI.individual.givenFullNameEn = "Given/Full Name EN";
CONT.ASI.individual.givenFullNameAr = "Given/Full Name AR";
CONT.ASI.individual.maritalStatus = "Marital Status";
CONT.ASI.individual.passportIssueDate = "Passport Issue Date";
CONT.ASI.individual.localBuildingName = "Local Building Name";
CONT.ASI.individual.localFlatNumber = "Local Flat Number";
CONT.ASI.individual.permanentCountry = "Permanent Country";
CONT.ASI.individual.profession = "Profession";
CONT.ASI.individual.qualification = "Qualification";
CONT.ASI.individual.religion = "Religion";
CONT.ASI.individual.faith = "Faith";
CONT.ASI.individual.visaReason = "Visa Reason";
CONT.ASI.individual.previousNationality = "Previous Nationality";
CONT.ASI.individual.gender = "Gender";
CONT.ASI.individual.dateOfBirth = "Date of Birth";
CONT.ASI.individual.passportType = "Passport Type";
CONT.ASI.individual.passportNumber = "Passport Number";
CONT.ASI.individual.passportExpiryDate = "Passport Expiry Date";
CONT.ASI.individual.passportIssueCountry = "Passport Issue Country";
CONT.ASI.individual.passportIssuePlace = "Passport Issue Place";
CONT.ASI.individual.uaeMobileNo = "UAE Mobile No";
CONT.ASI.individual.uaePhoneNumber = "UAE Phone Number";
CONT.ASI.individual.permanentMobile = "Permanent Mobile";
CONT.ASI.individual.email = "Email";
CONT.ASI.individual.poBox = "PO Box";
CONT.ASI.individual.legalGuardian = "Legal Guardian";
CONT.ASI.individual.pleaseProvideTheRelationOfTheLegalGuardianWithThisContact = "Please provide the relation of the Legal Guardian with this contact";
CONT.ASI.individual.addressInUaeCity = "Address In UAE-City";
CONT.ASI.individual.addressInUaeEmirate = "Address In UAE-Emirate";
CONT.ASI.individual.applicantLocationOutsideUae = "Applicant Location Outside Uae";
CONT.ASI.individual.detailedAddress = "Detailed Address";
CONT.ASI.individual.currentlyLocated = "Currently Located";
CONT.ASI.individual.residentVisaNumber = "Resident Visa Number";
CONT.ASI.individual.residentVisaIssueDate = "Resident Visa Issue Date";
CONT.ASI.individual.residentVisaExpiryDate = "Resident Visa Expiry Date";
CONT.ASI.individual.passportIssuePlaceArabic = "Passport Issue Place Arabic";
CONT.ASI.individual.placeOfBirthEnglish = "Place of Birth English";
CONT.ASI.individual.placeOfBirthArabic = "Place of Birth Arabic";
CONT.ASI.individual.birthCountry = "Birth Country";
CONT.ASI.individual.emirateWhereThePoBoxIsLocated = "Emirate where the PO Box is located";

CONT.ASI.nonIndividual = {};
CONT.ASI.nonIndividual.TableName = "NON-INDIVIDUAL";
CONT.ASI.nonIndividual.companyNameEnglish = "Company Name English";
CONT.ASI.nonIndividual.companyNameArabic = "Company Name Arabic";
CONT.ASI.nonIndividual.companyRegType = "Company Reg. Type";
CONT.ASI.nonIndividual.otherRegistrationType = "Other Registration Type";
CONT.ASI.nonIndividual.companyRegNo = "Company Reg. No.";
CONT.ASI.nonIndividual.companyNationality = "Company Nationality";
CONT.ASI.nonIndividual.companyIsFromGccNonUae = "Company Is From GCC (Non-UAE)";
CONT.ASI.nonIndividual.emirate = "Emirate";
CONT.ASI.nonIndividual.companyInMainlandOfUae = "Company in Mainland of UAE";
CONT.ASI.nonIndividual.companyInFreeZoneOfUae = "Company in Free Zone of UAE";
CONT.ASI.nonIndividual.freeZoneName = "Free Zone Name";
CONT.ASI.nonIndividual.otherFreeZone = "Other Free Zone";
CONT.ASI.nonIndividual.addressLine1 = "Address Line 1";
CONT.ASI.nonIndividual.addressLine2 = "Address Line 2";
CONT.ASI.nonIndividual.city = "City";
CONT.ASI.nonIndividual.pOBoxZipCodePinCode = "P.O.Box - Zip Code - PIN Code";
CONT.ASI.nonIndividual.webSite = "Web Site";
CONT.ASI.nonIndividual.eMail = "E-mail";
CONT.ASI.nonIndividual.fax = "Fax";
CONT.ASI.nonIndividual.companyRepresentative = "Company Representative";

/*----------------------------------------------------ASIT----------------------------------------------*/
CONT.ASIT = {};
/*-------------------------------------------SPECIFIC CODE----------------------------------------------*/

CONT.CreateNewContact = function(contObj){
	var res = {};
	var contID = Record.createNew("Objects/General/Contact Object/CONT", "Initial Contact Created");
	var contRecord = new Record(contID);
	aa.print(contRecord.getCustomID())
	var obj = contObj.individual
	var subGroupName = "INDIVIDUAL";
	if (obj == undefined){
		obj = contObj.nonIndividual
		subGroupName = "NON-INDIVIDUAL";
	}
	printLog("CreateNewContact :: contObj.role :: " + contObj.role)
	contRecord.editASI("ROLES", "Applicant", "CHECKED");
	contRecord.editASI("ROLES", contObj.role, "CHECKED");
	contRecord.editASI("REFERENCE CONTACT", "Contact Type", subGroupName);
	var appName = "";
	var peopleScriptModel = aa.people.createPeopleModel().getOutput();
	var peopleModel = peopleScriptModel.getPeopleModel();
	peopleModel.setServiceProviderCode(aa.getServiceProviderCode());
	peopleModel.setContactType(contObj.role+"");
	for (var key in obj){
		if (obj.hasOwnProperty(key)){
			var val = obj[key];
			printLog("CreateNewContact :: key :: " + key)
			printLog("CreateNewContact :: val :: " + val)
			contRecord.editASI(subGroupName, key, val);
			switch (key){
				case "First Name EN":
					peopleModel.setFirstName(obj[key]);
					break;
				case "Middle Name EN":
					peopleModel.setMiddleName(obj[key]);
					break;
				case "Last Name EN":
					peopleModel.setLastName(obj[key]);
					break;
				case "Given/Full Name EN":
					peopleModel.setFullName(obj[key]);
					appName = obj[key];
					break;
				case "EID Number":
					peopleModel.setStateIDNbr(obj[key]);
					break;
				case "Permanent Mobile":
					peopleModel.setPhone1(obj[key]);
					break;
				case "Gender":
					if (obj[key] == "Male"){
						peopleModel.setGender("M");
					}
					if (obj[key] == "Female"){
						peopleModel.setGender("F");
					}
					break;
				case "Email":
					peopleModel.setEmail(obj[key]);
					break;
				case "Current Nationality":
					peopleModel.setCountryCode(Utils.getCountryCodeByName(obj[key]));
					break;
				case "Date of Birth":
					peopleModel.setBirthDate(new Date(obj[key]));
					break;
				case "Company Name English":
					peopleModel.setBusinessName(obj[key]);
					appName = obj[key];
					break;
				case "Company Reg. Type":
					peopleModel.setBusName2(obj[key]);
					break;
				case "Company Reg. No.":
					peopleModel.setBusinessName2(obj[key]);
					break;
				case "Company Nationality":
					peopleModel.setCountryCode(Utils.getCountryCodeByName(obj[key]));
					break;
				case "E-mail":
					peopleModel.setEmail(obj[key]);
					break;
			}
		}
	}
	peopleModel.setAuditDate(aa.util.now());
	peopleModel.setAuditStatus("Active");
	var createPeopleResult = aa.people.createPeople(peopleModel);
	contRecord.editASI("REFERENCE CONTACT", "Ref Contact ID", peopleModel.getContactSeqNumber());
	var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(contRecord.getCapID(), peopleModel);
	contRecord.setApplicationName(appName);
	res.sucess = true;
	res.ALTID = contRecord.getCustomID()
	res.REFCONTID = peopleModel.getContactSeqNumber();
	return res;
}

CONT.createUpdateContact = function(contObj){
	
	var contactRecordObject = null;
	var conRec = CONT.getContactRecord(true, null, contObj.email, null, null, null);
	if (conRec){
		var contRecord = new CONT(conRec.getCustomID());
		contRecord.UpdateContact(contObj);
		var ContactSeqNo = contRecord.getASI(CONT.ASI.referenceContact.TableName, CONT.ASI.referenceContact.refContactId, "");
		var email = contRecord.getASI(CONT.ASI.individual.TableName, CONT.ASI.individual.email, "");
		var refContExist = CONT.getContactByEmail(email);
		
		if (refContExist.isExist != false && refContExist.pm != null){
			var peopleModel = refContExist.pm.getPeopleModel();
			//CONT.createPublicContact(peopleModel, ContactSeqNo, contObj.sendEmailLoginInfo, conRec.getCustomID());
			var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(contRecord.getCapID(), peopleModel);
			CONT.createPublicUsers(contObj.sendEmailLoginInfo, contRecord.getCustomID());
			contactRecordObject = contRecord;
		}
	} else {
		var res = {};
		var contID = Record.createNew("Objects/General/Contact Object/CONT", "Initial Contact Created");
		var contRecord = new Record(contID);
		var obj = contObj.individual
		var subGroupName = "INDIVIDUAL";
		if (obj == undefined){
			obj = contObj.nonIndividual
			subGroupName = "NON-INDIVIDUAL";
		}
		contRecord.editASI("ROLES", "Applicant", "CHECKED");
		contRecord.editASI("ROLES", contObj.role, "CHECKED");
		contRecord.editASI("REFERENCE CONTACT", "Contact Type", subGroupName);
		var appName = "";
		var peopleModel = null;
		var peopleScriptModel = null;
		var refContactExist = false;

		if (!Utils.isNullOrUndefined(contObj.email) && Utils.hasValue(contObj.email)){
			
			var refContExist = CONT.getContactByEmail(contObj.email);
			if (refContExist.isExist != false && refContExist.pm != null){
				peopleModel = refContExist.pm.getPeopleModel();
				refContactExist = true;
			} else {
				peopleScriptModel = aa.people.createPeopleModel().getOutput();
				peopleModel = peopleScriptModel.getPeopleModel();
				peopleModel.setServiceProviderCode(aa.getServiceProviderCode());
			}
		} else {
			peopleScriptModel = aa.people.createPeopleModel().getOutput();
			peopleModel = peopleScriptModel.getPeopleModel();
			peopleModel.setServiceProviderCode(aa.getServiceProviderCode());
		}


		//peopleModel.setContactType('Applicant');
		peopleModel.setContactType(contObj.role);
		for (var key in obj){
			if (obj.hasOwnProperty(key)){
				var val = obj[key];
				contRecord.editASI(subGroupName, key, val);
				switch (key){
					case "First Name EN":
						peopleModel.setFirstName(obj[key]);
						break;
					case "Middle Name EN":
						peopleModel.setMiddleName(obj[key]);
						break;
					case "Last Name EN":
						peopleModel.setLastName(obj[key]);
						break;
					case "Given/Full Name EN":
						peopleModel.setFullName(obj[key]);
						appName = obj[key];
						break;
					case "EID Number":
						peopleModel.setStateIDNbr(obj[key]);
						break;
					case "Permanent Mobile":
						peopleModel.setPhone1(obj[key]);
						break;
					case "Gender":
						if (obj[key] == "Male"){
							peopleModel.setGender("M");
						}
						if (obj[key] == "Female"){
							peopleModel.setGender("F");
						}
						break;
					case "Email":
						peopleModel.setEmail(obj[key]);
						break;
					case "Date of Birth":
						peopleModel.setBirthDate(new Date(obj[key]));
						break;
					case "Company Name English":
						peopleModel.setBusinessName(obj[key]);
						appName = obj[key];
						break;
					case "Company Reg. Type":
						peopleModel.setBusName2(obj[key]);
						break;
					case "Company Reg. No.":
						peopleModel.setBusinessName2(obj[key]);
						break;
					case "Company Nationality":
						peopleModel.setCountryCode(Utils.getCountryCodeByName(obj[key]));
						break;
					case "E-mail":
						peopleModel.setEmail(obj[key]);
						break;
					case "UUID":
						var compactAddress = peopleModel.getCompactAddress();
						compactAddress.setAddressLine3(obj[key]);
						peopleModel.setCompactAddress(compactAddress);
						break;
					case "SPUUID":
						var compactAddress = peopleModel.getCompactAddress();
						compactAddress.setAddressLine2(obj[key]);
						peopleModel.setCompactAddress(compactAddress);
						
						break;
						
				}
			}
		}
		peopleModel.setAuditDate(aa.util.now());
		peopleModel.setAuditStatus("A");

		var ContactSeqNo = "";
		if (refContactExist != true){
			var createPeopleResult = aa.people.createPeople(peopleModel);
			contRecord.editASI("REFERENCE CONTACT", "Ref Contact ID", peopleModel.getContactSeqNumber());
			var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(contRecord.getCapID(), peopleModel);
			
			contRecord.setApplicationName(appName);
			res.sucess = true;
			res.ALTID = contRecord.getCustomID()
			res.REFCONTID = peopleModel.getContactSeqNumber();
			ContactSeqNo = res.REFCONTID;
		} else {
			var createCapContactResult = aa.people.createCapContactWithRefPeopleModel(contRecord.getCapID(), peopleModel);
			ContactSeqNo = peopleModel.getContactSeqNumber(); //contObj.seqNo;
			peopleModel.setContactSeqNumber(ContactSeqNo);
			var a = peopleModel.getAttributes();
			if (a){
				var ai = a.iterator();
				while (ai.hasNext()){
					var at = ai.next();
					at.setContactNo(ContactSeqNo);
				}
			}

			var resOfEditPeopleWithAttribute = aa.people.editPeopleWithAttribute(peopleModel, peopleModel.getAttributes());
			contRecord.editASI("REFERENCE CONTACT", "Ref Contact ID", ContactSeqNo);

		}
		//CONT.createPublicContact(peopleModel, ContactSeqNo, contObj.sendEmailLoginInfo, contRecord.getCustomID());
		CONT.createPublicUsers(contObj.sendEmailLoginInfo, contRecord.getCustomID());
		contactRecordObject = contRecord;
	}

	return contactRecordObject;
}

CONT.createPublicUsers = function(sendEmailLoginInfo, contRecAltID){

	if (typeof CONT === "undefined"){
		aa.includeScript("INCLUDE_CONT");
	}

	var userPassword = String(Math.floor(1000 + Math.random() * 9000)) + "";
	var contRec = new CONT(contRecAltID);
	var contacts = contRec.getContacts();
	for (cont in contacts){
		var email = contacts[cont].getEmail();
		var publicUserObj = publicUser = aa.publicUser.getPublicUserByUserId(email).getOutput();
		if (Utils.isBlankOrNull(publicUserObj)){
			//contRec.createPublicUserFromContactRecord(contacts[cont], null);
			contRec.createPublicUserFromContactRecord(contacts[cont], null, userPassword);
			if (sendEmailLoginInfo){
				// Send Email with login Info
				if (typeof RecordNotification === "undefined"){
					eval(getScriptText("INCLUDE_RECORD_NOTIFICATION"));
				}

				var recordNot = new RecordNotification(contRecAltID);
				recordNot.addToEmail(String(email));
				recordNot.addNotificationParameter("$$UserName$$", String(email));
				recordNot.addNotificationParameter("$$Password$$", userPassword);
				recordNot.sendNotification("Custom", "*", "Send Login Info");
			}
		}
	}
}

CONT.prototype.createPublicUserFromContactRecord = function(contact, lp, password){
	var servProvCode = aa.getServiceProviderCode();
	var refContactNum;
	// get the reference contact ID. We will use to connect to the new public user
	refContactNum = contact.getCapContactModel().getRefContactNumber();
	// check to see if public user exists already based on email address
	var getUserResult = aa.publicUser.getPublicUserByEmail(contact.getEmail())
	if (getUserResult.getSuccess() && getUserResult.getOutput()){
		userModel = getUserResult.getOutput();
		logDebug("CreatePublicUserFromContact: Found an existing public user: " + userModel.getUserID());
	}

	if (!userModel) // create one
	{
		logDebug("CreatePublicUserFromContact: creating new user based on email address: " + contact.getEmail());
		var publicUser = aa.publicUser.getPublicUserModel();
		publicUser.setFirstName(contact.getFirstName());
		publicUser.setLastName(contact.getLastName());
		publicUser.setEmail(contact.getEmail());
		publicUser.setUserID(contact.getEmail());
		publicUser.setPassword(com.accela.security.Utility().encryptPassword(password));
		publicUser.setPasswordRequestQuestion('Password');
		publicUser.setPasswordRequestAnswer(password);
		publicUser.setAuditID("PublicUser");
		publicUser.setNeedChangePassword('Y');
		publicUser.setAuditStatus("A");
		publicUser.setCellPhone(contact.getCapContactModel().getPeople().getPhone1());

		var result = aa.publicUser.createPublicUser(publicUser);
		if (result.getSuccess()){

			logDebug("Created public user " + contact.getEmail() + "  sucessfully.");
			var userSeqNum = result.getOutput();
			var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput();

			// create for agency
			aa.publicUser.createPublicUserForAgency(userModel);

			// activate for agency
			var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput();
			userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(servProvCode, userSeqNum, "ADMIN");

			if (lp != null){
				aa.licenseScript.associateLpWithPublicUser(publicUser, lp);
			}

			// send Activate email
			aa.publicUser.sendActivateEmail(userModel, true, true);

			// send another email
			aa.publicUser.sendPasswordEmail(userModel);
		} else {
			logDebug("**Warning creating public user " + contact.getEmail() + "  failure: " + result.getErrorMessage());
			return null;
		}
	}

	// Now that we have a public user let's connect to the reference contact

	if (refContactNum){
		logDebug("CreatePublicUserFromContact: Linking this public user with reference contact : " + refContactNum);
		aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), refContactNum);
	}

	return userModel;
}

CONT.prototype.UpdateContact = function(contObj){
	var obj = contObj.individual
	var subGroupName = "INDIVIDUAL";
	if (obj == undefined){
		obj = contObj.nonIndividual
		subGroupName = "NON-INDIVIDUAL";
	}
	for (var key in obj){
		if (obj.hasOwnProperty(key)){
			var val = obj[key];
			this.editASI(subGroupName, key, val);
		}
	}
}
CONT.SearchContacts = function(searchObj){
	var SELECT = 'Select per.B1_ALT_ID as ALTID from B1PERMIT per ';
	var WHERE = " where per.SERV_PROV_CODE = 'SHCC' AND per.B1_PER_GROUP = 'Objects' AND per.B1_PER_TYPE = 'General'	and per.B1_PER_SUB_TYPE = 'Contact Object' AND per.B1_PER_CATEGORY = 'CONT'";
	var obj = searchObj.individual
	var subGroupName = "INDIVIDUAL";
	if (obj == undefined){
		obj = searchObj.nonIndividual
		subGroupName = "NON-INDIVIDUAL";
	}
	for (var key in obj){
		if (obj.hasOwnProperty(key)){
			var val = obj[key];
			var bchkbox = String(key).replace(/\s/g, "").replace(/[^a-zA-Z]/g, "");
			SELECT += " left join BCHCKBOX " + bchkbox + " on ";
			SELECT += " " + bchkbox + ".SERV_PROV_CODE = per.SERV_PROV_CODE ";
			SELECT += " AND " + bchkbox + ".B1_PER_ID1 = per.B1_PER_ID1 ";
			SELECT += " AND " + bchkbox + ".B1_PER_ID2 = per.B1_PER_ID2 ";
			SELECT += " AND " + bchkbox + ".B1_PER_ID3 = per.B1_PER_ID3 ";
			SELECT += " AND " + bchkbox + ".B1_CHECKBOX_GROUP = 'APPLICATION' ";
			SELECT += " AND " + bchkbox + ".B1_PER_SUB_TYPE = 'Contact Object' ";
			SELECT += " AND " + bchkbox + ".B1_CHECKBOX_TYPE = '" + subGroupName + "' ";
			SELECT += " AND " + bchkbox + ".B1_CHECKBOX_DESC = '" + key + "'";
			WHERE += " AND " + bchkbox + ".B1_CHECKLIST_COMMENT = '" + obj[key] + "'";

		}
	}
	
	var res = SHCC.runSQL(SELECT + WHERE, null);
	return res.toArray();
}

CONT.getContactByEmail = function(email){
	var objResult = new Object();
	objResult.isExist = false;
	objResult.pm = null;

	var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
	qryPeople.setEmail(email);
	var r = aa.people.getPeopleByPeopleModel(qryPeople);
	if (!r.getSuccess()){
		java.lang.System.out.println("WARNING: error searching for people : " + r.getErrorMessage());
		objResult.isExist = false;
	}
	var peopResult = r.getOutput();
	if (peopResult.length > 0){
		objResult.isExist = true;
		objResult.pm = peopResult[0];
	} else {
		java.lang.System.out.println('Contact NOT Found');
		objResult.isExist = false;
	}

	return objResult;
}

CONT.getContactRolesBySYSID = function(contID){
	var SQL = "";
	SQL += " Select BCHKBX.B1_CHECKBOX_DESC as ROLES from B1PERMIT per ";
	SQL += " inner join BCHCKBOX BCHKBX on ";
	SQL += " BCHKBX.SERV_PROV_CODE = per.SERV_PROV_CODE ";
	SQL += " AND BCHKBX.B1_PER_ID1 = per.B1_PER_ID1 ";
	SQL += " AND BCHKBX.B1_PER_ID2 = per.B1_PER_ID2 ";
	SQL += " AND BCHKBX.B1_PER_ID3 = per.B1_PER_ID3 ";
	SQL += " AND BCHKBX.B1_CHECKBOX_GROUP = 'APPLICATION' ";
	SQL += " AND BCHKBX.B1_PER_SUB_TYPE = 'Contact Object' ";
	SQL += " AND BCHKBX.B1_CHECKBOX_TYPE = 'ROLES' ";
	SQL += " where per.SERV_PROV_CODE = 'SHCC' ";
	SQL += " AND per.B1_PER_GROUP = 'Objects' ";
	SQL += " AND per.B1_PER_TYPE = 'General' ";
	SQL += " and per.B1_PER_SUB_TYPE = 'Contact Object' ";
	SQL += " AND per.B1_PER_CATEGORY = 'CONT' ";
	SQL += " AND BCHKBX.B1_CHECKLIST_COMMENT = 'CHECKED' ";
	SQL += " AND per.B1_ALT_ID = '" + contID + "' ";
	var res = SHCC.runSQL(SQL, null);
	return res.toArray();
}
CONT.getContactRolesByRefID = function(refContID){
	var SQL = "";
	SQL += " Select BCHKBX.B1_CHECKBOX_DESC as ROLES from B1PERMIT per ";
	SQL += " inner join BCHCKBOX BREF on ";
	SQL += " BREF.SERV_PROV_CODE = per.SERV_PROV_CODE ";
	SQL += " AND BREF.B1_PER_ID1 = per.B1_PER_ID1 ";
	SQL += " AND BREF.B1_PER_ID2 = per.B1_PER_ID2 ";
	SQL += " AND BREF.B1_PER_ID3 = per.B1_PER_ID3 ";
	SQL += " AND BREF.B1_CHECKBOX_GROUP = 'APPLICATION' ";
	SQL += " AND BREF.B1_PER_SUB_TYPE = 'Contact Object' ";
	SQL += " AND BREF.B1_CHECKBOX_TYPE = 'REFERENCE CONTACT' ";
	SQL += " AND BREF.B1_CHECKBOX_DESC = 'Ref Contact ID' ";
	SQL += " AND BREF.B1_CHECKLIST_COMMENT = '" + refContID + "' ";
	SQL += " inner join BCHCKBOX BCHKBX on ";
	SQL += " BCHKBX.SERV_PROV_CODE = per.SERV_PROV_CODE ";
	SQL += " AND BCHKBX.B1_PER_ID1 = per.B1_PER_ID1 ";
	SQL += " AND BCHKBX.B1_PER_ID2 = per.B1_PER_ID2 ";
	SQL += " AND BCHKBX.B1_PER_ID3 = per.B1_PER_ID3 ";
	SQL += " AND BCHKBX.B1_CHECKBOX_GROUP = 'APPLICATION' ";
	SQL += " AND BCHKBX.B1_PER_SUB_TYPE = 'Contact Object' ";
	SQL += " AND BCHKBX.B1_CHECKBOX_TYPE = 'ROLES' ";
	SQL += " where per.SERV_PROV_CODE = 'SHCC' ";
	SQL += " AND per.B1_PER_GROUP = 'Objects' ";
	SQL += " AND per.B1_PER_TYPE = 'General' ";
	SQL += " and per.B1_PER_SUB_TYPE = 'Contact Object' ";
	SQL += " AND per.B1_PER_CATEGORY = 'CONT' ";
	SQL += " AND BCHKBX.B1_CHECKLIST_COMMENT = 'CHECKED' ";
	var res = SHCC.runSQL(SQL, null);
	return res.toArray();
}


CONT.getIndividualData = function(ContactID){
	const IndividualJson = {
	};
	var asiField = {};
	var record = new Record(ContactID);
	var allasi = record.getAllASI(true);
	var keys = Object.keys(allasi);
	var keyLength = keys.length;
	for (var i = 0; i < keyLength; i++){
		var fields = (Object.keys(allasi[keys[i]]));
		var fieldsLength = fields.length;
		for (var j = 0; j < fieldsLength; j++){
			asiField.fieldGroupName = keys[i];
			asiField.fieldName = fields[j];
			if (asiField.fieldGroupName == "INDIVIDUAL" || asiField.fieldGroupName == "REFERENCE CONTACT" || asiField.fieldGroupName == "ROLES"){
				var fieldObj = allasi[keys[i]][fields[j]];
				IndividualJson[asiField.fieldName] = fieldObj;
			}
		}
	}
	return IndividualJson;
}

CONT.getNonIndividualData = function(ContactID){
	const IndividualJson = {
	};
	var asiField = {};
	var record = new Record(ContactID);
	var allasi = record.getAllASI(true);
	var keys = Object.keys(allasi);
	var keyLength = keys.length;
	for (var i = 0; i < keyLength; i++){
		var fields = (Object.keys(allasi[keys[i]]));
		var fieldsLength = fields.length;
		for (var j = 0; j < fieldsLength; j++){
			asiField.fieldGroupName = keys[i];
			asiField.fieldName = fields[j];
			if (asiField.fieldGroupName == "NON-INDIVIDUAL" || asiField.fieldGroupName == "REFERENCE CONTACT" || asiField.fieldGroupName == "ROLES"){
				var fieldObj = allasi[keys[i]][fields[j]];
				IndividualJson[asiField.fieldName] = fieldObj;
			}
		}
	}
	return IndividualJson;
}

CONT.getContactDataByID = function(ContactID){
	if(!Utils.isBlankOrNull(ContactID)){
		var contRec = new CONT(ContactID);
		if(contRec){
			var isIndividual = String(contRec.getASI('REFERENCE CONTACT','Contact Type','')).toUpperCase() == "INDIVIDUAL" ? true : false;
			printLog("getContactDataByID :: isIndividual :: " + isIndividual)
			if(isIndividual){
				return this.getIndividualData(ContactID);
			}else{
				return this.getNonIndividualData(ContactID);
			}
		}
	}
}

function printLog(logMessage){
	aa.print("INCLUDE_CONT:: " + logMessage);
	java.lang.System.out.println("INCLUDE_CONT:: " + logMessage);
}

CONT.getContactRecord = function(isIndividual, seqNo, email, emiratesId, uid, roleAsiFieldName){

	var contRec = null;
	if (!Utils.isNullOrUndefined(isIndividual) && (!Utils.isNullOrUndefined(email) || !Utils.isNullOrUndefined(emiratesId) || !Utils.isNullOrUndefined(uid))){
		if (Utils.hasValue(isIndividual) && (Utils.hasValue(email) || Utils.hasValue(emiratesId) || Utils.hasValue(uid))){
			var filter = {};
			if (Utils.hasValue(seqNo)){
				filter[CONT.ASI.referenceContact.refContactId] = seqNo;
			}
			if (Utils.hasValue(email) && isIndividual == true){
				filter[CONT.ASI.individual.email] = email;
			}

			if (Utils.hasValue(email) && isIndividual == false){
				filter[CONT.ASI.nonIndividual.eMail] = email;
			}

			if (Utils.hasValue(emiratesId) && isIndividual == true){
				filter[CONT.ASI.individual.eidNumber] = emiratesId;
			}
			if (Utils.hasValue(uid) && isIndividual == true){
				filter[CONT.ASI.individual.unifiedIdentificationNumberUid] = uid;
			}
			
			if (Utils.hasValue(roleAsiFieldName)){
				filter[roleAsiFieldName] = "CHECKED";
			}
			

			var recs = search_records("Objects", ["Objects/General/Contact Object/CONT"], filter, [], false).toArray();
			if (recs.length > 0){
				contRec = new Record(recs[0].getCapID())
			}
		}
	}

	return contRec != null ? contRec : null;
}

//CONT.getRefContactObj = function(email, emiratesId, uid){
//
//	if (typeof PublicUser === "undefined"){
//		aa.includeScript("INCLUDE_PUBLICUSER");
//	}
//
//	var contactObj = new Contact();
//	var sql = "";
//	var servProvCode = aa.getServiceProviderCode();
//
//	if (!Utils.isNullOrUndefined(email) || !Utils.isNullOrUndefined(emiratesId) || !Utils.isNullOrUndefined(uid)){
//		if (Utils.hasValue(email) || Utils.hasValue(emiratesId) || Utils.hasValue(uid)){
//
//
//			sql += "SELECT TOP 1 G1_CONTACT_NBR SEQ_NO," +
//				" G1_CONTACT_TYPE CONTACT_TYPE," +
//				" G1_FNAME FIRST_NAME," +
//				" G1_LNAME LAST_NAME," +
//				" G1_FULL_NAME FULL_NAME," +
//				" G1_STATE_ID_NBR EMIRATES_ID," +
//				" G1_PHONE1_COUNTRY_CODE + G1_PHONE1 MOBILE_NO," +
//				" G1_EMAIL EMAIL," +
//				" G1_ADDRESS2 UAE_PASS," +
//				" G1_ADDRESS3 SMART_PASS," +
//				" L1_GENDER Gender," +
//				" G1_COUNTRY_CODE Nationality";
//			sql += " FROM G3CONTACT G ";
//
//			sql += " WHERE G.SERV_PROV_CODE ='" + servProvCode + "' ";
//			if (Utils.hasValue(emiratesId)){
//				sql += " AND G1_STATE_ID_NBR ='" + emiratesId + "'";
//			}
//
//			if (Utils.hasValue(email)){
//				sql += " AND G1_EMAIL ='" + email + "'";
//			}
//
//			if (Utils.hasValue(uid)){
//				// sql += " AND G1_STATE_ID_NBR ='" + emiratesId + "'";
//			}
//
//			var aadba = aa.proxyInvoker.newInstance("com.accela.aa.datautil.AADBAccessor").getOutput();
//			var aadba = aadba.getInstance();
//			var result = aadba.select(sql, null)
//			result = result.toArray();
//			if (result.length > 0){
//				for (var index in result){
//
//					if (!Utils.isBlankOrNull(result[index][0])){
//						contactObj.seqNo = String(result[index][0]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][1])){
//						contactObj.contactType = String(result[index][1]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][2])){
//						contactObj.firstName = String(result[index][2]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][3])){
//						contactObj.lastName = String(result[index][3]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][4])){
//						contactObj.fullName = String(result[index][4]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][5])){
//						contactObj.emiratesId = String(result[index][5]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][6])){
//						contactObj.mobileNo = String(result[index][6]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][7])){
//						contactObj.email = String(result[index][7]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][8])){
//						contactObj.uaePass = String(result[index][8]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][9])){
//						contactObj.smartPass = String(result[index][9]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][10])){
//						contactObj.gender = String(result[index][10]);
//					}
//
//					if (!Utils.isBlankOrNull(result[index][11])){
//						contactObj.nationality = String(result[index][11]);
//					}
//				}
//			}
//		}
//	}
//
//	return Utils.hasValue(contactObj.email) ? contactObj : null;
//}