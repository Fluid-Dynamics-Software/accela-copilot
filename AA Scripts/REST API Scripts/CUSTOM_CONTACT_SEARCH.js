/*------------------------------------------------------------------------------------------------------/
| Program		: CUSTOM_CONTACT_SEARCH.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 05/12/2022 19:10:48
|
/------------------------------------------------------------------------------------------------------*/

eval(getScriptText("INCLUDE_CONT"));
var LANGS = {
	"ar-AE" : "ar_AE",
	"en-US" : "en_US"
}
var res = [];
var altId = aa.env.getValue("capId");
var params = aa.env.getValue("params");
var thisRecord = new Record(altId);
params = JSON.parse(JSON.parse(params));
var result = CONT.SearchContacts(params)
for(var index = 0; index<result.length; index++){
	var rec =  new Record(result[index]["ALTID"]);
	if(params.control == "BCC"){
		var contObj = {
				"Contact Ref ID": rec.getASI("REFERENCE CONTACT","Ref Contact ID",""),
				"System ID": rec.getCustomID(),
				"Contacts first name": rec.getASI("INDIVIDUAL","First Name EN",""),
				"Contacts middle name": rec.getASI("INDIVIDUAL","Middle Name EN",""),
				"Contacts family name": rec.getASI("INDIVIDUAL","Last Name EN",""),
				"Contacts Emirates ID number": rec.getASI("INDIVIDUAL","EID Number",""),
				"Contact phone number": rec.getASI("INDIVIDUAL","Permanent Mobile",""),
				"Contact email": rec.getASI("INDIVIDUAL","Email",""),
		}
		res.push(contObj);
	}
	if(params.control == "SCI"){
		if(rec.getASI("REFERENCE CONTACT","Contact Type","") == "INDIVIDUAL"){
			var contObj = {
					"Contact Ref ID": rec.getASI("REFERENCE CONTACT","Ref Contact ID",""),
					"System ID": rec.getCustomID(),					
					"Shareholder Name": rec.getASI("INDIVIDUAL","First Name EN","") +" "+rec.getASI("INDIVIDUAL","Middle Name EN","")+" "+rec.getASI("INDIVIDUAL","Last Name EN",""),
					"Emirates ID number": rec.getASI("INDIVIDUAL","EID Number",""),
					"Passport Number": rec.getASI("INDIVIDUAL","Passport Number",""),
					"Nationality": rec.getASI("INDIVIDUAL","Current Nationality",""),
					"Phone Number": rec.getASI("INDIVIDUAL","Permanent Mobile",""),
					"Email": rec.getASI("INDIVIDUAL","Email","")
				
			}
			res.push(contObj);
		}else{
			var contObj = {
					"Contact Ref ID": rec.getASI("REFERENCE CONTACT","Ref Contact ID",""),
					"System ID": rec.getCustomID(),					
					"Shareholder Name": rec.getASI("NON-INDIVIDUAL","Company Name English",""),
					"Emirates ID number": rec.getASI("NON-INDIVIDUAL","",""),
					"Passport Number": rec.getASI("NON-INDIVIDUAL","",""),
					"Nationality": rec.getASI("NON-INDIVIDUAL","Company Nationality",""),
					"Phone Number": rec.getASI("NON-INDIVIDUAL","Phone",""),
					"Email": rec.getASI("NON-INDIVIDUAL","E-mail","")
			}
			res.push(contObj);
		}
	
	}
	if(params.control == "BMM"){
		var contObj = {
				"Contact Ref ID": rec.getASI("REFERENCE CONTACT","Ref Contact ID",""),
				"System ID": rec.getCustomID(),
				"Name": rec.getASI("INDIVIDUAL","First Name EN","") +" "+rec.getASI("INDIVIDUAL","Middle Name EN","")+" "+rec.getASI("INDIVIDUAL","Last Name EN",""),
				"Nationality": rec.getASI("INDIVIDUAL","Current Nationality",""),
				"Passport Number": rec.getASI("INDIVIDUAL","Passport Number",""),
				"Email": rec.getASI("INDIVIDUAL","Email",""),
				"Phone": rec.getASI("INDIVIDUAL","Permanent Mobile",""),
		}
		res.push(contObj);
	}
	
}

try {
	aa.env.setValue("Content", res);
	aa.env.setValue("Success", true);
	aa.env.setValue("Message", "Results returned successfully");
} catch (e) {
	aa.env.setValue("ScriptReturnCode", "-1");
	aa.env.setValue("Success", false);
	aa.env.setValue("Message", "Error while executing Workflow Comments. Error: " + e);
	logDebug("Error while executing Workflow Comments. Error: " + e);
}
function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null) {
		msg2 = "";
	} else {
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log for SARI_TEST_TEST ==> " + msg + msg2);
}