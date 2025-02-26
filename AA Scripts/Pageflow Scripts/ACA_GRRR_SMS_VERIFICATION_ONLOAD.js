/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_GRRR_SMS_VERIFICATION_ONLOAD.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HHABCHY
| Created at	: 27/02/2022 22:41:06
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_SMS_GATEWAY"));
eval(getScriptText("INCLUDE_SHA"));
eval(getScriptText("INCLUDE_RECORD"));

var cap = aa.env.getValue("CapModel");
var asiGroups = cap.getAppSpecificInfoGroups();
var asitGroups = cap.getAppSpecificTableGroupModel();
var sms = new SmsGateway();

var sha1 = new SHA();
var key1 =  14115901931;
var key2 = -1127353711;
var key3 = -13354831141;
var key4 =  2227344481;
var key5 = -13422192761;

var VerificationDuration = Record.getLookupVal('GRRR_REGISTRATION_OPTIONS', 'OTP_SMS_VERIFICATION_MINUTES');

try {
	var OTP = generateOTP();
	var OTP = "123456";
    var mobileNumber = getFieldValue("Mobile Phone",asiGroups);
    
    var smsPass = getFieldValue("SMS Verification Code",asiGroups);
    var smsRef = getFieldValue("SMS_REF",asiGroups);
    var timeRef = getFieldValue("SMS_TIME",asiGroups);
    var smsMobileNumber = getFieldValue("Mobile Number",asiGroups);
    if (String(smsMobileNumber).trim() == "" || smsMobileNumber == undefined || smsMobileNumber == null || smsMobileNumber == "null")
    {
    	smsMobileNumber = mobileNumber;
    }
    
	var sendOTP = true;
	
	if(smsMobileNumber){
	    if (String(mobileNumber).trim().toLowerCase() != String(smsMobileNumber).trim().toLowerCase()){
	    	setFieldValue("SMS_VERIFIED", asiGroups, "");
	    }
	}
	
	var isVerified = getFieldValue("SMS_VERIFIED",asiGroups);
	if(smsPass && smsRef && timeRef){
		if(isVerified == 'Y' && calculateDateDiffInMinutes(new Date(timeRef)) <= VerificationDuration){
			aa.env.setValue("ReturnData", "{'PageFlow': {'HidePage' : 'Y'}}");
			sendOTP = false;
		}
	}

	if(sendOTP){
    	setFieldValue("Mobile Number", asiGroups, mobileNumber);	
		setFieldValue("SMS Verification Code", asiGroups, "");
		setFieldValue("SMS_VERIFIED", asiGroups, "");
		setFieldValue("SMS_REF", asiGroups,sha1.calcSHA1(OTP,key1,key2,key3,key4,key5));
		setFieldValue("SMS_TIME", asiGroups, new Date().toISOString());
		
		//Send SMS
		/*var result = sms.sendSMS(smsMobileNumber,"Verification Code : " + OTP);
        if(!result.success){
        	if(result.message.indexOf("No valid numbers found") != -1){
            	var errorMsg = translate("GRRR.InvalidPhoneNumber2") + " : " + smsMobileNumber;
            	//throw errorMsg;
        	}else{
            	var errorMsg = translate("GRRR.UnexpectedError") + " : " + result.message;
            	throw errorMsg;
        	}
        }*/
	} 
	aa.env.setValue("CapModel",cap);
	
} catch (e) {
	aa.env.setValue("ErrorCode", "-2");
	aa.env.setValue("ErrorMessage", e);
}



//Reusable Functions//
function setFieldValue(fieldName, asiGroups, value) {
	if (asiGroups == null) {
		return null;
	}

	var iteGroups = asiGroups.iterator();
	while (iteGroups.hasNext()) {
		var group = iteGroups.next();
		var fields = group.getFields();
		if (fields != null) {
			var iteFields = fields.iterator();
			while (iteFields.hasNext()) {
				var field = iteFields.next();
				if (fieldName == field.getCheckboxDesc()) {
					field.setChecklistComment(value);
					group.setFields(fields);
				}
			}
		}
	}
	return asiGroups;
}

function getFieldValue(fieldName, asiGroups)
{     
        if(asiGroups == null)
        {
            return null;
        }
        
    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext())
    {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null)
        {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                var field = iteFields.next();
                if (fieldName == field.getCheckboxDesc())
                {
                    return field.getChecklistComment();
                }
            }
        }
    }   
    return null;    
}


function generateOTP() {
    var digits = '0123456789';
    var OTP = '';
    for (var i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

function getScriptText(vScriptName){
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();	
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
		return emseScript.getScriptText() + "";	
		} catch(err) {
		return "";
	}
}

function calculateDateDiffInMinutes(dt1){
	var dt2 = new Date()
	var diff =(dt2.getTime() - dt1.getTime()) / 1000;
	diff /= (60 * 60);
	diff *= 60;
	return	diff;
}

function translate(msgKey) {
	return aa.messageResources.getLocalMessage(msgKey);
}