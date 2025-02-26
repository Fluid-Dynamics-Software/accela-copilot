/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_SPSABASE.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: BFATAFTAH
| Created at	: 29/08/2021 09:29:31
|
/------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------- Variables and Objects -----------------------------------------------*/
SPSABASE.Inspector = {};
SPSABASE.Inspector.Type = {};
SPSABASE.Inspector.Type.Primary = 1;
SPSABASE.Inspector.Type.Assistant = 0;


SPSABASE.TSI = {
		decision : {
			tsiName	: "DECISION",
			decision: "Decision",
			closeOutTiming: "Close-out Timing"
		}
	};

SPSABASE.CONST = {};
SPSABASE.CONST.WF = {
	reviewRequestAndOrPrepareChecklist : {
		wfTask : "Review Request(and/or Prepare Checklist)",
		wfStatus : {
			actionRequired : "Action Required",
			incomplete : "Incomplete",
			noActionRequired : "No Action Required"
		}
	},
	reviewUpdatetheChecklistAppointInspectors : {
		wfTask : "Review/Update the Checklist - Appoint Inspector(s)",
		wfStatus : {
			assign : "Assign",
			cancelInspection : "Cancel Inspection"
		}
	},
	conductInspection  : {
		wfTask : "Conduct Inspection",
		wfStatus : {
			complete : "Complete",
			reject: "Reject"
		}
	},
	receivedInspectionResults :{
		wfTask : "Received Inspection Results",
		wfStatus : {
			complete : "Complete"
		}
	},
	reviewInspectionFeedbackandReport  :{
		wfTask : "Review Inspection Feedback and Report",
		wfStatus : {
			sendBack : "Send Back",
			complete : "Complete"
		}
	},
	reviewReport  :{
		wfTask : "Review Report",
		wfStatus : {
			sendBack : "Send Back",
			completeWithReport : "Complete with Report",
			completeWithoutReport : "Complete without Report",
			reject : "Reject",
			escalate : "Escalate",
			escalateToManager : "Escalate to Manager"
		}
	},
//	enforcementCheck  :{
//		wfTask : "Enforcement Check",
//		wfStatus : {
//			completed : "Completed",
//			escalate : "Escalate",
//			escalateToManager : "Escalate to Manager"
//		}
//	},
	approvalLevels  :{
		wfTask : "Approval Levels",
		wfStatus : {
			completeWithReport : "Complete with Report",
			completeWithoutReport : "Complete without Report",
			sendBack : "Send Back",
			reject : "Reject"
		}
	}
};

SPSABASE.CONST.SUBPROCESS = {
		wfProcess : {
			wfName : "BUAL_REPORTS",
			wfTask :
			{
				deputyManagerReview : "Deputy Manager Review",
				managerReview : "Manager Review"
			},
			wfStatus : {
				sendBack : "Send Back",
				reject : "Reject",
				completeWithReport : "Complete with Report",
				completeWithoutReport : "Complete without Report"
			}
		},
	};


/*---------------------------------------------------- Methods and Events -----------------------------------------------*/
var canDebug =true;
eval(getScriptText('INCLUDE_UTILS'));
if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}
if (typeof SPSAGS === "undefined") {
	eval(getScriptText("INCLUDE_SPSAGS"));
}
Record.require('DAO');

function SPSABASE(capId, agency) {

	Record.call(this, capId, agency);

	this.settings = SPSAGS.getInstance();
}

SPSABASE.prototype = Object.create(Record.prototype);
SPSABASE.prototype.constructor = SPSABASE;

var setTimeout, clearTimeout, setInterval, clearInterval;
(function() {
	var executor = new java.util.concurrent.Executors.newScheduledThreadPool(1);
	var counter = 1;
	var ids = {};

	setTimeout = function(fn, delay) {
		var id = counter++;
		var runnable = new JavaAdapter(java.lang.Runnable, {
			run : fn
		});
		ids[id] = executor.schedule(runnable, delay, java.util.concurrent.TimeUnit.MILLISECONDS);
		return id;
	}

	clearTimeout = function(id) {
		ids[id].cancel(false);
		executor.purge();
		delete ids[id];
	}

	setInterval = function(fn, delay) {
		var id = counter++;
		var runnable = new JavaAdapter(java.lang.Runnable, {
			run : fn
		});
		ids[id] = executor.scheduleAtFixedRate(runnable, delay, delay, java.util.concurrent.TimeUnit.MILLISECONDS);
		return id;
	}

	clearInterval = clearTimeout;

})()

SPSABASE.runSQL = function(sqlCMD, parameters) {
	var params = [];
	if (arguments.length == 2)
		params = parameters;

	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var utilProcessor = new JavaAdapter(com.accela.aa.datautil.DBResultSetProcessor, {
		processResultSetRow : function(rs) {
			var meta = rs.getMetaData();
			var numcols = meta.getColumnCount();
			var record = {}
			var result = null;

			for (var i = 0; i < numcols; i++) {
				var columnName = meta.getColumnName(i + 1);
				columnName = columnName.toUpperCase()
				result = rs.getObject(i + 1);
				if (result == null) {
					record[columnName] = String("");
				} else {
					if (result.getClass && result.getClass().getName() == "java.sql.Timestamp") {
						record[columnName] = String(new Date(rs.getTimestamp(i + 1).getTime()).toString("MM/dd/yyyy"));
					} else {
						record[columnName] = String(rs.getObject(i + 1));
					}
				}
			}
			return record;
		}
	});

	var result = dba.select(sqlCMD, params, utilProcessor, null);

	return result;
}

/**
 * Get all asi fields values for a specific sub group
 * 
 * @param {String}
 *            subGroupName
 * 
 * @returns {Array} - array of asi fields values
 */
SPSABASE.prototype.getASIBySubgroup = function(subGroupName) {
	var retArr = {}
	var result = aa.appSpecificInfo.getByCapID(this.capId);
	if (result.getSuccess()) {
		var result = result.getOutput();
		for (i in result) {
			if (String(result[i].getCheckboxType()).toUpperCase() !== subGroupName.toUpperCase()) {
				continue
			}
			var value = result[i].getChecklistComment();
			if (value == null || value + "" == "") {
				value = "";
			}
			var asiLabel = result[i].getCheckboxDesc();
			retArr[asiLabel] = value
		}
	}
	return retArr
}

SPSABASE.prototype.setTSISubProcess = function(subTaskName, tsiField, value) {

	var workflowResult = aa.workflow.getTasks(this.getCapID());
	var wfObj = null;
	if (workflowResult.getSuccess()) {
		wfObj = workflowResult.getOutput();
	}
	if(!Utils.isBlankOrNull(wfObj)){
		for (i in wfObj) {
			var fTask = wfObj[i];
			if (fTask.getTaskDescription() == subTaskName) {
				var stepnumber = fTask.getStepNumber();
				var processID = fTask.getProcessID();
				var TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(this.getCapID(), processID, stepnumber, tsiField)
				if (TSIResult.getSuccess()) {
						var tsi = TSIResult.getOutput();
						var tsiArray = new Array();
						var tsiInfoModel = tsi.getTaskSpecificInfoModel();
						tsiInfoModel.setChecklistComment(value);
						tsiArray.push(tsiInfoModel);
						tsiResult = aa.taskSpecificInfo.editTaskSpecInfos(tsiArray);
				}
			}
		}
	}
}

SPSABASE.prototype.getTSISubProcess = function(subTaskName, tsiField) {
	var val = "";
	var workflowResult = aa.workflow.getTasks(this.getCapID());
	var wfObj = null;
	if (workflowResult.getSuccess()) {
		wfObj = workflowResult.getOutput();
	}
	if(!Utils.isBlankOrNull(wfObj)){
		for (i in wfObj) {
			var fTask = wfObj[i];
			if (fTask.getTaskDescription() == subTaskName) {
				var stepnumber = fTask.getStepNumber();
				var processID = fTask.getProcessID();
				var TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(this.getCapID(), processID, stepnumber, tsiField)
				if (TSIResult.getSuccess()) {
						var tsi = TSIResult.getOutput();
						if (tsi == null) {
							throw "TSI result is null";
						}
						var tsiInfoModel = tsi.getTaskSpecificInfoModel();
						val = tsiInfoModel.getChecklistComment();
				}
			}
		}
	}
	return val;
}

SPSABASE.getUserObj = function(userId) {
	var systemUserObjResult = aa.person.getUser(userId);
	if (!systemUserObjResult.getSuccess()) {
		return null
	}
	return systemUserObjResult.getOutput();
}

//SPSABASE.getUserDepartmentName = function(userId) {
//	var departmentList = aa.people.getDepartmentList(userId).getOutput()
//	return departmentList.length > 0 ? departmentList[0].getDeptName() + '' : ''
//}
SPSABASE.getUserDepartmentName = function(userId) {
	var department;
	try {
		var orgService = com.accela.aa.emse.dom.service.CachedService.getInstance().getOrganizationService();
		var department = orgService.getDepartmentByUserInfo(aa.getServiceProviderCode(), userId);
		if(department){
			department=	department.getDeptName();
		}
		
		aa.debug("USER DEPARTMENT : ",department);

	} catch (e) {
		throw "***ERROR :getUserDepartment : " + e.message;
		department = null;
	}

	return department;
}
SPSABASE.removeAppHierarchy = function(parentCapId, childCapId) {
	var result = aa.cap.removeAppHierarchy(parentCapId, childCapId)
	if (!result.getSuccess()) {
		logDebug('ERROR: failed to remove app hierarchy, parent record id (' + parentRecordId + '): ' + result.getErrorMessage())
		return false
	}
	return true
}

SPSABASE.prototype.removeChild = function(childAltId, serviceProviderCode) {
	if (serviceProviderCode == null || serviceProviderCode == "") {
		serviceProviderCode = aa.getServiceProviderCode();
	}
	var childRecord = new Record(childAltId, serviceProviderCode);

	var result = aa.cap.removeAppHierarchy(this.getCapID(), childRecord.getCapID());

	if (!result.getSuccess()) {
		throw "Could not un link [" + childRecord.getCustomID() + "] to Record [" + this.getCustomID() + "]";
	}
}

SPSABASE.prototype.runStartInspection = function(inspectorId, inspectionGroup, inspectionType, inspectorType) {
	try {
		// ADD TWO HOURS TO THE START TIME TO GET THE END TIME
		// start: Update Workflow Status
		// this.updateTaskAndHandleDisposition('Inspection', 'Start
		// Inspection');
		// end: Update Workflow Status

		// start: Schedule Inspection
		var inspectionStartDate = new Date();
		var autoAssign = false;
		var units = null;
		var inspector = aa.people.getSysUserByID(inspectorId).getOutput();

		var minutes = inspectionStartDate.getMinutes();
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var hours24 = inspectionStartDate.getHours();
		var hours = hours24 % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		var ampm = hours24 >= 12 ? 'PM' : 'AM';

		var inspectionEndDate = inspectionStartDate;
		inspectionEndDate.setHours(inspectionEndDate.getHours() + 2);

		var minutesEndTime = inspectionEndDate.getMinutes();
		minutesEndTime = minutesEndTime < 10 ? '0' + minutesEndTime : minutesEndTime;
		var hours24EndTime = inspectionEndDate.getHours();
		var hoursEndTime = hours24EndTime % 12;
		hoursEndTime = hoursEndTime ? hoursEndTime : 12; // the hour '0'
		// should be '12'
		var ampmEndTime = hours24EndTime >= 12 ? 'PM' : 'AM';

		var startTime = hours + ':' + minutes;
		var endTime = hoursEndTime + ':' + minutesEndTime;
		var ampmEnd = ampmEndTime;
		var comment = "";
		// Fix for bug : ADCA-122
		if (arguments.length == 5 && arguments[4] != null) {
			comment = arguments[4];
		}
		var showInACA = 'N';
		var checklistnames = this.getChecklistNames();
		var res = this.scheduleInspection(inspectionGroup, inspectionType, inspectionStartDate, autoAssign, units, inspector, startTime, ampm, endTime, ampmEnd, comment,
				inspectorType, showInACA, checklistnames);
		// end: Schedule Inspection

		var appStatus = 'Inspection Started';
		// start: Update Application Status
		// this.updateStatus(appStatus);
		// end: Update Application Status

		// UPDATE PARENT STATUS
		// ICARG Parent
		// Record.require('ICARG');
		// if (this.getCapType() == ICARG.RECORD_TYPE) {
		// Record.require('DCARG');
		// var parent = this.getParents(DCARG.RECORD_TYPE)[0];
		// parent.updateStatus(appStatus);
		// }
		// //IPASS Parent
		// Record.require('IPASS');
		// if (this.getCapType() == IPASS.RECORD_TYPE) {
		// Record.require('CPROF');
		// var parent = this.getParents(CPROF.RECORD_TYPE)[0];
		// parent.updateStatus(appStatus);
		// }
		//
		// Record.require('ITURV');
		// if (this.getCapType() == ITURV.RECORD_TYPE) {
		// Record.require('VTRANS');
		// var parent = this.getParents(VTRANS.RECORD_TYPE)[0];
		// parent.updateStatus(appStatus);
		// }

		return SPSABASE.getResultSuccess(res);
	} catch (ex) {
		java.lang.System.out.println("Error " + ex);
		logDebug(ex);
		return SPSABASE.getResultFail(ex);
	}
}

SPSABASE.prototype.createCapComment = function(capCommentStr) {// optional
	// vDispOnInsp
	if (canDebug) {
		var vDispOnInsp = "N";
		if (arguments.length > 1 && typeof (arguments[1]) != "undefined" && arguments[1] != null && arguments[1] != "") {
			vDispOnInsp = arguments[1];
		}

		var comDate = aa.date.getCurrentDate();
		var capCommentScriptModel = aa.cap.createCapCommentScriptModel();
		capCommentScriptModel.setCapIDModel(this.capId);
		capCommentScriptModel.setCommentType("APP LEVEL COMMENT");
		capCommentScriptModel.setSynopsis("");
		capCommentScriptModel.setText(capCommentStr + ", at: "+ new Date().toString());
		capCommentScriptModel.setAuditUser(aa.getAuditID());
		capCommentScriptModel.setAuditStatus("A");
		capCommentScriptModel.setAuditDate(comDate);
		var capCommentModel = capCommentScriptModel.getCapCommentModel();
		capCommentModel.setDisplayOnInsp(vDispOnInsp);
		aa.cap.createCapComment(capCommentModel);
	}
}

SPSABASE.prototype.cancelInspection = function(cComment) {
	if (this.isMainInspector() || SPSABASE.isUserSupervisor() || SPSABASE.isUserAdmin()) {
		// validate the inspection status
		var primaryInsp = this.getPrimaryInspection();
		if (primaryInsp && primaryInsp.getInspectionStatus() != "Scheduled") {
			return SPSABASE.getResultFail(aa.messageResources.getLocalMessage("NOT_VALID_TO_CANCEL_INSPECTION"));
		}

		// cancel all inspections on record
		this.cancelAllInspections();
		// close WF
		this.updateTaskAndHandleDisposition("Result Inspection", "Cancel Inspection", cComment);
		this.updateStatus("Cancelled");
		this.createCapComment(cComment);

		var pCapId;
		var capType = this.getCapType() + "";
		Record.require('IPASS');
		Record.require('ITURV');
		Record.require('ICARG');

		if (capType == IPASS.RECORD_TYPE) {
			Record.require('CPROF');
			var parent = this.getParents(CPROF.RECORD_TYPE)[0];
			parent.updateStatus("Active");
			pCapId = parent.getCapID();
		} else if (capType == ITURV.RECORD_TYPE) {
			Record.require('VTRANS');
			var parent = this.getParents(VTRANS.RECORD_TYPE)[0];
			parent.updateStatus('Pending Inspection');
			pCapId = parent.getCapID();
		} else if (capType == ICARG.RECORD_TYPE) {
			Record.require('DCARG');
			var parent = this.getParents(DCARG.RECORD_TYPE)[0];
			parent.updateStatus('Pending Inspection');
			pCapId = parent.getCapID();
		}

		var newAltId = this.getCustomID() + "-Canceled";
		var newVersion = SPSABASE.getRecordMaxCanceledVersion(newAltId) + 1;
		newAltId = newAltId + String(newVersion);

		this.updateCustomID(newAltId);
		SPSABASE.removeAppHierarchy(pCapId, this.capId);

		return SPSABASE.getResultSuccess();
	} else {
		return SPSABASE.getResultFail(aa.messageResources.getLocalMessage("NO_PERMISSION_TO_CANCEL_INSPECTION"));
	}
}

SPSABASE.isUserSupervisor = function(userId) {
	if (!userId) {
		userId = aa.getAuditID().toUpperCase();
	}
	var userObj = aa.person.getUser(userId).getOutput();
	var userDept = userObj.getDeptOfUser();
	if (userDept == aa.getServiceProviderCode() + '/NA/INSP/DIRECTOR/MANAGER/HOS/SUPER') {
		return true;
	}

	return false;
}

SPSABASE.isUserAdmin = function() {
	var userObj = aa.person.getUser(aa.getAuditID().toUpperCase()).getOutput();
	var userDept = userObj.getDeptOfUser();
	if (userDept == aa.getServiceProviderCode() + '/NA/NA/NA/NA/NA/NA') {
		return true;
	}

	return false;
}

SPSABASE.prototype.sendNotification = function (event, task, status, eparams, docArray) {
    try {
		eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
        var contactsArray = SPSABASE.getEmailArray(this);
        capId = this.getCapID();
        // var eparams = aa.util.newHashtable();
        // if (emailParameters != null) {
        //     for (var key in emailParameters) {
        //         if (emailParameters.hasOwnProperty(key))
        //             eparams.put(key, emailParameters[key]);
        //     }
        // }
        var emails = [];
        var phones = [];
        for (var index in contactsArray) {
            var contact = contactsArray[index];
            if (contact.email) {
                if (!Utils.isBlankOrNull(contact.email))
                    emails.push(contact.email);
                if (!Utils.isBlankOrNull(contact.phone))
                    phones.push(contact.phone);
            } else {
                var email = contact.getEmail();
                var phone = contact.getPhone1();
                if (!Utils.isBlankOrNull(email))
                    emails.push(email);
                if (!Utils.isBlankOrNull(phone))
                    phones.push(phone);
            }
        }
        var gn = new GlobalNotifications();
        gn.sendNotification(event, task, status, eparams, null, null, docArray, emails);
    } catch (e) {
		this.createCapComment("SPSABASE sendNotification Error:"+e);
		logDebug('SPSABASE sendNotification Error: ' + e);
    }
}

SPSABASE.getEmailArray = function (record) {
    var emailArray = [];
    var contacts = record.getContacts();

    for (var index in contacts) {
        var contact = contacts[index].getCapContactModel();
        var isInternalUser = contact.getInternalUserFlag();

		if (isInternalUser != "Y") {
			 emailArray.push(contact);
		}
       
    }
    return emailArray;
}

SPSABASE.prototype.isMainInspector = function() {
	var primaryInsp = this.getPrimaryInspection();
	if (primaryInsp) {
		var inspectorObj = primaryInsp.getInspector();
		var inspectorID = inspectorObj.getUserID()
		if (inspectorID.toUpperCase() == aa.getAuditID().toUpperCase()) {
			return true;
		}
	}
	return false;
}

SPSABASE.prototype.cancelAllInspections = function() {
	var inspResults = aa.inspection.getInspections(this.capId);
	if (inspResults.getSuccess()) {
		var inspAll = inspResults.getOutput();
		for (ii in inspAll) {
			if (inspAll[ii].getDocumentDescription().equals("Insp Scheduled") && inspAll[ii].getAuditStatus().equals("A")) {
				cancelResult = aa.inspection.cancelInspection(this.capId, inspAll[ii].getIdNumber());
				this.setInspectionDateAndTimeInQUD2('CancelInpsection');
			}
		}
		return true;
	}
	return false;
}

SPSABASE.prototype.getPrimaryInspection = function() {
	var inspections = aa.inspection.getInspections(this.capId);
	var primary = null;
	if (!inspections.getSuccess()) {
		throw inspections.getErrorMessage()
	}
	var inspArray = inspections.getOutput();
	for (i in inspArray) {
		var currentInspection = inspArray[i].getInspection();
		if (currentInspection.getInspectionStatus() == 'Cancelled') {
			continue;
		}
		if (SPSABASE.Inspector.Type.Primary == currentInspection.getActivity().getVehicleID()) {
			primary = currentInspection;
			break;
		}

	}
	return primary;
}

SPSABASE.prototype.getAssistantInspection = function() {
	var inspections = aa.inspection.getInspections(this.capId);
	var assistant = [];
	if (!inspections.getSuccess()) {
		throw inspections.getErrorMessage()
	}
	var inspArray = inspections.getOutput();
	for (i in inspArray) {
		var currentInspection = inspArray[i].getInspection();
		if (currentInspection.getInspectionStatus() == 'Cancelled') {
			continue;
		}
		if (SPSABASE.Inspector.Type.Assistant == currentInspection.getActivity().getVehicleID()) {
			assistant.push(currentInspection);
		}

	}
	return assistant;
}

SPSABASE.prototype.scheduleInspection = function(inspectionGroup, inspectionType, inspectionDate, autoAssign, units, inspector, startTime, AMPM, endTime, AMPMEND, comment,
		vehicleID, displayInACA, checklistsNames) {
	var inspModel = aa.inspection.getInspectionScriptModel().getOutput().getInspection();
	var activityModel = inspModel.getActivity();
	var inspTypeModel = Record.getInspectionTypeModel(inspectionGroup, inspectionType);
	if (inspTypeModel == null) {
		throw "Inspection [" + inspectionGroup + "].[" + inspectionType + "] is not defined in accela"
	}
	if(Utils.isBlankOrNull(vehicleID)){
		vehicleID = 0;
	}
	var inspSequenceNumber = inspTypeModel.getSequenceNumber();
	activityModel.setInspSequenceNumber(inspSequenceNumber);

	activityModel.setCapIDModel(this.capId);
	activityModel.setAutoAssign("Y");

	activityModel.setActivityType(inspectionType);

	activityModel.setInspectionGroup(inspectionGroup);
	activityModel.setActivityDate(inspectionDate);
	activityModel.setDisplayInACA(displayInACA);
	activityModel.setVehicleID(vehicleID);

	if (startTime != null) {
		activityModel.setTime2(startTime);
	}
	if (AMPM != null) {
		activityModel.setTime1(AMPM);
	}

	if (endTime != null) {
		activityModel.setActEndTime2(endTime);
	}

	if (AMPMEND != null) {
		activityModel.setActEndTime1(AMPMEND);
	}

	if (units != null && units != "") {
		activityModel.setInspUnits(units);
	} else {
		activityModel.setInspUnits(inspTypeModel.getInspUnits());
	}

	var inspectorObj = null;
	if (inspector != null) {
		inspectorObj = inspector;
		logDebug("FORCING INSPECTOR:" + inspector.getUserID());
		activityModel.setSysUser(inspector);
	}
	if (autoAssign) {

		var atm = this.AutoScheduleInspectionInfo(inspModel, inspectionDate);
		if (!atm.isSuccessful()) {
			var inspInfo = "inspSequenceNumber=[" + inspSequenceNumber + "] inspectionGroup=[" + inspectionGroup + "] " + "inspectionType=[" + inspectionType + "] inspModel=["
					+ inspModel + "] inspectionDate=[" + inspectionDate + "]";
			throw String(aa.messageResources.getLocalMessage("LINSP_Auto_Assigned_Failed") + " " + inspInfo + " " + atm.getMessage());
		}
		if (inspector != null) {
			inspectorObj = inspector;
		} else {
			inspectorObj = atm.getInspector();
		}

		activityModel.setActivityDate(atm.getScheduleDate());
	}
	if (inspectorObj != null) {
		logDebug("**Scheduling inspection [" + inspectionGroup + "].[" + inspectionType + "] for [" + inspectorObj.getUserID() + "]");
	}
	if (comment != null) {
		var commentModel = inspModel.getComment();
		commentModel.setText(comment);
	}
	var schedRes = aa.inspection.scheduleInspection(inspModel, inspectorObj);

	if (!schedRes.getSuccess()) {
		String(aa.messageResources.getLocalMessage("LINSP_Failed_To_Schedule_Inspection") + "", schedRes.getErrorMessage());
	}
	var inspection = this.getInspection(schedRes.getOutput());
	if (checklistsNames != null && checklistsNames.length > 0) {
		for ( var i in checklistsNames) {
			addGuideSheet(this.getCapID(), inspection.getInspection().getIdNumber(), String(checklistsNames[i]))
		}

		inspection = this.getInspection(schedRes.getOutput());
	}
	if (inspection) {
		if (inspection.getInspection().getInspector() != null) {
			logDebug("**INSPECTION SCHEDULED FOR[" + inspection.getInspection().getInspector().getUserID() + "]");
		}
	}
	var ret = {};
	ret.inspection = inspection;
	ret.inspector = inspectorObj;

	return ret;
}
// In case to call the method with message parameter only, call it as:
// SPSABASE.getResultSuccess(null,'Your message here');
// In case to call the method with data parameter only, call it as:
// SPSABASE.getResultSuccess(data);
// In case to call the method with data and message parameters, call it as:
// SPSABASE.getResultSuccess(data,'Your message here');
SPSABASE.getResultSuccess = function(data, msg) {
	if (data == undefined)
		data = null;// In case the parameter not passed
	if (!SPSABASE.hasValue(msg))
		msg = '';// In case of null,undefined, or blank
	return {
		"data" : data,
		success : true,
		message : msg
	};
}
SPSABASE.getResultFail = function(msg) {
	if (!SPSABASE.hasValue(msg))
		msg = '';
	return {
		"data" : null,
		success : false,
		message : msg
	};
}

SPSABASE.prototype.isValidAssistant = function(inspector) {
	var isValidAssistant = true;
	var inspections = aa.inspection.getInspections(this.capId);
	var assistant = [];
	if (!inspections.getSuccess()) {
		throw inspections.getErrorMessage()
	}
	var inspArray = inspections.getOutput();
	for (i in inspArray) {
		var currentInspection = inspArray[i].getInspection();
		if (String(inspector) == currentInspection.getActivity().getSysUser().getUserID()) {
			isValidAssistant = false;
			break;
		}
	}
	return isValidAssistant;
}

SPSABASE.getBizDomainByDescription_CACHE = {};
SPSABASE.getBizDomainByDescription = function(stdChoice, stdDesc, useCache) {
	var val = stdDesc;
	if (useCache) {
		if (SPSABASE.getBizDomainByDescription_CACHE.hasOwnProperty(stdChoice)) {
			return SPSABASE.getBizDomainByDescription_CACHE[stdChoice][stdDesc] || val;
		} else {
			SPSABASE.getBizDomainByDescription_CACHE[stdChoice] = {};
			var sqlQuery = "SELECT BIZDOMAIN_VALUE, VALUE_DESC FROM RBIZDOMAIN_VALUE WHERE BIZDOMAIN = '" + stdChoice + "' ORDER BY REC_STATUS DESC";
			var result = SPSABASE.runSQL(sqlQuery, null);
			if (result != null) {
				var data = result.toArray();
				if (data.length > 0) {
					for ( var i in data) {
						SPSABASE.getBizDomainByDescription_CACHE[stdChoice][String(data[i]["VALUE_DESC"])] = String(data[i]["BIZDOMAIN_VALUE"]);
					}
				}
			}

			return SPSABASE.getBizDomainByDescription_CACHE[stdChoice][stdDesc] || val;
		}
	} else {
		var sqlQuery = "SELECT BIZDOMAIN_VALUE FROM RBIZDOMAIN_VALUE WHERE BIZDOMAIN = '" + stdChoice + "'  AND VALUE_DESC = '" + stdDesc + "'";
		var result = SPSABASE.runSQL(sqlQuery, null);
		if (result != null) {
			var data = result.toArray();
			if (data.length > 0) {
				return data[0]['BIZDOMAIN_VALUE'];
			}
		}
	}

	return val;
}

SPSABASE.getBizDomainByDescriptionArabic = function(stdChoice, stdDesc) {
	var val = stdDesc;
	// " + stdChoice + "
	// " + stdDesc + "
	var sqlQuery = " SELECT V.BIZDOMAIN_VALUE FROM RBIZDOMAIN_VALUE V INNER JOIN RBIZDOMAIN_VALUE_I18N VI18N ON V.RES_ID = VI18N.RES_ID WHERE V.BIZDOMAIN = '" + stdChoice
			+ "'  AND VI18N.BIZDOMAIN_VALUE = N'" + stdDesc + "' AND VI18N.LANG_ID = 'ar_AE' ";
	var result = SPSABASE.runSQL(sqlQuery, null);
	if (result != null) {
		var data = result.toArray();
		if (data.length > 0) {
			return data[0]['BIZDOMAIN_VALUE'];
		}
	}
	return val;
}
SPSABASE.getBizDomainValueArabic = function(stdChoice, stdDesc) {
	var val = stdDesc;
	// " + stdChoice + "
	// " + stdDesc + "
	var sqlQuery = " SELECT VI18N.BIZDOMAIN_VALUE FROM RBIZDOMAIN_VALUE V INNER JOIN RBIZDOMAIN_VALUE_I18N VI18N ON V.RES_ID = VI18N.RES_ID WHERE V.BIZDOMAIN = '" + stdChoice
			+ "'  AND V.BIZDOMAIN_VALUE = '" + stdDesc + "' AND VI18N.LANG_ID = 'ar_AE' ";
	var result = SPSABASE.runSQL(sqlQuery, null);
	if (result != null) {
		var data = result.toArray();
		if (data.length > 0) {
			return data[0]['BIZDOMAIN_VALUE'];
		}
	}
	return val;
}

SPSABASE.getBizDomainDescByValue = function(stdChoice, stdValue) {
	var val = stdValue;
	var sqlQuery = "SELECT VALUE_DESC FROM RBIZDOMAIN_VALUE WHERE BIZDOMAIN = '" + stdChoice + "'  AND BIZDOMAIN_VALUE = N'" + stdValue + "'";
	var result = SPSABASE.runSQL(sqlQuery, null);
	if (result != null) {
		var data = result.toArray();
		if (data.length > 0) {
			return String(data[0]['VALUE_DESC']);
		}
	}
	return val;
}

SPSABASE.getBizDomainValueArabic = function(stdChoice, stdValue) {
	var val = stdValue;
	var sqlQuery = "SELECT VI18N.BIZDOMAIN_VALUE FROM RBIZDOMAIN_VALUE V INNER JOIN RBIZDOMAIN_VALUE_I18N VI18N ON V.RES_ID = VI18N.RES_ID WHERE V.BIZDOMAIN = '" + stdChoice
			+ "'  AND V.BIZDOMAIN_VALUE = N'" + stdValue + "' AND VI18N.LANG_ID = 'ar_AE'";
	var result = SPSABASE.runSQL(sqlQuery, null);
	if (result != null) {
		var data = result.toArray();
		if (data.length > 0) {
			return String(data[0]['BIZDOMAIN_VALUE']);
		}
	}
	return val;
}
SPSABASE.prototype.getEntityName = function() {
	var entityProfileId = this.getEntityProfileId();
	if (Utils.isBlankOrNull(entityProfileId)) {
		return {
			'EN' : "-",
			'AR' : "-"
		}
	}

	eval(getScriptText('INCLUDE_EPRF'));
	var entityProfile = new EPRF(entityProfileId);

	var entityNameEn = entityProfile.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.entityNameInEnglish);
	var entityNameAr = entityProfile.getASI(EPRF.ASI.entityDetails.TableName, EPRF.ASI.entityDetails.entityNameInArabic);

	return {
		'EN' : Utils.isBlankOrNull(entityNameEn) ? "-" : entityNameEn,
		'AR' : Utils.isBlankOrNull(entityNameAr) ? "-" : entityNameAr
	}
}
SPSABASE.prototype.getCity = function() {
	throw "TO BE IMPLEMENTED :: getCity";
}
SPSABASE.prototype.getCounty = function() {
	throw "TO BE IMPLEMENTED :: getCounty";
}
SPSABASE.prototype.getInspectionDistrict = function() {
	throw "TO BE IMPLEMENTED :: getInspectionDistrict";
}
SPSABASE.prototype.getState = function() {
	throw "TO BE IMPLEMENTED :: getState";
}
SPSABASE.prototype.getStreetName = function() {
	throw "TO BE IMPLEMENTED :: getStreetName";
}
SPSABASE.prototype.getXCoordinator = function() {
	throw "TO BE IMPLEMENTED :: getXCoordinator";
}
SPSABASE.prototype.getYCoordinator = function() {
	throw "TO BE IMPLEMENTED :: getYCoordinator";
}

SPSABASE.prototype.createOrUpdateAddress = function(addressModel, isNew) {
	var premiseName = this.getEntityName();

	var city = this.getCity();
	var county = this.getCounty();
	var inspectionDistrict = this.getInspectionDistrict();
	var state = this.getState();
	var streetName = this.getStreetName();
	// var postalCode = this.getASI(IVIS.ASI.address.TableName,
	// IVIS.ASI.address.postalCode);

	var xCoordinator = this.getXCoordinator();// longitude
	var yCoordinator = this.getYCoordinator();// latitude

	if (lat && long) {
		addressModel.setXCoordinator(parseFloat(xCoordinator));
		addressModel.setYCoordinator(parseFloat(yCoordinator));
	}
	if (county != "") {
		addressModel.setCity(city);
		addressModel.setCounty(county);
	}

	if (directorate != "") {
		addressModel.setInspectionDistrict(inspectionDistrict);
	}

	if (township != "") {
		addressModel.setState(state);
	}

	if (premiseName != "" && streetName != "") {
		addressModel.setStreetName(premiseName + ", " + streetName);
	} else if (premiseName != "") {
		addressModel.setStreetName(premiseName);
	} else if (streetName != "") {
		addressModel.setStreetName(streetName);
	}

	if (isNew) {
		aa.address.createAddress(addressModel);
	} else {
		aa.address.editAddress(addressModel);
	}

}

SPSABASE.validateScheduling = function(start, end, inspector) {
	// if (start.trimTime().getTime() != end.trimTime().getTime()) {
	// throw "Start and end time of inspection scheduling should be on the same
	// day";
	// }
	if (start.getTime() > end.getTime()) {
		throw aa.messageResources.getLocalMessage("VALIDATION_START_DATENTIME_SHOULD_BE_LESS_THAN_END");
	}
	var inspections = SPSABASE.getInspectionsForUser(start, inspector);
	for ( var x in inspections) {
		var inspectionModel = inspections[x]

		var scheduledDate = new Date(inspectionModel.getScheduledDate().getTime()).trimTime();
		var startTime = aa.util.parseDate(aa.util.formatDate(scheduledDate, "MM/dd/yyyy") + " " + inspectionModel.getScheduledTime2() + " " + inspectionModel.getScheduledTime());

		var endTime = aa.util.parseDate(aa.util.formatDate(scheduledDate, "MM/dd/yyyy") + " " + inspectionModel.getScheduledEndTime2() + " "
				+ inspectionModel.getScheduledEndTime());

		if ((start.getTime() >= startTime.getTime() && start.getTime() < endTime.getTime()) || (end.getTime() > startTime.getTime() && end.getTime() <= endTime.getTime())) {
			var inspector = aa.people.getSysUserByID(inspector).getOutput();
			throw aa.messageResources.getLocalMessage("VALIDATION_SCHEDULING_SAMEDATESAMEINSPECTOR") + " " + inspector.getFirstName() + " " + inspector.getLastName()
		}
	}
}
SPSABASE.getInspectionsForUser = function(date, inspector) {
	var res = aa.inspection.getInspections(formatDate(date, "yyyy-MM-dd"), formatDate(date, "yyyy-MM-dd"));
	if (!res.getSuccess()) {
		throw "**ERROR: retreiving inspections: " + res.getErrorMessage();
	}

	var inspections = res.getOutput();
	var result = [];
	for ( var index in inspections) {
		var insp = inspections[index];
		if (insp.getAuditStatus() != "A") {
			continue;
		}
		if (!String("Scheduled").equals(String(insp.getInspectionStatus()))) {
			continue;
		}
		if (inspector != null && !String(insp.getInspector().getUserID()).equalsIgnoreCase(inspector.toUpperCase())) {
			continue;
		}
		result.push(insp.getInspection());
	}
	return result;
}
/**
 * TODO: Refactor
 * 
 * @param vocational
 * @param source
 * @param scheduleDate
 * @param multiVisitValidationPeriod
 */
SPSABASE.validateVisitsWithinRange = function(vocational, source, scheduleDate, multiVisitValidationPeriod) {
	var query = " SELECT PER.B1_ALT_ID,I.G6_ACT_DD ,asi.B1_CHECKLIST_COMMENT AS 'Directorate',*";
	query += " FROM B1PERMIT PER";
	query += " INNER JOIN G6ACTION I on I.SERV_PROV_CODE=PER.SERV_PROV_CODE and  I.B1_PER_ID1=PER.B1_PER_ID1 and I.B1_PER_ID2=PER.B1_PER_ID2 and I.B1_PER_ID3=PER.B1_PER_ID3";
	query += " INNER JOIN BCHCKBOX asi ON asi.SERV_PROV_CODE = PER.SERV_PROV_CODE AND asi.B1_PER_ID1 = PER.B1_PER_ID1  AND asi.B1_PER_ID2 = PER.B1_PER_ID2 AND asi.B1_PER_ID3 = PER.B1_PER_ID3";
	query += " WHERE PER.SERV_PROV_CODE=?";
	query += " AND PER.REC_STATUS='A'";
	query += " AND PER.B1_PER_GROUP = 'Inspection'";
	query += " AND PER.B1_PER_TYPE = 'General'";
	query += " AND PER.B1_PER_SUB_TYPE= 'Inspection Visit'";
	query += " AND PER.B1_PER_CATEGORY= 'IVIS'";
	query += " AND asi.B1_CHECKBOX_TYPE= 'ADDRESS'";
	query += " AND asi.B1_CHECKBOX_DESC= 'Directorate'";
	query += " AND I.G6_ACT_TYP IN ('Routine','Follow Up','Complaint')";
	query += " AND UPPER(dbo.FN_GET_APP_SPEC_INFO(PER.SERV_PROV_CODE, PER.B1_PER_ID1, PER.B1_PER_ID2, PER.B1_PER_ID3, 'Vocational License Number')) like UPPER(?)  ";
	query += " AND UPPER(dbo.FN_GET_APP_SPEC_INFO(PER.SERV_PROV_CODE, PER.B1_PER_ID1, PER.B1_PER_ID2, PER.B1_PER_ID3, 'Source')) like UPPER(?)  ";
	query += " AND (I.G6_ACT_DD >= DATEADD(DAY,?,?) AND I.G6_ACT_DD <= DATEADD(DAY,?,?))";
	var inspections = new DAO().execSimpleQuery(query, [ aa.getServiceProviderCode(), vocational, source, multiVisitValidationPeriod * -1, scheduleDate.toString("yyyy-MM-dd"),
			multiVisitValidationPeriod, scheduleDate.toString("yyyy-MM-dd") ]);

	if (inspections && inspections.length > 0) {
		var directorate = inspections[0]["directorate"] + "";
		var visitAltId = inspections[0]["B1_ALT_ID"] + "";
		var inspType = inspections[0]["G6_ACT_TYP"] + "";
		var inspDate = inspections[0]["G6_ACT_DD"] + "";
		var headOfSectionEmail = "";
		var department = Record.getLookupVal("DIRECTORATES", directorate);
		var HOS = department.toString().replace("INSP", "NA");
		var userModel = aa.people.getSysUserListByDepartmentName(HOS).getOutput();

		for (u in userModel) {
			headOfSectionEmail = userModel[u].getEmail();
			break;
		}
		var message = String.format(Record.translate("IVIS_Warning_Visit_Within_Range") + "", multiVisitValidationPeriod, vocational, inspType, inspDate, visitAltId);
		logDebug(message);
		if (headOfSectionEmail) {
			var params = {
				'$$StartDate$$' : scheduleDate,
				'$$EndDate$$' : multiVisitValidationPeriod,
				'$$OverlapingDetails$$' : message
			};
			// send notifications
			this.sendNotification(headOfSectionEmail, params, IVIS.CONSTANTS.NOTIFICATION_TEMPLATE.HEAD_OF_SECTION_NOTIFICATION);
		}
	}
}
/**
 * TODO: Refactor TO SPSA
 * 
 * @param vocational
 * @param source
 * @param fromDate
 * @param toDate
 * @param isPrimary
 * @returns {Array}
 */
SPSABASE.getOverlap = function(vocational, source, fromDate, toDate, isPrimary) {
	var sql = "SELECT I.G6_ACT_NUM as 'INSPID',PER.B1_ALT_ID as 'ALT_ID'";

	sql += " FROM G6ACTION I ";
	sql += " INNER JOIN B1PERMIT PER on I.SERV_PROV_CODE=PER.SERV_PROV_CODE and  I.B1_PER_ID1=PER.B1_PER_ID1 and I.B1_PER_ID2=PER.B1_PER_ID2 and I.B1_PER_ID3=PER.B1_PER_ID3";

	sql += " WHERE PER.SERV_PROV_CODE=?";
	sql += " AND PER.B1_PER_GROUP = 'Inspection'";
	sql += " AND PER.B1_PER_TYPE = 'General'";
	sql += " AND PER.B1_PER_SUB_TYPE= 'Inspection Visit'";
	sql += " AND PER.B1_PER_CATEGORY= 'IVIS'";
	sql += " AND PER.REC_STATUS='A'";

	sql += " AND I.G6_STATUS = 'Scheduled'";
	sql += " AND I.REC_STATUS = 'A'";
	sql += " AND I.G6_VEHICLE_NUM = ?";
	sql += " AND UPPER(dbo.FN_GET_APP_SPEC_INFO(PER.SERV_PROV_CODE, PER.B1_PER_ID1, PER.B1_PER_ID2, PER.B1_PER_ID3, 'Vocational License Number')) like UPPER(?)";
	sql += " AND UPPER(dbo.FN_GET_APP_SPEC_INFO(PER.SERV_PROV_CODE, PER.B1_PER_ID1, PER.B1_PER_ID2, PER.B1_PER_ID3, 'Source')) like UPPER(?) ";
	sql += " AND (I.G6_ACT_DD >= Cast('" + fromDate.toString("yyyy-MM-dd HH:mm:ss") + "' as datetime)";
	sql += " AND I.G6_ACT_DD <= Cast('" + toDate.toString("yyyy-MM-dd HH:mm:ss") + "' as datetime))";

	var inspections = new DAO().execSimpleQuery(sql, [ aa.getServiceProviderCode(), isPrimary, vocational, source ]);
	var ret = [];
	for ( var x in inspections) {
		var rec = new Record(inspections[x]["ALT_ID"])
		var inspID = parseInt(inspections[x]["INSPID"], 10);
		var inspection = rec.getInspection(inspID)

		ret.push(inspection);
	}

	return ret;
}
SPSABASE.getInspectionTypes = function() {
	var inspTypesLabels = {};
	var lang = com.accela.i18n.I18NContext.getI18NModel().getLanguage();
	// TODO: review the function to get value english when language is English
	lang = "ar_AE";
	// if (lang == "ar_AE") {
	var inspRs = new DAO().execSimpleQuery("select INSP_TYPE,INSP_TYPE_V from RINSPTYP_VIEW_AR_AE where LANG_ID_V=? AND INSP_CODE IN ('CORP','IIRP','INSR','IRRP','RUAC','INSP') ", [ lang ]);
	for ( var x in inspRs) {
		var r = inspRs[x];
		var tr = r["INSP_TYPE_V"];
		var key = r["INSP_TYPE"];
		if (tr == null || tr == "") {
			tr = key
		}
		inspTypesLabels[key] = tr;
	}
	// }
	return inspTypesLabels;
}
SPSABASE.getScheduledEndDate = function(inspModel) {
	var scheduledDate = SPSABASE.getScheduledDate(inspModel);
	var dt = aa.util.parseDate(aa.util.formatDate(scheduledDate, "MM/dd/yyyy") + " " + inspModel.getScheduledEndTime2() + " " + inspModel.getScheduledEndTime());
	return new Date(dt.getTime());
}
SPSABASE.getScheduledDate = function(inspModel) {
	return new Date(inspModel.getScheduledDate().getTime());
}
SPSABASE.prototype.getInspectionScheduleInfo = function() {
	var result = {};
	result.inspectionGroup = this.getInspectionGroup();
	result.inspectionTypes = this.getInspectionGroup();
	result.workingStartTime = this.getWorkingStartTime();
	result.workingEndTime = this.getWorkingEndTime();
	result.taskDuration = this.getTaskDuration();
	return result;
}
SPSABASE.prototype.getInspectionGroup = function() {
	var capTypeDeatilModel = aa.cap.getCapTypeDetailByPK(this.getCapType()).getOutput();
	return capTypeDeatilModel.getInspectionCode();
}
SPSABASE.prototype.getWorkingStartTime = function() {
	return this.settings.getASI(SPSAGS.ASI.inspectionConfiguration.TableName, SPSAGS.ASI.inspectionConfiguration.startTime);
}
SPSABASE.prototype.getWorkingEndTime = function() {
	return this.settings.getASI(SPSAGS.ASI.inspectionConfiguration.TableName, SPSAGS.ASI.inspectionConfiguration.endTime);
}
SPSABASE.prototype.getTaskDuration = function() {
	return this.settings.getASI(SPSAGS.ASI.inspectionConfiguration.TableName, SPSAGS.ASI.inspectionConfiguration.taskDuration);
}

SPSABASE.prototype.handleRepetitiveFindings = function() {
//	var numberOfVisits = this.settings.getASI(SPSAGS.ASI.inspectionConfiguration.TableName, SPSAGS.ASI.inspectionConfiguration.numberOfPreviousVisitsForFindings);
//
//	var sqlproc = " [dbo].[SET_NO_REPETITIVE_FINDINGS_ITEM_ASI] '" + this.getCustomID() + "', " + numberOfVisits;
//
//	var inspections = new DAO().execSimpleQuery(sqlproc, []);
}
SPSABASE.prototype.prepareChecklists = function() {

	var gGuideSheetItemDAO = Record.getDao("com.accela.aa.inspection.guidesheet.GGuideSheetItemDAO");

	var checklistRows = this.getASIT('CHECKLISTS');
	var checklistNames = [];
	for ( var i in checklistRows) {
		var checklistName = String(checklistRows[i]['Checklist Name']);
		var checklistNameAr = String(checklistRows[i]['Checklist Name Ar']);
		var checklistRequired = String(checklistRows[i]['Checklist Required']);
		var __FOUND = -1;
		for (var i = 0; i < checklistNames.length; i++) {
			if (checklistNames[i].Name == checklistName) {
				__FOUND = i;
				break;
			}
		}
		if (__FOUND < 0) {
			var checklist = [];
			checklist['Name'] = checklistName;
			checklist['NameAr'] = checklistNameAr;
			checklist['Required'] = checklistRequired;
			checklistNames.push(checklist);
		}
	}
	var assistants = this.getAssistantInspection();
	var primary = this.getPrimaryInspection();
	for ( var j in checklistNames) {
		var checklistName = String(checklistNames[j]['Name']);
		var isChecklistRequired = String(checklistNames[j]['Required']) == 'Yes' ? 'Y' : 'N';
		var items = [];
		for ( var k in checklistRows) {
			if (checklistRows[k]['Checklist Name'] == checklistName) {
				var comment = '';
				if(Utils.isBlankOrNull(comment)){
					comment = String(checklistRows[k]['Comments']);
				}
				
				var systemReq = '';
				var legalClauseId = checklistRows[k]['Legal Clause'];
				if (!Utils.isBlankOrNull(legalClauseId)) {
					var legalClauses = String(checklistRows[k]['Legal Clause']).split(',');
					for (var l = 0; l < legalClauses.length; l++) {
						if (l > 0) {
							systemReq += '\n\n';
						}

						eval(getScriptText('INCLUDE_SPSAGS'));
						var settings = SPSAGS.getInstance();
						var legalClauseASIT = settings.getASIT('SYSTEM REQUIREMENTS');
						for ( var i in legalClauseASIT) {
							var docId = String(legalClauseASIT[i]['Doc ID']);
							if (String(docId) == String(legalClauses[l])) {
								systemReq += String(legalClauseASIT[i]['Doc ID']) + ' - ' + String(legalClauseASIT[i]['Doc Name']) + ' \n'
								+ String(legalClauseASIT[i]['Description in English']) + ' - ' + String(legalClauseASIT[i]['Description in Arabic']);
								comment = '';
								if(Utils.isBlankOrNull(comment)){
									comment = String(checklistRows[k]['Comments']);
								}
							}
						}
					}
				}
				java.lang.System.out.println("checklistRows[k]['Checklist Item Required'] " + checklistRows[k]['Checklist Item Required'])
				items.push([ checklistRows[k]['Checklist Item'], checklistRows[k]['Checklist Item Status Group'], checklistRows[k]['Checklist Item Required'],
						checklistRows[k]['Checklist Item Ar'], systemReq, comment ])
			}
		}
		checklistName = String(checklistNames[j]['Name'] + (checklistNames[j]['Name'] != '' ? ' - ' + checklistNames[j]['NameAr'] : ''));
		var gGuideSheetSeqNumber = this.createGGuidesheet(checklistName, isChecklistRequired, primary.getIdNumber());
		if (gGuideSheetSeqNumber > 0) {
			this.createGGuidesheetItems(checklistName, items, gGuideSheetSeqNumber);
		}
		for ( var a in assistants) {
			var gGuideSheetSeqNbr = this.createGGuidesheet(checklistName, isChecklistRequired, assistants[a].getIdNumber());
			if (gGuideSheetSeqNbr > 0) {
				this.createGGuidesheetItems(checklistName, items, gGuideSheetSeqNbr);
			}
		}
	}

	// Repetitive Findings
	this.handleRepetitiveFindings();

}

SPSABASE.prototype.createGGuidesheet = function(checklistName, isRequired, inspectionId) {
	var gGuideSheetDAO = Record.getDao("com.accela.aa.inspection.guidesheet.GGuideSheetDAO");

	java.lang.System.out.println("gGuideSheetModel.setIsRequired(isRequired); " + isRequired)
	var gGuideSheetModel = new com.accela.aa.inspection.guidesheet.GGuideSheetModel();
	gGuideSheetModel.setServiceProviderCode(aa.getServiceProviderCode());
	gGuideSheetModel.setCapID(this.getCapID());
	gGuideSheetModel.setActivityNumber(inspectionId);
	gGuideSheetModel.setGuideType(checklistName);
	// gGuideSheetModel.setGuidesheetSeqNbr();
	gGuideSheetModel.setAuditDate(aa.util.now());
	gGuideSheetModel.setAuditID(aa.getAuditID());
	gGuideSheetModel.setAuditStatus("A");
	// gGuideSheetModel.setGuideStatus();
	// gGuideSheetModel.setGuideDesc();
	gGuideSheetModel.setIsRequired(isRequired);
	// gGuideSheetModel.setGuideGroup();
	// gGuideSheetModel.setDisplayOrder();
	gGuideSheetModel.setEntityType("INSPECTION")

	var gGuideSheetSeqNumber = gGuideSheetDAO.addGGuideSheet(gGuideSheetModel, aa.getAuditID());
	return gGuideSheetSeqNumber;
}

SPSABASE.prototype.isSalama = function(){
	var isSalama = false;
	var capType = aa.cap.getCapTypeModelByCapID(this.capId).getOutput();
	if(capType && capType.getGroup() == "SALAMA"){
		isSalama = true;
	}
	return isSalama;
}

SPSABASE.prototype.createGGuidesheetItems = function(checklistName, checklist, gGuideSheetSeqNumber) {
	var gGuideSheetItemDAO = Record.getDao("com.accela.aa.inspection.guidesheet.GGuideSheetItemDAO");
	var seqService = aa.proxyInvoker.newInstance("com.accela.sequence.SequenceGeneratorBusiness").getOutput();
	var temASIDAO = Record.getDao("com.accela.aa.inspection.guidesheet.GGSItemASIDAO");

	var itemList = aa.util.newArrayList();
	var valueObj = [];
	for (var l = 0; l < checklist.length; l++) {
		var itemObj = checklist[l];
		/*
		 * itemObj[0] = ['Checklist Item'] itemObj[1] = ['Checklist Item Status
		 * Group'] itemObj[2] = ['Checklist Item Required'] itemObj[3] =
		 * ['Checklist Item Ar'] itemObj[4] = ['Legal Clause'] itemObj[5] = ['Comments']
		 * 
		 */
		if (!itemObj[0]) {
			continue;
		}
		
		java.lang.System.out.println("String(itemObj[2]) " + String(itemObj[2]))
		var isRequired = String(itemObj[2]) == 'Yes' ? 'Y' : 'N';
		var guideItemSeqNbr = seqService.getNextValue("RGUIDESHEET_ITEM_SEQ");

		var legalClause = {};
		legalClause['ItemSeqNbr'] = guideItemSeqNbr;
		legalClause['Legal Clause'] = String(itemObj[4]);
		valueObj.push(legalClause);
		var comment = String(itemObj[5]);
		comment = Utils.isBlankOrNull(comment) ? '-' : comment;

		var gGuideSheetItemModel = new com.accela.aa.inspection.guidesheet.GGuideSheetItemModel();
		gGuideSheetItemModel.setServiceProviderCode(aa.getServiceProviderCode());
		gGuideSheetItemModel.setGuidesheetSeqNbr(gGuideSheetSeqNumber);
		gGuideSheetItemModel.setGuideItemSeqNbr(guideItemSeqNbr);
		gGuideSheetItemModel.setGuideType(checklistName);
		gGuideSheetItemModel.setGuideItemDisplayOrder((l + 1) * 1);
		gGuideSheetItemModel.setGuideItemText(itemObj[0] + (itemObj[3] != '' ? ' - ' + itemObj[3] : ''));
		gGuideSheetItemModel.setEntityType("INSPECTION");
		// if(checkListObj[LSET.ASIT.specificChecklistMapping.mandatory] ==
		// "Yes"){
		// }else{
		// gGuideSheetItemModel.setIsRequired("N");
		// }
		gGuideSheetItemModel.setGuideItemASIGroupName('CL_RPEAT');
		gGuideSheetItemModel.setGuideItemStatusGroupName(itemObj[1]);
		gGuideSheetItemModel.setGuideItemTextVisible("Y");
		gGuideSheetItemModel.setGuideItemStatusVisible("Y");
//		if (comment != '') {
			gGuideSheetItemModel.setGuideItemComment(String(comment));
//		}
		gGuideSheetItemModel.setGuideItemCommentVisible("Y");
		gGuideSheetItemModel.setGuideItemASIGroupVisible("Y");
		gGuideSheetItemModel.setMajorViolation("N");
		gGuideSheetItemModel.setIsCritical("N");
		gGuideSheetItemModel.setIsRequired(isRequired);
		gGuideSheetItemModel.setAuditDate(aa.util.now());
		gGuideSheetItemModel.setAuditID(aa.getAuditID());
		gGuideSheetItemModel.setAuditStatus("A");
		
		if(itemObj.length > 6){
			// set default status
			gGuideSheetItemModel.setGuideItemStatus(itemObj[6])
		}else{
			gGuideSheetItemModel.setGuideItemStatus("NA")
		}
		// var itemASIs =
		// this.setUpASIs(checkListObj[LSET.ASIT.specificChecklistMapping.customFieldGroup],
		// gGuideSheetSeqNumber, guideItemSeqNbr, productObj, temASIDAO);
		itemList.add(gGuideSheetItemModel);
	}
	if(!this.isSalama()){
		var existsComments = itemList.toArray().filter(function(f) {
			return f.getGuideItemText() == 'Standard Comments and Findings - الملاحظات الإضافية النموذجية'
		})
		if (existsComments.length == 0) {
			var stdCommentSeqNbr = seqService.getNextValue("RGUIDESHEET_ITEM_SEQ");
			var stdCommentItemModel = new com.accela.aa.inspection.guidesheet.GGuideSheetItemModel();
			stdCommentItemModel.setServiceProviderCode(aa.getServiceProviderCode());
			stdCommentItemModel.setGuidesheetSeqNbr(gGuideSheetSeqNumber);
			stdCommentItemModel.setGuideItemSeqNbr(stdCommentSeqNbr);
			stdCommentItemModel.setGuideType(checklistName);
			stdCommentItemModel.setGuideItemDisplayOrder((l + 1) * 1);
			stdCommentItemModel.setGuideItemText('Standard Comments and Findings - الملاحظات الإضافية النموذجية');
			stdCommentItemModel.setEntityType("INSPECTION");
			stdCommentItemModel.setGuideItemASIGroupName('CL_RPEAT');
			stdCommentItemModel.setGuideItemStatusGroupName('YES_NO');
			stdCommentItemModel.setGuideItemTextVisible("Y");
			stdCommentItemModel.setGuideItemStatusVisible("Y");
			stdCommentItemModel.setGuideItemCommentVisible("Y");
			stdCommentItemModel.setGuideItemASIGroupVisible("Y");
			stdCommentItemModel.setMajorViolation("N");
			stdCommentItemModel.setIsCritical("N");
			stdCommentItemModel.setIsRequired("N");
			stdCommentItemModel.setAuditDate(aa.util.now());
			stdCommentItemModel.setAuditID(aa.getAuditID());
			stdCommentItemModel.setAuditStatus("A");
			stdCommentItemModel.setGuideItemStatus('NA');
			// var itemASIs =
			// this.setUpASIs(checkListObj[LSET.ASIT.specificChecklistMapping.customFieldGroup],
			// gGuideSheetSeqNumber, guideItemSeqNbr, productObj, temASIDAO);
			itemList.add(stdCommentItemModel);
		}
		var asitCommentSeqNbr = seqService.getNextValue("RGUIDESHEET_ITEM_SEQ");
		var asitCommentItemModel = new com.accela.aa.inspection.guidesheet.GGuideSheetItemModel();
		asitCommentItemModel.setServiceProviderCode(aa.getServiceProviderCode());
		asitCommentItemModel.setGuidesheetSeqNbr(gGuideSheetSeqNumber);
		asitCommentItemModel.setGuideItemSeqNbr(asitCommentSeqNbr);
		asitCommentItemModel.setGuideType(checklistName);
		asitCommentItemModel.setGuideItemDisplayOrder((l + 1) * 1);
		asitCommentItemModel.setGuideItemText('Standard Comments and Findings Table - جدول الملاحظات الإضافية النموذجية');
		asitCommentItemModel.setEntityType("INSPECTION");
		asitCommentItemModel.setGuideItemASIGroupName('CL_RPEAT');
		asitCommentItemModel.setGuideItemASITableGroupName('CL_FIND');
		asitCommentItemModel.setGuideItemStatusGroupName('YES_NO');
		asitCommentItemModel.setGuideItemTextVisible("Y");
		asitCommentItemModel.setGuideItemStatusVisible("Y");
		asitCommentItemModel.setGuideItemCommentVisible("Y");
		asitCommentItemModel.setGuideItemASIGroupVisible("Y");
		asitCommentItemModel.setMajorViolation("N");
		asitCommentItemModel.setIsCritical("N");
		asitCommentItemModel.setIsRequired("N");
		asitCommentItemModel.setAuditDate(aa.util.now());
		asitCommentItemModel.setAuditID(aa.getAuditID());
		asitCommentItemModel.setAuditStatus("A");
		asitCommentItemModel.setGuideItemStatus('NA');
		// var itemASIs =
		// this.setUpASIs(checkListObj[LSET.ASIT.specificChecklistMapping.customFieldGroup],
		// gGuideSheetSeqNumber, guideItemSeqNbr, productObj, temASIDAO);
		itemList.add(asitCommentItemModel);
	}
	
	try {
		gGuideSheetItemDAO.createGGuideSheetItem(gGuideSheetSeqNumber, itemList, aa.getAuditID());
		var itemASIs = this.setUpASIs('CL_RPEAT', gGuideSheetSeqNumber, valueObj, temASIDAO);

	} catch (ex) {
		logDebug(ex);
	}
}

SPSABASE.prototype.setUpASIs = function(groupCode, guidesheetSeqNbr, valueObj, temASIDAO) {
	for (var i = 0; i < valueObj.length; i++) {
		var itemSequence = valueObj[i]['ItemSeqNbr'];
		var refSubgroups = aa.appSpecificInfo.getRefASISubgroups(groupCode).getOutput();
		for (var j = 0; j < refSubgroups.length; j++) {
			var subGroupName = refSubgroups[j];
			var groupModel = new com.accela.aa.inspection.guidesheet.asi.GGSItemASISubGroupModel();
			groupModel.setServiceProviderCode(aa.getServiceProviderCode());
			groupModel.setGuidesheetSeqNbr(guidesheetSeqNbr);
			groupModel.setGuideItemSeqNbr(itemSequence);
			groupModel.setGroupCode(groupCode);
			groupModel.setSubgroupCode(subGroupName);
			groupModel.setB1GroupDspOrder(j);
			var fieldList = aa.appSpecificInfo.getRefAppSpecInfoWithFieldList(groupCode, subGroupName, "").getOutput().getFieldList();

			for (var k = 0; k < fieldList.size(); k++) {
				var refASIModel = fieldList.get(k);
				var itemASIModel = new com.accela.aa.inspection.guidesheet.asi.GGSItemASIModel();
				itemASIModel.setAsiName(refASIModel.getFieldLabel());
				itemASIModel.setAlignment(refASIModel.getAlignment());
				itemASIModel.setAttributeUnitType(refASIModel.getUnit());

				var value = valueObj[i][refASIModel.getFieldLabel()]
				if (!value || value == "undefined" || value == "null") {
					value = "";
				}
				var stringValue = value;
//				if (stringValue != '') {
//					var dataObj = JSON.parse(value);
//					if (dataObj != null) {
//						stringValue = dataObj[0]['ID'] + ':\n';
//						stringValue += dataObj[0]['commentEn'] + '\n';
//						stringValue += dataObj[0]['commentAr'];
//					}
//				}
				itemASIModel.setAttributeValue(stringValue);
				itemASIModel.setAttributeValueReqFlag(refASIModel.getRequiredFlag());
				itemASIModel.setAuditDate(refASIModel.getAuditDate());
				itemASIModel.setAuditID(refASIModel.getAuditID());
				itemASIModel.setAuditStatus(refASIModel.getAuditStatus());
				itemASIModel.setChecklistComment(refASIModel.getResDefaultValue());
				itemASIModel.setDisplayLength(refASIModel.getDisplayLength());
				itemASIModel.setDisplayOrder(refASIModel.getDisplayOrder());
				itemASIModel.setMaxLength(refASIModel.getMaxLength());
				itemASIModel.setSupervisorEditOnly(refASIModel.isSupervisorEditOnly());

				var checkBoxInd = refASIModel.getFieldType() + "";
				if (!checkBoxInd) {
					checkBoxInd = "1";
				}
				itemASIModel.setCheckBoxInd(checkBoxInd);
				temASIDAO.updateGGSItemASI(itemASIModel, groupModel, aa.getAuditID());
			}
		}
	}
}

SPSABASE.prototype.attachSubProcess = function(taskName,wfStatus,subProcessCode) {
	var activatedTask = '';
//	var subProcessCode;
//	if(this.getCapType() == 'OSHJ/Classification/Entity Registration/ERCL' || this.getCapType() == 'OSHJ/Profile/Update Entity Profile/UEPR'){
//		subProcessCode = 'BUAL';
//		insertSubProcess(taskName,subProcessCode , true);
//	} else {
//		subProcessCode = 'BUAL_REPORTS';
//		insertSubProcess(taskName,subProcessCode , true);
//	}
	
	insertSubProcess(taskName,subProcessCode , true, this.getCapID());
	var currentUser = aa.people.getSysUserByID(aa.getAuditID()).getOutput();
	var agency = currentUser.getAgencyCode();
	var bureau = currentUser.getBureauCode();
	var division = currentUser.getDivisionCode();
	var section = currentUser.getSectionCode();
	var group = currentUser.getGroupCode();
	var office = currentUser.getOfficeCode();
	var userDept = currentUser.getDeptOfUser();

	var skipFirstTask = false;
	if (group == "HOS" && office == "NA") {
		skipFirstTask = true;
	}

	if(wfStatus == 'Escalate to Manager'){
		skipFirstTask = true;
		updateSubProcessTask("Deputy Manager Review", wfStatus, "System Update", "", subProcessCode);
	}
	
	if (skipFirstTask) {
		updateSubProcessTask("Section Head Review", wfStatus, "System Update", "", subProcessCode);
		if(wfStatus == 'Escalate to Manager'){
			activateTask("Manager Review", subProcessCode);
			activatedTask = "Manager Review";
		} else{
			activateTask("Deputy Manager Review", subProcessCode);
			activatedTask = "Deputy Manager Review";
		}
	} else {
		var separator = "/";
		var NA = "NA";
		var agency = currentUser.getAgencyCode();
		var bureau = currentUser.getBureauCode();
		var division = currentUser.getDivisionCode();
		var section = currentUser.getSectionCode();
		var group = currentUser.getGroupCode();
		var office = currentUser.getOfficeCode();

		var department = aa.getServiceProviderCode() + separator + agency + separator + bureau + separator + division + separator + section + separator + group + separator + NA;
//		this.createCapComment("userDept =="+userDept);
		if(userDept == 'SPSA/NA/NA/NA/NA/NA/NA' || office != 'NA'){
			if(subProcessCode == 'BUAL' || subProcessCode == 'BUAL_INSPECTION' ){
				if(userDept == 'SPSA/NA/NA/NA/NA/NA/NA'){
					department = 'SPSA/NA/NA/NA/NA/NA/NA';
				} else {
					department = aa.getServiceProviderCode() + separator + agency + separator + bureau + separator + division + separator + section + separator + group + separator + NA;	
				}
				
				updateTaskDepartment("Section Head Review", department, subProcessCode)
				activateTask("Section Head Review", subProcessCode);
				activatedTask = "Section Head Review";
			} else {
				activateTask("Deputy Manager Review", subProcessCode);
				activatedTask = "Deputy Manager Review";
			}
		} else {
			if(section != 'NA'){
				department = aa.getServiceProviderCode() + separator + agency + separator + bureau + separator + division + separator + NA + separator + group + separator + NA;

				activateTask("Manager Review", subProcessCode);
				activatedTask = "Manager Review";
			} else if(division != 'NA'){
				department = aa.getServiceProviderCode() + separator + agency + separator + bureau + separator + NA + separator + NA + separator + group + separator + NA;

				activateTask("SPSA Manager Review", subProcessCode);
				activatedTask = "SPSA Manager Review";
			} else if(bureau != 'NA'){
				department = aa.getServiceProviderCode() + separator + agency + separator + NA + separator + NA + separator + NA + separator + group + separator + NA;
				
				activateTask("SPSA Chairman Review", subProcessCode);
				activatedTask = "SPSA Chairman Review";
			}
		}
		
	}

	this.handleAutoClaim();
	
	return activatedTask;
}
SPSABASE.prototype.handleSubProcessSendBack = function(taskName,wfStatus,taskToActivate) {
	if(wfStatus == 'Send Back'){
		if(this.getCapType() == "OSHJ/Classification/Entity Registration/ERCL"){
			if(taskName == "Section Head Review"){
				activateTask("Verify application Data", "ERCL");

				this.updateTaskAndHandleDisposition("Approval Levels", "Send Back", "");
			}
		} else if(this.getCapType() == "OSHJ/Profile/Update Entity Profile/UEPR"){
			if(taskName == "Section Head Review"){
				activateTask("Review the Profile Update", "UEPR");

				this.updateTaskAndHandleDisposition("Escalation and Approval", "Send Back", "");
			}
		} else {
			this.deactivateTask(taskName);
			
			var processCode = aa.workflow.getProcessRelationByCapID(this.getCapID(),null).getOutput()[0].getProcessCode();
			this.updateTaskAndHandleDisposition("Approval Levels", "Send Back", "");
			if(Utils.isBlankOrNull(taskToActivate))
			{
				taskToActivate = "Section Head Review";
			}
			activateTask(taskToActivate, processCode);
		}
	}
}

function updateSubProcessTask(wfstr, wfstat, wfcomment, wfnote) // optional
// process name,
// cap id
{
	var useProcess = false;
	var processName = "";
	if (arguments.length > 4) {
		if (arguments[4] != "") {
			processName = arguments[4]; // subprocess
			useProcess = true;
		}
	}
	var itemCap = capId;
	if (arguments.length == 6)
		itemCap = arguments[5]; // use cap ID specified in args

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		// logMessage("**ERROR: Failed to get workflow object: " +
		// workflowResult.getErrorMessage());
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
			// java.lang.System.out.println(stepnumber)
			// java.lang.System.out.println(processID)
			//
			// java.lang.System.out.println(itemCap)
			// java.lang.System.out.println(wfstat)
			if (useProcess)
				updateResult = aa.workflow.handleDisposition(itemCap, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");
			else
				updateResult = aa.workflow.handleDisposition(itemCap, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");

			if (!updateResult.getSuccess()) {
				throw "Error while updating workflow " + updateResult.getErrorMessage();
			}

			// logMessage("Updating Workflow Task " + wfstr + " with status " +
			// wfstat);
			// logDebug("Updating Workflow Task " + wfstr + " with status " +
			// wfstat);
		}
	}
}

SPSABASE.prototype.validateWorkflowTaskUpdateBefore = function(wfTask, wfStatus,wfProcess) {
	var retVal = "";

	java.lang.System.out.println("IRRP Log " + wfStatus + " " + wfTask + " " + AInfo["Updated.Decision"]);
	if (wfTask == "Review Request(and/or Prepare Checklist)" && wfStatus == "Action Required") {
		var checklists = this.getASIT('CHECKLISTS');
		if (checklists.length == 0) {
			retVal = aa.messageResources.getLocalMessage("VALIDATION_YOU_NEED_TO_FILL_CHECKLIST")
		}
	} else if (wfTask == "Review/Update the Checklist - Appoint Inspector(s)" && wfStatus == "Assign") {
		var checklists = this.getASIT('CHECKLISTS');
		if (checklists.length == 0) {
			retVal = aa.messageResources.getLocalMessage("VALIDATION_YOU_NEED_TO_FILL_CHECKLIST")
		} else  {
			var inspections = aa.inspection.getInspections(this.getCapID()).getOutput();
			if (inspections.length == 0) {
				retVal = aa.messageResources.getLocalMessage("VALIDATION_YOU_NEED_TO_SCHEDULE_INSPECTION")
			}
		}
	} else if (wfTask == 'Conduct Inspection') {
		if (wfStatus == "Complete") {
			var primary = this.getPrimaryInspection();
			var isComplete = true;
			if (primary && primary.getInspectionStatus() == 'Scheduled') {
				isComplete = false;
			}
			var assistantInspections = this.getAssistantInspection();
			if (assistantInspections.length > 0) {
				for ( var i in assistantInspections) {
					if (assistantInspections[i].getInspectionStatus() == 'Scheduled') {
						isComplete = false;
						break;
					}
				}
			}
			if (!isComplete) {
				retVal = aa.messageResources.getLocalMessage("VALIDATION_YOU_NEED_TO_FINISH_ALL_INSPECTIONS_BEFORE_SUBMIT")
			}
		}
		if (wfStatus == "Reject") {
			retVal = aa.messageResources.getLocalMessage("VALIDATION_YOU_NEED_TO_REJECT_INSPECTION_FROM_DASHBOARD")
		}
	} else if (wfTask == "Review Report" || wfProcess == "BUAL_REPORTS") {
			/*
			 * SPSA-252: To be decided during UAT
			 */
			// if (wfStatus == "Escalate") {
			// if(Utils.isBlankOrNull(String(AInfo["Updated.Decision"]))){
			// retVal =
			// aa.messageResources.getLocalMessage("VALIDATION_FILL_DECISION")
			// }
			// }
			if (AInfo["Updated.Decision"] == "Fines") {
				var checkFees = true;
				var parentId = this.getASI("", "Entity Profile ID");
				if (!Utils.isBlankOrNull(parentId)) {

					parentId = aa.cap.getCapID(parentId).getOutput();

					if (parentId != null) {
						var parentRecord = new EPRF(parentId);
						var entityType = parentRecord.getASI(EPRF.ASI.requestDetails.TableName, EPRF.ASI.requestDetails.organizationType);
						if (entityType == "Government") {
							retVal = aa.messageResources.getLocalMessage("VALIDATION_FINES_GOVERNMENT");
							checkFees = false;
						}
					}
				}

				java.lang.System.out.println("IRRP Log " + checkFees + " " + AInfo["Updated.Decision"]);
				if (checkFees) {
					var fees = this.getFeeItems();
					if (fees == null || fees.length == 0) {
						retVal = aa.messageResources.getLocalMessage("VALIDATION_AT_LEAST_ONE_FINE_ITEM")
					}
				}
			}
		} else if(wfTask == 'Review Reschedule Request' && wfStatus == "Approve"){
			retVal = aa.messageResources.getLocalMessage("VALIDATION_YOU_NEED_TO_RESCHEDULE_INSPECTION")
		}
//	}

	return retVal;
}
SPSABASE.prototype.validateEscalateUser = function(wfTask, wfStatus,wfProcess) {
	var retVal = '';
	if (wfStatus == 'Escalate') {
		var currentUser = aa.people.getSysUserByID(aa.getAuditID()).getOutput();
		var userDept = currentUser.getDeptOfUser();
		
		if(userDept == aa.getServiceProviderCode() + '/CHR/NA/NA/NA/NA/NA'){
			retVal = String(aa.messageResources.getLocalMessage("VALIDATION_AT_CHAIRMAN_CANNOT_ESCALATE"));
		}
	}

	return retVal;
}
SPSABASE.prototype.prepareCloseoutItems = function() {
	var lang = com.accela.i18n.I18NContext.getI18NModel().getLanguage();
	java.lang.System.out.println("SHABIB - lang: " + lang)

	var clientType = com.accela.i18n.I18NContext.getI18NModel().getClientType();
	java.lang.System.out.println("SHABIB - clientType: " + clientType)

	com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
	com.accela.i18n.I18NContext.getI18NModel().setClientType('CLASSIC');
	var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());

	var primary = this.getPrimaryInspection();
	//if (primary.getInspectionStatus() == 'Failed') {

	var recordSelectId = '';
	var checkListItemColumnName = 'Checklist Item';
	if (this.getCapType() == "OSHJ/Reporting/Close-Out Reporting/CORP") {
		checkListItemColumnName = "Close-Out Point";

		var table = this.getASIT('CLOSE OUT RECORDS DETAILS');

		for ( var y in table) {
			if (table[y]['Select'] == "CHECKED") {
				recordSelectId = table[y]['Record ID'];
			}
		}
	}

	var isDefaultCloseOutTiming = false;
	var defaultCloseOut = 0;
	if (this.getCapType() == "OSHJ/Inspection/Inspection Record/INSR") {
		var programID = this.getASI('INSPECTION DETAILS', 'Program ID');

		eval(getScriptText('INCLUDE_INSP'));
		var program = new INSP(programID);
		var closeOutType = program.getASI('CLOSE OUT SETTINGS', 'Close Out Time');
		if (closeOutType == 'Use Default Close-Out for this Program') {
			isDefaultCloseOutTiming = true;
			defaultCloseOut = program.getASI('CLOSE OUT SETTINGS', 'Default Close out Timing for all Checklist items (Days)');
		} else {
			defaultCloseOut = program.getASI('CLOSE OUT SETTINGS', 'Default Close Out Timing For Custom Item (Days)');
		}
	}

	this.deleteASIT('CLOSE OUT ITEMS');

	var closeOutItems = [];
	var failedItem = [];

	var projectId = this.getProjctProfileId();
	var projectName = this.getProjectName();

	var checklistsASIT = this.getASIT('CHECKLISTS');
	var checklists = primary.getGuideSheets().toArray();
	for ( var i in checklists) {
		var dispGuideType = checklists[i].getDispGuideType();
		var items = checklists[i].getItems().toArray();
		for ( var j in items) {
			var item = items[j];
			failedItem = [];
			if (item.getGuideItemStatus()
					&& (item.getGuideItemStatus().equalsIgnoreCase('No') || item.getGuideItemStatus().equalsIgnoreCase('Failed') || item.getGuideItemStatus().equalsIgnoreCase(
							'Not Comply'))) {
				var itemText = item.getGuideItemText();
				var coments = item.getGuideItemComment();
				var itemTextRes = item.getResGuideItemText();
				var enItemText = '';
				var arItemText = '';
				if (String(itemText).indexOf('-') > 0) {
					var textSplit = itemText.split('-');
					enItemText = textSplit[0].trim();
					if (textSplit.length > 1) {

						arItemText = textSplit[1].trim();
					}
				}

				var checklistText = item.getGuideType();
				var checklistTextRes = dispGuideType;
				var enChecklistText = '';
				var arChecklistText = '';
				if (String(checklistText).indexOf('-') > 0) {
					var textCLSplit = checklistText.split('-');
					enChecklistText = textCLSplit[0].trim();
					if (textCLSplit.length > 1) {
						arChecklistText = textCLSplit[1].trim();
					}
				}
				if (enItemText == 'Standard Comments and Findings Table') {
					if (item.getItemASITableSubgroupList().size() > 0) {
						var asiTSubgroups = item.getItemASITableSubgroupList().toArray();
						for ( var k in asiTSubgroups) {
							var asiSubGroup = asiTSubgroups[k];
							if (String(asiSubGroup.getTableName()).equalsIgnoreCase('FINDINGS') && asiSubGroup.getColumnList().size() > 0) {
								var findings = [];
								var findingObject = {};
								var itemsMap = asiSubGroup.getColumnList().toArray()[0].getValueMap();
								var statusMap = asiSubGroup.getColumnList().toArray()[1].getValueMap();
								var iItem = itemsMap.entrySet().iterator();
								var iStatus = statusMap.entrySet().iterator();
								while (iStatus.hasNext()) {
									var col = iItem.next().getValue();

									var colStatus = iStatus.next().getValue();
									var status = String(colStatus.getAttributeValue());
									if (status == "No" || status == "Not Comply" || status == "Failed") {
										findingObject = {};
										findingObject.Item = String(col.getAttributeValue());
										findingObject.Status = String('ITEM_FINDING');

										findings.push(findingObject);
									}
								}
								//									var statusMap = asiSubGroup.getColumnList().toArray()[1].getValueMap();
								//									var iStatus = statusMap.entrySet().iterator();
								//									var index = 0;
								//									while (iStatus.hasNext()) {
								//										var col = iStatus.next().getValue();
								//										findings[index].Status = String(col.getAttributeValue());
								//										index++;
								//									}
							}
							for ( var l in findings) {
								if(Utils.isBlankOrNull(findings[l].Item)){
									continue;
								}
								failedItem = [];
								failedItem['Request ID'] = this.getCustomID();
								failedItem[checkListItemColumnName] = findings[l].Item;
								failedItem[checkListItemColumnName + ' Ar'] = findings[l].Item;
								failedItem['Checklist Item Status Group'] = findings[l].Status;
								failedItem['Checklist Name'] = enChecklistText != '' ? enChecklistText : item.getGuideType();
								failedItem['Checklist Name Ar'] = arChecklistText != '' ? arChecklistText : dispGuideType;
								failedItem['Comments'] = !Utils.isBlankOrNull(item.getGuideItemComment()) ? item.getGuideItemComment() : enItemText;
								failedItem['Project ID'] = projectId;
								failedItem['Project Name'] = projectName;

								var dueDate = '';
								if (this.getCapType() == "OSHJ/Inspection/Inspection Record/INSR") {
									var newDate = addDays(new Date(), defaultCloseOut)
									dueDate = Utils.formatDate(newDate, "MM/dd/yyyy");
								} else {
									if (item.getItemASISubgroupList().size() > 0) {
										var asiSubgroups = item.getItemASISubgroupList().toArray();
										for ( var k in asiSubgroups) {
											var asiSubGroup = asiSubgroups[k];
											if (String(asiSubGroup.getSubgroupCode()).equalsIgnoreCase('CLOSE-OUT') && asiSubGroup.getAsiList().size() > 0) {
												var asiList = asiSubGroup.getAsiList().toArray();
												for ( var l in asiList) {
													var asi = asiList[l];
													if (asi && String(asi.getAsiName()).equalsIgnoreCase('Due Date') && !Utils.isBlankOrNull(asi.getAttributeValue())) {
														dueDate = String(asi.getAttributeValue());
														break;
													}
												}
											}
										}
									}
								}

								failedItem['Due Date'] = dueDate;
								closeOutItems.push(failedItem);
							}
						}
					}
				} else if (enItemText == 'Standard Comments and Findings') {
					if(Utils.isBlankOrNull(coments)){
						continue;
					}
					var requestId = this.getCustomID();
					failedItem['Request ID'] = requestId;
					failedItem[checkListItemColumnName] = coments && coments != "" ? coments : enItemText;
					failedItem[checkListItemColumnName + ' Ar'] = coments && coments != "" ? coments : enItemText;
					failedItem['Checklist Item Status Group'] = item.getGuideItemStatusGroupName();
					failedItem['Checklist Name'] = enChecklistText != '' ? enChecklistText : item.getGuideType();
					failedItem['Checklist Name Ar'] = arChecklistText != '' ? arChecklistText : dispGuideType;
					failedItem['Comments'] = enItemText != '' ? enItemText : item.getGuideItemText();
					failedItem['Project ID'] = projectId;
					failedItem['Project Name'] = projectName;
					failedItem['Closed'] = isCloseOutItem;

					if (this.getCapType() == "OSHJ/Inspection/Inspection Record/INSR") {
						var newDate = addDays(new Date(), defaultCloseOut)
						dueDate = Utils.formatDate(newDate, "MM/dd/yyyy");
					}

					failedItem['Due Date'] = dueDate;
					closeOutItems.push(failedItem);
				} else {
					var requestId = this.getCustomID();
					var isCloseOutItem = 'No';
					if (this.getCapType() == "OSHJ/Reporting/Close-Out Reporting/CORP") {
						var checklists = this.getASIT('CHECKLISTS');
						for ( var c in checklists) {
							if (checklists[c]['Is Close-Out'] == "Yes" && enItemText == checklists[c]['Checklist Item'] && enChecklistText == checklists[c]['Checklist Name']) {
								requestId = recordSelectId;
								isCloseOutItem = 'Yes';
							}
						}
					}
					failedItem['Request ID'] = requestId;
					failedItem[checkListItemColumnName] = enItemText != '' ? enItemText : item.getGuideItemText();
					failedItem[checkListItemColumnName + ' Ar'] = arItemText != '' ? arItemText : item.getResGuideItemText();
					failedItem['Checklist Item Status Group'] = item.getGuideItemStatusGroupName();
					failedItem['Checklist Name'] = enChecklistText != '' ? enChecklistText : item.getGuideType();
					failedItem['Checklist Name Ar'] = arChecklistText != '' ? arChecklistText : dispGuideType;
					failedItem['Comments'] = item.getGuideItemComment();
					failedItem['Project ID'] = projectId;
					failedItem['Project Name'] = projectName;
					failedItem['Closed'] = isCloseOutItem;
					var dueDate = '';

					if (this.getCapType() == "OSHJ/Inspection/Inspection Record/INSR") {
						var obj = checklistsASIT.filter(function(item) {
							return item['Checklist Item'] == String(failedItem[checkListItemColumnName]);
						});

						if (!Utils.isBlankOrNull(obj)) {
							var closeOutTiming = !isDefaultCloseOutTiming ? obj[0]['Close-Out Timing (in Days)'] : defaultCloseOut;
							var newDate = addDays(new Date(), closeOutTiming)
							dueDate = Utils.formatDate(newDate, "MM/dd/yyyy");
						}
					} else {
						if (item.getItemASISubgroupList().size() > 0) {
							var asiSubgroups = item.getItemASISubgroupList().toArray();
							for ( var k in asiSubgroups) {
								var asiSubGroup = asiSubgroups[k];
								if (String(asiSubGroup.getSubgroupCode()).equalsIgnoreCase('CLOSE-OUT') && asiSubGroup.getAsiList().size() > 0) {
									var asiList = asiSubGroup.getAsiList().toArray();
									for ( var l in asiList) {
										var asi = asiList[l];
										if (asi && String(asi.getAsiName()).equalsIgnoreCase('Due Date') && !Utils.isBlankOrNull(asi.getAttributeValue())) {
											dueDate = String(asi.getAttributeValue());
											break;
										}
									}
								}
							}
						}
					}

					failedItem['Due Date'] = dueDate;
					closeOutItems.push(failedItem);
				}
			}

		}
	}
	this.addASITRows('CLOSE OUT ITEMS', closeOutItems);
	//}
	com.accela.i18n.I18NContext.getI18NModel().setLanguage(lang);
	com.accela.i18n.I18NContext.getI18NModel().setClientType(clientType);
}

SPSABASE.prototype.copyCloseoutToProfile = function(checkListItemColumnName) {
	var closeOutItems = this.getASIT('CLOSE OUT ITEMS',true);
	var profileCloseOut = [];

	if (Utils.isBlankOrNull(checkListItemColumnName)) {
		checkListItemColumnName = "Checklist Item";
	}
    
    var projectId = this.getProjctProfileId();
    var projectName = this.getProjectName();

	var parents = [];
	if (this.getCapType() == "OSHJ/Reporting/Investigation Report/IIRP") {
		eval(getScriptText('INCLUDE_IRRP'));
		var parentsRecord = this.getParents(IRRP.RECORD_TYPE, IRRP, "Amendment");
		
		if(parentsRecord.length == 0)
		{
			parentsRecord = this.getParents(IRRP.RECORD_TYPE, IRRP, "");
		}
		var parentRecord = parentsRecord[0];
		parents = parentRecord.getParents(EPRF.RECORD_TYPE, EPRF, "Amendment");
	} else if (this.getCapType() == "OSHJ/Inspection/Inspection Record/INSR") {
		eval(getScriptText('INCLUDE_PRPL'));
		
		var programType = this.getASI('INSPECTION DETAILS', 'Program Inspection Type');
//		if (programType == 'Entity') {
			var profileId = this.getASI('INSPECTION DETAILS', 'Entity Profile ID');
			if (!Utils.isBlankOrNull(profileId)) {
				parents.push(new EPRF(profileId));
			}
		if (programType == 'Project') {
			var profileId = this.getASI('INSPECTION DETAILS', 'Project ID');
			if (!Utils.isBlankOrNull(profileId)) {
				parents.push(new PRPL(profileId));
			}
		}
		
//		var parents = this.getParents(EPRF.RECORD_TYPE, EPRF, "Amendment");
//		if (parents.length == 0) {
//			parents = this.getParents(EPRF.RECORD_TYPE, EPRF);
//		}
//		
//		if (parents.length == 0) {
//			var parentRecord = this.getParents(PRPL.RECORD_TYPE, PRPL)[0];
//			parents = parentRecord.getParents(EPRF.RECORD_TYPE, EPRF, "");
//		}
	}else {
		parents = this.getParents(EPRF.RECORD_TYPE, EPRF, "Amendment");
		if (parents.length == 0) {
			parents.push(this.getParents(EPRF.RECORD_TYPE, EPRF));
		}
	}
	
	var parentId = this.getASI("", "Entity Profile ID");
	if(!Utils.isBlankOrNull(parentId) && Utils.isBlankOrNull(parents)){
		parents.push(new EPRF(parentId));
	}
	
	if (parents.length > 0) {
		var currentCloseOutProfile = parents[0].getASIT('CLOSE OUT ITEMS', true);
		var currentRecordsCloseOutProfile = parents[0].getASIT('CLOSE OUT RECORDS DETAILS', true);

		var currentCustomId = this.getCustomID();
		
		var earliestDueDate = "";
		var nbrItemsClosedOut = 0;
		for ( var i in closeOutItems) {
			var addItem = true;

			if (this.getCapType() == "OSHJ/Reporting/Close-Out Reporting/CORP") {
				if (String(closeOutItems[i]['Closed']) == "No" && closeOutItems[i]['Request ID'] != this.getCustomID()) {
					addItem = false;
				}
				currentCustomId = closeOutItems[i]['Request ID'];
			}

			if (addItem) {
				if (currentCloseOutProfile.length > 0) {
//					var tempList = currentCloseOutProfile.filter(function(el) {
//						return String(el["Checklist Name"]) == closeOutItems[i]['Checklist Name'] && String(el["Checklist Item"]) == closeOutItems[i][checkListItemColumnName]
//					});
//					if (tempList.length > 0) {
//						continue;
//					}
					var itemExists = false;
					for(var x=0; x <currentCloseOutProfile.length; x++ )
					{
						if(currentCloseOutProfile[x]["Request ID"] == String(currentCustomId) && String(currentCloseOutProfile[x]["Checklist Name"]) == closeOutItems[i]['Checklist Name'] && String(currentCloseOutProfile[x]["Checklist Item"]) == closeOutItems[i][checkListItemColumnName])
						{
							parents[0].updateASITColumn('CLOSE OUT ITEMS', x, "Comments", Utils.isBlankOrNull(closeOutItems[i]['Comments']) ? "" : closeOutItems[i]['Comments'])
							parents[0].updateASITColumn('CLOSE OUT ITEMS', x, "Due Date", Utils.isBlankOrNull(closeOutItems[i]['Due Date']) ? "" : closeOutItems[i]['Due Date'])
							parents[0].updateASITColumn('CLOSE OUT ITEMS', x, "Close Out Request Type", "")
							
							nbrItemsClosedOut++;
							java.lang.System.out.println(closeOutItems[i][checkListItemColumnName] + " - Due date - " + closeOutItems[i]['Due Date'])
							
							if(!Utils.isBlankOrNull(closeOutItems[i]['Due Date']))
							{
								if(earliestDueDate == "")
								{
									earliestDueDate = closeOutItems[i]['Due Date'];
								}
//								else
//								{
//									var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
//									var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());
//									var closeOutItemsdueDate = closeOutItems[i]['Due Date'];
////									closeOutItemsdueDate = dtu.format(closeOutItemsdueDate, "MM/dd/yyyy")
//									
//									var dateInput = null;
//									var isValidDate = dtu.isValidDate(earliestDueDate, "dd/MM/yyyy");
//									if (isValidDate) {
//										dateInput = dtu.parseDate(earliestDueDate, 'DD');
//									} else if (dtu.isValidDate(earliestDueDate, "MM/dd/yyyy")) {
//										dateInput = dtu.parseDate(earliestDueDate);
//									}
//									earliestDueDate = dtu.format(dateInput, "MM/dd/yyyy");
//									
//									var cDateInput = null;
//									var isValidDate = dtu.isValidDate(closeOutItemsdueDate, "dd/MM/yyyy");
//									if (isValidDate) {
//										cDateInput = dtu.parseDate(closeOutItemsdueDate, 'DD');
//									} else if (dtu.isValidDate(closeOutItemsdueDate, "MM/dd/yyyy")) {
//										cDateInput = dtu.parseDate(closeOutItemsdueDate);
//									}
//									closeOutItemsdueDate = dtu.format(cDateInput, "MM/dd/yyyy");
//									
//									var diff = du.diffDate(closeOutItemsdueDate, earliestDueDate);
//									if (diff < 0) {
//										earliestDueDate = closeOutItemsdueDate;
//									}  
//								}
							}
							itemExists = true;
							break;
						}
					}
					java.lang.System.out.println("earliestDueDate " + earliestDueDate)
					if (itemExists) {
						continue;
					}

				}
				var item = [];

				if (this.getCapType() == "OSHJ/Inspection/Inspection Record/INSR" && closeOutItems[i]['Decision'] == 'Awareness' ) {
					continue;
				}
				
				item['Request ID'] = Utils.isBlankOrNull(closeOutItems[i]['Request ID']) ? String(currentCustomId) : closeOutItems[i]['Request ID'];
				item['Checklist Name'] = Utils.isBlankOrNull(closeOutItems[i]['Checklist Name']) ? "" : closeOutItems[i]['Checklist Name'];
				item['Checklist Name Ar'] = Utils.isBlankOrNull(closeOutItems[i]['Checklist Name Ar']) ? "" : closeOutItems[i]['Checklist Name Ar'];
				item['Checklist Item'] = Utils.isBlankOrNull(closeOutItems[i][checkListItemColumnName]) ? "" : closeOutItems[i][checkListItemColumnName];
				item['Checklist Item Ar'] = Utils.isBlankOrNull(closeOutItems[i][checkListItemColumnName + ' Ar']) ? "" : closeOutItems[i][checkListItemColumnName + ' Ar'];
				item['Checklist Item Status Group'] = Utils.isBlankOrNull(closeOutItems[i]['Checklist Item Status Group']) ? "" : closeOutItems[i]['Checklist Item Status Group'];
				item['Comments'] = Utils.isBlankOrNull(closeOutItems[i]['Comments']) ? "" : closeOutItems[i]['Comments'];
				item['Due Date'] = Utils.isBlankOrNull(closeOutItems[i]['Due Date']) ? "" : closeOutItems[i]['Due Date'];
				item['Close Out Request Type'] = Utils.isBlankOrNull(closeOutItems[i]['Close Out Request Type']) ? "" : closeOutItems[i]['Close Out Request Type'];
                item['Project ID'] = Utils.isBlankOrNull(closeOutItems[i]['Project ID']) ? "" : closeOutItems[i]['Project ID'];
				item['Project Name'] = Utils.isBlankOrNull(closeOutItems[i]['Project Name']) ? "" : closeOutItems[i]['Project Name'];
				if (this.getCapType() == "OSHJ/Inspection/Inspection Record/INSR") {
					item['Decision Taken'] = Utils.isBlankOrNull(closeOutItems[i]['Decision']) ? "" : closeOutItems[i]['Decision'];
				}
			//	java.lang.System.out.println("2 " + closeOutItems[i][checkListItemColumnName] + " - Due date - " + closeOutItems[i]['Due Date'])
				
				if(!Utils.isBlankOrNull(closeOutItems[i]['Due Date']))
				{
					if(earliestDueDate == "")
					{
						earliestDueDate = closeOutItems[i]['Due Date'];
					}
				}
				
				profileCloseOut.push(item);
				
				nbrItemsClosedOut++;
				
			}
		}
	
		parents[0].addASITRows('CLOSE OUT ITEMS', profileCloseOut);
		
		var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
		var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());
		var addRow = true;
		if(currentRecordsCloseOutProfile.length > 0)
		{
			for(var x=0; x <currentRecordsCloseOutProfile.length; x++ )
			{
				if(String(currentRecordsCloseOutProfile[x]["Record ID"]) == String(currentCustomId))
				{
					parents[0].updateASITColumn('CLOSE OUT RECORDS DETAILS', x, "Number of Items to be Closed Out",nbrItemsClosedOut);

					earliestDueDate = '';
					var requestDueDates = profileCloseOut.filter(function(item) {
						return item['Request ID'] == currentCustomId
					})
					
					for ( var y in requestDueDates) {
						dateInput = dtu.parseDate(requestDueDates[y]['Due Date']);

						if (Utils.isBlankOrNull(earliestDueDate)) {
							earliestDueDate = dateInput;
						} else {
							if (dateInput.getTime() < earliestDueDate.getTime()) {
								earliestDueDate = dateInput;
							}
						}
					}

					if(!Utils.isBlankOrNull(earliestDueDate)){
						earliestDueDate = Utils.formatDate(earliestDueDate, "MM/dd/yyyy");//dtu.format(earliestDueDate, "dd/MM/yyyy")
					}
					parents[0].updateASITColumn('CLOSE OUT RECORDS DETAILS', x, "The Earliest Due Date", Utils.isBlankOrNull(earliestDueDate) ? "" : earliestDueDate)
					
					
					java.lang.System.out.println("earliestDueDate 2 " + earliestDueDate)
					addRow = false;
					break;
				}
			}
		}
		
		if(addRow)
		{
			var addedRows = [];
			var recordRow = [];
			recordRow['Record ID'] = currentCustomId;
			recordRow['Record Name'] = String(this.getCapType()).split('/')[2];
			recordRow['Number of Items to be Closed Out'] = String(this.getCapType()).split('/')[3] == 'CORP' ? profileCloseOut.length : nbrItemsClosedOut;
            recordRow['Project ID'] = projectId;
            recordRow['Project Name'] = projectName;

			earliestDueDate = '';
            var requestDueDates = profileCloseOut.filter(function(item) {
				return item['Request ID'] == currentCustomId
			})
			
			for ( var y in requestDueDates) {

				dateInput = dtu.parseDate(requestDueDates[y]['Due Date']);

				if (Utils.isBlankOrNull(earliestDueDate)) {
					earliestDueDate = dateInput;
				} else {
					if (dateInput.getTime() < earliestDueDate.getTime()) {
						earliestDueDate = dateInput;
					}
				}
			}
            
            if(!Utils.isBlankOrNull(earliestDueDate)){
				earliestDueDate = Utils.formatDate(earliestDueDate, "MM/dd/yyyy");//dtu.format(earliestDueDate, "dd/MM/yyyy")
			}
			recordRow['The Earliest Due Date'] = Utils.isBlankOrNull(earliestDueDate) ? "" : earliestDueDate;
            java.lang.System.out.println("earliestDueDate 3 " + earliestDueDate)
			addedRows.push(recordRow);
			
			parents[0].addASITRows('CLOSE OUT RECORDS DETAILS', addedRows);

			currentRecordsCloseOutProfile = parents[0].getASIT('CLOSE OUT RECORDS DETAILS', true);
			recordRowIndex = currentRecordsCloseOutProfile.length - 1;
		}
		
	}
}

SPSABASE.prototype.processCloseoutItems = function() {
	var asit = this.getASIT('CHECKLISTS', true);
	var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());

	var itemsInCloseOut = [];
	var itemsPassedCloseOut = [];
	for (var i = 0; i < asit.length; i++) {
		if (Utils.isCheckBoxChecked(asit[i]['Is Close-Out'])) {
			itemsInCloseOut.push(asit[i]['Checklist Name'] + '##' + asit[i]['Checklist Item']);
		}
	}
	var primary = this.getPrimaryInspection();
	if (primary) {
		var checklists = primary.getGuideSheets().toArray();
		for ( var i in checklists) {
			var items = checklists[i].getItems().toArray();
			for ( var j in items) {
				var item = items[j];
				var itemText = item.getGuideItemText();
				var itemTextRes = item.getResGuideItemText();
				var enItemText = '';
				var arItemText = '';
				if (String(itemText).indexOf('-') > 0) {
					var textSplit = itemText.split('-');
					enItemText = textSplit[0].trim();
if(textSplit.length > 1)
	{
					arItemText = textSplit[1].trim();
	}
				}

				var checklistText = item.getGuideType();
				var enChecklistText = '';
				var arChecklistText = '';
				if (String(checklistText).indexOf('-') > 0) {
					var textCLSplit = checklistText.split('-');
					enChecklistText = textCLSplit[0].trim();
					if(textCLSplit.length > 1){
					arChecklistText = textCLSplit[1].trim();
					}
				}
				if (itemsInCloseOut.indexOf(enChecklistText + '##' + enItemText) >= 0) {
					if (item.getGuideItemStatus()
							&& (item.getGuideItemStatus().equalsIgnoreCase('Yes') || item.getGuideItemStatus().equalsIgnoreCase('Passed')
									|| item.getGuideItemStatus().equalsIgnoreCase('Pass') || item.getGuideItemStatus().equalsIgnoreCase('Comply'))) {
						itemsPassedCloseOut.push(enChecklistText + '##' + enItemText);
					}
				}

			}
		}
		java.lang.System.out.println("CORP Log itemsPassedCloseOut " +itemsPassedCloseOut);
		
		if (itemsPassedCloseOut.length > 0) {
			var parents = this.getParents(EPRF.RECORD_TYPE, EPRF, "Amendment");
			if (parents.length == 0) {
				parents = this.getParents(EPRF.RECORD_TYPE, EPRF);
			}
			if (parents.length > 0) {
				var profile = parents[0];
				var closeOutItems = profile.getASIT('CLOSE OUT ITEMS', true);
				var newCloseOutItems = [];
				for (var j = 0; j < closeOutItems.length; j++) {
					var cItem = closeOutItems[j];

					java.lang.System.out.println("CORP Log key " +cItem['Checklist Name'] + '##' + cItem['Checklist Item']);
					if (itemsPassedCloseOut.indexOf(cItem['Checklist Name'] + '##' + cItem['Checklist Item']) >= 0) {
						java.lang.System.out.println("CORP Log contains key");
						
						var rec = new Record(cItem['Request ID']);
						var checkListItemColumnName = 'Checklist Item';
						if (rec.getCapType() == "OSHJ/Reporting/Close-Out Reporting/CORP") {
							checkListItemColumnName = "Close-Out Point"
						}
						var recordCloseoutASIT = rec.getASIT('CLOSE OUT ITEMS');
						var date = new Date();
						for (var k = 0; k < recordCloseoutASIT.length; k++) {
							if(recordCloseoutASIT[k]['Close Date']){
								if (itemsPassedCloseOut.indexOf(recordCloseoutASIT[k]['Checklist Name'] + '##' + recordCloseoutASIT[k][checkListItemColumnName]) >= 0
									&& Utils.isBlankOrNull(recordCloseoutASIT[k]['Close Date'])) {
								rec.updateASITColumn('CLOSE OUT ITEMS', k, 'Close Date', dtu.format(date, "MM/dd/yyyy"));
								break;
							}
							}
							
						}
					} else {
						java.lang.System.out.println("CORP Log doen't contain key");
						var newItem = [];
						newItem['Checklist Item'] = cItem['Checklist Item'];
						newItem['Checklist Item Ar'] = cItem['Checklist Item Ar'];
						newItem['Checklist Item Status Group'] = cItem['Checklist Item Status Group'];
						newItem['Checklist Name'] = cItem['Checklist Name'];
						newItem['Checklist Name Ar'] = cItem['Checklist Name Ar'];
						newItem['Comments'] = cItem['Comments'];
						newItem['Due Date'] = cItem['Due Date'];
						newItem['Request ID'] = cItem['Request ID'];
						newCloseOutItems.push(newItem);
					}
				}
				
				java.lang.System.out.println("CORP Log newCloseOutItems " +newCloseOutItems.length);
				profile.updateASIT('CLOSE OUT ITEMS', newCloseOutItems);
				
				SPSABASE.updateCloseOutRecordsTable(profile);
//				var closeOutCount = parseInt(profile.getASIT('CLOSE OUT ITEMS').length, 10) || 0;
//				var cap = profile.getCapModel();
//				cap.setQUD3(closeOutCount);
//				aa.cap.editCapByPK(cap);
			}
		}
	}
}

SPSABASE.updateCloseOutRecordsTable = function(profile) {

	var addedIds = [];
	var closeOutItems = profile.getASIT('CLOSE OUT ITEMS', true);
	var addedRows = [];
	for ( var x in closeOutItems) {
		var numberOfItems = 0;
		var earliestDueDate = "";
		var newItem = [];
		var requestId = closeOutItems[x]['Request ID'];
		if (addedIds.toString().indexOf(requestId) == -1) {
			for ( var y in closeOutItems) {
				if (closeOutItems[y]["Request ID"] == requestId) {
					numberOfItems++;
					var closeOutItemsdueDate = closeOutItems[y]["Due Date"];

					if (closeOutItemsdueDate != "") {
						if (earliestDueDate == "") {
							earliestDueDate = closeOutItemsdueDate;
						} 
//						else {
//							var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(
//									aa.getServiceProviderCode());
//							var dtu = new com.accela.aa.util.DateTimeUtil(aa
//									.getServiceProviderCode());
//							// closeOutItemsdueDate =
//							// dtu.format(closeOutItemsdueDate, "MM/dd/yyyy")
//
//							var dateInput = null;
//							var isValidDate = dtu.isValidDate(earliestDueDate,
//									"dd/MM/yyyy");
//							if (isValidDate) {
//								dateInput = dtu
//										.parseDate(earliestDueDate, 'DD');
//							} else if (dtu.isValidDate(earliestDueDate,
//									"MM/dd/yyyy")) {
//								dateInput = dtu.parseDate(earliestDueDate);
//							}
//							earliestDueDate = dtu.format(dateInput,
//									"MM/dd/yyyy");
//
//							var cDateInput = null;
//							var isValidDate = dtu.isValidDate(
//									closeOutItemsdueDate, "dd/MM/yyyy");
//							if (isValidDate) {
//								cDateInput = dtu.parseDate(
//										closeOutItemsdueDate, 'DD');
//							} else if (dtu.isValidDate(closeOutItemsdueDate,
//									"MM/dd/yyyy")) {
//								cDateInput = dtu
//										.parseDate(closeOutItemsdueDate);
//							}
//							closeOutItemsdueDate = dtu.format(cDateInput,
//									"MM/dd/yyyy");
//
//							var diff = du.diffDate(closeOutItemsdueDate,
//									earliestDueDate);
//							if (diff < 0) {
//								earliestDueDate = closeOutItemsdueDate;
//							}
//						}
					}
				}
			}

			var recordRow = [];
			recordRow['Record ID'] = requestId;
			var record = new Record(requestId)
			recordRow['Record Name'] = String(record.getCapType()).split('/')[2];
			recordRow['Number of Items to be Closed Out'] = numberOfItems;
			recordRow['The Earliest Due Date'] = Utils
					.isBlankOrNull(earliestDueDate) ? "" : earliestDueDate;
			addedRows.push(recordRow);

			addedIds.push(requestId);
		}
	}

	 profile.updateASIT('CLOSE OUT RECORDS DETAILS', addedRows);
}

/*
 * Calculate number of repetitve findings for reference id reference id might be
 * Entity or Project profile ID Below ASI field define the number of visits to
 * check repetitive items ASI::INSPECTION CONFIGURATION::Number of Previous
 * Visits for Findings
 */
SPSABASE.prototype.calculateNumberOfRepetitiveFindings = function(referenceId) {
	// TODO: return number of repetitive findings for reference id

}

SPSABASE.prototype.fillClosOutTiming = function(closOutTiming) {
	this.editASI("CLOSE-OUT TIMING", "Close-out Timing", closOutTiming);
}

SPSABASE.prototype.fillReportsTSIsDetails = function(wfTask, wfStatus, fromSubProcess)
{
	var retVal = {};
	
	var decision = "";
	var closeOutTiming = "";
	if(fromSubProcess)
	{
		decision = this.getTSISubProcess(wfTask, "Decision");
		closeOutTiming = this.getTSISubProcess(wfTask, "Close-out Timing");
	}
	else
	{
		decision = this.getTSI(wfTask, "Decision");
		closeOutTiming = this.getTSI(wfTask, "Close-out Timing");
	}
	 
	//if (decision != "") {
		var comments = this.getWorkflowTaskComment(wfTask, wfStatus);
		this.fillDecisionDetails(decision, comments);
	//}

	//if (closeOutTiming != "") {
		this.fillClosOutTiming(closeOutTiming);
	//}
	
	retVal.decision = decision;
	retVal.closeOutTiming = closeOutTiming;
	
	return retVal;
}

SPSABASE.prototype.handleEnforcement = function(parentProfile)
{
	var decision = this.getASI("DECISION DETAILS","Decision Type");
	
	if(!Utils.isBlankOrNull(decision))
	{
		this.fillParentDecisionDetails(parentProfile);
		if (decision == "Fines") {
			VIOL.createViolationRecord(this.getCustomID());
		}
	}
	
	return decision;
}

SPSABASE.prototype.fillDecisionDetails = function(decision, comments) {

	this.editASI("DECISION DETAILS", "Decision Type", decision);
	
	if(decision == "")
	{
		this.editASI("DECISION DETAILS", "Comments", "");

		this.editASI("DECISION DETAILS", "Decision Date", "");
	}
	else
	{

		this.editASI("DECISION DETAILS", "Comments", comments);

		var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
		var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());
		var today = new Date();
		today = dtu.format(today, "MM/dd/yyyy")
		this.editASI("DECISION DETAILS", "Decision Date", today);
	}
}

SPSABASE.prototype.fillParentDecisionDetails = function(parentProfile) {
	if (parentProfile != null && decision != "Fines") {
		var decision = this.getASI("DECISION DETAILS", "Decision Type");
		var comments = this.getASI("DECISION DETAILS", "Comments");
		var decisionDate = this.getASI("DECISION DETAILS", "Decision Date");

		var decisions = parentProfile.getASIT("DECISIONS DETAILS");
		var dataSet = [];

		var row = [];
		row["Request Id"] = this.getCustomID();
		row["Decision Type"] = decision;
		row["Comments"] = comments;
		row["Decision Date"] = decisionDate;
		row["Appeal"] = "";
		dataSet.push(row);

		parentProfile.addASITRows("DECISIONS DETAILS", dataSet);
	}
}

SPSABASE.prototype.assignInspectorToTask = function() {
	var primary = this.getPrimaryInspection();
	var inspector = primary.getInspector();
	var curTask = this.getCurrentWorkflowTask();

	var inspectorName = (Utils.isBlankOrNull(inspector.getFirstName()) ? '' : inspector.getFirstName()) + ' ' + (Utils.isBlankOrNull(inspector.getMiddleName()) ? '' : inspector.getMiddleName()) + ' ' + (Utils.isBlankOrNull(inspector.getLastName()) ? '' : inspector.getLastName());
	curTask.setAssignedUser(inspector);
	curTask.setAssignmentDate(aa.util.now());

	var result = aa.workflow.assignTask(curTask.getTaskItem());
	if (!result.getSuccess()) {
		throw "**ERROR: Could not assign task: " + result.getErrorMessage();
	}
	
	return inspectorName;
}
SPSABASE.prototype.onInspectionResultSubmitAfter = function() {
	var primary = this.getPrimaryInspection();
	var isComplete = true;
	if (primary.getInspectionStatus() == 'Scheduled') {
		isComplete = false;
	}
	var assistantInspections = this.getAssistantInspection();
	if (assistantInspections.length > 0) {
		for ( var i in assistantInspections) {
			if (assistantInspections[i].getInspectionStatus() == 'Scheduled') {
				isComplete = false;
				break;
			}
		}
	}
	if (isComplete) {
		var entityProfileId = this.getEntityProfileId();

		var capId = this.getCapID();
		
		if (this.getCapType() == "OSHJ/Inspection/Inspection Record/INSR") {
			var entityProfileId = this.getEntityProfileId();
			if(!Utils.isBlankOrNull(entityProfileId))
			{
				var announcedVisit = this.getASI(INSR.ASI.inspectionDetails.TableName, INSR.ASI.inspectionDetails.announcedInspection);
				if (announcedVisit != 'CHECKED') {
					var profile = new EPRF(entityProfileId);
					this.copyContacts(profile);
				}
			}
		}
		
		if(this.isTaskActive('Review Reschedule Request')){
			this.updateTaskAndHandleDisposition('Review Reschedule Request', 'Disapprove', "");
		}
		
//		branchTask("Conduct Inspection", "Complete", "Updated by the system", '');
		this.updateTaskAndHandleDisposition("Conduct Inspection", "Complete", "");
		this.onWorkflowTaskUpdateAfter("Conduct Inspection", "Complete");
		this.updateInspectionChecklistAnswersASIT("INSPECTION CHECKLIST ANSWERS");
		this.fillInspectionHistory();
		
//		this.activateTask('Receive Inspection Result and Decide Action', false);
//		var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
//		var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());
//
//		var today = new Date();
//		today = dtu.format(today, "MM/dd/yyyy")
//
//		// var dateInput = null;
//		// var isValidDate = dtu.isValidDate(today, "dd/MM/yyyy");
//		// if (isValidDate) {
//		// dateInput = dtu.parseDate(today, 'DD');
//		// } else if (dtu.isValidDate(today, "MM/dd/yyyy")) {
//		// dateInput = dtu.parseDate(today);
//		// }
//		// var dateValue = dtu.format(dateInput, "MM/dd/yyyy");
//
//		editTaskDueDate('Receive Inspection Result and Decide Action', today)
		
		
			
		}
	//}

}
SPSABASE.prototype.getEntityProfileId = function() {
	var capType = this.getCapType();
	switch (String(capType)) {
	case 'OSHJ/Violation/Appeal Request/BUAR':
		return this.getASI(BUAR.ASI.requestInfo.TableName, BUAR.ASI.requestInfo.entityProfileId);
	case 'OSHJ/Reporting/Close-Out Reporting/CORP':
		return this.getASI(CORP.ASI.serviceDetails.TableName, CORP.ASI.serviceDetails.entityProfileId);
	case 'OSHJ/Reporting/Entity Self Declaration/ESDE':
		return this.getASI(ESDE.ASI.requestDetails.TableName, ESDE.ASI.requestDetails.entityProfileId);
	case 'OSHJ/Reporting/Investigation Report/IIRP':
		return this.getASI(IIRP.ASI.entityDetails.TableName, IIRP.ASI.entityDetails.entityProfileId);
	case 'OSHJ/Reporting/Incident Reporting/IRRP':
		return this.getASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.entityProfileId);
	case 'OSHJ/Profile/Entity Registration Renewal/RERR':
		return this.getASI(RERR.ASI.requestDetails.TableName, RERR.ASI.requestDetails.entityProfileId);
	case 'OSHJ/Reporting/Reporting of Unsafe ACT/RUAC':
		return this.getASI(RUAC.ASI.incidentDetails.TableName, RUAC.ASI.incidentDetails.entityProfileId);
	case 'OSHJ/Inspection/Inspection Record/INSR':
		return this.getASI(INSR.ASI.inspectionDetails.TableName, INSR.ASI.inspectionDetails.entityProfileId);
	default:
		return '';
	}
}
SPSABASE.prototype.getProjctProfileId = function() {
	var capType = this.getCapType();
	switch (String(capType)) {
	case 'OSHJ/Reporting/Investigation Report/IIRP':
	     return this.getASI(IIRP.ASI.entityDetails.TableName, IIRP.ASI.entityDetails.projectID);
    case 'OSHJ/Reporting/Incident Reporting/IRRP':
         return this.getASI(IRRP.ASI.entityDetails.TableName, IRRP.ASI.entityDetails.projectId);
	case 'OSHJ/Reporting/Close-Out Reporting/CORP':
		return this.getASI(CORP.ASI.serviceDetails.TableName, CORP.ASI.serviceDetails.projectId);
	case 'OSHJ/Reporting/Reporting of Unsafe ACT/RUAC':
		return this.getASI(RUAC.ASI.incidentDetails.TableName, RUAC.ASI.incidentDetails.projectId);
	case 'OSHJ/Inspection/Inspection Record/INSR':
		return this.getASI(INSR.ASI.inspectionDetails.TableName, INSR.ASI.inspectionDetails.projectId);
	default:
		return '';
	}
}
SPSABASE.prototype.getProjectName = function() {
	var projectName = "";
	var projectProfileId = this.getProjctProfileId();
	if (Utils.isBlankOrNull(projectProfileId)) {
		return ""
	}

	eval(getScriptText('INCLUDE_PRPL'));
	var projectProfile = new PRPL(projectProfileId);
    if(projectProfile) {

        var projectType = projectProfile.getASI(PRPL.ASI.projectDetails.TableName, PRPL.ASI.projectDetails.projectType, "");

        if(projectType == "Construction") {
	projectName= projectProfile.getASI(PRPL.ASI.projectInformation.TableName, PRPL.ASI.projectInformation.projectName);
	
        } else {
            projectName = projectProfile.getASI(PRPL.ASI.buildingInformation.TableName, PRPL.ASI.buildingInformation.buildingName, "");

        }
    }


	return projectName;
}
SPSABASE.prototype.getAssistantGuideItemResult = function(assistantsInspections, primaryGuideType, guideIndex, itemIndex) {
	var itemResult = [];
	for ( var i in assistantsInspections) {
		var guidesheets = assistantsInspections[i].getGuideSheets().toArray();
		var assistantGuideType = guidesheets[guideIndex].getGuideType();
		if (primaryGuideType == assistantGuideType) {
			var items = guidesheets[guideIndex].getItems().toArray();
			var gItem = items[itemIndex];
			var status = String(gItem.getGuideItemStatus());
			if (status.equalsIgnoreCase('Failed') || status.equalsIgnoreCase('Not Comply') || status.equalsIgnoreCase('No')) {

				var comments = itemResult.comment;
				if (Utils.isBlankOrNull(comments)) {
					comments = String(gItem.getGuideItemComment());
				} else {
					comments += '\n' + String(gItem.getGuideItemComment());
				}

				itemResult.comment = comments;
				var asiSubgroups = gItem.getItemASISubgroupList().toArray();
				var dueDate = null;
				for ( var a in asiSubgroups) {
					var asiSubGroup = asiSubgroups[a];
					if (String(asiSubGroup.getSubgroupCode()).equalsIgnoreCase('CLOSE-OUT') && asiSubGroup.getAsiList().size() > 0) {
						var asiList = asiSubGroup.getAsiList().toArray();
						for ( var l in asiList) {
							var asi = asiList[l];
							if (asi && String(asi.getAsiName()).equalsIgnoreCase('Due Date') && !Utils.isBlankOrNull(asi.getAttributeValue())) {
								dueDate = String(asi.getAttributeValue());
								break;
							}
						}
					}
				}
				itemResult.dueDate = dueDate;
				itemResult.status = status;
			}
		}
	}
	return itemResult;
}
SPSABASE.prototype.copyChecklistsResults = function() {
	var gGuideSheetBusiness = new com.accela.aa.inspection.guidesheet.GGuideSheetBusiness();

	var assistants = this.getAssistantInspection();
	if (assistants.length > 0) {
		var primary = this.getPrimaryInspection();
		var guidesheets = primary.getGuideSheets().toArray();
		for ( var g in guidesheets) {
			var primaryGuideType = guidesheets[g].getGuideType();
			var items = guidesheets[g].getItems().toArray();
			for ( var i in items) {
				var gItem = items[i];
				// if (status.equalsIgnoreCase('Pass') ||
				// status.equalsIgnoreCase('Comply') ||
				// status.equalsIgnoreCase('Yes')) {
				var assistantItem = this.getAssistantGuideItemResult(assistants, primaryGuideType, g, i);
				if (!Utils.isNullOrEmptyArr(assistantItem)) {
					gItem.setGuideItemStatus(assistantItem['status']);
					if (!Utils.isBlankOrNull(assistantItem['comment'])) {
						var comment = String(gItem.getGuideItemComment());
						comment = comment.replace(/null/, '').trim();
						gItem.setGuideItemComment(comment + '\n' + String(assistantItem['comment']).replace(/null/, '').trim());

					}
					if (assistantItem['dueDate'] != null) {
						var asiSubgroups = gItem.getItemASISubgroupList().toArray();
						var dueDate = null;
						for ( var a in asiSubgroups) {
							var asiSubGroup = asiSubgroups[a];
							if (String(asiSubGroup.getSubgroupCode()).equalsIgnoreCase('CLOSE-OUT') && asiSubGroup.getAsiList().size() > 0) {
								var asiList = asiSubGroup.getAsiList().toArray();
								for ( var l in asiList) {
									var asi = asiList[l];
									if (asi && String(asi.getAsiName()).equalsIgnoreCase('Due Date') && Utils.isBlankOrNull(asi.getAttributeValue())) {
										asi.setAttributeValue(assistantItem['dueDate']);
										gItem.setGuideItemStatus(assistantItem['status'])
										break;
									}
								}
							}
						}
					}
					// }
				}
			}
			gGuideSheetBusiness.updateGGuideSheet(guidesheets[g], aa.getAuditID());
		}
	}
}
SPSABASE.getLevelNumber = function(level){
	var levelNbr = 0;
	if(typeof(level).equals("String"))
		levelNbr= Number(level.substring(level.length - 1, level.length));
	return levelNbr;
}
SPSABASE.getAppealPeriodByDay = function(recordId) {
	var retVal = false;
	recordId = aa.cap.getCapID(recordId).getOutput();

	if (recordId != null) {
		var record = new Record(recordId);
		var capType = record.getCapType().toString();
		var arr = capType.split("/");

		var serviceName = arr[2];
		var capStatus = record.getCapStatus();
		var decision = record.getASI("Decision Details", "Decision Type")
		if ((serviceName == "Violation Record" && capStatus == "Completed") || (decision == "Awareness" || decision == "Warning"))

		{
			var checkTime = false;
			switch (String(serviceName)) {
			case "Entity Self Declaration":
			case "Entity Registration Renewal":
				if (capStatus == "Accepted" || capStatus == "Rejected") {
					checkTime = true;
				}
				break;
			case "Incident Reporting":
			case "Investigation Report":
			case "Reporting of Unsafe ACT":
				if (capStatus == "Completed without Report" || capStatus == "Completed with Report") {
					checkTime = true;
				}
				break;
			case "Violation Record":
				checkTime = true;
				break;
			}

			if (checkTime) {

				var gsRecord = new Record(SPSAGS.General_Settings_Record_Id);
				var appealSettings = gsRecord.getASIT(SPSAGS.ASIT.appealSettings.TableName)
				for ( var x in appealSettings) {
					var serviceValue = appealSettings[x][SPSAGS.ASIT.appealSettings.serviceName];

					if (serviceValue == serviceName) {
						var time = appealSettings[x][SPSAGS.ASIT.appealSettings.time];

						var du = new com.accela.aa.emse.util.ScriptDateTimeUtil(aa.getServiceProviderCode());
						var dtu = new com.accela.aa.util.DateTimeUtil(aa.getServiceProviderCode());

						var completion = dtu.format(aa.cap.getCapViewByID(record.capId).getOutput().getCapStatusDate(), "MM/dd/yyyy")

						var dueDate = new Date(completion);
						dueDate.setDate(dueDate.getDate() + Number(time));

						dueDate = Utils.formatDate(dueDate, "MM/dd/yyyy")

						var today = new Date();
						today = dtu.format(today, "MM/dd/yyyy");

						var diff = du.diffDate(dueDate, today);

						if (diff > 0) {
							retVal = true;
							break;
						}

					}
				}
			}
		}
	}

	return retVal;
}

SPSABASE.hasCloseOutItems = function(recordId) {
	var retVal = false;
	var record = new Record(recordId);

	var closeOutASIT = record.getASIT("CLOSE OUT ITEMS");
	if (closeOutASIT.length > 0) {
		retVal = true;
	}

	return retVal;
}

SPSABASE.prototype.fillInspectionHistory = function() {
	eval(getScriptText('INCLUDE_EPRF'));
	
	var entityProfileId = this.getEntityProfileId();
	
	if(entityProfileId != ''){
		var entity = new EPRF(entityProfileId);
		var rows = [];
		var primary = this.getPrimaryInspection();
		var assInsp = this.getAssistantInspection();
		var assistantInspectorsNames = [];
		for ( var i in assInsp) {
			assistantInspectorsNames.push(assInsp[i].getInspector().getUserID())
		}
	
		var data = {
			"Record Id" : String(this.getCustomID()),
			"Inspection Id" : String(primary.getActivity().getIdNumber()),
			"Inspection Type" : String(primary.getInspectionType()),
			"Inspection Result" : String(primary.getInspectionStatus()),
			"Inspectors" : String(primary.getInspector().getUserID() + ' ' + (assistantInspectorsNames.length > 0 ? (',' + assistantInspectorsNames.join(',')) : '')),
			"Inspection Date" : String(Utils.formatDate(primary.getActivity().getActivityDate(), "dd/MM/yyyy")),
			"Number Of Findings" : String(''),
		}
		rows.push(data);
		entity.addASITRows('INSPECTION HISTORY', rows)
	}
}

SPSABASE.prototype.updateInspectionHistory = function(decisionTaken) {
	eval(getScriptText('INCLUDE_EPRF'));
	var entity = new EPRF(this.getEntityProfileId());
	var inspHis = entity.getASIT('INSPECTION HISTORY');
	var indexSelected = -1;

	var primary = this.getPrimaryInspection();
	for ( var i in inspHis) {
		if (inspHis[i]['Record Id'] == this.getCustomID() && inspHis[i]['Inspection Id'] == primary.getActivity().getIdNumber()) {
			indexSelected = i;
			break;
		}
	
		if (!Utils.isBlankOrNull(decisionTaken)) {
			if (indexSelected > -1) {
				entity.updateASITColumn('INSPECTION HISTORY', i, 'Decision Taken', decisionTaken);
			}
		}
	}
}

SPSABASE.validateInspectorVacations = function(date, inspector){
	var sql = "SELECT * FROM CALENDAR_EVENT E ";
	sql += " JOIN XINSPECTOR_CALENDAR C ON C.CALENDAR_ID = E.CALENDAR_ID ";
	sql += " WHERE E.EVENT_TYPE = 'Holiday' ";
	sql += " AND (E.START_DATE BETWEEN Convert(date,?,103) AND Convert(date,?,103) ";
	sql += " OR CAST(E.END_DATE as date) BETWEEN Convert(date,?,103) AND Convert(date,?,103)) ";
	sql += " AND C.USER_NAME = ? ";

	var response = new DAO("").execSimpleQuery(sql, [ date, date, date, date, inspector ]);
	if (response != "" && response != null) {
		return false;
	}

	return true;
}

SPSABASE.validateInspectorAvailability = function(inspDate, fromTime, toTime, inspectorId, altId) {

	var sql = "SELECT I.G6_ACT_NUM as 'INSPID',PER.B1_ALT_ID as 'ALT_ID' ";
	sql += " FROM G6ACTION I  ";
	sql += " INNER JOIN B1PERMIT PER on I.SERV_PROV_CODE=PER.SERV_PROV_CODE and  I.B1_PER_ID1=PER.B1_PER_ID1 and I.B1_PER_ID2=PER.B1_PER_ID2 and I.B1_PER_ID3=PER.B1_PER_ID3 ";
	sql += " WHERE PER.SERV_PROV_CODE=? ";
	sql += " AND PER.REC_STATUS='A' ";
	sql += " AND I.G6_STATUS = 'Scheduled' ";
	sql += " AND I.G6_DOC_DES = 'Insp Scheduled' ";
	sql += " AND I.G6_COMPL_DD IS NULL ";
	sql += " AND I.REC_STATUS = 'A' ";
	sql += " AND CAST(I.G6_ACT_DD AS DATE) = Convert(date,?,103) ";
	sql += " AND ((I.G6_ACT_T2 <= ? ";
	sql += " AND I.G6_ACT_END_T2 > ?) ";
	sql += " OR (I.G6_ACT_T2 < ? ";
	sql += " AND I.G6_ACT_END_T2 >= ?)) ";
	sql += " AND I.REC_FUL_NAM = ? ";
	if (altId) {
		sql += " AND PER.B1_ALT_ID <> '" + altId + "'";
	}

	var inspections = new DAO().execSimpleQuery(sql, [ aa.getServiceProviderCode(), inspDate, fromTime, fromTime, toTime, toTime, inspectorId ]);
	var ret = true;
	for ( var x in inspections) {
		var rec = new Record(inspections[x]["ALT_ID"])
		var inspID = parseInt(inspections[x]["INSPID"], 10);

		ret = false;
	}

	return ret;
}
SPSABASE.validateInspectorsAvailability = function(inspDate, fromTime, toTime, inspectorsId, altId) {
	var res = [];
	var sql = "SELECT I.G6_ACT_NUM as 'INSPID',PER.B1_ALT_ID as 'ALT_ID', I.REC_FUL_NAM as INSPECTORID ";
	sql += " FROM G6ACTION I  ";
	sql += " INNER JOIN B1PERMIT PER on I.SERV_PROV_CODE=PER.SERV_PROV_CODE and  I.B1_PER_ID1=PER.B1_PER_ID1 and I.B1_PER_ID2=PER.B1_PER_ID2 and I.B1_PER_ID3=PER.B1_PER_ID3 ";
	sql += " WHERE PER.SERV_PROV_CODE=? ";
	sql += " AND PER.REC_STATUS='A' ";
	sql += " AND I.G6_STATUS = 'Scheduled' ";
	sql += " AND I.G6_DOC_DES = 'Insp Scheduled' ";
	sql += " AND I.G6_COMPL_DD IS NULL ";
	sql += " AND I.REC_STATUS = 'A' ";
	sql += " AND CAST(I.G6_ACT_DD AS DATE) = Convert(date,?,103) ";
	sql += " AND ((convert(time,I.G6_ACT_T2) <= ? ";
	sql += " AND convert(time,I.G6_ACT_END_T2) > ?) ";
	sql += " OR (convert(time,I.G6_ACT_T2) < ? ";
	sql += " AND convert(time,I.G6_ACT_END_T2) >= ?)) ";
	sql += " AND I.REC_FUL_NAM IN(";
	for ( var x in inspectorsId) {
		sql += "'" + inspectorsId[x] + "'";
		sql += x == inspectorsId.length - 1 ? ")" : ","
	}
	if (altId) {
		sql += " AND PER.B1_ALT_ID <> '" + altId + "'";
	}

	var inspections = new DAO().execSimpleQuery(sql, [ aa.getServiceProviderCode(), inspDate, fromTime, fromTime, toTime, toTime ]);
	for ( var x in inspections) {
		var rec = new Record(inspections[x]["ALT_ID"])
		var inspID = parseInt(inspections[x]["INSPID"], 10);
		var inspectorID = inspections[x]["INSPECTORID"];
		
		var isExist = res.filter(function(item) {
			return item == inspectorID
		})
		
		if(isExist.length == 0){
			res.push(inspectorID);
		}
	}

	return res;
}
SPSABASE.SendNotificationReminder = function() {
	// TO Do...
}

SPSABASE.prototype.saveReportToAttachment = function(reportCapId, reportId,
		docCategory, fileName, allowDuplicate) {
	try {
		if (!fileName) {
			fileName = docCategory;
		}

		if (!allowDuplicate) {
			var docList = aa.document.getDocumentListByEntity(
					String(this.capId), "CAP");
			if (docList.getSuccess()) {
				docList = docList.getOutput();
				for (var indexOfDoc = 0; indexOfDoc < docList.size(); indexOfDoc++) {
					if (docList.get(indexOfDoc).getDocName() == fileName
							+ ".pdf") {
						return;
					}
				}
			}
		}

		var reportId = reportId;// Number(Record.getLookupVal("INFORMATION_REPORT_INFO",
//				reportName));
		if (!reportId || reportId == "") {
			return;
		}
		if (!reportCapId) {
			reportCapId = this.capId;
		}

		var reportParameter = aa.util.newHashMap();
		if (arguments.length == 6) {
			reportParameter = arguments[5];
		}

		var capType = aa.cap.getCapTypeModelByCapID(this.capId).getOutput();
		var docGroup = capType.getDocCode();

		var reportsManagerBusiness = new com.accela.v360.reports.ReportsManagerBusiness()
		var reportModel = reportsManagerBusiness.getReportDetail(aa
				.getServiceProviderCode(), reportId);
		if (reportModel != null) {
			// WS ONLY does basic business validation independent on
			// configurations in DB
			// complex validation like whether required parameters are input
			// would be done in EJB
			// TODO: validate required parameters are passed
			var reportInfoModel = new com.accela.v360.reports.proxy.ReportInfoModel();
			reportInfoModel.setCallerId(aa.getAuditID());
			reportInfoModel.setServProvCode(aa.getServiceProviderCode());
			reportInfoModel.setModule(capType.getModuleName());
			reportInfoModel.setReportId(reportId);
			reportInfoModel.setNotSaveToEDMS(false);

			if (arguments.length == 6) {
				reportParameter = arguments[5];
			} else {
				reportParameter.put("recordid", reportCapId.getCustomID());
				reportParameter.put("capid", String(reportCapId));
//				reportParameter.put("CHRECID",
//						String(reportCapId.getCustomID()));
//				reportParameter.put("UserID", aa.getAuditID());
				reportParameter.put("agencyid", aa.getServiceProviderCode());
			}
			reportInfoModel.setReportParameters(reportParameter);
			var EDMSEntityIdModel = new com.accela.v360.reports.proxy.EDMSEntityIdModel();
			EDMSEntityIdModel.setCapId(this.capId);
			EDMSEntityIdModel.setAltId(this.capId.getCustomID());
			reportInfoModel.setEDMSEntityIdModel(EDMSEntityIdModel);
			var reportBusiness = new com.accela.v360.reports.proxy.ReportBusiness();
			// var reportResultMOdel =
			// reportBusiness.getReportResult(reportInfoModel);
			// message = reportResultMOdel.getActionMessage(1);
			var reportResult = reportBusiness.handleReport(reportInfoModel);
			// Attache report to record
			var recordId = String(this.capId);// aa.env.getValue("recordId");
			// var docGroup = "NSPC";//aa.env.getValue("group");
			// var docCategory = "Contract
			// Report";//aa.env.getValue("category");
			var docContent = reportResult.getContent();// new
			// java.io.ByteArrayInputStream(reportResult.getContent())
			// ;
			java.lang.System.out.println("docContent:" + docContent);
			var docFileName = fileName;// "Contract Report";
			var docFileExtension = "pdf";
			var metaType = "application/pdf";
			var documentBusiness = aa.proxyInvoker.newInstance(
					"com.accela.aa.ads.ads.DocumentBusiness").getOutput();
			var genericTemplate = aa.proxyInvoker.newInstance(
					"com.accela.aa.template.GenericTemplateBusiness")
					.getOutput();
			var byteArray = docContent; // javax.xml.bind.DatatypeConverter.parseBase64Binary(docContent);
			if (this.getCapClass() == 'INCOMPLETE CAP'
					|| this.getCapClass() == 'INCOMPLETE EST') {
				var dataSource = new javax.mail.util.ByteArrayDataSource(
						byteArray, "UTF-8");
				var dataHandler = new javax.activation.DataHandler(dataSource);
				var docContent = new com.accela.aa.ads.ads.DocumentContentModel();
				docContent.setDocContentStream(dataHandler);
				var documentModel = new com.accela.aa.ads.ads.DocumentModel();
				documentModel.setServiceProviderCode(aa
						.getServiceProviderCode());
				documentModel.setAltId(aa.getAuditID());
				var capModel = this.getCapModel();
				if (this.getCapModel() != null) {
					var capType = capModel.getCapType();
					if (capType != null
							&& !Utils.isBlankOrNull(capType.getCategory())) {
						documentModel.setDocGroup(capType.getCategory());
					}
				}

				documentModel.setDocCategory(docCategory);
				documentModel.setRecDate(aa.util.now());
				documentModel.setDocName(docFileName + '.' + docFileExtension);
				documentModel.setFileName(docFileName + '.' + docFileExtension);
				documentModel.setCapID(this.capId);
				documentModel.setEntityType("CAP");
				documentModel.setEntityID(this.capId + "");
				documentModel.setDocumentContent(docContent);
				documentModel.setDocDescription('');
				var capIDModel4WS = new com.accela.webservice.model.CapIDModel4WS();
				capIDModel4WS.setCustomID(this.capId.getCustomID());
				capIDModel4WS.setServiceProviderCode(aa
						.getServiceProviderCode());
				capIDModel4WS.setId1(this.capId.getID1());
				capIDModel4WS.setId2(this.capId.getID2());
				capIDModel4WS.setId3(this.capId.getID3());

				var documentService = new com.accela.webservice.service.EDMSDocumentUploadWebService();
				var result = documentService.doUpload4PartialCap(aa
						.getServiceProviderCode(), "Licenses", aa.getAuditID(),
						capIDModel4WS, documentModel);
			}

			var fileName = docFileName;
			// File name must be 3 characters at least
			var tempFile = java.io.File.createTempFile(fileName, "."
					+ docFileExtension, null);
			var fos = new java.io.FileOutputStream(tempFile);
			fos.write(byteArray);
			java.lang.System.out
					.println("***RRRR2***,  about to call uploadDocument");
			try {
				var outDoc = documentBusiness.uploadDocument("SPSA", tempFile,
						"CAP", recordId, "ADS", docGroup, docCategory,
						metaType, "", "EMSE", "OSHJ", "ADMIN", null);

				// var outDoc = documentBusiness.uploadDocument("ADDOH", tempFile, "TMP_CAP",
				// recordId,
				// "ADS", docGroup, docCategory, metaType,
				// "", "EMSE", "Licenses", "ADMIN", null);

				fileName = fileName + "." + docFileExtension;
				outDoc.setFileName(fileName);
				outDoc.setDocName(fileName);
				documentBusiness.updateDocument(outDoc);

				java.lang.System.out.println("outDoc:" + outDoc);
			} catch (e) {
				java.lang.System.out.println("***RRRR3***,  Exception Happen");
				java.lang.System.out.println("e : " + e);
				java.lang.System.out.println(e);
			}

			fos.close();
			// delete is a Javascript keyword but also the name of a Java File
			// method
			// this works fine in this context
			tempFile.delete();
			if (outDoc == null) {
				java.lang.System.out.println("Failed to create document");
			}
		}
	} catch (e) {
		Utils.printLog("Error in saveReportToAttachment: " + e);
	}
}

SPSABASE.prototype.onGuidesheetUpdateBefore = function(){
	if (!this.isTaskActive("Conduct Inspection") && !this.isTaskActive('Review Reschedule Request') && !this.isTaskActive("Receive Inspection Result and Decide Action") && !this.isTaskActive('Received Inspection Results') && !this.isTaskActive('Review Inspection Feedback and Report')) {
		cancel = true;
		showMessage = true;
		showDebug = false;
		message = aa.messageResources
				.getLocalMessage("CHECKLIST_TASK_VALIDATION");
	} else {
		var userDept = SPSABASE.getUserDepartmentName(aa.getAuditID());
//		if (userDept != "Inspector Department") {
//			cancel = true;
//			showMessage = true;
//			showDebug = false;
//			message = aa.messageResources
//					.getLocalMessage("CHECKLIST_UPDATE_VALIDATION");
//		}
	}
}

SPSABASE.prototype.validateCancelledInspection = function(){
	//inspObj is global from Event Master Script
	if(inspObj.getInspectionStatus().toUpperCase().equals("CANCELLED")){
		cancel = true;
		showMessage = true;
		showDebug = false;
		message = aa.messageResources.getLocalMessage("MODIFY_CANCELLED_INSP_VALIDATION");
	}
}

/***/
SPSABASE.prototype.fillSFZIntegrationValues = function(tradeLicense) {
    var retVal = false;
    java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - START ...");
    try {
        eval(getScriptText("INCLUDE_INTEGRATION"));

        if(Utils.isBlankOrNull(tradeLicense)) {
            tradeLicense = this.getASI("ENTITY DETAILS", "Trade License Number");
        }

        var data = null;
        var ownerDetails = [];
        var employeeDetails = [];
        
        tradeLicense = String(tradeLicense).trim();
        java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - tradeLicense = " + tradeLicense);

        var res = INTEGRATION.sfzGetLicenseDetails(tradeLicense);
        java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - get integration results success = " + res.success);
        if(res.success) {
            data = res.data[0];
        }
        
        if(data != null) {
            java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data != null");
            ownerDetails = data.managerOwnerDetails;
            employeeDetails = data.employeeDetails;

            if(ownerDetails.length > 0) {
	            java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - ownerDetails.length > 0");
                var ownerRows = new Array();

                for(var i in ownerDetails) {
                    var nameEn = ownerDetails[i].nameEn;
                    var nameAr = ownerDetails[i].nameAr;
                    var emiratesID = ownerDetails[i].emiratesID;
                    var position = ownerDetails[i].position;

                    var row = new Array();

                    row["Name in English"] = new asiTableValObj("Name in English", nameEn + '', "N");
                    row["Name in Arabic"] = new asiTableValObj("Name in Arabic", nameAr + '', "N");
                    row["Owner Emirates ID"] = new asiTableValObj("Owner Emirates ID", emiratesID + '', "N");
                    row["Position"] = new asiTableValObj("Position", position + '', "N");

                    ownerRows.push(row)
                }

                this.updateASIT("EXTRACTED OWNER DETAILS", ownerRows)
            }

            if(employeeDetails.length > 0) {
	            java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - employeeDetails.length > 0");
                var employeeRows = new Array();
                for(var i in employeeDetails) {
                    var name = employeeDetails[i].name;
                    var email = employeeDetails[i].email;
                    var designation = employeeDetails[i].designation;
                    var employeeID = employeeDetails[i].employeeID;
                    var category = employeeDetails[i].category;

                    var row = new Array();

                    row["Employee ID"] = new asiTableValObj("Employee ID", employeeID + '', "N");
                    row["Name"] = new asiTableValObj("Name", name + '', "N");
                    row["Disignation"] = new asiTableValObj("Disignation", designation + '', "N");
                    row["Email"] = new asiTableValObj("Email", email + '', "N");
                    row["Category"] = new asiTableValObj("Category", category + '', "N");

                    employeeRows.push(row)
                }

                this.updateASIT("EMPLOYEE DETAILS", employeeRows)

            }
           
             java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data.companyNameEN = " + data.companyNameEN);
            if(data.companyNameEN) {
                var companyNameEN = this.getASI("ENTITY DETAILS", "Entity Name in English");

                if(companyNameEN.toLowerCase() != data.companyNameEN.toLowerCase()) {
                    retVal = true;
                }
                this.editASI("ENTITY DETAILS", "Extracted Entity Name in English", data.companyNameEN);
                java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data.companyNameEN updated ");
            }

            java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data.companyNameAR = " + data.companyNameAR);
            if(data.companyNameAR) {
                var companyNameAR = this.getASI("ENTITY DETAILS", "Entity Name in Arabic")
                if(companyNameAR.toLowerCase() != data.companyNameAR.toLowerCase()) {
                    retVal = true;
                }
                this.editASI("ENTITY DETAILS", "Extracted Entity Name in Arabic", data.companyNameAR);
                java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data.companyNameAR updated ");
            }
            java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data.email = " + data.email);
            if(data.email) {
                var email = this.getASI("ENTITY DETAILS", "Entity Email");
                if(email.toLowerCase() != data.email.toLowerCase()) {
                    retVal = true;
                }
                this.editASI("ENTITY DETAILS", "Extracted Entity Email", data.email);
            }
            java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data.mobile = " + data.mobile);
            if(data.mobile) {
                var contactNo = this.getASI("ENTITY DETAILS", "Entity Contact Number");
                if(contactNo != data.mobile) {
                    retVal = true;
                }
                this.editASI("ENTITY DETAILS", "Extracted Entity Contact Number", data.mobile);
            }
            java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data.noOfEmployees = " + data.noOfEmployees);
            if(data.noOfEmployees) {
                var totalEmployees = this.getASI("ENTITY DETAILS", "Number of Employees");
                if(totalEmployees != data.noOfEmployees) {
                    retVal = true;
                }
                this.editASI("ENTITY DETAILS", "Extracted Number of Employees", data.noOfEmployees);
            }
            java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - data.licenseExpiry = " + data.licenseExpiry);
            if(data.licenseExpiry) {
	            
                this.editASI("ENTITY DETAILS", "Extracted License Expiry", formatMMDDYYY(data.licenseExpiry));

            }

            if(data.licenseStatus) {
                this.editASI("ENTITY DETAILS", "Extracted License Status", data.licenseStatus);
            }

            if(data.addressEn) {
                this.editASI("ADDRESS DETAILS", "Extracted Address in English", data.addressEn);
            }
            if(data.addressAr) {
                this.editASI("ADDRESS DETAILS", "Extracted Address in Arabic", data.addressAr);
            }

            if(data.acitivity) {
                this.editASI("EXTRACTED ACTIVITIES", "Extracted Activities", data.acitivity);
            }

            if(data.subActivity) {
                this.editASI("EXTRACTED ACTIVITIES", "Extracted Sub Activity", data.subActivity);
            }

        }

        java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - END ..... ");


    } catch (e) {
        java.lang.System.out.println("SPSABASE fillSFZIntegrationValues - Error: " + e);
    }

    return retVal;
}
SPSABASE.prototype.fillFreeZoneIntegrationValues = function(tradeLicense, copyEntityDetails, copyAddressDetails, copyActivitiesDetails,copyOwnerDetails) {
	eval(getScriptText("INCLUDE_INTEGRATION"));

	var retVal = false;
	
	if(Utils.isBlankOrNull(tradeLicense))
	{
		tradeLicense = this.getASI("ENTITY DETAILS", "Trade License Number");
	}
	if(Utils.isBlankOrNull(copyEntityDetails))
	{
		copyEntityDetails = true;
	}
	if(Utils.isBlankOrNull(copyAddressDetails))
	{
		copyAddressDetails = true;
	}
	if(Utils.isBlankOrNull(copyActivitiesDetails))
	{
		copyActivitiesDetails = true;
	}
	if(Utils.isBlankOrNull(copyOwnerDetails))
	{
		copyOwnerDetails = true;
	}
	
	var data = null;
	var location = null;
	var owner = [];
	var res = INTEGRATION.getHFZALicenseByLicenseNo(tradeLicense);
	if (res.success) {
		data = res.data;
		location = data.location;
		owner = data.owners;
	}

	if (data != null) {
		if(copyEntityDetails){
			if (data.companyNameEN) {
				var companyNameEN  = this.getASI("ENTITY DETAILS", "Entity Name in English")
				if(companyNameEN.toLowerCase() != data.companyNameEN.toLowerCase())
				{
					retVal = true;
				}
				this.editASI("ENTITY DETAILS", "Extracted Entity Name in English",
						data.companyNameEN);
			}
			if (data.companyNameAR) {
				var companyNameAR  = this.getASI("ENTITY DETAILS", "Entity Name in Arabic")
				if(companyNameAR.toLowerCase() != data.companyNameAR.toLowerCase())
				{
					retVal = true;
				}
				this.editASI("ENTITY DETAILS", "Extracted Entity Name in Arabic",
						data.companyNameAR);
			}
			if (data.email) {
				var email  = this.getASI("ENTITY DETAILS", "Entity Email");
				if(email.toLowerCase() != data.email.toLowerCase())
				{
					retVal = true;
				}
				this
						.editASI("ENTITY DETAILS", "Extracted Entity Email",
								data.email);
			}
			if (data.contactNo) {
				var contactNo  = this.getASI("ENTITY DETAILS", "Entity Contact Number");
				if(contactNo != data.contactNo)
				{
					retVal = true;
				}
				this.editASI("ENTITY DETAILS", "Extracted Entity Contact Number",
						data.contactNo);
			}
			if (data.totalEmployees) {
				//var totalEmployees  = this.getASI("ENTITY DETAILS", "Entity Contact Number");
				var totalEmployees  = this.getASI("CLASSIFICATION INFO", "Number of Employees");
				
				if(totalEmployees != data.totalEmployees)
				{
					retVal = true;
				}
				this.editASI("ENTITY DETAILS", "Extracted Number of Employees",
						data.totalEmployees);
			}
		}
		
		if(copyActivitiesDetails){
			if (data.license.activity) {
				this.editASI("EXTRACTED ACTIVITIES", "Extracted Activities",
						data.license.activity);
			}
		}
		
		if(copyAddressDetails){
			if (location.addressEN) {
				var addressEN  = this.getASI("ENTITY DETAILS", "Address in English");
				if(addressEN != location.addressEN)
				{
					retVal = true;
				}
				this.editASI("ADDRESS DETAILS", "Extracted Address in English",
						location.addressEN);
			}
			if (location.addressAR) {
				var addressAR  = this.getASI("ENTITY DETAILS", "Address in Arabic");
				if(addressAR != location.addressAR)
				{
					retVal = true;
				}
				this.editASI("ADDRESS DETAILS", "Extracted Address in Arabic",
						location.addressAR);
			}
			if (location.area) {
				//todo: to be checked with bilal
//				var area  = this.getASI("ENTITY DETAILS", "Address in Arabic");
//				if(area != location.area)
//				{
//					retVal = true;
//				}
				this.editASI("ADDRESS DETAILS", "Extracted Area", location.area);
			}
			if (location.longitude) {
				var longitude  = this.getASI("ENTITY DETAILS", "Longitude");
				if(longitude != location.longitude)
				{
					retVal = true;
				}
				this.editASI("ADDRESS DETAILS", "Extracted Longitude",
						location.longitude);
			}
			if (location.latitude) {
				var latitude  = this.getASI("ENTITY DETAILS", "Latitude");
				if(latitude != location.latitude)
				{
					retVal = true;
				}
				this.editASI("ADDRESS DETAILS", "Extracted Latitude",
						location.latitude);
			}
		}

		if(copyOwnerDetails){
			if (owner.length > 0) {
				var details = new Array();
				for ( var i in owner) {
					var managerContactNumber = "";
					var managerEmail = "";
					var managerName = "";
					var email = "";
					var mobile = "";
					var ownerIndividualorCompany = "Individual";
	
					var ownerEmiratesID = owner[i].ownerEID;
					if (Utils.isBlankOrNull(ownerEmiratesID)) {
						ownerEmiratesID = "";
					}
	
					var ownerNameinArabic = owner[i].ownerNameAR;
					if (Utils.isBlankOrNull(ownerNameinArabic)) {
						ownerNameinArabic = "";
					}
	
					var ownerNameinEnglish = owner[i].ownerNameEN;
					if (Utils.isBlankOrNull(ownerNameinEnglish)) {
						ownerNameinEnglish = "";
					}
	
					var row = new Array();
					row["Company Manager Contact Number"] = new asiTableValObj(
							"Company Manager Contact Number", managerContactNumber
									+ '', "N");
					row["Company Manager Email"] = new asiTableValObj(
							"Company Manager Email", managerEmail + '', "N");
					row["Company Manager Name"] = new asiTableValObj(
							"Company Manager Name", managerName + '', "N");
					row["Owner Emirates ID"] = new asiTableValObj(
							"Owner Emirates ID", ownerEmiratesID + '', "N");
					row["Owner Individual or Company"] = new asiTableValObj(
							"Owner Individual or Company", ownerIndividualorCompany
									+ '', "N");
					row["Trade License Number"] = new asiTableValObj(
							"Trade License Number", '', "N");
					row["Name in Arabic"] = new asiTableValObj("Name in Arabic",
							ownerNameinArabic + '', "N");
					row["Name in English"] = new asiTableValObj("Name in English",
							ownerNameinEnglish + '', "N");
					row["Mobile"] = new asiTableValObj("Mobile", mobile + '', "N");
					row["Email"] = new asiTableValObj("Email", email + '', "N");
					details.push(row)
	
				}
	
				this.updateASIT("EXTRACTED OWNER DETAILS", details)
			}
		}
	}
	
	
	return retVal;
}

SPSABASE.prototype.fillGovernmentIntegrationValues = function(organizationVal) {

	var retVal = false;
    try {
		eval(getScriptText("INCLUDE_INTEGRATION"));
		eval(getScriptText("INCLUDE_UTILS"));
		var requestBody = {};
        var organizationValue = organizationVal;

        if(Utils.isBlankOrNull(organizationValue)){
	       organizationValue = this.getASI("ENTITY DETAILS", "Organization");
       }
        
        organizationId = Utils.getLookupValue("SD_Organization_list", organizationValue);
		requestBody.organizationId = organizationId
		var res = INTEGRATION.getDHROrganizationEmployeeCount(requestBody);
	
		if (res.data.success) {
			var employeesCount = this.getASI("ENTITY DETAILS", "Number of Employees")
            if(employeesCount != res.data.Organization_Employee_Count.EmployeesCount) {
				retVal = true;
			}

                this.editASI("ENTITY DETAILS", "Extracted Number of Employees"
                    , res.data.Organization_Employee_Count.EmployeesCount)
                this.editASI("ENTITY DETAILS", "Entity Name in English"
                    , res.data.Organization_Employee_Count.Organization_Name_English)
                this.editASI("ENTITY DETAILS", "Extracted Entity Name in English"
                    , res.data.Organization_Employee_Count.Organization_Name_English)
                this.editASI("ENTITY DETAILS", "Entity Name in Arabic"
                    , res.data.Organization_Employee_Count.Organization_Name_Arabic)
                this.editASI("ENTITY DETAILS", "Extracted Entity Name in Arabic"
                    , res.data.Organization_Employee_Count.Organization_Name_Arabic)
           
		}
    } catch (e) {
		
	}
	
	return retVal;
}

SPSABASE.prototype.fillSEDDIntegrationValues = function(licId){
	
	var retVal = false;
	try
	{
		
		eval(getScriptText("INCLUDE_INTEGRATION"));
		var res = INTEGRATION.seddGetLicenseDetails(String(licId));
	
		if(res.success){
		
		var data = res.data;
	
		var extractedActivities = '';
		var activities = data.activities;
		for ( var x in activities) {
			var activity = activities[x];
			extractedActivities += activity['actNameEn'] + '|' + activity['actNameAr'];
	
			if (activities.length - 1 > x) {
				extractedActivities += ', ';
			}
		}
	
		var obj = {
			extractedActivities : String(extractedActivities),
			extractedAdress_Ar : String(data.adress_Ar) == "undefined" ? "" : String(data.adress_Ar),
			extractedAdress_En : String(data.adress_En) == "undefined" ? "" : String(data.adress_En),
			extractedBranch_Ar :String(data.branch_Ar) == "undefined" ? "" : String(data.branch_Ar),
			extractedBranch_En : String(data.branch_En) == "undefined" ? "" : String(data.branch_En),
			extractedExpirydate :String(data.expirydate) == "undefined" ? "" : String(data.expirydate), 
			extractedIs_WareHouse : String(data.is_WareHouse) == "undefined" ? "" : String(data.is_WareHouse),
			extractedIssuedate : String(data.issuedate) == "undefined" ? "" : String(data.issuedate),
			extractedLeagl_Type_Ar : String(data.leagl_Type_Ar) == "undefined" ? "" : String(data.leagl_Type_Ar),
			extractedLeagl_Type_En : String(data.leagl_Type_En) == "undefined" ? "" : String(data.leagl_Type_En),
			extractedLic_Id : String(data.lic_Id) == "undefined" ? "" : String(data.lic_Id),
			extractedLic_Type_Ar : String(data.lic_Type_Ar) == "undefined" ? "" : String(data.lic_Type_Ar),
			extractedLic_Type_En : String(data.lic_Type_En) == "undefined" ? "" : String(data.lic_Type_En),
			extractedMobile :  String(data.mobile) == "undefined" ? "" : String(data.mobile),
			extractedPost_Pox :String(data.post_Pox) == "undefined" ? "" : String(data.post_Pox),
			extractedRenew :String(data.renew) == "undefined" ? "" : String(data.renew),
			extractedRepresentitives_Ar :String(data.representitives_Ar) == "undefined" ? "" : String(data.representitives_Ar),
			extractedRepresentitives_En :String(data.representitives_En) == "undefined" ? "" : String(data.representitives_En),
			extractedTrd_Name_Ar :String(data.trd_Name_Ar) == "undefined" ? "" : String(data.trd_Name_Ar),
			extractedTrd_Name_En :String(data.trd_Name_En) == "undefined" ? "" : String(data.trd_Name_En)
		}
	
		this.editASI("EXTRACTED ACTIVITIES","Extracted Activities",obj.extractedActivities);
		this.editASI("ADDRESS DETAILS","Extracted Address in Arabic",obj.extractedAdress_Ar);
		this.editASI("ADDRESS DETAILS","Extracted Address in English",obj.extractedAdress_En);
		this.editASI("SEDD ADDITIONAL VALUES", "Extracted Branch Ar",obj.extractedBranch_Ar);
		this.editASI("SEDD ADDITIONAL VALUES", "Extracted Branch En",obj.extractedBranch_En);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Expiry date",obj.extractedExpirydate);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Is Warehouse",obj.extractedIs_WareHouse);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Issue date",obj.extractedIssuedate);
		this.editASI("SEDD ADDITIONAL VALUES", "Extracted Legal Type Ar",obj.extractedLeagl_Type_Ar);
		this.editASI("SEDD ADDITIONAL VALUES", "Extracted Legal Type En",obj.extractedLeagl_Type_En);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Lic Id",obj.extractedLic_Id);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Lic Type Ar",obj.extractedLic_Type_Ar);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Lic Type En",obj.extractedLic_Type_En);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Post Pox",obj.extractedPost_Pox);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Renew",obj.extractedRenew);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Representatives Ar",obj.extractedRepresentitives_Ar);
		this.editASI("SEDD ADDITIONAL VALUES","Extracted Representatives En",obj.extractedTrd_Name_En);
		this.editASI("ENTITY DETAILS","Extracted Entity Contact Number",obj.extractedMobile);
		this.editASI("ENTITY DETAILS","Extracted Entity Name in English",obj.extractedTrd_Name_En);
		this.editASI("ENTITY DETAILS","Extracted Entity Name in Arabic",obj.extractedTrd_Name_Ar);
		
		var companyNameEN  = this.getASI("ENTITY DETAILS", "Entity Name in English")
		if(companyNameEN.toLowerCase() != obj.extractedTrd_Name_En.toLowerCase())
		{
			retVal = true;
		}

		var companyNameAR  = this.getASI("ENTITY DETAILS", "Entity Name in Arabic")
		if(companyNameAR.toLowerCase() != obj.extractedTrd_Name_Ar.toLowerCase())
		{
			retVal = true;
		}
			
		var contactNo  = this.getASI("ENTITY DETAILS", "Entity Contact Number");
		if(contactNo != obj.extractedMobile)
		{
			retVal = true;
		}
		}
	}catch(e)
	{
		aa.print(e)
	}
	
	return retVal;
}
SPSABASE.prototype.fillMunicipalityExtractedFields = function(proProfile) {
	var retVal = {};
	try {

		eval(getScriptText("INCLUDE_INTEGRATION"));
		eval(getScriptText('INCLUDE_PARP'));
		eval(getScriptText('INCLUDE_PRPL'));

		var projectId = this.getASI('PROJECT DETAILS', 'Project ID')
		var res = INTEGRATION.shjMunGetProjectInfo(String(projectId));

		if (res.success) {
			var data = res.data;
			for ( var x in data) {
				var rec = data[x];

				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Project Key', emp(String(projectId)))
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Project Key', emp(String(projectId)))
				
				var city_name = rec['city_name'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted City', emp(String(city_name)))
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted City', emp(String(city_name)))

				var prj_type = rec['prj_type'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Project Type', emp(String(prj_type)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Project Type', emp(String(prj_type)));

				var prj_desc = rec['prj_desc'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Project Specification', emp(String(prj_desc)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Project Specification', emp(String(prj_desc)));

				var bld_desc = rec['bld_desc'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Building Name', emp(String(bld_desc)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Building Name', emp(String(bld_desc)));

				var bld_area_desc = rec['bld_area_desc'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Area', emp(String(bld_area_desc)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Area', emp(String(bld_area_desc)));

				var prj_start_date = rec['prj_start_date'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Expected Start Date', emp(String(prj_start_date)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Expected Start Date', emp(String(prj_start_date)));

				var prj_end_date = rec['prj_end_date'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Expected End Date', emp(String(prj_end_date)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Expected End Date', emp(String(prj_end_date)));

				var bldtype_desc = rec['bldtype_desc'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Building Type', emp(String(bldtype_desc)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Building Type', emp(String(bldtype_desc)));

				var bld_no_of_floors = rec['bld_no_of_floors'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Number of Floors', emp(String(bld_no_of_floors)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Number of Floors', emp(String(bld_no_of_floors)));

				var prj_status_desc = rec['prj_status_desc'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Project Status', emp(String(prj_status_desc)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Project Status', emp(String(prj_status_desc)));

				var bld_usage_desc = rec['bld_usage_desc'];
				this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Building Usage', emp(String(bld_usage_desc)));
				proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Building Usage', emp(String(bld_usage_desc)));

				var projectPlots = rec['prj_plot'];
				if(projectPlots.length > 0){
					var plt_areano = projectPlots[0]['plt_areano'];
					this.editASI('EXTRACTED MUNICIPALITY', 'Extracted Plot Number', emp(String(plt_areano)));
					proProfile.editASI('EXTRACTED MUNICIPALITY', 'Extracted Plot Number', emp(String(plt_areano)));	
				}
				
				var tradeLicNumber = rec['cont_lic_no'];
				var scopeOfWork = rec['cont_lic_desc'];
				var cont_email = rec['cont_email'];
				var cont_office_tel_no = rec['cont_office_tel_no'];
				var mobileNumber = rec['cont_mgr_mobile_no'];

				var cArray = new Array();
				var tmpRow = new Array();
				tmpRow["Company Email"] = emp(String(cont_email));
				tmpRow["Company Phone Number"] = emp(String(cont_office_tel_no));
				tmpRow["Mobile Number"] = emp(String(mobileNumber));
				tmpRow["Scope of work"] = emp(String(scopeOfWork));
				tmpRow["Trade License Number"] = emp(String(tradeLicNumber));
				cArray.push(tmpRow);

				this.addASITRows("EXTRACTED SUBCONTRACTORS DET", cArray);
				proProfile.addASITRows("EXTRACTED SUBCONTRACTORS DET", cArray);

				var prj_owner = rec['prj_owner'];
				for ( var p in prj_owner) {
					var owner_name = prj_owner[p]['owner_name'];
					var owner_phone = prj_owner[p]['owner_phone'];
					var owner_email = prj_owner[p]['owner_email'];
					var emirates_id = prj_owner[p]['emirates_id'];

					cArray = new Array();
					tmpRow = new Array();
					tmpRow["Owner Type"] = String('Individual');
					tmpRow["Building Owner Name"] = emp(String(owner_name));
					tmpRow["Owner Contact Number"] = emp(String(owner_phone));
					tmpRow["Owner Email"] = emp(String(owner_email));
					tmpRow["Owner Emirates ID"] = emp(String(emirates_id));
					cArray.push(tmpRow);

					this.addASITRows("EXTRACTED BUILDING OWNER INFO", cArray);
					proProfile.addASITRows("EXTRACTED BUILDING OWNER INFO", cArray);
				}

			}
		}

		retVal.success = true;
	} catch (e) {
		retVal.success = false;
	}

	return retVal;
}
SPSABASE.prototype.fillMOHREIntegrationValues = function(tradeLicense, city) {
    var retVal = {};
    try {
        eval(getScriptText("INCLUDE_INTEGRATION"));

        var res = INTEGRATION.mohreGetEstablishmentWithOwners(tradeLicense, city);
        if(res.success) {
            var data = res.data;
            if(data != null) {
                var totalEmployees = data.TotalEmployee;
                var totalSecurityGuards = data.TotalSecurityGuards;
                var totalSafetyOfficers = data.TotalSafetyOfficers;

                this.editASI("MOHRE INTEGRATION VALUES", "Extracted Total Employees", totalEmployees);
                this.editASI("MOHRE INTEGRATION VALUES", "Extracted Total Security Guards", totalSecurityGuards);
                this.editASI("MOHRE INTEGRATION VALUES", "Extracted Total Safety Officers", totalSafetyOfficers);

                var OwnersDetails = data.compnayOwners;
                var dataSet = new Array();
                for(var x in OwnersDetails) {
                    var owner = OwnersDetails[x];
                    var row = [];

                    var ownerNameEn = owner.ownerNameEnglish? owner.ownerNameEnglish: "";
                    var ownerNameAr = owner.ownerNameArabic? owner.ownerNameArabic: "";
                    var ownerPhone = owner.ownerPhone? owner.ownerPhone: "";
                    var ownerEmail = owner.ownerEmail? owner.ownerEmail: "";
                    var ownerPersonCode = owner.ownerPersonCode? owner.ownerPersonCode: "";

                    row["Name in English"] = new asiTableValObj("Name in English", ownerNameEn, "N");
                    row["Name in Arabic"] = new asiTableValObj("Name in Arabic", ownerNameAr, "N");
                    row["Phone"] = new asiTableValObj("Phone", ownerPhone, "N");
                    row["Email"] = new asiTableValObj("Email", ownerEmail, "N");
                    row["Person Code"] = new asiTableValObj("Person Code", ownerPersonCode, "N");
                    dataSet.push(row);

                }
                if(dataSet.length > 0) {
                    this.deleteASIT("MOHRE COMPANY OWNERS");
                    this.addASITRows("MOHRE COMPANY OWNERS", dataSet);
                }

               retVal.success = true;

            }
        }

    } catch (e) {
        java.lang.System.out.println("SPSABASE fillMOHREIntegrationValues - Error: " + e);
        retVal.success = false;
    }

    return retVal;
}
function emp(value) {
	if (!value || value == "null" || value == "undefined" || value == null || value == '') {
		value = ""
	}
	return value + "";
}
SPSABASE.getDueDateFromEffectiveDate = function(unit, time, effectiveDate) {
	var dueDate = new Date();

	effectiveDate = new Date(effectiveDate)
	if (unit == "Day") {
		dueDate.setDate(effectiveDate.getDate() + Number(time));
	} else if (unit == "Week") {
		dueDate.setDate(effectiveDate.getDate() + (7 * Number(time)));
	} else if (unit == "Month") {
		dueDate = new Date(today.setMonth(effectiveDate.getMonth() + Number(time)));
	}

	var retVal = Utils.formatDate(dueDate, "MM/dd/yyyy")
	return retVal;
}

SPSABASE.prototype.calculateEntityClassification = function()
{
	var activities = this.getASIT("ACTIVITIES DETAILS")
	var arr = [];
	var activityScore = 0;
	var classificationActivity = "";
	var activitiesHighScores = [];
	var educationScore = 0;
	for ( var x in activities) {
		var activity = activities[x]["Activity"];

		var subActivity = activities[x]["Sub-Activity"];
		var numberOfStudents = activities[x]["Number of Students"];
		var typeOfEducational = activities[x]["Type of Educational Facility"];
		var additionalActivities = activities[x]["Additional Activities"];

		var subActivityScore = 0;

		if (activity == "Education") {
			// var educScore = 0;
			// if (subActivity == "Number of Students") {
			subActivityScore += Number(Utils.getLookupValue("SD_NUMBER_STUDENTS",
					numberOfStudents));
			// } else if (subActivity == "Additional Activities") {
			var checkbox1 = activities[x]["Engineering, electrical, scientific laboratories"]
			if (checkbox1 == "CHECKED") {
				subActivityScore += Number(Utils.getLookupValue(
						"SD_ADDITIONAL_ACTIVITIES",
						"Engineering, electrical, scientific laboratories"));
			}

			var checkbox2 = activities[x]["Practical training"]
			if (checkbox2 == "CHECKED") {
				subActivityScore += Number(Utils.getLookupValue(
						"SD_ADDITIONAL_ACTIVITIES", "Practical training"));
			}

			// } else if (subActivity == "Type of Educational Facility") {
			subActivityScore += Number(Utils.getLookupValue(
					"SD_TYPE_OF_EDUCATIONAL_FACILITY", subActivity));
			// }

			// educationScore += Number(educScore);
		} else {
			subActivityScore = Utils.getLookupValue("SD_SUB_ACTIVITIES",
					subActivity);
		}

		if (!Utils.isBlankOrNull(subActivityScore)) {
			subActivityScore = Number(subActivityScore);
		} else {
			subActivityScore = 0
		}

		if (activityScore == 0 || subActivityScore > activityScore) {
			classificationActivity = activity;
		}

		if (subActivityScore == activityScore) {
			activitiesHighScores.push(activity)
		} else if (subActivityScore > activityScore) {
			activitiesHighScores = new Array()
			activitiesHighScores.push(activity)
		}
		activityScore = Math.max(activityScore, subActivityScore);

		// if (arr.toString().indexOf(activity) == -1) {
		// arr.push(String(activity));
		// arr[activity] = subActivityScore;
		// } else {
		// if (activity == "Education") {
		// arr[activity] += subActivityScore;
		// } else {
		// arr[activity] = Math.max(arr[activity], subActivityScore);
		// }
		//
		// }
	}

	if (activityScore == 0 || educationScore > activityScore) {
		classificationActivity = "Education";
	}

	activityScore = Math.max(activityScore, educationScore);

	// this.editASI("CLASSIFICATION DETAILS", "Activity Classification",
	// classificationActivity);

	var dataSet = [];
	var score = 0;
	score += activityScore;

	var data = [];
	data["Criteria"] = "Activity";
	data["Criteria Value"] = classificationActivity;
	data["Score"] = activityScore;

	dataSet.push(data)
	// for (var y = 0; y < arr.length; y++) {
	// score += arr[arr[y]];
	// }

	var entityType = this.getASI("", "Organization Type");
	var entityTypeScore = Utils.getLookupValue("SD_ORGANIZATION_TYPE",
			entityType);
	if (!Utils.isBlankOrNull(entityTypeScore)) {
		score += Number(entityTypeScore);
	}

	var data = [];
	data["Criteria"] = "Entity Type";
	data["Criteria Value"] = entityType;
	data["Score"] = entityTypeScore;

	dataSet.push(data)

	var numberOfEmployees = 0;

	if (entityType != "Outside Sharjah") {
		numberOfEmployees = this.getASI("", "Number of Employees");
		// if (Utils.isBlankOrNull(numberOfEmployees)) {
		// numberOfEmployees = Number(this.getASI(
		// "",
		// "Extracted Number of Employees"));
		// } else {
		numberOfEmployees = Number(numberOfEmployees);
		// }
	} else {
		numberOfEmployees = this.getASI("",
				"Number of Employees Dedicate To Work In Sharjah")
		// if (Utils.isBlankOrNull(numberOfEmployees)) {
		// numberOfEmployees = Number(this
		// .getASI(
		// "",
		// "Extracted Number of Employees Dedicate To Work In Sharjah"));
		// } else {
		numberOfEmployees = Number(numberOfEmployees);
		// }
	}

	if (numberOfEmployees <= 15) {
		var num1to15 = Utils
				.getLookupValue("SD_NUMBER_OF_EMPLOYEES", "1 to 15");
		score += Number(num1to15);

		var data = [];
		data["Criteria"] = "Number of Employees";
		data["Criteria Value"] = "1 to 15";
		data["Score"] = num1to15;
		dataSet.push(data)

	} else if (numberOfEmployees > 15 && numberOfEmployees <= 50) {
		var num16to50 = Utils.getLookupValue("SD_NUMBER_OF_EMPLOYEES",
				"16 to 50");
		score += Number(num16to50);

		var data = [];
		data["Criteria"] = "Number of Employees";
		data["Criteria Value"] = "16 to 50";
		data["Score"] = num16to50;
		dataSet.push(data)
	} else if (numberOfEmployees > 50 && numberOfEmployees <= 250) {
		var num51to250 = Utils.getLookupValue("SD_NUMBER_OF_EMPLOYEES",
				"51 to 250");
		score += Number(num51to250);

		var data = [];
		data["Criteria"] = "Number of Employees";
		data["Criteria Value"] = "51 to 250";
		data["Score"] = num51to250;
		dataSet.push(data)
	} else if (numberOfEmployees >= 251) {
		var num251plus = Utils.getLookupValue("SD_NUMBER_OF_EMPLOYEES", "251+");
		score += Number(num251plus);

		var data = [];
		data["Criteria"] = "Number of Employees";
		data["Criteria Value"] = "251+";
		data["Score"] = num251plus;
		dataSet.push(data)
	}

	var info1 = this.getASI("OTHER INFORMATION DETAILS",
			"Other Information 1");
	var info2 = this.getASI("OTHER INFORMATION DETAILS",
			"Other Information 2");
	var info3 = this.getASI("OTHER INFORMATION DETAILS",
			"Other Information 3");
	var info4 = this.getASI("CONTRACTOR", "Other Information 4");

	if (info1 == "CHECKED") {
		var info1Score = Utils.getLookupValue("SD_OTHER_INFORMATION_DETAILS",
				"Provide employee/student transport and accommodation");

		score += Number(info1Score);

		var data = [];
		data["Criteria"] = "Accommodation & Transportation";
		data["Criteria Value"] = "Provide employee/student transport and accommodation";
		data["Score"] = info1Score;
		dataSet.push(data)
	} else {
		if (info2 == "CHECKED") {
			var info2Score = Utils.getLookupValue(
					"SD_OTHER_INFORMATION_DETAILS",
					"Provide employee/student accommodation only");

			score += Number(info2Score);

			var data = [];
			data["Criteria"] = "Accommodation & Transportation";
			data["Criteria Value"] = "Provide employee/student accommodation only";
			data["Score"] = info2Score;
			dataSet.push(data)
		}
		if (info3 == "CHECKED") {
			var info3Score = Utils.getLookupValue(
					"SD_OTHER_INFORMATION_DETAILS",
					"Provide employee/student transport only");

			score += Number(info3Score);

			var data = [];
			data["Criteria"] = "Accommodation & Transportation";
			data["Criteria Value"] = "Provide employee/student transport only";
			data["Score"] = info3Score;
			dataSet.push(data)
		}
	}
	if (info4 == "CHECKED") {
		var info4Score = Utils.getLookupValue("SD_OTHER_INFORMATION_DETAILS",
				"Use contractors and /or contractor employees");

		score += Number(info4Score);

		var data = [];
		data["Criteria"] = "Contractor";
		data["Criteria Value"] = "Use contractors and /or contractor employees";
		data["Score"] = info4Score;
		dataSet.push(data)
	}

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

	var classificationActivity = "";
	if (activitiesHighScores.length > 1) {
		classificationActivity = SPSABASE.getHighestESDEFee(activitiesHighScores,
				classificationLevel);

		if (classificationActivity == null) {
			classificationActivity = SPSABASE.getHighestRenewalFee(activitiesHighScores,
					classificationLevel);

			if (classificationActivity == null) {
				classificationActivity = SPSABASE.getErliestFutureRequirementsDate(
						activitiesHighScores, classificationLevel);

				if (classificationActivity == null) {
					classificationActivity = activitiesHighScores[activitiesHighScores.length - 1];
				}
			}
		}

	} else {
		classificationActivity = activitiesHighScores[0];
	}

	this.editASI("CLASSIFICATION DETAILS", "Activity Classification",
			classificationActivity);
	

	dataSet[0]["Criteria Value"] = classificationActivity;
	this.updateASIT("SCORE DETAILS", dataSet);

	this.editASI("CLASSIFICATION DETAILS", "Score", score);

	
	return classificationLevel;	
}

SPSABASE.getHighestESDEFee = function(activitiesHighScores, level) {
	var retVal = null;
	var highestFees = 0;
	var amounts = [];
	for ( var x in activitiesHighScores) {
		var data = SPSAGS.getSelfDeclarationByActivity(activitiesHighScores[x]);
		if (data.length > 0) {
			var oldRefFee = Record.getReferenecFee(data[0][level],
					"SELF DECLARATION FEES");
			var amount = Number(oldRefFee.getFormula());

			amounts.push(amount)
			if (highestFees == 0) {
				highestFees = amount
				retVal = data[0]["Activity"]
			}

			if (amount > highestFees) {
				highestFees = amount
				retVal = data[0]["Activity"]
			}

		}
	}

	var countOdHighestValue = 0
	for ( var x in amounts) {
		if (amounts[x] == highestFees) {
			countOdHighestValue++;
		}
	}

	if (countOdHighestValue > 1) {
		return null
	}

	return retVal;
}


//{
//	var activities = this.getASIT("ACTIVITIES DETAILS")
//	var arr = [];
//	var activityScore =0;
//	var classificationActivity = "";
//	var educationScore = 0;
//	for ( var x in activities) {
//		var activity = activities[x]["Activity"];
//		var subActivity = activities[x]["Sub-Activity"];
//		var numberOfStudents = activities[x]["Number of Students"];
//		var typeOfEducational = activities[x]["Type of Educational Facility"];
//		var additionalActivities = activities[x]["Additional Activities"];
//		
//		var subActivityScore = 0;
//
//		if (activity == "Education") {
//			var educScore = 0;
//			if (subActivity == "Number of Students") {
//				educScore = Utils.getLookupValue("SD_NUMBER_STUDENTS",
//						numberOfStudents);
//			} else if (subActivity == "Additional Activities") {
//				educScore = Utils.getLookupValue(
//						"SD_ADDITIONAL_ACTIVITIES", additionalActivities);
//			} else if (subActivity == "Type of Educational Facility") {
//				educScore = Utils.getLookupValue(
//						"SD_TYPE_OF_EDUCATIONAL_FACILITY", typeOfEducational);
//			}
//			
//			educationScore += Number(educScore);
//		} else {
//			subActivityScore = Utils.getLookupValue("SD_SUB_ACTIVITIES",
//					subActivity);
//		}
//
//		if (!Utils.isBlankOrNull(subActivityScore)) {
//			subActivityScore = Number(subActivityScore);
//		} else {
//			subActivityScore = 0
//		}
//
//		if(activityScore == 0 || subActivityScore > activityScore)
// 		{
//			classificationActivity = activity;
//		}
//		
//		activityScore =  Math.max(activityScore, subActivityScore);
//		
////		if (arr.toString().indexOf(activity) == -1) {
////			arr.push(String(activity));
////			arr[activity] = subActivityScore;
////		} else {
////			if (activity == "Education") {
////				arr[activity] += subActivityScore;
////			} else {
////				arr[activity] = Math.max(arr[activity], subActivityScore);
////			}
////
////		}
//	}
//	
//	if (activityScore == 0 || educationScore > activityScore) {
//		classificationActivity = "Education";
//	}
//
//	activityScore = Math.max(activityScore, educationScore);
//		
//	this.editASI("CLASSIFICATION DETAILS",
//			"Activity Classification", classificationActivity);
//
//	var dataSet = [];
//	var score = 0;
//	score += activityScore;
//	
//	var row = [];
//	row["Criteria"] = "Activity";
//	row["Criteria Value"] = classificationActivity;
//	row["Score"] =  activityScore;
//	
//	dataSet.push(row)
////	for (var y = 0; y < arr.length; y++) {
////		score += arr[arr[y]];
////	}
//
//	var entityType = this.getASI("",
//			"Organization Type");
//	var entityTypeScore = Utils.getLookupValue("SD_ORGANIZATION_TYPE", entityType);
//	if (!Utils.isBlankOrNull(entityTypeScore)) {
//		score += Number(entityTypeScore);
//	}
//	
//	var row = [];
//	row["Criteria"] = "Entity Type";
//	row["Criteria Value"] = entityType;
//	row["Score"] =  entityTypeScore;
//	
//	dataSet.push(row)
//
//	var numberOfEmployees = 0;
//
//	if (entityType != "Outside Sharjah") {
//		numberOfEmployees = this.getASI("",
//				"Number of Employees");
////		if (Utils.isBlankOrNull(numberOfEmployees)) {
////			numberOfEmployees = Number(this.getASI(
////					"",
////					"Extracted Number of Employees"));
////		} else {
//			numberOfEmployees = Number(numberOfEmployees);
////		}
//	} else {
//		numberOfEmployees = this.getASI(
//				"",
//				"Number of Employees Dedicate To Work In Sharjah")
////		if (Utils.isBlankOrNull(numberOfEmployees)) {
////			numberOfEmployees = Number(this
////					.getASI(
////							"",
////							"Extracted Number of Employees Dedicate To Work In Sharjah"));
////		} else {
//			numberOfEmployees = Number(numberOfEmployees);
////		}
//	}
//
//	if (numberOfEmployees <= 15) {
//		var num1to15 = Utils.getLookupValue("SD_NUMBER_OF_EMPLOYEES", "1 to 15");
//		score += Number(num1to15);
//		
//		var row = [];
//		row["Criteria"] = "Number of Employees";
//		row["Criteria Value"] = "1 to 15";
//		row["Score"] =  num1to15;
//		dataSet.push(row)
//		
//	} else if (numberOfEmployees > 15 && numberOfEmployees <= 50) {
//		var num16to50 = Utils.getLookupValue("SD_NUMBER_OF_EMPLOYEES", "16 to 50");
//		score += Number(num16to50);
//
//		var row = [];
//		row["Criteria"] = "Number of Employees";
//		row["Criteria Value"] = "16 to 50";
//		row["Score"] =  num16to50;
//		dataSet.push(row)
//	} else if (numberOfEmployees > 50 && numberOfEmployees <= 250) {
//		var num51to250 = Utils.getLookupValue("SD_NUMBER_OF_EMPLOYEES", "51 to 250");
//		score += Number(num51to250);
//
//		var row = [];
//		row["Criteria"] = "Number of Employees";
//		row["Criteria Value"] = "51 to 250";
//		row["Score"] =  num51to250;
//		dataSet.push(row)
//	} else if (numberOfEmployees >= 251) {
//		var num251plus = Utils.getLookupValue("SD_NUMBER_OF_EMPLOYEES", "251+");
//		score += Number(num251plus);
//
//		var row = [];
//		row["Criteria"] = "Number of Employees";
//		row["Criteria Value"] = "251+";
//		row["Score"] =  num251plus;
//		dataSet.push(row)
//	}
//	
//
//
//	var info1 = this.getASI("OTHER INFORMATION DETAILS",
//			"Other Information 1");
//	var info2 = this.getASI("OTHER INFORMATION DETAILS",
//			"Other Information 2");
//	var info3 = this.getASI("OTHER INFORMATION DETAILS",
//			"Other Information 3");
//	var info4 = this.getASI("CONTRACTOR",
//			"Other Information 4");
//
//	if (info1 == "CHECKED") {
//		var info1Score = Utils.getLookupValue("SD_OTHER_INFORMATION_DETAILS",
//				"Provide employee/student transport and accommodation");
//
//		score += Number(info1Score);
//		
//		var row = [];
//		row["Criteria"] = "Accommodation & Transportation";
//		row["Criteria Value"] = "Provide employee/student transport and accommodation";
//		row["Score"] =  info1Score;
//		dataSet.push(row)
//	} else {
//		if (info2 == "CHECKED") {
//			var info2Score = Utils.getLookupValue(
//					"SD_OTHER_INFORMATION_DETAILS",
//					"Provide employee/student accommodation only");
//
//			score += Number(info2Score);
//			
//			var row = [];
//			row["Criteria"] = "Accommodation & Transportation";
//			row["Criteria Value"] = "Provide employee/student accommodation only";
//			row["Score"] =  info2Score;
//			dataSet.push(row)
//		}
//		if (info3 == "CHECKED") {
//			var info3Score = Utils.getLookupValue(
//					"SD_OTHER_INFORMATION_DETAILS",
//					"Provide employee/student transport only");
//
//			score += Number(info3Score);
//
//			var row = [];
//			row["Criteria"] = "Accommodation & Transportation";
//			row["Criteria Value"] = "Provide employee/student transport only";
//			row["Score"] =  info3Score;
//			dataSet.push(row)
//		}
//	}
//	if (info4 == "CHECKED") {
//		var info4Score = Utils.getLookupValue("SD_OTHER_INFORMATION_DETAILS",
//				"Use contractors and /or contractor employees");
//
//		score += Number(info4Score);
//		
//
//		var row = [];
//		row["Criteria"] = "Contractor";
//		row["Criteria Value"] = "Use contractors and /or contractor employees";
//		row["Score"] =  info4Score;
//		dataSet.push(row)
//	}
//
//	this.updateASIT("SCORE DETAILS", dataSet);
//	
//	this.editASI("CLASSIFICATION DETAILS",
//			"Score", score);
//
//	var classificationLevel = "";
//	if (score >= 5 && score <= 20) {
//		classificationLevel = "Level 1"
//	} else if (score >= 21 && score <= 40) {
//		classificationLevel = "Level 2"
//	} else if (score >= 41 && score <= 60) {
//		classificationLevel = "Level 3"
//	} else if (score >= 61 && score <= 75) {
//		classificationLevel = "Level 4"
//	} else if (score >= 76) {
//		classificationLevel = "Level 5"
//	}
//
//	return classificationLevel;
//}

SPSABASE.getHighestRenewalFee = function(activitiesHighScores, level) {
	var retVal = null;
	var highestFees = 0;
	var amounts = [];
	for ( var x in activitiesHighScores) {
		var data = SPSAGS.getRenewalByActivity(activitiesHighScores[x]);

		if (data.length > 0) {
			var oldRefFee = Record.getReferenecFee(data[0][level],
					"UPDATE ENTITY PROFILE FEES");
			var amount = Number(oldRefFee.getFormula());
			amounts.push(amount)
			if (highestFees == 0) {
				highestFees = amount
				retVal = data[0]["Activity"]
			}

			if (amount > highestFees) {
				highestFees = amount
				retVal = data[0]["Activity"]
			}

		}
	}

	var countOdHighestValue = 0
	for ( var x in amounts) {
		if (amounts[x] == highestFees) {
			countOdHighestValue++;
		}
	}

	if (countOdHighestValue > 1) {
		return null
	}

	return retVal;
}

SPSABASE.getErliestFutureRequirementsDate = function(activitiesHighScores, level) {

	var retVal = null;
	var earliestTime = 0;
	var times = [];
	for ( var x in activitiesHighScores) {
		java.lang.System.out.println(activitiesHighScores[x])
		var time = SPSAGS.getSelfDeclarationSubmissionTimeByDays(
				activitiesHighScores[x], level);
		if (time > 0) {

			time = Number(time);
			java.lang.System.out.println(time)
			java.lang.System.out.println(earliestTime)
			times.push(time)
			if (earliestTime == 0) {
				earliestTime = time
				retVal = activitiesHighScores[x]
			}
			java.lang.System.out.println(time < earliestTime)
			if (time < earliestTime) {
				java.lang.System.out.println("earliestTime " + earliestTime)
				java.lang.System.out.println("time " + time)
				java.lang.System.out.println("activity " + activitiesHighScores[x])
				earliestTime = time
				retVal = activitiesHighScores[x]
			}
		}

		// }
	}

	var countHighestValue = 0
	for ( var x in times) {
		if (times[x] == earliestTime) {
			countHighestValue++;
		}
	}

	if (countHighestValue > 1) {
		return null
	}

	return retVal;
}


SPSABASE.prototype.voidInvoicedFees = function() {
	var fees = aa.finance.getFeeItemByCapID(this.capId).getOutput();
	var voidedInvoices = [];
	var status = "VOIDED";
	if (fees != null) {
		for (var i = 0; i < fees.length; i++) {
			var feelItem = fees[i].getF4FeeItem();
			var feeID = feelItem.getFeeSeqNbr();
			feelItem.setFeeitemStatus(status);
			feelItem.setFee(0.0);
			aa.finance.editFeeItem(feelItem);
			var feeInvoiceScriptModel = aa.finance.getValidFeeItemInvoiceByFeeNbr(this.capId, feeID).getOutput();
			if (feeInvoiceScriptModel != null) {
				var feeInvoice = feeInvoiceScriptModel.getX4FeeItemInvoice();
				var invoiceID = feeInvoice.getInvoiceNbr();
				
				if(feeInvoice.getFeeitemStatus() == 'INVOICED'){
					feeInvoice.setFeeitemStatus(status);
					feeInvoice.setFee(0.0);
					aa.finance.editFeeItemInvoice(feeInvoice);
					aa.finance.editInvoiceBalanceDue(invoiceID, 0.0, 0.0);
					voidedInvoices.push(invoiceID);
					
					var capDetailScriptModel = aa.cap.getCapDetail(this.capId).getOutput();
					if (capDetailScriptModel != null) {
						var capDetail = capDetailScriptModel.getCapDetailModel();
						capDetail.setBalance(0.0);
						aa.cap.editCapDetail(capDetail);
					}
				}

			}
		}
	}
	return voidedInvoices;
}

SPSABASE.prototype.handleWorkflowTaskUpdateAfterForReports = function(wfTask,wfStatus,wfProcess,englishServiceName,arabicServiceName)
{
	var completedWithReport = false;
	var completedWithoutReport = false;

	if(wfTask == 'Review/Update the Checklist - Appoint Inspector(s)' && wfStatus == 'Assign'){
		var inspectorName = this.assignInspectorToTask();
		
		var actionHistory = this.getASIT('ACTION HISTORY');
		
		var asit = new ASIT("ACTION HISTORY");
		for ( var p in actionHistory) {
			if(actionHistory[p]['Status'] == 'Pending Approval' && actionHistory[p]['Inspector Name'] == inspectorName){
				asit.modifyFieldValue(p, "Status", "Declined")
			} else if(actionHistory[p]['Status'] == 'Pending Approval' && actionHistory[p]['Inspector Name'] != inspectorName){
				asit.modifyFieldValue(p, "Status", "Approved")
			}
		}

		if (!asit.isEmpty()) {
			this.updateASITColumns(asit);
		}
	}
	if(wfTask == 'Conduct Inspection' && wfStatus == 'Reject'){
		this.cancelAllInspections();
	}
	
	
	if(wfTask == SPSABASE.CONST.WF.reviewUpdatetheChecklistAppointInspectors.wfTask){
		if(wfStatus == SPSABASE.CONST.WF.reviewUpdatetheChecklistAppointInspectors.wfStatus.assign)
		{
			this.assignInspectorToTask();
		}
		else if(wfStatus == SPSABASE.CONST.WF.reviewUpdatetheChecklistAppointInspectors.wfStatus.cancelInspection)
		{
			this.cancelAllInspections()
		}
	}
	
	if (wfTask == SPSABASE.CONST.WF.conductInspection.wfTask ){
		if(wfStatus == SPSABASE.CONST.WF.conductInspection.wfStatus.complete) {
			this.deactivateTask(SPSABASE.CONST.WF.reviewUpdatetheChecklistAppointInspectors.wfTask);
			var assistantInspection = this.getAssistantInspection();
			if (assistantInspection == null || assistantInspection.length == 0) {
				this.deactivateTask(SPSABASE.CONST.WF.receivedInspectionResults.wfTask);
				this.activateTask(SPSABASE.CONST.WF.reviewInspectionFeedbackandReport.wfTask);
			
			} else {
				this.activateTask(SPSABASE.CONST.WF.receivedInspectionResults.wfTask,false);
				this.assignInspectorToTask();
			}
			//TODO: SHABIB to validate why do we change on the primary inspector checklist
			//this.copyChecklistsResults();
			this.prepareCloseoutItems();
		}
//		else if(wfStatus == SPSABASE.CONST.WF.conductInspection.wfStatus.reject){
//			this.cancelAllInspections()
//		}
	}
	if (wfTask == SPSABASE.CONST.WF.reviewReport.wfTask){
		try
		{
		
		var tsis = this.fillReportsTSIsDetails(wfTask ,wfStatus);

		var decision = tsis.decision;
		this.updateInspectionHistory(decision);

		if (wfStatus == SPSABASE.CONST.WF.reviewReport.wfStatus.escalate || 
				wfStatus == SPSABASE.CONST.WF.reviewReport.wfStatus.escalateToManager){
			this.attachSubProcess(SPSABASE.CONST.WF.approvalLevels.wfTask,wfStatus,
					SPSABASE.CONST.SUBPROCESS.wfProcess.wfName);
			
			var subProcessTask = SPSABASE.CONST.SUBPROCESS.wfProcess.wfTask.deputyManagerReview;
			if(wfStatus == SPSABASE.CONST.WF.reviewReport.wfStatus.escalateToManager)
			{
				subProcessTask = SPSABASE.CONST.SUBPROCESS.wfProcess.wfTask.managerReview;
			}
			
			this.setTSISubProcess(subProcessTask, SPSABASE.TSI.decision.decision, this.getTSI(wfTask, SPSABASE.TSI.decision.decision));
			this.setTSISubProcess(subProcessTask, SPSABASE.TSI.decision.closeOutTiming, this.getTSI(wfTask, SPSABASE.TSI.decision.closeOutTiming));
			
		}else if (wfStatus == SPSABASE.CONST.WF.reviewReport.wfStatus.completeWithReport) {
//			if(!Utils.isBlankOrNull(decision))
//			{
				completedWithReport = true;
//			}
//			else
//			{
//				completedWithoutReport = true;
//			}
		}else if(wfStatus == SPSABASE.CONST.WF.reviewReport.wfStatus.completeWithReport)
			{
				completedWithoutReport = true;
			}
//		else if (wfStatus == SPSABASE.CONST.WF.enforcementCheck.wfStatus.completedwithoutReport) {
//			completedWithoutReport = true;
//		}
		
		}
		catch(e)
		{
			java.lang.System.out.println("wtfa ==> exception " + e);
		}
	}
	if (wfProcess == SPSABASE.CONST.SUBPROCESS.wfProcess.wfName) {
		if(wfStatus.equals(SPSABASE.CONST.SUBPROCESS.wfProcess.wfStatus.sendBack)){
			message = ''
			capId = this.getCapID();
			this.handleSubProcessSendBack(wfTask,wfStatus,SPSABASE.CONST.WF.reviewReport.wfTask);
			var decision = this.getTSISubProcess(wfTask, SPSABASE.TSI.decision.decision);
			var closeOutTiming = this.getTSISubProcess(wfTask, SPSABASE.TSI.decision.closeOutTiming);
			this.setTSISubProcess(SPSABASE.CONST.WF.reviewReport.wfTask, SPSABASE.TSI.decision.decision, decision);
			this.setTSISubProcess(SPSABASE.CONST.WF.reviewReport.wfTask, SPSABASE.TSI.decision.closeOutTiming, closeOutTiming);
			this.fillReportsTSIsDetails(wfTask ,wfStatus, true);
		}
		else if(wfStatus.equals(SPSABASE.CONST.SUBPROCESS.wfProcess.wfStatus.completeWithReport) || wfStatus.equals(SPSABASE.CONST.SUBPROCESS.wfProcess.wfStatus.completeWithoutReport)){
			//completedWithReport = true;
			var tsis = this.fillReportsTSIsDetails(wfTask ,wfStatus, true);

			var decision = tsis.decision;
			if(wfStatus.equals(SPSABASE.CONST.SUBPROCESS.wfProcess.wfStatus.completeWithReport))
			{
				completedWithReport = true;
			}
			else
			{
				completedWithoutReport = true;
			}
			this.updateTaskAndHandleDisposition(SPSABASE.CONST.WF.approvalLevels.wfTask, wfStatus, "");
//		}else if(wfStatus.equals(SPSABASE.CONST.SUBPROCESS.wfProcess.wfStatus.completedwithoutReport)){
//			completedWithoutReport = true;
//			this.fillReportsTSIsDetails(wfTask ,wfStatus);
//			this.updateTaskAndHandleDisposition(SPSABASE.CONST.WF.approvalLevels.wfTask, SPSABASE.CONST.WF.approvalLevels.wfStatus.completedwithoutReport, "");
		}else if(wfStatus.equals(SPSABASE.CONST.SUBPROCESS.wfProcess.wfStatus.reject))
		{
			this.updateTaskAndHandleDisposition(SPSABASE.CONST.WF.approvalLevels.wfTask, SPSABASE.CONST.WF.approvalLevels.wfStatus.reject, "");
			
		}else if(wfStatus == "Escalate")
		{
//			var decision = this.getTSISubProcess(wfTask, SPSABASE.TSI.decision.decision);
//			var closeOutTiming = this.getTSISubProcess(wfTask, SPSABASE.TSI.decision.closeOutTiming);
			var tsis = this.fillReportsTSIsDetails(wfTask ,wfStatus, true);
			var tsisArray = new Array();
			var decisionObj = {};
			decisionObj.key = "Decision";
			decisionObj.value = tsis.decision;
			

			var closeOuttimingObj = {};
			closeOuttimingObj.key = "Close-out Timing";
			closeOuttimingObj.value = tsis.closeOutTiming;
			
			tsisArray.push(decisionObj)
			tsisArray.push(closeOuttimingObj)
			
			this.fillApprovalLevelTSIs(wfTask, tsisArray);

		}
	}
	
	java.lang.System.out.println("completedWithoutReport " + completedWithoutReport)
	java.lang.System.out.println("completedWithReport " + completedWithReport)
	if (completedWithoutReport || completedWithReport) {

		if (completedWithReport) {
			var parentProfile = null;
			
			var parentId = this.getASI("", "Entity Profile ID");
	
			if (!Utils.isBlankOrNull(parentId)) {
				parentProfile = new EPRF(parentId);
			}
			
			var comments = this.getWorkflowTaskComment(wfTask, wfStatus);
			this.editASI("DECISION DETAILS", "Comments", comments);
			
	
			var closeOutTiming = this.getASI("CLOSE-OUT TIMING", "Close-out Timing");
			var closeOutDueDate = null;
			if(!Utils.isBlankOrNull(closeOutTiming))
			{
				closeOutTiming = Number(closeOutTiming);
				var today = new Date();
				var dueDate = new Date();
				dueDate.setDate(today.getDate() + Number(closeOutTiming));
				dueDate = Utils.formatDate(dueDate, "MM/dd/yyyy")
					closeOutDueDate = dueDate;
				var closeOutItems = this.getASIT("CLOSE OUT ITEMS");
				for(var x in closeOutItems)
				{
					this.updateASITColumn("CLOSE OUT ITEMS", x, IRRP.ASIT.closeOutItems.dueDate, dueDate);
				}
				
				this.copyCloseoutToProfile();
			}
			
			if (parentProfile != null) {
				var decision = this.handleEnforcement(parentProfile)
	
				//if (completedWithReport) {
					this.sendCompleteWithReportNotification(decision,englishServiceName,arabicServiceName,closeOutDueDate)
				//}
			}
			this.updateStatus("Completed with Report");
		}
		else
		{
			this.updateStatus("Completed without Report");
		}
	}	
}
SPSABASE.prototype.deactivateSubProcessTask = function(wfTask){
	var tasks = aa.workflow.getTasks(this.capId).getOutput();
	for ( var i in tasks) {
		var task = tasks[i];
		var taskName = task.getTaskDescription();
		if (taskName == wfTask) {
			var stepNumber = task.getStepNumber();
			if (task.getActiveFlag().equals("Y")) {
				aa.workflow.adjustTask(capId, task.getStepNumber(),task.getProcessID(), "N", task.getCompleteFlag(), task.getAssignmentDate(), task.getDueDate());
			}
		}
	}
}
SPSABASE.prototype.sendCompleteWithReportNotification = function(decision,englishServiceName,arabicServiceName,closeOutDueDate)
{
	eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
	var emailsArr = [];
	var contactArr = aa.people.getCapContactByCapID(this.getCapID()).getOutput();
	if (contactArr.length > 0) {
//		for (var q = 0; q < contactArr.length; q++) {
//			var contactOBj = new Object();
//			var contactModel = contactArr[q].getCapContactModel();
//			var contactType = contactModel.getContactType();
//			var email = contactModel.getEmail();
//			if (email && email != "") {
//				emailsArr.push(email);
//			}
//		}
        
		var emailParameters = aa.util.newHashtable();
		emailParameters.put("$$ALT_ID$$", this.getCustomID());
		emailParameters.put("$$SERVICE_NAME$$", englishServiceName);
		emailParameters.put("$$SERVICE_NAME_AR$$", arabicServiceName);
		var decision_ar = getDecisionArabisValue("SD_WF_DECISION", decision);
		emailParameters.put("$$DECISION$$", decision);
		emailParameters.put("$$DECISION_AR$$", decision_ar);
	
		var reportParameter = aa.util.newHashMap();
//		java.lang.System.out.println("===sendCompleteNotification reportId ==> " + reportId);
		reportParameter.put("recordid", this.getCustomID());
		reportParameter.put("capid", String(this.capId));
//		reportParameter.put("UserID", aa.getAuditID());
		reportParameter.put("agencyid", aa.getServiceProviderCode());
		
		
		var comments = this.getASI("DECISION DETAILS", "Comments");
		var decisionDate = this.getASI("DECISION DETAILS", "Decision Date");
		
		reportParameter.put("DecisionType" , decision)
		reportParameter.put("DecisionDate" , decisionDate)
		reportParameter.put("DecisionComment" , comments)
		

		var reportId = Number(Record.getLookupVal("INFORMATION_REPORT_INFO",
				"Violation Report"));
	
		this.saveReportToAttachment(this.getCapID(),reportId , "Violation Report", "",
				false, reportParameter);
		

		java.lang.System.out.println("CORP logs docuemnt saved");
		
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
//				if (documentList[i].getDocCategory() == "Violation Report") {
//					docArray.push(documentList[i]);
//				}
//			}
			

			var primary = this.getPrimaryInspection();
			if(primary)
				{
				var reportParameter = aa.util.newHashMap();
				java.lang.System.out.println("===sendCompleteNotification reportId ==> " + reportId);
				reportParameter.put("recordid", this.getCustomID());
				reportParameter.put("capid", String(this.capId));
//				reportParameter.put("UserID", aa.getAuditID());
				reportParameter.put("agencyid", aa.getServiceProviderCode());

				reportParameter.put("DueDate", closeOutDueDate);
				var reportId = Number(Record.getLookupVal("INFORMATION_REPORT_INFO",
						"Inspection Report"));
				
				this.saveReportToAttachment(this.getCapID(),reportId , "Inspection Report", "",
						false, reportParameter);
				
				
				}
			
			var documentList = this.getDocumentList();
			
			java.lang.System.out
					.println("===sendCompleteNotification documentList ==> "
							+ documentList.length);
			var docArray = [];
			for ( var i in documentList) {
		
				java.lang.System.out
						.println("===sendCompleteNotification category ==> "
								+ documentList[i].getDocCategory());
				if (documentList[i].getDocCategory() == "Violation Report" || documentList[i].getDocCategory() == "Inspection Report") {
					docArray.push(documentList[i]);
				}
			}
		
		var gn = new GlobalNotifications();
		gn.sendNotification("Custom", "*", "Completed with Report",
				emailParameters, null, null, docArray, emailsArr);
//		GlobalNotifications.sendEmailByTemplate("GSSGNT-00006", emailsArr,
//				emailParameters);
	
		
		java.lang.System.out.println("CORP logs end");
	}
}
SPSABASE.prototype.sendCompleteWithoutReportNotification = function(decision,englishServiceName,arabicServiceName,closeOutDueDate)
{
	eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
	var emailsArr = [];
	var contactArr = aa.people.getCapContactByCapID(this.getCapID()).getOutput();
	if (contactArr.length > 0) {
//		for (var q = 0; q < contactArr.length; q++) {
//			var contactOBj = new Object();
//			var contactModel = contactArr[q].getCapContactModel();
//			var contactType = contactModel.getContactType();
//			var email = contactModel.getEmail();
//			if (email && email != "") {
//				emailsArr.push(email);
//			}
//		}

		var emailParameters = aa.util.newHashtable();
		emailParameters.put("$$ALT_ID$$", this.getCustomID());
		emailParameters.put("$$SERVICE_NAME$$", englishServiceName);
		emailParameters.put("$$SERVICE_NAME_AR$$", arabicServiceName);
		var decision_ar = getDecisionArabisValue("SD_WF_DECISION", decision);
		emailParameters.put("$$DECISION$$", decision);
		emailParameters.put("$$DECISION_AR$$", decision_ar);

		var reportParameter = aa.util.newHashMap();
//		java.lang.System.out.println("===sendCompleteNotification reportId ==> " + reportId);
		reportParameter.put("recordid", this.getCustomID());
		reportParameter.put("capid", String(this.capId));
//		reportParameter.put("UserID", aa.getAuditID());
		reportParameter.put("agencyid", aa.getServiceProviderCode());
		
		var comments = this.getASI("DECISION DETAILS", "Comments");
		var decisionDate = this.getASI("DECISION DETAILS", "Decision Date");
		
		reportParameter.put("DecisionType" , decision)
		reportParameter.put("DecisionDate" , decisionDate)
		reportParameter.put("DecisionComment" , comments)
		
		
		var reportId = Number(Record.getLookupVal("INFORMATION_REPORT_INFO",
				"Violation Report"));
		
		this.saveReportToAttachment(this.getCapID(),reportId , "Violation Report", "",
				false, reportParameter);
		

		java.lang.System.out.println("CORP logs docuemnt saved");
		
		var gn = new GlobalNotifications();
		gn.sendNotification("Custom", "*", "Completed with Report",
				emailParameters, null, null, [], emailsArr);
//		GlobalNotifications.sendEmailByTemplate("GSSGNT-00006", emailsArr,
//				emailParameters);
		

		java.lang.System.out.println("CORP logs end");
	}
}

SPSABASE.prototype.updateCustomIDByAsi = function(){
	if (!this.altId) {
		logDebug("**WARN updateAltIdByAsi(): " + this.capId + " no current altID");
		return false;
	}
	var newAltId = null;
	var currCapType = this.getCapType();
	if (!currCapType) {
		logDebug("**WARN updateAltIdByAsi(): Could not get capType " + this.capId);
		return false;
	}

	switch (String(currCapType.getCategory())) {
	case "IIRP":
		var asiVal = AInfo["Request Type"];
		if (asiVal == "Investigation Report Submission") {
			newAltId = this.altId.replace("IIRP", "IIRS");
		} else if (asiVal == "Extension Request") {
			newAltId = this.altId.replace("IIRP", "IIRE");
		}
		break;
	case "ESDE":
		var asiVal = AInfo["Request Type"];
		if (asiVal == "Self-Declaration Submission") {
			newAltId = this.altId.replace("ESDE", "ESDS");
		} else if (asiVal == "Self-Declaration Extension") {
			newAltId = this.altId.replace("ESDE", "ESDE");
		} else if (asiVal == "Self-Declaration Missed Submission") {
			newAltId = this.altId.replace("ESDE", "ESDM");
		}
		break;
	case "CORP":
		var asiVal = AInfo["Request Type"];
		if (asiVal == "Completion") {
			newAltId = this.altId.replace("CORP", "CORC");
		} else if (asiVal == "Extension") {
			newAltId = this.altId.replace("CORP", "CORE");
		}
		break;
	}
	if (newAltId == null || newAltId == "") {
		logDebug("**WARN updateAltIdByAsi() could not generate new ALTID for capId=" + this.capId + " appCategory=" + currCapType.getCategory());
		return false;
	}
	try {
		this.updateCustomID(newAltId);
		
		//refresh capId and altId
		this.capId = aa.cap.getCapID(newAltId).getOutput();
		this.altId = newAltId;
		return true;
	} catch (ex) {
		logDebug("**WARN updateAltIdByAsi() failed: " + ex);
		return false;
	}
}

function getDecisionArabisValue(stdChoice, stdDesc) {
	var val = stdDesc;
	// " + stdChoice + "
	// " + stdDesc + "
	var sqlQuery = "SELECT VI18N.BIZDOMAIN_VALUE FROM RBIZDOMAIN_VALUE V " +
		"INNER JOIN RBIZDOMAIN_VALUE_I18N VI18N ON V.RES_ID = VI18N.RES_ID " +
		"WHERE V.BIZDOMAIN = '"  + stdChoice + "' AND V.BIZDOMAIN_VALUE = '" + stdDesc + "' AND VI18N.LANG_ID = 'ar_AE' ";
	var result = SPSABASE.runSQL(sqlQuery, null);
	if (result != null) {
		var data = result.toArray();
		if (data.length > 0) {
			return data[0]['BIZDOMAIN_VALUE'];
		}
	}
	return val;
}

SPSABASE.prototype.fillApprovalLevelTSIs = function(wfTask,tsisArray)
{
	var subProcessNextTask = "";
	switch (String(wfTask))
	{
		case "Section Head Review":
			subProcessNextTask = "Deputy Manager Review";
			break;
		case "Deputy Manager Review":
			subProcessNextTask = "Manager Review";
			break;
		case "Manager Review":
			subProcessNextTask = "SPSA Manager Review";
			break;
		case "SPSA Manager Review":
			subProcessNextTask = "SPSA Chairman Review";
			break;
	}
	for(var x in tsisArray)
	{
		this.createCapComment("subProcessNextTask " + subProcessNextTask)
		this.createCapComment("tsisArray[x].key " + tsisArray[x].key)
		this.createCapComment("tsisArray[x].value " + tsisArray[x].value)
		this.setTSISubProcess(subProcessNextTask, tsisArray[x].key, tsisArray[x].value);
	}

}


SPSABASE.getACAUrl = function()
{
	var acaUrl = "";
	var getBizDomain = aa.bizDomain.getBizDomainByValue("ACA_CONFIGS", "ACA_SITE").getOutput();
	if (getBizDomain && getBizDomain != "") {
		acaUrl = getBizDomain.getDescription();
		acaUrl = acaUrl.substring(0, acaUrl.toLowerCase().indexOf('admin'));
		acaUrl = acaUrl.replace("/CitizenAccess/", "/SPSA/");
		acaUrl += "Welcome.aspx"
	}
	return acaUrl;
}

SPSABASE.prototype.updateProfileAlert = function(key)
{
	var cap = this.getCapModel();

	var alertsDetails = cap.getQUD1();
	java.lang.System.out.println("1 " + alertsDetails)

	if (alertsDetails == null || alertsDetails == "") {
		if(key == "SD")
		{
			cap.setQUD1("EPR:0;SD:1");
		}
		else
		{
			cap.setQUD1("EPR:1;SD:0");
		}
		
	} else {
		var arr = alertsDetails.split(';');
		var newArray = [];
		for ( var x in arr) {
			if (arr[x].indexOf(key) > -1) {
				var sdValue = arr[x].split(":");
				var newValue = sdValue[0] + ":1";

				newArray.push(newValue)
			} else {
				newArray.push(arr[x])
			}
		}
		var str = "";
		for ( var y in newArray) {
			str += newArray[y] + ";"
		}
		
		cap.setQUD1(str);
	}
	
	aa.cap.editCapByPK(cap);
}

SPSABASE.prototype.removeProfileAlert = function(key)
{
	var cap = this.getCapModel();
    java.lang.System.out.println("SPSABASE removeProfileAlert Start ....");
	var alertsDetails = cap.getQUD1();
	java.lang.System.out.println("SPSABASE removeProfileAlert -  alertsDetails = " + alertsDetails)

	if (alertsDetails != null && alertsDetails != "") {
		var arr = alertsDetails.split(';');
		var newArray = [];
		for ( var x in arr) {
			if (arr[x].indexOf(key) > -1) {
				var sdValue = arr[x].split(":");
				var newValue = sdValue[0] + ":0";

				newArray.push(newValue)
			} else {
				newArray.push(arr[x])
			}
		}
		var str = "";
		for ( var y in newArray) {
			str += newArray[y] + ";"
		}
		

		if (str == "EPR:0;SD:0;") {
			str = "";
		}
		java.lang.System.out.println("SPSABASE removeProfileAlert str = " + str);
		cap.setQUD1(str);
	}
	
	aa.cap.editCapByPK(cap);
}
SPSABASE.getDepartmentUsers = function(deptName) {
	var arr = [];
	var userModel = aa.people.getSysUserListByDepartmentName(deptName).getOutput();
	
	for (u in userModel) {
		arr.push({
			text: String(userModel[u].getFullName()), 
			value : String(userModel[u].getUserID())
		});
	}
	
	return JSON.stringify(arr, null, 2);
}
SPSABASE.prototype.updateInspectionChecklistAnswersASIT = function(asitName) {
    try {

        var primaryInsp = this.getPrimaryInspection();
        var primaryInspID = primaryInsp.getIdNumber();
        var primaryInspAnswers = [];

        var checklists = primaryInsp.getGuideSheets().toArray();

        for(var i in checklists) {
            var items = checklists[i].getItems().toArray();
            for(var j in items) {
                var item = items[j];
                var itemText = item.getGuideItemText();
                var itemTextRes = item.getGuideItemStatus();
                primaryInspAnswers.push({
                    inspQuestion: itemText,
                    inspAnswer: itemTextRes
                });
            }
        }


        var inspections = aa.inspection.getInspections(this.capId);
        var dataSet = [];

        if(!inspections.getSuccess()) {
            throw inspections.getErrorMessage()
        }

        var inspArray = inspections.getOutput();
        for(i in inspArray) {
            if(inspArray[i].getIdNumber() != primaryInspID) {
                var inspModel = inspArray[i].getInspection();
                var guidesheets = inspModel.getGuideSheets();
                var guideSheetArray = guidesheets.toArray();
                for(var i in guideSheetArray) {
                    var guidesheet = guideSheetArray[i];
                    var gsItems = guidesheet.getItems();
                    var gsItemsArray = gsItems.toArray();
                    for(var j in gsItemsArray) {
                        var item = gsItemsArray[j];
                        var itemStatus = item.getGuideItemStatus();
                        var itemText = item.getGuideItemText();
                        var itemComments = item.getGuideItemComment();

                        for(var i in primaryInspAnswers) {
                            if(itemText == primaryInspAnswers[i].inspQuestion && itemStatus != null && itemStatus != primaryInspAnswers[i].inspAnswer) {
                                var inspectorName = inspModel.getInspector().getFullName();
                                var row = [];
                                row["Checklist Item"] = new asiTableValObj("Checklist Item", itemText, "N");
                                row["Team Lead Inspector Answer"] = new asiTableValObj("Team Lead Inspector Answer", primaryInspAnswers[i].inspAnswer, "N");
                                row["Team Member Name"] = new asiTableValObj("Team Member Name", inspectorName, "N");
                                row["Team Member Answer"] = new asiTableValObj("Team Member Answer", itemStatus, "N");
                                row["Team Member Comments"] = new asiTableValObj("Team Member Comments", itemComments, "N");
                                dataSet.push(row);
                            }

                        }
                    }

                }
            }
        }

        this.addASITRows(asitName, dataSet);

    } catch (e) {
        java.lang.System.out.println("SPSABASE updateInspectionChecklistAnswersASIT - Error: " + e);
    }
}
SPSABASE.prototype.updateEntityProfilesSubmission = function(key, isActive) {
    try {
        var cap = this.getCapModel();

        var submissionDetails = cap.getQUD1();
        aa.print("submissionDetails " + submissionDetails)
        aa.print('key = ' + key + ' - isActive = ' + isActive);
        if(submissionDetails == null || submissionDetails == "") {
            if(key == "SD" && isActive) {
                cap.setQUD1("EPR:0;SD:1;");
            }else if(key == "SD" && !isActive) {
                cap.setQUD1("EPR:0;SD:0;");
            }else if(key == "EPR" && isActive){
	             cap.setQUD1("EPR:1;SD:0;");
            }else if(key == "EPR" && !isActive){
	             cap.setQUD1("EPR:0;SD:0;");
            }else if(key == 'PPR' && isActive){
	             cap.setQUD1("EPR:0;SD:0;PPR:1");
            }else if(key == 'PPR' && !isActive){
	             cap.setQUD1("EPR:0;SD:0;");
            }

        } else {
	        aa.print('old QUD1 Value = ' + submissionDetails);
            var arr = submissionDetails.split(';');
            var newArray = [];
            var isPPRKey = false;
            var pprKeyFound = false;

            key == 'PPR'? isPPRKey = true: isPPRKey = false;

            for(var x in arr) {

                if(arr[x].indexOf(key) > -1) {
                    var keyValue = arr[x].split(":");
                    var newValue;

                    if(isPPRKey){
                      isActive? newValue = keyValue[0] + ":1": newValue ='' ;
	                  pprKeyFound = true;
                      
                    }else{
	                   isActive ? newValue = keyValue[0] + ":1" : newValue = keyValue[0] + ":0"
                    }
                    
                    newArray.push(newValue)
                } else {
                    newArray.push(arr[x])
                }
            }

            if(isPPRKey && !pprKeyFound && isActive){
	            newArray.push('PPR:1');
            }

            var str = "";
            for(var y in newArray) {
                if(newArray[y]){
	                str += newArray[y] + ";"
                }
                
            }
            aa.print('new QUD1 Value = ' + str);
            cap.setQUD1(str);
        }

        aa.cap.editCapByPK(cap);

    } catch (e) {
        java.lang.System.out.println("SPSABASE updateEntityProfilesSubmission - Error - " + e)
    }
}
SPSABASE.prototype.setInspectionDateAndTimeInQUD2 = function(inspectionStatus){
	try{
		var cap = this.getCapModel();
		
		if(inspectionStatus == 'ScheduleInpsection'){
			var primary = this.getPrimaryInspection();
			if(primary){
				var inspActivity = primary.getActivity();
                var inspectionDate = inspActivity.getActivityDate();
                var inspectionTime = inspActivity.getTime2();
                var inspectionHour = String(inspectionTime).split(':')[0];
                inspectionDate.setHours(inspectionHour);
            
                cap.setQUD2(String(inspectionDate));
                aa.cap.editCapByPK(cap);
			}
			
			
		}else if(inspectionStatus == 'CancelInpsection'){
            cap.setQUD2('');
            aa.cap.editCapByPK(cap);
		}
		
		
		
	}catch(e){
		java.lang.System.out.println("SPSABASE setInspectionDateAndTimeInQUD2 - Error - " + e);
	}
	
}

SPSABASE.getRandomInt = function(max) {
  return Math.floor(Math.random() * max);
}
SPSABASE.generateRandomNumbers = function(min, max, times) {
	var randoms = []

	for (var i = 0; i < times; i++) {
		var randomNum = Math.floor(Math.random() * (max - min) + min);

		var obj = randoms.filter(function(item) {
			return item == randomNum;
		});

		if (Utils.isBlankOrNull(obj)) {
			randoms.push(randomNum);
		} else {
			times++;
		}
	}

	return randoms
}
SPSABASE.shuffle = function(array) {
	var currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[ array[currentIndex], array[randomIndex] ] = [ array[randomIndex], array[currentIndex] ];
	}

	return array;
}
function addDays(date, days) {
	if (date != null && days > 0) {
		date.setDate(parseInt(date.getDate()) + parseInt(days));
	}
	return date;
}
function sendPeriodicNotificationReminder(){
	SCRIPT_VERSION = 3.0;
    showDebug = true;
    debug = "";
    emailText = "";
    message = "";
    br = "<br>";
    capId = "";

   java.lang.System.out.println("sendPeriodicNotificationReminder start ...")
   aa.print("sendPeriodicNotificationReminder start ...")

	var d = new Date();
	var month = (1 + d.getMonth());
	var currentlvlArr = [];
	currentlvlArr.push("Annual");
	if (month >= 1 && month <= 6) {
		currentlvlArr.push("Second Quarter");
	}
	if (month >= 7 && month <= 12) {
		currentlvlArr.push("Fourth Quarter");
	}
	if (month >= 1 && month <= 3) {
		currentlvlArr.push("First Quarter");
	}
	if (month >= 4 && month <= 6) {
		currentlvlArr.push("Second Quarter");
	}
	if (month >= 7 && month <= 9) {
		currentlvlArr.push("Third Quarter");
	}
	if (month >= 10 && month <= 12) {
		currentlvlArr.push("Fourth Quarter");
	}

	var currentlvlJoinedArr = "";
	if (currentlvlArr != null && currentlvlArr.length > 0) {
		currentlvlJoinedArr = currentlvlArr.map(function(v) {
			return "'" + v + "'"
		}).join(",");

	} else {
		currentlvlArr = [ "NO DATA" ];
		currentlvlJoinedArr = currentlvlArr.map(function(v) {
			return "'" + v + "'"
		}).join(",");
	}

	var ACTIVEQUERYANNUAL = 'NO';
	var ACTIVEQUERYSEMIANNUALPART_1 = 'NO';
	var ACTIVEQUERYSEMIANNUALPART_2 = 'NO';
	var ACTIVEQUERYQUARTERLY_1 = 'NO';
	var ACTIVEQUERYQUARTERLY_2 = 'NO';
	var ACTIVEQUERYQUARTERLY_3 = 'NO';
	var ACTIVEQUERYQUARTERLY_4 = 'NO';
	var annualTimes = [];
	var semiAnnualTimes = [];
	var quarterlyTimes = [];
    java.lang.System.out.println("sendPeriodicNotificationReminder #1 .")
	// read from settings Table:NOTIFICATION CONFIGURATION
	var settRecord = new Record("SPSA Global Settings");
	var ncASIT = settRecord.getASIT('PERIODIC NOTIFICATION');
	if (ncASIT != null) {
		for ( var i in ncASIT) {
			var Period = String(ncASIT[i]['Period']);
			var Unit = String(ncASIT[i]['Unit']);
			var Time = String(ncASIT[i]['Time']);
			var Active = String(ncASIT[i]['Active']);

			var currDate = new Date();

			if (Active == "CHECKED" && Period == "Annual") {
				if (Unit == "Day") {
					annualTimes.push(Time)
				}
				if (Unit == "Month") {
					annualTimes.push(Time * 30)
				}
			}
			if (Active == "CHECKED" && Period == "Semi Annual") {
				if (Unit == "Day") {
					semiAnnualTimes.push(Time)
				}
				if (Unit == "Month") {
					semiAnnualTimes.push(Time * 30)
				}
			}
			if (Active == "CHECKED" && Period == "Quarterly") {
				if (Unit == "Day") {
					quarterlyTimes.push(Time)

				}
				if (Unit == "Month") {
					quarterlyTimes.push(Time * 30)
				}

			}
		}
               java.lang.System.out.println("sendPeriodicNotificationReminder #2 before annual.")
		    var maxAnnualTime = 0;
            var diffDays = 0;
            var annualRowValue = 0;

			for (a in annualTimes) {
				java.lang.System.out.println('loop annualTimes - a  = ' + a + " - type = " + typeof(annualTimes[a]))
				annualRowValue = annualTimes[a];
                annualRowValue = Number(annualRowValue)

	           if(maxAnnualTime < annualRowValue){
		          maxAnnualTime = annualTimes[a]; //Set MAX Annaual Time
	           }

				var endDate = new Date('12/31/' + currDate.getFullYear());
				var diffTime = Math.abs(endDate - currDate);
				diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				
			}
			java.lang.System.out.println('maxAnnualTime = ' + maxAnnualTime)
			if (diffDays <= maxAnnualTime) {//if days diff between current date & end year is less than the Max annaul time then send notification.
					ACTIVEQUERYANNUAL = "YES";
		    }

          var maxSemiAnnualTime = 0;
		  var diffSemiAnnaulDays1 = 0;
		  var diffSemiAnnaulDays2 = 0;
		  var semiRowValue = 0;
          java.lang.System.out.println("sendPeriodicNotificationReminder #3 before semi annual.")
          for (a in semiAnnualTimes) {
	           java.lang.System.out.println('loop semiAnnualTimes - a  = ' + a + " - type = " + typeof(semiAnnualTimes[a]))
                semiRowValue = semiAnnualTimes[a];
                semiRowValue = Number(semiRowValue)
                java.lang.System.out.println('semiRowValue = ' + semiRowValue + ' ' + typeof(semiRowValue))
				if(maxSemiAnnualTime < semiRowValue){
		          maxSemiAnnualTime = semiRowValue; //Set MAX Semi Annaual Time
	           }

				if (month >= 1 && month <= 6) {
					var endDate = new Date('06/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffSemiAnnaulDays1 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				
				

               
				if (month >= 1 && month <= 12) {
					var endDate = new Date('12/31/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffSemiAnnaulDays2 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				
			}
			
			
			java.lang.System.out.println('maxSemiAnnualTime   = ' + maxSemiAnnualTime);
			java.lang.System.out.println('diffSemiAnnaulDays1   = ' + diffSemiAnnaulDays1);
			java.lang.System.out.println('diffSemiAnnaulDays2   = ' + diffSemiAnnaulDays2);
			
			if (diffSemiAnnaulDays1 <= maxSemiAnnualTime) {//if days diff between current date & end year is less than the Max annaul time then send notification.
					ACTIVEQUERYSEMIANNUALPART_1 = "YES";
		     }

			if (diffSemiAnnaulDays2 <= maxSemiAnnualTime) {
						ACTIVEQUERYSEMIANNUALPART_2 = "YES";
			}

            java.lang.System.out.println('ACTIVEQUERYSEMIANNUALPART_1   = ' + ACTIVEQUERYSEMIANNUALPART_1);
            java.lang.System.out.println('ACTIVEQUERYSEMIANNUALPART_2   = ' + ACTIVEQUERYSEMIANNUALPART_2);
            var maxQuarterlyTime = 0;
			var diffQuarterlyTimesDays1 = 0;
			var diffQuarterlyTimesDays2 = 0;
			var diffQuarterlyTimesDays3 = 0;
			var diffQuarterlyTimesDays4 = 0;
			var quartlyRowValue = 0;
			
			for (a in quarterlyTimes) {
				aa.print("a " + a)
				quartlyRowValue = quarterlyTimes[a];
				quartlyRowValue = Number(quartlyRowValue)
				if(maxQuarterlyTime < quartlyRowValue){
		          maxQuarterlyTime =  quartlyRowValue; //Set MAX Semi Annaual Time
	           }

				if (month >= 1 && month <= 3) {
					var endDate = new Date('03/31/' + currDate.getFullYear());
					aa.print(currDate)
					aa.print(endDate)
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays1 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					aa.print("diffTime " + diffTime)
					aa.print("diffDays " + diffDays)
					aa.print("quarterlyTimes[a] " + quarterlyTimes[a])
	
					
				}
				if (month >= 4 && month <= 6) {
					var endDate = new Date('06/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays2 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				if (month >= 7 && month <= 9) {
					var endDate = new Date('09/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays3 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				if (month >= 10 && month <= 12) {
					var endDate = new Date('12/31/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays4 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
			}
			
			if (diffQuarterlyTimesDays1 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_1 = "YES";
			}
					
			if (diffQuarterlyTimesDays2 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_2 = "YES";
			}
					
			if (diffQuarterlyTimesDays3 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_3 = "YES";
			}
					
			if (diffQuarterlyTimesDays4 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_4 = "YES";
			}

		var SQL = "";
		SQL += " DECLARE @YEAR NVARCHAR(50) SET @YEAR= CAST(YEAR(GETDATE()) AS NVARCHAR(50))";
		SQL += " DECLARE @ACTIVEQUERYANNUAL NVARCHAR(50) SET @ACTIVEQUERYANNUAL= '"
				+ String(ACTIVEQUERYANNUAL) + "' ";
		SQL += " DECLARE @ACTIVEQUERYSEMIANNUALPART_1 NVARCHAR(50) SET @ACTIVEQUERYSEMIANNUALPART_1= '"
				+ String(ACTIVEQUERYSEMIANNUALPART_1) + "' ";
		SQL += " DECLARE @ACTIVEQUERYSEMIANNUALPART_2 NVARCHAR(50) SET @ACTIVEQUERYSEMIANNUALPART_2= '"
				+ String(ACTIVEQUERYSEMIANNUALPART_2) + "' ";
		SQL += " DECLARE @ACTIVEQUERYQUARTERLY_1 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_1= '"
				+ String(ACTIVEQUERYQUARTERLY_1) + "' ";
		SQL += " DECLARE @ACTIVEQUERYQUARTERLY_2 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_2= '"
				+ String(ACTIVEQUERYQUARTERLY_2) + "' ";
		SQL += " DECLARE @ACTIVEQUERYQUARTERLY_3 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_3= '"
				+ String(ACTIVEQUERYQUARTERLY_3) + "' ";
		SQL += " DECLARE @ACTIVEQUERYQUARTERLY_4 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_4= '"
				+ String(ACTIVEQUERYQUARTERLY_4) + "' ";
		SQL += " SELECT * FROM (";
		SQL += " SELECT B.B1_ALT_ID,ISNULL(LPRS_CREATED_DATE.B1_CHECKLIST_COMMENT  ,'10/10/1900') AS PRPRDATE";
		SQL += " ,PERIOD.ATTRIBUTE_VALUE AS PERIOD ";
		SQL += " ,(CASE";
		SQL += " WHEN ISNULL(PERIOD.ATTRIBUTE_VALUE ,'') <> '' AND ISNULL(PERIOD.ATTRIBUTE_VALUE ,'') <> '' THEN";
		SQL += " CASE";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Annual' THEN 'Annual'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Semi Annual' AND (1 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=6)  THEN 'Second Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Semi Annual' AND (7 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=12) THEN 'Fourth Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (1 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=3)	THEN 'First Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (4 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=6)	THEN 'Second Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (7 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=9)	THEN 'Third Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (10 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=12)	THEN 'Fourth Quarter'";
		SQL += " ELSE 'Nothing' END";
		SQL += " ELSE '' ";
		SQL += " END) AS EPRF_CURRUENT_LEVEL";
		SQL += " FROM B1PERMIT B";
		SQL += " INNER JOIN BCHCKBOX Level";
		SQL += " ON Level.SERV_PROV_CODE=B.SERV_PROV_CODE";
		SQL += " AND Level.B1_PER_ID1 =B.B1_PER_ID1";
		SQL += " AND Level.B1_PER_ID2 =B.B1_PER_ID2";
		SQL += " AND Level.B1_PER_ID3 =B.B1_PER_ID3";
		SQL += " AND Level.B1_CHECKBOX_DESC='Entity Classification'";
		SQL += " INNER JOIN B1PERMIT RecordSetting";
		SQL += " ON RecordSetting.B1_ALT_ID ='SPSA Global Settings'";
		SQL += " INNER JOIN BAPPSPECTABLE_VALUE PERIOD";
		SQL += " ON PERIOD.serv_prov_code = RecordSetting.serv_prov_code";
		SQL += " AND PERIOD.b1_per_id1 = RecordSetting.b1_per_id1";
		SQL += " AND PERIOD.b1_per_id2 = RecordSetting.b1_per_id2";
		SQL += " AND PERIOD.b1_per_id3 = RecordSetting.b1_per_id3";
		SQL += " AND PERIOD.TABLE_NAME = 'PERIODIC REPORTING SUBMISSION'";
		SQL += " AND PERIOD.COLUMN_NAME = 'Submission PERIOD'";
		SQL += " INNER JOIN BAPPSPECTABLE_VALUE Lvl";
		SQL += " ON Lvl.serv_prov_code = RecordSetting.serv_prov_code";
		SQL += " AND Lvl.b1_per_id1 = RecordSetting.b1_per_id1";
		SQL += " AND Lvl.b1_per_id2 = RecordSetting.b1_per_id2";
		SQL += " AND Lvl.b1_per_id3 = RecordSetting.b1_per_id3";
		SQL += " AND Lvl.TABLE_NAME = 'PERIODIC REPORTING SUBMISSION'";
		SQL += " AND Lvl.COLUMN_NAME = 'Level'";
		SQL += " AND Lvl.ROW_INDEX = PERIOD.ROW_INDEX";
		SQL += " AND Lvl.ATTRIBUTE_VALUE = Level.B1_CHECKLIST_COMMENT";
		SQL += " INNER JOIN BAPPSPECTABLE_VALUE PERIOD_ACTIVE";
		SQL += " ON PERIOD_ACTIVE.serv_prov_code = RecordSetting.serv_prov_code";
		SQL += " AND PERIOD_ACTIVE.b1_per_id1 = RecordSetting.b1_per_id1";
		SQL += " AND PERIOD_ACTIVE.b1_per_id2 = RecordSetting.b1_per_id2";
		SQL += " AND PERIOD_ACTIVE.b1_per_id3 = RecordSetting.b1_per_id3";
		SQL += " AND PERIOD_ACTIVE.TABLE_NAME = 'PERIODIC REPORTING SUBMISSION'";
		SQL += " AND PERIOD_ACTIVE.COLUMN_NAME = 'Active'";
		SQL += " AND PERIOD_ACTIVE.ROW_INDEX = PERIOD.ROW_INDEX ";
		SQL += " AND PERIOD_ACTIVE.ATTRIBUTE_VALUE = 'CHECKED' ";
		SQL += " LEFT JOIN BCHCKBOX AS LPRS_RECID";
		SQL += " ON B.SERV_PROV_CODE = LPRS_RECID.SERV_PROV_CODE";
		SQL += " AND B.B1_PER_ID1 = LPRS_RECID.B1_PER_ID1";
		SQL += " AND B.B1_PER_ID2 = LPRS_RECID.B1_PER_ID2";
		SQL += " AND B.B1_PER_ID3 = LPRS_RECID.B1_PER_ID3";
		SQL += " AND LPRS_RECID.B1_CHECKBOX_TYPE = 'LAST PERIODIC REPORT SUBMITTED'";
		SQL += " AND LPRS_RECID.B1_CHECKBOX_DESC = 'Record ID'";
		SQL += " LEFT JOIN BCHCKBOX AS LPRS_CREATED_DATE";
		SQL += " ON B.SERV_PROV_CODE = LPRS_CREATED_DATE.SERV_PROV_CODE";
		SQL += " AND B.B1_PER_ID1 = LPRS_CREATED_DATE.B1_PER_ID1";
		SQL += " AND B.B1_PER_ID2 = LPRS_CREATED_DATE.B1_PER_ID2";
		SQL += " AND B.B1_PER_ID3 = LPRS_CREATED_DATE.B1_PER_ID3";
		SQL += " AND LPRS_CREATED_DATE.B1_CHECKBOX_TYPE = 'LAST PERIODIC REPORT SUBMITTED'";
		SQL += " AND LPRS_CREATED_DATE.B1_CHECKBOX_DESC = 'Created Date'";
		SQL += " WHERE B.SERV_PROV_CODE = 'SPSA'";
		SQL += " AND B.B1_PER_GROUP = 'OSHJ'";
		SQL += " AND B.B1_PER_TYPE = 'Profile'";
		SQL += " AND B.B1_PER_SUB_TYPE = 'Entity Profile'";
		SQL += " AND B.B1_PER_CATEGORY = 'EPRF'";
		SQL += " AND B.B1_APPL_STATUS IN ('Active','Self-Declaration Pending','About to Expire') ";
		SQL += " ) TB_RESULT WHERE ";
		SQL += " ((TB_RESULT.PERIOD='Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Annual' AND ";
		SQL += " @ACTIVEQUERYANNUAL='YES'";
		SQL += " AND(( DATEPART(YEAR,CAST(TB_RESULT.PRPRDATE AS DATE)) < DATEPART(YEAR,GETDATE()))))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Semi Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Second Quarter' AND";
		SQL += " @ACTIVEQUERYSEMIANNUALPART_1='YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('01/01/'+@YEAR AS DATE) AND CAST('06/30/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Semi Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Fourth Quarter' AND ";
		SQL += " @ACTIVEQUERYSEMIANNUALPART_2='YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('07/01/'+@YEAR AS DATE) AND CAST('12/31/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='First Quarter' AND ";
		SQL += " @ACTIVEQUERYQUARTERLY_1= 'YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('01/01/'+@YEAR AS DATE) AND CAST('03/31/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Second Quarter' AND ";
		SQL += " @ACTIVEQUERYQUARTERLY_2= 'YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('04/01/'+@YEAR AS DATE) AND CAST('06/30/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Third Quarter' AND ";
		SQL += " @ACTIVEQUERYQUARTERLY_3= 'YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('07/01/'+@YEAR AS DATE) AND CAST('09/30/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Fourth Quarter' AND ";
		SQL += " @ACTIVEQUERYQUARTERLY_4= 'YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('10/01/'+@YEAR AS DATE) AND CAST('12/31/'+@YEAR AS DATE))))";
		SQL += " AND TB_RESULT.EPRF_CURRUENT_LEVEL IN" + "("
				+ currentlvlJoinedArr + ")";

				 java.lang.System.out.println('sendPeriodicNotificationReminder - periodic SQL   = ' + SQL);
			aa.print('sendPeriodicNotificationReminder - periodic SQL   = ' + SQL);

		var date = new Date();
		var dt = new com.accela.aa.util.DateTimeUtil(aa
				.getServiceProviderCode());
		var currDate = dt.format(date, "MM/dd/yyyy");
		var currYearInt = parseInt(currDate.split('/')[2] + "");
		var currYear = currYearInt + "";
		var monthINT = parseInt(currDate.split('/')[0] + "");
		// var month = monthINT + "";

		var result = SPSABASE.runSQL(SQL, null);
		var lstresult = result.toArray();
		java.lang.System.out.println('lstresult  = ' + lstresult.length);
		aa.print('lstresult  = ' + lstresult.length);
		for (index in lstresult) {
			var altID = lstresult[index].B1_ALT_ID + "";
			aa.print("#1 - altID = " + altID)
			var submissionPeriod = lstresult[index].PERIOD + "";
			var EPRF_CURRUENT_LEVEL = lstresult[index].EPRF_CURRUENT_LEVEL + "";
			var Period = "";
			var eprfRec = new Record(altID);
			var emailsArr = [];
			var emailParameters = aa.util.newHashtable();
			addParameter(emailParameters, "$$NO_EXTRA_PARAMETERS$$", "");
			var contactArr = aa.people.getCapContactByCapID(eprfRec.getCapID())
					.getOutput();
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

				if (emailsArr.length > 0) {
					if (submissionPeriod == "Annual") {
						Period = "(Jan 01 - Dec 30 " + currYear + ")";
					} else if (submissionPeriod == "Quarterly") {
						if (month >= 1 && month <= 3) {
							Period = "(Jan 01 - Mar 31 " + currYear + ")";
						}
						if (month >= 4 && month <= 6) {
							Period = "(Apr 01 - Jun 30 " + currYear + ")";
						}
						if (month >= 7 && month <= 9) {
							Period = "(Jul 01 - Sept 30 " + currYear + ")";
						}
						if (month >= 10 && month <= 12) {
							Period = "(Oct 01 - Dec 31 " + currYear + ")";
						}

					} else if (submissionPeriod == "Semi Annual") {
						if (month >= 1 && month <= 6) {
							Period = "(Jan 01 - Jun 30 " + currYear + ")";
						}
						if (month >= 7 && month <= 12) {
							Period = "(Jul 01 - Dec 31" + currYear + ")";
						}
					} else {
						// 
					}

					// Send Notification
					/*var emailParameters = aa.util.newHashtable();
					emailParameters.put("$$ENTITY_PROFILE_ID$$", altID);
					emailParameters.put("$$REPORT_PERIOD$$", Period);

					GlobalNotifications.sendEmailByTemplate("GSSGNT-00004",
							emailsArr, emailParameters, eprfRec.getCapID());*/

							var record = new Record(altID)
			
			var emailParameters = aa.util.newHashtable();
			emailParameters.put("$$ENTITY_PROFILE_ID$$", altID);
			emailParameters.put("$$REPORT_PERIOD$$", Period);
						
			capId = record.getCapID();	
           java.lang.System.out.println('sendPeriodicNotificationReminder - SQL RESULT REC ALT ID = ' + altID);
           aa.print('sendPeriodicNotificationReminder - SQL RESULT REC ALT ID = ' + altID);
	

            var gn = new GlobalNotifications();
            java.lang.System.out.println('sendPeriodicNotificationReminder - SQL RESULT REC BEFORE SEND EMAIL - CAP ID = ' + capId);
            aa.print('sendPeriodicNotificationReminder - SQL RESULT REC BEFORE SEND EMAIL - CAP ID = ' + capId);
			gn.sendNotification('Custom', "*", 'GSSGNT_EPRF', emailParameters, null, null, null, emailsArr);
			java.lang.System.out.println('sendPeriodicNotificationReminder - SQL RESULT REC AFTER SEND EMAIL - CAP ID = ' + capId);
			aa.print('sendPeriodicNotificationReminder - SQL RESULT REC AFTER SEND EMAIL - CAP ID = ' + capId);
			updateEPRFNotificationAlert(record, "EPR");
				}

			}
 
		}
	}
}
function sendInitialPeriodicNotificationReminder() {
    SCRIPT_VERSION = 3.0;
    showDebug = true;
    debug = "";
    emailText = "";
    message = "";
    br = "<br>";
    capId = "";

	var d = new Date();
	var month = (1 + d.getMonth());
	var currentlvlArr = [];
	currentlvlArr.push("Annual");
	if (month >= 1 && month <= 6) {
		currentlvlArr.push("Second Quarter");
	}
	if (month >= 7 && month <= 12) {
		currentlvlArr.push("Fourth Quarter");
	}
	if (month >= 1 && month <= 3) {
		currentlvlArr.push("First Quarter");
	}
	if (month >= 4 && month <= 6) {
		currentlvlArr.push("Second Quarter");
	}
	if (month >= 7 && month <= 9) {
		currentlvlArr.push("Third Quarter");
	}
	if (month >= 10 && month <= 12) {
		currentlvlArr.push("Fourth Quarter");
	}

    java.lang.System.out.println('sendInitialPeriodicNotificationReminder START ... ')
	var currentlvlJoinedArr = "";
	if (currentlvlArr != null && currentlvlArr.length > 0) {
		currentlvlJoinedArr = currentlvlArr.map(function(v) {
			return "'" + v + "'"
		}).join(",");

	} else {
		currentlvlArr = [ "NO DATA" ];
		currentlvlJoinedArr = currentlvlArr.map(function(v) {
			return "'" + v + "'"
		}).join(",");
	}

	var ACTIVEQUERYANNUAL = 'NO';
	var ACTIVEQUERYSEMIANNUALPART_1 = 'NO';
	var ACTIVEQUERYSEMIANNUALPART_2 = 'NO';
	var ACTIVEQUERYQUARTERLY_1 = 'NO';
	var ACTIVEQUERYQUARTERLY_2 = 'NO';
	var ACTIVEQUERYQUARTERLY_3 = 'NO';
	var ACTIVEQUERYQUARTERLY_4 = 'NO';
	var annualTimes = [];
	var semiAnnualTimes = [];
	var quarterlyTimes = [];

	// read from settings Table:NOTIFICATION CONFIGURATION
	var settRecord = new Record("SPSA Global Settings");
	var ncASIT = settRecord.getASIT('PERIODIC NOTIFICATION');
	if (ncASIT != null) {
		for ( var i in ncASIT) {
			var Period = String(ncASIT[i]['Period']);
			var Unit = String(ncASIT[i]['Unit']);
			var Time = String(ncASIT[i]['Time']);
			var Active = String(ncASIT[i]['Active']);

			var currDate = new Date();

			if (Active == "CHECKED" && Period == "Annual") {
				if (Unit == "Day") {
					annualTimes.push(Time)
				}
				if (Unit == "Month") {
					annualTimes.push(Time * 30)
				}
			}
			if (Active == "CHECKED" && Period == "Semi Annual") {
				if (Unit == "Day") {
					semiAnnualTimes.push(Time)
				}
				if (Unit == "Month") {
					semiAnnualTimes.push(Time * 30)
				}
			}
			if (Active == "CHECKED" && Period == "Quarterly") {
				if (Unit == "Day") {
					quarterlyTimes.push(Time)
				}
				if (Unit == "Month") {
					quarterlyTimes.push(Time * 30)
				}
			}
		}
        
           var maxAnnualTime = 0;
            var diffDays = 0;

			for (a in annualTimes) {
				if(a== 0){
		           maxAnnualTime = parseInt(annualTimes[a]);
	           }else if(maxAnnualTime < annualTimes[a]){
		          maxAnnualTime = parseInt(annualTimes[a]); //Set MAX Annaual Time
	           }

				var endDate = new Date('12/31/' + currDate.getFullYear());
				var diffTime = Math.abs(endDate - currDate);
				diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				
			}
			
			if (diffDays <= maxAnnualTime) {//if days diff between current date & end year is less than the Max annaul time then send notification.
					ACTIVEQUERYANNUAL = "YES";
		    }

          var maxSemiAnnualTime = 0;
		  var diffSemiAnnaulDays1 = 0;
		  var diffSemiAnnaulDays2 = 0;
			
          for (a in semiAnnualTimes) {
				if(a== 0){
		           maxSemiAnnualTime = parseInt(semiAnnualTimes[a]);
	           }else if(maxSemiAnnualTime < semiAnnualTimes[a]){
		          maxSemiAnnualTime = parseInt(semiAnnualTimes[a]); //Set MAX Semi Annaual Time
	           }
              

				if (month >= 1 && month <= 6) {
					var endDate = new Date('06/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffSemiAnnaulDays1 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				
				

               
				if (month >= 1 && month <= 12) {
					var endDate = new Date('12/31/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffSemiAnnaulDays2 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				
			}
			
			java.lang.System.out.println('maxSemiAnnualTime = ' + maxSemiAnnualTime)
		    java.lang.System.out.println('currDate = ' + currDate)
			java.lang.System.out.println('diffSemiAnnaulDays1 = ' + diffSemiAnnaulDays1)
			java.lang.System.out.println('diffSemiAnnaulDays2 = ' + diffSemiAnnaulDays2)
			if (diffSemiAnnaulDays1 <= maxSemiAnnualTime) {//if days diff between current date & end year is less than the Max annaul time then send notification.
					ACTIVEQUERYSEMIANNUALPART_1 = "YES";
		     }

			if (diffSemiAnnaulDays2 <= maxSemiAnnualTime) {
						ACTIVEQUERYSEMIANNUALPART_2 = "YES";
			}
            java.lang.System.out.println('ACTIVEQUERYSEMIANNUALPART_1 = ' + ACTIVEQUERYSEMIANNUALPART_1)
			java.lang.System.out.println('ACTIVEQUERYSEMIANNUALPART_2 = ' + ACTIVEQUERYSEMIANNUALPART_2)

        var maxQuarterlyTime = 0;
			var diffQuarterlyTimesDays1 = 0;
			var diffQuarterlyTimesDays2 = 0;
			var diffQuarterlyTimesDays3 = 0;
			var diffQuarterlyTimesDays4 = 0;
			
			for (a in quarterlyTimes) {
				aa.print("a " + a)
				if(a== 0){
		           maxQuarterlyTime = parseInt(quarterlyTimes[a]);
	           }else if(maxQuarterlyTime < quarterlyTimes[a]){
		          maxQuarterlyTime = parseInt(quarterlyTimes[a]); //Set MAX Semi Annaual Time
	           }

				if (month >= 1 && month <= 3) {
					var endDate = new Date('03/31/' + currDate.getFullYear());
					aa.print(currDate)
					aa.print(endDate)
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays1 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					aa.print("diffTime " + diffTime)
					aa.print("diffDays " + diffDays)
					aa.print("quarterlyTimes[a] " + quarterlyTimes[a])
	
					
				}
				if (month >= 4 && month <= 6) {
					var endDate = new Date('06/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays2 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				if (month >= 7 && month <= 9) {
					var endDate = new Date('09/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays3 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				if (month >= 10 && month <= 12) {
					var endDate = new Date('12/31/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays4 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
			}
			
			if (diffQuarterlyTimesDays1 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_1 = "YES";
			}
					
			if (diffQuarterlyTimesDays2 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_2 = "YES";
			}
					
			if (diffQuarterlyTimesDays3 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_3 = "YES";
			}
					
			if (diffQuarterlyTimesDays4 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_4 = "YES";
			}
			
		


		var SQL = "";
		SQL += " DECLARE @YEAR NVARCHAR(50) SET @YEAR= CAST(YEAR(GETDATE()) AS NVARCHAR(50))";
		SQL += " DECLARE @ACTIVEQUERYANNUAL NVARCHAR(50) SET @ACTIVEQUERYANNUAL= '"
				+ String(ACTIVEQUERYANNUAL) + "' ";
		SQL += " DECLARE @ACTIVEQUERYSEMIANNUALPART_1 NVARCHAR(50) SET @ACTIVEQUERYSEMIANNUALPART_1= '"
				+ String(ACTIVEQUERYSEMIANNUALPART_1) + "' ";
		SQL += " DECLARE @ACTIVEQUERYSEMIANNUALPART_2 NVARCHAR(50) SET @ACTIVEQUERYSEMIANNUALPART_2= '"
				+ String(ACTIVEQUERYSEMIANNUALPART_2) + "' ";
		SQL += " DECLARE @ACTIVEQUERYQUARTERLY_1 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_1= '"
				+ String(ACTIVEQUERYQUARTERLY_1) + "' ";
		SQL += " DECLARE @ACTIVEQUERYQUARTERLY_2 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_2= '"
				+ String(ACTIVEQUERYQUARTERLY_2) + "' ";
		SQL += " DECLARE @ACTIVEQUERYQUARTERLY_3 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_3= '"
				+ String(ACTIVEQUERYQUARTERLY_3) + "' ";
		SQL += " DECLARE @ACTIVEQUERYQUARTERLY_4 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_4= '"
				+ String(ACTIVEQUERYQUARTERLY_4) + "' ";
		SQL += " SELECT * FROM (";
		SQL += " SELECT B.B1_ALT_ID,ISNULL(LPRS_CREATED_DATE.B1_CHECKLIST_COMMENT  ,'10/10/1900') AS PRPRDATE";
		SQL += " ,PERIOD.ATTRIBUTE_VALUE AS PERIOD ";
		SQL += " ,(CASE";
		SQL += " WHEN ISNULL(PERIOD.ATTRIBUTE_VALUE ,'') <> '' AND ISNULL(PERIOD.ATTRIBUTE_VALUE ,'') <> '' THEN";
		SQL += " CASE";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Annual' THEN 'Annual'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Semi Annual' AND (1 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=6)  THEN 'Second Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Semi Annual' AND (7 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=12) THEN 'Fourth Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (1 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=3)	THEN 'First Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (4 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=6)	THEN 'Second Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (7 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=9)	THEN 'Third Quarter'";
		SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (10 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=12)	THEN 'Fourth Quarter'";
		SQL += " ELSE 'Nothing' END";
		SQL += " ELSE '' ";
		SQL += " END) AS EPRF_CURRUENT_LEVEL";
		SQL += " FROM B1PERMIT B";
		SQL += " INNER JOIN BCHCKBOX Level";
		SQL += " ON Level.SERV_PROV_CODE=B.SERV_PROV_CODE";
		SQL += " AND Level.B1_PER_ID1 =B.B1_PER_ID1";
		SQL += " AND Level.B1_PER_ID2 =B.B1_PER_ID2";
		SQL += " AND Level.B1_PER_ID3 =B.B1_PER_ID3";
		SQL += " AND Level.B1_CHECKBOX_DESC='Entity Classification'";
		SQL += " INNER JOIN B1PERMIT RecordSetting";
		SQL += " ON RecordSetting.B1_ALT_ID ='SPSA Global Settings'";
		SQL += " INNER JOIN BAPPSPECTABLE_VALUE PERIOD";
		SQL += " ON PERIOD.serv_prov_code = RecordSetting.serv_prov_code";
		SQL += " AND PERIOD.b1_per_id1 = RecordSetting.b1_per_id1";
		SQL += " AND PERIOD.b1_per_id2 = RecordSetting.b1_per_id2";
		SQL += " AND PERIOD.b1_per_id3 = RecordSetting.b1_per_id3";
		SQL += " AND PERIOD.TABLE_NAME = 'INITIAL PERIODIC SUBMISSION'";
		SQL += " AND PERIOD.COLUMN_NAME = 'Submission PERIOD'";
		SQL += " INNER JOIN BAPPSPECTABLE_VALUE Lvl";
		SQL += " ON Lvl.serv_prov_code = RecordSetting.serv_prov_code";
		SQL += " AND Lvl.b1_per_id1 = RecordSetting.b1_per_id1";
		SQL += " AND Lvl.b1_per_id2 = RecordSetting.b1_per_id2";
		SQL += " AND Lvl.b1_per_id3 = RecordSetting.b1_per_id3";
		SQL += " AND Lvl.TABLE_NAME = 'INITIAL PERIODIC SUBMISSION'";
		SQL += " AND Lvl.COLUMN_NAME = 'Level'";
		SQL += " AND Lvl.ROW_INDEX = PERIOD.ROW_INDEX";
		SQL += " AND Lvl.ATTRIBUTE_VALUE = Level.B1_CHECKLIST_COMMENT";
		SQL += " INNER JOIN BAPPSPECTABLE_VALUE PERIOD_ACTIVE";
		SQL += " ON PERIOD_ACTIVE.serv_prov_code = RecordSetting.serv_prov_code";
		SQL += " AND PERIOD_ACTIVE.b1_per_id1 = RecordSetting.b1_per_id1";
		SQL += " AND PERIOD_ACTIVE.b1_per_id2 = RecordSetting.b1_per_id2";
		SQL += " AND PERIOD_ACTIVE.b1_per_id3 = RecordSetting.b1_per_id3";
		SQL += " AND PERIOD_ACTIVE.TABLE_NAME = 'INITIAL PERIODIC SUBMISSION'";
		SQL += " AND PERIOD_ACTIVE.COLUMN_NAME = 'Active'";
		SQL += " AND PERIOD_ACTIVE.ROW_INDEX = PERIOD.ROW_INDEX ";
		SQL += " AND PERIOD_ACTIVE.ATTRIBUTE_VALUE = 'CHECKED' ";
		SQL += " LEFT JOIN BCHCKBOX AS LPRS_RECID";
		SQL += " ON B.SERV_PROV_CODE = LPRS_RECID.SERV_PROV_CODE";
		SQL += " AND B.B1_PER_ID1 = LPRS_RECID.B1_PER_ID1";
		SQL += " AND B.B1_PER_ID2 = LPRS_RECID.B1_PER_ID2";
		SQL += " AND B.B1_PER_ID3 = LPRS_RECID.B1_PER_ID3";
		SQL += " AND LPRS_RECID.B1_CHECKBOX_TYPE = 'LAST PERIODIC REPORT SUBMITTED'";
		SQL += " AND LPRS_RECID.B1_CHECKBOX_DESC = 'Record ID'";
		SQL += " LEFT JOIN BCHCKBOX AS LPRS_CREATED_DATE";
		SQL += " ON B.SERV_PROV_CODE = LPRS_CREATED_DATE.SERV_PROV_CODE";
		SQL += " AND B.B1_PER_ID1 = LPRS_CREATED_DATE.B1_PER_ID1";
		SQL += " AND B.B1_PER_ID2 = LPRS_CREATED_DATE.B1_PER_ID2";
		SQL += " AND B.B1_PER_ID3 = LPRS_CREATED_DATE.B1_PER_ID3";
		SQL += " AND LPRS_CREATED_DATE.B1_CHECKBOX_TYPE = 'LAST PERIODIC REPORT SUBMITTED'";
		SQL += " AND LPRS_CREATED_DATE.B1_CHECKBOX_DESC = 'Created Date'";
		SQL += " WHERE B.SERV_PROV_CODE = 'SPSA'";
		SQL += " AND B.B1_PER_GROUP = 'OSHJ'";
		SQL += " AND B.B1_PER_TYPE = 'Profile'";
		SQL += " AND B.B1_PER_SUB_TYPE = 'Entity Profile'";
		SQL += " AND B.B1_PER_CATEGORY = 'EPRF'";
		SQL += " ) TB_RESULT WHERE ";
		SQL += " ((TB_RESULT.PERIOD='Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Annual' AND ";
		SQL += " @ACTIVEQUERYANNUAL='YES'";
		SQL += " AND(( DATEPART(YEAR,CAST(TB_RESULT.PRPRDATE AS DATE)) < DATEPART(YEAR,GETDATE()))))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Semi Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Second Quarter' AND";
		SQL += " @ACTIVEQUERYSEMIANNUALPART_1='YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('01/01/'+@YEAR AS DATE) AND CAST('06/30/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Semi Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Fourth Quarter' AND ";
		SQL += " @ACTIVEQUERYSEMIANNUALPART_2='YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('07/01/'+@YEAR AS DATE) AND CAST('12/31/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='First Quarter' AND ";
		SQL += " @ACTIVEQUERYQUARTERLY_1= 'YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('01/01/'+@YEAR AS DATE) AND CAST('03/31/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Second Quarter' AND ";
		SQL += " @ACTIVEQUERYQUARTERLY_2= 'YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('04/01/'+@YEAR AS DATE) AND CAST('06/30/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Third Quarter' AND ";
		SQL += " @ACTIVEQUERYQUARTERLY_3= 'YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('07/01/'+@YEAR AS DATE) AND CAST('09/30/'+@YEAR AS DATE)))";
		SQL += " OR";
		SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Fourth Quarter' AND ";
		SQL += " @ACTIVEQUERYQUARTERLY_4= 'YES'";
		SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('10/01/'+@YEAR AS DATE) AND CAST('12/31/'+@YEAR AS DATE))))";
		SQL += " AND TB_RESULT.EPRF_CURRUENT_LEVEL IN" + "("
				+ currentlvlJoinedArr + ")";

		java.lang.System.out.println('sendInitialPeriodicNotificationReminder SQL = ' + SQL)
		var date = new Date();
		var dt = new com.accela.aa.util.DateTimeUtil(aa
				.getServiceProviderCode());
		var currDate = dt.format(date, "MM/dd/yyyy");
		var currYearInt = parseInt(currDate.split('/')[2] + "");
		var currYear = currYearInt + "";
		var monthINT = parseInt(currDate.split('/')[0] + "");
		// var month = monthINT + "";

		var result = SPSABASE.runSQL(SQL, null);
		var lstresult = result.toArray();
		for (index in lstresult) {
			var altID = lstresult[index].B1_ALT_ID + "";
			java.lang.System.out.println('#1 altID = ' + altID)
			var submissionPeriod = lstresult[index].PERIOD + "";
			var EPRF_CURRUENT_LEVEL = lstresult[index].EPRF_CURRUENT_LEVEL + "";
			var Period = "";
			var eprfRec = new Record(altID);
			var emailsArr = [];
			var emailParameters = aa.util.newHashtable();
			addParameter(emailParameters, "$$NO_EXTRA_PARAMETERS$$", "");
			var contactArr = aa.people.getCapContactByCapID(eprfRec.getCapID())
					.getOutput();
					aa.print('contactArr.length = ' + contactArr.length);
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
               java.lang.System.out.println('emailsArr.length = ' + emailsArr.length);
				if (emailsArr.length > 0) {
					if (submissionPeriod == "Annual") {
						Period = "(Jan 01 - Dec 30 " + currYear + ")";
					} else if (submissionPeriod == "Quarterly") {
						if (month >= 1 && month <= 3) {
							Period = "(Jan 01 - Mar 31 " + currYear + ")";
						}
						if (month >= 4 && month <= 6) {
							Period = "(Apr 01 - Jun 30 " + currYear + ")";
						}
						if (month >= 7 && month <= 9) {
							Period = "(Jul 01 - Sept 30 " + currYear + ")";
						}
						if (month >= 10 && month <= 12) {
							Period = "(Oct 01 - Dec 31 " + currYear + ")";
						}

					} else if (submissionPeriod == "Semi Annual") {
						if (month >= 1 && month <= 6) {
							Period = "(Jan 01 - Jun 30 " + currYear + ")";
						}
						if (month >= 7 && month <= 12) {
							Period = "(Jul 01 - Dec 31" + currYear + ")";
						}
					} else {
						// 
					}
					// Send Notification
					/*var emailParameters = aa.util.newHashtable();
					emailParameters.put("$$ENTITY_PROFILE_ID$$", altID);
					emailParameters.put("$$REPORT_PERIOD$$", Period);

					GlobalNotifications.sendEmailByTemplate("GSSGNT-00004",
							emailsArr, emailParameters, eprfRec.getCapID());*/
							
							java.lang.System.out.println('Period = ' + Period)
							
            
			var record = new Record(altID);
			java.lang.System.out.println('#2 altID = ' + altID)
			var emailParameters = aa.util.newHashtable();
			
		
			emailParameters.put("$$ENTITY_PROFILE_ID$$", altID);
			emailParameters.put("$$REPORT_PERIOD$$", Period);
						
			capId = record.getCapID();	
            java.lang.System.out.println('#2 capId = ' + capId)	
               
            var gn = new GlobalNotifications();

			gn.sendNotification('Custom', "*", 'GSSGNT_EPRF', emailParameters, null, null, null, emailsArr);

            java.lang.System.out.println('#3 after sendNotification ')	
			updateEPRFNotificationAlert(record, "EPR");
			java.lang.System.out.println('#4 after updateEPRFNotificationAlert ')	
				}
				
			}
            //eval(getScriptText("INCLUDE_EPRF"));
            
			aa.print('END after updateProfileAlert....')
		}
	}
}

function sendProjectPeriodicNotificationReminder() {
    SCRIPT_VERSION = 3.0;
    showDebug = true;
    debug = "";
    emailText = "";
    message = "";
    br = "<br>";
    capId = "";
	
	java.lang.System.out.println('sendProjectPeriodicNotificationReminder START ... ')
		var d = new Date();
		var month = (1 + d.getMonth());
		var currentlvlArr = [];
		currentlvlArr.push("Annual");
		if (month >= 1 && month <= 6) {
			currentlvlArr.push("Second Quarter");
		}
		if (month >= 7 && month <= 12) {
			currentlvlArr.push("Fourth Quarter");
		}
		if (month >= 1 && month <= 3) {
			currentlvlArr.push("First Quarter");
		}
		if (month >= 4 && month <= 6) {
			currentlvlArr.push("Second Quarter");
		}
		if (month >= 7 && month <= 9) {
			currentlvlArr.push("Third Quarter");
		}
		if (month >= 10 && month <= 12) {
			currentlvlArr.push("Fourth Quarter");
		}
	
		var currentlvlJoinedArr = "";
		if (currentlvlArr != null && currentlvlArr.length > 0) {
			currentlvlJoinedArr = currentlvlArr.map(function(v) {
				return "'" + v + "'"
			}).join(",");
	
		} else {
			currentlvlArr = [ "NO DATA" ];
			currentlvlJoinedArr = currentlvlArr.map(function(v) {
				return "'" + v + "'"
			}).join(",");
		}
	
		var ACTIVEQUERYANNUAL = 'NO';
		var ACTIVEQUERYSEMIANNUALPART_1 = 'NO';
		var ACTIVEQUERYSEMIANNUALPART_2 = 'NO';
		var ACTIVEQUERYQUARTERLY_1 = 'NO';
		var ACTIVEQUERYQUARTERLY_2 = 'NO';
		var ACTIVEQUERYQUARTERLY_3 = 'NO';
		var ACTIVEQUERYQUARTERLY_4 = 'NO';
		var annualTimes = [];
		var semiAnnualTimes = [];
		var quarterlyTimes = [];
	
		// read from settings Table:NOTIFICATION CONFIGURATION
		var settRecord = new Record("SPSA Global Settings");
		var ncASIT = settRecord.getASIT('PERIODIC NOTIFICATION');
		if (ncASIT != null) {
			for ( var i in ncASIT) {
				var Period = String(ncASIT[i]['Period']);
				var Unit = String(ncASIT[i]['Unit']);
				var Time = String(ncASIT[i]['Time']);
				var Active = String(ncASIT[i]['Active']);
	
				var currDate = new Date();
	
				if (Active == "CHECKED" && Period == "Annual") {
					if (Unit == "Day") {
						annualTimes.push(Time)
					}
					if (Unit == "Month") {
						annualTimes.push(Time * 30)
					}
				}
				if (Active == "CHECKED" && Period == "Semi Annual") {
					if (Unit == "Day") {
						semiAnnualTimes.push(Time)
					}
					if (Unit == "Month") {
						semiAnnualTimes.push(Time * 30)
					}
				}
				if (Active == "CHECKED" && Period == "Quarterly") {
					if (Unit == "Day") {
						quarterlyTimes.push(Time)
					}
					if (Unit == "Month") {
						quarterlyTimes.push(Time * 30)
					}
				}
			}
	
			aa.print(Unit)
	        var maxAnnualTime = 0;
            var diffDays = 0;

			for (a in annualTimes) {
				if(a== 0){
		           maxAnnualTime = parseInt(annualTimes[a]);
	           }else if(maxAnnualTime < annualTimes[a]){
		          maxAnnualTime = parseInt(annualTimes[a]); //Set MAX Annaual Time
	           }

				var endDate = new Date('12/31/' + currDate.getFullYear());
				var diffTime = Math.abs(endDate - currDate);
				diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				
			}
			
			if (diffDays <= maxAnnualTime) {//if days diff between current date & end year is less than the Max annaul time then send notification.
					ACTIVEQUERYANNUAL = "YES";
		    }
	
			aa.print("month " + month);
			
			var maxSemiAnnualTime = 0;
			var diffSemiAnnaulDays1 = 0;
			var diffSemiAnnaulDays2 = 0;
			
			for (a in semiAnnualTimes) {
				if(a== 0){
		           maxSemiAnnualTime = parseInt(semiAnnualTimes[a]);
	           }else if(maxAnnualTime < semiAnnualTimes[a]){
		          maxSemiAnnualTime = parseInt(semiAnnualTimes[a]); //Set MAX Semi Annaual Time
	           }

				if (month >= 1 && month <= 6) {
					var endDate = new Date('06/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffSemiAnnaulDays1 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				
				

               
				if (month >= 1 && month <= 12) {
					var endDate = new Date('12/31/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffSemiAnnaulDays2 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				
			}
			
			if (diffSemiAnnaulDays1 <= maxSemiAnnualTime) {//if days diff between current date & end year is less than the Max annaul time then send notification.
					ACTIVEQUERYSEMIANNUALPART_1 = "YES";
		     }

			if (diffSemiAnnaulDays2 <= maxSemiAnnualTime) {
						ACTIVEQUERYSEMIANNUALPART_2 = "YES";
			}
			
			
			
			var maxQuarterlyTime = 0;
			var diffQuarterlyTimesDays1 = 0;
			var diffQuarterlyTimesDays2 = 0;
			var diffQuarterlyTimesDays3 = 0;
			var diffQuarterlyTimesDays4 = 0;
			
			for (a in quarterlyTimes) {
				aa.print("a " + a)
				if(a== 0){
		           maxQuarterlyTime = parseInt(quarterlyTimes[a]);
	           }else if(maxQuarterlyTime < quarterlyTimes[a]){
		          maxQuarterlyTime = parseInt(quarterlyTimes[a]); //Set MAX Semi Annaual Time
	           }

				if (month >= 1 && month <= 3) {
					var endDate = new Date('03/31/' + currDate.getFullYear());
					aa.print(currDate)
					aa.print(endDate)
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays1 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					aa.print("diffTime " + diffTime)
					aa.print("diffDays " + diffDays)
					aa.print("quarterlyTimes[a] " + quarterlyTimes[a])
	
					
				}
				if (month >= 4 && month <= 6) {
					var endDate = new Date('06/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays2 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				if (month >= 7 && month <= 9) {
					var endDate = new Date('09/30/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays3 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
				if (month >= 10 && month <= 12) {
					var endDate = new Date('12/31/' + currDate.getFullYear());
					var diffTime = Math.abs(endDate - currDate);
					diffQuarterlyTimesDays4 = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					
				}
			}
			
			if (diffQuarterlyTimesDays1 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_1 = "YES";
			}
					
			if (diffQuarterlyTimesDays2 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_2 = "YES";
			}
					
			if (diffQuarterlyTimesDays3 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_3 = "YES";
			}
					
			if (diffQuarterlyTimesDays4 <= maxQuarterlyTime) {
						ACTIVEQUERYQUARTERLY_4 = "YES";
			}
			
			

			var SQL = "";
			SQL += " DECLARE @YEAR NVARCHAR(50) SET @YEAR= CAST(YEAR(GETDATE()) AS NVARCHAR(50))";
			SQL += " DECLARE @ACTIVEQUERYANNUAL NVARCHAR(50) SET @ACTIVEQUERYANNUAL= '"
					+ String(ACTIVEQUERYANNUAL) + "' ";
			SQL += " DECLARE @ACTIVEQUERYSEMIANNUALPART_1 NVARCHAR(50) SET @ACTIVEQUERYSEMIANNUALPART_1= '"
					+ String(ACTIVEQUERYSEMIANNUALPART_1) + "' ";
			SQL += " DECLARE @ACTIVEQUERYSEMIANNUALPART_2 NVARCHAR(50) SET @ACTIVEQUERYSEMIANNUALPART_2= '"
					+ String(ACTIVEQUERYSEMIANNUALPART_2) + "' ";
			SQL += " DECLARE @ACTIVEQUERYQUARTERLY_1 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_1= '"
					+ String(ACTIVEQUERYQUARTERLY_1) + "' ";
			SQL += " DECLARE @ACTIVEQUERYQUARTERLY_2 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_2= '"
					+ String(ACTIVEQUERYQUARTERLY_2) + "' ";
			SQL += " DECLARE @ACTIVEQUERYQUARTERLY_3 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_3= '"
					+ String(ACTIVEQUERYQUARTERLY_3) + "' ";
			SQL += " DECLARE @ACTIVEQUERYQUARTERLY_4 NVARCHAR(50) SET @ACTIVEQUERYQUARTERLY_4= '"
					+ String(ACTIVEQUERYQUARTERLY_4) + "' ";
			SQL += " SELECT * FROM (";
			SQL += " SELECT B.B1_ALT_ID,ISNULL(LPRS_CREATED_DATE.B1_CHECKLIST_COMMENT  ,'10/10/1900') AS PRPRDATE";
			SQL += " ,PERIOD.ATTRIBUTE_VALUE AS PERIOD ";
			SQL += " ,(CASE";
			SQL += " WHEN ISNULL(PERIOD.ATTRIBUTE_VALUE ,'') <> '' AND ISNULL(PERIOD.ATTRIBUTE_VALUE ,'') <> '' THEN";
			SQL += " CASE";
			SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Annual' THEN 'Annual'";
			SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Semi Annual' AND (1 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=6)  THEN 'Second Quarter'";
			SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Semi Annual' AND (7 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=12) THEN 'Fourth Quarter'";
			SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (1 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=3)	THEN 'First Quarter'";
			SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (4 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=6)	THEN 'Second Quarter'";
			SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (7 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=9)	THEN 'Third Quarter'";
			SQL += " WHEN PERIOD.ATTRIBUTE_VALUE = 'Quarterly' AND (10 <= DATEPART(MONTH,GETDATE()) AND DATEPART(MONTH,GETDATE()) <=12)	THEN 'Fourth Quarter'";
			SQL += " ELSE 'Nothing' END";
			SQL += " ELSE '' ";
			SQL += " END) AS EPRF_CURRUENT_LEVEL";
			SQL += " FROM B1PERMIT B";
			SQL += " left join B1PERMIT ProfileID";
			SQL += " on ProfileID.SERV_PROV_CODE=b.SERV_PROV_CODE";
			SQL += " and ProfileID.B1_ALT_ID=DBO.FN_GET_APP_SPEC_INFO(B.SERV_PROV_CODE,B.B1_PER_ID1,B.B1_PER_ID2,B.B1_PER_ID3,'Entity Profile ID')";
			SQL += " INNER JOIN BCHCKBOX LEVEL ON Level.SERV_PROV_CODE=ProfileID.SERV_PROV_CODE";
			SQL += " AND Level.B1_PER_ID1 =ProfileID.B1_PER_ID1";
			SQL += " AND Level.B1_PER_ID2 =ProfileID.B1_PER_ID2";
			SQL += " AND Level.B1_PER_ID3 =ProfileID.B1_PER_ID3";
			SQL += " AND Level.B1_CHECKBOX_DESC='Entity Classification'";
			SQL += " INNER JOIN B1PERMIT RecordSetting";
			SQL += " ON RecordSetting.B1_ALT_ID ='SPSA Global Settings'";
			SQL += " INNER JOIN BAPPSPECTABLE_VALUE PERIOD";
			SQL += " ON PERIOD.serv_prov_code = RecordSetting.serv_prov_code";
			SQL += " AND PERIOD.b1_per_id1 = RecordSetting.b1_per_id1";
			SQL += " AND PERIOD.b1_per_id2 = RecordSetting.b1_per_id2";
			SQL += " AND PERIOD.b1_per_id3 = RecordSetting.b1_per_id3";
			SQL += " AND PERIOD.TABLE_NAME = 'PROJECT PERIODIC SUBMISSION'";
			SQL += " AND PERIOD.COLUMN_NAME = 'Submission PERIOD'";
			SQL += " INNER JOIN BAPPSPECTABLE_VALUE Lvl";
			SQL += " ON Lvl.serv_prov_code = RecordSetting.serv_prov_code";
			SQL += " AND Lvl.b1_per_id1 = RecordSetting.b1_per_id1";
			SQL += " AND Lvl.b1_per_id2 = RecordSetting.b1_per_id2";
			SQL += " AND Lvl.b1_per_id3 = RecordSetting.b1_per_id3";
			SQL += " AND Lvl.TABLE_NAME = 'PROJECT PERIODIC SUBMISSION'";
			SQL += " AND Lvl.COLUMN_NAME = 'Level'";
			SQL += " AND Lvl.ROW_INDEX = PERIOD.ROW_INDEX";
			SQL += " AND Lvl.ATTRIBUTE_VALUE = Level.B1_CHECKLIST_COMMENT";
			SQL += " INNER JOIN BAPPSPECTABLE_VALUE PERIOD_ACTIVE ON PERIOD_ACTIVE.serv_prov_code = RecordSetting.serv_prov_code ";
			SQL += " AND PERIOD_ACTIVE.b1_per_id1 = RecordSetting.b1_per_id1 ";
			SQL += " AND PERIOD_ACTIVE.b1_per_id2 = RecordSetting.b1_per_id2 ";
		    SQL += " AND PERIOD_ACTIVE.b1_per_id3 = RecordSetting.b1_per_id3 ";
            SQL += " AND PERIOD_ACTIVE.TABLE_NAME = 'PROJECT PERIODIC SUBMISSION' ";
            SQL += " AND PERIOD_ACTIVE.COLUMN_NAME = 'Active' ";
            SQL += " AND PERIOD_ACTIVE.ROW_INDEX = PERIOD.ROW_INDEX ";
            SQL += " AND PERIOD_ACTIVE.ATTRIBUTE_VALUE = 'CHECKED' ";	
			SQL += " LEFT JOIN BCHCKBOX AS LPRS_RECID";
			SQL += " ON B.SERV_PROV_CODE = LPRS_RECID.SERV_PROV_CODE";
			SQL += " AND B.B1_PER_ID1 = LPRS_RECID.B1_PER_ID1";
			SQL += " AND B.B1_PER_ID2 = LPRS_RECID.B1_PER_ID2";
			SQL += " AND B.B1_PER_ID3 = LPRS_RECID.B1_PER_ID3";
			SQL += " AND LPRS_RECID.B1_CHECKBOX_TYPE = 'LAST PERIODIC REPORT SUBMITTED'";
			SQL += " AND LPRS_RECID.B1_CHECKBOX_DESC = 'Record ID'";
			SQL += " LEFT JOIN BCHCKBOX AS LPRS_CREATED_DATE";
			SQL += " ON B.SERV_PROV_CODE = LPRS_CREATED_DATE.SERV_PROV_CODE";
			SQL += " AND B.B1_PER_ID1 = LPRS_CREATED_DATE.B1_PER_ID1";
			SQL += " AND B.B1_PER_ID2 = LPRS_CREATED_DATE.B1_PER_ID2";
			SQL += " AND B.B1_PER_ID3 = LPRS_CREATED_DATE.B1_PER_ID3";
			SQL += " AND LPRS_CREATED_DATE.B1_CHECKBOX_TYPE = 'LAST PERIODIC REPORT SUBMITTED'";
			SQL += " AND LPRS_CREATED_DATE.B1_CHECKBOX_DESC = 'Created Date'";
			SQL += " WHERE B.SERV_PROV_CODE = 'SPSA'";
			SQL += " AND B.B1_PER_GROUP = 'OSHJ'";
			SQL += " AND B.B1_PER_TYPE = 'Projects'";
			SQL += " AND B.B1_PER_SUB_TYPE = 'Project Profile'";
			SQL += " AND B.B1_PER_CATEGORY = 'PRPL'";
			SQL += " AND B.B1_APPL_STATUS != 'Completed' "
			SQL += " ) TB_RESULT WHERE ";
			SQL += " ((TB_RESULT.PERIOD='Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Annual' AND ";
			SQL += " @ACTIVEQUERYANNUAL='YES'";
			SQL += " AND(( DATEPART(YEAR,CAST(TB_RESULT.PRPRDATE AS DATE)) < DATEPART(YEAR,GETDATE()))))";
			SQL += " OR";
			SQL += " ((TB_RESULT.PERIOD='Semi Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Second Quarter' AND";
			SQL += " @ACTIVEQUERYSEMIANNUALPART_1='YES'";
			SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('01/01/'+@YEAR AS DATE) AND CAST('06/30/'+@YEAR AS DATE)))";
			SQL += " OR";
			SQL += " ((TB_RESULT.PERIOD='Semi Annual' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Fourth Quarter' AND ";
			SQL += " @ACTIVEQUERYSEMIANNUALPART_2='YES'";
			SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('07/01/'+@YEAR AS DATE) AND CAST('12/31/'+@YEAR AS DATE)))";
			SQL += " OR";
			SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='First Quarter' AND ";
			SQL += " @ACTIVEQUERYQUARTERLY_1= 'YES'";
			SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('01/01/'+@YEAR AS DATE) AND CAST('03/31/'+@YEAR AS DATE)))";
			SQL += " OR";
			SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Second Quarter' AND ";
			SQL += " @ACTIVEQUERYQUARTERLY_2= 'YES'";
			SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('04/01/'+@YEAR AS DATE) AND CAST('06/30/'+@YEAR AS DATE)))";
			SQL += " OR";
			SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Third Quarter' AND ";
			SQL += " @ACTIVEQUERYQUARTERLY_3= 'YES'";
			SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('07/01/'+@YEAR AS DATE) AND CAST('09/30/'+@YEAR AS DATE)))";
			SQL += " OR";
			SQL += " ((TB_RESULT.PERIOD='Quarterly' AND TB_RESULT.EPRF_CURRUENT_LEVEL='Fourth Quarter' AND ";
			SQL += " @ACTIVEQUERYQUARTERLY_4= 'YES'";
			SQL += " AND CAST(TB_RESULT.PRPRDATE AS DATE) NOT BETWEEN  CAST('10/01/'+@YEAR AS DATE) AND CAST('12/31/'+@YEAR AS DATE))))";
			SQL += " AND TB_RESULT.EPRF_CURRUENT_LEVEL IN" + "("
					+ currentlvlJoinedArr + ")";
			SQL += " AND b1_alt_id IN  ";
			SQL += " (SELECT  B.B1_ALT_ID ";
			SQL += " FROM B1PERMIT B ";
			SQL += " JOIN B1PERMIT MAS ON MAS.serv_prov_code = B.serv_prov_code ";
			SQL += " AND MAS.b1_per_id1 = B.B1_PER_ID1 ";
			SQL += " AND MAS.b1_per_id2 = B.B1_PER_ID2 ";
			SQL += " AND MAS.b1_per_id3 = B.B1_PER_ID3 ";
			SQL += " AND MAS.b1_per_group = 'OSHJ' ";
			SQL += " AND MAS.B1_PER_TYPE = 'Projects' ";
			SQL += " AND MAS.B1_PER_SUB_TYPE = 'Project Profile' ";
			SQL += " AND MAS.b1_per_category = 'PRPL' ";
			SQL += " AND MAS.B1_APPL_CLASS = 'COMPLETE' ";
			SQL += " AND MAS.REC_STATUS = 'A' ";
			SQL += " INNER JOIN BCHCKBOX ActivityClassification ON ActivityClassification.SERV_PROV_CODE =MAS.SERV_PROV_CODE ";
			SQL += " AND ActivityClassification.B1_PER_ID1 =MAS.B1_PER_ID1 ";
			SQL += " AND ActivityClassification.B1_PER_ID2 =MAS.B1_PER_ID2 ";
			SQL += " AND ActivityClassification.B1_PER_ID3 =MAS.B1_PER_ID3 ";
			SQL += " AND ActivityClassification.B1_CHECKBOX_DESC='Project Type' ";
			SQL += " INNER JOIN B1PERMIT RecordSetting ON RecordSetting.B1_PER_GROUP = 'OSHJ' ";
			SQL += " AND RecordSetting.B1_PER_TYPE = 'Settings' ";
			SQL += " AND RecordSetting.B1_PER_SUB_TYPE = 'General Settings' ";
			SQL += " AND RecordSetting.B1_PER_CATEGORY = 'SPSAGS' ";
			SQL += " AND RecordSetting.B1_ALT_ID = 'SPSA Global Settings' ";
			SQL += " INNER JOIN BAPPSPECTABLE_VALUE Activity ON Activity.serv_prov_code = RecordSetting.serv_prov_code ";
			SQL += " AND Activity.b1_per_id1 = RecordSetting.b1_per_id1 ";
			SQL += " AND Activity.b1_per_id2 = RecordSetting.b1_per_id2 ";
			SQL += " AND Activity.b1_per_id3 = RecordSetting.b1_per_id3 ";
			SQL += " AND Activity.TABLE_NAME = 'PROJECT ACTIVITIES PRIVILEGES' ";
			SQL += " AND Activity.COLUMN_NAME = 'Activity' ";
			SQL += " AND Activity.ATTRIBUTE_VALUE = ActivityClassification.B1_CHECKLIST_COMMENT ";
			SQL += " INNER JOIN BAPPSPECTABLE_VALUE PeriodicReport ON PeriodicReport.serv_prov_code = RecordSetting.serv_prov_code ";
			SQL += " AND PeriodicReport.b1_per_id1 = RecordSetting.b1_per_id1 ";
			SQL += " AND PeriodicReport.b1_per_id2 = RecordSetting.b1_per_id2 ";
			SQL += " AND PeriodicReport.b1_per_id3 = RecordSetting.b1_per_id3 ";
			SQL += " AND PeriodicReport.TABLE_NAME = 'PROJECT ACTIVITIES PRIVILEGES' ";
			SQL += " AND PeriodicReport.COLUMN_NAME = 'Periodic Report' ";
			SQL += " AND PeriodicReport.ROW_INDEX = Activity.ROW_INDEX ";
			SQL += " AND PeriodicReport.ATTRIBUTE_VALUE ='CHECKED' ";
			SQL += " WHERE B.SERV_PROV_CODE = 'SPSA' ";
			SQL += " AND B.B1_PER_GROUP = 'OSHJ' ";
			SQL += " AND B.B1_PER_TYPE ='Projects' ";
			SQL += " AND B.B1_PER_SUB_TYPE ='Project Profile' ";
			SQL += " AND B.b1_per_category ='PRPL') ";
	
			java.lang.System.out.println('sendProjectPeriodicNotificationReminder SQL = ' + SQL)
			var date = new Date();
			var dt = new com.accela.aa.util.DateTimeUtil(aa
					.getServiceProviderCode());
			var currDate = dt.format(date, "MM/dd/yyyy");
			var currYearInt = parseInt(currDate.split('/')[2] + "");
			var currYear = currYearInt + "";
			var monthINT = parseInt(currDate.split('/')[0] + "");
			// var month = monthINT + "";
	
			var result = SPSABASE.runSQL(SQL, null);
			var lstresult = result.toArray();
			aa.print("result length " + lstresult.length)
			for (index in lstresult) {
				var altID = lstresult[index].B1_ALT_ID + "";
				aa.print(altID)
				var submissionPeriod = lstresult[index].PERIOD + "";
				var EPRF_CURRUENT_LEVEL = lstresult[index].EPRF_CURRUENT_LEVEL + "";
				var Period = "";
				var eprfRec = new Record(altID);
				var emailsArr = [];
				var emailParameters = aa.util.newHashtable();
				addParameter(emailParameters, "$$NO_EXTRA_PARAMETERS$$", "");
				var contactArr = aa.people.getCapContactByCapID(eprfRec.getCapID())
						.getOutput();
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
	
					if (emailsArr.length > 0) {
						if (submissionPeriod == "Annual") {
							Period = "(Jan 01 - Dec 30 " + currYear + ")";
						} else if (submissionPeriod == "Quarterly") {
							if (month >= 1 && month <= 3) {
								Period = "(Jan 01 - Mar 31 " + currYear + ")";
							}
							if (month >= 4 && month <= 6) {
								Period = "(Apr 01 - Jun 30 " + currYear + ")";
							}
							if (month >= 7 && month <= 9) {
								Period = "(Jul 01 - Sept 30 " + currYear + ")";
							}
							if (month >= 10 && month <= 12) {
								Period = "(Oct 01 - Dec 31 " + currYear + ")";
							}
	
						} else if (submissionPeriod == "Semi Annual") {
							if (month >= 1 && month <= 6) {
								Period = "(Jan 01 - Jun 30 " + currYear + ")";
							}
							if (month >= 7 && month <= 12) {
								Period = "(Jul 01 - Dec 31" + currYear + ")";
							}
						} else {
							// 
						}
	
						// Send Notification
						/*var emailParameters = aa.util.newHashtable();
						emailParameters.put("$$ENTITY_PROFILE_ID$$", altID);
						emailParameters.put("$$REPORT_PERIOD$$", Period);
						aa.print("rsa")
						GlobalNotifications.sendEmailByTemplate("GSSGNT-00007",
								emailsArr, emailParameters, eprfRec.getCapID());*/
					}
				}
				var record = new Record(altID)
				
				var emailParameters = aa.util.newHashtable();
				emailParameters.put("$$ENTITY_PROFILE_ID$$", altID);
				emailParameters.put("$$REPORT_PERIOD$$", Period);
						
				capId = record.getCapID();	
                aa.print('capId = ' + capId)	
               
               var gn = new GlobalNotifications();

			   gn.sendNotification('Custom', "*", 'GSSGNT_PPR', emailParameters, null, null, null, emailsArr);
				
				var cap = record.getCapModel();
                cap.setQUD1('PPR:1')
                aa.cap.editCapByPK(cap);

				//record.updateEntityProfilesSubmission('PPR', true);
				
			}
		}
	}
function updateEPRFNotificationAlert(record, key)
{
	var cap = record.getCapModel();

	var alertsDetails = cap.getQUD1();
	java.lang.System.out.println("updateEPRFNotificationAlert #1 -alertsDetails = " + alertsDetails)

	if (alertsDetails == null || alertsDetails == "") {
		if(key == "SD")
		{
			cap.setQUD1("EPR:0;SD:1");
		}
		else
		{
			cap.setQUD1("EPR:1;SD:0");
		}
		
	} else {
		var arr = alertsDetails.split(';');
		var newArray = [];
		for ( var x in arr) {
			if (arr[x].indexOf(key) > -1) {
				var sdValue = arr[x].split(":");
				var newValue = sdValue[0] + ":1";

				newArray.push(newValue)
			} else {
				newArray.push(arr[x])
			}
		}
		var str = "";
		for ( var y in newArray) {
			str += newArray[y] + ";"
		}
		java.lang.System.out.println("updateEPRFNotificationAlert #1 -new str = " + str)
		cap.setQUD1(str);
	}
	
	aa.cap.editCapByPK(cap);
}
function formatMMDDYYY(dateDDMMYYY){
	var dates = String(dateDDMMYYY).split(" ");
	var array = String(dates[0]).split("/")

   return array[1]+ "/" + array[0] + "/" + array[2];
	
}