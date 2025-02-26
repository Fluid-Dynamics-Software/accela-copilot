/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_ACABASE.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: SLEIMAN
| Created at	: 07/02/2016 11:26:47
|
/------------------------------------------------------------------------------------------------------*/
/*-USER-----------DATE----------------COMMENTS----------------------------------------------------------/
 | SALIM           25/05/2016 15:28:46   Adding new methods [setCapModel,setLicenseProfessional]
 /-----END CHANGE LOG-----------------------------------------------------------------------------------*/

SCRIPT_VERSION = "3.0";
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
var globalEval = eval;

/**
 * constructor for the base page
 */
function ACABASE() {
	this.bshowMessage = true;
	this.bshowDebug = true;
	this.bcancel = false;
	this.tdebug = "";
	this.tmessage = "";
	this.asiGroups = null;
	this.asitGroups = null;
	this.capModel = null;
}

/**
 * cancel the event and set the message
 * 
 * @param message
 *            the message to set
 */
ACABASE.prototype.cancel = function(message) {
	this.bcancel = true;
	this.tmessage = message;
}
/**
 * show debug log
 */
ACABASE.prototype.showDebug = function() {
	this.bshowDebug = true;
}

/**
 * show message
 * 
 * @param message
 *            the message to show
 */
ACABASE.prototype.showMessage = function(message) {
	this.bshowMessage = true;
	this.tmessage = message;
}
/**
 * this is the main function for the execution, it should be defined in the page
 * flow script
 */
ACABASE.prototype.execute = function() {
	throw "Execute not implemented in base page"
}
/**
 * 
 * @returns the CapModel environment variable
 */
ACABASE.prototype.getCapModel = function() {
	if (this.capModel == null) {
		this.capModel = aa.env.getValue("CapModel");
	}
	return this.capModel;
}
/**
 * @param CapModel :
 *            the updated capModel sets the environment CapModel
 */
ACABASE.prototype.setCapModel = function(capModel) {
	if (capModel == null) {
		aa.env.setValue("CapModel", this.getCapModel());
	} else {
		aa.env.setValue("CapModel", capModel);
	}
}
/**
 * 
 * @returns gets the ASI field value
 */
ACABASE.prototype.getAppSpecific = function(itemName) {
	return this.getFieldValue(itemName);
}
/**
 * 
 * @returns sets the ASI field value
 */
ACABASE.prototype.editAppSpecific = function(fieldName, value) {
	this.setFieldValue(fieldName, value);
}
/**
 * 
 * @param lp:
 *            license Professional
 * @result : license Professional attached to the CapModel
 */
ACABASE.prototype.setLicenseProfessional = function(lp) {
	var thisCapModel = this.getCapModel();
	thisCapModel.setLicenseProfessionalModel(lp);
}

/**
 * 
 * @returns gets the ASI field value from App Specific Info Groups
 */
ACABASE.prototype.getFieldValue = function(fieldName) {
	var val = null;
	var asiGroups = this.getAsiGroups();
	var iteGroups = asiGroups.iterator();
	while (iteGroups.hasNext()) {
		var group = iteGroups.next();
		var fields = group.getFields();
		if (fields != null) {
			var iteFields = fields.iterator();
			while (iteFields.hasNext()) {
				var field = iteFields.next();
				if (fieldName == field.getCheckboxDesc()) {
					val = field.getChecklistComment();
					break;
				}
			}
		}
	}
	return val;
}

/**
 * 
 * @returns the ASI groups of the CapModel of this page flow
 */
ACABASE.prototype.getAsiGroups = function() {
	if (this.asiGroups == null) {
		this.asiGroups = this.getCapModel().getAppSpecificInfoGroups();
	}
	return this.asiGroups;
}
/**
 * 
 * @returns the ASIT groups of the CapModel of this page flow
 */
ACABASE.prototype.getAsitGroups = function() {
	if (this.asitGroups == null) {
		this.asitGroups = this.getCapModel().getAppSpecificTableGroupModel();
	}
	return this.asitGroups;
}
/**
 * set ASI field value
 * 
 * @param fieldName
 *            the asi field name
 * @param value
 *            the value to set
 */
ACABASE.prototype.setFieldValue = function(fieldName, value) {

	var asiGroups = this.getAsiGroups();

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
					break;
				}
			}
		}
	}
	this.asiGroups = asiGroups;
	return asiGroups;
}

/**
 * set ASI drop down field values ( this one is useful in case you have a
 * dynamic dropdown list);
 * 
 * @param fieldName
 *            the drop down field name
 * @param objValues
 *            the object of values. ex: var obj={}. obj["key"]="value";
 */
ACABASE.prototype.setDropdownValues = function(fieldName, objValues) {

	var value = aa.util.newArrayList();
	for ( var val in objValues) {
		var model = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.RefAppSpecInfoDropDownModel").getOutput();
		model.setAttrValue(objValues[val]);
		model.setResAttrValue(objValues[val]);
		model.setFieldLabel(fieldName);
		value.add(model);
	}

	var asiGroups = this.getAsiGroups();

	var iteGroups = asiGroups.iterator();
	while (iteGroups.hasNext()) {
		var group = iteGroups.next();
		var fields = group.getFields();
		if (fields != null) {
			var iteFields = fields.iterator();
			while (iteFields.hasNext()) {
				var field = iteFields.next();
				if (fieldName == field.getCheckboxDesc()) {
					field.setValueList(value);
					group.setFields(fields);
				}
			}
		}
	}
	this.asiGroups = asiGroups;

}

ACABASE.prototype.BindASITDropDown = function(dropDownList,tableName,fieldName) {
	var capModel = this.getCapModel();
	var asitGroups = capModel.getAppSpecificTableGroupModel();
	var dropdownValue = aa.util.newArrayList();
	if (dropDownList != null) {
		for (i in dropDownList) {
			var dropDownModel = aa.proxyInvoker.newInstance(
					"com.accela.aa.aamain.cap.RefAppSpecInfoDropDownModel")
					.getOutput();
			dropDownModel.setAttrValue(dropDownList[i][0]);
			dropDownModel.setResAttrValue(dropDownList[i][1]);
			dropDownModel.setFieldLabel(fieldName);
			dropdownValue.add(dropDownModel);
		}
	}

	asitGroups = setDropdownValues(fieldName,
			tableName, asitGroups, dropdownValue);
	capModel.setAppSpecificTableGroupModel(asitGroups);
	aa.env.setValue("CapModel", capModel);
}
/**
 * 
 * @param tableName Name of the ASIT
 * @param fieldName Name of the field
 * @param asitGroups ASIT Group from CapModel
 * @param value RefAppSpecInfoDropDownModel Array List
 * @returns
 */
function setDropdownValues(fieldName, tableName, asitGroups, value) {
	java.lang.System.out.println("welcome kabeel setDropdownValues");
	if (asitGroups == null) {
		return null;
	}

	var tablesMap = asitGroups.getTablesMap();
	var appSpecificTableModelArray = tablesMap.values().iterator();
	var keys = tablesMap.keySet().toArray();
	var newTablesMap = aa.util.newHashMap();

	if (appSpecificTableModelArray == null) {
		return null;
	}
	java.lang.System.out.println("welcome kabeel setDropdownValues::1");
	var countASITColumns = 0;
	while (appSpecificTableModelArray.hasNext()) {
		java.lang.System.out.println("welcome kabeel setDropdownValues::2");
		var appSpecificTableModel = appSpecificTableModelArray.next();
		if(appSpecificTableModel.getTableName() != tableName) {
			newTablesMap.put(keys[countASITColumns], appSpecificTableModel);
			countASITColumns++;
			continue;
		}
			

		var iteColumns = appSpecificTableModel.getColumns().iterator();
		var newColumns = aa.util.newArrayList();
		
		while (iteColumns.hasNext()) {
			java.lang.System.out.println("welcome kabeel setDropdownValues::3");
			var columns = iteColumns.next();
			java.lang.System.out.println("welcome kabeel olumnName:" + columns.getColumnName() + ", fieldName:" + fieldName);
			if (columns.getColumnName() == fieldName) {				
				columns.setValueList(value);
				java.lang.System.out.println("welcome kabeel setDropdownValues::4");
			}

			newColumns.add(columns);
		}

		appSpecificTableModel.setColumns(newColumns);
		newTablesMap.put(keys[countASITColumns], appSpecificTableModel);
		countASITColumns++;
	}

	asitGroups.setTablesMap(newTablesMap);
	return asitGroups;
}
/**
 * Gets the ASI Tables on the record in a hashmap with the table name as the key
 * and the table value array as the value
 */
ACABASE.prototype.getASITables = function() {

	var tableMap = aa.util.newHashMap();
	var gm = this.getAsitGroups();

	var ta = gm.getTablesMap();
	var tai = ta.values().iterator();
	while (tai.hasNext()) {
		var tsm = tai.next();

		if (tsm.rowIndex.isEmpty())
			continue;
		var tempObject = new Array;
		var tempArray = new Array;
		var tn = tsm.getTableName();

		var tsmfldi = tsm.getTableField().iterator();
		var tsmcoli = tsm.getColumns().iterator();
		var numrows = 1;
		while (tsmfldi.hasNext()) {
			if (!tsmcoli.hasNext()) {
				var tsmcoli = tsm.getColumns().iterator();
				tempArray.push(tempObject);
				var tempObject = new Array;
				numrows++
			}
			var tcol = tsmcoli.next();
			var tval = tsmfldi.next();
			tempObject[tcol.getColumnName()] = tval
		}
		tempArray.push(tempObject);
		tableMap.put(tn, tempArray);
	}

	return tableMap;
}
/**
 * 
 * @returns the Contact group of the CapModel of this page flow
 */
ACABASE.prototype.getContacts = function() {
	return this.getCapModel().getContactsGroup();
}

/**
 * 
 * add contact to the pageflow contacts
 */
ACABASE.prototype.addContact = function(contact) {
	var contacts = this.getContacts();
	
	contact.setCapID(this.getCapModel().getCapID());
	contact.setComponentName("Applicant");
	
	contacts.add(contact);
}

/**
 * internal function to be executed after the execution
 */
ACABASE.prototype.afterExecute = function() {
	var capModel = this.getCapModel();
	capModel.setAppSpecificInfoGroups(this.getAsiGroups());
	capModel.setAppSpecificTableGroupModel(this.getAsitGroups());
	//capModel.setContactsGroup(this.getContacts());
	
	aa.env.setValue("CapModel", capModel);

	if (this.tdebug.indexOf("**ERROR") > 0) {
		aa.env.setValue("ErrorCode", "1");
		aa.env.setValue("ErrorMessage", this.tdebug);
	} else {
		if (this.bcancel) {
			aa.env.setValue("ErrorCode", "-2");
			if (this.bshowMessage)
				aa.env.setValue("ErrorMessage", this.tmessage);
			if (this.bshowDebug)
				aa.env.setValue("ErrorMessage", this.tdebug);
		} else {
			aa.env.setValue("ErrorCode", "0");
			if (this.bshowMessage)
				aa.env.setValue("ErrorMessage", this.tmessage);
			if (this.bshowDebug)
				aa.env.setValue("ErrorMessage", this.tdebug);
		}
	}
}

/**
 * internal function to fill dynamically a specific table on ACA 
 */
ACABASE.prototype.addASITable4ACAPageFlowFix = function(
		destinationTableGroupModel, tableName, tableValueArray) {
	var ta = destinationTableGroupModel.getTablesMap().values();
	var tai = ta.iterator();
	var found = false;
	var hasRows = false;

	while (tai.hasNext()) {
		var tsm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
		if (tsm.getTableName() == tableName) {
			found = true;
			break;
		}
	}
	if (!found) {
		logDebug("cannot update asit for ACA, no matching table name");
		return false;
	}

	var fld = aa.util.newArrayList(); // had to do this since it was coming up
	// null.
	var fld_readonly = aa.util.newArrayList(); // had to do this since it was
	// coming up null.
	var i = -1; // row index counter

	for (thisrow in tableValueArray) {

		var col = tsm.getColumns()
		var coli = col.iterator();

		while (coli.hasNext()) {
			var colname = coli.next();
			var args = new Array(tableValueArray[thisrow][colname
					.getColumnName()].fieldValue, colname);
			var fldToAdd = aa.proxyInvoker.newInstance(
					"com.accela.aa.aamain.appspectable.AppSpecificTableField",
					args).getOutput();
			fldToAdd.setRowIndex(i);
			fldToAdd.setFieldLabel(colname.getColumnName());
			fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
			fldToAdd.setReadOnly(tableValueArray[thisrow][colname
					.getColumnName()].readOnly.equals("Y"));
			fld.add(fldToAdd);
			fld_readonly
					.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);

		}

		i--;
	}
	tsm.setTableFields(fld); // MODIFIED
	tsm.setReadonlyField(fld_readonly); // set readonly field
	tssm = tsm;
	return destinationTableGroupModel;

}

/**
 * internal function to fill dynamically a dropdown on ACA 
 */
ACABASE.prototype.setASIDropdownValues = function(fieldName, objValues) {

	try {

		var capModel = this.getCapModel();
		var value = aa.util.newArrayList();
		for ( var val in objValues) {
			var model = aa.proxyInvoker.newInstance(
					"com.accela.aa.aamain.cap.RefAppSpecInfoDropDownModel")
					.getOutput();
			model.setAttrValue(objValues[val][0]);
			model.setResAttrValue(objValues[val][1]);
			model.setFieldLabel(fieldName);
			value.add(model);
		}

		var asiGroups = capModel.getAppSpecificInfoGroups();

		var iteGroups = asiGroups.iterator();
		while (iteGroups.hasNext()) {
			var group = iteGroups.next();
			var fields = group.getFields();
			if (fields != null) {
				var iteFields = fields.iterator();
				while (iteFields.hasNext()) {
					var field = iteFields.next();
					if (fieldName == field.getCheckboxDesc()) {
						field.setValueList(value);
						group.setFields(fields);
					}
				}
			}
		}
		return asiGroups;
	} catch (e) {
		this.showMessage("ERROR RSA:", e + "");
	}
}


/**
 * internal function, should be called after the implementation in the page flow
 * script
 */
function run() {
	try {
		var pfs = new ACABASE();
		pfs.execute();
		pfs.afterExecute();

	} catch (e) {
		aa.env.setValue("ErrorCode", "1");
		aa.env.setValue("ErrorMessage", e + "");
	}
}