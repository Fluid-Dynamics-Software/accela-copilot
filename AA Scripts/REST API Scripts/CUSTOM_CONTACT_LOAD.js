/*------------------------------------------------------------------------------------------------------/
| Program		: CUSTOM_CONTACT_LOAD.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 28/11/2022 22:42:37
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_RECORD"));
var LANGS = {
	"ar-AE" : "ar_AE",
	"en-US" : "en_US"
}
var altId = aa.env.getValue("capId");
var params = aa.env.getValue("params");
var thisRecord = new Record(altId);
params = JSON.parse(params);
var lang = LANGS[params["lang"]];
var filter = params["filter"]
var dataset = {};

var branch='';
var branchLimit;
var parentCapId = getClosestParent(thisRecord.capId, "Licenses/Commercial/Commercial Company Profile/CCOPR");
if (parentCapId){
	parent = new Record(parentCapId);
	branch = parent.getASI('','Registering a Branch in SHCC')
	branchLimit = 2;
}


dataset["contactTypes"] = getDDLValues("SALUTATION", lang,"");
dataset["gender"] = getDDLValues("SD_MOI_GENDER", lang,"");
dataset["companyRegType"]= getDDLValues("SD_PARENT_COMPANY_REG_TYPE", lang,"");
dataset["nationality"] = getDDLValues("SD_MOI_COUNTRY", lang,"");
dataset["visaStatus"] = getDDLValues("SD_BENEFICIARY_CURRENT_VISA_STATUS", lang,"");
dataset["passportType"] = getDDLValues("SD_PASSPORT_TYPE", lang,"");
dataset["emirates"] = getDDLValues("SD_MOI_EMIRATES", lang,"");
dataset["freezone"] = getDDLValues("SD_UAE_FREEZONE", lang,"");
dataset["yesNo"] = getDDLValues("SD_YES_NO", lang,"");
dataset["maritalStatus"] = getDDLValues("SD_MOI_MARITAL_STATUS", lang,"");
//
dataset["location"] = getDDLValues("SD_BENEFICIARY_LOCATION", lang,"");
dataset["religion"] = getDDLValues("SD_RELIGION", lang,"");
dataset["faith"] = getDDLValues("SD_FAITH", lang,"");
dataset["qualification"] = getDDLValues("SD_QUALIFICATION", lang,"");
dataset["profession"] = getDDLValues("SD_PROFESSION", lang,"");
dataset["cities"] = getDDLValues("SD_CITIES", lang,"");
dataset["roles"] = getDDLValues("SD_CONTACT_ROLE", lang,filter);
dataset["actions"] = getDDLValues("SD_ACTION", lang,"A");
dataset["freezoneType"] = getDDLValues("SD_UAE_FREEZONE_TYPE", lang,"");
dataset["branch"] = branch=="CHECKED"?true:false;
dataset["branchLimit"] = branchLimit;

try {
	aa.env.setValue("Content", dataset);
	aa.env.setValue("Success", true);
	aa.env.setValue("Message", "Results returned successfully");
} catch (e) {
	aa.env.setValue("ScriptReturnCode", "-1");
	aa.env.setValue("Success", false);
	aa.env.setValue("Message", "Error while executing Workflow Comments. Error: " + e);
	logDebug("Error while executing Workflow Comments. Error: " + e);
}
function getDDLValues(dll, lang,descFilter) {
	var DDLSQL = "SELECT distinct biz.bizdomain_value AS BIZEN ,BIZ_AR.BIZDOMAIN_VALUE AS BIZAR, biz.BIZDOMAIN " + "FROM RBIZDOMAIN_VALUE BIZ "
			+ "inner JOIN RBIZDOMAIN_VALUE_I18N BIZ_AR " + "ON  BIZ.SERV_PROV_CODE=BIZ_AR.SERV_PROV_CODE " + "AND BIZ.RES_ID=BIZ_AR.RES_ID " + "and biz.BIZDOMAIN = '" + dll + "' "
			+ "AND BIZ_AR.LANG_ID='" + lang + "' ";
	if(descFilter!=""){
		DDLSQL = DDLSQL+" and biz.VALUE_DESC = '"+descFilter+"'"
	}
	var dropDownList = runSQL(DDLSQL);
	var dropDownListArray = [];
	for ( var j in dropDownList) {
		dropDownListArray.push({
			value : String(dropDownList[j]["BIZEN"]),
			valueLocal : String(dropDownList[j]["BIZAR"])
		});
	}
	return dropDownListArray;
}
function runSQL(sqlCMD, parameters){
	var params = [];
	if (arguments.length == 2)
		params = parameters;
//
	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var utilProcessor = new JavaAdapter(com.accela.aa.datautil.DBResultSetProcessor, {
		processResultSetRow : function(rs) {
			var meta = rs.getMetaData();
			var numcols = meta.getColumnCount();
			var record = {}
			var result = null;

			for (var i = 0; i < numcols; i++) {
				var columnName = meta.getColumnName(i + 1);
				// columnName = columnName//.toUpperCase()
				result = rs.getObject(i + 1);
				if (result == null) {
					record[columnName] = String("");
				} else {
					if (result.getClass && result.getClass().getName() == "java.sql.Timestamp") {
						record[columnName] = String(new Date(rs.getTimestamp(i + 1).getTime()).toString("MM/dd/yyyy"));
					} else {
						record[columnName] = String(rs.getObject(i + 1));
					}
				}
			}
			return record;
		}
	});

	var result = dba.select(sqlCMD, params, utilProcessor, null);

	var rowNum = 0;
	return result.toArray();
}


function getClosestParent(capID, parentCapType){
	aa.print("Checking capID: " + capID);
	var getCapType = aa.cap.getCap(capID).getOutput().getCapType();
	//aa.print(getCapType);
	if (getCapType == parentCapType){
		return capID;
	}

	var parentRecord = aa.cap.getProjectByChildCapID(capID, null, "").getOutput();
	if (parentRecord && parentRecord.length){
		for (record in parentRecord) {
			profRecCapId = parentRecord[record].getProjectID();
			if (profRecCapId && aa.cap.getCap(profRecCapId).getOutput()){
				//aa.print(profRecCapId);
				var profCapType = aa.cap.getCap(profRecCapId).getOutput().getCapType(); 
				if (profCapType == parentCapType){
					return profRecCapId;
				}
				return getClosestParent(profRecCapId, parentCapType);
			}
		}
	}
	
	var parentRecord = aa.cap.getProjectByChildCapID(capID, "Amendment", "").getOutput();
	if (parentRecord && parentRecord.length){
		for (record in parentRecord) {
			profRecCapId = parentRecord[record].getProjectID();
			if (profRecCapId && aa.cap.getCap(profRecCapId).getOutput()){
				var profCapType = aa.cap.getCap(profRecCapId).getOutput().getCapType(); 
				if (profCapType == parentCapType){
					return profRecCapId;
				}
				return getClosestParent(profRecCapId, parentCapType);
			}
		}
	}

	var recordParents = aa.cap.getProjectByChildCapID(capID, "Renewal", "").getOutput();
	if (recordParents && recordParents.length){
		for (record in recordParents) {
			aa.print(recordParents[record].getProjectID());					
			profRec = new Record(recordParents[record].getProjectID());
			if (profRec && profRec.getCap()){
				if (profRec.getCapType() == parentCapType){
					return profRec;
				}
				return getClosestParent(profRec.capId, parentCapType);				
			}
		}
	}
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