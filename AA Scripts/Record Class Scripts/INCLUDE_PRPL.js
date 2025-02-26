/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_PRPL.js
| Event			: N/A
|
| Usage			: contains all the record's specific script
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: RSA
| Created at	: 30/08/2021 12:09:49
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
function PRPL(capId) {
	SPSABASE.call(this, capId);
};
PRPL.prototype = Object.create(SPSABASE.prototype);
PRPL.prototype.constructor = PRPL;
/*----------------------------------------------------ASI-----------------------------------------------*/
PRPL.RECORD_TYPE = "OSHJ/Projects/Project Profile/PRPL";
PRPL.ASI = {};
PRPL.ASI.projectDetails = {};
PRPL.ASI.projectDetails.TableName = "PROJECT DETAILS";
PRPL.ASI.projectDetails.entityProfileId = "Entity Profile ID";
PRPL.ASI.projectDetails.projectId = "Project ID";
PRPL.ASI.projectDetails.entityNameInEnglish = "Entity Name in English";
PRPL.ASI.projectDetails.entityNameInArabic = "Entity Name in Arabic";
PRPL.ASI.projectDetails.projectType = "Project Type";

PRPL.ASI.buildingInformation = {};
PRPL.ASI.buildingInformation.TableName = "BUILDING INFORMATION";
PRPL.ASI.buildingInformation.buildingId = "Building ID";
PRPL.ASI.buildingInformation.buildingName = "Building Name";
PRPL.ASI.buildingInformation.typeOfBuilding = "Type of Building";
PRPL.ASI.buildingInformation.numberOfFloors = "Number of Floors";
PRPL.ASI.buildingInformation.cityInSharjah = "City in Sharjah";
PRPL.ASI.buildingInformation.areaInSharjah = "Area in Sharjah";
PRPL.ASI.buildingInformation.address = "Address";
PRPL.ASI.buildingInformation.plotNumber = "Plot Number";
PRPL.ASI.buildingInformation.representativeFirstName = "Representative First Name";
PRPL.ASI.buildingInformation.representativeLastName = "Representative Last Name";
PRPL.ASI.buildingInformation.representativeEmiratesId = "Representative Emirates ID";
PRPL.ASI.buildingInformation.representativeContactNumber = "Representative Contact Number";
PRPL.ASI.buildingInformation.representativeEmail = "Representative Email";

PRPL.ASI.projectInformation = {};
PRPL.ASI.projectInformation.TableName = "PROJECT INFORMATION";
PRPL.ASI.projectInformation.projectName = "Project Name";
PRPL.ASI.projectInformation.projectSpecification = "Project Specification";
PRPL.ASI.projectInformation.city = "City";
PRPL.ASI.projectInformation.area = "Area";
PRPL.ASI.projectInformation.address = "Address";
PRPL.ASI.projectInformation.expectedStartDate = "Expected Start Date";
PRPL.ASI.projectInformation.expectedEndDate = "Expected End Date";
PRPL.ASI.projectInformation.subcontractorsExist = "Subcontractors Exist?";

/*----------------------------------------------------ASIT----------------------------------------------*/
PRPL.ASIT = {};
PRPL.ASIT.buildingInformation = {};
PRPL.ASIT.buildingInformation.TableName = "BUILDING INFORMATION";
PRPL.ASIT.buildingInformation.buildingId = "Building ID";
PRPL.ASIT.buildingInformation.buildingName = "Building Name";
PRPL.ASIT.buildingInformation.typeOfBuilding = "Type of Building";
PRPL.ASIT.buildingInformation.numberOfFloors = "Number of Floors";
PRPL.ASIT.buildingInformation.areaInSharjah = "Area in Sharjah";
PRPL.ASIT.buildingInformation.address = "Address";
PRPL.ASIT.buildingInformation.plotNumber = "Plot Number";
PRPL.ASIT.buildingInformation.representativeFirstName = "Representative First Name";
PRPL.ASIT.buildingInformation.representativeLastName = "Representative Last Name";
PRPL.ASIT.buildingInformation.representativeEid = "Representative EID";
PRPL.ASIT.buildingInformation.representativeContactNumber = "Representative Contact Number";
PRPL.ASIT.buildingInformation.representativeEmail = "Representative Email";

PRPL.ASIT.buildingOwnerInformation = {};
PRPL.ASIT.buildingOwnerInformation.TableName = "BUILDING OWNER INFORMATION";
PRPL.ASIT.buildingOwnerInformation.ownerType = "Owner Type";
PRPL.ASIT.buildingOwnerInformation.buildingOwnerFirstName = "Building Owner First Name";
PRPL.ASIT.buildingOwnerInformation.buildingOwnerLastName = "Building Owner Last Name";
PRPL.ASIT.buildingOwnerInformation.ownerEid = "Owner EID";
PRPL.ASIT.buildingOwnerInformation.ownerContactNumber = "Owner Contact Number";
PRPL.ASIT.buildingOwnerInformation.ownerEmail = "Owner Email";
PRPL.ASIT.buildingOwnerInformation.ownerTradeLicenseNumber = "Owner Trade License Number";
PRPL.ASIT.buildingOwnerInformation.managerFirstName = "Manager First Name";
PRPL.ASIT.buildingOwnerInformation.managerLastName = "Manager Last Name";
PRPL.ASIT.buildingOwnerInformation.managerEid = "Manager EID";
PRPL.ASIT.buildingOwnerInformation.managerContactNumber = "Manager Contact Number";
PRPL.ASIT.buildingOwnerInformation.managerEmail = "Manager Email";

PRPL.ASIT.projectOwnerDetails = {};
PRPL.ASIT.projectOwnerDetails.TableName = "PROJECT OWNER DETAILS";
PRPL.ASIT.projectOwnerDetails.firstNameInEnglish = "First Name in English";
PRPL.ASIT.projectOwnerDetails.firstNameInArabic = "First Name in Arabic";
PRPL.ASIT.projectOwnerDetails.lastNameInEnglish = "Last Name in English";
PRPL.ASIT.projectOwnerDetails.lastNameInArabic = "Last Name in Arabic";
PRPL.ASIT.projectOwnerDetails.ownerIndividualOrCompany = "Owner Individual or Company";
PRPL.ASIT.projectOwnerDetails.ownerEmiratesId = "Owner Emirates ID";
PRPL.ASIT.projectOwnerDetails.mobile = "Mobile";
PRPL.ASIT.projectOwnerDetails.email = "Email";
PRPL.ASIT.projectOwnerDetails.tradeLicenseNumber = "Trade License Number";
PRPL.ASIT.projectOwnerDetails.companyManagerName = "Company Manager Name";
PRPL.ASIT.projectOwnerDetails.companyManagerContactNumber = "Company Manager Contact Number";
PRPL.ASIT.projectOwnerDetails.companyManagerEmail = "Company Manager Email";

PRPL.ASIT.subcontractorsDetails = {};
PRPL.ASIT.subcontractorsDetails.TableName = "SUBCONTRACTORS DETAILS";
PRPL.ASIT.subcontractorsDetails.tradeLicenseNumber = "Trade License Number";
PRPL.ASIT.subcontractorsDetails.companyNameEnglish = "Company Name English";
PRPL.ASIT.subcontractorsDetails.companyNameArabic = "Company Name Arabic";
PRPL.ASIT.subcontractorsDetails.companyEmail = "Company Email";
PRPL.ASIT.subcontractorsDetails.companyPhoneNumber = "Company Phone Number";
PRPL.ASIT.subcontractorsDetails.scopeOfWork = "Scope of work";

PRPL.ASIT.managerDetails = {};
PRPL.ASIT.managerDetails.TableName = "MANAGER DETAILS";
PRPL.ASIT.managerDetails.firstName = "First Name";
PRPL.ASIT.managerDetails.lastName = "Last Name";
PRPL.ASIT.managerDetails.emiratesId = "Emirates ID";
PRPL.ASIT.managerDetails.mobileNumber = "Mobile Number";
PRPL.ASIT.managerDetails.email = "Email";

PRPL.ASIT.periodicReportingHistory = {};
PRPL.ASIT.periodicReportingHistory.TableName = "PERIODIC REPORTING HISTORY";
PRPL.ASIT.periodicReportingHistory.recordId = "Record ID";
PRPL.ASIT.periodicReportingHistory.createdDate = "Created Date";
PRPL.ASIT.periodicReportingHistory.reportingPeriod = "Reporting Period";
PRPL.ASIT.periodicReportingHistory.entityClassification = "Entity Classification";

/*-------------------------------------------SPECIFIC CODE----------------------------------------------*/
PRPL.createProjectProfile = function(projectId) {
	var projectProfileCapId = "";
	var projectProfile = null;
	
	var res = {};
	try {
		res.success = false;
		projectProfileCapId = Record.createNew(PRPL.RECORD_TYPE);
		projectProfile = new PRPL(projectProfileCapId);

		eval(getScriptText("INCLUDE_PARP"));
		var project = new PARP(projectId);

		var munProjectId = project.getASI(PARP.ASI.projectDetails.TableName,
				PARP.ASI.projectDetails.projectId);
		var projectName = project.getASI(PARP.ASI.projectInformation.TableName,
				PARP.ASI.projectInformation.projectName);
		var entityProfileId = project.getASI(
				PARP.ASI.projectDetails.TableName,
				PARP.ASI.projectDetails.entityProfileId);
		var entityNameInEnglish = project.getASI(
				PARP.ASI.projectDetails.TableName,
				PARP.ASI.projectDetails.entityNameInEnglish);
		var entityNameInArabic = project.getASI(
				PARP.ASI.projectDetails.TableName,
				PARP.ASI.projectDetails.entityNameInArabic);
		var projectType = project.getASI(PARP.ASI.projectDetails.TableName,
				PARP.ASI.projectDetails.projectType);
		var projectSpecification = project.getASI(
				PARP.ASI.projectInformation.TableName,
				PARP.ASI.projectInformation.projectSpecification);
		var city = project.getASI(PARP.ASI.projectInformation.TableName,
				PARP.ASI.projectInformation.city);
		var area = project.getASI(PARP.ASI.projectInformation.TableName,
				PARP.ASI.projectInformation.area);
		var address = project.getASI(PARP.ASI.projectInformation.TableName,
				PARP.ASI.projectInformation.address);
		var expectedStartDate = project.getASI(
				PARP.ASI.projectInformation.TableName,
				PARP.ASI.projectInformation.expectedStartDate);
		var expectedEndDate = project.getASI(
				PARP.ASI.projectInformation.TableName,
				PARP.ASI.projectInformation.expectedEndDate);
		var subcontractorsExist = project.getASI(
				PARP.ASI.projectInformation.TableName,
				PARP.ASI.projectInformation.subcontractorsExist);
		
		var buildingId = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.buildingId);
		var buildingName = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.buildingName);
		var typeOfBuilding = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.typeOfBuilding);
		var numberOfFloors = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.numberOfFloors);
		var cityInSharjah = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.city);
		var areaInSharjah = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.area);
		var address = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.address);
		var plotNumber = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.plotNumber);
		var representativeFirstName = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.representativeFirstName);
		var representativeLastName = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.representativeLastName);
		var representativeEmiratesId = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.representativeEmiratesId);
		var representativeContactNumber = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.representativeContactNumber);
		var representativeEmail = project.getASI(
				PARP.ASI.buildingInformation.TableName,
				PARP.ASI.buildingInformation.representativeEmail);

		projectProfile.editASI(PRPL.ASI.projectDetails.TableName,
				PRPL.ASI.projectDetails.projectId, munProjectId);
		projectProfile.editASI(PRPL.ASI.projectInformation.TableName,
				PRPL.ASI.projectInformation.projectName, projectName);
		projectProfile.editASI(PRPL.ASI.projectDetails.TableName,
				PRPL.ASI.projectDetails.entityProfileId, entityProfileId);
		projectProfile.editASI(PRPL.ASI.projectDetails.TableName,
				PRPL.ASI.projectDetails.entityNameInEnglish,
				entityNameInEnglish);
		projectProfile.editASI(PRPL.ASI.projectDetails.TableName,
				PRPL.ASI.projectDetails.entityNameInArabic,
				entityNameInArabic);
		projectProfile.editASI(PRPL.ASI.projectDetails.TableName,
				PRPL.ASI.projectDetails.projectType, projectType);
		projectProfile.editASI(PRPL.ASI.projectInformation.TableName,
				PRPL.ASI.projectInformation.projectSpecification,
				projectSpecification);
		projectProfile.editASI(PRPL.ASI.projectInformation.TableName,
				PRPL.ASI.projectInformation.city, city);
		projectProfile.editASI(PRPL.ASI.projectInformation.TableName,
				PRPL.ASI.projectInformation.area, area);
		projectProfile.editASI(PRPL.ASI.projectInformation.TableName,
				PRPL.ASI.projectInformation.address, address);
		projectProfile.editASI(PRPL.ASI.projectInformation.TableName,
				PRPL.ASI.projectInformation.expectedStartDate,
				expectedStartDate);
		projectProfile.editASI(PRPL.ASI.projectInformation.TableName,
				PRPL.ASI.projectInformation.expectedEndDate, expectedEndDate);
		projectProfile.editASI(PRPL.ASI.projectInformation.TableName,
				PRPL.ASI.projectInformation.subcontractorsExist,
				subcontractorsExist);
		

		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.buildingId, buildingId);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.buildingName, buildingName);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.typeOfBuilding, typeOfBuilding);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.numberOfFloors, numberOfFloors);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.cityInSharjah, cityInSharjah);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.areaInSharjah, areaInSharjah);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.address, address);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.plotNumber, plotNumber);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.representativeFirstName, representativeFirstName);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.representativeLastName, representativeLastName);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.representativeEmiratesId, representativeEmiratesId);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.representativeContactNumber, representativeContactNumber);
		projectProfile.editASI(PRPL.ASI.buildingInformation.TableName,
				PRPL.ASI.buildingInformation.representativeEmail, representativeEmail);

		
		aa.print("before")

//		projectProfile.copyAsitFromOtherRecord(project,
//				PRPL.ASIT.buildingInformation.TableName);
		projectProfile.copyAsitFromOtherRecord(project,
				PRPL.ASIT.buildingOwnerInformation.TableName);
		projectProfile.copyAsitFromOtherRecord(project,
				PRPL.ASIT.projectOwnerDetails.TableName);
		projectProfile.copyAsitFromOtherRecord(project,
				PRPL.ASIT.subcontractorsDetails.TableName);
		projectProfile.copyAsitFromOtherRecord(project,
				PRPL.ASIT.managerDetails.TableName);

		
		projectProfile.copyContacts(project);

		projectProfile.copyDocuments(projectProfile.getCapID(),
				projectProfileCapId);
		projectProfile.completeWorkflow();

		projectProfile.copyAddress(projectId);
		
		projectProfile.addParent(entityProfileId);
		project.addParent(projectProfile.getCustomID());
		aa.print("after")

//		eval(getScriptText("INCLUDE_EPRF"));
//		var entityProfile = new EPRF(entityProfileId);
//		aa.print(entityProfileId)
//		entityProfile.removeChild(projectId)
//		aa.print(project.getCapID())

		res.projectProfileCapId = projectProfileCapId;
		res.projectProfile = projectProfile;
		res.success = true;
	} catch (e) {
		res.success = false;
		java.lang.System.out.println("PRPL Log " + e);
	}
	return res;
}


PRPL.prototype.copyDocuments = function(fromCapID, toCapID) {
    var capDocResult = aa.document.getDocumentListByEntity(fromCapID, "CAP");
    if (capDocResult.getSuccess()) {
        var capDocResultOutput = capDocResult.getOutput();
        if (capDocResultOutput.size() > 0) {
            for (index = 0; index < capDocResultOutput.size(); index++) {
                var documentModel = capDocResultOutput.get(index);
                var res = aa.document.createDocumentAssociation(documentModel, toCapID, "CAP");
            }
        }
    }
}

PRPL.prototype.getProjectActivitiesReports = function() {
	var projectType = this.getASI(PRPL.ASI.projectDetails.TableName,PRPL.ASI.projectDetails.projectType)
	
	var expectedEndDate = this.getASI(PRPL.ASI.projectInformation.TableName, PRPL.ASI.projectInformation.expectedEndDate, "");
	expectedEndDate = new Date(expectedEndDate);
	
	var today = new Date();
	
	var projectActivitiesNotAllowed = expectedEndDate.isBefore(today);
	if(!projectActivitiesNotAllowed){
		return SPSAGS.getProjectActivitiesReports(projectType);
	} else {
		return ['OSHJ/Projects/Project Completion/BUPC'];
	}
	
}
PRPL.prototype.getProjectActivitiesReportsForAlerts = function() {
	var projectType = this.getASI(PRPL.ASI.projectDetails.TableName,PRPL.ASI.projectDetails.projectType)
	
	var expectedEndDate = this.getASI(PRPL.ASI.projectInformation.TableName, PRPL.ASI.projectInformation.expectedEndDate, "");
	expectedEndDate = new Date(expectedEndDate);
	
	var today = new Date();
	
	var projectActivitiesNotAllowed = expectedEndDate.isBefore(today);
	if(!projectActivitiesNotAllowed){
		return SPSAGS.getProjectActivitiesReports(projectType, true);
	} else {
		return ['OSHJ/Projects/Project Completion/BUPC'];
	}
	
}
PRPL.prototype.showPeriodicReporting = function() {
    var expectedEndDate = this.getASI(PRPL.ASI.projectInformation.TableName, PRPL.ASI.projectInformation.expectedEndDate, "");
    if (expectedEndDate) {
        expectedEndDate = new Date(expectedEndDate);
        var today = new Date();
        var projectIsDue = expectedEndDate.isBefore(today);

        if (!projectIsDue) {
            var cap = this.getCapModel();
            var projectAlertDetails = cap.getQUD1();

            if (projectAlertDetails && projectAlertDetails.indexOf('PPR:1') > -1) {
                //return ["OSHJ/Reporting/Periodic Reporting/PRPR"];
                return this.getProjectActivitiesReports();
            }
        } else {
            return [];
        }
    }
}