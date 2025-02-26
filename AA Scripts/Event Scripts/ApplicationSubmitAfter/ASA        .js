/*------------------------------------------------------------------------------------------------------/
| Program		: ASA:Global.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MDERNAIKA
| Created at	: 14/07/2021 16:39:42
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText('INCLUDE_RECORD'));
eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS'));

try {
	eval(getScriptText('INCLUDE_GLOBALNOTIFICATIONS'));
	var gn = new GlobalNotifications();
	gn.sendNotification('Application Submission', "*", "*");
} catch (err) {
	logDebug("Error on Notification in ASA:*/*/*/*, capId: " + capId, err);
}

try {

	var rec = new Record(capId);

	var cap = rec.getCapModel();

	var taskName = '';
	
	var wfProcess = '';

	var wfTaskDetails = rec.getASI("SENDBACK DETAILS", "Task Name") //cap.getQUD4();

	if (wfTaskDetails != null && wfTaskDetails != '') {

		var arr = wfTaskDetails.split('::');

		if (arr.length == 3) {

			taskName = arr[0];
			wfProcess = arr[1];
		}

	}
	//     else if(rec.getCapType() == "OSHJ/Classification/Entity Registration/ERCL")
	//    	 {
	//    	 taskName = "Review Representatives Details";
	//    	 }
	//
	//     if(rec.getCapType() == "OSHJ/Classification/Entity Registration/ERCL")
	//	 {
	//    	 
	//    	 cap.setQUD4("");
	//	 }

	var category = cap.getCapType().getCategory();

	var recordStatus = rec.getCapStatus();

	if ((recordStatus == 'Correction or Update required' && taskName != '') || (recordStatus == 'Correction or Update Required' && taskName != '')

	|| (recordStatus == "Rejected") && taskName != '') {

		cap.setCapClass('COMPLETE');

		aa.cap.editCapByPK(cap);

		activateTask(taskName, wfProcess);
		//var currentWfTask = rec.getCurrentWorkflowTask();

		rec.updateTaskAndHandleDisposition(taskName, 'Updated', '');
		
		if (wfProcess.indexOf('BUAL') == 0 || wfProcess.indexOf('SLMAL') == 0) {
			rec.activateTask('Approval Levels');
			rec.activateTask('Escalation and Approval');
		}

	} else {

		//          eval(getScriptText("INCLUDE_GLOBALNOTIFICATIONS"));
		//
		//          var gn = new GlobalNotifications();
		//
		//          if (gn != null) {
		//
		//              gn.sendNotification("CTRA", 'ALL', 'Submitted');
		//
		//          }

	}


} catch (e) {

	cancel = true;

	showMessage = true;

	comment(e);

}