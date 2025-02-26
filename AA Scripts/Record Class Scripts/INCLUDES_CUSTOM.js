/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_CUSTOM.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be
        available to all master scripts
|
| Notes   : 07/10/2015 - Salim Fakhry - Copied from DM and adjusted for DMA
|         : contactObj - override from default to add PassportNumber and StateIDNumber to getEmailTemplateParams
|         : comparePeopleUAE - Called from createRefContactsFromCapContactsAndLink and uses PassportNumber and
|           StateIDNumber as first match criteria
|           14/01/2015 Fish Added overloaded function "doScriptAction"
|         : 26/02/2015 John McKenney added function "getCapWorkDesModelDM"
|         : 04/02/2016 Mahmoud Sami added function "getCapWorkDesModelDM"
/------------------------------------------------------------------------------------------------------*/
//fish 3/7/15
//get all scripts and automatically load the scripts prefixed with "FN_". Dont add
//any new functions to this script anymore.
var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
// gets back a 2D array of [SCRIPT CODE][SCRIPT TITLE]
var scripts = emseBiz.getScriptNameListByServProvCode("DMEP");

// Loop through script codes
for (s in scripts[0]) {
	if (scripts[0][s].indexOf("FN_") == 0) {
		eval(getScriptText(scripts[0][s]));
	}
}

// Return Standar Choices Seq Number
function getBizDomainID(stdChoice, stdValue) {
	var strControl = 0;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

	if (bizDomScriptResult.getSuccess()) {
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = bizDomScriptObj.getDispositionID();
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
	} else {
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
	}
	return strControl;
}

function capHasFeeItem(fcode, fsched) {
	feeItemsResult = aa.finance.getFeeItemByCapID(capId);
	if (feeItemsResult.getSuccess()) {
		feeItems = feeItemsResult.getOutput();
		for (x in feeItems) {
			// feeItems[x].getFeeDescription()
			if (feeItems[x].getFeeCod() == fcode && feeItems[x].getFeeSchudle() == fsched)
				return true;
		}
	}
	return false;
}

// Schedule Inspection, returns inspection ID
function scheduleInspection(e, t) {
	var n = null;
	var r = null;
	var i = "Scheduled via Script";
	if (arguments.length >= 3)
		if (arguments[2] != null) {
			var s = aa.person.getUser(arguments[2]);
			if (s.getSuccess())
				var n = s.getOutput()
		}
	if (arguments.length >= 4)
		if (arguments[3] != null)
			r = arguments[3];
	if (arguments.length == 5)
		if (arguments[4] != null)
			i = arguments[4];
	var inspectionNum = aa.inspection.scheduleInspection(capId, n, aa.date.parseDate(dateAdd(null, t)), r, e, i);

	if (inspectionNum.getSuccess()) {
		logDebug("Successfully scheduled inspection : " + e + " for " + dateAdd(null, t));
		return inspectionNum.getOutput();
	} else {
		logDebug("**ERROR: adding scheduling inspection (" + e + "): " + inspectionNum.getErrorMessage())
		return null;
	}
}

function comparePeopleUAE(peop) {

	/*
	 * this function will be passed as a parameter to the
	 * createRefContactsFromCapContactsAndLink function. takes a single
	 * peopleModel as a parameter, and will return the sequence number of the
	 * first G6Contact result returns null if there are no matches
	 *
	 * Best Practice Template Version uses the following algorithm:
	 *
	 * 1. Match on Passport Number/State ID Number if either exist 2. else,
	 * match on Email Address if it exists 3. else, match on First, Middle, Last
	 * Name 4. else compare on Full Name
	 *
	 * This function can use attributes if desired
	 */

	if (peop.getPassportNumber() || peop.getStateIDNbr()) {
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();

		logDebug("we have a SSN " + peop.getPassportNumber() + " or FEIN, checking on that");
		if (peop.getPassportNumber())
			qryPeople.setPassportNumber(peop.getPassportNumber());
		if (peop.getStateIDNbr())
			qryPeople.setStateIDNbr(peop.getStateIDNbr());

		var r = aa.people.getPeopleByPeopleModel(qryPeople);

		if (!r.getSuccess()) {
			logDebug("WARNING: error searching for people : " + r.getErrorMessage());
			return false;
		}

		var peopResult = r.getOutput();

		if (peopResult.length > 0) {
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber());
			return peopResult[0].getContactSeqNumber();
		}
	}

	if (peop.getEmail()) {
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();

		qryPeople.setServiceProviderCode(aa.getServiceProviderCode());

		logDebug("we have an email, checking on that");
		qryPeople.setEmail(peop.getEmail());

		var r = aa.people.getPeopleByPeopleModel(qryPeople);

		if (!r.getSuccess()) {
			logDebug("WARNING: error searching for people : " + r.getErrorMessage());
			return false;
		}

		var peopResult = r.getOutput();

		if (peopResult.length > 0) {
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber());
			return peopResult[0].getContactSeqNumber();
		}
	}

	if (peop.getLastName() && peop.getFirstName()) {
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
		qryPeople.setLastName(peop.getLastName());
		qryPeople.setFirstName(peop.getFirstName());
		if (peop.getMiddleName())
			qryPeople.setMiddleName(peop.getMiddleName());

		var r = aa.people.getPeopleByPeopleModel(qryPeople);

		if (!r.getSuccess()) {
			logDebug("WARNING: error searching for people : " + r.getErrorMessage());
			return false;
		}

		var peopResult = r.getOutput();

		if (peopResult.length > 0) {
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber());
			return peopResult[0].getContactSeqNumber();
		}
	}

	if (peop.getFullName()) {
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
		qryPeople.setFullName(peop.getFullName());

		var r = aa.people.getPeopleByPeopleModel(qryPeople);

		if (!r.getSuccess()) {
			logDebug("WARNING: error searching for people : " + r.getErrorMessage());
			return false;
		}

		var peopResult = r.getOutput();

		if (peopResult.length > 0) {
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber());
			return peopResult[0].getContactSeqNumber();
		}
	}

	logDebug("Compare People did not find a match");
	return false;
}

function contactObj(ccsm) {

	this.people = null; // for access to the underlying data
	this.capContact = null; // for access to the underlying data
	this.capContactScript = null; // for access to the underlying data
	this.capId = null;
	this.type = null;
	this.seqNumber = null;
	this.refSeqNumber = null;
	this.asiObj = null;
	this.asi = new Array(); // associative array of attributes
	this.primary = null;
	this.relation = null;
	this.addresses = null; // array of addresses
	this.validAttrs = false;

	this.capContactScript = ccsm;
	if (ccsm) {
		if (ccsm.getCapContactModel == undefined) { // page flow
			this.people = this.capContactScript.getPeople();
			this.refSeqNumber = this.capContactScript.getRefContactNumber();
		} else {
			this.capContact = ccsm.getCapContactModel();
			this.people = this.capContact.getPeople();
			this.refSeqNumber = this.capContact.getRefContactNumber();
			if (this.people.getAttributes() != null) {
				this.asiObj = this.people.getAttributes().toArray();
				if (this.asiObj != null) {
					for ( var xx1 in this.asiObj)
						this.asi[this.asiObj[xx1].attributeName] = this.asiObj[xx1];
					this.validAttrs = true;
				}
			}
		}

		// this.primary = this.capContact.getPrimaryFlag().equals("Y");
		this.relation = this.people.relation;
		this.seqNumber = this.people.contactSeqNumber;
		this.type = this.people.getContactType();
		this.capId = this.capContactScript.getCapID();
		var contactAddressrs = aa.address.getContactAddressListByCapContact(this.capContact);
		if (contactAddressrs.getSuccess()) {
			this.addresses = contactAddressrs.getOutput();
			var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
			this.people.setContactAddressList(contactAddressModelArr);
		} else {
			pmcal = this.people.getContactAddressList();
			if (pmcal) {
				this.addresses = pmcal.toArray();
			}
		}
	}
	this.toString = function() {
		return this.capId + " : " + this.type + " " + this.people.getLastName() + "," + this.people.getFirstName() + " (id:" + this.seqNumber + "/" + this.refSeqNumber + ") #ofAddr=" + this.addresses.length + " primary=" + this.primary;
	}

	this.getEmailTemplateParams = function(params) {
		addParameter(params, "$$LastName$$", this.people.getLastName());
		addParameter(params, "$$FirstName$$", this.people.getFirstName());
		addParameter(params, "$$MiddleName$$", this.people.getMiddleName());
		addParameter(params, "$$BusinesName$$", this.people.getBusinessName());
		addParameter(params, "$$ContactSeqNumber$$", this.seqNumber);
		addParameter(params, "$$ContactType$$", this.type);
		addParameter(params, "$$Relation$$", this.relation);
		addParameter(params, "$$Phone1$$", this.people.getPhone1());
		addParameter(params, "$$Phone2$$", this.people.getPhone2());
		addParameter(params, "$$Email$$", this.people.getEmail());
		addParameter(params, "$$AddressLine1$$", this.people.getCompactAddress().getAddressLine1());
		addParameter(params, "$$AddressLine2$$", this.people.getCompactAddress().getAddressLine2());
		addParameter(params, "$$City$$", this.people.getCompactAddress().getCity());
		addParameter(params, "$$State$$", this.people.getCompactAddress().getState());
		addParameter(params, "$$Zip$$", this.people.getCompactAddress().getZip());
		addParameter(params, "$$Fax$$", this.people.getFax());
		addParameter(params, "$$Country$$", this.people.getCompactAddress().getCountry());
		addParameter(params, "$$FullName$$", this.people.getFullName());
		addParameter(params, "$$PassportNumber$$", this.people.getPassportNumber());
		addParameter(params, "$$StateIDNumber$$", this.people.getStateIDNbr());

		return params;
	}

	this.replace = function(targetCapId) { // send to another record, optional
		// new contact type

		var newType = this.type;
		if (arguments.length == 2)
			newType = arguments[1];
		// 2. Get people with target CAPID.
		var targetPeoples = getContactObjs(targetCapId, [ String(newType) ]);
		// 3. Check to see which people is matched in both source and target.
		for ( var loopk in targetPeoples) {
			var targetContact = targetPeoples[loopk];
			if (this.equals(targetPeoples[loopk])) {
				targetContact.people.setContactType(newType);
				aa.people.copyCapContactModel(this.capContact, targetContact.capContact);
				targetContact.people.setContactAddressList(this.people.getContactAddressList());
				overwriteResult = aa.people.editCapContactWithAttribute(targetContact.capContact);
				if (overwriteResult.getSuccess())
					logDebug("overwrite contact " + targetContact + " with " + this);
				else
					logDebug("error overwriting contact : " + this + " : " + overwriteResult.getErrorMessage());
				return true;
			}
		}

		var tmpCapId = this.capContact.getCapID();
		var tmpType = this.type;
		this.people.setContactType(newType);
		this.capContact.setCapID(targetCapId);
		createResult = aa.people.createCapContactWithAttribute(this.capContact);
		if (createResult.getSuccess())
			logDebug("(contactObj) contact created : " + this);
		else
			logDebug("(contactObj) error creating contact : " + this + " : " + createResult.getErrorMessage());
		this.capContact.setCapID(tmpCapId);
		this.type = tmpType;
		return true;
	}

	this.equals = function(t) {
		if (t == null)
			return false;
		if (!String(this.people.type).equals(String(t.people.type))) {
			return false;
		}
		if (!String(this.people.getFirstName()).equals(String(t.people.getFirstName()))) {
			return false;
		}
		if (!String(this.people.getLastName()).equals(String(t.people.getLastName()))) {
			return false;
		}
		if (!String(this.people.getFullName()).equals(String(t.people.getFullName()))) {
			return false;
		}
		if (!String(this.people.getBusinessName()).equals(String(t.people.getBusinessName()))) {
			return false;
		}
		return true;
	}

	this.saveBase = function() {
		// set the values we store outside of the models.
		this.people.setContactType(this.type);
		this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
		this.people.setRelation(this.relation);
		saveResult = aa.people.editCapContact(this.capContact);
		if (saveResult.getSuccess())
			logDebug("(contactObj) base contact saved : " + this);
		else
			logDebug("(contactObj) error saving base contact : " + this + " : " + saveResult.getErrorMessage());
	}

	this.save = function() {
		// set the values we store outside of the models
		this.people.setContactType(this.type);
		this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
		this.people.setRelation(this.relation);
		this.capContact.setPeople(this.people);
		saveResult = aa.people.editCapContactWithAttribute(this.capContact);
		if (saveResult.getSuccess())
			logDebug("(contactObj) contact saved : " + this);
		else
			logDebug("(contactObj) error saving contact : " + this + " : " + saveResult.getErrorMessage());
	}

	// get method for Attributes
	this.getAttribute = function(vAttributeName) {
		var retVal = null;
		if (this.validAttrs) {
			var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
			if (tmpVal != null)
				retVal = tmpVal.getAttributeValue();
		}
		return retVal;
	}

	// Set method for Attributes
	this.setAttribute = function(vAttributeName, vAttributeValue) {
		var retVal = false;
		if (this.validAttrs) {
			var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
			if (tmpVal != null) {
				tmpVal.setAttributeValue(vAttributeValue);
				retVal = true;
			}
		}
		return retVal;
	}

	this.remove = function() {
		var removeResult = aa.people.removeCapContact(this.capId, this.seqNumber)
		if (removeResult.getSuccess())
			logDebug("(contactObj) contact removed : " + this + " from record " + this.capId.getINCLUDES_CUSTOM());
		else
			logDebug("(contactObj) error removing contact : " + this + " : from record " + this.capId.getCustomID() + " : " + removeResult.getErrorMessage());
	}

	this.isSingleAddressPerType = function() {
		if (this.addresses.length > 1) {

			var addrTypeCount = new Array();
			for (y in this.addresses) {
				thisAddr = this.addresses[y];
				addrTypeCount[thisAddr.addressType] = 0;
			}

			for (yy in this.addresses) {
				thisAddr = this.addresses[yy];
				addrTypeCount[thisAddr.addressType] += 1;
			}

			for (z in addrTypeCount) {
				if (addrTypeCount[z] > 1)
					return false;
			}
		} else {
			return true;
		}

		return true;

	}

	this.getAddressTypeCounts = function() { // returns an associative array
		// of how many adddresses are
		// attached.

		var addrTypeCount = new Array();

		for (y in this.addresses) {
			thisAddr = this.addresses[y];
			addrTypeCount[thisAddr.addressType] = 0;
		}

		for (yy in this.addresses) {
			thisAddr = this.addresses[yy];
			addrTypeCount[thisAddr.addressType] += 1;
		}

		return addrTypeCount;

	}

	this.createPublicUser = function() {

		if (!this.capContact.getEmail()) {
			logDebug("(contactObj) Couldn't create public user for : " + this + ", no email address");
			return false;
		}

		if (String(this.people.getContactTypeFlag()).equals("organization")) {
			logDebug("(contactObj) Couldn't create public user for " + this + ", the contact is an organization");
			return false;
		}

		// check to see if public user exists already based on email address
		var getUserResult = aa.publicUser.getPublicUserByEmail(this.capContact.getEmail())
		if (getUserResult.getSuccess() && getUserResult.getOutput()) {
			userModel = getUserResult.getOutput();
			logDebug("(contactObj) createPublicUserFromContact: Found an existing public user: " + userModel.getUserID());
		}

		if (!userModel) // create one
		{
			logDebug("(contactObj) CreatePublicUserFromContact: creating new user based on email address: " + this.capContact.getEmail());
			var publicUser = aa.publicUser.getPublicUserModel();
			publicUser.setFirstName(this.capContact.getFirstName());
			publicUser.setLastName(this.capContact.getLastName());
			publicUser.setEmail(this.capContact.getEmail());
			publicUser.setUserID(this.capContact.getEmail());
			publicUser.setPassword("e8248cbe79a288ffec75d7300ad2e07172f487f6"); // password
			// :
			// 1111111111
			publicUser.setAuditID("PublicUser");
			publicUser.setAuditStatus("A");
			publicUser.setCellPhone(this.people.getPhone2());

			var result = aa.publicUser.createPublicUser(publicUser);
			if (result.getSuccess()) {

				logDebug("(contactObj) Created public user " + this.capContact.getEmail() + "  sucessfully.");
				var userSeqNum = result.getOutput();
				var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()

				// create for agency
				aa.publicUser.createPublicUserForAgency(userModel);

				// activate for agency
				var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
				userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(aa.getServiceProviderCode(), userSeqNum, "ADMIN");

				// reset password
				var resetPasswordResult = aa.publicUser.resetPassword(this.capContact.getEmail());
				if (resetPasswordResult.getSuccess()) {
					var resetPassword = resetPasswordResult.getOutput();
					userModel.setPassword(resetPassword);
					logDebug("(contactObj) Reset password for " + this.capContact.getEmail() + "  sucessfully.");
				} else {
					logDebug("(contactObj **WARNING: Reset password for  " + this.capContact.getEmail() + "  failure:" + resetPasswordResult.getErrorMessage());
				}

				// send Activate email
				aa.publicUser.sendActivateEmail(userModel, true, true);

				// send another email
				aa.publicUser.sendPasswordEmail(userModel);
			} else {
				logDebug("(contactObj) **WARNIJNG creating public user " + this.capContact.getEmail() + "  failure: " + result.getErrorMessage());
				return null;
			}
		}

		// Now that we have a public user let's connect to the reference contact

		if (this.refSeqNumber) {
			logDebug("(contactObj) CreatePublicUserFromContact: Linking this public user with reference contact : " + this.refSeqNumber);
			aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), this.refSeqNumber);
		}

		return userModel; // send back the new or existing public user
	}

	this.getCaps = function() { // option record type filter

		if (this.refSeqNumber) {
			aa.print("ref seq : " + this.refSeqNumber);
			var capTypes = null;
			var resultArray = new Array();
			if (arguments.length == 1)
				capTypes = arguments[0];

			var pm = aa.people.createPeopleModel().getOutput().getPeopleModel();
			var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
			pm.setServiceProviderCode(aa.getServiceProviderCode());
			pm.setContactSeqNumber(this.refSeqNumber);

			var cList = ccb.getCapContactsByRefContactModel(pm).toArray();

			for ( var j in cList) {
				var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(), cList[j].getCapID().getID2(), cList[j].getCapID().getID3()).getOutput();
				if (capTypes && appMatch(capTypes, thisCapId)) {
					resultArray.push(thisCapId)
				}
			}
		}

		return resultArray;
	}

	this.getRelatedContactObjs = function() { // option record type filter

		if (this.refSeqNumber) {
			var capTypes = null;
			var resultArray = new Array();
			if (arguments.length == 1)
				capTypes = arguments[0];

			var pm = aa.people.createPeopleModel().getOutput().getPeopleModel();
			var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
			pm.setServiceProviderCode(aa.getServiceProviderCode());
			pm.setContactSeqNumber(this.refSeqNumber);

			var cList = ccb.getCapContactsByRefContactModel(pm).toArray();

			for ( var j in cList) {
				var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(), cList[j].getCapID().getID2(), cList[j].getCapID().getID3()).getOutput();
				if (capTypes && appMatch(capTypes, thisCapId)) {
					var ccsm = aa.people.getCapContactByPK(thisCapId, cList[j].getPeople().contactSeqNumber).getOutput();
					var newContactObj = new contactObj(ccsm);
					resultArray.push(newContactObj)
				}
			}
		}

		return resultArray;
	}

	this.createRefLicProf = function(licNum, rlpType, addressType, licenseState) {

		// optional 3rd parameter serv_prov_code
		var updating = false;
		var serv_prov_code_4_lp = aa.getServiceProviderCode();
		if (arguments.length == 5) {
			serv_prov_code_4_lp = arguments[4];
			aa.setDelegateAgencyCode(serv_prov_code_4_lp);
		}

		// addressType = one of the contact address types, or null to pull from
		// the standard contact fields.
		var newLic = getRefLicenseProf(licNum);

		if (newLic) {
			updating = true;
			logDebug("(contactObj) Updating existing Ref Lic Prof : " + licNum);
		} else {
			var newLic = aa.licenseScript.createLicenseScriptModel();
		}

		peop = this.people;
		cont = this.capContact;
		if (cont.getFirstName() != null)
			newLic.setContactFirstName(cont.getFirstName());
		if (peop.getMiddleName() != null)
			newLic.setContactMiddleName(peop.getMiddleName()); // use people
		// for this
		if (cont.getLastName() != null)
			if (peop.getNamesuffix() != null)
				newLic.setContactLastName(cont.getLastName() + " " + peop.getNamesuffix());
			else
				newLic.setContactLastName(cont.getLastName());
		if (peop.getBusinessName() != null)
			newLic.setBusinessName(peop.getBusinessName());
		if (peop.getPhone1() != null)
			newLic.setPhone1(peop.getPhone1());
		if (peop.getPhone2() != null)
			newLic.setPhone2(peop.getPhone2());
		if (peop.getEmail() != null)
			newLic.setEMailAddress(peop.getEmail());
		if (peop.getFax() != null)
			newLic.setFax(peop.getFax());
		newLic.setAgencyCode(serv_prov_code_4_lp);
		newLic.setAuditDate(sysDate);
		newLic.setAuditID(currentUserID);
		newLic.setAuditStatus("A");
		newLic.setLicenseType(rlpType);
		newLic.setStateLicense(licNum);
		newLic.setLicState(licenseState);
		// setting this field for a future enhancement to filter license types
		// by the licensing board field. (this will be populated with agency
		// names)
		var agencyLong = lookup("CONTACT_ACROSS_AGENCIES", servProvCode);
		if (!matches(agencyLong, undefined, null, ""))
			newLic.setLicenseBoard(agencyLong);
		else
			newLic.setLicenseBoard("");

		var addr = null;

		if (addressType) {
			for ( var i in this.addresses) {
				cAddr = this.addresses[i];
				if (addressType.equals(cAddr.getAddressType())) {
					addr = cAddr;
				}
			}
		}

		if (!addr)
			addr = peop.getCompactAddress(); // only used on non-multiple
		// addresses or if we can't find
		// the right multi-address

		if (addr.getAddressLine1() != null)
			newLic.setAddress1(addr.getAddressLine1());
		if (addr.getAddressLine2() != null)
			newLic.setAddress2(addr.getAddressLine2());
		if (addr.getAddressLine3() != null)
			newLic.getLicenseModel().setTitle(addr.getAddressLine3());
		if (addr.getCity() != null)
			newLic.setCity(addr.getCity());
		if (addr.getState() != null)
			newLic.setState(addr.getState());
		if (addr.getZip() != null)
			newLic.setZip(addr.getZip());
		if (addr.getCountryCode() != null)
			newLic.getLicenseModel().setCountryCode(addr.getCountryCode());

		if (updating)
			myResult = aa.licenseScript.editRefLicenseProf(newLic);
		else
			myResult = aa.licenseScript.createRefLicenseProf(newLic);

		if (arguments.length == 5) {
			aa.resetDelegateAgencyCode();
		}

		if (myResult.getSuccess()) {
			logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " From Contact " + this);
			return true;
		} else {
			logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
			return false;
		}
	}

	this.getAKA = function() {
		var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
		if (this.refSeqNumber) {
			return aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(), String(this.refSeqNumber)).toArray();
		} else {
			logDebug("contactObj: Cannot get AKA names for a non-reference contact");
			return false;
		}
	}

	this.addAKA = function(firstName, middleName, lastName, fullName, startDate, endDate) {
		if (!this.refSeqNumber) {
			logDebug("contactObj: Cannot add AKA name for non-reference contact");
			return false;
		}

		var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
		var args = new Array();
		var akaModel = aa.proxyInvoker.newInstance("com.accela.orm.model.contact.PeopleAKAModel", args).getOutput();
		var auditModel = aa.proxyInvoker.newInstance("com.accela.orm.model.common.AuditModel", args).getOutput();

		var a = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(), String(this.refSeqNumber));
		akaModel.setServiceProviderCode(aa.getServiceProviderCode());
		akaModel.setContactNumber(parseInt(this.refSeqNumber));
		akaModel.setFirstName(firstName);
		akaModel.setMiddleName(middleName);
		akaModel.setLastName(lastName);
		akaModel.setFullName(fullName);
		akaModel.setStartDate(startDate);
		akaModel.setEndDate(endDate);
		auditModel.setAuditDate(new Date());
		auditModel.setAuditStatus("A");
		auditModel.setAuditID("ADMIN");
		akaModel.setAuditModel(auditModel);
		a.add(akaModel);

		aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, a);
	}

	this.removeAKA = function(firstName, middleName, lastName) {
		if (!this.refSeqNumber) {
			logDebug("contactObj: Cannot remove AKA name for non-reference contact");
			return false;
		}

		var removed = false;
		var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
		var l = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(), String(this.refSeqNumber));

		var i = l.iterator();
		while (i.hasNext()) {
			var thisAKA = i.next();
			if ((!thisAKA.getFirstName() || thisAKA.getFirstName().equals(firstName)) && (!thisAKA.getMiddleName() || thisAKA.getMiddleName().equals(middleName)) && (!thisAKA.getLastName() || thisAKA.getLastName().equals(lastName))) {
				i.remove();
				logDebug("contactObj: removed AKA Name : " + firstName + " " + middleName + " " + lastName);
				removed = true;
			}
		}

		if (removed)
			aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, l);
	}

	this.hasPublicUser = function() {
		if (this.refSeqNumber == null)
			return false;
		var s_publicUserResult = aa.publicUser.getPublicUserListByContactNBR(aa.util.parseLong(this.refSeqNumber));

		if (s_publicUserResult.getSuccess()) {
			var fpublicUsers = s_publicUserResult.getOutput();
			if (fpublicUsers == null || fpublicUsers.size() == 0) {
				logDebug("The contact(" + this.refSeqNumber + ") is not associated with any public user.");
				return false;
			} else {
				logDebug("The contact(" + this.refSeqNumber + ") is associated with " + fpublicUsers.size() + " public users.");
				return true;
			}
		} else {
			logMessage("**ERROR: Failed to get public user by contact number: " + s_publicUserResult.getErrorMessage());
			return false;
		}
	}

	this.linkToPublicUser = function(pUserId) {

		if (pUserId != null) {
			var pSeqNumber = pUserId.replace('PUBLICUSER', '');

			var s_publicUserResult = aa.publicUser.getPublicUser(aa.util.parseLong(pSeqNumber));

			if (s_publicUserResult.getSuccess()) {
				var linkResult = aa.licenseScript.associateContactWithPublicUser(pSeqNumber, this.refSeqNumber);

				if (linkResult.getSuccess()) {
					logDebug("Successfully linked public user " + pSeqNumber + " to contact " + this.refSeqNumber);
				} else {
					logDebug("Failed to link contact to public user");
					return false;
				}
			} else {
				logDebug("Could not find a public user with the seq number: " + pSeqNumber);
				return false;
			}

		} else {
			logDebug("No public user id provided");
			return false;
		}
	}

	this.sendCreateAndLinkNotification = function() {
		// for the scenario in AA where a paper application has been submitted
		var toEmail = this.people.getEmail();

		if (toEmail) {
			var params = aa.util.newHashtable();
			getACARecordParam4Notification(params, acaUrl);
			addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
			addParameter(params, "$$altID$$", capIDString);
			var notificationName;

			if (this.people.getContactTypeFlag() == "individual") {
				notificationName = this.people.getFirstName() + " " + this.people.getLastName();
			} else {
				notificationName = this.people.getBusinessName();
			}

			if (notificationName)
				addParameter(params, "$$notificationName$$", notificationName);
			if (this.refSeqNumber) {
				var v = new verhoeff();
				var pinCode = v.compute(String(this.refSeqNumber));
				addParameter(params, "$$pinCode$$", pinCode);

				sendNotification(sysFromEmail, toEmail, "", "PUBLICUSER CREATE AND LINK", params, null);
			}

		}

	}

	this.getRelatedRefContacts = function() { // Optional relationship types
		// array

		var relTypes;
		if (arguments.length > 0)
			relTypes = arguments[0];

		var relConsArray = new Array();

		if (matches(this.refSeqNumber, null, undefined, ""))
			return relConsArray;

		// check as the source
		var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
		xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
		xRefContactEntityModel.setContactSeqNumber(parseInt(this.refSeqNumber));
		x = xrb.getXRefContactEntityList(xRefContactEntityModel);

		if (x.size() > 0) {
			var relConList = x.toArray();

			for ( var zz in relConList) {
				var thisRelCon = relConList[zz];
				var addThisCon = true;
				if (relTypes) {
					addThisCon = exists(thisRelCon.getEntityID4(), relTypes);
				}

				if (addThisCon) {
					var peopResult = aa.people.getPeople(thisRelCon.getEntityID1());
					if (peopResult.getSuccess()) {
						var peop = peopResult.getOutput();
						relConsArray.push(peop);
					}
				}

			}
		}

		// check as the target
		var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
		xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
		xRefContactEntityModel.setEntityID1(parseInt(this.refSeqNumber));
		x = xrb.getXRefContactEntityList(xRefContactEntityModel);

		if (x.size() > 0) {
			var relConList = x.toArray();

			for ( var zz in relConList) {
				var thisRelCon = relConList[zz];
				var addThisCon = true;
				if (relTypes) {
					addThisCon = exists(thisRelCon.getEntityID4(), relTypes);
				}

				if (addThisCon) {
					var peopResult = aa.people.getPeople(thisRelCon.getContactSeqNumber());
					if (peopResult.getSuccess()) {
						var peop = peopResult.getOutput();
						relConsArray.push(peop);
					}
				}

			}
		}

		return relConsArray;
	}
}
function addASITable4ACAPageFlow(destinationTableGroupModel, tableName, tableValueArray) // optional
// capId
{
	// tableName is the name of the ASI table
	// tableValueArray is an array of associative array values. All elements
	// MUST be either a string or asiTableVal object
	//
	var itemCap = capId
	if (arguments.length > 3)
		itemCap = arguments[3]; // use cap ID specified in args
	var ta = destinationTableGroupModel.getTablesMap().values();
	var tai = ta.iterator();
	var found = false;

	while (tai.hasNext()) {
		var tsm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
		if (tsm.getTableName().equals(tableName)) {
			found = true;
			break;
		}
	}

	if (!found) {
		logDebug("cannot update asit for ACA, no matching table name");
		return false;
	}

	var fld = aa.util.newArrayList(); // had to do this since it was coming up
	// null.
	var fld_readonly = aa.util.newArrayList(); // had to do this since it was
	// coming up null.
	var i = -1; // row index counter
	for (thisrow in tableValueArray) {
		var col = tsm.getColumns()
		var coli = col.iterator();
		while (coli.hasNext()) {
			var colname = coli.next();
			if (typeof (tableValueArray[thisrow][colname.getColumnName()]) == "object") // we
			// are
			// passed
			// an
			// asiTablVal
			// Obj
			{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue, colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
				fldToAdd.setReadOnly(tableValueArray[thisrow][colname.getColumnName()].readOnly.equals("Y"));
				fld.add(fldToAdd);
				fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);
			} else // we are passed a string
			{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()], colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
				fldToAdd.setReadOnly(false);
				fld.add(fldToAdd);
				fld_readonly.add("N");
			}
		}
		i--;
		tsm.setTableFields(fld);
		tsm.setReadonlyField(fld_readonly); // set readonly field
	}
	tssm = tsm;
	return destinationTableGroupModel;
}

function copyASIFieldsAndData(srcCapId, targetCapId) // optional groups to
// ignore
{
	var ignoreArray = new Array();
	for (var i = 2; i < arguments.length; i++)
		ignoreArray.push(arguments[i])

	var appSpecificInfo = null;
	var s_result = aa.appSpecificInfo.getByCapID(srcCapId);
	if (s_result.getSuccess()) {
		var appSpecificInfo = s_result.getOutput();
		if (appSpecificInfo == null || appSpecificInfo.length == 0) {
			logDebug("WARNING: no appSpecificInfo on this CAP:" + srcCapId);
			return null;
		}
	} else {
		logDebug("**WARNING: Failed to get appSpecificInfo: " + s_result.getErrorMessage());
		return null;
	}

	for ( var loopk in appSpecificInfo)
		if (!exists(appSpecificInfo[loopk].getCheckboxType(), ignoreArray)) {
			var sourceAppSpecificInfoModel = appSpecificInfo[loopk];
			sourceAppSpecificInfoModel.setPermitID1(targetCapId.getID1());
			sourceAppSpecificInfoModel.setPermitID2(targetCapId.getID2());
			sourceAppSpecificInfoModel.setPermitID3(targetCapId.getID3());
			// 3. Edit ASI on target CAP (Copy info from source to target)
			aa.appSpecificInfo.editAppSpecInfoValue(sourceAppSpecificInfoModel);
		}
}

function getAppSpecificBefore(fieldName) {
	fieldName = fieldName.trim();
	for (loopk in AppSpecificInfoModels) {
		if (AppSpecificInfoModels[loopk].checkboxDesc == fieldName)
			return AppSpecificInfoModels[loopk].checklistComment;
	}
}

// @Parameter1 recordType: the record type. : strictly using '/' to separate the
// 4 level record type and using '*' to take place the blank value.
// @Parameter2 recordStatus: the record status. strictly using ',' to separate
// each record status if default value includes multiple record status.
// @Parameter3 expirationPeriod: number
// @Parameter4 currentExpirationStatus:strictly using ',' to separate each
// expiration status if default value includes multiple expiration status.
function getExpiredRecords(recordType, recordStatus, expirationPeriod, currentExpirationStatus) {
	var expirationStatusArray = currentExpirationStatus.split(",");
	var recordStatusArray = recordStatus.split(",");
	// Set the From and To date for expiration duration for search expiration
	// records.
	var startDate = new Date();
	var startTime = startDate.getTime();
	var endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * (expirationPeriod - 1));
	var fromDate = getDate(startDate);
	var toDate = getDate(endDate);
	var timeExpired = false;
	var expiredRecords = [];
	for (expirationStatus in expirationStatusArray) {
		// Get the application by specific expiration date in defined duration.
		var expResult = aa.expiration.getLicensesByDate(expirationStatusArray[expirationStatus], fromDate, toDate);
		var myExp = new Array();

		if (expResult.getSuccess()) {
			myExp = expResult.getOutput();
		} else {
			logDebug("ERROR: Getting Expirations, reason is: " + expResult.getErrorType() + ":" + expResult.getErrorMessage());
			return;
		}

		// If no record created during the specified period, no need send email
		// or SMS to notice the citizen user.
		if (myExp.length == 0) {
			continue;
		}

		for (thisExp in myExp) {
			var capID = myExp[thisExp].getCapID();
			var capScriptModel = aa.cap.getCap(capID);
			var capModel = "";
			var scriptDate = myExp[thisExp].getExpDate();
			var expirationDate = scriptDate.getDayOfMonth() + "/" + scriptDate.getMonth() + "/" + scriptDate.getYear();

			if (capScriptModel.getSuccess()) {
				capModel = capScriptModel.getOutput().getCapModel();
			} else {
				logDebug("ERROR: Getting Expirations, reason is: " + capScriptModel.getErrorType() + ":" + capScriptModel.getErrorMessage());
				break;
			}

			// Match record type and record status
			var capStatus = capModel.getCapStatus()
			var recordTypeArray = recordType.split("/");
			if (recordTypeArray[0] != "" && recordTypeArray[0] == capModel.getCapType().getGroup() && (recordTypeArray[1] != "" && (recordTypeArray[1] == "*" || recordTypeArray[1] == capModel.getCapType().getType()))
					&& (recordTypeArray[2] != "" && (recordTypeArray[2] == "*" || recordTypeArray[2] == capModel.getCapType().getSubType()))
					&& (recordTypeArray[3] != "" && (recordTypeArray[3] == "*" || recordTypeArray[3] == capModel.getCapType().getCategory()))) {
				for (index in recordStatusArray) {
					if (recordStatusArray[index] == capStatus) {
						expiredRecords.push(myExp[thisExp]);
					}
				}
			}

		}

	}

	return expiredRecords;
}

// Get date from calendar.
function getDate(calendar) {
	var year = calendar.getFullYear();
	var month = calendar.getMonth() + 1;
	var day = calendar.getDate();

	return month + "/" + day + "/" + year;
}

// Send the email to specified email address.
// This function is used for send email and sms to specified user when record is
// going to expire
function sendNoticeEmailAndMessage(capModel, emailFrom, emailCC, emailSubject, emailContent) {
	var SMSContent = "";
	var thisCapID = capModel.getCapID();
	var capScriptModel = aa.cap.getCap(thisCapID);
	if (capScriptModel.getSuccess()) {
		capModel = capScriptModel.getOutput().getCapModel();
	} else {
		logDebug("ERROR: Getting Expirations, reason is: " + capScriptModel.getErrorType() + ":" + capScriptModel.getErrorMessage());
		return;
	}

	if (validateCreatedByACA(capModel.getCreatedByACA())) {
		// Send email or SMS to current record associated public user.
		var userID = capModel.getCreatedBy();
		var citizenUser = aa.publicUser.getPublicUserByPUser(userID).getOutput();
		var hasSMS = citizenUser.getReceiveSMS();
		var phoneNumber = "";
		var phoneCountryCode = "";
		var emailAddress = "";
		var messageContent = "";

		// Set the email and SMS content.
		if (citizenUser.getUserID())
			messageContent += "Dear " + citizenUser.getUserID() + ",\n\n";
		else
			messageContent += "Dear Citizen,\n\n";

		// Get the PublicUser's Cell Phone number.
		if (hasSMS == "Y") {
			if (citizenUser.getCellPhoneCountryCode())
				phoneCountryCode = citizenUser.getCellPhoneCountryCode();
			if (citizenUser.getCellPhone())
				phoneNumber = phoneCountryCode + citizenUser.getCellPhone();
		}

		// Get the PublicUser's email.
		if (citizenUser.getEmail())
			emailAddress = citizenUser.getEmail();
		if (phoneNumber)
			sendSMS(phoneNumber, (messageContent + SMSContent).substr(0, 79));
		if (emailAddress) {
			aa.sendMail(emailFrom, emailAddress, emailCC, emailSubject, (messageContent + emailContent));
		}

	} else {
		// Send email or SMS for the current record associated contacts.
		var contactList = getContactList(capModel.getCapID());
		if (contactList.length > 0) {
			var phone1 = "";
			var phone1CountryCode = "";
			var phone2 = "";
			var phone2CountryCode = "";
			var phone3 = "";
			var phone3CountryCode = "";
			var email = "";
			var mappingContactFound = false;
			for (thisContact in contactList) {
				capContact = contactList[thisContact];
				if (capContact["Phone1CountryCode"])
					phone1CountryCode = capContact["Phone1CountryCode"];
				if (capContact["Phone1"])
					phone1 = phone1CountryCode + capContact["Phone1"];
				if (capContact["Phone2CountryCode"])
					phone2CountryCode = capContact["Phone2CountryCode"];
				if (capContact["Phone2"])
					phone2 = phone2CountryCode + capContact["Phone2"];
				if (capContact["Phone3CountryCode"])
					phone3CountryCode = capContact["Phone3CountryCode"];
				if (capContact["Phone3"])
					phone3 = phone3CountryCode + capContact["Phone3"];
				if (capContact["Email"])
					email = capContact["Email"];
				if (capContact["ContactType"] == "Pet Owner") {
					// Reset the message content.
					messageContent = "";
					// Set the email and SMS content.
					if (capContact["Name"] != "")
						messageContent += "Dear " + capContact["Name"] + ",\n\n";
					else
						messageContent += "Dear Citizen,\n";
					if (phone1)
						sendSMS(phone1, (messageContent + SMSContent).substr(0, 79));
					if (phone2)
						sendSMS(phone2, (messageContent + SMSContent).substr(0, 79));
					if (phone3)
						sendSMS(phone3, (messageContent + SMSContent).substr(0, 79));
					if (email) {
						// aa.print("email: " + email);
						aa.sendMail(emailFrom, emailAddress, emailCC, emailSubject, (messageContent + emailContent));
					}
					mappingContactFound = true;
				}
			}

			if (mappingContactFound)
				aa.debug("Mapping contacts found for the record ", capModel.getCapID().toString());
			else
				aa.debug("No mapping contacts found for the record ", capModel.getCapID().toString());
		} else {
			aa.debug("No contact information finding for the record", capID.getCustomID());
		}
	}

}

// Get the contact records from the current Record by record id.
function getContactList(capID) {
	var contactList = new Array();
	var capContactResult = aa.people.getCapContactByCapID(capID);

	if (capContactResult.getSuccess()) {
		var capContactArray = capContactResult.getOutput();

		for (thisContact in capContactArray) {
			var contactArray = new Array();
			contactArray["Name"] = capContactArray[thisContact].getPeople().getContactName();
			contactArray["FullName"] = capContactArray[thisContact].getPeople().getFullName();
			contactArray["ContactType"] = capContactArray[thisContact].getPeople().getContactType();
			contactArray["Phone1"] = capContactArray[thisContact].getPeople().getPhone1();
			contactArray["Phone2"] = capContactArray[thisContact].getPeople().getPhone2();
			contactArray["Phone3"] = capContactArray[thisContact].getPeople().getPhone3();
			contactArray["Phone1CountryCode"] = capContactArray[thisContact].getCapContactModel().getPeople().getPhone1CountryCode();
			contactArray["Phone2CountryCode"] = capContactArray[thisContact].getCapContactModel().getPeople().getPhone2CountryCode();
			contactArray["Phone3CountryCode"] = capContactArray[thisContact].getCapContactModel().getPeople().getPhone3CountryCode();
			contactArray["Primary"] = capContactArray[thisContact].getCapContactModel().getPeople().getFlag();
			contactArray["Email"] = capContactArray[thisContact].getCapContactModel().getPeople().getEmail();

			contactList.push(contactArray);
		}
	}

	return contactList;
}

// Validate the record whether it is created by ACA or not. True: Created by ACA
// Public User, False: Created by AA Staff.
function validateCreatedByACA(flag) {
	if (flag == "Y") {
		return true;
	}

	return false;
}

// Get full name of the contact for sending email notification
function getRecFullNameContacts() {
	var capContactResult = aa.people.getCapContactByCapID(capId);
	var contacts = capContactResult.getOutput();
	var conArr = "";
	var firstName = "";
	var lastName = "";
	for ( var contactIdx in contacts) {
		var contactModel = contacts[contactIdx].getCapContactModel();
		var people = contactModel.getPeople();
		firstName = people.getFirstName();
		lastName = people.getLastName();
		if (firstName != "" && lastName != "") {
			conArr = firstName + " " + lastName;
		}
	}
	return conArr;
}
function getNode(fString, fName) {
	var fValue = "";
	var startTag = "<" + fName;
	var endTag = "</" + fName + ">";
	startPos = fString.indexOf(">", fString.indexOf(startTag)) + 1;
	endPos = fString.indexOf(endTag);
	if (startPos > 0 && startPos < endPos)
		fValue = fString.substring(startPos, endPos);
	return unescape(fValue);
}

function similarity(s1, s2) {
	if (s1.length < s2.length) {
		// s1 should always be bigger
		var swap = s1;
		s1 = s2;
		s2 = swap;
	}
	var bigLen = s1.length;
	if (bigLen == 0) {
		return 1.0; /* both strings are zero length */
	}
	return (bigLen - computeEditDistance(s1, s2)) / bigLen;
}

function computeEditDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	// int[] costs = new int[s2.length() + 1];
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0)
				costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
						newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
					}
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0)
			costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}

// Hisham: Added a Function that Capitalizes the first letter
// of each word of a passed string.
function capitalize(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function getTodayDate() {
	return aa.date.getCurrentDate();
}
function copyContactsByTypeAndSetPrimary(pFromCapId, pToCapId, pContactType) {
	// Copies all contacts from pFromCapId to pToCapId
	// where type == pContactType
	var capContactResult = aa.people.getCapContactByCapID(pFromCapId);
	var copied = 0;
	if (capContactResult.getSuccess()) {
		var Contacts = capContactResult.getOutput();
		for (yy in Contacts) {
			if (Contacts[yy].getCapContactModel().getContactType() == pContactType) {
				var newContact = Contacts[yy].getCapContactModel();
				newContact.setCapID(pToCapId);
				var addedContact = aa.people.createCapContact(newContact).getOutput();
				// newContact
				// aa.debug("maabid1", newContact);
				var peopleObj = newContact.getPeople();
				peopleObj.setFlag("Y");
				newContact.setPeople(peopleObj);
				var editResult = aa.people.editCapContact(newContact);
				copied++;
			}

		}
	} else {
		return false;
	}
	return copied;
}

function getAge(birthString) { // Optional Death Date
	if (arguments.length >= 1) {
		var deathString = arguments[1];
		var death = new Date(deathString);
	} else {
		// set enddate as today
		var death = new Date();
	}

	var birthDate = new Date(birthString);
	var age = death.getFullYear() - birthDate.getFullYear();
	var m = death.getMonth() - birthDate.getMonth();

	if (m < 0 || (m === 0 && death.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

// fish 30/01/2015 had to copy this here as the original function had a typo
function scheduleInspect(itemCap, iType, DaysAhead) // optional inspector ID.
// This function requires
// dateAdd function
{
	// DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or
	// AM (SR5110)
	// DQ - Added Optional 5th parameter inspComm ex. to call without specifying
	// other options params scheduleInspection("Type",5,null,null,"Schedule
	// Comment");
	var inspectorObj = null;
	var inspTime = null;
	var inspComm = "Scheduled via Script";
	if (arguments.length >= 3)
		if (arguments[2] != null) {
			var inspRes = aa.person.getUser(arguments[2])
			if (inspRes.getSuccess())
				var inspectorObj = inspRes.getOutput();
		}

	if (arguments.length >= 4)
		if (arguments[3] != null)
			inspTime = arguments[3];

	if (arguments.length == 5)
		if (arguments[4] != null)
			inspComm = arguments[4];

	var schedRes = aa.inspection.scheduleInspection(itemCap, inspectorObj, aa.date.parseDate(dateAdd(null, DaysAhead)), inspTime, iType, inspComm)

	if (schedRes.getSuccess()) {
		logDebug("Successfully scheduled inspection : " + iType + " for " + dateAdd(null, DaysAhead));
		return schedRes.getOutput();
	} else
		logDebug("**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
}

// Hisham: 2/1/2015
// Function to check the balance due of a cap.
// with an Optional CapId Argument.
function checkBalance() { // Optional CapId
	try {
		if (arguments.length >= 1) {
			var capID = arguments[0];
		} else {
			var capID = capId;
		}
		var balanceDue = 0;
		var finalBalanceDue = 0;
		var capDetail;
		var capDetailObjResult = aa.cap.getCapDetail(capID);
		if (capDetailObjResult.getSuccess()) {
			capDetail = capDetailObjResult.getOutput();
			balanceDue = capDetail.getBalance();
		}
		var newFees = feeGetTotByDateRange("01/01/2000", "01/01/2050", "NEW");
		if (newFees > 0) {
		} else {
			newFees = 0;
		}
		finalBalanceDue = balanceDue + newFees;
		return finalBalanceDue;
	} catch (err) {
		aa.debug("An Error happened in script " + scriptName + " Alt ID is : " + capId.getCustomID(), err);
		throw (err);
		return 0;
	}
}

// Hisham: 2/2/2015
// Function to check if Inspection has passed.
function isInspectionPassed(capIdModel) {
	var inResult = aa.inspection.getInspections(capIdModel);
	var ins;
	var insPass = false;
	if (inResult.getSuccess()) {
		ins = inResult.getOutput();
		if (ins) {
			for (k = 0; k < ins.length; k++) {
				var insScriptModel = ins[k];
				var insModel = insScriptModel.getInspection();
				aa.print(insModel.getInspectionStatus());
				if (insModel.getInspectionStatus() == "Pass" || insModel.getInspectionStatus() == "Passed" || insModel.getInspectionStatus() == "Approved") {
					insPass = true;
				} else {
					insPass = false;
				}
			}
		}
	}
	return insPass;
}

// Hisham 2/2/2015
// Original closeTask function was missing an optional capId argument, which is
// very useful
// and is needed for several Services.
function closeTask(wfstr, wfstat, wfcomment, wfnote) // optional process name
// & Optional Cap Id
{
	var useProcess = false;
	var processName = "";
	var capID = capId;
	if (arguments.length >= 5) {
		if (arguments[4] != "") {
			processName = arguments[4]; // subprocess
			useProcess = true;
		}
	}
	if (arguments.length >= 6) {
		if (arguments[5] != "") {
			capID = arguments[5]; // CapId
		}
	}

	var workflowResult = aa.workflow.getTaskItems(capID, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	if (!wfstat)
		wfstat = "NA";

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capID, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");
			else
				aa.workflow.handleDisposition(capID, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");

			logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat);
			logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat);
		}
	}
}

/**
 * fish 02/08/2015 to be called from payment receive after. Will return boolean
 * if the targetfeeitemcode has just been paid
 *
 * @param {string}
 *            targetfeeitemCode :The fee item code that needs to be checked
 * @return {Boolean} boolean is being paid or not
 */

function isFeeItemBeingPaid(targetfeeitemCode) {
	try {
		// Define Script Name
		var scriptName = "isFeeItemBeingPaid";

		// Create a dummy QueryFormat
		var qf = new com.accela.aa.util.QueryFormat();

		// Get all the payments on current Cap
		pays = aa.finance.getPaymentFeeItems(capId, qf).getOutput();

		// sort the payments to get the fee items in the last payment
		var latest = 0;
		var feeitems = new Array();
		var feeitemIndex = 0;

		// Get the latest payment sequence number
		for ( var p in pays) {
			if (pays[p].getPaymentSeqNbr() > latest) {
				latest = pays[p].getPaymentSeqNbr();
			}
		}
		// Get all the fees in the last payment
		for ( var f in pays) {
			if (latest == (pays[f].getPaymentSeqNbr())) {
				feeitems[feeitemIndex] = pays[f];
				feeitemIndex++;
			}
		}

		// Loop through the fee items, see if matches the input parameter.
		var tempFee = null;
		for ( var feeitem in feeitems) {
			tempFee = aa.finance.getFeeItemByPK(capId, feeitems[feeitem].getFeeSeqNbr()).getOutput();
			if (targetfeeitemCode.equals(tempFee.getF4FeeItem().getFeeCod())) {
				return true;
			}

		}

		return false;
	} catch (e) {
		aa.debug("**EXCEPTION in " + scriptName, e);
		throw (e);
	}
}

// Hisham: 3/2/2015
// Function to check if Cap Model has this contact Type attached, returns true
// if contact type found.
function isContactTypeAttached(pCapModel, contactType) {
	var contactList = pCapModel.getContactsGroup();
	if (contactList != null && contactList.size() > 0) {
		for (var i = contactList.size(); i > 0; i--) {
			var contactModel = contactList.get(i - 1);
			if (contactModel) {
				var type = contactModel.getContactType();
				if (type == contactType) {
					return true;
				}
			}
		}
	}
	return false;
}

// Hisham: 02/03/2015
// Function to return the Initiated Product of the CapId (ACA vs V360)
function getInitiatedBy() { // Optional CapId
	if (arguments.length >= 1) {
		var capID = arguments[0];
	} else {
		var capID = capId;
	}
	var pCapRes = aa.cap.getCap(capID);
	if (pCapRes.getSuccess()) {
		var pCapModel = pCapRes.getOutput();
		var product = pCapModel.getInitiatedProduct();
		return product;
	}
	return false;
}

/**
 * fish - 2/8/2015 - Updates the workflow task and handles the disposition
 *
 * @param {string}
 *            taskName name of the task to update
 * @param {string}
 *            taskStatus the status with which to update the task with
 * @return {none} -
 */
function updateTaskAndHandleDisposition(taskName, taskStatus) {// Optional
	// capId to use
	try {
		var itemCap = null;

		if (arguments.length > 2) {
			itemCap = arguments[2]
		} else {
			itemCap = capId;
		}
		var functionName = "updateTaskAndHandleDisposition";
		var taskResult = aa.workflow.getTask(itemCap, taskName);

		if (!taskResult.getSuccess()) {
			logDebug("Problem while getting task " + taskResult.getErrorMessage());
		}
		task = taskResult.getOutput();
		task.setDisposition(taskStatus);
		var updateResult = aa.workflow.handleDisposition(task.getTaskItem(), itemCap);
		if (!updateResult.getSuccess()) {
			logDebug("Problem while updating workflow " + updateResult.getErrorMessage());
		}

	} catch (e) {
		aa.debug("**EXCEPTION in function " + functionName, e);
		// throw (e);
	}

}
/**
 *
 *
 * @param {string}
 *            subProcessTaskName name of the task to update
 * @param {string}
 *            taskStatus the status with which to update the task with
 * @return {none} -
 */

function updateSubProcessTaskAndHandleDisposition(subProcessTaskName, taskStatus) {// Optional
	// capId to use
	try {
		var r = aa.workflow.getTaskItems(capId, subProcessTaskName, null, null, null, null);
		var s = r.getOutput()
		for (i in s) {
			var o = s[i];
			var u = o.getStepNumber();
			var a = o.getProcessID();
			var f = o.getCompleteFlag()
			var taskresult = aa.workflow.getTask(capId, u, a);
			var task = taskresult.getOutput();

			if (task != null) {
				task.setDisposition(taskStatus);
				var updateResult = aa.workflow.handleDisposition(task.getTaskItem(), capId)
				if (!updateResult.getSuccess()) {
					logDebug("Problem while updating workflow " + updateResult.getErrorMessage());
				}
			}
		}

	} catch (e) {
		aa.debug("**EXCEPTION in function updateSubProcessTaskAndHandleDisposition", e);
		throw (e);
	}

}
/**
 * fish : 2/9/15 - Gets Pass/Fail grade for an examination
 *
 * @param {examModel}
 *            examModel, get from aa.examination.getExaminationList[i]
 * @return {string} returns Pass/Fail
 */
function getPassingScoreForExam(examModel) {
	var passingScore;
	var gradeingStyle = examModel.getGradingStyle().trim();
	if ("passfail".equalsIgnoreCase(gradeingStyle)) {
		if (examModel.getFinalScor + e() != "" && examModel.getFinalScore() != null) {
			var score = examModel.getFinalScore();
			if (score == 1)
				return "Pass";
			else
				return "Fail";
		} else {
			passingScore = "Fail";
		}
	}
	if ("score".equalsIgnoreCase(gradeingStyle)) {
		if (examModel.getFinalScore() < examModel.getPassingScore())
			return "Fail";
		else
			return "Pass";
	}

	return "Fail";
}

/**
 * maabid : 2/10/15 - Get the needed format date
 *
 * @param {date}
 *            date object
 * @param {format}
 *            string, and can be any of the standard date formats "dd/MM/yyyy"
 *            "HH:mm" "hh:mm" ...
 * @param {utc}
 *            boolean to indicate is it UTC or not
 * @return {string} returns string date formatted
 */
function formatDate(date, format, utc) {
	var MMMM = [ "\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	var MMM = [ "\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var dddd = [ "\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
	var ddd = [ "\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

	function ii(i, len) {
		var s = i + "";
		len = len || 2;
		while (s.length < len)
			s = "0" + s;
		return s;
	}

	var y = utc ? date.getUTCFullYear() : date.getFullYear();
	format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
	format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
	format = format.replace(/(^|[^\\])y/g, "$1" + y);

	var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
	format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
	format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
	format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
	format = format.replace(/(^|[^\\])M/g, "$1" + M);

	var d = utc ? date.getUTCDate() : date.getDate();
	format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
	format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
	format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
	format = format.replace(/(^|[^\\])d/g, "$1" + d);

	var H = utc ? date.getUTCHours() : date.getHours();
	format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
	format = format.replace(/(^|[^\\])H/g, "$1" + H);

	var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
	format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
	format = format.replace(/(^|[^\\])h/g, "$1" + h);

	var m = utc ? date.getUTCMinutes() : date.getMinutes();
	format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
	format = format.replace(/(^|[^\\])m/g, "$1" + m);

	var s = utc ? date.getUTCSeconds() : date.getSeconds();
	format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
	format = format.replace(/(^|[^\\])s/g, "$1" + s);

	var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
	format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
	f = Math.round(f / 10);
	format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
	f = Math.round(f / 10);
	format = format.replace(/(^|[^\\])f/g, "$1" + f);

	var T = H < 12 ? "AM" : "PM";
	format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
	format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

	var t = T.toLowerCase();
	format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
	format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

	var tz = -date.getTimezoneOffset();
	var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
	if (!utc) {
		tz = Math.abs(tz);
		var tzHrs = Math.floor(tz / 60);
		var tzMin = tz % 60;
		K += ii(tzHrs) + ":" + ii(tzMin);
	}
	format = format.replace(/(^|[^\\])K/g, "$1" + K);

	var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
	format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
	format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

	format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
	format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

	format = format.replace(/\\(.)/g, "$1");

	return format;
}
/**
 * DCB: 2/17/15 - Auto Tie the LP record from an ACA user to the record just
 * created call from CTRA
 */
function appendLP4ACA() {
	puSeq = publicUserID.substring(10);
	licList = aa.licenseScript.getRefLicProfByOnlineUser(puSeq).getOutput();
	if (licList.length > 0) {
		firstLic = licList[0];
		aa.licenseScript.associateLpWithCap(capId, firstLic);

		var licenseType = firstLic.getLicenseType();
		if (licenseType.toLowerCase() != "consultant")
			copyConsultantLpFromParentRecord();
	}
}

/**
 * DCB: 2/22/16 - copy consultant from parent
 */
function copyConsultantLpFromParentRecord() {
	try {
		var parentaltId = getAppSpecific("ParentCapID");
		var parentCapId = aa.cap.getCapID(parentaltId).getOutput();
		if (parentCapId) {
			licList = aa.licenseScript.getLicenseProf(parentCapId).getOutput();
			for (i in licList) {
				lic = licList[i];
				var licenseType = lic.getLicenseType();
				if (licenseType.toLowerCase() == "consultant") {
					lic.setCapID(capId);
					aa.licenseProfessional.createLicensedProfessional(lic);
				}
			}
		}
	} catch (e) {
		aa.debug("CTRCA:*/*/*/*", e);
		throw e.message;
	}
}

/**
 * DCB: 2/17/15 - assigns a task to the CAP creator pass in workflow task to
 * assign
 */
function assignTaskToCreator(wfstr) {
	// Cap must have been created by AA and not ACA
	// Optional Cap ID
	// Optional Cap Creator

	var itemCap = capId;
	if (arguments.length == 2 || arguments.length == 3)
		itemCap = arguments[1]; // use cap ID specified in args

	var capCreator;

	myCap = aa.cap.getCap(itemCap).getOutput();
	myCapModel = myCap.getCapModel();
	if (myCapModel.getCreatedByACA() == "N") {

		if (arguments.length == 3) {
			capCreator = arguments[2];
		} else {
			capCreator = myCapModel.getCreatedBy();
		}

		logDebug("Assigning task to " + capCreator);
		assignCapTask(wfstr, capCreator, "", itemCap);
	}
}
/**
 * DCB: 2/18/15 - assigns a task to a specific LP on the CAP pass in which LP
 * type
 */
function assignTasksToLPType(licType) {

	var itemCap = capId;
	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args

	profList = getLicenseProfessional(itemCap);
	foundDept = false;
	for (x in profList) {
		licRec = profList[x];
		if (licRec.getLicenseType() == licType) {
			licName = licRec.getBusinessName().toUpperCase();
			deptList = aa.people.getDepartmentList("ADMIN").getOutput();
			for (x in deptList) {
				deptName = deptList[x].getDeptName().toUpperCase();
				if (licName == deptName) {
					getAgencyCode = deptList[x].getAgencyCode();
					getBureauCode = deptList[x].getBureauCode();
					getDivisionCode = deptList[x].getDivisionCode();
					getSectionCode = deptList[x].getSectionCode();
					getGroupCode = deptList[x].getGroupCode();
					getOfficeCode = deptList[x].getOfficeCode();
					foundDept = true;
					break;
				}
			}
			if (foundDept) {
				var workflowResult = aa.workflow.getTasks(itemCap);
				wfObj = workflowResult.getOutput();
				for ( var i in wfObj) {
					fTask = wfObj[i];
					if (fTask.getCompleteFlag() != "N")
						continue;
					var taskUserObj = fTask.getTaskItem().getAssignedUser()

					taskUserObj.setAgencyCode(getAgencyCode);
					taskUserObj.setBureauCode(getBureauCode);
					taskUserObj.setDivisionCode(getDivisionCode);
					taskUserObj.setSectionCode(getSectionCode);
					taskUserObj.setGroupCode(getGroupCode);
					taskUserObj.setOfficeCode(getOfficeCode);

					fTask.setAssignedUser(taskUserObj);
					var taskItem = fTask.getTaskItem();
					var adjustResult = aa.workflow.assignTask(taskItem);
				}
			}
			break;
		}
	}
}
/**
 * DCB: 2/18/15 - takes the PU contact and adds it as applicant
 *
 */
function addApplicantToCap4ACA_OLD() {
	puSeq = publicUserID.substring(10);
	var peopleResult = aa.people.getUserAssociatedContact(puSeq).getOutput().toArray();
	contactNum = peopleResult[0].getContactSeqNumber();

	getPerson = aa.people.getPeople(contactNum).getOutput();
	getPerson.setContactType("Applicant");

	// Sudheesh POC Changes
	var phoneNumbers = "";
	if (getPerson.getPhone1CountryCode() != null && getPerson.getPhone1CountryCode() != "") {
		phoneNumbers += getPerson.getPhone1CountryCode();
	}
	if (getPerson.getPhone1() != null && getPerson.getPhone1() != "") {
		phoneNumbers += getPerson.getPhone1();
	}
	if (getPerson.getPhone2CountryCode() != null && getPerson.getPhone2CountryCode() != "") {
		phoneNumbers += " " + getPerson.getPhone2CountryCode();
	}
	if (getPerson.getPhone2() != null && getPerson.getPhone2() != "") {
		phoneNumbers += getPerson.getPhone2();
	}

	getPerson.getCompactAddress().setAddressLine3(phoneNumbers);
	addApplicant = aa.people.createCapContactWithRefPeopleModel(capId, getPerson);

	var contactTypeValue = getPerson.getContactType();
	var peopleAttr = aa.people.getPeopleAttributeByPeople(contactNum, contactTypeValue).getOutput();

	var applicantType;
	var communicationLang;
	for (x in peopleAttr) {
		if (peopleAttr[x].getAttributeName() == "APPLICANT TYPE") {
			applicantType = peopleAttr[x].getAttributeValue();
		}
		if (peopleAttr[x].getAttributeName() == "COMMUNICATION LANGUAGE") {
			communicationLang = peopleAttr[x].getAttributeValue();
		}

	}

	var contactArr = aa.people.getCapContactByCapID(capId).getOutput();
	if (contactArr && contactArr.length > 0) {
		var contactModel = contactArr[0].getCapContactModel();
		peopleModel = contactModel.getPeople();

		var peopleContactSeq = peopleModel.getContactSeqNumber();
		var peopleAttributes = aa.people.getPeopleAttributeByPeople(peopleContactSeq, contactTypeValue);

		peopleModel.setBusinessName2(applicantType);
		peopleModel.setBirthCity(communicationLang);
		contactModel.setPeople(peopleModel)
		aa.people.editContactByCapContact(contactModel);

		/*
		 * for (x in peopleAttributes.getOutput()) { var peopleAttributeName =
		 * peopleAttributes.getOutput()[x] .getAttributeName();
		 *
		 * if (peopleAttributeName == "APPLICANT TYPE" && applicantType != null) {
		 * editCapContactAttribute(capId, peopleContactSeq, peopleAttributeName,
		 * applicantType); } if (peopleAttributeName == "COMMUNICATION LANGUAGE" &&
		 * communicationLang != null) { editCapContactAttribute(capId,
		 * peopleContactSeq, peopleAttributeName, communicationLang); } }
		 */
	}

}

// Added by MSamy 17/08/2016 //
function addApplicantToCap4ACA() {

	puSeq = publicUserID.substring(10);
	var peopleResult = aa.people.getUserAssociatedContact(puSeq).getOutput().toArray();
	contactNum = peopleResult[0].getContactSeqNumber();
	getPerson = aa.people.getPeople(contactNum).getOutput();
	var phoneNumbers = "";
	if (getPerson.getPhone1CountryCode() != null && getPerson.getPhone1CountryCode() != "") {
		phoneNumbers += getPerson.getPhone1CountryCode();
	}
	if (getPerson.getPhone1() != null && getPerson.getPhone1() != "") {
		phoneNumbers += getPerson.getPhone1();
	}
	if (getPerson.getPhone2CountryCode() != null && getPerson.getPhone2CountryCode() != "") {
		phoneNumbers += " " + getPerson.getPhone2CountryCode();
	}
	if (getPerson.getPhone2() != null && getPerson.getPhone2() != "") {
		phoneNumbers += getPerson.getPhone2();
	}
	getPerson.getCompactAddress().setAddressLine3(phoneNumbers);
	addApplicant = aa.people.createCapContactWithRefPeopleModel(capId, getPerson);
	var contactTypeValue = getPerson.getContactType();
	aa.print("contact Type: " + contactTypeValue)
	// added by jovy start
	var capContacts = aa.people.getCapContactByCapID(capId).getOutput();
	for (var x = 0; x < capContacts.length; x++) {
		var capContactModel = capContacts[x].getCapContactModel();
		var b3ContactNumber = capContactModel.getContactSeqNumber();
		var g3ContactNumber = contactNum;
		var g3ContactType = contactTypeValue;
		if (g3ContactType == contactTypeValue) {
			copyB3ContactFromG3Contact(capId, b3ContactNumber, g3ContactNumber, g3ContactType);
		}
	}
}
// added by jovy start
function copyB3ContactFromG3Contact(capId, b3ContactNumber, g3ContactNumber, g3ContactType, callerID) {
	var cAttBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.ContactAttributeBusiness").getOutput();
	if (cAttBiz) {
		cAttBiz.copyB3ContactFromG3Contact(capId, b3ContactNumber, g3ContactNumber, g3ContactType, "ADMIN");
	}
}

function editCapContactAttribute(itemCap, contactSeq, pAttributeName, pNewAttributeValue) {
	try {
		var attrfound = false;
		var oldValue = null;

		var contactArr = aa.people.getCapContactByCapID(itemCap).getOutput();
		for (i in contactArr) {
			peopleModel = contactArr[i].getCapContactModel().getPeople();

			if (peopleModel.getContactSeqNumber() != contactSeq)
				continue;

			var peopAttrArray = peopleModel.getAttributes().toArray();
			for (x in peopAttrArray) {
				if (pAttributeName.equals(peopAttrArray[x].getAttributeName())) {
					oldValue = peopAttrArray[x].getAttributeValue();
					peopAttrArray[x].setAttributeValue(pNewAttributeValue);
					attrfound = true;
					break;
				}
			}

			if (attrfound) {
				contactArr[i].getCapContactModel().setPeople(peopleModel);
				var editResult = aa.people.editCapContactWithAttribute(contactArr[i].getCapContactModel());

			}

		}
	} catch (e) {
		aa.debug("Exception ", e);
	}

}

function assignCapTask(wfstr, username) // optional process name
{
	// Assigns the task to a user. No audit.
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length >= 3 && processName != null && processName != "") {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var itemCap = capId;
	if (arguments.length == 4) {
		itemCap = arguments[3]; // use cap ID specified in args
	}

	var taskUserResult = aa.person.getUser(username);
	if (taskUserResult.getSuccess())
		taskUserObj = taskUserResult.getOutput(); // User Object
	else {
		logMessage("**ERROR: Failed to get user object: " + taskUserResult.getErrorMessage());
		return false;
	}

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			fTask.setAssignedUser(taskUserObj);
			var taskItem = fTask.getTaskItem();
			var adjustResult = aa.workflow.assignTask(taskItem);

			logMessage("Assigned Workflow Task: " + wfstr + " to " + username);
			logDebug("Assigned Workflow Task: " + wfstr + " to " + username);
		}
	}
}

function removeGuideSheetItem(guidesheetSeqNum, guidesheetItemSeqNbr) {
	var removeResult = null;
	var gsiBiz = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
	if (gsiBiz) {
		try {
			removeResult = gsiBiz.removeGGuideSheetItem(aa.getServiceProviderCode(), guidesheetSeqNum, guidesheetItemSeqNbr, currentUserID);
		} catch (err) {
			aa.debug("Unable to remove guidesheet items ", err.message);
			throw (err);
		}
	}

}

// Created by John McKenney - 02/26/2015
// Gets info on the current CAP
function getCapWorkDesModelDM(capId) {
	capWorkDesModel = null;
	var s_result = aa.cap.getCapWorkDesByPK(capId);
	if (s_result.getSuccess()) {
		capWorkDesModel = s_result.getOutput();
	} else {
		aa.print("ERROR: Failed to get CapWorkDesModel: " + s_result.getErrorMessage());
		capWorkDesModel = null;
	}
	return capWorkDesModel;
}

function assignTasksToDepartment(assignedDept) {
	var doAssignCap = true;
	var itemCap = capId;
	var checkAgency = "DPE";

	if (arguments.length > 1)
		itemCap = arguments[1]; // use cap ID specified in args

	//
	// Get capdetail
	//
	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
		return false;
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return false;
	}
	cd = cdScriptObj.getCapDetailModel();

	//
	// if newDept is null, assign tasks to either 1) assigned department in cap
	// detail, or 2) department of user
	//
	if (!assignedDept) {
		assignedDept = cd.getAsgnDept()
		doAssignCap = false;

		if (!assignedDept) {
			doAssignCap = true;
			iNameResult = aa.person.getUser(currentUserID);
			if (!iNameResult.getSuccess()) {
				logDebug("**ERROR retrieving  user model " + assignId + " : " + iNameResult.getErrorMessage());
				return false;
			}
			iName = iNameResult.getOutput();
			assignedDept = iName.getDeptOfUser();
		}

		if (!assignedDept) {
			logDebug("**ERROR: Can't determine department to assign");
			return false;
		}

	}

	var assignBureau = "" + assignedDept.split("/")[2];

	//
	// Assign the new department to the CAP, since the cap is unassigned.
	//
	if (doAssignCap) {
		cd.setAsgnDept(assignedDept);
		cdWrite = aa.cap.editCapDetail(cd)
		if (!cdWrite.getSuccess()) {
			logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage());
			return false;
		}
	}

	//
	// Loop through all non-completed tasks. If Agency == DPE Change bureau to
	// match assigned department
	//

	var workflowResult = aa.workflow.getTasks(itemCap);
	if (!workflowResult.getSuccess()) {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	wfObj = workflowResult.getOutput();
	for ( var i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getCompleteFlag() != "N")
			continue;

		var taskUserObj = fTask.getTaskItem().getAssignedUser()

		if (taskUserObj.getAgencyCode() != checkAgency)
			continue; // skip non-DPE tasks
		if (taskUserObj.getBureauCode().equals(assignBureau))
			continue; // already assigned

		taskUserObj.setBureauCode(assignBureau);

		fTask.setAssignedUser(taskUserObj);
		var taskItem = fTask.getTaskItem();
		var adjustResult = aa.workflow.assignTask(taskItem);
	}

}
function doScriptActions_original() {

	if (typeof (appTypeArray) == "object") {
		include(prefix + ":" + appTypeArray[0] + "/*/*/*");
		include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/*");
		include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*");
		include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/*");
		include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/" + appTypeArray[3]);
		include(prefix + ":" + appTypeArray[0] + "/*/*/" + appTypeArray[3]);
		include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
		include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3]);
		logDebug(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3]);

		// Fish 01/14/2014
		include(prefix + ":*/*/*/*");
	}
}
function doScriptActions() {
//	eval(getScriptText("INCLUDE_CTX"));
//
//	try {
//		if (capId != null) {
//			CTX.executeRules(capId, controlString);
//		}
//
//	} catch (e) {
//		aa.debug("BRECANCEL", e)
//		cancel = true;
//		showMessage = true;
//
//		comment(e);
//	}
//	if (typeof CTXLOGS == "undefined") {
//		include("INCLUDE_CTXLOGS");
//	}
	try {
//		CTXLOGS.begin(capId, controlString, true)

		if (cancel != true) {
			if (typeof (appTypeArray) == "object") {
				include(prefix + ":" + appTypeArray[0] + "/*/*/*");
				include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/*");
				include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*");
				include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/*");
				include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/" + appTypeArray[3]);
				include(prefix + ":" + appTypeArray[0] + "/*/*/" + appTypeArray[3]);
				include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
				include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3]);
				logDebug(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3]);
				include(prefix + ":*/*/*/*");
			}
		}

	} catch (e) {
		aa.debug("CANCEL", e)
		cancel = true;
		showMessage = true;

		comment(e);
	} finally {
//		CTXLOGS.end()
	}
}
/**
 * translates the workflow task status to arabic.
 *
 * @param processCode ,
 *            the code of the workflow process
 * @param taskName ,
 *            the name of the workflow task
 * @param pTaskStatus ,
 *            the status of the workflow you need to translate into arabic.
 * @returns
 */
function translateTaskStatusToArabic(processCode, taskName, pTaskStatus) {

	var taskName;
	try {
		var dbObjectPrefix = aa.bizDomain.getBizDomainByValue("MePS Settings", "Query DB Prefix").getOutput().getDescription();
		var dbName = aa.bizDomain.getBizDomainByValue("MePS Settings", "Query DB Name").getOutput().getDescription();

		var sql = "SELECT G2.R3_ACT_STAT_DES AS STATUS ";
		sql += " FROM " + dbObjectPrefix + "R3STATYP G1 INNER JOIN " + dbObjectPrefix + "R3STATYP_I18N G2 ";
		sql += " ON G1.SERV_PROV_CODE = G2.SERV_PROV_CODE AND G1.RES_ID = G2.RES_ID AND G2.LANG_ID = 'ar_AE' ";
		sql += " where G1.R3_PROCESS_CODE = '" + processCode + "' ";
		sql += " AND G1.R3_ACT_TYPE_DES = '" + taskName + "' ";
		sql += " AND G1.R3_ACT_STAT_DES = '" + pTaskStatus + "' ";
		sql += " GROUP BY G2.R3_ACT_STAT_DES";

		// var dbName = "jetspeed";
		var aadba = aa.proxyInvoker.newInstance("com.accela.aa.datautil.AADBAccessor").getOutput();
		var aadba = aadba.getInstance();
		var result = aadba.select(sql, null);
		aa.debug("translation SQL Select Statement", sql);

		if (result.size() > 0) {
			var i = 0;
			while (i < result.size()) {
				taskName = result.get(i)[0];
				if (taskName)
					return taskName;
				i = i + 1;
			}
		}
	} catch (err) {
		logDebug("Runtime error occurred: " + err);
	}
	return pTaskStatus;
}

/**
 * gets arabic bizdomain value
 *
 * @param sdName ,
 *            name of standard choice
 * @param sdValue ,
 *            value to be trandlated
 * @returns
 */
function getArabicStandardChoiceValue(sdName, sdValue) {
	try {
		var dbObjectPrefix = aa.bizDomain.getBizDomainByValue("MePS Settings", "Query DB Prefix").getOutput().getDescription();
		var dbName = aa.bizDomain.getBizDomainByValue("MePS Settings", "Query DB Name").getOutput().getDescription();
		var sql = "select BIZDOMAIN_VALUE from " + dbObjectPrefix + "RBIZDOMAIN_VALUE_I18N where RES_ID in (";
		sql += " select RES_ID from " + dbObjectPrefix + "RBIZDOMAIN_VALUE where BIZDOMAIN='" + sdName + "'";
		sql += " and BIZDOMAIN_VALUE='" + sdValue + "')";
		sql += " and LANG_ID = 'ar_AE'";

		// var dbName = "jetspeed";
		var aadba = aa.proxyInvoker.newInstance("com.accela.aa.datautil.AADBAccessor").getOutput();
		var aadba = aadba.getInstance();
		var result = aadba.select(sql, null);

		if (result.size() > 0) {
				return result.get(0)[0];
		}
	} catch (err) {
		logDebug("Runtime error occurred: " + err);
	}
	return null;
}

/**
 * Retrieves the municipality code from the capId.
 *
 * @param CapID ,
 *            the capId of the record of which you need to get the municipality
 *            code.
 * @returns the municipality code (1- Municipality of Abu Dhabi ,2- Municipality
 *          of Al-Ain,3- Muncipality of the Western Region)
 */

//#NEED TO BE REVIEWED FOR SHA

function GetMunicipalityCodeByCapID(CapID) {
	try {
		var _AltID = CapID.getCustomID();
		var MunicipalityCode = parseFloat(_AltID.substring(1, 2));
		if (MunicipalityCode > 0 && MunicipalityCode < 4)
			return MunicipalityCode
	} catch (e) {
		throw "** Error Couldn't retrieve municipality code Error : " + e;
	}
	throw "** Error Couldn't retrieve municipality code , CAP ID. (" + CapID + ")";
}

/**
 * Retrieves the municipality description by the MunicipalityCode.
 *
 * @param municipalityCode ,
 *            the municipalityCode (1- Municipality of Abu Dhabi ,2-
 *            Municipality of Al-Ain,3- Muncipality of the Western Region)
 * @returns the municipality Description (1- Municipality of Abu Dhabi ,2-
 *          Municipality of Al-Ain,3- Muncipality of the Western Region)
 */

//#NEED TO BE REVIEWED FOR SHA

function GetMunicipalityDescByCode(municipalityCode) {
	try {
		if (municipalityCode == "1")
			return "Municipality of Abu Dhabi";
		else if (municipalityCode == "2")
			return "Municipality of Al-Ain";
		else if (municipalityCode == "3")
			return "Muncipality of the Western Region";
	} catch (e) {
		throw e;
	}
	throw "** Error Couldn't retrieve municipality description. (" + municipalityCode + ")";
}

/**
 * Retrieves the municipality Code by the Municipality Description.
 *
 * @param MunicipalityDesc ,
 *            the municipality Description (1- Municipality of Abu Dhabi ,2-
 *            Municipality of Al-Ain,3- Muncipality of the Western Region)
 * @returns the municipality Code (1- Municipality of Abu Dhabi ,2- Municipality
 *          of Al-Ain,3- Muncipality of the Western Region)
 */
function GetMunicipalityCodeByDesc(MunicipalityDesc) {
	try {
		var municipalityCode = aa.bizDomain.getBizDomainByValue("SD Municipality", MunicipalityDesc).getOutput().getDescription();
		return municipalityCode;
	} catch (e) {
		throw e;
	}
	// throw "** Error Couldn't retrieve municipality code. (" +
	// MunicipalityDesc+ ")";
}

/** *************************************************************************************** */
/** *************************************************************************************** */
/**
 * Check if DED License is valid for this license
 *
 * @param capSFRE
 * @returns {Boolean}
 */
function isDEDLicenseValid(capSFRE) {
	try {
		aa.debug("***** isDEDLicenseValidByNPORCertificateNo", '');
		if (typeof Record === "undefined") {
			eval(getScriptText("INCLUDE_RECORD"));
		}
		Record.require("INCLUDE_RECORD");
		var isValidDEDLicense = false;
		var capSFRERecord = new Record(capSFRE);
		var licenseNumDED = capSFRERecord.getASI('COMPANY INFORMATION', 'DED License Number');
		aa.debug("DED License Number", licenseNumDED);

		var capNBRE = aa.cap.getCapID(licenseNumDED).getOutput();
		var capNBRERecord = new Record(capNBRE);
		var licenseExpiryDate = capNBRERecord.getASI('GENERAL INFORMATION', 'Trade License Expiry Date');
		var licenseStatus = capNBRERecord.getASI('GENERAL INFORMATION', 'Trade License Status English');
		aa.debug("Trade License Expiry Date", licenseExpiryDate);
		aa.debug("Trade License Status English : ", licenseStatus);

		if (licenseExpiryDate != null && licenseStatus != null) {
			var dateLicenseExpiryDate = new Date(licenseExpiryDate);
			var currDate = new Date();
			if (licenseStatus == "Issued" && dateLicenseExpiryDate > currDate) {
				isValidDEDLicense = true;
			}
		}
		aa.debug("isValidDEDLicense : ", isValidDEDLicense);
		return isValidDEDLicense;
	} catch (e) {
		aa.debug("Exception : " + e);
		throw e;
	}
}

/**
 * loads the configuration record array values
 *
 * @returns {Array}
 */
function loadConfigRecordASITArrayValues(tableName) {
	aa.debug("***** loadConfigRecordASITArrayValues", '');
	var srr;
	var arr = new Array();
	var myCap;
	var myAppTypeString;
	var type = "GlobalSettings/Records Settings/Global Settings/GSCONF";
	var ata = type.split("/");
	var getCapResult = aa.cap.getCapIDsByAppSpecificInfoField("Configuration Title", "Configuration Record");
	if (!getCapResult.getSuccess()) {
		throw "**ERROR: getting caps by app type: " + getCapResult.getErrorMessage();
	}
	var apsArray = getCapResult.getOutput();
	for (aps in apsArray) {
		myCapRes = aa.cap.getCap(apsArray[aps].getCapID());
		if (!myCapRes.getSuccess()) {
			var error = myCapRes.getErrorMessage();
			if (error == "CapByPKNotFoundException") {
				continue;
			} else {
				throw "**ERROR: getting cap for capID [" + apsArray[aps].getCapID() + "]: " + error;
			}
		}
		myCap = myCapRes.getOutput();
		myAppTypeString = myCap.getCapType().toString();
		myAppTypeArray = myAppTypeString.split("/");

		isMatch = true;
		for (xx in ata) {
			if (!ata[xx].equalsIgnoreCase(myAppTypeArray[xx]) && !ata[xx].equals("*")) {
				isMatch = false;
			}
		}
		if (isMatch) {
			var debugMsg = "getAppIdByName(" + "Configuration Title" + "," + "Configuration Record" + "," + type + ") Returns " + apsArray[aps].getCapID().toString();
			var record = new Record(apsArray[aps].getCapID());
			arr = record.getASIT(tableName, false);
		}
	}
	return arr;
}
/**
 * get the table field paramter from table values.
 *
 * @param param
 * @param asit
 * @returns
 */
function getAsitParam(param, asit) {
	for (x in asit) {
		if (param == asit[x]["PARAMETER NAME"]) {
			return asit[x]["PARAMETER VALUE"];
			break;
		}
	}
}
function completeRenewalRecord(ParentCapID) {
	try {
		var t = aa.cap.getProjectByMasterID(ParentCapID, "Renewal", null);
		if (t.getSuccess()) {
			projectScriptModels = t.getOutput();
			if (projectScriptModels == null || projectScriptModels.length == 0) {
				logDebug("ERROR: Failed to get renewal CAP by parent CAPID(", e + ") for review");
			}

			for (var i = 0; i < projectScriptModels.length; i++) {
				projectScriptModel = projectScriptModels[i];
				logDebug("Renewal Record", projectScriptModel.getCapID());
				if (projectScriptModel != null && projectScriptModel.getStatus() == "Incomplete") {
					projectScriptModel.setStatus("Complete");
					aa.cap.updateProject(projectScriptModel);
				}
			}
		}
	} catch (e) {
		logDebug("****ERROR IN CreateAmendmentRelationShip:**** ", e);
	}
}
/**
 * Extend record expire date
 *
 * @param capId
 */
function extendRecordExpire(capId) {
	try {
		var modificationExpireLimit = "CLA_NPOR_MODIFICATION_EXPIRE_LIMIT";
		var asit = loadConfigRecordASITArrayValues('RENEWAL BATCH PARAMETERS');
		var expResult = aa.expiration.getLicensesByCapID(capId);
		if (!expResult.getSuccess()) {
			throw ("Problem while getting expiration license for record")
		}
		var rec = expResult.getOutput();
		var recExp = rec.getB1Expiration();
		var exdate = recExp.getExpDate();
		var newEndDate = new Date(exdate.getTime() + 24 * 60 * 60 * 1000 * (getAsitParam(modificationExpireLimit, asit)));
		recExp.setExpDate(newEndDate);
		var result = aa.expiration.editB1Expiration(recExp);
	} catch (e) {
		aa.debug("Error in NPOR Certificate renewal ", e);
	}
}
function getFormattedDate(date) {
	var year = date.getFullYear();
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;
	return month + '/' + day + '/' + year;
}
/***
 * (ERS) validate Engineers Registration service
 * @param engineerRegistrationNumber
 * @param emiratesIDNumber
 * @param licenseNumber
 * @returns {String}
 */
function validateEngineersRegistration(engineerRegistrationNumber,emiratesIDNumber,licenseNumber){
	var validationResult;
	try
	{
		eval(getScriptText("INCLUDE_WEBSERVICE"));
		var data = aa.util.newHashMap();
		data.put("engineerRegistrationNumber",engineerRegistrationNumber);
		data.put("emiratesIDNumber",emiratesIDNumber);
		data.put("licenseNumber", licenseNumber);
		data.put("RECORDID", emiratesIDNumber);
		var webserviceObj = new webService("ERS", "ALL", "ValidateEngineersRegistration", data);
	    var returnObj = webserviceObj.GetServiceResponse();
	    if (returnObj.CONNECT = "SUCCESS")
	    {
	    	validationResult = aa.util.getValueFromXML("validationResult",returnObj.RESPONSE);
		}
	    else
	    {
			validationResult = "ERROR";
		}
	    return validationResult;
	}
	catch (e)
	{
		aa.debug("Exception in validateEngineersRegistration ", e);
		return "ERROR";
	}
}
/***
 * Initiate MePS Plot Boundary Extract Job to be handled by MePS jobs
 * @param GISJobId
 * @param GISJobStatus
 * @param MePSCustomId
 * @param MePSEntityId
 * @param  JobType = : DOWNLOAD_PLOT_BOUNDARY , UPDATE_PARCEL_ATTRIBUTES
 * @returns
 */
function initiateMePSJob(GISJobId,GISJobStatus,MePSCustomId,MePSEntityId,JobType){
	var MePSLogEntryId;
	try
	{
		eval(getScriptText("INCLUDE_WEBSERVICE"));
		var data = aa.util.newHashMap();
		data.put("GISJobId",GISJobId);
		data.put("GISJobStatus",GISJobStatus);
		data.put("MePSEntityId", MePSEntityId);
		data.put("JobType",JobType);
		data.put("RECORDID",MePSEntityId);
		var webserviceObj = new webService("MePS", "ALL", "AddPlotBoundaryExtractionJob", data);
	    var returnObj = webserviceObj.GetServiceResponse();

	    if (returnObj.CONNECT = "SUCCESS") 
	    {
	    	MePSLogEntryId = aa.util.getValueFromXML("LogEntryId",returnObj.RESPONSE);
		} 
	    else 
	    {
			MePSLogEntryId = "ERROR";
		}
	    return MePSLogEntryId;
	} 
	catch (e) 
	{
		aa.debug("Exception in initiateMePSPlotBoundaryExtractJob ", e);
		return "ERROR";
	}
}
/***
 * get Plot Geometery from GIS
 * @param GISID
 * @returns {String}
 */
function getPlotGeometery(GISID)
{
	var rings;
	try
	{
		eval(getScriptText("INCLUDE_WEBSERVICE"));
		var data = aa.util.newHashMap();
		data.put("GISID",GISID);
		var webserviceObj = new webService("GIS","ALL","GetPlotGeometery",data);
	    var returnObj = webserviceObj.GetServiceResponse();
	    if (returnObj.CONNECT = "SUCCESS") 
	    {
	    	var response=returnObj.RESPONSE;
	    	var parsedData = JSON.parse(response);
	    	rings=parsedData.features[0]["geometry"].rings
		}
	    else 
	    {
			rings = "ERROR";
		}
	    return rings;
	} 
	catch (e) 
	{
		aa.debug("Exception in initiateMePSPlotBoundaryExtractJob ", e);
		return "ERROR";
	}
}
/***
 * initiate Data Extraction Job On GIS
 * @param ringsArr
 * @param GISID
 * @returns
 */
function initiateDataExtractionJobOnGIS(GISID)
{
	var jobInfo=new Array();
	try
	{
		eval(getScriptText("INCLUDE_WEBSERVICE"));
		var data = aa.util.newHashMap();
		data.put("GISID",GISID);
		var webserviceObj=new webService("GIS","ALL","InitiateDataExtraction",data);
		var returnObj=webserviceObj.GetServiceResponse();
		    if (returnObj.CONNECT = "SUCCESS") 
		    {
		    	var response=returnObj.RESPONSE;
		    	var parsedData = JSON.parse(response);
		    	jobInfo.push([parsedData["jobId"],parsedData["jobStatus"]]);
			}
		    return jobInfo;

	} 
	catch (e) 
	{
		aa.debug("Exception in initiateMePSPlotBoundaryExtractJob ", e);
		return "ERROR";
	}
}

/***
 * Initiate Get Areas WithDistance Job On GIS
 * @param ringsArr
 * @returns
 */
function initiateGetAreasWithDistanceOnGIS(ringsArr)
{
	try
	{
		//var token=generateMePSTokenOnGIS();
		var jobInfo=new Array();
//		if(token!=null && token!="" && token!=undefined && token!="ERROR")
//		{
			eval(getScriptText("INCLUDE_WEBSERVICE"));
			var rings="";
			for(item in ringsArr)
			{
				if(item == ringsArr.length-1)
				{
					rings= rings + "[" + ringsArr[item].split(",")[0] +"," + ringsArr[item].split(",")[1] +"]";
				}
				else
				{
					rings= rings + "[" + ringsArr[item].split(",")[0] +"," + ringsArr[item].split(",")[1] +"],";
				}
			}
			var data = aa.util.newHashMap();
			data.put("rings",rings);
			//data.put("Token",token);
			var webserviceObj=new webService("GIS","ALL","InitiateGetAreasWithDistance",data);
			var returnObj=webserviceObj.GetServiceResponse();
		    if (returnObj.CONNECT = "SUCCESS") {
		    	var response=returnObj.RESPONSE;
		    	var parsedData = JSON.parse(response);
		    	jobInfo.push([parsedData["jobId"],parsedData["jobStatus"]]);
			}
		    return jobInfo;
		//}
	}
	catch (e)
	{
		aa.debug("Exception in initiateMePSPlotBoundaryExtractJob ", e);
		return "ERROR";
	}
}

/***
 * initiate CAD File Extraction Job On GIS
 * @param ringsArr
 * @param GISID
 * @returns
 */
function initiateCADFileExtractionJobOnGIS(documentID,recordID)
{
	var jobInfo=new Array();
	try
	{
		eval(getScriptText("INCLUDE_WEBSERVICE"));
		var token=createReadTokenForGIS();
		aa.debug("initiateCADFileExtractionJobOnGIS ,token" , token);
		if(token!=null && token!="ERROR" && documentID!=null && documentID!='')
		{
			var bizDomainResult = aa.bizDomain.getBizDomain("MEPS_JOBS_CONFIG_ITEMS");
			if (!bizDomainResult.getSuccess()) 
			{
				throw "**ERROR: " + bizDomainResult.getErrorMessage();
			}
			var model = bizDomainResult.getOutput();
			var bizServer;
			for (var i = 0; i <= model.size() - 1; i++) 
			{
				if (model.get(i).getBizdomainValue() == "CAD_FILE_DOCUMENT_BIZ_SERVER") 
				{
					bizServer=model.get(i).getDescription();
					break;
				}
				
			}
			if(bizServer !=null)
			{
				var fullURL="{url:\"" + bizServer +"/apis/v4/documents/" + documentID + "/download?token=" + token + "\"}";
//				var fullURL="{url:\"http://192.168.207.38/meps/cadtoexcel/1.dwg\"}"; // for test because the URL above cannot be accessed by GIS
				aa.debug("initiateCADFileExtractionJobOnGIS ,fullURL" , fullURL);
				var data = aa.util.newHashMap();
				data.put("Input_CAD_File", fullURL );
//				data.put("Transaction_ID",recordID);
				data.put("Transaction_ID", "MEPS");
				data.put("RECORDID",recordID);
				var webserviceObj=new webService("GIS","ALL","InitiateCADFileExtraction",data);
				var returnObj=webserviceObj.GetServiceResponse();
				    if (returnObj.CONNECT = "SUCCESS") 
				    {
				    	var response=returnObj.RESPONSE;
				    	var parsedData = JSON.parse(response);
				    	jobInfo.push([parsedData["jobId"],parsedData["jobStatus"]]);
					}
			}

		}
		return jobInfo;
	} 
	catch (e) 
	{
		aa.debug("Exception in initiateCADFileExtractionJobOnGIS ", e);
		return "ERROR";
	}
}

/***
 * Generate accela token for GIS reading access 
 * @returns {String}
 */

function createReadTokenForGIS()
{
	try
	{
	eval(getScriptText("INCLUDE_WEBSERVICE"));
	var token;
	var data = aa.util.newHashMap();
    var webserviceObj=new webService("MePS","ALL","CreateReadTokenForGIS",data);
	var returnObj=webserviceObj.GetServiceResponse();
    if (returnObj.CONNECT = "SUCCESS")
    {
    	var response=returnObj.RESPONSE;
    	var parsedData = JSON.parse(response);
    	token=parsedData["result"];
	}
    else
    {
    	token="ERROR";
    }
	}
	catch(err)
	{
		token="ERROR";
	}
	return token;
}



/***
 * Generate MePS Token On GIS
 * @returns
 */
function generateMePSTokenOnGIS()
{
//	try{
//	//sample response : {"token":"qLrDOQsXW6lEI7PI1ydFtCaPuXt7Yz-DPCC2eVUAuEzQgI--A8ZRJZ_mrZPa7eXk","expires":1486894280436}
//	eval(getScriptText("INCLUDE_WEBSERVICE"));
//	var token;
//	var data = aa.util.newHashMap();
//    var webserviceObj=new webService("GIS","ALL","GenerateMePSToken",data);
//	var returnObj=webserviceObj.GetServiceResponse();
//    if (returnObj.CONNECT = "SUCCESS")
//    {
//    	var response=returnObj.RESPONSE;
//    	var parsedData = JSON.parse(response);
//    	token=JSON.parse(parsedData["token"]);
//	}
//    else
//    {
//    	token="ERROR";
//    }
//
//    if(token==null || token == "" || token =="ERROR")
//    {
//    	token="qLrDOQsXW6lEI7PI1ydFtCaPuXt7Yz-DPCC2eVUAuEzQgI--A8ZRJZ_mrZPa7eXk";
//    }
//
//	}
//	catch(err)
//	{
//		token="qLrDOQsXW6lEI7PI1ydFtCaPuXt7Yz-DPCC2eVUAuEzQgI--A8ZRJZ_mrZPa7eXk";
//	}
//	return token;
}


/** *************************************************************************************** */
/** *************************************************************************************** */

// added by Mahmoud Sami 29012017
function activateCustomTask(e) {
	var t = false;
	var n = "";
	if (arguments.length == 2) {
		n = arguments[1];
		t = true
	}
	var r = aa.workflow.getTaskItems(capId, e, n, null, null, null);
	if (r.getSuccess())
		var s = r.getOutput();
	else {
		aa.debug("**ERROR: Failed to get workflow object: ", "");
		return false
	}
	for (i in s) {
		var o = s[i];
		if (o.getTaskDescription().toUpperCase().equals(e.toUpperCase()) && (!t || o.getProcessCode().equals(n))) {
			var u = o.getStepNumber();
			var a = o.getProcessID();
			if (t) {
				aa.workflow.adjustTask(capId, u, a, "Y", "N", null, null)
			} else {
				aa.workflow.adjustTask(capId, u, a, "Y", "N", null, null)
			}
			aa.debug("Activating Workflow Task: ", e)
		}
	}
}

function deactivateCustomTask(e) {
	{
		var t = false;
		var n = "";
		if (arguments.length == 2) {
			n = arguments[1];
			t = true
		}
		aa.print(t);
		var r = aa.workflow.getTaskItems(capId, e, n, null, null, null);
		if (r.getSuccess())
			var s = r.getOutput();
		else {
			aa.print("**ERROR: Failed to get workflow object: ");
			return false
		}
		for (i in s) {
			var o = s[i];
			if (o.getTaskDescription().toUpperCase().equals(e.toUpperCase()) && (!t || o.getProcessCode().equals(n))) {
				var u = o.getStepNumber();
				var a = o.getProcessID();
				var f = o.getCompleteFlag();
				if (t) {
					aa.workflow.adjustTask(capId, u, a, "N", f, null, null)
				} else {
					aa.workflow.adjustTask(capId, u, a, "N", f, null, null)
				}
				aa.print("deactivating Workflow Task: " + e)
			}
		}
	}
}