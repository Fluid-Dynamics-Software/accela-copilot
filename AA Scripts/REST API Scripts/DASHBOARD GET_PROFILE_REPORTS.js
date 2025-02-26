/*------------------------------------------------------------------------------------------------------/
| Program		: DASHBOARD:GET_PROFILE_REPORTS.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 13/06/2022 14:11:20
|
/------------------------------------------------------------------------------------------------------*/
logDebug("Started DASHBOARD:GET_PROFILE_REPORTS!");
eval(getScriptText("INCLUDE_PROFILEREPORTS"));

var altId = aa.env.getValue("altId");
var params = aa.env.getValue("params");
var count = false;
var module = 'OSHJ';	// Backwards compatible
//com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
if (params===true||params=="true"||params===""){
	count = (params===true||params=="true")?true:false;	
}else{
	try{
		params = JSON.parse(params);
		module = params.module;
		count = params.count;		
	}catch(err){
		count = false;
	}
}

var fields = {
    "ALT_ID": {
        name: "Record Number",
        //icon: "fa fa-hashtag",        
        translation: {
            "ar-AE": "رقم الطلب"
        }
    },
    "OPENED_DATE": {
        name: "Date",
        dataType: "Date",
        icon: 'far fa-calendar-alt',
        position: "right",
        cardViewWidth: "40%",
        translation: {
            "ar-AE": "تاريخ الطلب"
        }
    },
    "APPL_NAME": {
    	name: "Detailed Info",
	    translation: {
	        "ar-AE": "بيانات"
	    },
	    breadcrumbsVisibility: false
    },
    "RECORD_TYPE_ALIAS": {
        name: "Type",
        //          dataType: "Combo",
        language: "en-US",
        breadcrumbsVisibility: false
    },
    "ARABIC_ALIAS": {
        name: "النوع",
        //          dataType: "Combo",
        language: "ar-AE",
        breadcrumbsVisibility: false
    }
};
//if (module=='OSHJ'){
	var reports = new PROFILEREPORTS(altId);
	reportsDetails = reports.getProfileReports(count,module);	
//}else{
//	var reports = new PROFILEREPORTS(altId);
//	reportsDetails = reports.getReports(count);	
//}

aa.env.setValue("Content", reportsDetails);
aa.env.setValue("Fields", fields);
aa.env.setValue("Success", true);

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance(
			"com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa
					.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),
					vScriptName, "ADMIN");
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
	java.lang.System.out.println("=== DASHBOARD:INIT ==> " + msg + msg2);
}