var name = getAppSpecificBefore("User Type");
var altId = "UTAG:" + name;
var existingCapId = aa.cap.getCapID(altId).getOutput();
if (existingCapId){
	cancelSubmission("A User Type Configuration Already Exists with the name: " + altId);
}

function cancelSubmission(msg){
	cancel = true;
	showMessage = true;
	comment(aa.messageResources.getLocalMessage("**ERROR: ALTID Update Failed: " + msg));				
}

function getAppSpecificBefore(fieldName)
{
   fieldName = fieldName.trim();
   for(loopk in AppSpecificInfoModels)
   {
      if (AppSpecificInfoModels[loopk].checkboxDesc == fieldName)
         return AppSpecificInfoModels[loopk].checklistComment;
 }
}