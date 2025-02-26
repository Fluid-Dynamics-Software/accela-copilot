logDebug("DASHBOARD:Init Started!");
eval(getScriptText("INCLUDE_JSON"));
eval(getScriptText("DASHBOARD:CONSTRUCT_SQL"));
eval(getScriptText("DASHBOARD:CONFIG"));
eval(getScriptText("INCLUDE_UTAG"));
eval(getScriptText("INCLUDE_PROFILEREPORTS"));
extend();			// Adds polyfill for Object.assign
if (typeof LAYOUT == "undefined") {
	var LAYOUT = {
		SINGLE: 0,
		CHILD: 1,
		PARENT: 2
	}
}
var servProvCode = 	aa.getServiceProviderCode();
var result = {};
var multiModule = true;
var pageType = String(aa.env.getValue("pageType")).trim();
if (pageType == "singleModule"){
	var multiModule = false;
}

var publicUserSeq = String(aa.env.getValue("publicUserNumber")).trim()?aa.env.getValue("publicUserNumber"):aa.env.getValue("publicUserId");
publicUserSeq = parseFloat(String(publicUserSeq).replace(/\D/g, ''));
var publicUser = "PUBLICUSER" + publicUserSeq;
var selectedModule = "" //"AMAN"; //
var licenseFilter = aa.env.getValue("licenseFilter");
var itemsPerPage = 4;
var page = 0;
var conditions = "";
var logDebug;
var licensesArray = [];
var requestConfig = aa.env.getValue("config"); 
if (requestConfig && String(requestConfig).trim()){
	requestConfig = JSON.parse(requestConfig);	
}
if (requestConfig.module){
	selectedModule = requestConfig.module;
}
var selectedRecord = "";

if (requestConfig.selectedRecord) {
	if (requestConfig.selectedRecord.ALT_ID){
	    selectedRecord = requestConfig.selectedRecord.ALT_ID;		
	}else{
		selectedRecord = requestConfig.selectedRecord;
	}
}
try {
	var licenseFilter = JSON.parse(licenseFilter);
} catch (e) {
	var licenseFilter = false;
}

var userSettingsJSON = UTAG.getOnloginSettingsByPublicUser(publicUserSeq, selectedModule, pageConfig);
var onlyGetListOfModules = (!selectedModule || String(selectedModule).trim() == "") && multiModule;
logDebug("publicUserSeq", publicUserSeq);

/********** Start Building Results Object **************************/

if (onlyGetListOfModules){
	// Only return List of Modules
	logDebug("Only returning List of Modules!");
	result = {
		modules: userSettingsJSON.viewModules
	};
}else{
	logDebug("Loading Selected Module:", selectedModule);
	result = loadSelectedModuleData();
}

getUAEPassUUID();

var sqlString = "select SSO_SESSION_ID from ESSO_SESSIONS where sso_session_status ='ACTIVE' and serv_prov_code='"+servProvCode+"' and sso_user_name='ADMIN'"
var aadba = aa.proxyInvoker.newInstance("com.accela.aa.datautil.AADBAccessor").getOutput();
var aadba = aadba.getInstance();
var getSessionResult = aadba.select(sqlString, null);
var userSessionId;
if (getSessionResult.size() > 0) {
	userSessionId = getSessionResult.get(0)[0];
}

if (!userSessionId || userSessionId == "") {
  var bizInstance = aa.proxyInvoker.newInstance("com.accela.security.AuthenticationEJB").getOutput();
  var userSession = bizInstance.getUserSession('SSO0123456', 'AC360Agency', servProvCode, 'ADMIN', null);
  var userSessionId = userSession.getSessionId();
}

result.sessionId = String(userSessionId);
result.publicUser = publicUser;

// Combine into final Results file
var moduleConfig = selectedModule&&pageConfig[selectedModule]?pageConfig[selectedModule]:{pageConfig: pageConfig};
result = Object.assign(moduleConfig, userSettingsJSON, result);
//logDebug("Final user settings JSON: ", JSON.stringify(result));

try {
	aa.env.setValue("Content", JSONfn.stringify(result));
    aa.env.setValue("Success", true);
    aa.env.setValue("Message", "Results returned successfully");

} catch (e) {
    aa.env.setValue("ScriptReturnCode", "-1");
    aa.env.setValue("Success", false);
    aa.env.setValue("Message", "Error while executing Dashboard:INIT. Error: " + e);
}

function loadSelectedModuleData(){

	if (userSettingsJSON.selectedModule){
		selectedModule = userSettingsJSON.selectedModule;	
	}

	logDebug("DASHBOARD:INITIATE: publicUserSeq: => ", publicUserSeq);
	logDebug("selectedModule:", selectedModule);
	//logDebug("DASHBOARD:INITIATE User settings JSON: ", JSON.stringify(userSettingsJSON));

	var result = {
		pageType: String(selectedModule).trim()
	};

//		Get licensesArray by getting all licenses attached to the user, 
//		Then Filtering them out by License Type (from pageConfig) & also by licenseFilter (selected license from the Dashboard)
	var licensesArray = [];
	if (pageConfig[selectedModule]) {
		licensesArray = getLoggedInUserFilteredLicenses(publicUserSeq, pageConfig[selectedModule].licenseType, licenseFilter);
	}
	
	logDebug("licensesArray: ", JSON.stringify(licensesArray));

	var selectedTab = pageConfig[selectedModule].defaultTab;
	var defaultFields = tabConfig[selectedTab].fields;


	//Get Pinned Records:

	var seqNo = String(publicUserSeq).replace('PUBLICUSER', '');
	var pinnedRecords = execQuery("SELECT USER_COMMENT FROM PUBLICUSER WHERE USER_SEQ_NBR = " + seqNo);
	if (pinnedRecords.length){
		var pinned = pinnedRecords[0]["USER_COMMENT"].split(',');
		result.pinned = pinned.filter(function (el) {
		  if (el){
			 return true;
		  }else{
			 return false;
		  }
		});
	}
	if(pageConfig[selectedModule].menuConfig){
		result.menuConfig = pageConfig[selectedModule].menuConfig;
	}
	logDebug("About to start Parent-Child => ", pageConfig[selectedModule].pageLayout);
	if (pageConfig[selectedModule].pageLayout == "Parent-Child") {
		/*************
			Parent-Child Layout 
		**************/

		// Parent Tab
		var parentTab = pageConfig[selectedModule].parentTab;
		var parentTabConfig = tabConfig[parentTab];
		if (parentTabConfig.itemsPerPage) {
			itemsPerPage = parentTabConfig.itemsPerPage;
		}
		logDebug("About to get parentData");
		//var sql = getSQL("", pageConfig[selectedModule], tabConfig, LAYOUT.PARENT, licensesArray, publicUserSeq, conditions, [], itemsPerPage, page, null, null, false, x);
		var parentData = getData({
			tabName: "",
			pageConfig: pageConfig[selectedModule],
			tabConfig: parentTabConfig,
			layoutPart: LAYOUT.PARENT,
			licenses: licensesArray,
			publicUserSeq: publicUserSeq,
			conditions: conditions,
			itemsPerPage: itemsPerPage,
			page: page,
			actions: userSettingsJSON.actions,
			tableJoins: parentTabConfig.tableJoins,
			sqlFields: parentTabConfig.sqlFields,
			module: selectedModule
		});

		//var sqlCount = getSQL("", pageConfig[selectedModule], tabConfig, LAYOUT.PARENT, licensesArray, publicUserSeq, conditions, [], itemsPerPage, page, null, null, true, x);
		var parentDataCount = getData({
			tabName: "",
			pageConfig: pageConfig[selectedModule],
			tabConfig: parentTabConfig,
			layoutPart: LAYOUT.PARENT,
			licenses: licensesArray,
			publicUserSeq: publicUserSeq,
			conditions: conditions,
			itemsPerPage: itemsPerPage,
			page: page,
			tableJoins: parentTabConfig.tableJoins,
			sqlFields: parentTabConfig.sqlFields,	
			count: true,
			module: selectedModule
		});

		result.parentConfig = {};
		result.parentConfig[parentTab] = tabConfig[parentTab];
		result.parentConfig[parentTab].tabType = "parent";
		result.parentConfig[parentTab].count = parentDataCount
		result.parentConfig[parentTab].dataset = parentData;
		result.parentConfig[parentTab].pageType = selectedModule;
		result.parentConfig[parentTab].licenseFilter = licensesArray;

		var selectedTab = pageConfig[selectedModule].defaultTab;
		var selectedParent;
		
		if ((parentDataCount && parseInt(parentDataCount)) || selectedModule == 'AMAN' || selectedModule == 'AMAN Integrator Profile') {
			if (selectedModule == 'AMAN'){
				result.parentRecord = {}
				result.parentLicense = [];
			}else{
				if (selectedRecord){
					for(var p in parentData){
						if (parentData[p].ALT_ID == selectedRecord){
							selectedParent = parentData[p];
						}
					}
				}else{
					if (result.pinned.length){
						for(var p in parentData){
							if (parentData[p].ALT_ID == result.pinned[0]){
								selectedParent = parentData[p];
							}
						}
						if (!selectedParent){
							// Auto Select First Parent Record
							selectedParent = parentData[0];		
						}
					}else{
						// Auto Select First Parent Record
						selectedParent = parentData[0];			
					}
					// Attach Selected Parent Licenses
					
				}
				var selectedParentLicenses = JSON.parse(selectedParent.B1_LICENSES);

				result.parentRecord = selectedParent
				result.parentLicense = selectedParentLicenses;
			}
			
			result.childrenConfig = {};

			// Create Children
			var childrenTabConfigList = pageConfig[selectedModule].childrenConfig;

			for (var i in childrenTabConfigList) {
				var loopTab = childrenTabConfigList[i];
				var childTabConfig = tabConfig[loopTab];

				var childrenLicenseTypeFilters = pageConfig[selectedModule].childrenLicenseType;
				var parentLicenseTypeFilters = pageConfig[selectedModule].licenseType;
				var parentLicenses = licensesArray; //getChildFilteredLicenses(licensesArray, parentLicenseTypeFilters, );
				
				itemsPerPage = childTabConfig.itemsPerPage;
				
				// Load the Tab if it is the specified Tab
				if (loopTab == selectedTab) {
					//var sql = getSQL(childrenTabConfigList[i], pageConfig[selectedModule], tabConfig, LAYOUT.CHILD, parentLicenses, publicUserSeq, conditions, userSettingsJSON.viewApplications, itemsPerPage, page, null, null, false);
					/*logDebug("childrenData Config:", JSON.stringify({
						tabName: selectedTab,
						getByParentAltId: selectedParent.ALT_ID,
						pageConfig: pageConfig[selectedModule],
						tabConfig: childTabConfig,
						layoutPart: LAYOUT.CHILD,
						licenses: parentLicenses,
						publicUserSeq: publicUserSeq,
						conditions: conditions,
						itemsPerPage: itemsPerPage,
						page: page,
						actions: userSettingsJSON.actions
					}));*/
					var childrenData = getData({
						tabName: selectedTab,
						getByParentAltId: selectedParent?selectedParent.ALT_ID:'',
						pageConfig: pageConfig[selectedModule],
						tabConfig: childTabConfig,
						layoutPart: LAYOUT.CHILD,
						licenses: parentLicenses,
						publicUserSeq: publicUserSeq,
						conditions: conditions,
						itemsPerPage: itemsPerPage,
						page: page,
						actions: userSettingsJSON.actions,
						tableJoins: childTabConfig.tableJoins,
						sqlFields: childTabConfig.sqlFields,						
						count: false,
						module: selectedModule
					});
					//logDebug("childrenData:", childrenData);

					//var sqlCount = getSQL(childrenTabConfigList[i], pageConfig[selectedModule], tabConfig, LAYOUT.CHILD, parentLicenses, publicUserSeq, conditions, userSettingsJSON.viewApplications, itemsPerPage, page, null, null, true);
					var childrenDataCount = getData({
						tabName: selectedTab,
						getByParentAltId: selectedParent?selectedParent.ALT_ID:'',
						pageConfig: pageConfig[selectedModule],
						tabConfig: childTabConfig,
						layoutPart: LAYOUT.CHILD,
						licenses: parentLicenses,
						publicUserSeq: publicUserSeq,
						conditions: conditions,
						itemsPerPage: itemsPerPage,
						page: page,
						tableJoins: childTabConfig.tableJoins,
						sqlFields: childTabConfig.sqlFields,						
						count: true,
						module: selectedModule
					});
					result.childrenConfig[childrenTabConfigList[i]] = tabConfig[childrenTabConfigList[i]]
					result.childrenConfig[childrenTabConfigList[i]].dataset = childrenData;
					result.childrenConfig[childrenTabConfigList[i]].count = childrenDataCount;
				} else {
					// Else Just load the Count for the tabs that are not currently active
					//var sqlCount = getSQL(childrenTabConfigList[i], pageConfig[selectedModule], tabConfig, LAYOUT.CHILD, parentLicenses, publicUserSeq, conditions, userSettingsJSON.viewApplications, itemsPerPage, page, null, null, true);
					var childrenDataCount = getData({
						tabName: childrenTabConfigList[i],
						getByParentAltId: selectedParent?selectedParent.ALT_ID:'',
						pageConfig: pageConfig[selectedModule],
						tabConfig: childTabConfig,
						layoutPart: LAYOUT.CHILD,
						licenses: parentLicenses,
						publicUserSeq: publicUserSeq,
						conditions: conditions,
						itemsPerPage: itemsPerPage,
						page: page,
						tableJoins: childTabConfig.tableJoins,
						sqlFields: childTabConfig.sqlFields,						
						count: true,
						module: selectedModule
					});

					result.childrenConfig[childrenTabConfigList[i]] = tabConfig[childrenTabConfigList[i]]
					result.childrenConfig[childrenTabConfigList[i]].count = childrenDataCount
				}
				result.childrenConfig[childrenTabConfigList[i]].tabType = "Child";
			}
			// Add Notifications
			if ((selectedModule == 'AMAN' || selectedModule == 'AMAN Integrator Profile') && !selectedParent){
				
			}else{
				result.childrenConfig.alerts = loadTabCount("Alerts", selectedParent?selectedParent.ALT_ID:'', true); 
				result.childrenConfig.comments = loadTabCount("Notification Comments", selectedParent?selectedParent.ALT_ID:'', true);				
			}
			
			// Add EmptyDashboard Submitted Records
			var emptyDashboardConfig = {
				newSqlConditions: " 1<>1  ",
			    sqlConditions: " 1<>1  "
			}
			var emptyDashboardButtons = pageConfig[selectedModule].emptyDashboardButtons;
			if (emptyDashboardButtons){
				for (var recCategory in emptyDashboardButtons){
					if (emptyDashboardButtons.hasOwnProperty(recCategory)){
						emptyDashboardConfig.newSqlConditions += " OR PER.B1_PER_CATEGORY = '"+recCategory+"' ";
						emptyDashboardConfig.sqlConditions += " OR CATEGORY = '"+recCategory+"' ";
					}
				}
				var emptyDashboardRecords = getData({
					pageConfig: pageConfig[selectedModule],
					tabConfig: emptyDashboardConfig,
					layoutPart: LAYOUT.CHILD,
					licenses: licensesArray,
					publicUserSeq: publicUserSeq,
					conditions: conditions,
					itemsPerPage: itemsPerPage,
					page: page
				});
				result.emptyDashboardRecords = emptyDashboardRecords;
			}
			
			// Add Downloadables
			if (selectedParent && selectedModule != 'AMAN Integrator Profile'){
				var reports = new PROFILEREPORTS(selectedParent?selectedParent.ALT_ID:'');
				result.childrenConfig.downloadables = reports.getProfileReports(true);				
			}
		} else {
			result.parentLicense = [];
			result.parentRecord = {};
			var childrenTabConfigList = pageConfig[selectedModule].childrenConfig
			result.childrenConfig = {};
			for (var i in childrenTabConfigList) {
				result.childrenConfig[childrenTabConfigList[i]] = tabConfig[childrenTabConfigList[i]]
				result.childrenConfig[childrenTabConfigList[i]].dataset = [];
				result.childrenConfig[childrenTabConfigList[i]].count = 0;
				result.childrenConfig[childrenTabConfigList[i]].pageType = selectedModule;
				result.childrenConfig[childrenTabConfigList[i]].tabType = "Child";
			}
		}

	} else {
		/********** 
			Single Layout 
		***********/
		var childrenTabConfigList = pageConfig[selectedModule].childrenConfig
		result.childrenConfig = {};

		for (var i in childrenTabConfigList) {
			var loopTabName = childrenTabConfigList[i];
			var loopTab = tabConfig[loopTabName];
			itemsPerPage = loopTab.itemsPerPage;

			if (loopTabName == pageConfig[selectedModule].defaultTab) {
				//var sql = getSQL(childrenTabConfigList[i], pageConfig[selectedModule], tabConfig, LAYOUT.SINGLE, licensesArray, publicUserSeq, conditions, userSettingsJSON.viewApplications, itemsPerPage, page, null, null, false);
				var data = getData({
					tabName: loopTabName,
					pageConfig: pageConfig[selectedModule],
					tabConfig: loopTab,
					layoutPart: LAYOUT.SINGLE,
					licenses: licensesArray,
					publicUserSeq: publicUserSeq,
					conditions: conditions,
					itemsPerPage: itemsPerPage,
					page: page,
					actions: userSettingsJSON.actions,
					tableJoins: loopTab.tableJoins,
					sqlFields: loopTab.sqlFields	,
					module: selectedModule					
				});

				//var sqlCount = getSQL(childrenTabConfigList[i], pageConfig[selectedModule], tabConfig, LAYOUT.SINGLE, licensesArray, publicUserSeq, conditions, userSettingsJSON.viewApplications, itemsPerPage, page, null, null, true);
				var dataCount = getData({
					tabName: loopTabName,
					pageConfig: pageConfig[selectedModule],
					tabConfig: loopTab,
					layoutPart: LAYOUT.SINGLE,
					licenses: licensesArray,
					publicUserSeq: publicUserSeq,
					conditions: conditions,
					itemsPerPage: itemsPerPage,
					page: page,
					tableJoins: loopTab.tableJoins,
					sqlFields: loopTab.sqlFields,						
					count: true,
					module: selectedModule
				});

				result.childrenConfig[loopTabName] = loopTab
				result.childrenConfig[loopTabName].dataset = data;
				result.childrenConfig[loopTabName].count = dataCount;
				result.childrenConfig[loopTabName].tabType = "Child";

			} else {
				var data = [];
				//var sqlCount = getSQL(childrenTabConfigList[i], pageConfig[selectedModule], tabConfig, LAYOUT.SINGLE, licensesArray, publicUserSeq, conditions, userSettingsJSON.viewApplications, itemsPerPage, page, null, null, true);
				var dataCount = getData({
					tabName: loopTabName,
					pageConfig: pageConfig[selectedModule],
					tabConfig: loopTab,
					layoutPart: LAYOUT.SINGLE,
					licenses: licensesArray,
					publicUserSeq: publicUserSeq,
					conditions: conditions,
					itemsPerPage: itemsPerPage,
					page: page,
					tableJoins: loopTab.tableJoins,
					sqlFields: loopTab.sqlFields,						
					count: true,
					module: selectedModule
				});

				if(loopTab.getDataset){
					var data = getData({
						tabName: loopTabName,
						pageConfig: pageConfig[selectedModule],
						tabConfig: loopTab,
						layoutPart: LAYOUT.SINGLE,
						licenses: licensesArray,
						publicUserSeq: publicUserSeq,
						conditions: conditions,
						itemsPerPage: itemsPerPage,
						page: page,
						actions: userSettingsJSON.actions,
						tableJoins: loopTab.tableJoins,
						sqlFields: loopTab.sqlFields,
						module: selectedModule						
					});					
				}

				result.childrenConfig[loopTabName] = loopTab;
				result.childrenConfig[loopTabName].pageType = selectedModule;
				result.childrenConfig[loopTabName].count = dataCount;
				result.childrenConfig[loopTabName].dataset = data;
			}
			result.childrenConfig[loopTabName].tabType = "Child";
		}
	}

	result.defaultFields = defaultFields;

	if (!result.general){
		result.general = {};		
	}
	if (selectedModule != "AMAN" && selectedModule != "AMAN Integrator Profile"){ 
		result.general["User Notification Alerts"] = tabConfig["User Notification Alerts"];
		result.general["User Notification Alerts"].tabType = "";
		result.general["User Notification Alerts"].count = loadGeneralNotificationCount("User Notification Alerts");
		result.general["User Notification Alerts"].dataset = [];
		result.general["User Notification Alerts"].pageType = "GeneralAlerts";
		result.general["User Notification Alerts"].licenseFilter = licensesArray;

		result.general["User Notification Comments"] = tabConfig["User Notification Comments"];
		result.general["User Notification Comments"].tabType = "";
		result.general["User Notification Comments"].count = loadGeneralNotificationCount("User Notification Comments");
		result.general["User Notification Comments"].dataset = [];
		result.general["User Notification Comments"].pageType = "GeneralAlerts";
		result.general["User Notification Comments"].licenseFilter = licensesArray;

		result.general["User Notification Historical"] = tabConfig["User Notification Historical"];
		result.general["User Notification Historical"].tabType = "";
		result.general["User Notification Historical"].count = loadGeneralNotificationCount("User Notification Historical");
		result.general["User Notification Historical"].dataset = [];
		result.general["User Notification Historical"].pageType = "GeneralAlerts";
		result.general["User Notification Historical"].licenseFilter = licensesArray;

/*		result.general["User Notification Communication"] = tabConfig["User Notification Communication"];
		result.general["User Notification Communication"].tabType = "";
		result.general["User Notification Communication"].count = loadGeneralNotificationCount("User Notification Communication");
		result.general["User Notification Communication"].dataset = [];
		result.general["User Notification Communication"].pageType = "GeneralAlerts";
		result.general["User Notification Communication"].licenseFilter = licensesArray;*/
					

	}
	
	return result;
}

function getUAEPassUUID() {

	var userModel = aa.publicUser.getPublicUser(publicUserSeq).getOutput();
	var puSeq = userModel.getUserSeqNum();
	var publicUserIDList = aa.util.newArrayList();
	publicUserIDList.add(puSeq);

	var contractorBiz = aa.proxyInvoker.newInstance("com.accela.pa.people.ContractorPeopleBusiness").getOutput();
	var contractorPeopleModelList = contractorBiz.getContractorPeopleListByUserSeqNBR(aa.getServiceProviderCode(), publicUserIDList);
	if (contractorPeopleModelList != null && contractorPeopleModelList.size() > 0) {
		var peopleModel = contractorPeopleModelList.get(0);
		var compactAddress = peopleModel.getCompactAddress();
		var uuid = compactAddress.getAddressLine3();
		result["uae_pass_uuid"] = uuid != null ? "" + uuid : null;
	}
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

function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null) {
		msg2 = "";
	} else {
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("=== DASHBOARD:INIT ==> " + msg + msg2);
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

function loadTabCount(tabName, parentAltId, includeParent) {
	var parentTab = tabName;
	var parentTabConfig = tabConfig[parentTab];
	if (parentTabConfig.itemsPerPage) {
		itemsPerPage = parentTabConfig.itemsPerPage;
	}
	var parentDataCount = getData({
		tabName: tabName,
		getByParentAltId: parentAltId,
		pageConfig: pageConfig[selectedModule],
		tabConfig: parentTabConfig,
		layoutPart: LAYOUT.CHILD,
		licenses: licensesArray,
		publicUserSeq: publicUserSeq,
		conditions: conditions,
		itemsPerPage: itemsPerPage,
		includeParent: includeParent,
		page: page,
		tableJoins: parentTabConfig.tableJoins,
		sqlFields: parentTabConfig.sqlFields,	
		count: true,
		module: selectedModule
	});
	return parentDataCount;	
}
function loadGeneralNotificationCount(tabName) {
	var parentTab = tabName;
	var parentTabConfig = tabConfig[parentTab];
	if (parentTabConfig.itemsPerPage) {
		itemsPerPage = parentTabConfig.itemsPerPage;
	}
	var parentDataCount = getData({
		tabName: tabName,
		getByParentAltId: "",
		pageConfig: pageConfig[selectedModule],
		tabConfig: parentTabConfig,
		layoutPart: LAYOUT.CHILD,
		licenses: licensesArray,
		publicUserSeq: publicUserSeq,
		conditions: conditions,
		itemsPerPage: itemsPerPage,
		page: page,
		tableJoins: parentTabConfig.tableJoins,
		sqlFields: parentTabConfig.sqlFields,	
		count: true,
		module: selectedModule
	});
	return parentDataCount;	
}