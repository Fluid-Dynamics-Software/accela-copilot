/*------------------------------------------------------------------------------------------------------/
| Program		: PUBLICUSER_ACTIVATE_RESET_PASSWORD.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 22/11/2021 09:43:18
|
/------------------------------------------------------------------------------------------------------*/



function getResetURL(publicUser) { //optional capId
	publicUser = String(publicUser).replace(/\D/g, '');
	var ACAurl = getValueByStandardChoice("ACA_CONFIGS", "ACA_SITE")
	if (ACAurl == "" || ACAurl == null) {
		throw "ACA site url is not configured in stand choice 'ACA_CONFIGS' ";
	}

	ACAurl = ACAurl.replace("Admin/login.aspx", "");
	ACAurl = ACAurl.replace("admin/login.aspx", "");
	ACAurl = ACAurl.replace("Admin/Login.aspx", "");
	ACAurl = ACAurl.replace("admin/Login.aspx", "");
	ACAurl = ACAurl.replace("/CitizenAccess/", "/SPSA/");
	ACAurl = ACAurl.replace("/citizenaccess/", "/SPSA/");
	
	
	var userModel = aa.publicUser.getPublicUser(parseFloat(publicUser)).getOutput();
	if (userModel != null) {
		try {
			var email = userModel.getEmail();
			//printValues(userModel);
			var userID = userModel.getUserID();
			logDebug(userID);
			var newTempPassword = aa.publicUser.resetPassword(userID).getOutput();
			logDebug("newTempPassword: "+ newTempPassword);
			var url = ACAurl + "Account/ChangePassword.aspx?IsPasswordExpires=N&userID=" + userID + "&isFromNewUi=N&migCode=" + escape(newTempPassword)
			logDebug("Reset Password URL: " + url);
			//java.lang.System.out.println("Reset Password URL: " + url);
			//sendEmail(url, userID, email)
			return url;
			logDebug("Successfully sent notification to "+userID+" ("+url+")")
			logDebug("")
		} catch(e){
			logDebug("FAILED sent notification to "+userID+" ("+url+")")
			logDebug(e)
		}
	}else{
		logDebug("FAILED to find "+userID+" in the system, please check")
		logDebug("")
	}

}
function sendEmail(url, userID, email){
	var parameters = aa.util.newHashtable();
	parameters.put("$$userId$$", userID);
	parameters.put("$$url$$", url);
	
	GlobalNotifications.sendEmailByTemplate("RESET_PUBLIC_USER", [email], parameters) //optional capId
}
/*function sendEmail(url, userID, email) {
	var biz = aa.proxyInvoker.newInstance("com.accela.aa.communication.business.CommunicationBusiness").getOutput();
	var templateName = "RESET_PUBLIC_USER";
	var parameters = aa.util.newHashtable();
	addParameters(parameters, "$$userId$$", userID);
	addParameters(parameters, "$$url$$", url);

	var notificationTemplateModel = aa.communication.getNotificationTemplate(templateName).getOutput();
	var emailTemplateModel = notificationTemplateModel.getEmailTemplateModel();
	setEmailContent(emailTemplateModel, email)
	biz.sendMessage(notificationTemplateModel, parameters, null, "");
}
*/
function setEmailContent(emailTemplateModel, addressTo) {
	if (addressTo) {
		emailTemplateModel.setTo(addressTo);
	}
	emailTemplateModel.setHeader("<meta http-equiv=Content-Type content=text/html; charset=UTF-8>");
	emailTemplateModel.setContentType("content=text/html; charset=UTF-8");
}

function addParameters(parameters, key, value) {
	if (parameters == null || key == null) {
		return;
	}
	if (value != null) {
		parameters.put(key, value);
	} else {
		parameters.put(key, "");
	}
}

function getValueByStandardChoice(sdName, sdValue) {
	var description = "";
	var domainModel = aa.bizDomain.getBizDomainByValue(sdName, sdValue).getOutput();
	if (domainModel != null) {
		description = domainModel.getDescription();
	}
	return description;
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {
  if (!servProvCode) servProvCode = aa.getServiceProviderCode();
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

function getAgencyScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getAgencyScript(aa.getServiceProviderCode(), vScriptName);
    return emseScript.getScriptText() + "";
}


function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null){
		msg2 = "";
	}else{
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2); 
}


function printValues(object)
{
    for (x in object.getClass().getMethods())
    {
	try{
		var theName = object.getClass().getMethods()[x].getName();
		var theValue="";
		if (theName.indexOf("get")==0){
			eval("theValue = object."+theName+"();");
			logDebug(object.toString() + " | " + theName + ": " + theValue);
		}
	} catch(e) {
		logDebug("Error: " + e);
	}
    }
	logDebug(" ");
}

function logDebug(msg){
	aa.print("Hisham Logging: " + msg);
}