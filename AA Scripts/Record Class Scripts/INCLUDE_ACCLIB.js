/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_ACCLIB.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 05/09/2021 11:23:48
|
/------------------------------------------------------------------------------------------------------*/

function $script() {
	
}

$script.result = function(out) {
	if (!out.getSuccess()) {
		throw out.getErrorMessage();
	}
	
	return out.getOutput();
}

function $data() {
	
}

$data.nullOrEmpty = function(item) {
	if (item == null) {
		return true;
	}
	
	if (Array.isArray(item) && item.length == 0) {
		return true;
	}
	
	if (typeof item == "object" && Object.keys(item).length == 0) {
		return true;
	}
	
	if (typeof item == "string" && (item.length == 0 || String(item) == "")) {
		return true;
	}
	
	return false;
}

function $number() {
	
}

$data.parseInt = function(str){
	return parseInt(str);
}

function $transform() {
	
}

$transform.objectToArray = function(obj, keyName) {
	var arr = [];
	for (var key in obj) {
		var newObj = {}
		if (Array.isArray(obj[key])) {
			newObj[keyName] = key;
			newObj["items"] = obj[key]
		} else if (typeof(obj[key]) == "object") {
			obj[key][keyName] = key;
			newObj = obj[key]
		} else {
			newObj[keyName] = key;
			newObj["value"] = obj[key]
		}
		
		arr.push(newObj)
	}
	
	return arr;
}

$transform.arrayToObject = function(arr, key) {
	var newObj = {};
	for (var i = 0; i < arr.length; i++) {
		if (!key) {
			newObj[arr[i]] = true;
		} else {
			newObj[arr[i][key]] = arr[i];
		}
	}
	
	return newObj;
}


function $java() {
	
}

$java.executePrivateMethod = function(obj, methodName, params, classParams) {
	var method = $java.getPrivateMethod(obj.getClass(), methodName, classParams)
	return method.invoke(obj, params)
}

$java.executePrivateStaticMethod = function(className, methodName, params, classParams) {
	var cls = java.lang.Class.forName(className);
	var method = $java.getPrivateMethod(cls, methodName, classParams)
	return method.invoke(null, params);
}

$java.getPrivateMethod = function(cls, methodName, classParams) {
	var method = null;
	if (!classParams) {
		var methods = cls.getDeclaredMethods().filter(function(method) {
			return method.getName() == methodName;
		})

		if (methods.length > 0) {
			method = methods[0];
		}
	} else {
		method = cls.getDeclaredMethod(methodName, classParams);
	}

	if (method == null) {
		throw "Method " + methodName + " not found in class " + cls.getName();
	}

	method.setAccessible(true);
	return method;
}

function $refAsi() {
}

$refAsi.formatGroup = function(res) {
	var arr = [];
	for (var i = 0; i < res.size(); i++) {
		var group = res.get(i);
		var obj = $refAsi.formatSubgroup(group);
		
		arr.push(obj)
	}
	return arr;
}

$refAsi.formatSubgroup = function(group) {
	if (!group) {
		return {};
	}
	
	var fieldArr = group.getFieldList().toArray().map(function(field) {
		return $refAsi.formatField(field);;
	});

	return {
		"groupCode": group.getGroupCode(),
		"resGroupName": group.getResGroupName(),
		"groupName": group.getGroupName(),
		"checkboxGroup": group.getCheckboxGroup(),
		"fieldList": fieldArr
	}
}

$refAsi.formatField = function(field) {
	var fieldObj = {
		"fieldLabel": field.getFieldLabel(),
		"resFieldLabel": field.getResFieldLabel(),
		"alternativeLabel": field.getAlternativeLabel(),
		"fieldType": parseInt(field.getFieldType()),
		"requiredFlag": field.getRequiredFlag(),
		"defaultValue": field.getDefaultValue(),
		"displayOrder": parseInt(field.getDisplayOrder()),
		"valueList": $refAsi.formatDropdown(field)
	}
	
	return fieldObj;
}

$refAsi.formatDropdown = function(field) {
	var valueList = [];
	if (field.getValueList() != null) {
		valueList = field.getValueList().toArray().map(function(val) {
			return {
				"value": val.getAttrValue(),
				"text": val.getDispAttrValue()
			}
		})
	}
	
	return valueList;
}

$refAsi.getByGroup = function(groupName, type, opts) {
	var subGroupsArr = $script.result(aa.appSpecificInfo.getRefASISubgroups(groupName));
	
	var subGroupsPopulatedArr = subGroupsArr.map(function(subGroupName) {
		return $refAsi.getBySubgroup(groupName, subGroupName, type);
	})
	
	return subGroupsPopulatedArr;
}

$refAsi.getByGroupFormatted = function(groupName, type, opts) {
	var subGroupsArr = $refAsi.getByGroup(groupName, type, opts);
	
	subGroupsArr = subGroupsArr.map(function(obj) {
		return $refAsi.formatSubgroup(obj);
	})
	
	return subGroupsArr;
}

$refAsi.getBySubgroup = function(groupName, subGroupName, type, opts) {
	var asiService = new com.accela.aa.aamain.cap.AppSpecificInfoBusiness();
	var asiRes = $java.executePrivateMethod(asiService, "getRefAppSpecInfoListWithFiledsByGroupCode", [aa.getServiceProviderCode(), groupName, subGroupName, type, aa.getAuditID(), true])
	var resObj = {};
	
	if (asiRes.size() > 0) {
		resObj = asiRes.get(0);
	}
	
	return resObj;
}

$refAsi.getBySubgroupFormatted = function(groupName, subGroupName, type, opts) {
	var resObj = $refAsi.getBySubgroup(groupName, subGroupName, type, opts);;
	resObj = $refAsi.formatSubgroup(resObj);
	
	return resObj;
}

$refAsi.getByRecordType = function(recordType, type) {
	if (!recordType) {
		throw "Record Type is required";
	}
    
    var capTypeModel = $record.getCapTypeModel(recordType);
    
    if (!type) {
		type = "APPLICATION";
	}
    
    var asiService = com.accela.aa.emse.dom.service.CachedService.getInstance().getAppSpecificInfoService();
	var customFields = asiService.getRefAppSpecInfoListWithFiledsByCapType(capTypeModel, type, aa.getAuditID());
	
    
    return customFields;
}

$refAsi.getByRecordTypeFormatted = function(recordType, type, opts) {
	if (!opts) {
    	opts = {};
    }
	
	var customFields = $refAsi.getByRecordType(recordType, type);
	customFields = $refAsi.formatGroup(customFields);
	
	if (opts["removeEmptyGroups"]) {
		customFields = customFields.filter(function(group) {
	        return group["fieldList"].length > 0
	    })
	}
	
	return customFields;
}

function $record() {
	
}

$record.getCapTypeModel = function(recordType) {
	var recTypeArr = recordType.split("/");
	if (recTypeArr.length != 4) {
    	throw "Record Type format is invalid " + recordType;
    }
	 
	var capTypeModel = new com.accela.aa.aamain.cap.CapTypeModel(recTypeArr[0], recTypeArr[1], recTypeArr[2], recTypeArr[3]);
	capTypeModel.setServiceProviderCode(aa.getServiceProviderCode());
	return capTypeModel;
}

$record.getAllAsi = function(capId, groupBySubgroup) {
	var asi = {};
	var result = $script.result(aa.appSpecificInfo.getByCapID(capId));

	for (i in result) {
		var value = result[i].getChecklistComment();
		if (value == null || value + "" == "") {
			value = "";
		}
		var asiLabel = result[i].getCheckboxDesc();
		if (groupBySubgroup) {
			var subGroupName = result[i].getCheckboxType()
			if (!asi.hasOwnProperty(subGroupName)) {
				asi[subGroupName] = {};
			}
			asi[subGroupName][asiLabel] = value
		} else {
			asi[asiLabel] = value;
		}
	}
	return asi;
}

$record.getAllAsit = function(capId) {
	var res = $script.result(aa.appSpecificTableScript.getAppSpecificTableGroupModel(capId));
	var tablesArr = res.getTablesArray().toArray();
	var tableObj = {};
	for (var i = 0; i < tablesArr.length; i++) {
		tableObj[tablesArr[i].getTableName()] = $record.asitToArray(tablesArr[i]);
	}
	
	return tableObj;
}

$record.capTypeByCustomId = function(customId) {
	var capId = $record.byCustomId(customId);
	var capType = $record.modelByCustomId(customId).getCapType();
	
	return capType;
}

$record.capTypeByRecordId = function(recordId) {
	var capId = $record.byRecordId(recordId);
	var capType = $record.modelByCustomId(customId).getCapType();
	
	return capType;
}

$record.getParents = function(capId, relationshipType) {
	if (!relationshipType) {
		relationshipType = null;
	}
	return $script.result(aa.cap.getProjectByChildCapID(capId, relationshipType, ""));
}

$record.getChildren = function(capId, recordTypes) {
	var res = $script.result(aa.cap.getChildByMasterID(capId));
	
	if (recordTypes) {
		recordTypes = $transform.arrayToObject(recordTypes);
		res = res.filter(function(child) {
			return recordTypes.hasOwnProperty(String(child.getCapType()));
		})
	}
	
	return res;
}

/*
 * This function takes the RowIndex variable into consideration
 * Possibly useful in case the table structure has change during its life time
 * */
$record.asitToArray = function(asit) {
	var arr = [];
	var rowIdxArr = asit.getRowIndex().toArray();
	var columnsArr = asit.getColumns().toArray();
	var fieldsArr = asit.getTableField().toArray();
	
	if (rowIdxArr.length == 0) {
		return [];
	}
	
	var columnIdx = 0;
	var currentRowIdx = -1;
	var currentRow = {};
	for (var w = 0; w < rowIdxArr.length; w++) {
		if (currentRowIdx != rowIdxArr[w]) {
			if (currentRowIdx != -1) {
				arr.push(currentRow);
				currentRow = {};
			}
			currentRowIdx = rowIdxArr[w];
			columnIdx = 0;
		}
		var columnName = columnsArr[columnIdx].getColumnName();
		currentRow[columnName] = fieldsArr[w]
		columnIdx++;
	}
	arr.push(currentRow);
	return arr;
}

$record.getDocuments = function(capId) {
	var arr = [];
	try {
		arr =  $script.result(aa.document.getCapDocumentList(capId, aa.getAuditID()));
	} catch (e) {
		// ignore exceptions
	}
	return arr;
}

$record.getDocumentsFormatted = function(capId) {
	var res = $record.getDocuments(capId).map(function(obj) {
		return {
			"uploadDate": obj.getFileUpLoadDate(),
			"size": parseInt(obj.getFileSize()),
			"documentNo": obj.getDocumentNo(),
			"category": obj.getDocCategory(),
			"description": obj.getDocDescription(),
			"group": obj.getDocGroup(),
			"docName": obj.getDocName(),
			"status": obj.getDocStatus(),
			"fileType": obj.getDocType(),
			"entityID": obj.getEntityID(),
			"entityType": obj.getEntityType(),
			"fileUpLoadBy": obj.getFileUpLoadBy(),
			"fileName": obj.getFileName(),
		}
	})
	
	return res;
}

$record.modelByCustomId = function(customId) {
	return $script.result(aa.cap.getCap($record.byCustomId(customId)));
}

$record.modelByRecordId = function(recordId) {
	return $script.result(aa.cap.getCap($record.byRecordId(recordId)));
}

$record.byCustomId = function(customId) {
	return $script.result(aa.cap.getCapID(customId));
}

$record.byRecordId = function(recordId) {
	if (!recordId) {
		throw "$record.byRecordId: Record ID is required";
	}
	var capIdArr = recordId.split("-");

	if (capIdArr.length != 3 && capIdArr.length != 4) {
		throw "$record.byRecordId: Record ID format is invalid " + recordId;
	}
	
	// Sometimes the ID contains the service provider code as the first part
	if (capIdArr.length == 4) {
		capIdArr.shift();
	}

	return $script.result(aa.cap.getCapID(capIdArr[0], capIdArr[1], capIdArr[2]));
}

$record.updateAsit = function(customId, tableName, rows, insert) {
	var capId = $record.byCustomId(customId);
	var tableModel = $script.result(aa.appSpecificTableScript.getAppSpecificTableModel(capId, tableName));

	var columns = tableModel.getColumns().toArray().map(function(obj){
		return obj.getColumnName()
	});

	var rowValues = aa.util.newArrayList();
	for (var w = 0; w < rows.length; w++) {
		for (var i = 0; i < columns.length; i++) {
			var columnName = columns[i];

			var value = "";
			if (rows[w].hasOwnProperty(columnName)) {
				value = rows[w][columnName];
			}
			rowValues.add(value);
		}
	}
	
	// Remove existing rows
	if (!insert) {
		tableModel.getTableField().clear();
	}
	
	tableModel.getTableField().addAll(rowValues);
	var result = aa.appSpecificTableScript.editAppSpecificTableInfos(tableModel.getAppSpecificTableModel(), capId, aa.getAuditID());
	return $script.result(result);
}

function $user() {
	
}

$user.getCurrent = function() {
	return $user.get(aa.getAuditID());
}

$user.get = function(userId) {
	return $script.result(aa.person.getUser(userId));
}

$user.getByDepartment = function(department) {
	return $script.result(aa.people.getSysUserListByDepartmentName(department));
}

$user.getByDepartmentFormatted = function(department) {
	return $user.getByDepartment(department).map(function(obj) {
		return {
			"username": obj.getUserID(),
			"name": obj.getFullName()
		}
	})
}


function $search() {
	
}

$search.records = function(module, recTypes, customFields, statusArr, getTemp) {
	var capBusiness = new com.accela.aa.aamain.cap.CapBusiness();
	var extCapSearchCondition = new com.accela.aa.aamain.cap.ExtCapSearchConditionModel();
	
	if (statusArr) {
		var statusList = aa.util.newArrayList();
		for (var i = 0; i < statusArr.length; i++) {
			statusList.add(statusArr[i]);
		}
		extCapSearchCondition.setStatuses(statusList);
	}
	
	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setParcelModel(new com.accela.aa.aamain.parcel.CapParcelModel());
	capModel.setModuleName(module);
	
	var capId = new com.accela.aa.aamain.cap.CapIDModel();
	capId.setServiceProviderCode(aa.getServiceProviderCode())

	var capTypes = aa.util.newArrayList();
	capModel.setCapID(capId);
	if (customFields) {
		// search by AND
		var asiArr = [];
		var asiModels = aa.util.newArrayList();
		
		for (var key in customFields) {
			var asiItem = new com.accela.aa.aamain.cap.AppSpecificInfoModel();
			asiItem.setCheckboxDesc(key);
			asiItem.setChecklistComment(customFields[key]);
			asiModels.add(asiItem);
		}
		
		capModel.setAppSpecificInfoGroups(asiModels);
	}

	if (recTypes) {
		for (var i = 0; i < recTypes.length; i++) {
			capTypes.add($record.getCapTypeModel(recTypes[i]));
		}
	}

	var capArrs = capBusiness.getCapsByConditions4APIs(capModel, aa.util.newQueryFormat(), (getTemp?"ALL": "COMPLETE"), capTypes, extCapSearchCondition, aa.getAuditID(), true);
	
	return capArrs;
}

function $inspection() {
	
}

$inspection.search = function(fromDate, toDate, userId) {
	var user = (userId?$user.get(userId):$user.getCurrent());
	
	var res = aa.inspection.findByInspectorDateRange(user, fromDate.toISOString(), toDate.toISOString());
	return $script.result(res);
}

$inspection.searchFormatted = function(fromDate, toDate, userId) {
	var res = $inspection.search(fromDate, toDate, userId);
	var inspArr = res.map(function(insp) {
		return $inspection.format(insp.getInspection());
	});
	
	return inspArr;
}

$inspection.getByRecordId = function(capId, getExtraDetails) {
	var res = $script.result(aa.inspection.getInspections(capId));
	var arr = [];
	
	for (var i = 0; i < res.length; i++) {
		if (getExtraDetails) {
			arr.push($inspection.getExtraDetails(res[i].getInspection()));
		} else {
			arr.push(res[i].getInspection());
		}
	}
	
	return arr;
}

// Extra details includes checklist items
$inspection.get = function(customId, inspId, getExtraDetails) {
	var capId = $record.byCustomId(customId);
	var res = $script.result(aa.inspection.getInspection(capId, inspId)).getInspection();
	
	if (getExtraDetails) {
		res = $inspection.getExtraDetails(res);
	}
	return res;
}

$inspection.getExtraDetails = function(insp) {
	var activityModel = insp.getActivity();
	var inspDao = new com.accela.aa.inspection.inspection.InspectionDAOOracle();
	
	/* the booleans are: getRequestComment, getResultComment, getCap, getPrimaryAddr, getGuideSheet, guideSheetWithItems*/
	return $java.executePrivateMethod(inspDao, "getExtraInfo4Insp", [activityModel, true, true, true, true, true, true, aa.util.newQueryFormat()])
}

$inspection.getFormatted = function(recordId, inspId, getExtraDetails) {
	var insp = $inspection.get(recordId, inspId, getExtraDetails);
	return $inspection.format(insp);
}

$inspection.format = function(insp) {
	var checklists = [];
	var guideSheets = insp.getGuideSheets();
	if (guideSheets != null) {
		checklists = guideSheets.toArray().map(function(guideSheet) {
			var checklistItems = [];
			var guideSheetItems = guideSheet.getItems();
			if (guideSheetItems != null) {
				checklistItems = guideSheetItems.toArray().map(function(item){
					return $inspection.formatChecklistItem(item);
				});
			}
			
			var checklistObj = $inspection.formatChecklist(guideSheet);
			checklistObj["checklistItems"] = checklistItems;
			return checklistObj;
		})
	}

	var inspObj = $inspection.formatInspection(insp);
	inspObj["checklists"] = checklists;
	
	return inspObj;
}

$inspection.getTranslationForChecklists = function(insp) {
	var checklists = insp["checklists"];
	var dao = com.accela.aa.inspection.guidesheet.RGuideSheetItemDAOOracleI18N();
	
	for (var i = 0; i < checklists.length; i++) {
		var checklist = checklists[i];
		var checklistItemsMap = {};
		var res = dao.getRGuideSheetItems(aa.getServiceProviderCode(), checklist["guideType"], aa.util.newQueryFormat()).toArray();
		
		for (var w = 0; w < res.length; w++) {
			if (!checklistItemsMap.hasOwnProperty(res[w].getGuideItemText())) {
				checklistItemsMap[res[w].getGuideItemText()] = res[w].getDispGuideItemText();
			}
		}
		
		if (res.length > 0) {
			checklist["dispGuideType"] = res[0].getDispGuideType();
		}
		
		checklist["checklistItems"] = checklist["checklistItems"].map(function(item) {
			if (checklistItemsMap.hasOwnProperty(item["text"])) {
				item["dispText"] = checklistItemsMap[item["text"]];
			}
			return item;
		})
	}
	
	return insp;
}

$inspection.formatInspection = function(obj) {
	var resObj = {
		"idNumber": obj.getIdNumber(),
		"group": obj.getInspectionGroup(),
		"status": obj.getInspectionStatus(),
		"type": obj.getInspectionType(),
		"recordId": obj.getCapID().getId(),
		"customId": obj.getCapID().getCustomID(),
		"inspSequenceNumber": obj.getInspSequenceNumber(),
		"activityDate": obj.getActivityDate(),
		"statusDate": obj.getInspectionStatusDate(),
		"requestDate": obj.getRequestDate(),
		"scheduledDate": obj.getScheduledDate(),
		"taskDueDate": obj.getTaskDueDate(),
	}
	
	if (obj.getInspector() != null) {
		resObj["fullName"] = obj.getInspector().getFullName(),
		resObj["userID"] = obj.getInspector().getUserID(),
		resObj["deptOfUser"] = obj.getInspector().getDeptOfUser()
 	}
	
	if (resObj["customId"] == null) {
		resObj["customId"] = $record.byRecordId(resObj["recordId"]).getCustomID();
	}
	
	return resObj;
}

$inspection.formatChecklist = function(obj) {
	var resObj = {
		"idNumber": obj.getGuidesheetSeqNbr(),
		"activityNumber": obj.getActivityNumber(),
		"dispGuideType": obj.getDispGuideType(),
		"entityType": obj.getEntityType(),
		"group": obj.getGroup(),
		"guideGroup": obj.getGuideGroup(),
		"guideType": obj.getGuideType(),
		"resId": obj.getResId()
	}
	
	return resObj;
}

$inspection.formatChecklistItem = function(obj) {
	var resObj = {
		"idNumber": obj.getGuideItemSeqNbr(),
		"checklistId": obj.getGuidesheetSeqNbr(),
		"entityType": obj.getEntityType(),
		"status": obj.getGuideItemStatus(),
		"statusGroupName": obj.getGuideItemStatusGroupName(),
		"statusVisible": obj.getGuideItemStatusVisible(),
		"text": obj.getGuideItemText(),
		"textVisible": obj.getGuideItemTextVisible(),
		"type": obj.getGuideType(),
		"isCritical": obj.getIsCritical(),
		"isRequired": obj.getIsRequired(),
		"displayOrder": obj.getGuideItemDisplayOrder(),
		"asiGroup": obj.getGuideItemASIGroupName(),
		"asiVisible": obj.getGuideItemASIGroupVisible(),
		"asitGroup": obj.getGuideItemASITableGroupName(),
		"asitVisible": obj.getGuideItemASITableGroupVisible(),
		"maxPoints": obj.getMaxPoints(),
		"score": obj.getGuideItemScore(),
		"comment": obj.getGuideItemComment(),
		"commentVisible": obj.getGuideItemCommentVisible(),
		"scoreVisible": obj.getGuideItemScoreVisible(),
		"maxPointsVisible": obj.getMaxPointsVisible()
	}
	
	return resObj;
}

function getTaskInspection(customId) {
	var childArr = [];
	try {
		childArr = $record.getChildren($record.byCustomId(customId));
	} catch (e) {
		// If there's no children a silent exception is thrown
	}
	
	if (childArr.length == 0) {
		return {};
	}

	var inspArr = $inspection.getByRecordId(childArr[0].getCapID(), true);
	
	if (inspArr.length == 0) {
		return {};
	}

	return $inspection.format(inspArr[0]);
}

$inspection.getStatusGroup = function(inspSequenceNumber) {
	var dao = new com.accela.aa.inspection.inspection.RInspResultGroupDAOOracle();
	var arr = dao.getResultByInspectionSeqNum(aa.getServiceProviderCode(), inspSequenceNumber).toArray();
	return arr;
}

$inspection.getStatusGroupFormatted = function(inspSequenceNumber) {
	var arr = $inspection.getStatusGroup(inspSequenceNumber);
	arr = arr.map(function(obj) {
		return {
			"type": obj.getResultType(),
			"value": obj.getInspResult(),
			"dispValue": obj.getDispInspResult()
		}
	})
	
	return arr;
}

$inspection.translateStatus = function(resId) {
	var dao = new com.accela.aa.inspection.inspection.RInspResultGroupDAOOracleI18N();
	return dao.getResultList(aa.getServiceProviderCode(), resId);
}

$inspection.getChecklistItemStatusGroup = function (statusGroup) {
	var cliStatusBusiness = new com.accela.aa.inspection.guidesheet.RGuideSheetItemStatusGroupBusiness();
	var arr = cliStatusBusiness.getStatusGroupStatus(aa.getServiceProviderCode(), statusGroup, "").toArray();
	
	return arr;
}

$inspection.getChecklistItemStatusGroupFormatted = function (statusGroup) {
	var arr = $inspection.getChecklistItemStatusGroup(statusGroup).map(function(obj) {
		return {
			"displayOrder": obj.getDisplayOrder(),
			"criticalScore": obj.getCriticalScore(),
			"nonCriticalScore": obj.getNonCriticalScore(),
			"dispGuideSheetItemStatus": obj.getDispGuideSheetItemStatus(),
			"guideSheetItemStatus": obj.getGuideSheetItemStatus(),
			"langId": obj.getLangId(),
			"majorViolation": obj.getMajorViolation(),
			"resGuideSheetItemStatus": obj.getResGuideSheetItemStatus(),
			"resultType": obj.getResultType(),
			"statusGroup": obj.getStatusGroup(),
			"resId": obj.getResId(),
		}
	})
	
	return arr;
}

$inspection.updateChecklists = function(inspModel) {
	var success = true;
	var errors = [];
	for (var i = 0; i < inspModel.getGuideSheets().size(); i++) {
		var res = aa.guidesheet.updateGGuidesheet(inspModel.getGuideSheets().get(i), aa.getAuditID());
		if (!res.getSuccess()) {
			success = false;
			errors.push(res.getErrorMessage());
		}
	}
	
	if (!success) {
		throw errors.join("\n");
	}
}
function $lang() { 

} 

$lang.get = function() {
	    return com.accela.i18n.I18NContext.getI18NModel().getLanguage();
}
 
$lang.set = function(lang) {
	    com.accela.i18n.I18NContext.getI18NModel().setCurrentLanguage(lang);
	    com.accela.i18n.I18NContext.getI18NModel().setLanguage(lang);
	    com.accela.aa.util.WebThreadLocal.setLanguage(lang)
} 

$lang.getI18nModel = function() {
	    return com.accela.i18n.I18NContext.getI18NModel();
} 
$lang.setI18nModel = function(model) {
	    return com.accela.i18n.I18NContext.setI18NModel(model);
} 
// Some Accela functions delete the i18n model from the session!!! which causes all sorts of problems for any functions called after
// Those functions keeps a temp copy in memory and restores it
$lang.retainModel = function() {
	    $lang.currentLangModel = $lang.getI18nModel();
} 

$lang.restoreModel = function() {
	    $lang.setI18nModel($lang.currentLangModel);
}
	
$inspection.updateChecklistsFormatted = function(insp) {
	var inspId = parseInt(insp["idNumber"]);
	var customId = insp["customId"];
	var checklists = insp["checklists"];
	
	var inspModel = $inspection.get(customId, inspId, true);
	
	checklists = checklists.map(function(checklist) {
		checklist["checklistItems"] = $transform.arrayToObject(checklist["checklistItems"], "idNumber");
		return checklist;
	})

	checklists = $transform.arrayToObject(checklists, "idNumber");
	for (var i = 0; i < inspModel.getGuideSheets().size(); i++) {
		var guidesheet = inspModel.getGuideSheets().get(i);
		var idNumber = String(guidesheet.getGuidesheetSeqNbr());
		if (checklists.hasOwnProperty(idNumber)) {
			var checklist = checklists[idNumber];
			
			for (var w = 0; w < guidesheet.getItems().size(); w++) {
				var guidesheetItem = guidesheet.getItems().get(w);
				var itemIdNumber = String(guidesheetItem.getGuideItemSeqNbr());
				if (checklist["checklistItems"].hasOwnProperty(itemIdNumber)) {
					var checklistItem = checklist["checklistItems"][itemIdNumber];
					if (!$data.nullOrEmpty(checklistItem["status"])) {
						guidesheetItem.setGuideItemStatus(checklistItem["status"]);
					}
					
					if (!$data.nullOrEmpty(checklistItem["comment"])) {
						guidesheetItem.setGuideItemComment(checklistItem["comment"]);
					}
					
					if (!$data.nullOrEmpty(checklistItem["score"])) {
						guidesheetItem.setGuideItemScore(parseInt(checklistItem["score"]));
					}
				}
			}
		}
	}
	$inspection.updateChecklists(inspModel)
}

try {
	
//	com.accela.i18n.I18NContext.getI18NModel().setClientType("V360")
//	com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
//	pm($inspection.getStatusGroupFormatted(192))
//	$inspection.getStatusGroupFormatted("IPASS", "Passenger Inspection");2211

//	com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
//	var insp = getTaskInspection("PASSP-2020-000012");
//	insp = $inspection.getTranslationForChecklists(insp)
//	pm(insp, true)
//	
//	var dao = com.accela.aa.inspection.guidesheet.RGuideSheetItemDAOOracleI18N();
//	pm(dao.getRGuideSheetItems(aa.getServiceProviderCode(), "Luggage", aa.util.newQueryFormat()));
//	$inspection.u
//	pm($search.records("Building", ["Building/Inspection/Cargo Inspection/ICARG"], {}, ["Inspection Started"], false))
//	var insp = $inspection.getFormatted("BN-2020-000011", 2067, true)
//	pm(insp, true)
//	$inspection.updateChecklistsFormatted(insp);
	
//pm(new org.mozilla.javascript.NativeJavaMethod())
	//ActivityModel activity, boolean getRequestComment,
//	boolean getResultComment, boolean getCap, boolean getPrimaryAddr, boolean getGuideSheet,
//	boolean guideSheetWithItems, QueryFormat guideSheetQueryFormat
//	pm(aa.guidesheet)
//	com.accela.aa.inspection.inspection.InspectionDAOOracle#getExtraInfo4Insp
//	var gb = new com.accela.aa.inspection.guidesheet.GGuideSheetBusiness()
//	pm(gb)
	
//	$record.getAllAsit($record.byCustomId("BN-2020-000011"))
//	var fromDate = new Date()
//	fromDate.setMonth(fromDate.getMonth() - 1)
//
//	var toDate = new Date();
//	toDate.setDate(toDate.getDate() + 1)
////	
//	pm($inspection.searchFormatted(fromDate, toDate), true);
} catch (e) {
    if (e instanceof org.mozilla.javascript.RhinoException) {
        aa.print(e.getValue());
        if (e.getScriptStackTrace()) {
            aa.print(e.getScriptStackTrace());
        }
    } else {
        if (e.rhinoException) {
            aa.print(e.rhinoException);
        }
        if (e.message) {
            aa.print(e.message);
        } else {
            aa.print(e);
        }
        if (e.stack) {
            aa.print(e.stack);
        }
    }
}