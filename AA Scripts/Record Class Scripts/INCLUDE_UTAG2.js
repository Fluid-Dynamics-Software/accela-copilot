/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_UTAG.js
| Event			: N/A
|
| Usage			: contains all the record's specific script
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 21/10/2018 11:53:06
|
/------------------------------------------------------------------------------------------------------*/
if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}
function UTAG(capId) {
	Record.call(this, capId);
};
eval(getScriptText("CLASS_ASIT_NAVIGATOR"));

UTAG.prototype = Object.create(Record.prototype);
UTAG.prototype.constructor = UTAG;
/*----------------------------------------------------ASI-----------------------------------------------*/
UTAG.RECORD_TYPE = "GlobalSettings/ACA Settings/User Type Settings/UTAG";
UTAG.ASI = {};
UTAG.ASI.general = {};
UTAG.ASI.general.TableName = "GENERAL";
UTAG.ASI.general.profileRecordType = "Profile Record Type";
UTAG.ASI.general.userType = "User Type";

/*----------------------------------------------------ASIT----------------------------------------------*/
UTAG.ASIT = {};
UTAG.ASIT.actions = {};
UTAG.ASIT.actions.TableName = "ACTIONS";
UTAG.ASIT.actions.action = "Action";
UTAG.ASIT.actions.amendmentRecordType = "Amendment Record Type";
UTAG.ASIT.actions.conditionScript = "Condition Script";
UTAG.ASIT.actions.conditionType = "Condition Type";
UTAG.ASIT.actions.field = "Field";
UTAG.ASIT.actions.operator = "Operator";
UTAG.ASIT.actions.recordType = "Record Type";
UTAG.ASIT.actions.value = "Value";

UTAG.ASIT.contactTypes = {};
UTAG.ASIT.contactTypes.TableName = "CONTACT TYPES";
UTAG.ASIT.contactTypes.contactType = "Contact Type";

UTAG.ASIT.licensedProfessionals = {};
UTAG.ASIT.licensedProfessionals.TableName = "LICENSED PROFESSIONALS";
UTAG.ASIT.licensedProfessionals.licensedProfessionalType = "Licensed Professional Type";

UTAG.ASIT.startNewServices = {};
UTAG.ASIT.startNewServices.TableName = "START NEW SERVICES";
UTAG.ASIT.startNewServices.recordType = "Record Type";

/*-------------------------------------------SPECIFIC CODE----------------------------------------------*/
UTAG.capTypes = "";
UTAG.getCapTypeBySQL = function(){
	var sql = "	SELECT [SERV_PROV_CODE]" +
		"	    ,[R1_PER_GROUP] + '/' + [R1_PER_TYPE] + '/' + [R1_PER_SUB_TYPE] + '/' + [R1_PER_CATEGORY] AS RECORD_TYPE " +
		"	    ,[R1_PER_GROUP]" +
		"	    ,[R1_PER_TYPE]" +
		"	    ,[R1_PER_SUB_TYPE]" +
		"	    ,[R1_PER_CATEGORY]" +
		"	    ,[REC_STATUS]" +
		"	    ,[R1_ICON_NBR]" +
		"	    ,[R1_APP_TYPE_ALIAS]" +
		"	    ,[ACA_STATUS]" +
		"	    ,[RES_ID]" +
		"	    ,[APPTYP_HTML_INSTRUCTION]" +
		"	    ,[APPTYP_PLAIN_INSTRUCTION]" +
		"	FROM [accela].[dbo].[R3APPTYP]"
		
	var res = execQuery(sql);
	var recordTypes = {};
	
	for (var r in res){
		var recordType = res[r];
		recordTypes[recordType.RECORD_TYPE] = recordType;
	}
	UTAG.capTypes = recordTypes;
}

UTAG.getCapTypeBySQL();

UTAG.prototype.onApplicationSubmitAfter = function() {
	var name = this.getASI(UTAG.ASI.general.TableName, UTAG.ASI.general.userType);
	// Update Alt Id
	var altId = "UTAG:" + name;
	//capId = this.capId;
	altIdResults = aa.cap.updateCapAltID(this.capId, altId);
	if (altIdResults.getSuccess()){
		logDebug("Alt ID Updated: " + altId );
	}else{
		logDebug( "**ERROR: ALTID Update Failed: " + altIdResults.getErrorMessage());
	}			
};

UTAG.prototype.onApplicationSpecificInfoUpdateAfter = function() {
	logDebug("Inside ALT ID Update");
	var name = this.getASI(UTAG.ASI.general.TableName, UTAG.ASI.general.userType);
	// Update Alt Id
	var altId = "UTAG:" + name;
	logDebug("UTAG new Alt Id", altId);
	//capId = this.capId;
	altIdResults = aa.cap.updateCapAltID(this.capId, altId);
	if (altIdResults.getSuccess()){
		logDebug("Alt ID Updated: " + altId );
	}else{
		logDebug( "**ERROR: ALTID Update Failed: " + altIdResults.getErrorMessage());
	}			
};

UTAG.prototype.getUserTypeObject = function (){
	var lpType = stringify(this.getASI("", "Licensed Professional Type"));
	var contactType = stringify(this.getASI("", "Contact Type"));
	return {
		licenseType: lpType,
		contactType: contactType
	};
};

UTAG.prototype.isUserType = function (loggedInUserTypeObject){
	userType = this.getUserTypeObject();
	lpFound = false;
	contactFound = false;
	// Find the License Professional
	if (userType.licenseType == "" || loggedInUserTypeObject.licenseTypes.includes(userType.licenseType)){
		lpFound=true;
	}
	// Find the Contact Type
	if (userType.contactType == "" || loggedInUserTypeObject.contactTypes.includes(userType.contactType)){
		contactFound=true;
	}
	// If the Contact & License both exist in the Logged User, return true
	if (lpFound && contactFound){
		return true;
	}else{
		return false;
	}
}

function timeLocal(e){​​​​​​​   
	var t = (new Date).getTime();     
	var r = t - startLocal;    
	Utils.printLog(e + ": " + r + "ms");    
	startLocal = (new Date).getTime() ;
}

UTAG.getOnloginSettingsByPublicUser = function(publicuser, selectedModule, pageConfig){

	var utagSettings = {
		viewModules: [],
		newApplications: [],
		viewApplications: [],
		actions:{}
	};
	
	var loggedInUserType = UTAG.getUserTypeObjectByPublicUser(publicuser);
	utagSettings.userType = loggedInUserType;
	
	
	// Get All UTAG Records that match that User Type individually
	// Then Merge them all into 1 utagSettings Object!
	var utags = UTAG.getRecordListByUserTypeObject(loggedInUserType);
	for (u in utags){
		var utag = utags[u];
		// Get the Settings Object for this new UTAG record.
		// Then Merge it with the Old UTAG object
		newUtagSettings = utag.getOnloginSettings(publicuser);		
		//logDebug("newUtagSettings Object", JSON.stringify(newUtagSettings));
		utagSettings = UTAG.mergeUTAG(newUtagSettings, utagSettings);
	}
	
	// If the selectedModule is empty or set to home, then set it to the first module automatically.
	selectedModule = ((!selectedModule || selectedModule == "" || selectedModule.toLowerCase() == "home") && utagSettings["viewModules"].length)? utagSettings["viewModules"][0]:"";
	//logDebug("selectedModule After", selectedModule);
	utagSettings.selectedModule = selectedModule;
	
	// Filter View Applications by Module RecordsPath
	var recordsPath;
	if (pageConfig && pageConfig[selectedModule] && pageConfig[selectedModule].recordsPath){
		recordsPath = pageConfig[selectedModule].recordsPath.replace("%","");
		utagSettings = UTAG.filterViewApplicationsByRecordsPath(utagSettings, recordsPath);
	}
	logDebug("getOnloginSettingsByPublicUser utagSettings", JSON.stringify(utagSettings));
	
	return utagSettings;
}

UTAG.filterViewApplicationsByRecordsPath = function (utagSettings, recordsPath){
	var viewApplication = [];
	for(var i in utagSettings.viewApplications){
		var viewApp = utagSettings.viewApplications[i];
		if(viewApp.capType.indexOf(recordsPath) == 0){
			viewApplication.push(viewApp);
		}
	}
	utagSettings.viewApplications = viewApplication;
	return utagSettings;
}

UTAG.getUserTypeObjectByPublicUser = function(publicuser) {
	var userObject = {
		licenseTypes: [],
		licenseNumbers: [],
		contactTypes: [],
		//UAEPasses: []
	};
    userSeqNum = String(publicuser).replace(/\D/g, '');	
    var userSeqNum = parseFloat(userSeqNum);
    if (isNaN(userSeqNum)) {
    	
    } else {
    	// User Licenses
    	userLics = aa.licenseScript.getRefLicProfByOnlineUser(userSeqNum).getOutput();
		if (userLics) {
			for ( var i in userLics){
				licModel = userLics[i];
				//licNumber = licModel.getStateLicense();
				licType = stringify(licModel.getLicenseType());
				licNo = stringify(licModel.getStateLicense());
	        	userObject.licenseTypes.push(licType);
	        	userObject.licenseNumbers.push(licNo);
			}
		}
    	
    	// Contact Types
    	userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput();
    	var puSeq = userModel.getUserSeqNum();
    	var publicUserIDList = aa.util.newArrayList();
    	publicUserIDList.add(puSeq);
    	// Get Public User Related Contacts
    	var contractorBiz = aa.proxyInvoker.newInstance("com.accela.pa.people.ContractorPeopleBusiness").getOutput();
    	var contractorPeopleModelList = contractorBiz.getContractorPeopleListByUserSeqNBR(aa.getServiceProviderCode(), publicUserIDList);
    	var peopleList = [];
    	if (contractorPeopleModelList != null && contractorPeopleModelList.size() > 0) {
    		peopleList = contractorPeopleModelList.toArray();
        	for (p in peopleList){
            	var contactType = stringify(peopleList[p].getContactType());
            	userObject.contactTypes.push(contactType);
//            	userObject.UAEPasses.push(stringify(peopleList[p].getCompactAddress().));
        	}
    	}
    }
    return userObject;
}

UTAG.getRecordListByUserTypeObject = function (userTypeObject){
	var utags = UTAG.getRecordList();
	var utagList = [];
	for (r in utags){
		var utag = utags[r];
		if (utag.isUserType(userTypeObject)){
			logDebug("Matching UTAG", utag.altId);
			utagList.push(utag);
		}
	}
	return utagList;
};

UTAG.prototype.getOnloginSettings = function (publicUser){
	var object = {};
	//logDebug("UTAG Object", this);
	var capTypeScriptModelList = aa.cap.getCapTypeList(aa.util.newQueryFormat()).getOutput();

	// View Applications
	var asit = new ASITNavigator(this.capId, "VIEW APPLICATIONS");
	while (asit.nextRow()){
		var recordType = asit.getFieldStr("Record Type");
		// Convert to Fully Qualified Cap Type if subtype is supplied
		recordType = convertTypeToObject(recordType,capTypeScriptModelList);
		if(typeof object.viewApplications == "undefined"){
			object.viewApplications = [];
		}
		object.viewApplications.push(recordType);
	}
	
	// View Module
	var asit = new ASITNavigator(this.capId, "VIEW MODULE");
	while (asit.nextRow()){
		var moduleName = asit.getFieldStr("Module Name");
		if(typeof object.viewModules == "undefined"){
			object.viewModules = [];
		}
		object.viewModules.push(moduleName);
	}	
	//logDebug("VIEW MODULE Called!");
	
	// Start new Applications
	var asit = new ASITNavigator(this.capId, "START NEW APPLICATIONS");
	
	while (asit.nextRow()){
		var recordType = asit.getFieldStr("Record Type");
		//logDebug("Checking START NEW APPLICATIONS", recordType);
		
		// Convert to Fully Qualified Cap Type if subtype is supplied
		recordType = convertTypeToObject(recordType,capTypeScriptModelList);
		if(typeof object.newApplications == "undefined"){
			object.newApplications = [];
		}
		recordType.modules = object.viewModules;
		object.newApplications.push(recordType);
	}	
	
	var asit = new ASITNavigator(this.capId, "ACTIONS");
	while (asit.nextRow()){
		//logDebug("ACTIONS Row Called!");
		var script = "";
		var scriptEMSE = "";
		var scriptEMSECondition = "";
		var recordType = asit.getFieldStr("Record Types");
		var recordTypeList = recordType.split("\r\n");
		for (a in recordTypeList){
			var item = recordTypeList[a];
            // Convert to Fully Qualified Cap Type if subtype is supplied
            item = getCapTypeBySubType(item,capTypeScriptModelList);
			
			recordTypeList[a] = item;
		}
		var action = asit.getFieldStr("Action");
		var amendRecordType = asit.getFieldStr("Amendment Record Types");
		var amendRTList = amendRecordType.split("\r\n");
		var alert = asit.getFieldStr("Show in Alerts");
		var amendmentFunction = "";
		//java.lang.System.out.println("amendRTList : "+ amendRTList); 
		// Strip any empty entries from the array
		amendRecordTypeList = [];
		for (a in amendRTList){

            var item = amendRTList[a];
			if (item && String(item).trim() != ""){
				/* if (isFromACA){
					var acaTammPermission = getSCDescByValue(acaTammServices, item);
					if (Utils.isBlankOrNull(acaTammPermission) || acaTammPermission.toUpperCase() == 'TAMM'){
						continue;
					}
				} */
				
				if (item.split("/").length==4){
					// Convert to Fully Qualified Cap Type if subtype is supplied, and add them to an object
					item = convertTypeToObject(item,capTypeScriptModelList);
					item.alert = (alert=="CHECKED"?true:false);
					amendRecordTypeList.push(item);
				}else{
					amendmentFunction = item;
				}
			}
		}
		var conditionType = asit.getFieldStr("Condition Type");
		var field = asit.getFieldStr("Field");
		var operator = asit.getFieldStr("Operator");
		var value = asit.getFieldStr("Value");
		var emseScript = asit.getFieldStr("EMSE Script");
		var actionLabel = asit.getFieldStr("Action Label");
		var actionLabelAr = asit.getFieldStr("Action Label (Ar)");
		var actionIcon = asit.getFieldStr("Action Icon");
		value = value.replaceAll("'", '"');
		var conditionScript = asit.getFieldStr("Condition Script");
		
		var scriptCondition = scriptAmendmentTypesConditions = " ("+JSON.stringify(recordTypeList)+".includes(record.RECORD_TYPE) || "+JSON.stringify(recordTypeList)+".includes(record.SUB_TYPE) || "+JSON.stringify(recordTypeList)+".includes(\"*\") || "+JSON.stringify(recordTypeList)+".includes(\"*/*/*/*\") ) ";

		if (conditionType == "Wizard Mode"){
			if (operator == "IN"){
				value = value.trim();
				value = value.replaceAll('("','"');
				value = value.replaceAll('")','"');				
				value = value.replaceAll('( "','"');
				value = value.replaceAll('" )','"');				
				scriptCondition += " && (["+value+"].includes("+field+")) "						
			} else if (operator == "LIKE"){
				scriptCondition += " && ("+field+".indexOf('"+value.replaceAll("%", "")+"')>-1) "			
			} else if (field && field!=""){
				scriptCondition += " && ("+field+" "+operator+" "+value+") ";			
			} else {
				//scriptCondition += " (1==1) ";
			}
		}else if (conditionScript){
				scriptCondition += " && ( " + conditionScript + " ) ";
		}

		script += " if ( "+scriptCondition+" ) { ";
		script += " 	return true; ";
		script += " } ";
			
		scriptAmendmentTypes = " if ( "+scriptCondition+" ) { ";
		if (amendmentFunction){
			scriptAmendmentTypes += " 	amendTypes = amendTypes.concat("+amendmentFunction+").unique(); ";
		}else{
			scriptAmendmentTypes += " 	amendTypes = amendTypes.concat("+JSON.stringify(amendRecordTypeList)+").unique(); ";			
		}
		scriptAmendmentTypes += " } ";	
							
		scriptEMSE += " if ( "+scriptCondition+" ) { ";
		scriptEMSE += " 	return '"+emseScript+"'; ";
		scriptEMSE += " } ";
		
		scriptEMSECondition += " if ( "+scriptCondition+" ) { ";
		scriptEMSECondition += " 	return true; ";
		scriptEMSECondition += " } ";
		
		if(typeof object.actions == "undefined"){
			object.actions = {};
		}
		
		// If the Action is Custom Amend or Run EMSE Script
		if (action == "Custom Amend ..."){
			action = "amend...";
		
			// Reserved Action but Custom Label or Icon
			if (actionLabel){
				var processedActionLabel = actionLabel;
			}else{
				var processedActionLabel = "Amend";
			}
			if (actionIcon){
				var processedActionIcon = actionIcon;
			}else{
				var processedActionIcon = "bi bi-pencil-square";
			}
			if (!object.actions.customAmend){
				object.actions.customAmend = {}
			}
			if (!object.actions.customAmend[processedActionLabel]){
				object.actions.customAmend[processedActionLabel] = {
					name:"",
					icon:"",
					customList:"",
					action: "CustomAmend",
					translation: {"ar-AE":"تعديل الطلب"}
				};
			}
			object.actions.customAmend[processedActionLabel].name = processedActionLabel;
			if (actionLabelAr){
				object.actions.customAmend[processedActionLabel].translation = {"ar-AE": actionLabelAr};
			}
			object.actions.customAmend[processedActionLabel].icon = processedActionIcon;
			object.actions.customAmend[processedActionLabel].customList += scriptAmendmentTypes;
		}else if (action == "Run EMSE Script"){
			/* if (isFromACA){
				var acaTammPermission = getSCDescByValue(acaTammServices, item);
				if (acaTammPermission.toUpperCase() == 'TAMM'){	//Utils.isBlankOrNull(acaTammPermission) || 
					continue;
				}
			} */
			if (!object.actions.emse){
				object.actions.emse = {};
			}
			if (object.actions.emse[actionLabel]){
				object.actions.emse[actionLabel].script += " " + scriptEMSE;
				object.actions.emse[actionLabel].condition += " " + scriptEMSECondition;
				object.actions.emse[actionLabel].alert = (alert=="CHECKED"?true:false);
				if (actionLabelAr){
					object.actions.emse[actionLabel].translation  = {"ar-AE": actionLabelAr};
				}
				if (!object.actions.emse[actionLabel].icon || object.actions.emse[actionLabel].icon == ""){
					object.actions.emse[actionLabel].icon = actionIcon;
				}
			}else{
				object.actions.emse[actionLabel] = {"script":scriptEMSE, "condition":scriptEMSECondition, "icon": actionIcon};
				object.actions.emse[actionLabel].alert = (alert=="CHECKED"?true:false);
				if (actionLabelAr){
					object.actions.emse[actionLabel].translation  = {"ar-AE": actionLabelAr};
				}
			}
		} else{
			
			// If it is a reserved action
			var processedActionIcon = "";
			
			if (actionLabel){
				var processedActionLabel = actionLabel;
			}else{
				var processedActionLabel = action;
			}
			
			if (actionIcon){
				processedActionIcon = actionIcon;
			}
			scriptEMSEForLabel = " if ( "+scriptCondition+" ) { ";
			scriptEMSEForLabel += " 	return '"+String(processedActionLabel).toLowerCase().trim()+"'; ";
			scriptEMSEForLabel += " } ";
			
			scriptEMSEForIcon = " if ( "+scriptCondition+" ) { ";
			scriptEMSEForIcon += " 	return '"+String(processedActionIcon).trim()+"'; ";
			scriptEMSEForIcon += " } ";
			
			scriptEMSEForTranslation = " if ( "+scriptCondition+" ) { ";
			scriptEMSEForTranslation += " 	return "+JSON.stringify({"ar-AE": actionLabelAr})+"; ";
			scriptEMSEForTranslation += " } ";
			
			if (!object.actions){
				object.actions = {};
			}
			if (!object.actions[action]){
				object.actions[action] = {};
				object.actions[action].action = "";
				object.actions[action].label = "";
				object.actions[action].condition = "";
				object.actions[action].script = "";
				object.actions[action].icon = "";
				object.actions[action].translation = "";
			}
			object.actions[action].action = action;
			object.actions[action].label += " " + scriptEMSEForLabel;
			object.actions[action].condition += " " + scriptEMSECondition;
			object.actions[action].icon += " " + scriptEMSEForIcon;
			object.actions[action].alert = (alert=="CHECKED"?true:false);
			if (actionLabelAr){
				object.actions[action].translation += " " + scriptEMSEForTranslation;
			}
			logDebug("UTAG Actions: " + JSON.stringify(object.actions[action]));
		}
		
	}

	logDebug("UTAG Actions: " + JSON.stringify(object));
	return object;
}

UTAG.getModules = function(publicuser){
	var result = []; 
	var loggedInUserType = UTAG.getUserTypeObjectByPublicUser(publicuser);
	var utags = UTAG.getRecordListByUserTypeObject(loggedInUserType);
	for (u in utags){
		//aa.print(utags[u])
		var asit = new ASITNavigator(utags[u].capId, "VIEW MODULE");
		var modules = [];
		while (asit.nextRow()){
			var moduleName = asit.getFieldStr("Module Name");
			modules.push(moduleName)
		}
		//aa.print("module array")
		//aa.print(modules)
		//aa.print("result array before")
		//aa.print(result)
		result = result.concat(modules).unique();
		//aa.print("result array afteer")
		//aa.print(result)
	}
	
	return result;
}

UTAG.getRecordList = function (){
	var recordList = [];
	var records = aa.cap.getByAppType("GlobalSettings", "ACA Settings", "User Type Settings", "UTAG").getOutput();
	for (r in records){
		var capId = records[r].getCapID();
		var record = new UTAG(capId);
		recordList.push(record);
	}
	return recordList;
}
/*

UTAG.prototype.getCreatable = function (){
	var viewApplications = {};
	
	var module = this.getASI("GENERAL","Module");
	module = module.split(",");
	for(var i = 0 ; i < module.length ; i++){
		var asit = new ASITNavigator(this.capId, "START NEW APPLICATIONS");
		if(typeof viewApplications[module[i]] == "undefined"){
			viewApplications[module[i]] = [];
		}
		
		while (asit.nextRow()){
			var recordType = asit.getFieldStr("Record Type");
			// Convert to Fully Qualified Cap Type if subtype is supplied
			// if full cap type is supplied just return that
			recordType = getCapTypeBySubType(recordType);
			viewApplications[module[i]].push(recordType);
			//aa.print(recordType)
		}	
	}
	
	return viewApplications;
}
*/

UTAG.mergeUTAG = function (newUtagSettings, targetUtagSettings){

	if (newUtagSettings){
		/*if(!utagSettings){
			utagSettings = JSON.parse(JSON.stringify(utagSettingsInner));
		}*/
		if(typeof newUtagSettings.viewModules != 'undefined'){
			targetUtagSettings.viewModules = targetUtagSettings.viewModules.concat(newUtagSettings.viewModules).unique();		
		}
		if(typeof newUtagSettings.newApplications != 'undefined'){
			targetUtagSettings.newApplications = targetUtagSettings.newApplications.concat(newUtagSettings.newApplications).unique();		
		}
		if(typeof newUtagSettings.viewApplications != 'undefined'){
			targetUtagSettings.viewApplications = targetUtagSettings.viewApplications.concat(newUtagSettings.viewApplications).unique();		
		}
		if(typeof targetUtagSettings.externalApplications == 'undefined'){
			targetUtagSettings.externalApplications = [];
		}
		if(typeof newUtagSettings.profileRecord != 'undefined'){
			targetUtagSettings.profileRecord = newUtagSettings.profileRecord;
		}
		if(typeof newUtagSettings.externalApplications != 'undefined'){				
			targetUtagSettings.externalApplications = targetUtagSettings.externalApplications.concat(newUtagSettings.externalApplications).unique();
		}
		for (action in newUtagSettings.actions){
			if (newUtagSettings.actions.hasOwnProperty(action)){
				
				if (action == "emse"){
					if (!targetUtagSettings.actions[action]){
						targetUtagSettings.actions[action] = {};
					}
					for (EMSEscript in newUtagSettings.actions.emse){
						if (newUtagSettings.actions.emse.hasOwnProperty(EMSEscript)){
							if (!targetUtagSettings.actions.emse){
								targetUtagSettings.actions.emse = {};
							}
							if (!targetUtagSettings.actions.emse[EMSEscript]){
								targetUtagSettings.actions.emse[EMSEscript] = {script:"", condition:"", icon:""};
							}
							if (newUtagSettings.actions.emse[EMSEscript].script){
								targetUtagSettings.actions.emse[EMSEscript].script += " " + newUtagSettings.actions.emse[EMSEscript].script;	
							}
							if (newUtagSettings.actions.emse[EMSEscript].condition){
								targetUtagSettings.actions.emse[EMSEscript].condition += " " + newUtagSettings.actions.emse[EMSEscript].condition;	
							}
							if (newUtagSettings.actions.emse[EMSEscript].translation){
								targetUtagSettings.actions.emse[EMSEscript].translation = newUtagSettings.actions.emse[EMSEscript].translation;	
							}
							if (newUtagSettings.actions.emse[EMSEscript].icon && newUtagSettings.actions.emse[EMSEscript].icon!=""){
								targetUtagSettings.actions.emse[EMSEscript].icon = newUtagSettings.actions.emse[EMSEscript].icon;										
							}
							if (newUtagSettings.actions.emse[EMSEscript].alert && newUtagSettings.actions.emse[EMSEscript].alert!=""){
								targetUtagSettings.actions.emse[EMSEscript].alert = newUtagSettings.actions.emse[EMSEscript].alert;										
							}
						}
					}
				}else if (action == "customAmend"){
					if (!targetUtagSettings.actions[action]){
						targetUtagSettings.actions[action] = {};
					}
					for (ca in newUtagSettings.actions[action]){
						if(newUtagSettings.actions[action].hasOwnProperty(ca)){
							newCustomAmend = newUtagSettings.actions[action][ca];
							if (!targetUtagSettings.actions[action][ca]){
								targetUtagSettings.actions[action][ca] = {
									name:"",
									icon:"",
									customList:"",
									action:"CustomAmend"
								};
							}
							targetUtagSettings.actions[action][ca].name = newUtagSettings.actions[action][ca].name;
							targetUtagSettings.actions[action][ca].icon = newUtagSettings.actions[action][ca].icon;
							targetUtagSettings.actions[action][ca].alert = newUtagSettings.actions[action][ca].alert;
							targetUtagSettings.actions[action][ca].customList += " " + newUtagSettings.actions[action][ca].customList;
							if (newUtagSettings.actions[action][ca].translation){
								targetUtagSettings.actions[action][ca].translation = newUtagSettings.actions[action][ca].translation;
							}
						}
					}
				}else{
					if (!targetUtagSettings.actions[action]){
						targetUtagSettings.actions[action] = {
							action: action, 
							condition: '', 
							label: '', 
							icon: '', 
							translation: ''
						};
					}
					if (newUtagSettings.actions[action].condition){
						targetUtagSettings.actions[action].condition += " " + newUtagSettings.actions[action].condition;	
					}
					if (newUtagSettings.actions[action].label){
						targetUtagSettings.actions[action].label += " " + newUtagSettings.actions[action].label;	
					}
					if (newUtagSettings.actions[action].icon){
						targetUtagSettings.actions[action].icon += " " + newUtagSettings.actions[action].icon;	
					}
					if (newUtagSettings.actions[action].translation){
						targetUtagSettings.actions[action].translation += " " + newUtagSettings.actions[action].translation;	
					}
					if (newUtagSettings.actions[action].alert){
						targetUtagSettings.actions[action].alert += " " + newUtagSettings.actions[action].alert;	
					}
				}
			}
		}
	}
	return targetUtagSettings;
};

function stringify(value){
	if (value || value == 0){
		return String(value).trim();
	} else {
		return "";
	}
}


if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		enumerable: false,
		value: function(searchElement /*, fromIndex*/ ) {
			'use strict';
			var O = Object(this);
			var len = parseInt(O.length) || 0;
			if (len === 0) {
			  return false;
			}
			var n = parseInt(arguments[1]) || 0;
			var k;
			if (n >= 0) {
			  k = n;
			} else {
			  k = len + n;
			  if (k < 0) {k = 0;}
			}
			var currentElement;
			while (k < len) {
			  currentElement = O[k];
			  if (searchElement === currentElement ||
				 (searchElement !== searchElement && currentElement !== currentElement)) {
				return true;
			  }
			  k++;
			}
			return false;
		} 
	});
}
if (!Array.prototype.unique){
	Object.defineProperty(Array.prototype, 'unique', {
		enumerable: false,
		value: function(){
			var a = this.concat();
			for(var i=0; i<a.length; ++i) {
				for(var j=i+1; j<a.length; ++j) {
					// If it's a JS object, look for the capType as the unique property
					if (typeof a[i] == "object"){
						if (a[i].capType){
							if(a[i].capType == a[j].capType){
								// Concat Modules array in same captype
								if (a[i].modules && a[j].modules){
									a[i].modules.concat(a[j].modules);
								}
								// If the module that will remain doesn't exist, copy from the one that will get deleted
								if (a[j].modules && !a[i].modules){
									a[i].modules = a[j].modules;
								}
								a.splice(j--, 1);
							}
						}else{
							if (JSON.stringify(a[i]) == JSON.stringify(a[j])){
								a.splice(j--, 1);								
							}
						}
						
					}else{
						if(a[i] === a[j])
							a.splice(j--, 1);
					}
				}
			}
			return a;
		}
	});
}
if (!String.prototype.replaceAll) {
	Object.defineProperty(String.prototype, 'replaceAll', {
		enumerable: false,
		value: function(find, replace){
			var theString = String(this);
			if (theString){
				return theString.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
			}else{
				return theString;
			}
		}
	});
}

function getCapTypeBySubType(pCapType,capTypeScriptModelList) {
	var capType = pCapType;
	if (pCapType){
		//var pCapTypeArray = pCapType.split("/");
		//if (pCapTypeArray.length>=4){
			//var module =  pCapTypeArray[0];
			if(!capTypeScriptModelList){
				var capTypeScriptModelList = aa.cap.getCapTypeList(aa.util.newQueryFormat()).getOutput();
			}
			for (var i in capTypeScriptModelList) {
				var capTypeScriptModel = capTypeScriptModelList[i];
				rCapType =  capTypeScriptModel.getSubType().toString();
				if (rCapType == pCapType) {
					capType = capTypeScriptModel.getCapType().toString();
				}
			}
			return String(capType).trim();		  
		//}
	}
}

function convertTypeToObject(pCapType,capTypeScriptModelList) {
	if (pCapType.capType){
		return pCapType;
	}
	var originalLanguage = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale().getLanguage();
	var capObject = {capType: pCapType, subType: pCapType};
	if (pCapType){
		//var pCapTypeArray = pCapType.split("/");
		//if (pCapTypeArray.length>=4){
			//var module =  pCapTypeArray[0];
		if(!capTypeScriptModelList){
			var capTypeScriptModelList = aa.cap.getCapTypeList(aa.util.newQueryFormat()).getOutput();
		}
		for (var i in capTypeScriptModelList) {
			var capTypeScriptModel = capTypeScriptModelList[i];
			var capTypeModel = capTypeScriptModelList[i].getCapType();
			var rCapType =  capTypeScriptModel.getSubType().toString();
			var rFullType =  capTypeScriptModel.getCapType().toString();
			var rAlias = capTypeModel.getAlias();
			if (rCapType == pCapType || rFullType == pCapType) {
				var capType = String(rFullType).trim();
				var subType = String(rCapType).trim();
				rAlias = String(rAlias).trim();
				var dCapType = UTAG.capTypes[capType];
				var fullDescription = dCapType.APPTYP_HTML_INSTRUCTION;
				var englishDesc = fullDescription;
				var arabicDesc = fullDescription;
				var descArray = fullDescription.split('<hr>');
				if (descArray.length>1){
					englishDesc = descArray[0];
					arabicDesc = descArray[1];
				}
				
				englishDesc = replaceVariables(englishDesc, false);
				arabicDesc = replaceVariables(arabicDesc, true);
				capObject = {capType: capType, subType: rAlias, description: englishDesc, descriptionAr: arabicDesc};
			}
		}
		// get Arabic
		com.accela.i18n.I18NContext.getI18NModel().setClientType("V360");
		com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");//"en_US"
		
		var capTypeScriptModelList = aa.cap.getCapTypeList(aa.util.newQueryFormat()).getOutput();
		for (var i in capTypeScriptModelList) {
			var capTypeScriptModel = capTypeScriptModelList[i];
			var capTypeModel = capTypeScriptModelList[i].getCapType();
			var rCapType =  capTypeScriptModel.getSubType().toString();
			var rFullType =  capTypeScriptModel.getCapType().toString();
			var rAlias = capTypeModel.getResAlias();
			if (rCapType == pCapType || rFullType == pCapType) {
				rAlias = String(rAlias).trim();
				capObject.subTypeAr = rAlias;
			}
		}

		if (originalLanguage == "en_US"){
			// Return the Language to it's Orignal Form
			com.accela.i18n.I18NContext.getI18NModel().setClientType("V360");
			com.accela.i18n.I18NContext.getI18NModel().setLanguage("en_US");//"en_US"
		}
		return capObject;
		//}
	}	
}


function clone(obj) {
	var copy;

	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}

function getSDValueByDesc (sd_name, desc) {
	var bizRes = aa.bizDomain.getBizDomainByDescription(aa.getServiceProviderCode(), sd_name, desc);
	var valueAr = '';
	if (bizRes.getSuccess()) {
		valueAr = bizRes.getOutput().getBizdomainValue();
	}
	return valueAr;
}

function getSCDescByValue(standardChoiceObject, value){
	for(var s in standardChoiceObject){
		var sc = standardChoiceObject[s];
		var curVal = String(sc.getBizdomainValue()).trim();
		var curDesc = String(sc.getDescription()).trim();
		//logDebug("getSCDescByValue: ", value + ". cur:" + curVal + " | Desc:" + curDesc);
		if (curVal == String(value).trim()){
			return curDesc;
		}
	}
}

function replaceVariables(desc, isRtl){
	if (desc.indexOf("$$IncidentSubmissionSettings$$")>-1){
		var incSubmissionHTML = getIncidentSubmissionSettings(isRtl);
		desc = desc.replace("$$IncidentSubmissionSettings$$", incSubmissionHTML);
	}
	if (desc.indexOf("$$InvestigationSubmissionSettings$$")>-1){
		var invHTML = getInvestigationSubmissionSettings(isRtl);
		desc = desc.replace("$$InvestigationSubmissionSettings$$", invHTML);
	}
	return desc;
}

function getIncidentSubmissionSettings(isRtl) {
	var message = "";
	
	var asit = new ASITNavigator(aa.cap.getCapID("SPSA Global Settings").getOutput(), "INCIDENT SUBMISSION SETTINGS");
	asit.filterBy("Active", "CHECKED");
	
	if (isRtl) {
		var header = 'إعدادات الحوادث';
		var type = 'نوع الحادث';
		var time = 'وقت التقديم بالساعات';
	} else {
		var header = 'Incident Submission Conditions'
		var type = 'Incident Type';
		var time = 'Submission Time in Hours';
	}

	var content = "<table class='comments_table' style='width: 100%;'>"
	content += '<tr style="font-size: 11px;">'
	content += '<th>'
	content += type
	content += '</th>'
	content += '<th>'
	content += time
	content += '</th>'
	content += '</tr>'

	if (!asit.filteredRowsCount){
		content += '<tr style="font-size: 11px;" class="table-body">';
		content += '</tr>';
	}
	while (asit.nextRow()) {
		
		content += '<tr style="font-size: 11px;">'
		content += '<td>'
		if (isRtl){
			content += asit.getFieldByLanguage('Incident Type', 'ar_AE');
		}else{
			content += asit.getFieldStr('Incident Type');
		}
		content += '</td>'
		content += '<td>'
		content += asit.getFieldStr('Submission Time')
		content += '</td>'
		content += '</tr>'
	}
	content += '</table>';
	return content;
}


function getInvestigationSubmissionSettings(isRtl) {
	var message = "";
	
	var asit = new ASITNavigator(aa.cap.getCapID("SPSA Global Settings").getOutput(), "INVESTIGATION SUBMISSION");
	asit.filterBy("Active", "CHECKED");
	
	if (isRtl) {
		var header = 'تقديم التحقيق';
		var type = 'نوع الحادث';
		var unit = 'الوحدة';
		var time = 'وقت التقديم';
	} else {
		var header = 'Investigation Submission'
		var type = 'Incident Type';
		var unit = 'Unit';
		var time = 'Submission Time';
		
	}

	var content = "<table class='comments_table' style='width: 100%;'>"
	content += '<tr style="font-size: 11px;">'
	content += '<th>'
	content += type
	content += '</th>'
	content += '<th>'
	content += unit
	content += '</th>'
	content += '<th>'
	content += time
	content += '</th>'
	content += '</tr>'

	if (!asit.filteredRowsCount){
		content += '<tr style="font-size: 11px;" class="table-body">';
		content += '</tr>';
	}
	while (asit.nextRow()) {
		
		content += '<tr style="font-size: 11px;">'
		content += '<td>'
		if (isRtl){
			content += asit.getFieldByLanguage('Incident Type', 'ar_AE');
		}else{
			content += asit.getFieldStr('Incident Type');
		}			
		content += '</td>'
		content += '<td>'
		if (isRtl){
			content += asit.getFieldByLanguage('Unit', 'ar_AE');
		}else{
			content += asit.getFieldStr('Unit');
		}
		content += '</td>'
		content += '<td>'
		content += asit.getFieldStr('Submission Time')
		content += '</td>'
		content += '</tr>'
	}
	content += '</table>';
	return content;
}