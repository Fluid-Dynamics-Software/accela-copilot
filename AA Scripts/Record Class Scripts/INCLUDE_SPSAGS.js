/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_SPSAGS.js
| Event			: N/A
|
| Usage			: contains all the record's specific script
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: RSA
| Created at	: 10/08/2021 16:37:18
|
/------------------------------------------------------------------------------------------------------*/
if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}
if (typeof Utils === "undefined") {
	eval(getScriptText("INCLUDE_UTILS"));
}
function SPSAGS(capId) {
	Record.call(this, capId);
};

eval(getScriptText('INCLUDE_SPSABASE'));
eval(getScriptText('INCLUDE_DAO'));
eval(getScriptText('INCLUDE_GLOBALNOTIFICATIONS'));

SPSAGS.prototype = Object.create(Record.prototype);
SPSAGS.prototype.constructor = SPSAGS;

SPSAGS.General_Settings_Record_Id = "SPSA Global Settings";
/*----------------------------------------------------ASI-----------------------------------------------*/
SPSAGS.RECORD_TYPE = "OSHJ/Settings/General Settings/SPSAGS";
SPSAGS.ASI = {};
SPSAGS.ASI.effectiveDateConfiguration = {};
SPSAGS.ASI.effectiveDateConfiguration.TableName = "EFFECTIVE DATE CONFIGURATION";
SPSAGS.ASI.effectiveDateConfiguration.effectiveDate = "Effective Date";
SPSAGS.ASI.effectiveDateConfiguration.enable = "Enable?";

SPSAGS.ASI.inspectionConfiguration = {};
SPSAGS.ASI.inspectionConfiguration.TableName = "INSPECTION CONFIGURATION";
SPSAGS.ASI.inspectionConfiguration.startTime = "Start Time";
SPSAGS.ASI.inspectionConfiguration.endTime = "End Time";
SPSAGS.ASI.inspectionConfiguration.taskDuration = "Task Duration";
SPSAGS.ASI.inspectionConfiguration.resumeAllowedPeriod = "Resume Allowed Period";

SPSAGS.ASI.registrationFeesSettings = {};
SPSAGS.ASI.registrationFeesSettings.TableName = "REGISTRATION FEES SETTINGS";
SPSAGS.ASI.registrationFeesSettings.effectiveDate = "Effective Date";
SPSAGS.ASI.registrationFeesSettings.enable = "Enable?";
SPSAGS.ASI.registrationFeesSettings.unit = "Unit";

SPSAGS.ASI.renewalFees = {};
SPSAGS.ASI.renewalFees.TableName = "RENEWAL FEES";
SPSAGS.ASI.renewalFees.effectiveDate = "Effective Date";
SPSAGS.ASI.renewalFees.enable = "Enable?";
SPSAGS.ASI.renewalFees.unit = "Unit";

SPSAGS.ASI.selfDeclarationFees = {};
SPSAGS.ASI.selfDeclarationFees.TableName = "SELF-DECLARATION FEES";
SPSAGS.ASI.selfDeclarationFees.effectiveDate = "Effective Date";
SPSAGS.ASI.selfDeclarationFees.enable = "Enable?";
SPSAGS.ASI.selfDeclarationFees.unit = "Unit";

SPSAGS.ASI.renewalAffectiveDate = {};
SPSAGS.ASI.renewalAffectiveDate.TableName = "RENEWAL AFFECTIVE DATE";
SPSAGS.ASI.renewalAffectiveDate.effectiveDate = "Effective Date";
SPSAGS.ASI.renewalAffectiveDate.enable = "Enable?";

SPSAGS.ASI.updateProfileFees = {};
SPSAGS.ASI.updateProfileFees.TableName = "UPDATE PROFILE FEES";
SPSAGS.ASI.updateProfileFees.applyDifferentFeesOnLevelIncrease = "Apply different fees on level increase";

SPSAGS.ASI.futureRequirements = {};
SPSAGS.ASI.futureRequirements.TableName = "FUTURE REQUIREMENTS";
SPSAGS.ASI.futureRequirements.unit = "Unit";

SPSAGS.ASI.selfDeclarationSubmission = {};
SPSAGS.ASI.selfDeclarationSubmission.TableName = "SELF-DECLARATION SUBMISSION";
SPSAGS.ASI.selfDeclarationSubmission.unit = "Unit";

SPSAGS.ASI.renewalConfiguration = {};
SPSAGS.ASI.renewalConfiguration.TableName = "RENEWAL CONFIGURATION";
SPSAGS.ASI.renewalConfiguration.unit = "Unit";

SPSAGS.ASI.incidentConfiguration = {};
SPSAGS.ASI.incidentConfiguration.TableName = "INCIDENT CONFIGURATION";
SPSAGS.ASI.incidentConfiguration.unit = "Unit";

SPSAGS.ASI.incidentsFrequencyRates = {};
SPSAGS.ASI.incidentsFrequencyRates.TableName = "INCIDENTS FREQUENCY RATES";
SPSAGS.ASI.incidentsFrequencyRates.fatalityFrequencyRate = "Fatality Frequency Rate";
SPSAGS.ASI.incidentsFrequencyRates.lostTimeIncidentsFrequencyRate = "Lost Time Incidents Frequency Rate";
SPSAGS.ASI.incidentsFrequencyRates.reportableIncidentsFrequencyRate = "Reportable Incidents Frequency Rate";

/*----------------------------------------------------ASIT----------------------------------------------*/
SPSAGS.ASIT = {};
SPSAGS.ASIT.incidentSubmissionSettings = {};
SPSAGS.ASIT.incidentSubmissionSettings.TableName = "INCIDENT SUBMISSION SETTINGS";
SPSAGS.ASIT.incidentSubmissionSettings.incidentType = "Incident Type";
SPSAGS.ASIT.incidentSubmissionSettings.submissionTime = "Submission Time";
SPSAGS.ASIT.incidentSubmissionSettings.active = "Active";

SPSAGS.ASIT.investigationSubmission = {};
SPSAGS.ASIT.investigationSubmission.TableName = "INVESTIGATION SUBMISSION";
SPSAGS.ASIT.investigationSubmission.incidentType = "Incident Type";
SPSAGS.ASIT.investigationSubmission.unit = "Unit";
SPSAGS.ASIT.investigationSubmission.submissionTime = "Submission Time";
SPSAGS.ASIT.investigationSubmission.active = "Active";

SPSAGS.ASIT.periodicNotification = {};
SPSAGS.ASIT.periodicNotification.TableName = "PERIODIC NOTIFICATION";
SPSAGS.ASIT.periodicNotification.period = "Period";
SPSAGS.ASIT.periodicNotification.unit = "Unit";
SPSAGS.ASIT.periodicNotification.time = "Time";
SPSAGS.ASIT.periodicNotification.active = "Active";

SPSAGS.ASIT.periodicReportingSubmission = {};
SPSAGS.ASIT.periodicReportingSubmission.TableName = "PERIODIC REPORTING SUBMISSION";
SPSAGS.ASIT.periodicReportingSubmission.level = "Level";
SPSAGS.ASIT.periodicReportingSubmission.submissionPeriod = "Submission Period";
SPSAGS.ASIT.periodicReportingSubmission.active = "Active";

SPSAGS.ASIT.selfDeclarationSubmission = {};
SPSAGS.ASIT.selfDeclarationSubmission.TableName = "SELF-DECLARATION SUBMISSION";
SPSAGS.ASIT.selfDeclarationSubmission.activity = "Activity";
SPSAGS.ASIT.selfDeclarationSubmission.level1 = "Level 1";
SPSAGS.ASIT.selfDeclarationSubmission.level2 = "Level 2";
SPSAGS.ASIT.selfDeclarationSubmission.level3 = "Level 3";
SPSAGS.ASIT.selfDeclarationSubmission.level4 = "Level 4";
SPSAGS.ASIT.selfDeclarationSubmission.level5 = "Level 5";
SPSAGS.ASIT.selfDeclarationSubmission.active = "Active";

SPSAGS.ASIT.initialRequirements = {};
SPSAGS.ASIT.initialRequirements.TableName = "INITIAL REQUIREMENTS";
SPSAGS.ASIT.initialRequirements.no = "No";
SPSAGS.ASIT.initialRequirements.initialRequirement = "Initial Requirement";
SPSAGS.ASIT.initialRequirements.initialRequirementAr = "Initial Requirement AR";
SPSAGS.ASIT.initialRequirements.active = "Active";

SPSAGS.ASIT.level1 = {};
SPSAGS.ASIT.level1.TableName = "LEVEL 1";
SPSAGS.ASIT.level1.no = "No";
SPSAGS.ASIT.level1.requirement = "Requirement";
SPSAGS.ASIT.level1.requirementAr = "Requirement AR";
SPSAGS.ASIT.level1.active = "Active";

SPSAGS.ASIT.level2 = {};
SPSAGS.ASIT.level2.TableName = "LEVEL 2";
SPSAGS.ASIT.level2.no = "No";
SPSAGS.ASIT.level2.requirement = "Requirement";
SPSAGS.ASIT.level2.requirementAr = "Requirement AR";
SPSAGS.ASIT.level2.active = "Active";

SPSAGS.ASIT.level3 = {};
SPSAGS.ASIT.level3.TableName = "LEVEL 3";
SPSAGS.ASIT.level3.no = "No";
SPSAGS.ASIT.level3.requirement = "Requirement";
SPSAGS.ASIT.level3.requirementAr = "Requirement AR";
SPSAGS.ASIT.level3.active = "Active";

SPSAGS.ASIT.level4 = {};
SPSAGS.ASIT.level4.TableName = "LEVEL 4";
SPSAGS.ASIT.level4.no = "No";
SPSAGS.ASIT.level4.requirement = "Requirement";
SPSAGS.ASIT.level4.requirementAr = "Requirement AR";
SPSAGS.ASIT.level4.active = "Active";

SPSAGS.ASIT.level5 = {};
SPSAGS.ASIT.level5.TableName = "LEVEL 5";
SPSAGS.ASIT.level5.no = "No";
SPSAGS.ASIT.level5.requirement = "Requirement";
SPSAGS.ASIT.level5.requirementAr = "Requirement AR";
SPSAGS.ASIT.level5.active = "Active";

SPSAGS.ASIT.servicesActivitiesPrivileges = {};
SPSAGS.ASIT.servicesActivitiesPrivileges.TableName = "SERVICES ACTIVITIES PRIVILEGES";
SPSAGS.ASIT.servicesActivitiesPrivileges.serviceName = "Service Name";
SPSAGS.ASIT.servicesActivitiesPrivileges.activity = "Activity";
SPSAGS.ASIT.servicesActivitiesPrivileges.active = "Active";

SPSAGS.ASIT.registrationFeesConfig = {};
SPSAGS.ASIT.registrationFeesConfig.TableName = "REGISTRATION FEES CONFIG";
SPSAGS.ASIT.registrationFeesConfig.classification = "Classification";
SPSAGS.ASIT.registrationFeesConfig.level1 = "Level 1";
SPSAGS.ASIT.registrationFeesConfig.level2 = "Level 2";
SPSAGS.ASIT.registrationFeesConfig.level3 = "Level 3";
SPSAGS.ASIT.registrationFeesConfig.level4 = "Level 4";
SPSAGS.ASIT.registrationFeesConfig.level5 = "Level 5";
SPSAGS.ASIT.registrationFeesConfig.active = "Active";

SPSAGS.ASIT.renewalConfiguration = {};
SPSAGS.ASIT.renewalConfiguration.TableName = "RENEWAL CONFIGURATION";
SPSAGS.ASIT.renewalConfiguration.activity = "Activity";
SPSAGS.ASIT.renewalConfiguration.level1 = "Level 1";
SPSAGS.ASIT.renewalConfiguration.level2 = "Level 2";
SPSAGS.ASIT.renewalConfiguration.level3 = "Level 3";
SPSAGS.ASIT.renewalConfiguration.level4 = "Level 4";
SPSAGS.ASIT.renewalConfiguration.level5 = "Level 5";
SPSAGS.ASIT.renewalConfiguration.active = "Active";

SPSAGS.ASIT.appealSettings = {};
SPSAGS.ASIT.appealSettings.TableName = "APPEAL SETTINGS";
SPSAGS.ASIT.appealSettings.serviceName = "Service Name";
SPSAGS.ASIT.appealSettings.timeInDays = "Time in Days";

SPSAGS.ASIT.projectActivitiesPrivileges = {};
SPSAGS.ASIT.projectActivitiesPrivileges.TableName = "PROJECT ACTIVITIES PRIVILEGES";
SPSAGS.ASIT.projectActivitiesPrivileges.activity = "Activity";
SPSAGS.ASIT.projectActivitiesPrivileges.active = "Active";
SPSAGS.ASIT.projectActivitiesPrivileges.runFromInspectionProgram = "Run From Inspection Program";
SPSAGS.ASIT.projectActivitiesPrivileges.incidentReport = "Incident Report";
SPSAGS.ASIT.projectActivitiesPrivileges.investigationReport = "Investigation Report";
SPSAGS.ASIT.projectActivitiesPrivileges.periodicReport = "Periodic Report";
SPSAGS.ASIT.projectActivitiesPrivileges.unsafeActReport = "Unsafe Act Report";

SPSAGS.ASIT.selfDeclarationNotification = {};
SPSAGS.ASIT.selfDeclarationNotification.TableName = "SELF-DECLARATION NOTIFICATION";
SPSAGS.ASIT.selfDeclarationNotification.activity = "Activity";
SPSAGS.ASIT.selfDeclarationNotification.level1 = "Level 1";
SPSAGS.ASIT.selfDeclarationNotification.level2 = "Level 2";
SPSAGS.ASIT.selfDeclarationNotification.level3 = "Level 3";
SPSAGS.ASIT.selfDeclarationNotification.level4 = "Level 4";
SPSAGS.ASIT.selfDeclarationNotification.level5 = "Level 5";

SPSAGS.ASIT.futureRequirementsTime = {};
SPSAGS.ASIT.futureRequirementsTime.TableName = "FUTURE REQUIREMENTS TIME";
SPSAGS.ASIT.futureRequirementsTime.activity = "Activity";
SPSAGS.ASIT.futureRequirementsTime.level1 = "Level 1";
SPSAGS.ASIT.futureRequirementsTime.level2 = "Level 2";
SPSAGS.ASIT.futureRequirementsTime.level3 = "Level 3";
SPSAGS.ASIT.futureRequirementsTime.level4 = "Level 4";
SPSAGS.ASIT.futureRequirementsTime.level5 = "Level 5";
SPSAGS.ASIT.futureRequirementsTime.active = "Active";

SPSAGS.ASIT.projectPeriodicSubmission = {};
SPSAGS.ASIT.projectPeriodicSubmission.TableName = "PROJECT PERIODIC SUBMISSION";
SPSAGS.ASIT.projectPeriodicSubmission.level = "Level";
SPSAGS.ASIT.projectPeriodicSubmission.submissionPeriod = "Submission Period";
SPSAGS.ASIT.projectPeriodicSubmission.active = "Active";

SPSAGS.ASIT.renewalFees = {};
SPSAGS.ASIT.renewalFees.TableName = "RENEWAL FEES";
SPSAGS.ASIT.renewalFees.activity = "Activity";
SPSAGS.ASIT.renewalFees.level1 = "Level 1";
SPSAGS.ASIT.renewalFees.level2 = "Level 2";
SPSAGS.ASIT.renewalFees.level3 = "Level 3";
SPSAGS.ASIT.renewalFees.level4 = "Level 4";
SPSAGS.ASIT.renewalFees.level5 = "Level 5";
SPSAGS.ASIT.renewalFees.active = "Active";

SPSAGS.ASIT.selfDeclarationFees = {};
SPSAGS.ASIT.selfDeclarationFees.TableName = "SELF-DECLARATION FEES";
SPSAGS.ASIT.selfDeclarationFees.activity = "Activity";
SPSAGS.ASIT.selfDeclarationFees.level1 = "Level 1";
SPSAGS.ASIT.selfDeclarationFees.level2 = "Level 2";
SPSAGS.ASIT.selfDeclarationFees.level3 = "Level 3";
SPSAGS.ASIT.selfDeclarationFees.level4 = "Level 4";
SPSAGS.ASIT.selfDeclarationFees.level5 = "Level 5";
SPSAGS.ASIT.selfDeclarationFees.active = "Active";

SPSAGS.ASIT.actingAsDepartmentAccess = {};
SPSAGS.ASIT.actingAsDepartmentAccess.TableName = "ACTING AS DEPARTMENT ACCESS";
SPSAGS.ASIT.actingAsDepartmentAccess.userDepartment = "User Department";
SPSAGS.ASIT.actingAsDepartmentAccess.user = "User";
SPSAGS.ASIT.actingAsDepartmentAccess.targetDepartment = "Target Department";
SPSAGS.ASIT.actingAsDepartmentAccess.targetUser = "Target User";

SPSAGS.ASIT.dashboardAccess = {};
SPSAGS.ASIT.dashboardAccess.TableName = "DASHBOARD ACCESS";
SPSAGS.ASIT.dashboardAccess.department = "Department";
SPSAGS.ASIT.dashboardAccess.dashboard = "Dashboard";

SPSAGS.ASIT.generalInspectCheckItems = {};
SPSAGS.ASIT.generalInspectCheckItems.TableName = "GENERAL INSPECT CHECK ITEMS";
SPSAGS.ASIT.generalInspectCheckItems.checklistCode = "Checklist Code";
SPSAGS.ASIT.generalInspectCheckItems.serialNumber = "Serial Number";
SPSAGS.ASIT.generalInspectCheckItems.checklistItemEnglish = "Checklist Item English";
SPSAGS.ASIT.generalInspectCheckItems.checklistItemArabic = "Checklist Item Arabic";
SPSAGS.ASIT.generalInspectCheckItems.statusGroup = "Status Group";
SPSAGS.ASIT.generalInspectCheckItems.violationCode = "Violation Code";
SPSAGS.ASIT.generalInspectCheckItems.closeOutTimingInDays = "Close-out Timing in Days";
SPSAGS.ASIT.generalInspectCheckItems.systemRequirmentCode = "System Requirment Code";
SPSAGS.ASIT.generalInspectCheckItems.itineraryOfAwareness = "Itinerary of Awareness";
SPSAGS.ASIT.generalInspectCheckItems.itineraryOfWarnings = "Itinerary of Warnings";

SPSAGS.ASIT.predefInspChecklistItems = {};
SPSAGS.ASIT.predefInspChecklistItems.TableName = "PREDEF INSP CHECKLIST ITEMS";
SPSAGS.ASIT.predefInspChecklistItems.checklistCode = "Checklist Code";
SPSAGS.ASIT.predefInspChecklistItems.serialNumber = "Serial Number";
SPSAGS.ASIT.predefInspChecklistItems.checklistItemEnglish = "Checklist Item English";
SPSAGS.ASIT.predefInspChecklistItems.checklistItemArabic = "Checklist Item Arabic";
SPSAGS.ASIT.predefInspChecklistItems.statusGroup = "Status Group";
SPSAGS.ASIT.predefInspChecklistItems.violationCode = "Violation Code";
SPSAGS.ASIT.predefInspChecklistItems.closeOutTimingInDays = "Close-out Timing in Days";
SPSAGS.ASIT.predefInspChecklistItems.systemRequirementCode = "System Requirement Code";
SPSAGS.ASIT.predefInspChecklistItems.active = "Active";

SPSAGS.ASIT.predefInspectionChecklists = {};
SPSAGS.ASIT.predefInspectionChecklists.TableName = "PREDEF INSPECTION CHECKLISTS";
SPSAGS.ASIT.predefInspectionChecklists.checklistCode = "Checklist Code";
SPSAGS.ASIT.predefInspectionChecklists.checklistNameEnglish = "Checklist Name English";
SPSAGS.ASIT.predefInspectionChecklists.checklistNameArabic = "Checklist Name Arabic";
SPSAGS.ASIT.predefInspectionChecklists.active = "Active";

SPSAGS.ASIT.systemRequirements = {};
SPSAGS.ASIT.systemRequirements.TableName = "SYSTEM REQUIREMENTS";
SPSAGS.ASIT.systemRequirements.docId = "Doc ID";
SPSAGS.ASIT.systemRequirements.docName = "Doc Name";
SPSAGS.ASIT.systemRequirements.section = "Section";
SPSAGS.ASIT.systemRequirements.descriptionInEnglish = "Description in English";
SPSAGS.ASIT.systemRequirements.descriptionInArabic = "Description in Arabic";

SPSAGS.ASIT.initialPeriodicSubmission = {};
SPSAGS.ASIT.initialPeriodicSubmission.TableName = "INITIAL PERIODIC SUBMISSION";
SPSAGS.ASIT.initialPeriodicSubmission.level = "Level";
SPSAGS.ASIT.initialPeriodicSubmission.submissionPeriod = "Submission Period";
SPSAGS.ASIT.initialPeriodicSubmission.active = "Active";

SPSAGS.ASIT.excludedFieldsForProjects = {};
SPSAGS.ASIT.excludedFieldsForProjects.TableName = "EXCLUDED FIELDS FOR PROJECTS";
SPSAGS.ASIT.excludedFieldsForProjects.activity = "Activity";
SPSAGS.ASIT.excludedFieldsForProjects.field = "Field";
SPSAGS.ASIT.excludedFieldsForProjects.table = "Table";
SPSAGS.ASIT.excludedFieldsForProjects.page = "Page";

SPSAGS.ASIT.notificationConfiguration = {};
SPSAGS.ASIT.notificationConfiguration.TableName = "NOTIFICATION CONFIGURATION";
SPSAGS.ASIT.notificationConfiguration.unit = "Unit";
SPSAGS.ASIT.notificationConfiguration.value = "Value";
SPSAGS.ASIT.notificationConfiguration.active = "Active";

/*-------------------------------------------SPECIFIC CODE----------------------------------------------*/
SPSAGS.getInstance = function() {
	return new SPSAGS("SPSA Global Settings");
}
SPSAGS.getOSHMinimumRequirements = function(entityLevel) {
	var retVal = [];

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(entityLevel.toUpperCase());

		for ( var x in dataSet) {
			var activeValue = dataSet[x]["Active"];
			if (activeValue == "CHECKED") {
				retVal.push(dataSet[x]);
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.getIncidentPeriodInHours = function(incidentType) {
	var retVal = -1;

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.incidentSubmissionSettings.TableName);

		for ( var x in dataSet) {
			var activeValue = dataSet[x][SPSAGS.ASIT.incidentSubmissionSettings.active];
			var incidentTypeValue = dataSet[x][SPSAGS.ASIT.incidentSubmissionSettings.incidentType];
			if (activeValue == "CHECKED" && incidentType.toLowerCase() == incidentTypeValue.toLowerCase()) {
				retVal = Number(dataSet[x][SPSAGS.ASIT.incidentSubmissionSettings.submissionTime]);
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.isLateIncidentSubmission = function(incidentDate, incidentTime, submissionDate, incidentType) {
	var retVal = false;
	var timeToSubmit = SPSAGS.getInsidentPeriodInHours(incidentType);
	if (timeToSubmit > 0) {
		var time = submissionDate.getHours() + ":" + submissionDate.getMinutes();

		incidentDate = new Date(incidentDate)

		var diffTime = Utils.getTimeDifferencesInHours(incidentDate, new Date(submissionDate), incidentTime, time)

		if (Number(diffTime) > Number(timeToSubmit)) {
			retVal = true;
		}
	}
	return retVal;
}

SPSAGS.getInsidentInvestigationPeriodInHours = function(incidentType) {
	var retVal = -1;

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.investigationSubmission.TableName);

		for ( var x in dataSet) {
			var activeValue = dataSet[x][SPSAGS.ASIT.investigationSubmission.active];
			var incidentTypeValue = dataSet[x][SPSAGS.ASIT.investigationSubmission.incidentType];
			if (activeValue == "CHECKED" && incidentType.toLowerCase() == incidentTypeValue.toLowerCase()) {
				var unit = dataSet[x][SPSAGS.ASIT.investigationSubmission.unit];
				var time = dataSet[x][SPSAGS.ASIT.investigationSubmission.submissionTime];
				if (unit == "Day") {
					retVal = Number(time) * 24;
				} else {
					retVal = Number(time)
				}

			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.getInsidentInvestigationPeriodHoursAndUnit = function(incidentType) {
	var retVal = -1;
	var hoursAndUnit = "";

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.investigationSubmission.TableName);

		for ( var x in dataSet) {
			var activeValue = dataSet[x][SPSAGS.ASIT.investigationSubmission.active];
			var incidentTypeValue = dataSet[x][SPSAGS.ASIT.investigationSubmission.incidentType];
			if (activeValue == "CHECKED" && incidentType.toLowerCase() == incidentTypeValue.toLowerCase()) {
				var unit = dataSet[x][SPSAGS.ASIT.investigationSubmission.unit];
				var time = dataSet[x][SPSAGS.ASIT.investigationSubmission.submissionTime];
				// if (unit == "Day") {
				// retVal = Number(time) * 24;
				//
				// var unitKey = "";
				// if (unit == "Day") {
				// unitKey = "DAY";
				// }
				// if (unit == "Hour") {
				// unitKey = "HOUR";
				// }
				// if (unit == "Month") {
				// unitKey = "MONTH";
				// }
				//
				// hoursAndUnit = retVal + "/"
				// + aa.messageResources.getLocalMessage(unit);
				// } else {
				retVal = Number(time)
				hoursAndUnit = retVal + " " + aa.messageResources.getLocalMessage(unit);
				// }
			}
		}
	} catch (e) {

	}

	return hoursAndUnit;
}

SPSAGS.getDueDate = function(unit, time) {
	var today = new Date();
	var dueDate = new Date();

	if (unit == "Hour") {
		dueDate = today;
	} else if (unit == "Day") {
		dueDate.setDate(today.getDate() + Number(time));
	} else if (unit == "Week") {
		dueDate.setDate(today.getDate() + (7 * Number(time)));
	} else if (unit == "Month") {
		dueDate = new Date(today.setMonth(today.getMonth() + Number(time)));
	}

	var retVal = Utils.formatDate(dueDate, "MM/dd/yyyy")

	return retVal;
}

SPSAGS.getInsidentInvestigationDueDateByIncidentType = function(incidentType) {
	var retVal = null;

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.investigationSubmission.TableName);

		for ( var x in dataSet) {
			var activeValue = dataSet[x][SPSAGS.ASIT.investigationSubmission.active];
			var incidentTypeValue = dataSet[x][SPSAGS.ASIT.investigationSubmission.incidentType];
			if (activeValue == "CHECKED" && incidentType.toLowerCase() == incidentTypeValue.toLowerCase()) {
				var unit = dataSet[x][SPSAGS.ASIT.investigationSubmission.unit];
				var time = dataSet[x][SPSAGS.ASIT.investigationSubmission.submissionTime];

				retVal = SPSAGS.getDueDate(unit, time);
				break;
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.isLateInvestigationSubmission = function(incidentType, dateOfIncident, timeOfIncident, submissionDate) {
	var retVal = false;
	var investigationPeriod = SPSAGS.getInsidentInvestigationPeriodInHours(incidentType);

	var time = submissionDate.getHours() + ":" + submissionDate.getMinutes();
	var incidentDate = new Date(dateOfIncident)

	var diffTime = Utils.getTimeDifferencesInHours(incidentDate, new Date(submissionDate), timeOfIncident, time)

	if (Number(diffTime) > Number(investigationPeriod)) {
		retVal = true;
	}
	return retVal;
}

SPSAGS.getFeesByActivity = function(activity) {
	var retVal = [];

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.registrationFeesConfig.TableName);

		for ( var x in dataSet) {
			var classificationValue = dataSet[x][SPSAGS.ASIT.registrationFeesConfig.classification];
			var activeValue = dataSet[x][SPSAGS.ASIT.registrationFeesConfig.active];
			if (activeValue == "CHECKED" && classificationValue == activity) {
				retVal.push(dataSet[x]);
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.isApplyDiffFees = function() {
	var retVal = false;
	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var applyDiffFees = record.getASI(SPSAGS.ASI.updateProfileFees.TableName, SPSAGS.ASI.updateProfileFees.applyDifferentFeesOnLevelIncrease);
		if (applyDiffFees.equals("CHECKED"))
			retVal = true;

	} catch (e) {

	}
	return retVal;
}

SPSAGS.getSelfDeclarationByActivity = function(activity) {
	var retVal = [];
	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.selfDeclarationFees.TableName);
		for ( var x in dataSet) {
			var activityValue = dataSet[x][SPSAGS.ASIT.selfDeclarationFees.activity];
			var activeValue = dataSet[x][SPSAGS.ASIT.selfDeclarationFees.active];
			if (activeValue == "CHECKED" && activityValue == activity) {
				retVal.push(dataSet[x]);
			}
		}
	} catch (e) {

	}
	return retVal;
}

SPSAGS.getRenewalByActivity = function(activity) {
	var retVal = [];
	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.renewalFees.TableName);
		for ( var x in dataSet) {
			var activityValue = dataSet[x][SPSAGS.ASIT.renewalFees.activity];
			var activeValue = dataSet[x][SPSAGS.ASIT.renewalFees.active];
			if (activeValue == "CHECKED" && activityValue == activity) {
				retVal.push(dataSet[x]);
			}
		}
	} catch (e) {

	}
	return retVal;
}

SPSAGS.getRenewalTimeByActivityAndLevel = function(activity, level) {
	var retVal = 0;

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.renewalConfiguration.TableName);

		for ( var x in dataSet) {
			var classificationValue = dataSet[x][SPSAGS.ASIT.renewalConfiguration.activity];
			var activeValue = dataSet[x][SPSAGS.ASIT.renewalConfiguration.active];
			if (activeValue == "CHECKED" && classificationValue == activity) {
				retVal = Number(dataSet[x][level]);
				break;
			}
		}
	} catch (e) {

	}

	return retVal;

}

SPSAGS.getsubmissionPeriodByLevel = function(eprfLevel) {
	var retVal = 'no data';

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.periodicReportingSubmission.TableName);
		for ( var x in dataSet) {
			var level = dataSet[x][SPSAGS.ASIT.periodicReportingSubmission.level];
			var submissionPeriod = dataSet[x][SPSAGS.ASIT.periodicReportingSubmission.submissionPeriod];
			var active = dataSet[x][SPSAGS.ASIT.periodicReportingSubmission.active];
			if (active == "CHECKED" && level == eprfLevel) {
				retVal = submissionPeriod;
				break;
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.getsubmissionPeriodForProjectByLevel = function(level) {
	var retVal = 'no data';

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.projectPeriodicSubmission.TableName);
		for ( var x in dataSet) {
			var level = dataSet[x][SPSAGS.ASIT.projectPeriodicSubmission.level];
			var submissionPeriod = dataSet[x][SPSAGS.ASIT.projectPeriodicSubmission.submissionPeriod];
			var active = dataSet[x][SPSAGS.ASIT.projectPeriodicSubmission.active];
			if (active == "CHECKED" && level == level) {
				retVal = submissionPeriod;
				break;
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.getInitialSubmissionPeriodByLevel = function(level) {
	var retVal = 'no data';

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.initialPeriodicSubmission.TableName);
		for ( var x in dataSet) {
			var level = dataSet[x][SPSAGS.ASIT.initialPeriodicSubmission.level];
			var submissionPeriod = dataSet[x][SPSAGS.ASIT.initialPeriodicSubmission.submissionPeriod];
			var active = dataSet[x][SPSAGS.ASIT.initialPeriodicSubmission.active];
			if (active == "CHECKED" && level == level) {
				retVal = submissionPeriod;
				break;
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.getProjectActivities = function() {
	var retVal = [];

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.projectActivitiesPrivileges.TableName);

		for ( var x in dataSet) {
			var activeValue = dataSet[x][SPSAGS.ASIT.projectActivitiesPrivileges.active];
			if (activeValue == "CHECKED") {
				retVal.push(String(dataSet[x][SPSAGS.ASIT.projectActivitiesPrivileges.activity]));
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.getInitialRequirements = function() {
	var retVal = [];

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.initialRequirements.TableName);

		for ( var x in dataSet) {
			var activeValue = dataSet[x][SPSAGS.ASIT.initialRequirements.active];
			if (activeValue == "CHECKED") {
				retVal.push(dataSet[x]);
			}
		}
	} catch (e) {

	}

	return retVal;
}

SPSAGS.getSelfDeclarationSubmissionTimeByDays = function(activity, classificationLevel) {
	var retVal = 0;
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	var dataSet = record.getASIT(SPSAGS.ASIT.selfDeclarationSubmission.TableName);

	for ( var x in dataSet) {
		if (dataSet[x][SPSAGS.ASIT.selfDeclarationSubmission.active] == "CHECKED") {
			if (dataSet[x][SPSAGS.ASIT.selfDeclarationSubmission.activity] == activity) {
				var time = dataSet[x][classificationLevel];
				if (time != "") {
					retVal = Number(time)
				}
				break;
			}
		}
	}

	return retVal;
}

SPSAGS.isERCLFeesEnabled = function() {
	var retVal = false;
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	var feesEnabled = record.getASI(SPSAGS.ASI.registrationFeesSettings.TableName, SPSAGS.ASI.registrationFeesSettings.enable);
	if (feesEnabled == "CHECKED") {
		var afterDueDate = false;
		var effectiveDate = record.getASI(SPSAGS.ASI.registrationFeesSettings.TableName, SPSAGS.ASI.registrationFeesSettings.effectiveDate);

		if (!Utils.isBlankOrNull(effectiveDate)) {
			var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
			var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());
			var today = new Date();
			today = dtu.format(today, "MM/dd/yyyy")

			//			var dateInput = null;
			//			var isValidDate = dtu.isValidDate(effectiveDate, "dd/MM/yyyy");
			//			if (isValidDate) {
			//				dateInput = dtu.parseDate(effectiveDate, 'DD');
			//			} else if (dtu.isValidDate(effectiveDate, "MM/dd/yyyy")) {
			//				dateInput = dtu.parseDate(effectiveDate);
			//			}
			//			effectiveDate = dtu.format(dateInput, "MM/dd/yyyy");
			var diff = du.diffDate(effectiveDate, today);
			if (diff <= 0) {
				afterDueDate = true;
			}
		} else {
			afterDueDate = true;
		}

		if (afterDueDate) {
			retVal = true;
		}
	}

	return retVal;
}

SPSAGS.isSelfDeclarationFeesEnabled = function() {
	var retVal = false;
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	var feesEnabled = record.getASI(SPSAGS.ASI.selfDeclarationFees.TableName, SPSAGS.ASI.selfDeclarationFees.enable, "");
	if (feesEnabled == "CHECKED") {
		var afterDueDate = false;
		var effectiveDate = record.getASI(SPSAGS.ASI.selfDeclarationFees.TableName, SPSAGS.ASI.selfDeclarationFees.effectiveDate, "");
		if (!Utils.isBlankOrNull(effectiveDate)) {
			var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
			var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());
			var today = new Date();
			today = dtu.format(today, "MM/dd/yyyy")
			var diff = du.diffDate(today, effectiveDate);
			if (diff >= 0) {
				afterDueDate = true;
			}
		} else {
			afterDueDate = false;
		}

		if (afterDueDate) {
			retVal = true;
		}
	}
	return retVal;
}

SPSAGS.isUpdateProfileFees = function() {
	var retVal = false;
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	var feesEnabled = record.getASI(SPSAGS.ASI.updateProfileFees.TableName, SPSAGS.ASI.updateProfileFees.applyDifferentFeesOnLevelIncrease, "");
	if (feesEnabled == "CHECKED")
		retVal = true;
	return retVal;
}

SPSAGS.isRenewalFeesEnabled = function() {
	var retVal = false;
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	var feesEnabled = record.getASI(SPSAGS.ASI.renewalFees.TableName, SPSAGS.ASI.renewalFees.enable, "");
	if (feesEnabled == "CHECKED") {
		var afterDueDate = false;
		var effectiveDate = record.getASI(SPSAGS.ASI.renewalFees.TableName, SPSAGS.ASI.renewalFees.effectiveDate, "");
		if (!Utils.isBlankOrNull(effectiveDate)) {
			var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
			var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());
			var today = new Date();
			today = dtu.format(today, "MM/dd/yyyy")
			var diff = du.diffDate(today, effectiveDate);
			if (diff >= 0) {
				afterDueDate = true;
			}
		} else {
			afterDueDate = false;
		}

		if (afterDueDate) {
			retVal = true;
		}
	}
	return retVal;
}

SPSAGS.isRenewalEnabled = function() {
	var retVal = false;
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	var feesEnabled = record.getASI(SPSAGS.ASI.renewalAffectiveDate.TableName, SPSAGS.ASI.renewalAffectiveDate.enable, "");
	if (feesEnabled == "CHECKED") {
		var afterDueDate = false;
		var effectiveDate = record.getASI(SPSAGS.ASI.renewalAffectiveDate.TableName, SPSAGS.ASI.renewalAffectiveDate.effectiveDate, "");
		if (!Utils.isBlankOrNull(effectiveDate)) {
			var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
			var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());
			var today = new Date();
			today = dtu.format(today, "MM/dd/yyyy")
			var diff = du.diffDate(today, effectiveDate);
			if (diff >= 0) {
				afterDueDate = true;
			}
		} else {
			afterDueDate = false;
		}

		if (afterDueDate) {
			retVal = true;
		}
	}
	return retVal;
}

SPSAGS.getRegistrationSettings = function() {
	var retVal = {};
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	retVal.effectiveDate = record.getASI(SPSAGS.ASI.registrationFeesSettings.TableName, SPSAGS.ASI.registrationFeesSettings.effectiveDate);
	retVal.enable = record.getASI(SPSAGS.ASI.registrationFeesSettings.TableName, SPSAGS.ASI.registrationFeesSettings.enable);
	retVal.unit = record.getASI(SPSAGS.ASI.registrationFeesSettings.TableName, SPSAGS.ASI.registrationFeesSettings.unit);

	return retVal;
}

SPSAGS.getRenewalSettings = function() {
	var retVal = {};
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	retVal.effectiveDate = record.getASI(SPSAGS.ASI.renewalFees.TableName, SPSAGS.ASI.renewalFees.effectiveDate);
	retVal.enable = record.getASI(SPSAGS.ASI.renewalFees.TableName, SPSAGS.ASI.renewalFees.enable);
	retVal.unit = record.getASI(SPSAGS.ASI.renewalFees.TableName, SPSAGS.ASI.renewalFees.unit);

	return retVal;
}

SPSAGS.getDueDate = function(unit, time) {
	var today = new Date();
	var dueDate = new Date();

	if (unit == "Day") {
		dueDate.setDate(today.getDate() + Number(time));
	} else if (unit == "Week") {
		dueDate.setDate(today.getDate() + (7 * Number(time)));
	} else if (unit == "Month") {
		dueDate = new Date(today.setMonth(today.getMonth() + Number(time)));
	}

	var retVal = Utils.formatDate(dueDate, "MM/dd/yyyy")

	return retVal;
}

SPSAGS.getFutureRequirementsDueDate = function(activity, classificationLevel) {
	var retVal = new Date();
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	var dataSet = record.getASIT(SPSAGS.ASIT.selfDeclarationSubmission.TableName);

	var row = null;
	for ( var x in dataSet) {
		var activityValue = dataSet[x][SPSAGS.ASIT.selfDeclarationSubmission.activity];
		var activeValue = dataSet[x][SPSAGS.ASIT.futureRequirementsTime.active];
		if (activeValue == "CHECKED" && activityValue == activity) {
			row = dataSet[x];
			break;
		}
	}

	if (row != null) {
		var unit = record.getASI(SPSAGS.ASI.selfDeclarationSubmission.TableName, SPSAGS.ASI.selfDeclarationSubmission.unit)
		retVal = SPSAGS.getDueDate(unit, row[classificationLevel]);
	}
	else
		{
		 retVal = Utils.formatDate(retVal, "MM/dd/yyyy")
		}

	return retVal;
}

SPSAGS.getRenewalUnit = function() {
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	return record.getASI(SPSAGS.ASI.renewalConfiguration.TableName, SPSAGS.ASI.renewalConfiguration.unit);
}
SPSAGS.prototype.onApplicationSpecificInfoUpdateAfter = function() {
	java.lang.System.out.println('SPSAGS onApplicationSpecificInfoUpdateAfter START ......')
	var subGroupsString = "'REGISTRATION FEES SETTINGS','RENEWAL FEES','SELF-DECLARATION FEES','RENEWAL AFFECTIVE DATE'";
	var fieldsString = "'Enable?','Effective Date'";

	var query = " SELECT ";
	query += "   B.B1_CHECKBOX_TYPE ";
	query += " , B.B1_CHECKBOX_DESC ";
	query += " , B.B1_CHECKLIST_COMMENT ";
	query += " , B.AUDIT_MOD_BY ";
	query += " , B.AUDIT_MOD_DATE ";
	query += " FROM BCHCKBOX B ";
	query += " JOIN B1PERMIT P ";
	query += " ON P.B1_PER_ID1 = B.B1_PER_ID1 ";
	query += "    AND P.B1_PER_ID2 = B.B1_PER_ID2 ";
	query += "    AND P.B1_PER_ID3 = B.B1_PER_ID3 ";
	query += "    AND P.SERV_PROV_CODE = B.SERV_PROV_CODE ";
	query += " WHERE P.B1_ALT_ID = ? ";
	query += "   AND P.SERV_PROV_CODE = ? ";
	query += "   AND B.AUDIT_MOD_BY = ? ";
	query += "   AND B.AUDIT_MOD_DATE = ";
	query += "   ( ";
	query += "     SELECT MAX(AUDIT_MOD_DATE) AUDIT_MOD_DATE ";
	query += "     FROM BCHCKBOX ";
	query += "     WHERE B1_PER_ID1 = P.B1_PER_ID1 ";
	query += "       AND B1_PER_ID2 = P.B1_PER_ID2 ";
	query += "       AND B1_PER_ID3 = P.B1_PER_ID3 ";
	query += "   ) ";
	query += " AND B.B1_CHECKBOX_TYPE IN (" + subGroupsString + ") ";
	query += " AND B.B1_CHECKBOX_DESC IN (" + fieldsString + ")";

	var results = new DAO("").execSimpleQuery(query, [ 'SPSA Global Settings', aa.getServiceProviderCode(), aa.getAuditID() ]);
    
    

	for ( var x in results) {
		var subGroup = results[x]["B1_CHECKBOX_TYPE"] + "";
		var fieldName = results[x]["B1_CHECKBOX_DESC"] + "";
		var fieldValue = results[x]["B1_CHECKLIST_COMMENT"] + "";

		switch (String(subGroup)) {
		case 'REGISTRATION FEES SETTINGS':
			this.handleRegistrationFeeSettings(fieldName, fieldValue);
			break;
		case 'RENEWAL FEES':
			this.handleRenewalFeeSettings(fieldName, fieldValue);
			break;
		case 'SELF-DECLARATION FEES':
			this.handleSelfDeclarationFeeSettings(fieldName, fieldValue);
			break;
		case 'RENEWAL AFFECTIVE DATE':
			this.handleRenewalEffectiveDateSettings(fieldName, fieldValue);
			break;
		}

	}
		
	
}

SPSAGS.prototype.handleRegistrationFeeSettings = function(fieldName, fieldValue) {
	if (fieldName == 'Enable?') {
		this.handleEnableRegistrationFeeSettings(fieldName, fieldValue);
	} else {
		if (!Utils.isBlankOrNull(fieldValue)) {
			this.handleEnableRegistrationFeeSettings(fieldName, fieldValue);
		}
	}
}
SPSAGS.prototype.handleEnableRegistrationFeeSettings = function(fieldName, fieldValue) {
	eval(getScriptText('INCLUDE_ERCL'));
	if (Utils.isBlankOrNull(fieldValue)) {
		query = " SELECT DISTINCT(P.B1_ALT_ID) FROM B1PERMIT P ";
		query += " JOIN X4FEEITEM_INVOICE I ";
		query += " ON I.B1_PER_ID1 = P.B1_PER_ID1 ";
		query += " AND I.B1_PER_ID2 = P.B1_PER_ID2 ";
		query += " AND I.B1_PER_ID3 = P.B1_PER_ID3 ";
		query += " AND I.FEEITEM_INVOICE_STATUS = 'INVOICED' ";
		query += " AND I.INVOICE_NBR NOT IN ( ";
		query += " SELECT INVOICE_NBR FROM X4PAYMENT_FEEITEM ";
		query += " WHERE B1_PER_ID1 = I.B1_PER_ID1 ";
		query += " AND B1_PER_ID2 = I.B1_PER_ID2 ";
		query += " AND B1_PER_ID3 = I.B1_PER_ID3) ";
		query += " WHERE P.B1_PER_GROUP = 'OSHJ' ";
		query += " AND P.B1_PER_TYPE = 'Classification' ";
		query += " AND P.B1_PER_SUB_TYPE = 'Entity Registration' ";
		query += " AND P.B1_PER_CATEGORY = 'ERCL' ";
		query += " AND P.REC_STATUS = 'A' ";
		query += " AND P.SERV_PROV_CODE = ? ";

		var regResults = new DAO("").execSimpleQuery(query, [ aa.getServiceProviderCode() ]);
		for ( var y in regResults) {
			var altID = regResults[y]['B1_ALT_ID'] + "";

			var rec = new ERCL(altID);
			capId = rec.capId;
			var voidedInvoices = rec.voidFeesAndPayment(true);

			rec.updateStatus("Completed");
			rec.completeWorkflow();

			rec.createProfile();

			var emailParameters = aa.util.newHashtable();
			if (com.accela.aa.emse.util.LanguageUtil.getCurrentLocale() == "ar_AE") {
				emailParameters.put("$$SERVICE_NAME$$", "تسجيل المنشأة وتصنيفها");
			} else {
				emailParameters.put("$$SERVICE_NAME$$", "Entity Registration");
			}
			emailParameters.put("$$PROFILE_ID$$", rec.getCustomID());
			var gn = new GlobalNotifications();
			gn.sendNotification("Custom", "*", "*", emailParameters, null, null, null);
		}
	} else {
		var effectiveDate = this.getASI(SPSAGS.ASI.registrationFeesSettings.TableName, SPSAGS.ASI.registrationFeesSettings.effectiveDate)
		query = " SELECT DISTINCT(P.B1_ALT_ID), Convert(date,P.REC_DATE,103) REC_DATE FROM B1PERMIT P ";
		query += " WHERE P.B1_PER_GROUP = 'OSHJ' ";
		query += " AND P.B1_PER_TYPE = 'Classification' ";
		query += " AND P.B1_PER_SUB_TYPE = 'Entity Registration' ";
		query += " AND P.B1_PER_CATEGORY = 'ERCL' ";
		query += " AND P.REC_STATUS = 'A' ";
		query += " AND P.SERV_PROV_CODE = ? ";
		query += " AND P.B1_APPL_STATUS = 'In Progress' ";

		var regResults = new DAO("").execSimpleQuery(query, [ aa.getServiceProviderCode() ]);
		for ( var y in regResults) {
			var altID = regResults[y]['B1_ALT_ID'] + "";
			var recDate = regResults[y]['REC_DATE'] + "";

			effectiveDate = aa.util.formatDate(new Date(effectiveDate), "dd/MM/yyyy");

			if (new Date(effectiveDate).getTime() >= new Date(recDate).getTime()) {
				var rec = new ERCL(altID);
				capId = rec.capId;

				rec.addFees();
				rec.invoiceFees();
				if (rec.hasActiveTask()) {
					var activeTask = rec.getCurrentWorkflowTask().getTaskDescription();
					rec.deactivateTask(activeTask);
				}
				rec.updateStatus("Pending Payment");

				var fees = rec.getUnpaidFeeItems();
				if (fees == null || fees.length == 0) {
					rec.completeWorkflow();
					rec.updateStatus("Completed");

					rec.createProfile();
				} else {
					//					rec.deactivateTask("Fees Payment");
				}
			}

		}
	}
}
SPSAGS.prototype.handleRenewalFeeSettings = function(fieldName, fieldValue) {
	eval(getScriptText('INCLUDE_UEPR'));
	if (fieldName == 'Enable?') {
		if (Utils.isBlankOrNull(fieldValue)) {
			query = " SELECT DISTINCT(P.B1_ALT_ID) FROM B1PERMIT P ";
			query += " JOIN X4FEEITEM_INVOICE I ";
			query += " ON I.B1_PER_ID1 = P.B1_PER_ID1 ";
			query += " AND I.B1_PER_ID2 = P.B1_PER_ID2 ";
			query += " AND I.B1_PER_ID3 = P.B1_PER_ID3 ";
			query += " AND I.FEEITEM_INVOICE_STATUS = 'INVOICED' ";
			query += " AND I.INVOICE_NBR NOT IN ( ";
			query += " SELECT INVOICE_NBR FROM X4PAYMENT_FEEITEM ";
			query += " WHERE B1_PER_ID1 = I.B1_PER_ID1 ";
			query += " AND B1_PER_ID2 = I.B1_PER_ID2 ";
			query += " AND B1_PER_ID3 = I.B1_PER_ID3) ";
			query += " JOIN BCHCKBOX B ";
			query += " ON B.B1_PER_ID1 = P.B1_PER_ID1 ";
			query += " AND B.B1_PER_ID2 = P.B1_PER_ID2 ";
			query += " AND B.B1_PER_ID3 = P.B1_PER_ID3 ";
			query += " AND B.B1_CHECKBOX_DESC = 'Is Renewal Request' ";
			query += " AND B.B1_CHECKLIST_COMMENT = 'CHECKED' ";
			query += " WHERE P.B1_PER_GROUP = 'OSHJ' ";
			query += " AND P.B1_PER_TYPE = 'Profile' ";
			query += " AND P.B1_PER_SUB_TYPE = 'Update Entity Profile' ";
			query += " AND P.B1_PER_CATEGORY = 'UEPR' ";
			query += " AND P.REC_STATUS = 'A' ";
			query += " AND P.SERV_PROV_CODE = ? ";

			var renResults = new DAO("").execSimpleQuery(query, [ aa.getServiceProviderCode() ]);
			for ( var y in renResults) {
				var altID = renResults[y]['B1_ALT_ID'] + "";

				var rec = new UEPR(altID);
				capId = rec.capId;
				var voidedInvoices = rec.voidFeesAndPayment(true);

				rec.updateProfile();
				rec.completeWorkflow();
				rec.updateStatus("Completed");
				rec.sendInitialRequirements();

				var emailParameters = aa.util.newHashtable();
				if (com.accela.aa.emse.util.LanguageUtil.getCurrentLocale() == "ar_AE") {
					emailParameters.put("$$SERVICE_NAME$$", "تحديث ملف تعريف المنشأة");
				} else {
					emailParameters.put("$$SERVICE_NAME$$", "Update Entity Profile");
				}
				emailParameters.put("$$PROFILE_ID$$", rec.getCustomID());
				var gn = new GlobalNotifications();
				gn.sendNotification("Custom", "*", "*", emailParameters, null, null, null);
			}
		} else {
			//			var effectiveDate = this.getASI(SPSAGS.ASI.registrationFeesSettings.TableName, SPSAGS.ASI.registrationFeesSettings.effectiveDate)
			//
			//			query = " SELECT DISTINCT(P.B1_ALT_ID), Convert(date,P.REC_DATE,103) REC_DATE FROM B1PERMIT P ";
			//			query += " JOIN BCHCKBOX B ";
			//			query += " ON B.B1_PER_ID1 = P.B1_PER_ID1 ";
			//			query += " AND B.B1_PER_ID2 = P.B1_PER_ID2 ";
			//			query += " AND B.B1_PER_ID3 = P.B1_PER_ID3 ";
			//			query += " AND B.B1_CHECKBOX_DESC = 'Is Renewal Request' ";
			//			query += " AND B.B1_CHECKLIST_COMMENT = 'CHECKED' ";
			//			query += " WHERE P.B1_PER_GROUP = 'OSHJ' ";
			//			query += " AND P.B1_PER_TYPE = 'Profile' ";
			//			query += " AND P.B1_PER_SUB_TYPE = 'Update Entity Profile' ";
			//			query += " AND P.B1_PER_CATEGORY = 'UEPR' ";
			//			query += " AND P.REC_STATUS = 'A' ";
			//			query += " AND P.SERV_PROV_CODE = ? ";
			//			query += " AND P.B1_APPL_STATUS = 'In Progress' ";
			//
			//			var renResults = new DAO("").execSimpleQuery(query, [ aa.getServiceProviderCode() ]);
			//			for ( var y in renResults) {
			//				var altID = renResults[y]['B1_ALT_ID'] + "";
			//
			//				var rec = new UEPR(altID);
			//				capId = rec.capId;
			//				
			//				rec.addFees();
			//			}
		}
	}
}
SPSAGS.prototype.handleSelfDeclarationFeeSettings = function(fieldName, fieldValue) {
	eval(getScriptText('INCLUDE_ESDE'));
	if (fieldName == 'Enable?') {
		if (Utils.isBlankOrNull(fieldValue)) {
			query = " SELECT DISTINCT(P.B1_ALT_ID) FROM B1PERMIT P ";
			query += " JOIN X4FEEITEM_INVOICE I ";
			query += " ON I.B1_PER_ID1 = P.B1_PER_ID1 ";
			query += " AND I.B1_PER_ID2 = P.B1_PER_ID2 ";
			query += " AND I.B1_PER_ID3 = P.B1_PER_ID3 ";
			query += " AND I.FEEITEM_INVOICE_STATUS = 'INVOICED' ";
			query += " AND I.INVOICE_NBR NOT IN ( ";
			query += " SELECT INVOICE_NBR FROM X4PAYMENT_FEEITEM ";
			query += " WHERE B1_PER_ID1 = I.B1_PER_ID1 ";
			query += " AND B1_PER_ID2 = I.B1_PER_ID2 ";
			query += " AND B1_PER_ID3 = I.B1_PER_ID3) ";
			query += " WHERE P.B1_PER_GROUP = 'OSHJ' ";
			query += " AND P.B1_PER_TYPE = 'Reporting' ";
			query += " AND P.B1_PER_SUB_TYPE = 'Entity Self Declaration' ";
			query += " AND P.B1_PER_CATEGORY = 'ESDE' ";
			query += " AND P.REC_STATUS = 'A' ";
			query += " AND P.SERV_PROV_CODE = ? ";

			var renResults = new DAO("").execSimpleQuery(query, [ aa.getServiceProviderCode() ]);
			for ( var y in renResults) {
				var altID = renResults[y]['B1_ALT_ID'] + "";

				var rec = new ESDE(altID);
				capId = rec.capId;
				var voidedInvoices = rec.voidFeesAndPayment(true);

				rec.completeWorkflow();
				rec.updateStatus(ESDE.CONST.AS.completed);

				var emailParameters = aa.util.newHashtable();
				if (com.accela.aa.emse.util.LanguageUtil.getCurrentLocale() == "ar_AE") {
					emailParameters.put("$$SERVICE_NAME$$", "الإقرار الذاتي للمنشأة");
				} else {
					emailParameters.put("$$SERVICE_NAME$$", "Entity Self Declaration");
				}
				emailParameters.put("$$PROFILE_ID$$", rec.getCustomID());
				var gn = new GlobalNotifications();
				gn.sendNotification("Custom", "*", "*", emailParameters, null, null, null);
			}
		}
	}
}
SPSAGS.prototype.handleRenewalEffectiveDateSettings = function(fieldName, fieldValue) {
	//TODO: Apply auto renew (Deferred UAT Item)
}

SPSAGS.getIncidentsFrequencyRates = function() {
	var retVal = {};
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	retVal.fatalityFrequencyRate = Number(record.getASI(SPSAGS.ASI.incidentsFrequencyRates.TableName, SPSAGS.ASI.incidentsFrequencyRates.fatalityFrequencyRate));
	retVal.lostTimeIncidentsFrequencyRate = Number(record.getASI(SPSAGS.ASI.incidentsFrequencyRates.TableName, SPSAGS.ASI.incidentsFrequencyRates.lostTimeIncidentsFrequencyRate));
	retVal.reportableIncidentsFrequencyRate = Number(record.getASI(SPSAGS.ASI.incidentsFrequencyRates.TableName,
			SPSAGS.ASI.incidentsFrequencyRates.reportableIncidentsFrequencyRate));

	return retVal;
}
SPSAGS.prototype.onApplicationSpecificInfoUpdateBefore = function() {
	var duplicatedObj = {};
	var fieldName = ""
	var activeName = "";
	var skipChecking = false;
	var updatedTableName = this.getApplicationSpecificInfoUpdatedTable();
	if (updatedTableName == "SYSTEM REQUIREMENTS") {
		skipChecking = true;
	} else if (updatedTableName == "LEVEL 1") {
		fieldName = "Requirement";
		activeName = "Active"
	} else if (updatedTableName == "LEVEL 2") {
		fieldName = "Requirement";
		activeName = "Active"
	} else if (updatedTableName == "LEVEL 3") {
		fieldName = "Requirement";
		activeName = "Active"
	} else if (updatedTableName == "LEVEL 4") {
		fieldName = "Requirement";
		activeName = "Active"
	} else if (updatedTableName == "LEVEL 5") {
		fieldName = "Requirement";
		activeName = "Active"
	} else if (updatedTableName == "INITIAL REQUIREMENTS") {
		fieldName = "Initial Requirement";
		activeName = "Active"
	} else if (updatedTableName == "INCIDENT SUBMISSION SETTINGS") {
		skipChecking = true;
		fieldName = "Incident Type";
		activeName = "Active"
	} else if (updatedTableName == "INVESTIGATION SUBMISSION") {
		skipChecking = true;
		fieldName = "Incident Type";
		activeName = "Active"
	} else if (updatedTableName == "PERIODIC NOTIFICATION") {
		skipChecking = true;
		fieldName = "Period";
		activeName = "Active"
	} else if (updatedTableName == "PERIODIC REPORTING SUBMISSION") {
		skipChecking = true;
		fieldName = "Level";
		activeName = "Active"
	} else if (updatedTableName == "SELF-DECLARATION SUBMISSION") {
		fieldName = "Activity";
		activeName = "Active"
	} else if (updatedTableName == "REGISTRATION FEES CONFIG") {
		fieldName = "Classification";
		activeName = "Active"
	} else if (updatedTableName == "RENEWAL CONFIGURATION") {
		fieldName = "Activity";
		activeName = "Active"
	} else if (updatedTableName == "APPEAL SETTINGS") {
		skipChecking = true;
		fieldName = "Service Name";
	} else if (updatedTableName == "PROJECT ACTIVITIES PRIVILEGES") {
		skipChecking = true;
		fieldName = "Activity";
	} else if (updatedTableName == "SELF-DECLARATION NOTIFICATION") {
		fieldName = "Activity";
		activeName = "Active"
	} else if (updatedTableName == "FUTURE REQUIREMENTS TIME") {
		fieldName = "Activity";
		activeName = "Active"
	} else if (updatedTableName == "PROJECT PERIODIC SUBMISSION") {
		skipChecking = true;
		fieldName = "Level";
		activeName = "Active"
	} else if (updatedTableName == "RENEWAL FEES") {
		fieldName = "Activity";
		activeName = "Active"
	} else if (updatedTableName == "SELF-DECLARATION FEES") {
		fieldName = "Activity";
		activeName = "Active"
	} else if (updatedTableName == "GENERAL INSPECT CHECK ITEMS") {
		skipChecking = true;
		fieldName = "Serial Number";
	} else if (updatedTableName == "PREDEF INSP CHECKLIST ITEMS") {
		skipChecking = true;
		fieldName = "Serial Number";
		activeName = "Active"
	} else if (updatedTableName == "PREDEF INSPECTION CHECKLISTS") {
		skipChecking = true;
		fieldName = "Checklist Code";
		activeName = "Active"
	} else if (updatedTableName == "INITIAL PERIODIC SUBMISSION") {
		skipChecking = true;
		fieldName = "Level";
		activeName = "Active"
	} else if (updatedTableName == "NOTIFICATION CONFIGURATION") {
		skipChecking = true;
		fieldName = "Period";
		activeName = "Active"
	} else if (updatedTableName == "EXCLUDED FIELDS FOR PROJECTS") {
		skipChecking = true;
		fieldName = "Period";
		activeName = "Active"
	} else if (updatedTableName == "DASHBOARD ACCESS") {
		skipChecking = true;
	} else if (updatedTableName == "ACTING AS DEPARTMENT ACCESS") {
		skipChecking = true;
	}

	if (!skipChecking) {
		duplicatedObj = this.isDuplicated(updatedTableName, fieldName, activeName)
		if (duplicatedObj.isDuplicated) {
			var message = aa.messageResources.getLocalMessage("SETTING_RECORD_VALUE_DUPLICATED");
			cancel = true;
			showMessage = true;
			comment(message + " " + duplicatedObj.duplicatedValue);
		}
	}

}

SPSAGS.prototype.isDuplicated = function(tableName, fieldName, activeName) {
	java.lang.System.out.println("===tableName-> " + tableName + " " + fieldName + " " + activeName);
	var duplicatedObj = {
		isDuplicated : false,
		duplicatedValue : ""
	};
	var asit = Record.getASITableBefore(tableName);
	var map = aa.util.newHashMap();
	for ( var i in asit) {
		var value = String(asit[i][fieldName]);
		java.lang.System.out.println("===value-> " + value);
		if (activeName) {
			var activeValue = String(asit[i][activeName]);
			var valueList = map.get(value);
			if (valueList != null) {
				if (activeValue == "CHECKED" && valueList.contains(activeValue)) {
					duplicatedObj = {
						isDuplicated : true,
						duplicatedValue : value
					}
					break;
				} else {
					valueList.add(activeValue)
				}

			} else {
				var list = aa.util.newArrayList();
				list.add(activeValue);
				map.put(value, list);
				java.lang.System.out.println("===map.size()--> " + map.size());
			}
		} else {
			var valueList = map.get(value);
			if (valueList != null) {
				duplicatedObj = {
					isDuplicated : true,
					duplicatedValue : value
				}
				break;

			} else {
				map.put(value, value);
			}
		}

	}
	return duplicatedObj;

}
SPSAGS.prototype.getActiveProjectActivities = function(){
	var projectActivities = this.getASIT('PROJECT ACTIVITIES PRIVILEGES')

	var activeActivities = [];
	for(var x in projectActivities) {
		var row = projectActivities[x];
		if(row['Active'] == 'CHECKED'){
			activeActivities.push(String(row['Activity']));
		}
	}
	
	return activeActivities;
}
SPSAGS.prototype.hidePageAsProjectActivity = function(activity,currentPage){
	var projectActivities = this.getASIT('EXCLUDED FIELDS FOR PROJECTS')

	var activeActivities = [];
	for(var x in projectActivities) {
		var row = projectActivities[x];
		if(row['Activity'] == activity && row['Page'] == currentPage){
			return true
		}
	}
	
	return false;
}

SPSAGS.getProjectActivitiesReports = function(projectType, discludePeriodic) {
	if (typeof discludePeriodic === "undefined") {
		discludePeriodic = false;
	}
	// var result = [];
	var retVal = [];
	var record = new Record(SPSAGS.General_Settings_Record_Id);
	var projectActivities = record
			.getASIT(SPSAGS.ASIT.projectActivitiesPrivileges.TableName);
	
		for ( var prjAct in projectActivities) {
			var activityValue = projectActivities[prjAct][SPSAGS.ASIT.projectActivitiesPrivileges.activity];
			if (activityValue.equals(projectType)) {
				var isActive = projectActivities[prjAct][SPSAGS.ASIT.projectActivitiesPrivileges.active];
				if (isActive == "CHECKED") {

					// actReportArr.push("Project");
					if (projectActivities[prjAct][SPSAGS.ASIT.projectActivitiesPrivileges.incidentReport] == "CHECKED") {
						if (retVal.indexOf("OSHJ/Reporting/Incident Reporting/IRRP") == -1) {
							retVal.push("OSHJ/Reporting/Incident Reporting/IRRP");
						}
					}
//					if (projectActivities[prjAct][SPSAGS.ASIT.projectActivitiesPrivileges.investigationReport] == "CHECKED") {
//						if (retVal.indexOf("OSHJ/Reporting/Investigation Report/IIRP") == -1) {
//							retVal.push("OSHJ/Reporting/Investigation Report/IIRP");
//						}
//					}
					if (projectActivities[prjAct][SPSAGS.ASIT.projectActivitiesPrivileges.periodicReport] == "CHECKED" && !discludePeriodic) {
						if (retVal.indexOf("OSHJ/Reporting/Periodic Reporting/PRPR") == -1) {
							retVal.push("OSHJ/Reporting/Periodic Reporting/PRPR");
						}
					}
					if (projectActivities[prjAct][SPSAGS.ASIT.projectActivitiesPrivileges.unsafeActReport] == "CHECKED") {
						if (retVal.indexOf("OSHJ/Reporting/Reporting of Unsafe ACT/RUAC") == -1) {
							retVal.push("OSHJ/Reporting/Reporting of Unsafe ACT/RUAC");
						}
					}
				}
				
				break;
			}
	}
	return retVal;
}
SPSAGS.setPeriodicSubmissionLevel = function(activeLevels, inActiveLevels) {
    try {
	    java.lang.System.out.println("SPSAGS setPeriodicSubmissionLevel - activeLevels = " + activeLevels)
        java.lang.System.out.println("SPSAGS setPeriodicSubmissionLevel - inActiveLevels = " + inActiveLevels)
     
        var envParameters = aa.util.newHashMap();
        envParameters.put("GROUP_NAME", 'PERIODIC REPORTING SUBMISSION');

        aa.runAsyncScript("SET_PROFILES_SUBMISSION_LEVELS", envParameters);


        eval(getScriptText("INCLUDE_EPRF"));

        if(inActiveLevels.length > 0){
          inActiveLevels = "'" + inActiveLevels.join("','") + "'";

        var sql = "SELECT B.B1_ALT_ID ALT_ID " +
            " FROM B1PERMIT B " +
            " LEFT JOIN BCHCKBOX ENTITY_LEVEL ON ENTITY_LEVEL.SERV_PROV_CODE = B.SERV_PROV_CODE AND ENTITY_LEVEL.B1_PER_ID1 = B.B1_PER_ID1 " +
            " AND ENTITY_LEVEL.B1_PER_ID2 = B.B1_PER_ID2 AND ENTITY_LEVEL.B1_PER_ID3 = B.B1_PER_ID3 AND " +
            " ENTITY_LEVEL.B1_CHECKBOX_DESC = 'Entity Classification' AND ENTITY_LEVEL.B1_CHECKBOX_TYPE = 'CLASSIFICATION DETAILS' " +
            " WHERE B.SERV_PROV_CODE = 'SPSA' AND B.B1_PER_GROUP = 'OSHJ' AND B.B1_PER_TYPE = 'Profile' AND " +
            " B.B1_PER_SUB_TYPE = 'Entity Profile' AND B.B1_PER_CATEGORY = 'EPRF' AND " +
            " ENTITY_LEVEL.B1_CHECKLIST_COMMENT IN (" + inActiveLevels + ")";

        java.lang.System.out.println("SPSAGS setPeriodicSubmissionLevel - inActiveLevels SQL = " + sql)

        var inActiveResults = SPSABASE.runSQL(sql, null);
        if(inActiveResults != null) {
            var data = inActiveResults.toArray();
            if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                    var altId = data[i]["ALT_ID"];
                    var record = new EPRF(altId)
                    record.updateEntityProfilesSubmission('EPR', false);
                   
                }
            }
        }
        }
       


    } catch (e) {
        java.lang.System.out.println("SPSAGS setPeriodicSubmissionLevel - Error - " + e)
    }
}
SPSAGS.setSelfDeclarationSubmissionLevel = function(activeActivities, inActiveActivities) {
    try {
        eval(getScriptText("INCLUDE_EPRF"));

        activeActivities = "'" + activeActivities.join("','") + "'";
        inActiveActivities = "'" + inActiveActivities.join("','") + "'";

        var activeRecords = [];
        var inActiveRecords = [];

        var sql = "SELECT B.B1_ALT_ID ALT_ID " +
            " FROM B1PERMIT B " +
            " LEFT JOIN BCHCKBOX ENTITY_LEVEL ON ENTITY_LEVEL.SERV_PROV_CODE = B.SERV_PROV_CODE AND ENTITY_LEVEL.B1_PER_ID1 = B.B1_PER_ID1 " +
            " AND ENTITY_LEVEL.B1_PER_ID2 = B.B1_PER_ID2 AND ENTITY_LEVEL.B1_PER_ID3 = B.B1_PER_ID3 AND " +
            " ENTITY_LEVEL.B1_CHECKBOX_DESC = 'Activity Classification' AND ENTITY_LEVEL.B1_CHECKBOX_TYPE = 'CLASSIFICATION DETAILS' " +
            " WHERE B.SERV_PROV_CODE = 'SPSA' AND B.B1_PER_GROUP = 'OSHJ' AND B.B1_PER_TYPE = 'Profile' AND " +
            " B.B1_PER_SUB_TYPE = 'Entity Profile' AND B.B1_PER_CATEGORY = 'EPRF' AND " +
            " ENTITY_LEVEL.B1_CHECKLIST_COMMENT IN (" + activeActivities + ")";

        var activeResults = SPSABASE.runSQL(sql, null);
        aa.print(sql)
        aa.print(activeResults.toArray()
            .length)
        if(activeResults != null) {
            var data = activeResults.toArray();
            if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                    var altId = data[i]["ALT_ID"];
                    var record = new EPRF(altId)
                    record.updateEntityProfilesSubmission('SD', true);
                    //activeRecords.push(altId);  
                }
            }
        }

        var sql = "SELECT B.B1_ALT_ID ALT_ID " +
            " FROM B1PERMIT B " +
            " LEFT JOIN BCHCKBOX ENTITY_LEVEL ON ENTITY_LEVEL.SERV_PROV_CODE = B.SERV_PROV_CODE AND ENTITY_LEVEL.B1_PER_ID1 = B.B1_PER_ID1 " +
            " AND ENTITY_LEVEL.B1_PER_ID2 = B.B1_PER_ID2 AND ENTITY_LEVEL.B1_PER_ID3 = B.B1_PER_ID3 AND " +
            " ENTITY_LEVEL.B1_CHECKBOX_DESC = 'Activity Classification' AND ENTITY_LEVEL.B1_CHECKBOX_TYPE = 'CLASSIFICATION DETAILS' " +
            " WHERE B.SERV_PROV_CODE = 'SPSA' AND B.B1_PER_GROUP = 'OSHJ' AND B.B1_PER_TYPE = 'Profile' AND " +
            " B.B1_PER_SUB_TYPE = 'Entity Profile' AND B.B1_PER_CATEGORY = 'EPRF' AND " +
            " ENTITY_LEVEL.B1_CHECKLIST_COMMENT IN (" + inActiveActivities + ")";

        var inActiveResults = SPSABASE.runSQL(sql, null);
        if(inActiveResults != null) {
            var data = inActiveResults.toArray();
            if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                    var altId = data[i]["ALT_ID"];
                    var record = new EPRF(altId);
                    record.updateEntityProfilesSubmission('SD', false);
                    //inActiveRecords.push(altId);  
                }
            }
        }


    } catch (e) {
        java.lang.System.out.println("SPSAGS setSelfDeclarationSubmissionLevel - Error - " + e)
    }
}
SPSAGS.isRenewalActivityEnabled = function(activity) {
	var retVal = false;

	try {
		var record = new Record(SPSAGS.General_Settings_Record_Id);
		var dataSet = record.getASIT(SPSAGS.ASIT.renewalConfiguration.TableName);

		for ( var x in dataSet) {
			var classificationValue = dataSet[x][SPSAGS.ASIT.renewalConfiguration.activity];
			var activeValue = dataSet[x][SPSAGS.ASIT.renewalConfiguration.active];
			if (activeValue == "CHECKED" && classificationValue == activity) {
				retVal =  true
				break;
			}
		}
	} catch (e) {
         java.lang.System.out.println("SPSAGS isRenewalActivityEnabled - Error - " + e)
	}

	return retVal;

}
SPSAGS.setProjectPeriodicSubmissionLevel = function(activeActivities, inActiveActivities) {
	try{
		java.lang.System.out.println("SPSAGS setProjectPeriodicSubmissionLevel start...");
		
		var envParameters = aa.util.newHashMap();
        envParameters.put("GROUP_NAME", 'PROJECT PERIODIC SUBMISSION');

        aa.runAsyncScript("SET_PROFILES_SUBMISSION_LEVELS", envParameters);

		
		 eval(getScriptText("INCLUDE_PRPL"));
	      
        java.lang.System.out.println("SPSAGS setProjectPeriodicSubmissionLevel - set inactive levels ....");
        if(inActiveActivities.length > 0){
	       inActiveActivities = "'" + inActiveActivities.join("','") + "'";

            var sql = "SELECT B.B1_ALT_ID ALT_ID FROM B1PERMIT B " + 
                  " LEFT JOIN BCHCKBOX PROFILE_ID ON PROFILE_ID.SERV_PROV_CODE = B.SERV_PROV_CODE AND PROFILE_ID.B1_PER_ID1 = B.B1_PER_ID1 " +
                  " AND PROFILE_ID.B1_PER_ID2 = B.B1_PER_ID2 AND PROFILE_ID.B1_PER_ID3 = B.B1_PER_ID3 AND PROFILE_ID.B1_CHECKBOX_DESC = 'Entity Profile ID' " +
                  " AND PROFILE_ID.B1_CHECKBOX_TYPE = 'PROJECT DETAILS' LEFT JOIN B1PERMIT ENTITY_PROFILE ON PROFILE_ID.B1_CHECKLIST_COMMENT = ENTITY_PROFILE.B1_ALT_ID " + 
                  " LEFT JOIN BCHCKBOX ENTITY_LEVEL ON ENTITY_LEVEL.SERV_PROV_CODE = ENTITY_PROFILE.SERV_PROV_CODE AND ENTITY_LEVEL.B1_PER_ID1 = ENTITY_PROFILE.B1_PER_ID1 " +
                  " AND ENTITY_LEVEL.B1_PER_ID2 = ENTITY_PROFILE.B1_PER_ID2 AND ENTITY_LEVEL.B1_PER_ID3 = ENTITY_PROFILE.B1_PER_ID3 AND ENTITY_LEVEL.B1_CHECKBOX_DESC = 'Entity Classification' " + 
                  " AND ENTITY_LEVEL.B1_CHECKBOX_TYPE = 'CLASSIFICATION DETAILS' WHERE B.SERV_PROV_CODE = 'SPSA' AND B.B1_PER_GROUP = 'OSHJ' AND B.B1_PER_TYPE = 'Projects' AND " +
                  " B.B1_PER_SUB_TYPE = 'Project Profile' AND B.B1_PER_CATEGORY = 'PRPL' AND  ENTITY_PROFILE.SERV_PROV_CODE = 'SPSA' AND ENTITY_PROFILE.B1_PER_GROUP = 'OSHJ' " + 
                  "  AND ENTITY_PROFILE.B1_PER_TYPE = 'Profile' AND ENTITY_PROFILE.B1_PER_SUB_TYPE = 'Entity Profile' AND ENTITY_PROFILE.B1_PER_CATEGORY = 'EPRF' " +
                  " AND ENTITY_LEVEL.B1_CHECKLIST_COMMENT IN (" + inActiveActivities + ")";

        java.lang.System.out.println("SPSAGS setProjectPeriodicSubmissionLevel - SQL = " + sql);
        var inActiveResults = SPSABASE.runSQL(sql, null);
        if(inActiveResults != null) {
            var data = inActiveResults.toArray();
            if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                    var altId = data[i]["ALT_ID"];
                    var record = new PRPL(altId);
                    var cap = record.getCapModel();
		            cap.setQUD1("");
		            aa.cap.editCapByPK(cap);
                
                }
            }
        }
        }
        

	
	}catch(e){
		java.lang.System.out.println("SPSAGS setProjectPeriodicSubmissionLevel - Error - " + e)
	}
}
SPSAGS.setInitialPeriodicSubmissionLevel = function(activeActivities, inActiveActivities) {
	try{
		java.lang.System.out.println("SPSAGS setInitialPeriodicSubmissionLevel start...");
		
		var envParameters = aa.util.newHashMap();
        envParameters.put("GROUP_NAME", 'INITIAL PERIODIC SUBMISSION');

        aa.runAsyncScript("SET_PROFILES_SUBMISSION_LEVELS", envParameters);
		
		 eval(getScriptText("INCLUDE_EPRF"));
	      


        if(inActiveActivities.length > 0){
	         inActiveActivities = "'" + inActiveActivities.join("','") + "'";

             var sql = "SELECT B.B1_ALT_ID ALT_ID " +
            " FROM B1PERMIT B " +
            " LEFT JOIN BCHCKBOX ENTITY_LEVEL ON ENTITY_LEVEL.SERV_PROV_CODE = B.SERV_PROV_CODE AND ENTITY_LEVEL.B1_PER_ID1 = B.B1_PER_ID1 " +
            " AND ENTITY_LEVEL.B1_PER_ID2 = B.B1_PER_ID2 AND ENTITY_LEVEL.B1_PER_ID3 = B.B1_PER_ID3 AND " +
            " ENTITY_LEVEL.B1_CHECKBOX_DESC = 'Entity Classification' AND ENTITY_LEVEL.B1_CHECKBOX_TYPE = 'CLASSIFICATION DETAILS' " +
            " WHERE B.SERV_PROV_CODE = 'SPSA' AND B.B1_PER_GROUP = 'OSHJ' AND B.B1_PER_TYPE = 'Profile' AND " +
            " B.B1_PER_SUB_TYPE = 'Entity Profile' AND B.B1_PER_CATEGORY = 'EPRF' AND B.B1_APPL_STATUS IN ('Registration Approved') AND " +
            " ENTITY_LEVEL.B1_CHECKLIST_COMMENT IN (" + inActiveActivities + ")";
        java.lang.System.out.println("SPSAGS setInitialPeriodicSubmissionLevel inactive - sql - " + sql)
        
        var inActiveResults = SPSABASE.runSQL(sql, null);
        if(inActiveResults != null) {
            var data = inActiveResults.toArray();
            if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                    var altId = data[i]["ALT_ID"];
                    var record = new EPRF(altId);
                    record.updateEntityProfilesSubmission('EPR', false);
                
                }
            }
        }
        }
        

	
	}catch(e){
		java.lang.System.out.println("SPSAGS setInitialPeriodicSubmissionLevel - Error - " + e)
	}
}