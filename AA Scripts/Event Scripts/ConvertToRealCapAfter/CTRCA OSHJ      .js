/*------------------------------------------------------------------------------------------------------/
| Program       : CTRCA:BUILDING.js
| Event         : 
|
| Usage         : 
| Notes         : auto generated Record Script by Accela Eclipse Plugin 
| Created by    : MDERNAIKA
| Created at    : 12/07/2021 10:29:16
|
/------------------------------------------------------------------------------------------------------*/
try {
    //  if (publicUser) {
    //      var user = aa.publicUser.getPublicUserByPUser(publicUserID).getOutput();
    //      if (user != null) {
    //          var email = user.getEmail() + "";
    //          if (email != "") {
    //              var contact = getContactDataByEmailID(email);
    //              aa.people.createCapContactWithRefPeopleModel(capId, contact)
    //                      .getOutput();
    //          }
    //      }
    //
    //  }
//    java.lang.System.out.println("ConvertToRealCap ParentId " + parentCapId + " " + capId);
    if (parentCapId != null && parentCapId != "") {
        eval(getScriptText("INCLUDE_RECORD"));
        var parentrecord = new Record(parentCapId)
        var record = new Record(capId);
        

		var copyContacts = true;
		if (record.getCapType() == "OSHJ/Profile/Update Entity Profile/UEPR") {
//			if (record.getASI("AMENDMENT TYPE", "Change Entity Representative") == "CHECKED") {
				copyContacts = false;
//			}
		}

		if (copyContacts) {
			record.copyContacts(parentrecord);
		}
        record.copyAddress(parentCapId);
    } else if (publicUser) {

        eval(getScriptText("INCLUDE_RECORD"));

        eval(getScriptText("INCLUDE_UTILS"));

		var record = new Record(capId);
		if (record.getCapType() != "OSHJ/Classification/Entity Registration/ERCL" && record.getCapType() != "OSHJ/Profile/Update Entity Profile/UEPR") {
//			var user = aa.publicUser.getPublicUserByPUser(publicUserID)
//					.getOutput();
//			if (user != null) {
//				var email = user.getEmail() + "";
//				if (email != "") {
					var contact = Utils.getPublicUserContact(publicUserID);
					aa.people
							.createCapContactWithRefPeopleModel(capId, contact)
							.getOutput();
//				}
//			}
		}
	}
} catch (e) {
    cancel = true;
    showMessage = true;
    comment(e);
   // aa.print(e)
}
function getContactDataByEmailID(email) {
    var po = aa.people.getPeopleModel();
    po.setFirstName("*");
    po.setAuditStatus("A");
    po.setServiceProviderCode(aa.getServiceProviderCode());
    po.setEmail(email);
    var ModelArray = aa.people.getPeopleByPeopleModel(po).getOutput();
    for ( var c in ModelArray) {
        var pModel = ModelArray[c].getPeopleModel();
        if (pModel) {
            return pModel;
        }
    }
    return null;
}