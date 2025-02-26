/*------------------------------------------------------------------------------------------------------/
| Program		: WFTUA:Global.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MDERNAIKA
| Created at	: 14/07/2021 17:21:30
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText('INCLUDE_RECORD'));

try {

	//     eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
	//
	//     var gn = new GlobalNotifications();
	//
	//     if (gn != null) {
	//
	//          gn.sendNotification("WorkFlow", wfTask, wfStatus);
	//
	//     }

	java.lang.System.out.println("===wfStatus1 " + wfStatus)
	java.lang.System.out.println("===wfProcess2 " + wfProcess)
	java.lang.System.out.println("===wfTask2 " + wfTask)
	if (wfStatus == 'Incomplete' || wfStatus == 'Incomplete (Send Report)') {

		var rec = new Record(capId);

		var cap = rec.getCapModel();

		var numberOfSendBack = 0;

		var wfTaskDetails = rec.getASI("SENDBACK DETAILS", "Task Name")//cap.getQUD4();

		if (wfTaskDetails != null && wfTaskDetails != '') {

			var res = wfTaskDetails.split('::');

			if (res.length == 3) {

				var taskName = res[0];

				numberOfSendBack = parseInt(res[2]);

				if (wfTask == taskName) {

					numberOfSendBack++;

				}

			}

		}

		cap.setCapClass('EDITABLE');

		//		if (wfTask != "Review Representatives Details") {
		//
		//			numberOfSendBack++;
		//			cap.setQUD4(wfTask + '::' + numberOfSendBack);
		//
		//		}

		aa.cap.editCapByPK(cap);

		rec.editASI("SENDBACK DETAILS", "Task Name", wfTask + '::' + wfProcess + '::' + numberOfSendBack)

		rec.deactivateTask(wfTask);
		if (wfProcess.indexOf('BUAL') == 0 || wfProcess.indexOf('SLMAL') ==0) {

			var tasks = aa.workflow.getTasks(capId).getOutput();
			for ( var i in tasks) {
				var task = tasks[i];
				var taskName = task.getTaskDescription();
				if (taskName == wfTask) {
					var stepNumber = task.getStepNumber();
					if (task.getActiveFlag().equals("Y")) {
//						aa.workflow.adjustTask(capId, stepNumber, "N", task.getCompleteFlag(), null, null);
						aa.workflow.adjustTask(capId, task.getStepNumber(),task.getProcessID(), "N", task.getCompleteFlag(), task.getAssignmentDate(), task.getDueDate());
					}
				}
			}

			rec.deactivateTask('Approval Levels');
			rec.deactivateTask('Escalation and Approval');
		}
	}

	if (wfStatus == 'Escalate') {
		if (wfProcess.indexOf('BUAL') == 0) {
			var currentUser = aa.people.getSysUserByID(aa.getAuditID()).getOutput();
			var userDept = currentUser.getDeptOfUser();

			var separator = "/";
			var NA = "NA";
			var agency = currentUser.getAgencyCode();
			var bureau = currentUser.getBureauCode();
			var division = currentUser.getDivisionCode();
			var section = currentUser.getSectionCode();
			var group = currentUser.getGroupCode();
			var office = currentUser.getOfficeCode();

			if (group == 'NA') {
				if (section == 'DPT') {
					if (String(wfTask) == 'Section Head Review') {
						this.updateTaskAndHandleDisposition("Deputy Manager Review", wfStatus, "");
					}
				} else {
					if (bureau != 'NA') {
						if (division == 'NA') {
							deactivateSubProcessTask("Section Head Review");
							deactivateSubProcessTask("Deputy Manager Review");
							deactivateSubProcessTask("Manager Review");
							
							this.updateTaskAndHandleDisposition("SPSA Manager Review", wfStatus, "");
							activateTask('SPSA Chairman Review',wfProcess);
						} else {
							deactivateSubProcessTask("Section Head Review");
							deactivateSubProcessTask("Deputy Manager Review");
							deactivateSubProcessTask("Manager Review");
							
							this.updateTaskAndHandleDisposition("Manager Review", wfStatus, "");
							activateTask('SPSA Manager Review',wfProcess);
						}
					}
				}
			}
		}
		
		if (wfProcess.indexOf('SLMAL') == 0) {
			deactivateSubProcessTask("Section Head Review");
		}
	}

	
} catch (e) {

	cancel = true;

	showMessage = true;

	comment(e);

}

try {
	eval(getScriptText('INCLUDE_GLOBALNOTIFICATIONS'));
	var gn = new GlobalNotifications();
	logDebug("About to Send Automatic Workflow Notifications!");
	java.lang.System.out.println("===Custom Log RSA ==> " + wfTask + wfStatus);
	workflowStep = wfTask;
	workflowStepStatus = wfStatus;
	gn.sendNotification('Work Flow', wfTask, wfStatus);

} catch (err) {
	logDebug("Error on Notification in WFTUA:*/*/*/*, capId: " + capId, err);
}
function deactivateSubProcessTask(wfTask){
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
function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null) {
		msg2 = "";
	} else {
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2);
}