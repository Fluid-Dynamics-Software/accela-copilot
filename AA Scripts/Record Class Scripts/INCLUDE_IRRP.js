/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_IRRP.js
| Event			: N/A
|
| Usage			: contains all the record's specific script
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: RSA
| Created at	: 11/08/2021 08:40:14
|
/------------------------------------------------------------------------------------------------------*/
if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}

if (typeof SPSAGS === "undefined") {
	eval(getScriptText("INCLUDE_SPSAGS"));
}

if (typeof Utils === "undefined") {
	eval(getScriptText("INCLUDE_Utils"));
}
if (typeof SPSABASE === "undefined") {
	eval(getScriptText("INCLUDE_SPSABASE"));
}

if (typeof EPRF === "undefined") {
	eval(getScriptText("INCLUDE_EPRF"));
}

if (typeof VIOL === "undefined") {
	eval(getScriptText("INCLUDE_VIOL"));
}

function IRRP(capId) {
	SPSABASE.call(this, capId);
};
IRRP.prototype = Object.create(SPSABASE.prototype);
IRRP.prototype.constructor = IRRP;
/*----------------------------------------------------ASI-----------------------------------------------*/
IRRP.RECORD_TYPE = "OSHJ/Reporting/Incident Reporting/IRRP";
IRRP.ASI = {};
IRRP.ASI.entityDetails = {};
IRRP.ASI.entityDetails.TableName = "ENTITY DETAILS";
IRRP.ASI.entityDetails.entityProfileId = "Entity Profile ID";
IRRP.ASI.entityDetails.classificationLevel = "Classification Level";
IRRP.ASI.entityDetails.entityNameInEnglish = "Entity Name in English";
IRRP.ASI.entityDetails.entityNameInArabic = "Entity Name in Arabic";
IRRP.ASI.entityDetails.entityContactNumber = "Entity Contact Number";
IRRP.ASI.entityDetails.entityEmail = "Entity Email";
IRRP.ASI.entityDetails.entityAddressInEnglish = "Entity Address in English";
IRRP.ASI.entityDetails.entityAddressInArabic = "Entity Address in Arabic";
IRRP.ASI.entityDetails.isIncidentRelatedToProject = "Is Incident Related to Project?";
IRRP.ASI.entityDetails.projectId = "Project ID";

IRRP.ASI.userDetails = {};
IRRP.ASI.userDetails.TableName = "USER DETAILS";
IRRP.ASI.userDetails.personFirstName = "Person First Name";
IRRP.ASI.userDetails.personLastName = "Person Last Name";
IRRP.ASI.userDetails.professionalTitle = "Professional Title";
IRRP.ASI.userDetails.mobileNumber = "Mobile Number";
IRRP.ASI.userDetails.email = "Email";

IRRP.ASI.inspectionDetails = {};
IRRP.ASI.inspectionDetails.TableName = "INSPECTION DETAILS";
IRRP.ASI.inspectionDetails.inspectionChecklist = "Inspection Checklist";

IRRP.ASI.incidentType = {};
IRRP.ASI.incidentType.TableName = "INCIDENT TYPE";
IRRP.ASI.incidentType.fatality = "Fatality";
IRRP.ASI.incidentType.injuries = "Type of Injuries";
IRRP.ASI.incidentType.dangerousOccurrences = "Dangerous Occurrences";
IRRP.ASI.incidentType.typeOfDangerousOccurrences = "Type of Dangerous Occurrences";
IRRP.ASI.incidentType.occupationalDiseases = "Occupational Diseases";

IRRP.ASI.scheduleInspection = {};
IRRP.ASI.scheduleInspection.TableName = "SCHEDULE INSPECTION";
IRRP.ASI.scheduleInspection.scheduleInspection = "Schedule Inspection";

IRRP.ASI.incidentDetails = {};
IRRP.ASI.incidentDetails.TableName = "INCIDENT DETAILS";
IRRP.ASI.incidentDetails.dateOfIncident = "Date of Incident";
IRRP.ASI.incidentDetails.timeOfIncident = "Time of Incident";
IRRP.ASI.incidentDetails.placeOfIncident = "Place of Incident";
IRRP.ASI.incidentDetails.briefDescriptionOfIncident = "Brief description of Incident";
IRRP.ASI.incidentDetails.immediateActionsTaken = "Immediate Actions Taken";

IRRP.ASI.dueDateExtension = {};
IRRP.ASI.dueDateExtension.TableName = "DUE DATE EXTENSION";
IRRP.ASI.dueDateExtension.extendedDueDate = "Extended Due Date";

IRRP.ASI.decisionDetails = {};
IRRP.ASI.decisionDetails.TableName = "DECISION DETAILS";
IRRP.ASI.decisionDetails.decisionType = "Decision Type";
IRRP.ASI.decisionDetails.comments = "Comments";
IRRP.ASI.decisionDetails.decisionDate = "Decision Date";

IRRP.ASI.incidentDueDate = {};
IRRP.ASI.incidentDueDate.TableName = "INCIDENT DUE DATE";
IRRP.ASI.incidentDueDate.dueDate = "Due Date";

/*----------------------------------------------------ASIT----------------------------------------------*/
IRRP.ASIT = {};
IRRP.ASIT.closeOutItems = {};
IRRP.ASIT.closeOutItems.TableName = "CLOSE OUT ITEMS";
IRRP.ASIT.closeOutItems.checklistName = "Checklist Name";
IRRP.ASIT.closeOutItems.checklistNameAr = "Checklist Name Ar";
IRRP.ASIT.closeOutItems.checklistItem = "Checklist Item";
IRRP.ASIT.closeOutItems.checklistItemAr = "Checklist Item Ar";
IRRP.ASIT.closeOutItems.checklistItemStatusGroup = "Checklist Item Status Group";
IRRP.ASIT.closeOutItems.comments = "Comments";
IRRP.ASIT.closeOutItems.dueDate = "Due Date";
IRRP.ASIT.closeOutItems.closeDate = "Close Date";

IRRP.ASIT.entity = {};
IRRP.ASIT.entity.TableName = "ENTITY";
IRRP.ASIT.entity.entityProfileId = "Entity Profile ID";
IRRP.ASIT.entity.classificationLevel = "Classification Level";
IRRP.ASIT.entity.entityNameInEnglish = "Entity Name in English";
IRRP.ASIT.entity.entityNameInArabic = "Entity Name in Arabic";
IRRP.ASIT.entity.entityContactNumber = "Entity Contact Number";
IRRP.ASIT.entity.entityEmail = "Entity Email";
IRRP.ASIT.entity.entityAddressInEnglish = "Entity Address in English";
IRRP.ASIT.entity.entityAddressInArabic = "Entity Address in Arabic";
IRRP.ASIT.entity.isIncidentRelatedToProject = "Is Incident Related to Project?";
IRRP.ASIT.entity.projectId = "Project ID";

IRRP.ASIT.checklists = {};
IRRP.ASIT.checklists.TableName = "CHECKLISTS";
IRRP.ASIT.checklists.checklistName = "Checklist Name";
IRRP.ASIT.checklists.checklistNameAr = "Checklist Name Ar";
IRRP.ASIT.checklists.checklistItem = "Checklist Item";
IRRP.ASIT.checklists.checklistItemAr = "Checklist Item Ar";
IRRP.ASIT.checklists.checklistItemStatusGroup = "Checklist Item Status Group";
IRRP.ASIT.checklists.checklistRequired = "Checklist Required";
IRRP.ASIT.checklists.checklistItemRequired = "Checklist Item Required";

IRRP.ASIT.detailsOfPersonSAffected = {};
IRRP.ASIT.detailsOfPersonSAffected.TableName = "DETAILS OF PERSON(S) AFFECTED";
IRRP.ASIT.detailsOfPersonSAffected.incidentType = "Incident Type";
IRRP.ASIT.detailsOfPersonSAffected.injuries = "Injuries";
IRRP.ASIT.detailsOfPersonSAffected.occupationalDiseases = "Occupational Diseases";
IRRP.ASIT.detailsOfPersonSAffected.dangerousOccurrences = "Dangerous Occurrences";
IRRP.ASIT.detailsOfPersonSAffected.name = "Name";
IRRP.ASIT.detailsOfPersonSAffected.position = "Position";
IRRP.ASIT.detailsOfPersonSAffected.mobileNumber = "Mobile Number";
IRRP.ASIT.detailsOfPersonSAffected.emiratesId = "Emirates ID";
/*-------------------------------------------SPECIFIC CODE----------------------------------------------*/

IRRP.prototype.checkLateSubmission = function() {
	var retVal = "";
	var incidentType = "";
	var fatalityValue = this.getASI(IRRP.ASI.incidentType.TableName, IRRP.ASI.incidentType.fatality);
	var injuriesValue = this.getASI(IRRP.ASI.incidentType.TableName, IRRP.ASI.incidentType.injuries);
	var dangerousOccurrencesValue = this.getASI(IRRP.ASI.incidentType.TableName, IRRP.ASI.incidentType.typeOfDangerousOccurrences);
	var occupationalDiseasesValue = this.getASI(IRRP.ASI.incidentType.TableName, IRRP.ASI.incidentType.occupationalDiseases);

	var incidentDate = this.getASI(IRRP.ASI.incidentDetails.TableName, IRRP.ASI.incidentDetails.dateOfIncident);
	var incidentTime = this.getASI(IRRP.ASI.incidentDetails.TableName, IRRP.ASI.incidentDetails.timeOfIncident);

	var submissionDate = this.getCreationDate();
	if (fatalityValue == "CHECKED") {
		incidentType = "Fatality";
		if (SPSAGS.isLateIncidentSubmission(incidentDate, incidentTime, submissionDate, incidentType)) {
			retVal += incidentType + " Late Submission ";
		}
	}

	if (injuriesValue == "CHECKED") {
		incidentType = "Injuries";
		if (SPSAGS.isLateIncidentSubmission(incidentDate, incidentTime, submissionDate, incidentType)) {
			retVal += incidentType + " Late Submission ";
		}

	}

	if (dangerousOccurrencesValue == "CHECKED") {
		incidentType = "Dangerous Occurrences";
		if (SPSAGS.isLateIncidentSubmission(incidentDate, incidentTime, submissionDate, incidentType)) {
			retVal += incidentType + " Late Submission ";
		}
	}

	if (occupationalDiseasesValue == "CHECKED") {
		incidentType = "Occupational Diseases";
		if (SPSAGS.isLateIncidentSubmission(incidentDate, incidentTime, submissionDate, incidentType)) {
			retVal += incidentType + " Late Submission ";
		}
	}

	return retVal;
}

IRRP.prototype.onWorkflowTaskUpdateBefore = function(wfTask, wfStatus) {
	message = '';
	if (typeof wfTask === 'undefined') {
		wfTask = aa.env.getValue('WorkflowTask');
	}
	if (typeof wfStatus === 'undefined') {
		wfStatus = aa.env.getValue('WorkflowStatus');
	}
	if (typeof wfProcess === 'undefined') {
		wfProcess = '';
	}

	var validEscalateUser = this.validateEscalateUser(wfTask, wfStatus, wfProcess);
	if (validEscalateUser != "") {
		cancel = true;
		showMessage = true;
		showDebug = false;
		message = validEscalateUser;
	}
	
	var retVal = this.validateWorkflowTaskUpdateBefore(wfTask, wfStatus, wfProcess);
	if (retVal != "") {
		cancel = true;
		showMessage = true;
		showDebug = false;
		message = retVal;
	}
}

IRRP.prototype.onWorkflowTaskUpdateAfter = function(wfTask, wfStatus) {
	if (typeof wfTask === 'undefined') {
		wfTask = aa.env.getValue('WorkflowTask');
	}
	if (typeof wfStatus === 'undefined') {
		wfStatus = aa.env.getValue('WorkflowStatus');
	}
	if (typeof wfProcess === 'undefined') {
		wfProcess = '';
	}
	if (typeof message === 'undefined') {
		message = '';
	}
	
	this.handleWorkflowTaskUpdateAfterForReports(wfTask, wfStatus, wfProcess, "Incident Reporting", "الإبلاغ عن حادث")
	
	//	if (wfTask == "Conduct Inspection" && wfStatus == "Complete") {
	//		this.assignInspectorToTask();
	//		this.copyChecklistsResults();
	//		this.prepareCloseoutItems();
	//	}
	//	if (wfTask == "Receive Inspection Result and Decide Action") {
	//		var decision = this.getTSI(wfTask, "Decision");
	//		if (decision != "") {
	//			var comments = this.getWorkflowTaskComment(wfTask, wfStatus);
	//			this.fillDecisionDetails(decision, comments);
	//		}
	//
	//		this.updateInspectionHistory(decision);
	//		
	//		if (wfStatus == "Escalate") {
	//			this.attachSubProcess("Escalation and Approval",wfStatus);
	//		}
	//	}
	//	if (wfProcess == "BUAL") {
	//		if (wfStatus == "Approve") {
	//			this.updateTaskAndHandleDisposition("Escalation and Approval", "Complete", "");
	//		} else if (wfStatus == "Reject") {
	//			this.updateTaskAndHandleDisposition("Escalation and Approval", "Reject", "");
	//		}
	//	}
	//	if (wfTask == "Review Inspection Feedback and report preparation if required") {
	//		var decision = this.getTSI("Receive Inspection Result and Decide Action", "Decision");
	//		if (decision != "") {
	//			var parentProfile = new Record(this.getASI(
	//					IRRP.ASI.entityDetails.TableName,
	//					IRRP.ASI.entityDetails.entityProfileId));
	//			this.fillParentDecisionDetails(parentProfile);
	//		}
	//
	//		if (decision == "Fines") {
	//			VIOL.createViolationRecord(this.getCustomID());
	//		}
	//		this.copyCloseoutToProfile();
	//		
	//
	//		if (wfStatus == "Completed with Report") {
	//			this.sendCompleteWithReportNotification(decision)
	//		}
	//	}
}

//IRRP.prototype.sendCompleteWithReportNotification = function(decision)
//{
//	eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
//	var emailsArr = [];
//	var contactArr = aa.people.getCapContactByCapID(this.getCapID()).getOutput();
//	if (contactArr.length > 0) {
////		for (var q = 0; q < contactArr.length; q++) {
////			var contactOBj = new Object();
////			var contactModel = contactArr[q].getCapContactModel();
////			var contactType = contactModel.getContactType();
////			var email = contactModel.getEmail();
////			if (email && email != "") {
////				emailsArr.push(email);
////			}
////		}
//
//		var emailParameters = aa.util.newHashtable();
//		emailParameters.put("$$ALT_ID$$", this.getCustomID());
//		emailParameters.put("$$SERVICE_NAME$$", "Incident Reporting");
//		emailParameters.put("$$SERVICE_NAME_AR$$", "الإبلاغ عن حادث");
//		
//		var decision_ar = getDecisionArabisValue("SD_WF_DECISION", decision);
//		emailParameters.put("$$DECISION$$", decision);
//		emailParameters.put("$$DECISION_AR$$", decision_ar);
//		
//		var reportParameter = aa.util.newHashMap();
//		java.lang.System.out.println("===sendCompleteNotification reportId ==> " + reportId);
//		reportParameter.put("recordid", this.getCustomID());
//		reportParameter.put("capid", String(this.capId));
////		reportParameter.put("UserID", aa.getAuditID());
//		reportParameter.put("agencyid", aa.getServiceProviderCode());
//		var reportId = Number(Record.getLookupVal("INFORMATION_REPORT_INFO",
//				"Inspection Report"));
//		
//		this.saveReportToAttachment(this.getCapID(),reportId , "Inspection Report", "",
//				false, reportParameter);
//		
//
//		java.lang.System.out.println("CORP logs docuemnt saved");
//		
//		var documentList = this.getDocumentList();
//		
//			java.lang.System.out
//					.println("===sendCompleteNotification documentList ==> "
//							+ documentList.length);
//			var docArray = [];
//			for ( var i in documentList) {
//		
//				java.lang.System.out
//						.println("===sendCompleteNotification category ==> "
//								+ documentList[i].getDocCategory());
//				if (documentList[i].getDocCategory() == "Inspection Report") {
//					docArray.push(documentList[i]);
//				}
//			}
//		
//		var gn = new GlobalNotifications();
//		gn.sendNotification("Custom", "*", "Completed with Report",
//				emailParameters, null, null, docArray, emailsArr);
////		GlobalNotifications.sendEmailByTemplate("GSSGNT-00006", emailsArr,
////				emailParameters);
//		
//
//		java.lang.System.out.println("CORP logs end");
//	}
//}
//
//function getDecisionArabisValue(stdChoice, stdDesc) {
//	var val = stdDesc;
//	// " + stdChoice + "
//	// " + stdDesc + "
//	var sqlQuery = "SELECT VI18N.BIZDOMAIN_VALUE FROM RBIZDOMAIN_VALUE V " +
//		"INNER JOIN RBIZDOMAIN_VALUE_I18N VI18N ON V.RES_ID = VI18N.RES_ID " +
//		"WHERE V.BIZDOMAIN = '"  + stdChoice + "' AND V.BIZDOMAIN_VALUE = '" + stdDesc + "' AND VI18N.LANG_ID = 'ar_AE' ";
//	var result = SPSABASE.runSQL(sqlQuery, null);
//	if (result != null) {
//		var data = result.toArray();
//		if (data.length > 0) {
//			return data[0]['BIZDOMAIN_VALUE'];
//		}
//	}
//	return val;
//}

IRRP.prototype.onInspectionResultModifyAfter = function() {
	this.prepareCloseoutItems();
}
IRRP.prototype.onGuidesheetUpdateAfter = function() {
    try {

        var primary = this.getPrimaryInspection();
        var isComplete = true;
        if(primary.getInspectionStatus() == 'Scheduled') {
            isComplete = false;
        }
        var assistantInspections = this.getAssistantInspection();
        if(assistantInspections.length > 0) {
            for(var i in assistantInspections) {
                if(assistantInspections[i].getInspectionStatus() == 'Scheduled') {
                    isComplete = false;
                    break;
                }
            }
        }
        if(isComplete) {
            this.deleteASIT("INSPECTION CHECKLIST ANSWERS");
            this.updateInspectionChecklistAnswersASIT("INSPECTION CHECKLIST ANSWERS");
        }


    } catch (e) {
        java.lang.System.out.println("IRRP onGuidesheetUpdateAfter - Error: " + e);
    }
}
IRRP.prototype.onConvertToRealCAPAfter = function() {
	try {
		var parentRecord = new Record(parentCapId)
		var parentCapType = parentRecord.getCapType();
		
		var user = aa.publicUser.getPublicUserByPUser(publicUserID).getOutput();
		if (user != null) {
			var email = user.getEmail() + "";
			//		if (email != "") {
			//			var contact = Utils.getContactDataByEmailID(email);
			var userSeqNum = user.getUserSeqNum();

			var userIdSeq = String(userSeqNum).replace(/\D/g, '');
			var contact = aa.people.getUserAssociatedContact(userIdSeq);

			if (contact.getSuccess()) {
				contact = contact.getOutput();

				contact = contact.get(0);

				if (!Utils.isBlankOrNull(contact)) {
					var refNumber = contact.getContactSeqNumber();

					var contacts = parentRecord.getContacts();
					for ( var x in contacts) {
						var refContact = contacts[x].getCapContactModel().getRefContactNumber();

						if (refContact == refNumber) {
							var people = contacts[x].getPeople();
							this.editASI(IRRP.ASI.userDetails.TableName, IRRP.ASI.userDetails.email, people.getEmail());
							this.editASI(IRRP.ASI.userDetails.TableName, IRRP.ASI.userDetails.personFirstName, people.getFirstName());
							this.editASI(IRRP.ASI.userDetails.TableName, IRRP.ASI.userDetails.personLastName, people.getLastName());
							this.editASI(IRRP.ASI.userDetails.TableName, IRRP.ASI.userDetails.mobileNumber, people.getPhone1());
							this.editASI(IRRP.ASI.userDetails.TableName, IRRP.ASI.userDetails.professionalTitle, people.getTitle());
						}
					}

				}
			}
		}


		var parentProfileId = parentCapId;
		if (parentCapType == "OSHJ/Projects/Project Profile/PRPL") {
			eval(getScriptText("INCLUDE_PRPL"));
			parentProfileId = parentRecord.getASI(PRPL.ASI.projectDetails.TableName, PRPL.ASI.projectDetails.entityProfileId)

			this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.isIncidentRelatedToProject, "Yes");
			this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.projectId, parentRecord.getCustomID());

		} else {
			this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.isIncidentRelatedToProject, "No");
		}

		var parentProfile = new EPRF(parentProfileId);
		this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityProfileId, parentProfile.getCustomID());

		var classificationLevel = parentProfile.getASI(EPRF.ASI.classificationDetails.TableName, EPRF.ASI.classificationDetails.entityClassification)
		this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.classificationLevel, classificationLevel);

		var entityAddress = parentProfile.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.addressInEnglish)
		this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityAddressInEnglish, entityAddress);

		var entityAddressArabic = parentProfile.getASI(EPRF.ASI.addressDetails.TableName, EPRF.ASI.addressDetails.addressInArabic)
		this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityAddressInArabic, entityAddressArabic);

		var entityContactNumber = parentProfile.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.entityContactNumber)
		this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityContactNumber, entityContactNumber);

		var entityEmail = parentProfile.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.entityEmail)
		this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityEmail, entityEmail);

		var entityNameInArabic = parentProfile.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.entityNameInArabic)
		this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityNameInArabic, entityNameInArabic);

		var entityNameInEnglish = parentProfile.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.entityNameInEnglish)
		this.editASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityNameInEnglish, entityNameInEnglish);

		var dueDate = this.getDueDate();
		this.createCapComment("due date " + dueDate)
		this.editASI(IRRP.ASI.incidentDueDate.TableName, IRRP.ASI.incidentDueDate.dueDate, dueDate);

		this.createCapComment("due date " + this.getASI(IRRP.ASI.incidentDueDate.TableName, IRRP.ASI.incidentDueDate.dueDate))

		// Send Notification
		eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
		var emailsArr = [];
		var emailParameters = aa.util.newHashtable();
		addParameter(emailParameters, "$$NO_EXTRA_PARAMETERS$$", this.getCapID().getCustomID());
		var contactArr = aa.people.getCapContactByCapID(this.getCapID()).getOutput();
		if (contactArr.length > 0) {
			for (var q = 0; q < contactArr.length; q++) {
				var contactOBj = new Object();
				var contactModel = contactArr[q].getCapContactModel();
				var contactType = contactModel.getContactType();
				var email = contactModel.getEmail();
				var isInternalUser = contactModel.getInternalUserFlag();

				if (isInternalUser != "Y") {
					if (email && email != "") {
						emailsArr.push(email);
					}
				}
			}

			var gn = new GlobalNotifications();
			gn.sendNotification("Custom", "*", "*", emailParameters, null, null, null, emailsArr);
		}

	} catch (e) {

		this.createCapComment("e " + e)
	}
}
IRRP.prototype.getBasicInfo = function() {
	return {
		"EN" : String(this.getASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityNameInEnglish)),
		"AR" : String(this.getASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityNameInArabic))
	}
}

IRRP.prototype.onInspectionResultModifyBefore = function() {
	this.validateCancelledInspection();
}

IRRP.prototype.getDueDate = function() {
	var isFatality = this.getASI(IRRP.ASI.incidentType.TableName, IRRP.ASI.incidentType.fatality)
	var isInjuries = this.getASI(IRRP.ASI.incidentType.TableName, IRRP.ASI.incidentType.injuries)
	var isTypeOfDangerousOccurrences = this.getASI(IRRP.ASI.incidentType.TableName, IRRP.ASI.incidentType.typeOfDangerousOccurrences)
	var isOccupationalDiseases = this.getASI(IRRP.ASI.incidentType.TableName, IRRP.ASI.incidentType.occupationalDiseases)

	var datesArray = new Array();
	if (isFatality == "CHECKED") {
		var fatalityDate = SPSAGS.getInsidentInvestigationDueDateByIncidentType("Fatality");
		if (fatalityDate != null) {

			datesArray.push(fatalityDate)
		}
	}
	if (isOccupationalDiseases == "CHECKED") {
		var occupationalDiseasesDate = SPSAGS.getInsidentInvestigationDueDateByIncidentType("Occupational Diseases");
		if (occupationalDiseasesDate != null) {

			datesArray.push(occupationalDiseasesDate)
		}
	}

	if (isInjuries == "CHECKED") {
		var injuriesDate = SPSAGS.getInsidentInvestigationDueDateByIncidentType("Injuries");
		if (injuriesDate != null) {

			datesArray.push(injuriesDate)
		}
	}

	if (isTypeOfDangerousOccurrences == "CHECKED") {
		var dangerousOccurrencesDate = SPSAGS.getInsidentInvestigationDueDateByIncidentType("Dangerous Occurrences");
		if (dangerousOccurrencesDate != null) {

			datesArray.push(dangerousOccurrencesDate)
		}
	}

	var dueDate = new Date(Math.max.apply(null, datesArray.map(function(e) {
		return new Date(e);
	})));

	if (dueDate != null) {
		dueDate = Utils.formatDate(dueDate, "MM/dd/yyyy")
	}

	return dueDate;
}
IRRP.prototype.onInspectionResultSubmitBefore = function(){
	
	this.onGuidesheetUpdateBefore();
	
	var inspObject = resultObjArray[0];
	var currentPrimaryInspectionStatus = resultObjArray[0].inspResult;
	var currentPrimaryInspectionResult = resultObjArray[0].resultComment;
	var inspID = inspObject.inspId;
    var inspArray = aa.inspection.getInspections(this.capId).getOutput();

    var checkList = aa.util.newArrayList();
    for (var i in inspArray) {
        if (inspArray[i].getIdNumber() == inspID) {
            var inspModel = inspArray[i].getInspection();
            checkList = inspModel.getGuideSheets();
            break;
        }
    }
	
	var isAllCompleted = true;
	for (var i = 0; i < checkList.size(); i++) {
		var checkModel = checkList.get(i);
		var items = checkModel.getItems();
		for (var k = 0; k < items.size(); k++) {
			var itemModel = items.get(k);
			var status = itemModel.getGuideItemStatus();
			var required = itemModel.getIsRequired();
			var name = itemModel.getGuideItemText();
			var comments = itemModel.getGuideItemComment();
			var type = itemModel.getGuideType();
			if(String(name).indexOf("Standard Comments and Findings") != -1){
				continue;
			}
			if ((required == "Y" || required == "Yes" ) && (status == ''  || status == null)) {
				isAllCompleted = false;
				break;
			}
		}
	}

	if(!isAllCompleted && (currentPrimaryInspectionStatus == "Pass" || currentPrimaryInspectionStatus == "Passed" || currentPrimaryInspectionStatus == "Complete")){
		throw aa.messageResources.getLocalMessage("STVR_FILL_CHECK_LIST_RESULT");
	}
}