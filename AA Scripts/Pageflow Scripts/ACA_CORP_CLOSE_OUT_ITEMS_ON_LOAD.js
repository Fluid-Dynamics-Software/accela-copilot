/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_CORP_CLOSE_OUT_ITEMS_ON_LOAD.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: RSA
| Created at	: 15/09/2021 13:39:05
|
/------------------------------------------------------------------------------------------------------*/

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
eval(getScriptText("INCLUDE_ACABASE"));
eval(getScriptText("INCLUDE_CORP"));
eval(getScriptText("INCLUDE_EPRF"));
eval(getScriptText("INCLUDE_UTILS"));

ACABASE.prototype.execute = function() {
	try {
		var capModel = this.getCapModel();
		var capId = capModel.getCapID();
        var selectedRecordCloseoutItems = 0;
        if (capModel.getCapStatus() != 'Correction or Update required') {
		var tables = this.getASITables();

		//get CLOSE OUT RECORDS DETAILS for this CORP
		var closeOutRecDetails = tables.get("CLOSE OUT RECORDS DETAILS");
		//find the selected item, and get record ID
		var selectedRecordId = null;
		if (closeOutRecDetails != null) {
			for ( var r in closeOutRecDetails) {
				if (closeOutRecDetails[r]["Select"] == "CHECKED") {
					selectedRecordId = closeOutRecDetails[r]["Record ID"];
					break;
				}
			}
		}

		if (selectedRecordId != null) {
			var selectedRec = new Record(selectedRecordId);
			
			var requestType = this.getAppSpecific("Request Type");

			var parentcapID = capModel.getParentCapID();
			var parentRecID = parentcapID.getCustomID();
			var parentRecord = new Record(parentRecID);

			var closeOutItemsSource = parentRecord.getASIT("CLOSE OUT ITEMS")
                var newDataSet = [];

			for ( var x in closeOutItemsSource) {
				var obj = [];
				var requestId = closeOutItemsSource[x][EPRF.ASIT.closeOutItems.requestId];
				var closeOutRequestType = closeOutItemsSource[x]['Close Out Request Type'];

                if(requestId == selectedRecordId){
					selectedRecordCloseoutItems += 1;
					}

                  
					}
					}

			var msg = "";

			var closeoutItemsTable = tables.get("CLOSE OUT ITEMS");

			if(!closeoutItemsTable || closeoutItemsTable.length == 0){
				msg = aa.messageResources.getLocalMessage("CORP_CLOSEOUT_ITEMS_ALL_ITEMS_SUBMITTED");
				

			}else if(closeoutItemsTable && selectedRecordCloseoutItems > closeoutItemsTable.length){
				var diffItems = selectedRecordCloseoutItems - closeoutItemsTable.length;
				msg = aa.messageResources.getLocalMessage("CORP_SOME_CLOSEOUT_ITEMS_ALL_ITEMS_SUBMITTED").replace("{0}",String(diffItems));

					}

			if(msg){
                this.showMessage(msg);
            }
					}

					

	} catch (e) {
		this.showMessage("ERROR: " + e, e + "");
	}
}

run();