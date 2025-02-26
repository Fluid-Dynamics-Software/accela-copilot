/*------------------------------------------------------------------------------------------------------/
| Program		: DUA:PLOTSMARKETS-MARKETS-*-*.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 23/03/2020 16:02:17
|
/------------------------------------------------------------------------------------------------------*/


eval(getScriptText("INCLUDE_ANMC"));
var allowedService = ["RMCT", "MCCT", "TICT", "VMCT", "DMCT", "MMCT"];
var serviceCode;

var rec = new Record(capId);
//The event Moved to WFTUA event instead of DUA
//copySignedLicense(rec);

function copySignedLicense(rec) {
	javaLog('copySignedLicense REC: ' + rec);
	serviceCode = getServiceCode(rec);
	if(rec.hasDocumentOfType('Contract') && isAllowedService(rec)){
		javaLog('Service Allowed');
		var parentsArray = rec.getParents("PlotsMarkets/Markets/New Market Contract/ANMC",Record, null, true);
		var activeParent = null;
		for(prnt in parentsArray){
			javaLog("parentsArray[prnt]: " + parentsArray[prnt]);
			javaLog("parentsArray[prnt].getCapStatus(): " + parentsArray[prnt].getCapStatus());
			if(parentsArray[prnt].getCapStatus() == "Active"){
				activeParent = parentsArray[prnt];
				break;
			}
		}
		for(i in parentsArray){
			var parent = parentsArray[i];
			if(parent.getCapStatus() == "Pending Approval"){
				if(activeParent != null){
					rec.copySharepointDocuments_except(activeParent.capId, parent.getCapID(), 'Contract');
				}
				rec.copySharepointDocumentsList(capId, parent.getCapID(), 'Contract');
			}
		}
	}
}

function isAllowedService(rec){
	if(rec == null || rec.getCurrentWorkflowTask() == null || rec.getCurrentWorkflowTask().getTaskDescription() == null){
		return false;
	}
	
	if(rec.getCurrentWorkflowTask().getTaskDescription() != 'Sign Contract' ){
		return false;
	}
	
	for(i in allowedService){
		if(serviceCode == allowedService[i]){
			return true;
		}
	}
	
	return false;
}

function getServiceCode(rec){
	var recTypeArray = (rec.getCapType()+"").split('/');
	return recTypeArray[3];
}