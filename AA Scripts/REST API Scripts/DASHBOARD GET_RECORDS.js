/*------------------------------------------------------------------------------------------------------/
| Program		: DASHBOARD:GET_RECORDS.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 28/03/2022 13:46:16
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_JSON"));
eval(getScriptText("DASHBOARD:CONSTRUCT_SQL"));
eval(getScriptText("DASHBOARD:CONFIG"));
eval(getScriptText("INCLUDE_UTAG"));
extend();

if (typeof LAYOUT == "undefined") {
	var LAYOUT = {
		SINGLE: 0,
		CHILD: 1,
		PARENT: 2
	}
}

var publicUserId = aa.env.getValue("publicUserId");
var publicUserSeq = String(publicUserId).replace(/\D/g, '');
publicUserSeq = parseFloat(publicUserSeq);
var publicUser = "PUBLICUSER" + publicUserSeq;
var requestConfig = aa.env.getValue("config");		//var requestConfig = '{
//			"module":"HFL",	//used to be pageType, change to module
//			"tab":"My Requests",
//			"page":0,
//			"sort":"",
//			"sortDirection":"",
//			"selectedRecord": "",
//			"license":[{
//				"LICENSE_NUMBER":"HFPRF-2019-000082",
//				"LICENSE_TYPE":"Facility",
//				"LICENSE_STATUS":"A",
//				"LICENSE_FLAG":""}],
//			"search":[],
//			"advancedSearch":{
//				"OPENED_DATE":{
//					"from":"01/01/2019","to":"18/06/2020"}
//			},
//			"licenseFilter":""}';
logDebug("Get Records Config", requestConfig); 

requestConfig = JSON.parse(requestConfig);
var result = {};
var tab = requestConfig.tab;
var selectedModule = requestConfig.module;
var licenseFilter = requestConfig.licenseFilter;
var itemsPerPage = requestConfig.itemsPerPage || 6;
var statistics = requestConfig.statistics || false;

var page = 0;
var conditions = "";
var selectedRecord = "";
var childrenPage = 0;
var filterByModule = '';
var childrenItemPerPage = 10;
var getTabs = requestConfig.getTabs;
var includeParent = requestConfig.includeParent || false;

if (requestConfig.selectedRecord) {
	if (requestConfig.selectedRecord.ALT_ID){
	    selectedRecord = requestConfig.selectedRecord.ALT_ID;		
	}else{
		selectedRecord = requestConfig.selectedRecord;
	}
}
logDebug("Now Loading Tab:", tab);

// @ use those values to paginate the children records
//childrenPage = requestConfig.childrenPage ? requestConfig.childrenPage : childrenPage;
//childrenItemPerPage = requestConfig.childrenItemPerPage ? requestConfig.childrenItemPerPage : childrenItemPerPage;

//	Get licensesArray by getting all licenses attached to the user, 
//	Then Filtering them out by License Type (from pageConfig) & also by licenseFilter (selected license from the Dashboard)
var licensesArray = [];
if (pageConfig[selectedModule]) {
    var licensesArray = getLoggedInUserFilteredLicenses(publicUserSeq, pageConfig[selectedModule].licenseType, licenseFilter);
}

if (requestConfig.page || requestConfig.page === 0) {
    page = requestConfig.page - 1;
}

var sort = "";
if (requestConfig.sort != "") {
    sort = requestConfig.sort;
}

var sortDirection = "";
if (requestConfig.sortDirection != "") {
    sortDirection = requestConfig.sortDirection;
}
var menuSection = "";
if (requestConfig.menuSection != "") {
	menuSection = requestConfig.menuSection;
}
var userSettingsJSON = UTAG.getOnloginSettingsByPublicUser(publicUserSeq, selectedModule, pageConfig);
logDebug("DASHBOARD:GET_RECORDS User settings JSON: ", JSON.stringify(userSettingsJSON));

var advancedSearch = requestConfig.advancedSearch;

var childrenConfigList = pageConfig[selectedModule].childrenConfig;
var tabName = "";
var childTabConfig = null;

if (tab){
	for (var i in childrenConfigList) {
	    if (childrenConfigList[i].toLowerCase() == tab.toLowerCase()) {
	        tabName = childrenConfigList[i];
	        childTabConfig = tabConfig[tabName];
	        break;
	    }
	}
	if (tabName==""){
		// If cannot find the Tab in the PageConfig. Try to find it in tabConfig
		tabName = tab;
		childTabConfig = tabConfig[tabName];
	}

	// @ Use case: in Salama Entity load just salama records for alerts and comments
	if(tab == "Alerts" || tab == "Notification Comments" || tab == "Notification Historical"){ 
		filterByModule = selectedModule
	}
} else {
	// If Tab is not specified, then select the default tab
    tabName = pageConfig[selectedModule].defaultTab;
    childTabConfig = tabConfig[tabName];
} 

var childrenLicenseTypeFilters = pageConfig[selectedModule].childrenLicenseType;
var parentLicenseTypeFilters = pageConfig[selectedModule].licenseType;
logDebug("About to get filtered Licenses!");
var parentLicenses = licensesArray;//getLoggedInUserFilteredLicenses(parentLicenseTypeFilters);
logDebug(JSON.stringify(licensesArray));
if (!requestConfig.itemsPerPage && childTabConfig.itemsPerPage){	
	itemsPerPage = childTabConfig.itemsPerPage;
}

logDebug("selectedRecord", selectedRecord);
if (!getTabs){
	// Get A Single Tab's results
	if (!statistics){
		var childrenData = getData({
		    tabName: tabName,
		    getByParentAltId: selectedRecord,
		    pageConfig: pageConfig[selectedModule],
		    tabConfig: childTabConfig,
		    layoutPart: LAYOUT.CHILD,
		    licenses: parentLicenses,
		    publicUserSeq: publicUserSeq,
		    conditions: conditions,
		    itemsPerPage: itemsPerPage,
		    page: page,
		    actions: userSettingsJSON.actions,
		    search: requestConfig.search,
		    advancedSearch: requestConfig.advancedSearch,
		    sortField: sort,
		    sortDirection: sortDirection,
		    includeParent: includeParent,
			tableJoins: childTabConfig.tableJoins,
			sqlFields: childTabConfig.sqlFields,						
		    count: false,
			filterByModule:filterByModule,
			menuSection: menuSection,
			module: selectedModule
		});
		logDebug("childrenData:", childrenData);

		var childrenDataCount = getData({
		    tabName: tabName,
		    getByParentAltId: selectedRecord,
		    pageConfig: pageConfig[selectedModule],
		    tabConfig: childTabConfig,
		    layoutPart: LAYOUT.CHILD,
		    licenses: parentLicenses,
		    publicUserSeq: publicUserSeq,
		    conditions: conditions,
		    itemsPerPage: itemsPerPage,
		    page: page,
		    search: requestConfig.search,
		    advancedSearch: requestConfig.advancedSearch,
		    sortField: sort,
		    sortDirection: sortDirection,
		    includeParent: includeParent,
			tableJoins: childTabConfig.tableJoins,
			sqlFields: childTabConfig.sqlFields,						
		    count: true,
			filterByModule:filterByModule,
		    menuSection: menuSection,
			module: selectedModule
		});	
		
		var recordTypeData = getData({
		    tabName: tabName,
		    getByParentAltId: selectedRecord,
		    pageConfig: pageConfig[selectedModule],
		    tabConfig: childTabConfig,
		    layoutPart: LAYOUT.CHILD,
		    licenses: parentLicenses,
		    publicUserSeq: publicUserSeq,
		    conditions: conditions,
		    itemsPerPage: itemsPerPage,
		    page: page,
		    search: requestConfig.search,
		    advancedSearch: requestConfig.advancedSearch,
		    sortField: sort,
		    sortDirection: sortDirection,
		    includeParent: includeParent,
			tableJoins: childTabConfig.tableJoins,
			sqlFields: childTabConfig.sqlFields,						
		    count: 'RECORD_TYPE',
			filterByModule:filterByModule,
		    menuSection: menuSection,
			module: selectedModule
		});	
	}else{
		var childrenData = null;
		var childrenDataCount = null;
		var recordTypeData = getData({
		    tabName: tabName,
		    getByParentAltId: selectedRecord,
		    pageConfig: pageConfig[selectedModule],
		    tabConfig: childTabConfig,
		    layoutPart: LAYOUT.CHILD,
		    licenses: parentLicenses,
		    publicUserSeq: publicUserSeq,
		    conditions: conditions,
		    itemsPerPage: itemsPerPage,
		    page: page,
		    search: requestConfig.search,
		    advancedSearch: requestConfig.advancedSearch,
		    sortField: sort,
		    sortDirection: sortDirection,
		    includeParent: includeParent,
			tableJoins: childTabConfig.tableJoins,
			sqlFields: childTabConfig.sqlFields,						
		    count: 'RECORD_TYPE',
			filterByModule:filterByModule,		    
		    menuSection: menuSection,
			module: selectedModule
		});	
	}

	result.childrenConfig = {};
	result.childrenConfig[tabName] = tabConfig[tabName]
	result.childrenConfig[tabName].dataset = childrenData;
	result.childrenConfig[tabName].count = childrenDataCount;
	result.childrenConfig[tabName].name = tabName;
	result.childrenConfig[tabName].recordTypes = recordTypeData;
	
	if(childTabConfig.statisticsTabs) {	
		result.childrenConfig[tabName]['statistics'] = {}		
		getTabStatistics(childTabConfig.statisticsTabs)
	}
	
	// Add Notifications
	if (result.childrenConfig[tabName].recordTypes){
		result.childrenConfig[tabName].recordTypes.alerts = loadTabCount("Alerts", selectedRecord, true); 
		result.childrenConfig[tabName].recordTypes.comments = loadTabCount("Notification Comments", selectedRecord, true);		
	}
	
	
}else{
	// Get All Tabs Counts (Statistics)
	result.childrenConfig = {};
	var childrenTabConfigList = pageConfig[selectedModule].childrenConfig;
	for (var i in childrenTabConfigList) {
		var loopTab = childrenTabConfigList[i];
		var childTabConfig = tabConfig[loopTab];

		var childrenLicenseTypeFilters = pageConfig[selectedModule].childrenLicenseType;
		//var parentLicenseTypeFilters = pageConfig[selectedModule].licenseType;
		//var parentLicenses = getChildFilteredLicenses(parentLicenseTypeFilters);

		itemsPerPage = childTabConfig.itemsPerPage;

		// Else Just load the Count for the tabs that are not currently active
		//var sqlCount = getSQL(childrenTabConfigList[i], pageConfig[selectedModule], tabConfig, LAYOUT.CHILD, parentLicenses, publicUserSeq, conditions, userSettingsJSON.viewApplications, itemsPerPage, page, null, null, true);
		var childrenDataCount = getData({
			tabName: childrenTabConfigList[i],
			getByParentAltId: selectedRecord,
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
			filterByModule:filterByModule,			
			menuSection: menuSection,
			module: selectedModule
		});

		result.childrenConfig[childrenTabConfigList[i]] = tabConfig[childrenTabConfigList[i]]
		result.childrenConfig[childrenTabConfigList[i]].count = childrenDataCount
		result.childrenConfig[childrenTabConfigList[i]].name = childrenTabConfigList[i];
	}
	// Add Notifications
	result.childrenConfig.alerts = loadTabCount("Alerts", selectedRecord, true,selectedModule); 
	result.childrenConfig.comments = loadTabCount("Notification Comments", selectedRecord, true,selectedModule);		

	
	// Add Downloadables	
	
}


// get parent Record As well
if (selectedRecord){
	var parentData = getData({
		tabName: "",
		pageConfig: pageConfig[selectedModule],
		publicUserSeq: publicUserSeq,
		itemsPerPage: 1,
		page: 0,
		actions: userSettingsJSON.actions,
		advancedSearch: {"ALT_ID": selectedRecord}
	});
	if (parentData.length>0){
		result.parentRecord = parentData[0];
		if (includeParent){
			//result.childrenConfig[tabName].dataset.unshift(result.parentRecord);
		}
	}
}

try {
    aa.env.setValue("Content", JSONfn.stringify(result));
    aa.env.setValue("Success", true);
    aa.env.setValue("Message", "Results returned successfully");

} catch (e) {
    aa.env.setValue("ScriptReturnCode", "-1");
    aa.env.setValue("Success", false);
    aa.env.setValue("Message", "Error while executing Workflow Comments. Error: " + e);
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
/*
function getLoggedInUserFilteredLicenses(publicUserSeq, selectedLicenseTypes, licenseFilter) {
    var licensesArray = new Array();
    if (isNaN(publicUserSeq)) { } else {
        userLics = aa.licenseScript.getRefLicProfByOnlineUser(publicUserSeq).getOutput();
        var subLicensesArray = new Array();
        if (userLics) {
        	if (!selectedLicenseTypes){
        		logDebug("No Filtered Licenses! userLics: ", userLics.length);

        		for (var i in userLics) {
                    var licModel = userLics[i];
                    var licNumber = String(licModel.getStateLicense()).trim();
                    var licType = String(licModel.getLicenseType()).trim();
                    subLicensesArray.push(licNumber)
        		}
        		licensesArray.push(subLicensesArray)
        	}else{
        		logDebug("Filtered License: ", selectedLicenseTypes.length)
        		for (var k in selectedLicenseTypes) {

                    for (var i in userLics) {
                        var licModel = userLics[i];
                        var licNumber = String(licModel.getStateLicense()).trim();
                        var licType = String(licModel.getLicenseType()).trim();
                        if (String(selectedLicenseTypes[k]) == String(licType)) {
                            if (licenseFilter) {
                                for (var j in licenseFilter) {
                                    if (String(licenseFilter[j].LICENSE_NUMBER) == String(licNumber)) {
                                        subLicensesArray.push(String(licenseFilter[j].LICENSE_NUMBER))
                                    }
                                }
                            } else {
                                subLicensesArray.push(licNumber)
                            }
                        }
                    }
                    licensesArray.push(subLicensesArray)
                }
        	}
            
        }
    }
    return licensesArray
}
*/
function getTabStatistics(tabStatistics){
	
	for (var i in tabStatistics) {
		var loopTab = tabStatistics[i]; // name of the tab
		var childTabConfig = tabConfig[loopTab]; // tab config object

		var childrenLicenseTypeFilters = pageConfig[selectedModule].childrenLicenseType;
		var parentLicenseTypeFilters = pageConfig[selectedModule].licenseType;
		//var parentLicenses = getChildFilteredLicenses(parentLicenseTypeFilters);

		itemsPerPage = childTabConfig.itemsPerPage;

		// Just load the Count for the tabs that are not currently active		
		var childrenDataCount = getData({
			tabName: tabStatistics[i],
			getByParentAltId: selectedRecord,
			pageConfig: pageConfig[selectedModule],
			tabConfig: childTabConfig,
			layoutPart: LAYOUT.CHILD,
			licenses: licensesArray,
			publicUserSeq: publicUserSeq,
			conditions: conditions,
			itemsPerPage: itemsPerPage,
			page: page,
			tableJoins: childTabConfig.tableJoins,
			sqlFields: childTabConfig.sqlFields,						
			count: true,
			module: selectedModule
		});

		result.childrenConfig[tabName].statistics[tabStatistics[i]] = {}
//		result.childrenConfig[tabName].statistics[tabStatistics[i]] = childTabConfig
		
		result.childrenConfig[tabName].statistics[tabStatistics[i]]['count'] = childrenDataCount
		result.childrenConfig[tabName].statistics[tabStatistics[i]]['name'] = tabStatistics[i];
		result.childrenConfig[tabName].statistics[tabStatistics[i]]['translation'] = childTabConfig.translation;
	}
}

function getChildFilteredLicenses(selectedParentLicenses, licenseTypeFilters, parentLicenseTypes) {
    var parentLicenses = new Array();
    for (var k in licenseTypeFilters) {
        var subLicensesArray = new Array();
        for (var j in selectedParentLicenses) {
            var licModel = selectedParentLicenses[j];
            var licNumber = licModel.LICENSE_NUMBER;
            var licType = licModel.LICENSE_TYPE;
            var licStatus = licModel.LICENSE_STATUS;

            if (String(licenseTypeFilters[k]) == String(licType) && licModel.LICENSE_STATUS == "A") {
                if (parentLicenseTypes.includes(String(licType))) {
                    for (var a in licensesArray) {
                        for (var b in licensesArray[a]) {
                            if (licNumber == licensesArray[a][b]) {
                                subLicensesArray.push(licNumber);
                                break;
                            }
                        }
                    }
                } else {
                    subLicensesArray.push(licNumber)
                }
            }
        }
        parentLicenses.push(subLicensesArray)
    }
    return parentLicenses;
}

function loadTabCount(tabName, parentAltId, includeParent, filterByModule) {
	var filterByModule_ = !filterByModule ? '' : filterByModule
	var parentTab = tabName;
	var parentTabConfig = tabConfig[parentTab];
	if (parentTabConfig.itemsPerPage) {
		itemsPerPage = parentTabConfig.itemsPerPage;
	}
	logDebug("loadTabCount_:", tabName);
	logDebug("loadTabCount:filterByModule_:", filterByModule_);
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
		tableJoins: parentTabConfig.tableJoins,
		sqlFields: parentTabConfig.sqlFields,						
		page: page,
		count: true,
		filterByModule: filterByModule_
	});
	return parentDataCount;	
}

function logDebug(msg, msg2) {
    if (typeof msg2 === "undefined" || msg2 === null) {
        msg2 = "";
    } else {
        msg2 = " : " + msg2;
    }
    java.lang.System.out.println("===Custom Log for DASHBOARD:GET_RECORDs ==> " + msg + msg2);
}