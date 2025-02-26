/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_EPRF.js
| Event			: N/A
|
| Usage			: contains all the record's specific script
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: EHAMDI
| Created at	: 27/06/2021 14:22:14
|
/------------------------------------------------------------------------------------------------------*/
if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}
if (typeof SPSABASE === "undefined") {
	eval(getScriptText("INCLUDE_SPSABASE"));
}
if (typeof Utils === "undefined") {
	eval(getScriptText("INCLUDE_UTILS"));
}
if (typeof ECRL === "undefined") {
	eval(getScriptText("INCLUDE_ECRL"));
}
function EPRF(capId) {
	SPSABASE.call(this, capId);
};
EPRF.prototype = Object.create(SPSABASE.prototype);
EPRF.prototype.constructor = EPRF;
/*----------------------------------------------------ASI-----------------------------------------------*/
EPRF.RECORD_TYPE = "OSHJ/Profile/Entity Profile/EPRF";
EPRF.ASI = {};
EPRF.ASI.requestDetails = {};
EPRF.ASI.requestDetails.TableName = "REQUEST DETAILS";
EPRF.ASI.requestDetails.organizationType = "Organization Type";
EPRF.ASI.requestDetails.freeZone = "Free Zone";

EPRF.ASI.entityDetails = {};
EPRF.ASI.entityDetails.TableName = "ENTITY DETAILS";
EPRF.ASI.entityDetails.tradeLicenseNumber = "Trade License Number";
EPRF.ASI.entityDetails.emirate = "Emirate";
EPRF.ASI.entityDetails.organization = "Organization";
EPRF.ASI.entityDetails.other = "Other";
EPRF.ASI.entityDetails.entityNameInEnglish = "Entity Name in English";
EPRF.ASI.entityDetails.entityNameInArabic = "Entity Name in Arabic";
EPRF.ASI.entityDetails.entityContactNumber = "Entity Contact Number";
EPRF.ASI.entityDetails.entityEmail = "Entity Email";
EPRF.ASI.entityDetails.numberOfEmployees = "Number of Employees";
EPRF.ASI.entityDetails.numberOfEmployeesDedicateToWorkInSharjah = "Number of Employees Dedicate To Work In Sharjah";
EPRF.ASI.entityDetails.entityType = "Entity Type";

EPRF.ASI.mangerDetails = {};
EPRF.ASI.mangerDetails.TableName = "MANGER DETAILS";
EPRF.ASI.mangerDetails.firstName = "First Name";
EPRF.ASI.mangerDetails.lastName = "Last Name";
EPRF.ASI.mangerDetails.mobileNumber = "Mobile Number";
EPRF.ASI.mangerDetails.email = "Email";
EPRF.ASI.mangerDetails.usePassportDetails = "Use Passport Details";
EPRF.ASI.mangerDetails.emiratesId = "Emirates ID";
EPRF.ASI.mangerDetails.passportNumber = "Passport Number";
EPRF.ASI.mangerDetails.passportIssueDate = "Passport Issue Date";
EPRF.ASI.mangerDetails.passportIssueCountry = "Passport Issue Country";
EPRF.ASI.mangerDetails.passportExpiryDate = "Passport Expiry Date";

EPRF.ASI.entityRepresentative = {};
EPRF.ASI.entityRepresentative.TableName = "ENTITY REPRESENTATIVE";
EPRF.ASI.entityRepresentative.areYouAnEntityRepresentative = "Are you an entity representative?";
EPRF.ASI.entityRepresentative.useSameEmailAndPhoneNumber = "Use same email and phone number?";
EPRF.ASI.entityRepresentative.phoneNumber = "Phone Number";
EPRF.ASI.entityRepresentative.email = "Email";
EPRF.ASI.entityRepresentative.personTitle = "Person Title";
EPRF.ASI.entityRepresentative.landlineNumber = "Landline Number";
EPRF.ASI.entityRepresentative.representatives = "Representatives";

EPRF.ASI.addressDetails = {};
EPRF.ASI.addressDetails.TableName = "ADDRESS DETAILS";
EPRF.ASI.addressDetails.streetNumber = "Street Number";
EPRF.ASI.addressDetails.city = "City";
EPRF.ASI.addressDetails.area = "Area";
EPRF.ASI.addressDetails.otherArea = "Other Area";
EPRF.ASI.addressDetails.addressInEnglish = "Address in English";
EPRF.ASI.addressDetails.addressInArabic = "Address in Arabic";
EPRF.ASI.addressDetails.longitude = "Longitude";
EPRF.ASI.addressDetails.latitude = "Latitude";

EPRF.ASI.otherInformationDetails = {};
EPRF.ASI.otherInformationDetails.TableName = "OTHER INFORMATION DETAILS";
EPRF.ASI.otherInformationDetails.otherInformation1 = "Other Information 1";
EPRF.ASI.otherInformationDetails.otherInformation2 = "Other Information 2";
EPRF.ASI.otherInformationDetails.otherInformation3 = "Other Information 3";
//EPRF.ASI.otherInformationDetails.otherInformation4 = "Other Information 4";


EPRF.ASI.contractor = {};
EPRF.ASI.contractor.TableName = "CONTRACTOR";
EPRF.ASI.contractor.otherInformation4 = "Other Information 4";


EPRF.ASI.entitySelfDeclaration = {};
EPRF.ASI.entitySelfDeclaration.TableName = "ENTITY SELF-DECLARATION";
EPRF.ASI.entitySelfDeclaration.lastSelfDeclareDate = "Last Self-Declare Date";
EPRF.ASI.entitySelfDeclaration.dueDate = "Due Date";
EPRF.ASI.entitySelfDeclaration.fromRenewal = "From Renewal";
EPRF.ASI.entitySelfDeclaration.oldLevel = "Old Level";
EPRF.ASI.entitySelfDeclaration.renewedByIntegration = "Renewed By Integration";

EPRF.ASI.classificationDetails = {};
EPRF.ASI.classificationDetails.TableName = "CLASSIFICATION DETAILS";
EPRF.ASI.classificationDetails.entityClassification = "Entity Classification";
EPRF.ASI.classificationDetails.classificationDate = "Classification Date";
EPRF.ASI.classificationDetails.score = "Score";
EPRF.ASI.classificationDetails.activityClassification = "Activity Classification";


/*----------------------------------------------------ASIT----------------------------------------------*/
EPRF.ASIT = {};
EPRF.ASIT.activitiesDetails = {};
EPRF.ASIT.activitiesDetails.TableName = "ACTIVITIES DETAILS";
EPRF.ASIT.activitiesDetails.activity = "Activity";
EPRF.ASIT.activitiesDetails.subActivity = "Sub-Activity";
EPRF.ASIT.activitiesDetails.additionalActivities = "Additional Activities";
EPRF.ASIT.activitiesDetails.other = "Other";
EPRF.ASIT.activitiesDetails.numberOfStudents = "Number of Students";
EPRF.ASIT.activitiesDetails.typeOfEducationalFacility = "Type of Educational Facility";

EPRF.ASIT.scoreDetails = {};
EPRF.ASIT.scoreDetails.TableName = "SCORE DETAILS";
EPRF.ASIT.scoreDetails.criteria = "Criteria";
EPRF.ASIT.scoreDetails.criteriaValue = "Criteria Value";
EPRF.ASIT.scoreDetails.score = "Score";

EPRF.ASIT.representativesDetails = {};
EPRF.ASIT.representativesDetails.TableName = "REPRESENTATIVES DETAILS";
EPRF.ASIT.representativesDetails.firstNameOfPerson = "First Name of Person";
EPRF.ASIT.representativesDetails.lastNameOfPerson = "Last Name of Person";
EPRF.ASIT.representativesDetails.personTitle = "Person Title";
EPRF.ASIT.representativesDetails.mobileNumber = "Mobile Number";
EPRF.ASIT.representativesDetails.email = "Email";
EPRF.ASIT.representativesDetails.landlineNumber = "Landline Number";
EPRF.ASIT.representativesDetails.emiratesIdOrPassportDetails = "Emirates ID or Passport Details";
EPRF.ASIT.representativesDetails.emiratesId = "Emirates ID";
EPRF.ASIT.representativesDetails.passportNumber = "Passport Number";
EPRF.ASIT.representativesDetails.passportIssueDate = "Passport Issue Date";
EPRF.ASIT.representativesDetails.passportIssueCountry = "Passport Issue Country";
EPRF.ASIT.representativesDetails.passportExpiryDate = "Passport Expiry Date";
EPRF.ASIT.representativesDetails.isRegistered = "Is Registered";
EPRF.ASIT.representativesDetails.isPoaUploaded = "Is PoA Uploaded?";

EPRF.ASIT.ownerDetails = {};
EPRF.ASIT.ownerDetails.TableName = "OWNER DETAILS";
EPRF.ASIT.ownerDetails.nameInEnglish = "Name in English";
EPRF.ASIT.ownerDetails.nameInArabic = "Name in Arabic";
EPRF.ASIT.ownerDetails.ownerIndividualOrCompany = "Owner Individual or Company";
EPRF.ASIT.ownerDetails.ownerEmiratesId = "Owner Emirates ID";
EPRF.ASIT.ownerDetails.mobile = "Mobile";
EPRF.ASIT.ownerDetails.email = "Email";
EPRF.ASIT.ownerDetails.tradeLicenseNumber = "Trade License Number";
EPRF.ASIT.ownerDetails.companyManagerName = "Company Manager Name";
EPRF.ASIT.ownerDetails.companyManagerContactNumber = "Company Manager Contact Number";
EPRF.ASIT.ownerDetails.companyManagerEmail = "Company Manager Email";

EPRF.ASIT.branchesDetails = {};
EPRF.ASIT.branchesDetails.TableName = "BRANCHES DETAILS";
EPRF.ASIT.branchesDetails.otherEmirates = "Other Emirates";
EPRF.ASIT.branchesDetails.tradeLicenseNumber = "Trade License Number";

EPRF.ASIT.violationDetails = {};
EPRF.ASIT.violationDetails.TableName = "VIOLATION DETAILS";
EPRF.ASIT.violationDetails.violationCode = "Violation Code";
EPRF.ASIT.violationDetails.violationDescription = "Violation Description";
EPRF.ASIT.violationDetails.violationAmount = "Violation Amount";
EPRF.ASIT.violationDetails.violationDate = "Violation Date";

EPRF.ASIT.entityRequirements = {};
EPRF.ASIT.entityRequirements.TableName = "ENTITY REQUIREMENTS";
EPRF.ASIT.entityRequirements.no = "No";
EPRF.ASIT.entityRequirements.requirement = "Requirement";
EPRF.ASIT.entityRequirements.requirementAr = "Requirement AR";
EPRF.ASIT.entityRequirements.dueDate = "Due Date";
EPRF.ASIT.entityRequirements.extensionDate = "Extension Date";
EPRF.ASIT.entityRequirements.fulfilled = "Fulfilled";
EPRF.ASIT.entityRequirements.decisionTaken = "Decision Taken";
EPRF.ASIT.entityRequirements.active = "Active";

EPRF.ASIT.closeOutItems = {};
EPRF.ASIT.closeOutItems.TableName = "CLOSE OUT ITEMS";
EPRF.ASIT.closeOutItems.requestId = "Request ID";
EPRF.ASIT.closeOutItems.checklistName = "Checklist Name";
EPRF.ASIT.closeOutItems.checklistNameAr = "Checklist Name Ar";
EPRF.ASIT.closeOutItems.checklistItem = "Checklist Item";
EPRF.ASIT.closeOutItems.checklistItemAr = "Checklist Item Ar";
EPRF.ASIT.closeOutItems.checklistItemStatusGroup = "Checklist Item Status Group";
EPRF.ASIT.closeOutItems.comments = "Comments";
EPRF.ASIT.closeOutItems.dueDate = "Due Date";
EPRF.ASIT.closeOutItems.decisionTaken = "Decision Taken";

EPRF.ASIT.decisionsDetails = {};
EPRF.ASIT.decisionsDetails.TableName = "DECISIONS DETAILS";
EPRF.ASIT.decisionsDetails.requestId = "Request Id";
EPRF.ASIT.decisionsDetails.decisionType = "Decision Type";
EPRF.ASIT.decisionsDetails.comments = "Comments";
EPRF.ASIT.decisionsDetails.decisionDate = "Decision Date";
EPRF.ASIT.decisionsDetails.appeal = "Appeal";

EPRF.ASIT.periodicReportingHistory = {};
EPRF.ASIT.periodicReportingHistory.TableName = "PERIODIC REPORTING HISTORY";
EPRF.ASIT.periodicReportingHistory.recordId = "Record ID";
EPRF.ASIT.periodicReportingHistory.createdDate = "Created Date";
EPRF.ASIT.periodicReportingHistory.reportingPeriod = "Reporting Period";
EPRF.ASIT.periodicReportingHistory.entityClassification = "Entity Classification";

EPRF.ASIT.closeOutRecordsDetails = {};
EPRF.ASIT.closeOutRecordsDetails.TableName = "CLOSE OUT RECORDS DETAILS";
EPRF.ASIT.closeOutRecordsDetails.recordId = "Record ID";
EPRF.ASIT.closeOutRecordsDetails.recordName = "Record Name";
EPRF.ASIT.closeOutRecordsDetails.numberOfItemsToBeClosedOut = "Number of Items to be Closed Out";
EPRF.ASIT.closeOutRecordsDetails.theEarliestDueDate = "The Earliest Due Date";

/*-------------------------------------------SPECIFIC CODE----------------------------------------------*/
EPRF.prototype.demoFunction = function() {
	// write your code here
}

EPRF.createOrUpdateEntityProfileRecordType = function(registrationAltId,
		registrationCapId) {
	
	eval(getScriptText("INCLUDE_ERCL"));
	var entityProfileCapId;
	var entityProfile;
	
	var registration = new ERCL(registrationAltId);
	

	var children = registration.getChildren(EPRF.RECORD_TYPE,EPRF);
	if (children.length > 0) {
		entityProfile = children[0];
		entityProfileCapId = entityProfile.getCapID();

	} else {
		entityProfileCapId = Record.createNew(EPRF.RECORD_TYPE);
		entityProfile = new EPRF(entityProfileCapId);
	}

	var organizationTypeReg = registration.getASI(
			ERCL.ASI.requestDetails.TableName,
			ERCL.ASI.requestDetails.organizationType);
	entityProfile.editASI(EPRF.ASI.requestDetails.TableName,
			EPRF.ASI.requestDetails.organizationType, organizationTypeReg);
	var freeZoneReg = registration.getASI(ERCL.ASI.requestDetails.TableName,
			ERCL.ASI.requestDetails.freeZone);
	entityProfile.editASI(EPRF.ASI.requestDetails.TableName,
			EPRF.ASI.requestDetails.freeZone, freeZoneReg);
	var tradeLicenseNumberReg = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.tradeLicenseNumber);
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.tradeLicenseNumber, tradeLicenseNumberReg);
	var emirate = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.emirate);
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.emirate, emirate);
	var organization = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.organization);
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.organization, organization);
	var other = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.other);
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.other, other);
	var entityNameInEnglishReg = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.entityNameInEnglish);
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.entityNameInEnglish, entityNameInEnglishReg);
	var entityNameInArabicReg = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.entityNameInArabic);
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.entityNameInArabic, entityNameInArabicReg);
	
	var entityContactNumberReg = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.entityContactNumber);
	if (Utils.isBlankOrNull(entityContactNumberReg)) {
		entityContactNumberReg = registration.getASI(
				ERCL.ASI.entityDetails.TableName,
				ERCL.ASI.entityDetails.extractedEntityContactNumber);
	}
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.entityContactNumber, entityContactNumberReg);
	
	var entityEmailReg = registration.getASI(ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.entityEmail);
	if (Utils.isBlankOrNull(entityEmailReg)) {
		entityEmailReg = registration.getASI(
				ERCL.ASI.entityDetails.TableName,
				ERCL.ASI.entityDetails.extractedEntityEmail);
	}
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.entityEmail, entityEmailReg);
	
	var numberOfEmployeesReg = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.numberOfEmployees);
	if (Utils.isBlankOrNull(numberOfEmployeesReg)) {
		numberOfEmployeesReg = registration.getASI(
				ERCL.ASI.entityDetails.TableName,
				ERCL.ASI.entityDetails.extractedNumberOfEmployees);
	}
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.numberOfEmployees, numberOfEmployeesReg);
	
	var numberOfEmployeesDedicateToWorkInSharjahReg = registration.getASI(
			ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.numberOfEmployeesDedicateToWorkInSharjah);
	if (Utils.isBlankOrNull(numberOfEmployeesDedicateToWorkInSharjahReg)) {
		numberOfEmployeesDedicateToWorkInSharjahReg = registration.getASI(
				ERCL.ASI.entityDetails.TableName,
				ERCL.ASI.entityDetails.extractedNumberOfEmployeesDedicateToWorkInSharjah);
	}
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.numberOfEmployeesDedicateToWorkInSharjah,
			numberOfEmployeesDedicateToWorkInSharjahReg);
	var entityTypeReg = registration.getASI(ERCL.ASI.entityDetails.TableName,
			ERCL.ASI.entityDetails.entityType);
	entityProfile.editASI(EPRF.ASI.entityDetails.TableName,
			EPRF.ASI.entityDetails.entityType, entityTypeReg);
	
//	var areYouAnEntityRepresentative = registration.getASI(ERCL.ASI.entityRepresentative.TableName,
//			ERCL.ASI.entityRepresentative.areYouAnEntityRepresentative);
//	entityProfile.editASI(EPRF.ASI.entityRepresentative.TableName,
//			EPRF.ASI.entityRepresentative.areYouAnEntityRepresentative, areYouAnEntityRepresentative);
//	
//	var useSameEmailAndPhoneNumber = registration.getASI(ERCL.ASI.entityRepresentative.TableName,
//			ERCL.ASI.entityRepresentative.useSameEmailAndPhoneNumber);
//	entityProfile.editASI(EPRF.ASI.entityRepresentative.TableName,
//			EPRF.ASI.entityRepresentative.useSameEmailAndPhoneNumber, useSameEmailAndPhoneNumber);
//	
//	var phoneNumber = registration.getASI(ERCL.ASI.entityRepresentative.TableName,
//			ERCL.ASI.entityRepresentative.phoneNumber);
//	entityProfile.editASI(EPRF.ASI.entityRepresentative.TableName,
//			EPRF.ASI.entityRepresentative.phoneNumber, phoneNumber);
//	
//	var email = registration.getASI(ERCL.ASI.entityRepresentative.TableName,
//			ERCL.ASI.entityRepresentative.email);
//	entityProfile.editASI(EPRF.ASI.entityRepresentative.TableName,
//			EPRF.ASI.entityRepresentative.email, email);
//
//	var personTitle = registration.getASI(ERCL.ASI.entityRepresentative.TableName,
//			ERCL.ASI.entityRepresentative.personTitle);
//	entityProfile.editASI(EPRF.ASI.entityRepresentative.TableName,
//			EPRF.ASI.entityRepresentative.personTitle, personTitle);
//	
//	var landlineNumber = registration.getASI(ERCL.ASI.entityRepresentative.TableName,
//			ERCL.ASI.entityRepresentative.landlineNumber);
//	entityProfile.editASI(EPRF.ASI.entityRepresentative.TableName,
//			EPRF.ASI.entityRepresentative.landlineNumber, landlineNumber);
//	
//	var representatives = registration.getASI(ERCL.ASI.entityRepresentative.TableName,
//			ERCL.ASI.entityRepresentative.representatives);
//	entityProfile.editASI(EPRF.ASI.entityRepresentative.TableName,
//			EPRF.ASI.entityRepresentative.representatives, representatives);

	var streetNumberReg = registration.getASI(ERCL.ASI.addressDetails.TableName,
			ERCL.ASI.addressDetails.streetNumber);
	entityProfile.editASI(EPRF.ASI.addressDetails.TableName,
			EPRF.ASI.addressDetails.streetNumber, streetNumberReg);
	var areaReg = registration.getASI(ERCL.ASI.addressDetails.TableName,
			ERCL.ASI.addressDetails.area);
	entityProfile.editASI(EPRF.ASI.addressDetails.TableName,
			EPRF.ASI.addressDetails.area, areaReg);
	var cityReg = registration.getASI(ERCL.ASI.addressDetails.TableName,
			ERCL.ASI.addressDetails.city);
	entityProfile.editASI(EPRF.ASI.addressDetails.TableName,
			EPRF.ASI.addressDetails.city, cityReg);
	
	var otherAreaReg = registration.getASI(ERCL.ASI.addressDetails.TableName,
			ERCL.ASI.addressDetails.otherArea);
	entityProfile.editASI(EPRF.ASI.addressDetails.TableName,
			EPRF.ASI.addressDetails.otherArea, otherAreaReg);

	var addressInEnglishReg = registration.getASI(
			ERCL.ASI.addressDetails.TableName,
			ERCL.ASI.addressDetails.addressInEnglish);
	entityProfile.editASI(EPRF.ASI.addressDetails.TableName,
			EPRF.ASI.addressDetails.addressInEnglish, addressInEnglishReg);
	var addressInArabicReg = registration.getASI(
			ERCL.ASI.addressDetails.TableName,
			ERCL.ASI.addressDetails.addressInArabic);
	entityProfile.editASI(EPRF.ASI.addressDetails.TableName,
			EPRF.ASI.addressDetails.addressInArabic, addressInArabicReg);
	var longitudeReg = registration.getASI(ERCL.ASI.addressDetails.TableName,
			ERCL.ASI.addressDetails.longitude);
	entityProfile.editASI(EPRF.ASI.addressDetails.TableName,
			EPRF.ASI.addressDetails.longitude, longitudeReg);
	var latitudeReg = registration.getASI(ERCL.ASI.addressDetails.TableName,
			ERCL.ASI.addressDetails.latitude);
	entityProfile.editASI(EPRF.ASI.addressDetails.TableName,
			EPRF.ASI.addressDetails.latitude, latitudeReg);
	var otherInformation1Reg = registration.getASI(
			ERCL.ASI.otherInformationDetails.TableName,
			ERCL.ASI.otherInformationDetails.otherInformation1);
	entityProfile.editASI(EPRF.ASI.otherInformationDetails.TableName,
			EPRF.ASI.otherInformationDetails.otherInformation1,
			otherInformation1Reg);
	var otherInformation2Reg = registration.getASI(
			ERCL.ASI.otherInformationDetails.TableName,
			ERCL.ASI.otherInformationDetails.otherInformation2);
	entityProfile.editASI(EPRF.ASI.otherInformationDetails.TableName,
			EPRF.ASI.otherInformationDetails.otherInformation2,
			otherInformation2Reg);
	var otherInformation3Reg = registration.getASI(
			ERCL.ASI.otherInformationDetails.TableName,
			ERCL.ASI.otherInformationDetails.otherInformation3);
	entityProfile.editASI(EPRF.ASI.otherInformationDetails.TableName,
			EPRF.ASI.otherInformationDetails.otherInformation3,
			otherInformation3Reg);
	var otherInformation14Reg = registration.getASI(
			ERCL.ASI.contractor.TableName,
			ERCL.ASI.contractor.otherInformation4);
	entityProfile.editASI(EPRF.ASI.contractor.TableName,
			EPRF.ASI.contractor.otherInformation4,
			otherInformation14Reg);
	var entityClassificationReg = registration.getASI(
			ERCL.ASI.classificationDetails.TableName,
			ERCL.ASI.classificationDetails.entityClassification);
	entityProfile.editASI(EPRF.ASI.classificationDetails.TableName,
			EPRF.ASI.classificationDetails.entityClassification,
			entityClassificationReg);
	var classificationDateReg = registration.getASI(
			ERCL.ASI.classificationDetails.TableName,
			ERCL.ASI.classificationDetails.classificationDate);
	entityProfile.editASI(EPRF.ASI.classificationDetails.TableName,
			EPRF.ASI.classificationDetails.classificationDate,
			classificationDateReg);
	var score = registration.getASI(ERCL.ASI.classificationDetails.TableName,
			ERCL.ASI.classificationDetails.score);
	entityProfile.editASI(EPRF.ASI.classificationDetails.TableName,
			EPRF.ASI.classificationDetails.score, score);
	
	var dueDate = registration.getASI(ERCL.ASI.entitySelfDeclaration.TableName,
			ERCL.ASI.entitySelfDeclaration.dueDate);
	entityProfile.editASI(EPRF.ASI.entitySelfDeclaration.TableName,
			EPRF.ASI.entitySelfDeclaration.dueDate, dueDate);
	
	var classificationDetails = registration.getASI(ERCL.ASI.classificationDetails.TableName,
			ERCL.ASI.classificationDetails.activityClassification);
	entityProfile.editASI(EPRF.ASI.classificationDetails.TableName,
			EPRF.ASI.classificationDetails.activityClassification, classificationDetails);
	
	//copy manager details
	var firstNameReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.firstName);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.firstName, firstNameReg);
	
	var lastNameReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.lastName);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.lastName, lastNameReg);
	
	var mobileNumberReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.mobileNumber);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.mobileNumber, mobileNumberReg);
	
	var emailReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.email);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.email, emailReg);
	
	var usePassportDetailsReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.usePassportDetails);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.usePassportDetails, usePassportDetailsReg);
	
	var emiratesIdReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.emiratesId);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.emiratesId, emiratesIdReg);
	
	var passportNumberReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.passportNumber);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.passportNumber, passportNumberReg);
	
	var passportIssueDateReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.passportIssueDate);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.passportIssueDate, passportIssueDateReg);
	
	var passportIssueCountryReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.passportIssueCountry);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.passportIssueCountry, passportIssueCountryReg);
	
	var passportExpiryDateReg = registration.getASI(ERCL.ASI.mangerDetails.TableName,
			ERCL.ASI.mangerDetails.passportExpiryDate);
	entityProfile.editASI(EPRF.ASI.mangerDetails.TableName,
			EPRF.ASI.mangerDetails.passportExpiryDate, passportExpiryDateReg);

	//
//	var requirements =registration.getASIT(EPRF.ASIT.entityRequirements.TableName);
//	entityProfile.fillRequirements(requirements);

	// entityProfile.copyAsitFromOtherRecord(registration,
	// EPRF.ASIT.activityDetails.TableName);
	entityProfile.copyAsitFromOtherRecord(registration,
			EPRF.ASIT.representativesDetails.TableName);
	entityProfile.copyAsitFromOtherRecord(registration,
			EPRF.ASIT.ownerDetails.TableName);
	entityProfile.copyAsitFromOtherRecord(registration,
			EPRF.ASIT.activitiesDetails.TableName);
	// entityProfile.copyAsitFromOtherRecord(registration,
	// EPRF.ASIT.branchesDetails.TableName);
	entityProfile.copyAsitFromOtherRecord(registration,
			EPRF.ASIT.scoreDetails.TableName);

//	entityProfile.setDueDate(entityClassificationReg);


	var levelsASIT = [];
	var row = [];
	row["Level"] = entityClassificationReg;
	row["Date"] = classificationDateReg;
	row["Activity Classification"] = classificationDetails;
	levelsASIT.push(row);
	entityProfile.updateASIT("LEVELS HISTORY",levelsASIT)
	

	
	entityProfile.addParent(registrationAltId);

	entityProfile.copyRegistrationContactsToProfile(registration);

	entityProfile.updateAddressAndDistrict();

	EPRF.prototype.copyDocuments = function(fromCapID, toCapID) {
		var capDocResult = aa.document
				.getDocumentListByEntity(fromCapID, "CAP");
		if (capDocResult.getSuccess()) {
			var capDocResultOutput = capDocResult.getOutput();
			if (capDocResultOutput.size() > 0) {
				for (index = 0; index < capDocResultOutput.size(); index++) {
					var documentModel = capDocResultOutput.get(index);
					var res = aa.document.createDocumentAssociation(
							documentModel, toCapID, "CAP");
				}
			}
		}
	}
	entityProfile.copyDocuments(registrationCapId, entityProfileCapId);
	return entityProfileCapId;
}

EPRF.prototype.updateEntityClassification = function()
{
	var activities = this.getASIT(EPRF.ASIT.activitiesDetails.TableName)
	var arr = [];
	for ( var x in activities) {
		var activity = activities[x][EPRF.ASIT.activitiesDetails.activity];
		var subActivity = activities[x][EPRF.ASIT.activitiesDetails.subActivity];
		var numberOfStudents = activities[x][EPRF.ASIT.activitiesDetails.numberOfStudents];
		var typeOfEducational = activities[x][EPRF.ASIT.activitiesDetails.typeOfEducationalFacility];
		var subActivityScore = 0;

		if (subActivity == "Number of Students") {
			subActivityScore = Utils.getLookupValue("SD_NUMBER_STUDENTS",
					numberOfStudents);
		} else if (subActivity == "Type of Educational Facility") {
			subActivityScore = Utils.getLookupValue(
					"SD_TYPE_OF_EDUCATIONAL_FACILITY", typeOfEducational);
		} else {
			subActivityScore = Utils.getLookupValue("SD_SUB_ACTIVITIES",
					subActivity);
		}

		if (!Utils.isBlankOrNull(subActivityScore)) {
			subActivityScore = Number(subActivityScore);
		} else {
			subActivityScore = 0
		}

		if (arr.toString().indexOf(activity) == -1) {
			arr.push(String(activity));
			arr[activity] = subActivityScore;
		} else {
			if (activity == "Education") {
				arr[activity] += subActivityScore;
			} else {
				arr[activity] = Math.max(arr[activity], subActivityScore);
			}

		}
	}

	var score = 0;
	for (var y = 0; y < arr.length; y++) {
		score += arr[arr[y]];
	}

	var entityType = this.getASI(EPRF.ASI.requestDetails.TableName,
			EPRF.ASI.requestDetails.organizationType);
	var entityTypeScore = Utils.getLookupValue("SD_ORGANIZATION_TYPE", entityType);
	if (!Utils.isBlankOrNull(entityTypeScore)) {
		score += Number(entityTypeScore);
	}

	var numberOfEmployees = 0;

	if (entityType != "Outside Sharjah") {
		numberOfEmployees = this.getASI(EPRF.ASI.entityDetails.TableName,
				EPRF.ASI.entityDetails.extractedNumberOfEmployees);
		if (Utils.isBlankOrNull(numberOfEmployees)) {
			numberOfEmployees = Number(this.getASI(
					EPRF.ASI.entityDetails.TableName,
					EPRF.ASI.entityDetails.numberOfEmployees));
		} else {
			numberOfEmployees = Number(numberOfEmployees);
		}
	} else {
		numberOfEmployees = this
				.getASI(
						EPRF.ASI.entityDetails.TableName,
						EPRF.ASI.entityDetails.extractedNumberOfEmployeesDedicateToWorkInSharjah);
		if (Utils.isBlankOrNull(numberOfEmployees)) {
			numberOfEmployees = Number(this
					.getASI(
							EPRF.ASI.entityDetails.TableName,
							EPRF.ASI.entityDetails.numberOfEmployeesDedicateToWorkInSharjah));
		} else {
			numberOfEmployees = Number(numberOfEmployees);
		}
	}

	if (numberOfEmployees <= 15) {
		score += 5;
	} else if (numberOfEmployees > 15 && numberOfEmployees <= 50) {
		score += 15;
	} else if (numberOfEmployees > 50 && numberOfEmployees <= 250) {
		score += 20;
	} else if (numberOfEmployees >= 251) {
		score += 25;
	}

	var info1 = this.getASI(EPRF.ASI.otherInformationDetails.TableName,
			EPRF.ASI.otherInformationDetails.otherInformation1);
	var info2 = this.getASI(EPRF.ASI.otherInformationDetails.TableName,
			EPRF.ASI.otherInformationDetails.otherInformation2);
	var info3 = this.getASI(EPRF.ASI.otherInformationDetails.TableName,
			EPRF.ASI.otherInformationDetails.otherInformation3);
	var info4 = this.getASI(EPRF.ASI.contractor.TableName,
			EPRF.ASI.contractor.otherInformation4);

	if (info1 == "CHECKED") {
		score += 25;
	}
	if (info2 == "CHECKED") {
		score += 15;
	}
	if (info3 == "CHECKED") {
		score += 10;
	}
	if (info4 == "CHECKED") {
		score += 5;
	}

	this.editASI(EPRF.ASI.classificationDetails.TableName,
			EPRF.ASI.classificationDetails.score, score);

	var classificationLevel = "";
	if (score >= 5 && score <= 20) {
		classificationLevel = "Level 1"
	} else if (score >= 21 && score <= 40) {
		classificationLevel = "Level 2"
	} else if (score >= 41 && score <= 60) {
		classificationLevel = "Level 3"
	} else if (score >= 61 && score <= 75) {
		classificationLevel = "Level 4"
	} else if (score >= 76) {
		classificationLevel = "Level 5"
	}

	this.updateRequirements(classificationLevel);
	this.editASI(EPRF.ASI.classificationDetails.TableName,
			EPRF.ASI.classificationDetails.entityClassification,
			classificationLevel);
	this.editASI(EPRF.ASI.classificationDetails.TableName,
			EPRF.ASI.classificationDetails.classificationDate, Utils
					.formatDate(new Date(), "MM/dd/yyyy"));
}

EPRF.prototype.updateRequirements = function(classificationLevel) {
	eval(getScriptText("INCLUDE_SPSABASE"));
	var requirements = SPSAGS.getOSHMinimumRequirements(classificationLevel);
	var newDataSet = [];

	var profileRequirements = this
			.getASIT(EPRF.ASIT.entityRequirements.TableName);

	for ( var y in profileRequirements) {
		var obj = [];

		obj[String(EPRF.ASIT.entityRequirements.no)] = profileRequirements[y]["No"];
		obj[String(EPRF.ASIT.entityRequirements.requirement)] = profileRequirements[y]["Requirement"];
		obj[String(EPRF.ASIT.entityRequirements.requirementAr)] = String(profileRequirements[y]["Requirement AR"]);
		obj[String(EPRF.ASIT.entityRequirements.dueDate)] = profileRequirements[y]["Due Date"];
		obj[String(EPRF.ASIT.entityRequirements.fulfilled)] = profileRequirements[y]["Fulfilled"];
		obj[String(EPRF.ASIT.entityRequirements.active)] = "No";
		obj[String(EPRF.ASIT.entityRequirements.decisionTaken)] = profileRequirements[y]["Decision Taken"];

		newDataSet.push(obj);
	}

	for ( var x in requirements) {
		var obj = [];

		obj[String(EPRF.ASIT.entityRequirements.no)] = requirements[x]["No"];
		obj[String(EPRF.ASIT.entityRequirements.requirement)] = requirements[x]["Requirement"];
		obj[String(EPRF.ASIT.entityRequirements.requirementAr)] = String(requirements[x]["Requirement AR"]);
		obj[String(EPRF.ASIT.entityRequirements.dueDate)] =  String(requirements[x]["Due Date"]);
//			EPRF.getDueDate(
//				requirements[x]["Unit"], requirements[x]["Time"]);
		obj[String(EPRF.ASIT.entityRequirements.fulfilled)] = "No";
		obj[String(EPRF.ASIT.entityRequirements.active)] = "Yes";

		newDataSet.push(obj);

	}

	this.updateASIT(EPRF.ASIT.entityRequirements.TableName, newDataSet);
}


EPRF.prototype.setDueDate = function() {
	var getExpResult = aa.expiration.getLicensesByCapID(this.getCapID());
	if (getExpResult.getSuccess()) {
		expScriptModel = getExpResult.getOutput();
		var expModel = expScriptModel.getB1Expiration();
		if (expModel) {// to avoid exception if configuration is wrong
			expModel.setExpStatus("Active");

			var classificationLevel = this.getASI(
					EPRF.ASI.classificationDetails.TableName,
					EPRF.ASI.classificationDetails.entityClassification)

			var classificationActivity = this.getASI(
					EPRF.ASI.classificationDetails.TableName,
					EPRF.ASI.classificationDetails.activityClassification)
			var time = SPSAGS.getRenewalTimeByActivityAndLevel(
					classificationActivity, classificationLevel);

			if (time > 0) {

				var dueDate = EPRF.getDueDate(SPSAGS.getRenewalUnit(), time);

				var expiry = new Date(dueDate);// MM/dd/yyy only works here
				expiry.setDate(expiry.getDate());// + 365);// you can set
				// and date + days or
				// exact expiry date
				expModel.setExpDate(expiry);
				aa.expiration.editB1Expiration(expModel);
			} else {
				expModel.setExpStatus("");
				aa.expiration.editB1Expiration(expModel);
			}

			var t = aa.cap.getProjectByMasterID(this.getCapID(), "Renewal",
					null);
			if (t.getSuccess()) {
				var projectScriptModels = t.getOutput();
				if (projectScriptModels == null
						|| projectScriptModels.length == 0) {
					logDebug(
							"ERROR: Failed to get renewal CAP by parent CAPID(",
							e + ") for review");
				}
				for (var i = 0; i < projectScriptModels.length; i++) {
					var projectScriptModel = projectScriptModels[i];
					logDebug("Renewal Record", projectScriptModel.getCapID());
					if (projectScriptModel != null
							&& projectScriptModel.getStatus() == "Incomplete") {
								aa.print("projectScriptModel.getStatus() == Incomplete");
						logDebug(projectScriptModel.getStatus() == "Incomplete");
						projectScriptModel.setStatus("Complete");
						aa.cap.updateProject(projectScriptModel);
					}
				}
			}
		}
	}

}

EPRF.prototype.fillRequirements = function(dueDate) {
	var classificationLevel = this.getASI(
			EPRF.ASI.classificationDetails.TableName,
			EPRF.ASI.classificationDetails.entityClassification)
			
	var requirements = SPSAGS.getOSHMinimumRequirements(classificationLevel);
	var newDataSet = [];
	

//	var profileRequirements = this
//			.getASIT(EPRF.ASIT.entityRequirements.TableName);
//	for ( var x in profileRequirements) {
//		var obj = [];
//
//		var reqNo = profileRequirements[x]["No"];
//		var req = profileRequirements[x]["Requirement"];
//
//		obj[String(EPRF.ASIT.entityRequirements.no)] = String(reqNo);
//		obj[String(EPRF.ASIT.entityRequirements.requirement)] = String(req);
//		obj[String(EPRF.ASIT.entityRequirements.requirementAr)] = String(profileRequirements[x]["Requirement AR"]);
//		obj[String(EPRF.ASIT.entityRequirements.dueDate)] = dueDate;
//		obj[String(EPRF.ASIT.entityRequirements.active)] = "No";
//		obj[String(EPRF.ASIT.entityRequirements.fulfilled)] = String(profileRequirements[x][EPRF.ASIT.entityRequirements.fulfilled]);
//
//		newDataSet.push(obj);
//	}
//	
	for ( var x in requirements) {
		var obj = [];

		var reqNo = requirements[x]["No"];
		var req = requirements[x]["Requirement"];

		obj[String(EPRF.ASIT.entityRequirements.no)] = String(reqNo);
		obj[String(EPRF.ASIT.entityRequirements.requirement)] = String(req);
		obj[String(EPRF.ASIT.entityRequirements.requirementAr)] = String(requirements[x]["Requirement AR"]);
		obj[String(EPRF.ASIT.entityRequirements.dueDate)] = dueDate;
		obj[String(EPRF.ASIT.entityRequirements.active)] = "Yes";
		obj[String(EPRF.ASIT.entityRequirements.fulfilled)] = "No";

		newDataSet.push(obj);

	}

	this.updateASIT(EPRF.ASIT.entityRequirements.TableName, newDataSet);
//	var newDataSet = [];
//
//	for ( var x in requirements) {
//		var obj = [];
//
//		obj[String(EPRF.ASIT.entityRequirements.no)] = requirements[x]["No"];
//		obj[String(EPRF.ASIT.entityRequirements.requirement)] = requirements[x]["Requirement"];
//		obj[String(EPRF.ASIT.entityRequirements.requirementAr)] = requirements[x]["Requirement AR"];
//		obj[String(EPRF.ASIT.entityRequirements.dueDate)] = requirements[x]["Due Date"];
//		obj[String(EPRF.ASIT.entityRequirements.fulfilled)] = "No";
//		obj[String(EPRF.ASIT.entityRequirements.active)] = "Yes";
//
//		newDataSet.push(obj);
//	}
//
//	this.updateASIT(EPRF.ASIT.entityRequirements.TableName, newDataSet)
}

EPRF.getDueDate = function(unit, time) {
	var today = new Date();
	var dueDate = new Date();
//	aa.print(unit)
//	aa.print(time)
	if (unit == "Day") {
		dueDate.setDate(today.getDate() + Number(time));
	} else if (unit == "Week") {
		dueDate.setDate(today.getDate() + (7 * Number(time)));
	} else if (unit == "Month") {
		dueDate = new Date(today.setMonth(today.getMonth() + Number(time)));
	}

//	aa.print(dueDate)
	var retVal = Utils.formatDate(dueDate, "MM/dd/yyyy")
//	aa.print(retVal)
	return retVal;
}

EPRF.getChildren = function(capId) {

	returnClass = Record;

	var retArray = new Array();

	var childCapIdSkip = null;

	var getCapResult = aa.cap.getChildByMasterID(capId);
	if (!getCapResult.getSuccess()) {
		var error = getCapResult.getErrorMessage();

		if (error == "") {
			return [];
		} else {
			throw ("**ERROR: getChildren returned an error: " + error);
		}

	}

	var childArray = getCapResult.getOutput();

	var childCapId;
	var capTypeStr = "";
	var childTypeArray;
	var isMatch;
	for (xx in childArray) {
		childCapId = childArray[xx].getCapID();
		var childObj = Object.create(returnClass.prototype);
		returnClass.apply(childObj, [ childCapId ]);

		retArray.push(childObj);

		var childrenOfChild = EPRF.getChildren(childCapId);
		if (childrenOfChild.length > 0) {
			for ( var y in childrenOfChild) {
				retArray.push(childrenOfChild[y])
			}

		}
	}

	return retArray;

}

EPRF.prototype.updateAddressAndDistrict = function() {
    logDebug("updating address and district")
    var addressModel = this.getAddressesCaps();

    if (addressModel == null || addressModel.length == 0) {
         var newAddressModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.AddressModel").getOutput();
         newAddressModel.setCapID(this.getCapID());
         newAddressModel.setServiceProviderCode(aa.getServiceProviderCode());
         newAddressModel.setAuditID(aa.getAuditID());
         newAddressModel.setPrimaryFlag("Y");

         this.createOrUpdateAddress(newAddressModel, true);
    }
    addressModel = this.getAddressesCaps();
    if (addressModel != null) {
         for (index in addressModel) {
              var address = addressModel[index];
              address.setCapID(this.getCapID());
              this.createOrUpdateAddress(address, false);

              // Remove old districts
              var vDistArr = aa.address.getAssignedAddressDistrictForDaily(this.capId.ID1, this.capId.ID2, this.capId.ID3, address.addressId).getOutput();

              for (x in vDistArr) {
                   var res = aa.address.deleteAddressDistrictForDaily(this.capId.ID1, this.capId.ID2, this.capId.ID3, address.addressId, vDistArr[x].getDistrict());
              }
//              // Update district
//              var district = this.getASI(IVIS.ASI.address.TableName, IVIS.ASI.address.directorate, "");
//              if (district != "") {
//                   this.updateDistrict(district);
//              }
         }
    }
}

EPRF.prototype.createOrUpdateAddress = function(addressModel, isNew) {
	var streetNumber = this.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.streetNumber);
// aa.print("streetNumber " + streetNumber)
	var addressEnglish = this.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.addressInEnglish);
    var addressArabic = this.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.addressInArabic);

    var entityNameEnglish = this.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.entityNameInEnglish);
   var entityNameArabic = this.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.entityNameInArabic);

    var addressArray = [];
    if(!Utils.isBlankOrNull(entityNameEnglish))
	{
    	addressArray.push(entityNameEnglish + " ");
	}
    if(!Utils.isBlankOrNull(addressEnglish))
	{
    	addressArray.push(addressEnglish + " ");
	}

    if(!Utils.isBlankOrNull(entityNameArabic))
	{
    	addressArray.push(entityNameArabic + " ");
	}
    if(!Utils.isBlankOrNull(addressArabic))
	{
    	addressArray.push(addressArabic + " ");
	}
    
    var addressLine1 = "";
//	var addressLine1 = addressArray.toString();
	for ( var x=0; x <  addressArray.length; x++) {
		addressLine1 += addressArray[x] + " - ";
	}
    
    addressLine1 = addressLine1.substring(0,addressLine1.length - 3);
    
//    var addressLine1 = entityNameEnglish + " , " + addressEnglish + " - " + addressArabic//+ " , " + entityNameArabic + " - " + ;
    
    var city = this.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.city);
    var area = this.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.area);
    if(area == "Other")
    	{
    	area = this.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.otherArea);
    	}
    
    var sencondaryRoad = this.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.emirate);
	if (Utils.isBlankOrNull(sencondaryRoad)) {
		sencondaryRoad = "Sharjah"
	}
	
//	aa.print(streetNumber)
	if (!Utils.isBlankOrNull(addressLine1)) {
		addressModel.setAddressLine1(addressLine1)
	}
    
    var long = this.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.longitude);
    var lat = this.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.latitude);

    if (lat && long) {
		lat = parseFloat(lat);
		if (lat.toString() != "NaN") {
			addressModel.setXCoordinator(parseFloat(lat));
		}

		long = parseFloat(long);
		if (long.toString() != "NaN") {
			addressModel.setYCoordinator(parseFloat(long));
		}
    }

// if (directorate != "") {
//         addressModel.setInspectionDistrict(directorate);
//    }
    
    if (city != "") {
        var arabicCityValue = getDecisionArabisValue("SD_CITY", city)
        addressModel.setCity(city + " - " + arabicCityValue );
   }
    
    if (area != "") {
        var arabicAreaValue = getDecisionArabisValue("SD_AREA", area)
         addressModel.setAddressLine2(area + " - " + arabicAreaValue);
    }

    if (streetNumber != "") {
         addressModel.setStreetName(streetNumber);
    } 
    
    if (isNew) {
         aa.address.createAddress(addressModel);
    } else {
         aa.address.editAddress(addressModel);
    }
}

EPRF.prototype.copyRegistrationContactsToProfile = function(srcRecord) {

	var contacts = this.getContacts();
	for ( var x in contacts) {
		seqNumber = contacts[x].getCapContactModel().getContactSeqNumber();
		this.removeContact(seqNumber);
		java.lang.System.out.println("EPRF Logs conact removed " + seqNumber)

	}
	
	if (srcRecord == null) {
		throw "Record.prototype.copyContacts :: source record can not be null";
	}

	var representitivesTable = srcRecord
			.getASIT(ERCL.ASIT.representativesDetails.TableName);
	var keys = new Array();

	for ( var x in representitivesTable) {
		var key = "";
		var useEmiratesOrPassword = representitivesTable[x][ERCL.ASIT.representativesDetails.emiratesIdOrPassportDetails];
		if (useEmiratesOrPassword == "Emirates ID") {
			var emiratesId = representitivesTable[x][ERCL.ASIT.representativesDetails.emiratesId];

			var contact = Utils.getContactDataByEmirateID(emiratesId);
			key = contact.getContactSeqNumber();
		} else {
			var passportNumber = representitivesTable[x][ERCL.ASIT.representativesDetails.passportNumber];
			var contact = Utils.getContactDataByPassportNumber(passportNumber);
			key = contact.getContactSeqNumber();
		}

		if (!Utils.isBlankOrNull(key)) {
			keys.push(parseInt(key))
		}
	}

	var srcContacts = srcRecord.getContacts();

	for ( var index in srcContacts) {

		var contact = srcContacts[index].getCapContactModel();

		var contactKey = contact.getRefContactNumber();


		if (keys.indexOf(parseInt(contactKey)) > -1) {
			var contactType = contact.getContactType();

			// FARAG review with Tony
			contact.setCapID(this.capId);
			var addedContact = aa.people.createCapContact(contact).getOutput();
			var peopleObj = contact.getPeople();
			peopleObj.setFlag("Y");
			contact.setPeople(peopleObj);
			var editResult = aa.people.editCapContact(contact);
			logDebug("Contact [" + contact.getLastName() + "] copied to "
					+ this.toString());
		}
	}

}
EPRF.prototype.isEligableToProject = function() {

	var profileStatus = this.getCapStatus();

	if (profileStatus != 'Application Submitted' && profileStatus != 'Expired' && profileStatus != 'Cancelled') {
		var activitiesList = SPSAGS.getProjectActivities();

		var activitites = this.getASIT(EPRF.ASIT.activitiesDetails.TableName);

		for ( var x in activitites) {
			var activity = activitites[x][EPRF.ASIT.activitiesDetails.activity];
			if (activitiesList.toString().indexOf(activity) > -1) {
				return [ 'OSHJ/Reporting/Project Activity Report/PARP' ];
			}
		}
	}
	
	return [];
}
EPRF.createRenewalRecordForBackend = function(parentEPRF){
	var renewalRecord = null;
	try{
		var expResult = aa.expiration.getLicensesByCapID(parentEPRF.capId);
                                        if (expResult.getSuccess()) {
	                                          var exp = expResult.getOutput();
                                             var expModel = exp.getB1Expiration();
                                             if (expModel) {
	                                            var expStatus = expModel.getExpStatus();
                                                aa.print("createRenewalRecordForBackend - exp status = " + expStatus);
                                             }
                                        }

		eval(getScriptText("INCLUDE_UEPR"));
		aa.print("createRenewalRecordForBackend start ...");
		var renewalCapId = Record.createNew(UEPR.RECORD_TYPE);
		renewalRecord = new UEPR(renewalCapId);
		
		renewalRecord.editASI("SERVICE DETAILS","Parent Service ID", parentEPRF.getCustomID());
		
		var newCustomId = String(renewalRecord.getCustomID()).replace("UEPR","RERR");
		var updated = aa.cap.updateCapAltID(renewalRecord.capId, newCustomId);
		aa.print("renewalRecord ID = " + newCustomId);
		
		renewalRecord.setApplicationName("Renewal Entity Profile");
		renewalRecord.editASI(UEPR.ASI.renewalSettings.TableName, UEPR.ASI.renewalSettings.isRenewalRequest, "CHECKED");
		
		var result = aa.cap.updateAccessByACA(renewalRecord.capId, "Y");
		
		var expResult = aa.expiration.getLicensesByCapID(parentEPRF.capId);
                                        if (expResult.getSuccess()) {
	                                          var exp = expResult.getOutput();
                                             var expModel = exp.getB1Expiration();
                                             if (expModel) {
	                                            var expStatus = expModel.getExpStatus();
                                                aa.print("createRenewalRecordForBackend #2- exp status = " + expStatus);
                                             }
                                        }
		var servProvCode = aa.getServiceProviderCode();
        parentEPRF.addChild(newCustomId, servProvCode);
		aa.print("end renewal record creation");
		var expResult = aa.expiration.getLicensesByCapID(parentEPRF.capId);
                                        if (expResult.getSuccess()) {
	                                          var exp = expResult.getOutput();
                                             var expModel = exp.getB1Expiration();
                                             if (expModel) {
	                                            var expStatus = expModel.getExpStatus();
                                                aa.print("createRenewalRecordForBackend #3 - exp status = " + expStatus);
                                             }
                                        }
		var prfRec = new EPRF(parentEPRF.getCustomID());
		prfRec.setDueDate();
		
		prfRec.editASI(EPRF.ASI.entitySelfDeclaration.TableName, EPRF.ASI.entitySelfDeclaration.renewedByIntegration , "CHECKED");
		
		renewalRecord.copyContacts(prfRec);
		
				var expResult = aa.expiration.getLicensesByCapID(parentEPRF.capId);
                                        if (expResult.getSuccess()) {
	                                          var exp = expResult.getOutput();
                                             var expModel = exp.getB1Expiration();
                                             if (expModel) {
	                                            var expStatus = expModel.getExpStatus();
                                                aa.print("createRenewalRecordForBackend #4 - exp status = " + expStatus);
                                             }
                                        }
	}catch(e){
		java.lang.System.out.println("createRenewalRecordForBackend - Error: " + e);
	}
	
	return renewalRecord;
}
EPRF.checkIfRenewalRecordExist = function(eprfRecord){
	var isRenewalRecExist = false;
	
	try{
		eval(getScriptText("INCLUDE_UEPR"));
		
		var childs = eprfRecord.getChildren(UEPR.RECORD_TYPE);
		for(child in childs){
			var updateRecord = childs[child];
			var currentStatus = updateRecord.getCapStatus();
			var isRenewalRecord = updateRecord.getASI(UEPR.ASI.renewalSettings.TableName, UEPR.ASI.renewalSettings.isRenewalRequest, "");
			
			if(updateRecord.isComplete() && isRenewalRecord == "CHECKED" && currentStatus != 'Completed'){
				isRenewalRecExist = true;
			}
		}
	
	}catch(e){
		java.lang.System.out.println("checkIfRenewalRecordExist - Error: " + e);
	}
	
	return isRenewalRecExist;
}
EPRF.getGovernmentIntegrationValues = function(eprfRecord){
	var hasDifferentValues = {
		numberOfEmployeesChanged: false
	};
	
	try{
	
	   eval(getScriptText("INCLUDE_INTEGRATION"));
       eval(getScriptText("INCLUDE_UTILS"));
        
     var requestBody = {};
        var organizationValue = eprfRecord.getASI("ENTITY DETAILS", "Organization")
        organizationId = Utils.getLookupValue("SD_Organization_list", organizationValue);
        requestBody.organizationId = organizationId;
       
       var res = INTEGRATION.getDHROrganizationEmployeeCount(requestBody);

        if(res.data.success) {
            var employeesCount = eprfRecord.getASI("ENTITY DETAILS", "Number of Employees")
            if(employeesCount != res.data.Organization_Employee_Count.EmployeesCount) {
                hasDifferentValues.numberOfEmployeesChanged = true;
            }

        }

	
	}catch(e){
		java.lang.System.out.println("getGovernmentIntegrationValues - Error: " + e);
	}
	
	return hasDifferentValues;
}
EPRF.getFreeZoneIntegrationValues = function(tradeLicense, city, eprfRecord) {
    var hasDifferentValues = {
        activitiesChanged: false
        , numberOfEmployeesChanged: false
    };

    try {
        eval(getScriptText("INCLUDE_INTEGRATION"));
        eval(getScriptText("INCLUDE_ERCL"));

        var parents = eprfRecord.getParents(ERCL.RECORD_TYPE, ERCL, "");
        if(parents != null && parents.length > 0) {
            var parentERCL = parents[0];
            var extractedMOHRENumberOfEmployees = parentERCL.getASI("MOHRE INTEGRATION VALUES", "Extracted Total Employees", "");
            aa.print("ercl employees = " + extractedMOHRENumberOfEmployees)
            if(!Utils.isBlankOrNull(extractedMOHRENumberOfEmployees)) {
                var mohreRes = INTEGRATION.mohreGetEstablishmentWithOwners(tradeLicense, city);
                if(mohreRes.success) {
                    var data = mohreRes.data;
                    if(data != null) {
                        var totalEmployees = data.TotalEmployee ? data.TotalEmployee : "";
                        aa.print("integration employees = " + totalEmployees);
                        if(totalEmployees != extractedMOHRENumberOfEmployees) {
                            hasDifferentValues.numberOfEmployeesChanged = true;
                            aa.print("mohreEmployeesNumberChanged.....");
                        }
                    }
                }

            }
        }

        var freeZoneType = eprfRecord.getASI("REQUEST DETAILS", "Free Zone", "");
        if(freeZoneType.equals('SAIF FZ')) {
            var res = INTEGRATION.sfzGetLicenseDetails(tradeLicense);
            if(res.success) {
                var data = res.data[0];

                if(data.noOfEmployees) {
                    var totalEmployees = eprfRecord.getASI("ENTITY DETAILS", "Number of Employees");
                    if(totalEmployees != data.noOfEmployees) {
                        hasDifferentValues.numberOfEmployeesChanged = true;
                    }

                }

                if(data.acitivity) {
                    var activitiesList = EPRF.getLastActivitiesList(eprfRecord);
                    activitiesList = activitiesList.split(",");
                    for(var i in activitiesList) {
                        if(data.acitivity.indexOf(activitiesList[i]["Activity"]) == -1) {
                            hasDifferentValues.activitiesChanged = true;
                            break;
                        }
                    }
                }
            }
        } else {
            var res = INTEGRATION.getHFZALicenseByLicenseNo(tradeLicense);
            var data = null;

            if(res.success) {
                data = res.data;
                location = data.location;
                owner = data.owners;
            }

            if(data.totalEmployees) {
                var totalEmployees = eprfRecord.getASI("ENTITY DETAILS", "Number of Employees");
                if(totalEmployees != data.totalEmployees) {
                    hasDifferentValues.numberOfEmployeesChanged = true;
                    aa.print("employees diff")
                }
            }
            aa.print("hasDifferentValues.numberOfEmployeesChanged = " + hasDifferentValues.numberOfEmployeesChanged)
            var extractedActivities = data.license.activity;
            extractedActivities = extractedActivities.split(",");

            if(extractedActivities.length) {
                var activitiesList = EPRF.getLastActivitiesList(eprfRecord); //eprfRecord.getASIT("ACTIVITIES DETAILS");
                activitiesList = activitiesList.split(",");
                java.lang.System.out.println("getFreeZoneIntegrationValues - EPRF stored activities: " + activitiesList);
                for(var i in activitiesList) {
                if(extractedActivities.indexOf(activitiesList[i]) == -1) {
                        hasDifferentValues.activitiesChanged = true;
                        break;
                    }
                }
            }
        }


    } catch (e) {
        java.lang.System.out.println("getFreeZoneIntegrationValues - Error: " + e);
    }

    return hasDifferentValues;
}
EPRF.getSEDDIntegrationValues = function(licId, city, eprfRecord) {
    var hasDifferentValues = {
	       activitiesChanged: false,
           numberOfEmployeesChanged: false
    };

    try {
        eval(getScriptText("INCLUDE_INTEGRATION"));
        eval(getScriptText("INCLUDE_ERCL"));

        var parents = eprfRecord.getParents(ERCL.RECORD_TYPE, ERCL, "");
        if(parents != null && parents.length > 0) {
            var parentERCL = parents[0];
            var extractedMOHRENumberOfEmployees = parentERCL.getASI("MOHRE INTEGRATION VALUES", "Extracted Total Employees", "");
            if(!Utils.isBlankOrNull(extractedMOHRENumberOfEmployees)) {
                var mohreRes = INTEGRATION.mohreGetEstablishmentWithOwners(licId, city);
                if(mohreRes.success) {
                    var data = mohreRes.data;
                    if(data != null) {
                        var totalEmployees = data.TotalEmployee ? data.TotalEmployee : "";
                        if(totalEmployees != extractedMOHRENumberOfEmployees) {
                            hasDifferentValues.numberOfEmployeesChanged = true;
                        }
                    }
                }

            }
        }
          
        var res = INTEGRATION.seddGetLicenseDetails(String(licId));

        if(res.success) {
            var data = res.data;
            var extractedActivities = data.activities;
            var extractedActivitiesArr;

            for(var x in extractedActivities) {
                var activity = extractedActivities[x];
                extractedActivitiesArr += activity['actNameEn'] + '|' + activity['actNameAr'];

                if(extractedActivities.length - 1 > x) {
                    extractedActivitiesArr += ', ';
                }
            }

            extractedActivitiesArr = extractedActivitiesArr.split(",");

            if(extractedActivities.length) {
                var activitiesList = EPRF.getLastActivitiesList(eprfRecord);//eprfRecord.getASIT("ACTIVITIES DETAILS");
                java.lang.System.out.println("getFreeZoneIntegrationValues - EPRF stored activities: " + activitiesList);
                for(var i in activitiesList) {
                    if(extractedActivitiesArr.indexOf(activitiesList[i]["Activity"]) == -1) {
                        hasDifferentValues.activitiesChanged = true;
                    }
                }
            }

        }


    } catch (e) {
         java.lang.System.out.println("getSEDDIntegrationValues - Error: " + e);
    }

    return hasDifferentValues;
}
EPRF.checkIntegrationValues = function(eprfRecord){
	
	var hasDifferentValues = {};

	try{
		var organizationType = eprfRecord.getASI(EPRF.ASI.requestDetails.TableName, EPRF.ASI.requestDetails.organizationType, "");
		var tradeLicenseNumber = eprfRecord.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.tradeLicenseNumber, "");
		var city = eprfRecord.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.city, "");
		aa.print("checkIntegrationValues ...")
		aa.print("organizationType = " + organizationType);
		if(organizationType == "Free Zone") {
           aa.print("organizationType == Free Zone");
            hasDifferentValues = EPRF.getFreeZoneIntegrationValues(tradeLicenseNumber, city, eprfRecord);

        } else if(organizationType == "Government") {
	        aa.print("organizationType == Government");
            hasDifferentValues = EPRF.getGovernmentIntegrationValues(eprfRecord);

        } else if(organizationType == 'Private (SEDD)' || organizationType == 'Private') {
	        aa.print("organizationType == private");
            hasDifferentValues = EPRF.getSEDDIntegrationValues(tradeLicenseNumber, city, eprfRecord);
        }
        aa.print("activitiesChanged.......")
        aa.print("activitiesChanged = " + hasDifferentValues.activitiesChanged + " - numberOfEmployeesChanged = " + hasDifferentValues.numberOfEmployeesChanged)
        if(hasDifferentValues.activitiesChanged || hasDifferentValues.numberOfEmployeesChanged){
	        var renewalRecord = EPRF.createRenewalRecordForBackend(eprfRecord); 
            renewalRecord.updateRenewalRecordFields(eprfRecord, true);
        }

	}catch(e){
		java.lang.System.out.println("checkIntegrationValues - Error: " + e);
	}
	return hasDifferentValues;
}
EPRF.handleRenewalEffectiveDateSettings = function(isRenewalEnabled, isDateEffective) {
	 var SCRIPT_VERSION = '3.0';
	    eval(getScriptText("INCLUDE_DAO"));
        eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
        eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
    try {
	    aa.print('handleRenewalEffectiveDateSettings - isDateEffective = ' + isDateEffective)
        aa.print('handleRenewalEffectiveDateSettings - isRenewalEnabled = ' + isRenewalEnabled)
        //This batch should run after the expiration date batch.

        if (isRenewalEnabled == "CHECKED" && isDateEffective) {
           
                var sql = " SELECT DISTINCT(P.B1_ALT_ID), EXPIRATION.EXPIRATION_DATE, " +
                " CASE " +
                " WHEN DATEDIFF(DAY, GETDATE(), EXPIRATION.EXPIRATION_DATE) > 0  and DATEDIFF(DAY, GETDATE(), EXPIRATION.EXPIRATION_DATE) <= 30 THEN 'About to Expire' " +
                " WHEN DATEDIFF(DAY, GETDATE(), EXPIRATION.EXPIRATION_DATE) <= 0 THEN 'Expired' " +
                " END AS REC_STATUS " +
                " FROM B1PERMIT P JOIN B1_EXPIRATION EXPIRATION ON " +
                " EXPIRATION.B1_PER_ID1 = P.B1_PER_ID1 AND EXPIRATION.B1_PER_ID2 = P.B1_PER_ID2 " +
                " AND EXPIRATION.B1_PER_ID3 = P.B1_PER_ID3 AND P.SERV_PROV_CODE = EXPIRATION.SERV_PROV_CODE " +
                " WHERE P.B1_PER_GROUP = 'OSHJ' AND P.B1_PER_TYPE = 'Profile' AND P.B1_PER_SUB_TYPE = 'Entity Profile' " +
                " AND P.B1_PER_CATEGORY = 'EPRF' AND P.REC_STATUS = 'A' AND P.SERV_PROV_CODE = ? " +
                " AND p.B1_APPL_STATUS IN('Active','About to Expire')  AND (EXPIRATION.EXPIRATION_DATE <  GETDATE() OR " +
                " (DATEDIFF(DAY, GETDATE(), EXPIRATION.EXPIRATION_DATE) <= 30 AND DATEDIFF(DAY, GETDATE(), EXPIRATION.EXPIRATION_DATE) > 0)) ";

            var results = new DAO("").execSimpleQuery(sql, [aa.getServiceProviderCode()]);
            aa.print("handleRenewalEffectiveDateSettings - case enabled and date is effecttive");
            for (var x in results) {
                var altID = results[x]['B1_ALT_ID'] + "";
                var recStatus = results[x]['REC_STATUS'] + "";
                var rec = new EPRF(altID);
                 aa.print("altID = " + altID)
                var classificationActivity = rec.getASI("CLASSIFICATION DETAILS", "Activity Classification", "");

                if (classificationActivity) {
                    var isRenewalActivityEnabled = SPSAGS.isRenewalActivityEnabled(classificationActivity);
                     aa.print("classificationActivity = " + classificationActivity)
                      aa.print("isRenewalActivityEnabled = " + isRenewalActivityEnabled)
                      aa.print("recStatus = " + recStatus)
                    if (isRenewalActivityEnabled) {
                        if (recStatus == 'Expired') {
	                         aa.print("expired case")
                            var exp = aa.expiration.getLicensesByCapID(rec.capId).getOutput();
                            exp.setExpStatus('Expired');
                            aa.expiration.editB1Expiration(exp.getB1Expiration());
                            rec.updateStatus("Expired");
                        } else if (recStatus == 'About to Expire') {
	                         aa.print("about to expired case")
                            var exp = aa.expiration.getLicensesByCapID(rec.capId).getOutput();
                            exp.setExpStatus('About to Expire');
                            aa.expiration.editB1Expiration(exp.getB1Expiration());
                            rec.updateStatus("About to Expire");
                        }
                    }
                }
            }
        } else  if (!isRenewalEnabled || (isRenewalEnabled == "CHECKED" & !isDateEffective)){ 
	         aa.print("handleRenewalEffectiveDateSettings - case disabled or enabled and date is not effecttive");
            var sql = " SELECT DISTINCT(P.B1_ALT_ID), EXPIRATION.EXPIRATION_DATE " +
                " FROM B1PERMIT P JOIN B1_EXPIRATION EXPIRATION ON " +
                " EXPIRATION.B1_PER_ID1 = P.B1_PER_ID1 AND EXPIRATION.B1_PER_ID2 = P.B1_PER_ID2 " +
                " AND EXPIRATION.B1_PER_ID3 = P.B1_PER_ID3 AND P.SERV_PROV_CODE = EXPIRATION.SERV_PROV_CODE " +
                " WHERE P.B1_PER_GROUP = 'OSHJ' AND P.B1_PER_TYPE = 'Profile' AND P.B1_PER_SUB_TYPE = 'Entity Profile' " +
                " AND P.B1_PER_CATEGORY = 'EPRF' AND P.REC_STATUS = 'A' AND P.SERV_PROV_CODE = 'SPSA' " +
                " AND P.B1_APPL_STATUS IN ('Expired', 'About to Expire') " +
                " AND (EXPIRATION.EXPIRATION_DATE <  GETDATE() OR " +
                " (DATEDIFF(DAY, GETDATE(), EXPIRATION.EXPIRATION_DATE) <= 30 AND DATEDIFF(DAY, GETDATE(), EXPIRATION.EXPIRATION_DATE) > 0)) ";
            aa.print(sql);
            var results = new DAO("").execSimpleQuery(sql, []);
            //aa.print(results);
            for (var x in results) {
                var altID = results[x]['B1_ALT_ID'] + "";
                java.lang.System.out.println("EPRF handleRenewalEffectiveDateSettings Disabled - altID: " + altID);
                aa.print("EPRF handleRenewalEffectiveDateSettings disabled - altID: " + altID);
                var rec = new EPRF(altID);
                rec.updateStatus("Active");
                aa.print("EPRF handleRenewalEffectiveDateSettings after update status = : " + rec.getCapStatus());
                var exp = aa.expiration.getLicensesByCapID(rec.capId).getOutput();
                exp.setExpStatus('Active');
                aa.expiration.editB1Expiration(exp.getB1Expiration());
            }
        }
    } catch (e) {
        java.lang.System.out.println("handleRenewalEffectiveDateSettings - Error: " + e);
    }
}
EPRF.getLastActivitiesList = function(eprfRecord) {
	var extractedActivities = null;
    try {
        var childs = eprfRecord.getChildren(UEPR.RECORD_TYPE, Record);
        if (childs.length > 1) {
            for (var i = childs.length - 2; i >= 0; i--) {
                var updateRecord = childs[i];
                if (updateRecord.isComplete()) {
            extractedActivities = String(updateRecord.getASI(UEPR.ASI.extractedActivities.TableName, UEPR.ASI.extractedActivities.extractedActivities, ""));
                    break;
                }
            }
            if (!extractedActivities) {
                extractedActivities = EPRF.getErclExtractedActivities(eprfRecord);
            }
        } else {
            extractedActivities = EPRF.getErclExtractedActivities(eprfRecord);
        }
    } catch (e) {
        java.lang.System.out.println("Expression:: getLastActivitiesList - Error: " + e);
    }
    return extractedActivities;
}

EPRF.getErclExtractedActivities = function(eprfRecord) {
    var extractedActivities = null;
    try {
	        eval(getScriptText("INCLUDE_ERCL"));
            var parents = eprfRecord.getParents(ERCL.RECORD_TYPE, ERCL, "");
            if(parents != null && parents.length > 0) {
                var parentRecord = parents[0];
                extractedActivities = String(parentRecord.getASI(ERCL.ASI.extractedActivities.TableName, ERCL.ASI.extractedActivities.extractedActivities, ""));
            }
    } catch (e) {
        java.lang.System.out.println("Expression:: getErclExtractedActivities - Error: " + e);
    }
    
    return extractedActivities;
}