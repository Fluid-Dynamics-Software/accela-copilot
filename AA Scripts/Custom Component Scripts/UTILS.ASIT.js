/*------------------------------------------------------------------------------------------------------/
| Program		: UTILS.ASIT.js
| Event			: 
|
| Version		: 1.0
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 30/09/2022 09:46:49
|
| 	By: Hisham El-Fangary
|	Date: 30/09/2022
|	Description: This class simplifies working with ASIT tables for easy retrieval, editing, deleting and filteration of data
|	
|	Usage:
|	--------------------------------------------------------------------------------------------
|
|	// For ACA Pageflows (TMP CAPS), you can initialize the ASIT Object without passing any parameters
|
|			var asit = new UTILS.ASIT();
|	
|	// For Real Caps, you have to pass either an altId, or a capId Object:
|
|			var asit = new UTILS.ASIT({altId: 'DWME-2017-000005'});
|	
|	// or
|
|			var capID = aa.cap.getCapIDModel('DWME-2017-000005').getOutput();
|			var asit = new UTILS.ASIT({capId: capID});
|
|	// You can also directly initialize the ASIT Object with the table subgroup name you want to target:
|
|			var asit = new UTILS.ASIT({altId: 'DWME-2017-000005', tableName: "TABLE SUBGROUP NAME"});
|
|	// Alternatively, if you want to loop over the available ASIT tables in a certain Cap, 
|	// you can initialize the object then retrieve the List of available tables to choose from
|	// Then you can Select a table by setting it's name from the list to target each table individually
|	
|			var asit = new UTILS.ASIT({altId: 'DWME-2017-000005'});
|			var tables = asit.getTableNames()	// Returns Array of subgroup names: ["TABLE SUBGROUP NAME 1", "TABLE SUBGROUP NAME 2"]
|			for (var t in tables){
|				asit.setTable(tables[t]);
|				// ........ do whatever you need to do for selected table
|				var rowsCount = asit.rowsCount;
|			}
|
|	Getting Values By Looping through rows
|	Example 1: 	The following example prints out all Trade Name fields from table:TRADE NAME REGISTRATIONS from a Real Cap with altId: "PROC-2012-000312"
|	---------------------------------------------------------------------------------------------
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			var rowsCount = asit.rowsCount;
|			while (asit.nextRow()){
|				var tradeName = asit.getValue("Trade Name");
|				var rowIndex = asit.getRowIndex();				
|				aa.print("tradeName: " + tradeName + ", at row Index: " + rowIndex);
|			}
|			aa.print("Total Rows: " + rowsCount);
|
|
|	Filtering By Field Values
|	Example 2: 	The following example retrieves all Trade Name fields from table:TRADE NAME REGISTRATIONS
| 				with the License Number = 11223344 from a Real Cap with altId: "PROC-2012-000312"
|	---------------------------------------------------------------------------------------------
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			asit.addFilter("License Number", "11223344");			// addFilter() is additive, so you can add unlimited filters by running the addFilter() method to add a new filter.
|			asit.addFilter("Completed", "Y");				 
|			var count = asit.rowsCount;								// The total Number of Rows in the table
|			var filteredCount = asit.filteredRowsCount;				// The Number of Rows of the Results in the table after being filtered
|			while (asit.nextRow()){
|				var licenseNumber = asit.getValueStr("License Number");	// getValueStr() is the same as getValue() except the result is always a string. for null or undefined values, an empty string is returned.
|				aa.print("licenseNumber: " + licenseNumber);
|			}
|
|
|	Editing/Updating Field Values
|	Example 3:	The Following Example Edits 3 fields on the 3rd row (index = 2), and then saves when finished.
|				Note: You have to save when editing/deleting/adding, otherwise your changes will be lost. 
|	----------------------------------------------------------------------------------------------
|
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			asit.goToRow(2)
|			asit.editField('Date From', '01/01/2000');
|			asit.editField('Date To', 	'10/10/2018');
|			asit.editField('Full Name', 'Jason Sudeikis');
|			asit.save();
|
|
|	Adding Rows
|	Example 4:	The Following Example Adds rows between the 3rd and fourth row
|	----------------------------------------------------------------------------------------------
|
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			asit.goToRow(2);
|			asit.addRows([{								// addRows() takes an array of objects with fieldname/value pairs as properties. You can only specify the fields you want to fill, and any field names you don't include, will be added with an empty value/null
|				'License Number': 9087656, 
|				'Full Name', 'Jason Sudeikis'
|			},
|			{							
|				'License Number': 124564, 
|				'Full Name', 'Forlem Sudoku'
|			}]);	
|			asit.save();
|
|	Deleting Rows
|	Example 5:	The Following Example Deletes the 3rd row (index = 2)
|	----------------------------------------------------------------------------------------------
|
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			asit.goToRow(2);
|			asit.deleteRow();
|			asit.save();
|
|	Delete All Rows from table
|	Example 6:	The Following Example Deletes All Rows from a table
|	----------------------------------------------------------------------------------------------
|
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			asit.deleteRows();
|			asit.save();
|	
|
|	Get Mulilanguage Value from a Drop Down:
|	Example 7:	The Following Example Gets The Selected Arabic Value of the Country Drop Down
|	----------------------------------------------------------------------------------------------
|
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			var rowsCount = asit.rowsCount;
|			while (asit.nextRow()){
|				var country = asit.getValue('Country', 'ar_AE');
|				aa.print("Country: " + country);
|			}
|
|	Getting a JSON string or Object of values
|	Example 8:	The Following Example Gets a JSON string and an object literal representing the first row (index = 0)
|	----------------------------------------------------------------------------------------------
|
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			var row2 = asit.getRow(0);			// Result [Object]: {'License Number': 9087656, 'Full Name', 'Jason Sudeikis'}
|			var row2JSON = asit.getRowJSON(0);		// Result [String]: "{'License Number': 9087656, 'Full Name', 'Jason Sudeikis'}"
|	
|
|	Getting a JSON string or an Object Literal of the entire table
|	Example 9:	The Following Example Gets a JSON string and an object literal of the entire table
|	----------------------------------------------------------------------------------------------
|
|			var asit = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			var allRows = asit.getRows();		// Result [Array]: [{'License Number': 9087656, 'Full Name', 'Jason Sudeikis'}, {'License Number': 9087656, 'Full Name', 'Jason Sudeikis'}]
|			var allRowsJSON = asit.getRowsJSON();	// Result [String]: "[{'License Number': 9087656, 'Full Name', 'Jason Sudeikis'}, {'License Number': 9087656, 'Full Name', 'Jason Sudeikis'}]"
|	
|
|	Cloning an ASIT table from 1 record to the other
|	Example 10: The following clones the values from 1 ASIT table and copies it to another using getRows() and addRows()
|	----------------------------------------------------------------------------------------------
|
|			var asit1 = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			var allRows = asit1.getRows();	
|				
|			var asit2 = new UTILS.ASIT({altId: "UTRG-2018-000011", tableName: "PRIMARY"});
|			asit2.addRows(allRows);
|			asit2.save();
|
|
|	Debugging using getLog()
|	Example 10: The following clones the values from 1 ASIT table and copies it to another using getAllRows() and addRows(), and then prints the log.
|	----------------------------------------------------------------------------------------------
|
|			var asit1 = new UTILS.ASIT({altId: "PROC-2012-000312", tableName: "TRADE NAME REGISTRATIONS"});
|			var allRows = asit1.getRows();	
|				
|			var asit2 = new UTILS.ASIT({altId: "UTRG-2018-000011", tableName: "PRIMARY"});
|			asit2.addRows(allRows);
|			asit2.save();
|			aa.print(asit2.getLog());	
|
|
|	Version 1.0:
| 
| ----------------------------------------------------------------------------------------------------*/

if (!UTILS){
	function UTILS () {
		
	}
}

UTILS.ASIT = function(config){ 				// Config Object {capId: [capIdModel], altId: [String], tableName: [String]}
	this.config = config;
	this._log = '';
	this.virtualASIT = [];
	this.disableLog = false;
	this.init();
	this.initSaveState();
};
//CONSTANTS
UTILS.ASIT.TMPCAP = 1;
UTILS.ASIT.REALCAP = 2;

UTILS.ASIT.ASB = 1;
UTILS.ASIT.ASA = 2;
UTILS.ASIT.CTRCA = 3

UTILS.ASIT.prototype.init = function(){
	this.tables = new Array();
	this.tableNames = new Array();
	this.groupCode = '';
	
	this.setCapId();
	this.setCapModel();
	try{
		var asitDefinition = UTILS.ASIT.getASITDefinition(this.recordType);
		this.groupCode = asitDefinition.groupCode;
		this.tables = asitDefinition.tables;		
		this.setTableNames();
	}catch(err){
		this.log('[UTILS.ASIT Object] Error: Cannot get ASIT Definition: ' + err)
		throw this.getLog();
	}
	
	if (this.config.tableName){
		this.tableName = this.config.tableName
		this.setTable(this.tableName);
	}
};

UTILS.ASIT.prototype.log = function (msg, msg2){
	if (this.disableLog){
		return;
	}
	if (this._log){
		this._log += '\n'
	}
	this._log += msg;
	if (msg2){
		this._log += " | " + msg2;
	}
};

UTILS.ASIT.prototype.getLog = function (){
	logDebug(this._log);
	return this._log;
};

UTILS.ASIT.prototype.setCapId = function(){
	if (this.config.altId){
		this.altId = this.config.altId;
		try{
			this.capId = aa.cap.getCapID(this.altId).getOutput();			
		}catch(err){
			this.log('[UTILS.ASIT Object] Error finding altId: ' + this.altId + '. Error: ' + err)
			throw this.getLog();
		}
		if (!this.capId){
			this.log('[UTILS.ASIT Object] Error finding altId: ' + this.altId + '. Error: ' + err)
			throw this.getLog();
		}
	}else if (this.config.capId){
		this.capId = this.config.capId;
	}
};
UTILS.ASIT.prototype.setCapModel = function(){
	if (!this.capId){
		this.setCapId();
	}
	
	// Get Real Cap Model
	if (this.capId){
		this.typeOfCap = UTILS.ASIT.REALCAP;
		this.event = UTILS.ASIT.CTRCA;
		this.useEnvironmentVariable = false;
		
		try{
			this.capModel = aa.cap.getCap(this.capId).getOutput().getCapModel();
			this.recordType = this.capModel.getCapType();		
			this.tableGroupModel = this.capModel.getAppSpecificTableGroupModel();			
		}catch(err){
			this.log('[UTILS.ASIT Object] Error retrieving capModel from capId: ' + this.capId,'Error: ' + err)
			throw this.getLog();
		}
	} else {
	// Get Environment Variable
		this.typeOfCap = UTILS.ASIT.TMPCAP;
		this.useEnvironmentVariable = true;
		
		try{
			this.capModel = aa.env.getValue("CapModel");
			if (typeof capModel.getAppSpecificTableGroupModel == 'function') {			
				// Application Submit After
				this.event = UTILS.ASIT.ASA;
			}else{
				// Application Submit Before
				this.event = UTILS.ASIT.ASB;
			}
			this.recordType = this.capModel.getCapType();		
		}catch(err){
			this.log("[UTILS.ASIT Object] Environment Variable: Record Type Determination Error. ", err);
			throw this.getLog();
		}
	}
};



UTILS.ASIT.getTableNames = function(capType, language){	// language is optional, by default it is en-US
	var definition = UTILS.ASIT.getASITDefinition(capType);
	var tables = definition.tables;
	if (tables){
		for (var t in tables){
			if (tables.hasOwnProperty(t)){
				if (language == 'ar-AE'){
					tableNames.push(tables[t].translation);
				}else{
					tableNames.push(t)
				}
			}
		}
	}else{
		this.log('[UTILS.ASIT Object] Please run UTILS.ASIT.getASITDefinition(recordType) first to retrieve table Definition.');
		throw this.getLog();
	}
	return tableNames;
};

UTILS.ASIT.prototype.getTableNames = function(language){	// language is optional, by default it is en-US
	var tableNames = [];
	if (this.tables){
		for (var t in this.tables){
			if (this.tables.hasOwnProperty(t)){
				if (language == 'ar-AE'){
					tableNames.push(this.tables[t].translation);
				}else{
					tableNames.push(t)
				}
			}
		}
	}else{
		this.log('[UTILS.ASIT Object] Please run UTILS.ASIT.getASITDefinition(this.recordType) first to retrieve table Definition.');
		throw this.getLog();
	}
	return tableNames;
};

UTILS.ASIT.prototype.setTableNames = function(){
	this.tableNames = []
	if (this.tables){
		for (var t in this.tables){
			if (this.tables.hasOwnProperty(t)){
				this.tableNames.push(t);
			}
		}
	}else{
		this.log('[UTILS.ASIT Object] Please run UTILS.ASIT.getASITDefinition(this.recordType) first to retrieve table Definition.');
		throw this.getLog();
		
	}
};

UTILS.ASIT.prototype.initSaveState = function(){
	// Initialize Save State
	this.savedRowIndex = -1;
	this.savedFilteredRowIndexes = [];
	this.savedFilteredRowIndexesIndex = -1;	
	this.savedFilters = [];
};


UTILS.ASIT.getASITDefinition = function (capType) {
	var servProvCode = "";
	try{
		servProvCode = aa.getServiceProviderCode();
	}catch(err){
		this.log("Couldn't get Service Provider Code. Proceeding without. Please note that in systems with multiple agencies this might cause problems.");
	}
	var asitStructure = {}
	if (capType){
		var capTypeArr = String(capType).split("/");
		if (capTypeArr.length == 4){
			var sql = " SELECT  " + 
			 " 	Isnull(l.template_code, r.r1_checkbox_code) AS GROUP_CODE,   " + 
			 " 	Isnull(l.template_type, r.r1_checkbox_type) AS SUBGROUP_NAME,   " + 
			 " 	ISNULL(groupEN.alternative_label, fieldNameEN.R1_CHECKBOX_TYPE) AS SUBGROUP_ALIAS_EN,   " + 
			 " 	ISNULL(groupAR.alternative_label, fieldNameAR.R1_CHECKBOX_TYPE) AS SUBGROUP_ALIAS_AR,   " + 
			 " 	r.r1_checkbox_desc AS FIELDNAME,   " + 
			 " 	ISNULL(ISNULL(l.alternative_label, fieldNameEN.R1_CHECKBOX_DESC),  r.r1_checkbox_desc)       AS ALTERNATIVE_LABEL_EN, " + 
			 " 	ISNULL(ISNULL(ISNULL(ISNULL(groupAR.alternative_label, fieldNameAR.R1_CHECKBOX_DESC), l.alternative_label), fieldNameEN.R1_CHECKBOX_DESC_ALIAS), fieldNameEN.R1_CHECKBOX_DESC)     AS ALTERNATIVE_LABEL_AR,   " + 
			 " 	r.r1_checkbox_ind AS FIELD_TYPE, " + 
			 " 	SD.BIZDOMAIN, " + 
			 " 	r.R1_ATTRIBUTE_VALUE_REQ_FLAG REQUIRED_FLAG,  " + 
			 " 	r.r1_display_order DISPLAY_ORDER,   " + 
			 " 	r.r1_group_display_order AS GRP_ORDER,  " + 
			 " 	r.vch_disp_flag,   " + 
			 " 	r.R1_ATTRIBUTE_VALUE AS DEFAULT_VALUE   " + 
			 " FROM [accela].[dbo].[R3APPTYP] app   " + 
			 " LEFT JOIN  [r2chckbox] r   " + 
			 " 	ON app.R1_CHCKBOX_CODE = r.R1_CHECKBOX_CODE " + 
			 " 	AND app.REC_STATUS = 'A'  " + 
			 " 	AND r.REC_STATUS = 'A' " + 
			 "  AND app.SERV_PROV_CODE = r.SERV_PROV_CODE " +
			 " 	AND r.R1_CHECKBOX_GROUP  = 'FEEATTACHEDTABLE' " + 
			 " LEFT JOIN XBIZDOMAIN_DDLIST SD " + 
			 " 	ON SD.LEVEL1 = r.r1_checkbox_code " + 
			 " 	AND SD.LEVEL2 = r.r1_checkbox_type " + 
			 " 	AND SD.LEVEL4 = r.r1_checkbox_desc " + 
			 " 	AND SD.REC_STATUS = 'A' " + 
			 "  AND SD.SERV_PROV_CODE = r.SERV_PROV_CODE " + 
			 " LEFT JOIN [R2CHCKBOX_I18N] fieldNameEN   " + 
			 "  	ON r.RES_ID = fieldNameEN.RES_ID  " + 
			 "   	AND r.SERV_PROV_CODE = fieldNameEN.SERV_PROV_CODE  " + 
			 " 	AND fieldNameEN.LANG_ID = 'en_US'  " + 
			 " LEFT JOIN [R2CHCKBOX_I18N] fieldNameAR   " + 
			 " 	ON r.SERV_PROV_CODE = fieldNameAR.SERV_PROV_CODE   " + 
			 " 	AND r.res_id = fieldNameAR.res_id    " + 
			 " 	AND fieldNameAR.LANG_ID = 'ar_AE'   " + 
			 " LEFT JOIN [rtemplate_layout_config] l   " + 
			 " 	ON r.SERV_PROV_CODE = l.SERV_PROV_CODE   " + 
			 " 	  AND r.r1_checkbox_code = l.template_code   " + 
			 " 	  AND r.r1_checkbox_type = l.template_type   " + 
			 " LEFT JOIN [rtemplate_layout_config_i18n] groupEN   " + 
			 " 	ON l.res_id = groupEN.res_id   " + 
			 " 	  AND l.serv_prov_code = groupEN.serv_prov_code   " + 
			 " 	  AND l.rec_status = 'A'   " + 
			 " 	  AND groupEN.lang_id = 'en_US'   " + 
			 " LEFT JOIN [rtemplate_layout_config_i18n] groupAR    " + 
			 " 	  ON l.res_id = groupAR.res_id    " + 
			 " 	  AND l.serv_prov_code = groupAR.serv_prov_code   " + 
			 " 	  AND l.rec_status = 'A'    " + 
			 " 	  AND groupAR.lang_id = 'ar_AE'   " + 
			 " WHERE	r.REC_STATUS = 'A' " + 
			 " 	AND	app.[R1_PER_GROUP] = '"+capTypeArr[0]+"' " + 
			 " 	AND	app.[R1_PER_TYPE] = '"+capTypeArr[1]+"' " + 
			 " 	AND	app.[R1_PER_SUB_TYPE] = '"+capTypeArr[2]+"' " + 
			 " 	AND	app.[R1_PER_CATEGORY] = '"+capTypeArr[3]+"' ";
			if (servProvCode){
				sql += " 	AND	app.SERV_PROV_CODE = '"+servProvCode+"' ";
			}
			sql += "  ORDER BY GRP_ORDER,DISPLAY_ORDER ";
			var results = UTILS.ASIT.executeQuery(sql);
			for (var r in results){
				var row = results[r];
				if (r==0){
					asitStructure.groupCode = row["GROUP_CODE"];
					asitStructure.tables = {}
				}
				if (!asitStructure.tables[row["SUBGROUP_NAME"]]){
					asitStructure.tables[row["SUBGROUP_NAME"]] = {
						name: row["SUBGROUP_NAME"],
						label: row["SUBGROUP_ALIAS_EN"],
						translation: row["SUBGROUP_ALIAS_AR"],
						order: row["GRP_ORDER"],
						fields:{}
					};
				}
				asitStructure.tables[row["SUBGROUP_NAME"]].fields[row["FIELDNAME"]] = {
					name: row["FIELDNAME"],
					label: row["ALTERNATIVE_LABEL_EN"],
					translation: row["ALTERNATIVE_LABEL_AR"],
					type: row["FIELD_TYPE"],
					standardChoice: row["BIZDOMAIN"],
					required: row["REQUIRED_FLAG"]=="Y"?true:false,
					aca: row["vch_disp_flag"],
					defaultValue: row["DEFAULT_VALUE"],
					order: row["DISPLAY_ORDER"]
				}
			}
			return asitStructure;
		}else{
			this.log("Please Supply a full 4 level Cap Type")
			throw this.getLog();
		}
	}else{
		this.log("Please Supply a full 4 level Cap Type")
		throw this.getLog();		
	}
};

UTILS.ASIT.prototype.setTable = function (tableName) {
	
	if (!tableName){
		this.log('[UTILS.ASIT Object] Please provide a table(subgroup) name: for capId: ' + this.capId + '. Error: ' + err);
		throw this.getLog();
	}else{
		// All tablenames are Uppercase
		this.tableName = String(tableName).toUpperCase().trim();
	}
	
	var useEnvironmentVariable = (this.typeOfCap == UTILS.ASIT.TMPCAP);
	var tableName = this.tableName;
	var capID = this.capId;
	try{
		if (useEnvironmentVariable){
			// Application Submit After
			if (this.event == ASIT.ASA) {			
				this.tableGroupModel =  capModel.getAppSpecificTableGroupModel();
				
				var ta = this.tableGroupModel.getTablesMap();
				var tai = ta.values().iterator();	
			}else{
			// Application Submit Before

				// Try to get the AppSpecificTableGroupModel directly from the env
				var gm = aa.env.getValue("AppSpecificTableGroupModel");			
				var gmItem = gm;
				if (gm != null && typeof(gm).size != "undefined" && gm.size() > 0) {
					gmItem = gm.get(0);
				} else {
					gmItem = gm;
				}

				if ( gmItem.length ) {
					if (gmItem.length()==0){
						gmItem = capModel.getAppSpecificTableGroupModel();		
					}
				}
				this.tableGroupModel = gmItem;
				
				if (null != gmItem && gmItem != "") {
					var ta = gmItem.getTablesMap().values();
					var tai = ta.iterator();
				}				
			}
		}else{
			if (this.capId){
				var ASITbyName = aa.appSpecificTableScript.getAppSpecificTableModel(this.capId, this.tableName).getOutput();
				
				try{	
					this.tableGroupModel = this.capModel.getAppSpecificTableGroupModel();
				}catch(err){
					this.log("[UTILS.ASIT Object] " + err);
					throw this.getLog();
				}
			}else{
				return false;
			}
		}
		if (!useEnvironmentVariable){
			
			var tsm = ASITbyName;
			var tn = tsm.getTableName();
			var tsmfldi = tsm.getTableField().iterator();
			var tsmcoli = tsm.getColumns().iterator();

			this.colNames = new Array();
			this.columns = new Array();
			this.fieldsValues=new Array();
			this.fieldsCount = 0;
			this.rowsCount = 0;	
			this.rowIndex = -1;
			this.fieldIndex = -1;			
			this.filteredRowIndexes = new Array();
			this.filteredRowIndexesIndex = -1;		
			this.tableModel = tsm;
			this.ASIT = this.tableGroupModel;
			var tcol;
			var tval;				
			while (tsmcoli.hasNext()){
				tcol = tsmcoli.next();
				this.colNames.push(String(tcol.getColumnName()).trim());
				this.columns.push(tcol);
			}		
			this.colCount = this.colNames.length;
			while (tsmfldi.hasNext()){
				tval = tsmfldi.next();
				this.fieldsValues.push(tval);
			}
			this.fieldsCount = this.fieldsValues.length;
			this.rowsCount = (this.fieldsCount/this.colCount);

		}else{

			while (tai.hasNext())
			{
				var tsm = tai.next();
				var tn = tsm.getTableName();
				
				this.tables.push(tsm);
				this.tableNames.push(tn);
				
				if(tn==tableName || tableName == ""){
					if (tsm.getTableField()){
						var tsmfldi = tsm.getTableField().iterator();						
					}
					var tsmcoli = tsm.getColumns().iterator();
					
					this.colNames = new Array();
					this.columns = new Array();
					this.fieldsValues=new Array();
					this.fieldsCount = 0;
					this.rowsCount = 0;	
					this.rowIndex = -1;
					this.filteredRowIndexes = new Array();
					this.filteredRowIndexesIndex = -1;		
					this.tableModel = tsm;
					var tcol;
					var tval;
		
					while (tsmcoli.hasNext()){
						tcol = tsmcoli.next();
						this.colNames.push(String(tcol.getColumnName()).trim());
						this.columns.push(tcol);
						//aa.debug("tcol.getColumnName()"+ tcol.getColumnName());
					}		
					this.colCount = this.colNames.length;
					if (tsmfldi){
						while (tsmfldi.hasNext()){
							tval = tsmfldi.next();
							this.fieldsValues.push(tval);
						}
					}
					
					this.fieldsCount = this.fieldsValues.length;
					this.rowsCount = (this.fieldsCount/this.colCount);
				}
			}
		}
		this.setSharedDropDownValues();

	}catch(err){
		this.log("[UTILS.ASIT] Error; No Rows Returned: "+ err.message);
		this.colNames = new Array();
		this.columns = new Array();
		this.fieldsValues=new Array();
		this.fieldsCount = 0;
		this.rowsCount = 0;	
		this.rowIndex = -1;
		this.filteredRowIndexes = new Array();
		this.filteredRowIndexesIndex = -1;
	}
	this.virtualASIT = this._getRows();
	this.reset();
};

UTILS.ASIT.prototype.getTable = function(){
	return this.tables[this.tableName];
};

UTILS.ASIT.prototype.reset = function(){
	this.filters = [];
	this.filteredRowIndexes = new Array();
	var colIndex;
	var c = 0;
	var rowNumber;
	this.filteredRowsCount = 0;
	for (r=0; r<this.getRowsCount();r++){
		rowNumber = r + 1;
		this.filteredRowIndexes.push(r);
	}
	this.filteredRowsCount = this.filteredRowIndexes.length;
	this.filteredRowIndexesIndex = -1;
	this.rowIndex = -1;
	this.asit = new TempASITObject(this.tableName);
	return this.filteredRowsCount;
};

UTILS.ASIT.prototype.setSharedDropDownValues = function (){
	if (this.tableName){
		if (this.colNames && this.colNames.length){
			for (var c in this.colNames){
				if (this.colNames.hasOwnProperty(c)){
					colName = this.colNames[c];
					if (this.tables[this.tableName].fields[colName]){
						if (this.tables[this.tableName].fields[colName].type == '5'){
							var sc = this.tables[this.tableName].fields[colName].standardChoice;
							this.tables[this.tableName].fields[colName].dropDownValues = UTILS.ASIT.getDDFromSD(sc);
						}
					}
				}
			}
		}else{
			this.log('No colNames have been set. please run init() first');
			throw this.getLog();
		}
	}else{
		throw 'No TableName has been set.'
	}
};

UTILS.ASIT.getDDFromSD = function(sd){
	var dd = {};
	var servProvCode = "";
	try{
		servProvCode = aa.getServiceProviderCode();
	}catch(err){
		logDebug("Couldn't get Service Provider Code. Proceeding without");
	}
	
	var sql = " SELECT " + 
	" 	r.[BIZDOMAIN_VALUE] AS EN, ISNULL(i18.BIZDOMAIN_VALUE,r.[BIZDOMAIN_VALUE]) AS AR " + 
	" FROM RBIZDOMAIN_VALUE r " + 
	" left join [RBIZDOMAIN_VALUE_I18N] i18 " + 
	" 		ON r.[RES_ID] = i18.RES_ID " + 
	" 		AND r.[SERV_PROV_CODE] = i18.[SERV_PROV_CODE] " + 
	" 		AND LANG_ID LIKE 'ar_%' " + 
	" WHERE r.[REC_STATUS] = 'A' AND i18.REC_STATUS = 'A' " + 
	" 		AND r.BIZDOMAIN = '"+sd+"' ";
	if (servProvCode){
		sql += " AND r.[SERV_PROV_CODE] = '"+servProvCode+"' ";
	}
	var results = UTILS.ASIT.executeQuery(sql);
	for (var r in results){
		var row = results[r];
		dd[row["EN"]] = row["AR"];
	}
	return dd;
}

UTILS.ASIT.prototype.getTranslatedValue = function(fieldName, val){
	var type = this.tables[this.tableName].fields[fieldName].type;
	if (type=='3'){
		// Yes or No
		if (val=="Yes"){
			return "نعم";
		}else{
			return "لا";			
		}
	} else if (type==5){
		// Drop Down
		var dd = this.tables[this.tableName].fields[fieldName].dropDownValues;
		return dd[val]?dd[val]:val;
	}else{
		return val
	}
	
}

UTILS.ASIT.prototype.clearFilters = function(){
	this.reset();
};

UTILS.ASIT.prototype.getRowsCount = function (index){
	return this.virtualASIT.length;
	
};

UTILS.ASIT.prototype.processFilters = function (){
	this.filteredRowIndexes = new Array();
	//this.filteredRowIndexesIndex = -1;	
	for (var f in this.filters){
		var filter = this.filters[f];
		this.addFilter(filter.field, filter.value, filter.exactSearch, filter.englishValuesOnly);
	}
	// Make sure the existing index didn't go out of bounds, if it exeecds the count of indexes, set it to the last item.
	if (this.filteredRowIndexesIndex>this.filteredRowIndexes.count-1){
		this.filteredRowIndexesIndex=this.filteredRowIndexes.count-1;
	}
}

UTILS.ASIT.prototype.addFilter = function(colName, colValue, exactSearch, englishValuesOnly){	// exactSearch = true will only match if the match is exact. exactSearch = false (default) will also filter partial matches (ie. a filter value of "test" will also match with "test123" and "123test123")
	var newRowIndexes = new Array();
	var colIndex;
	var c = 0;
	var rowNumber;
	var pSearchOnlyValues = false;
	if (englishValuesOnly){
		pSearchOnlyValues = englishValuesOnly;
	}
	var pExactSearch = false;
	if (exactSearch){
		pExactSearch = exactSearch;
	}
	for (c in this.colNames){
		if (this.colNames[c] == colName){
			colIndex = c;
			break;
		}
	}
	theCol = Number(colIndex) + 1;
	
	this.filters.push({field: colName, value: colValue, exactSearch: exactSearch, englishValuesOnly: englishValuesOnly});
	
	for (r=0; r<this.filteredRowIndexes.length;r++){
		rowNumberIndex = this.filteredRowIndexes[r];
		rowNumber = rowNumberIndex+1;

		//fieldIndex = (((rowNumber * this.colCount) - this.colCount) + theCol) - 1; 
		var cellValue = this.getValueStr(colName, false, rowNumberIndex);
		var column = this.getColumn(colName);
		
		if (pSearchOnlyValues || column.getColumnType()!=5){
			if (pExactSearch){
				if (cellValue.toLowerCase() == String(colValue).toLowerCase().trim()){
					//logDebug("fieldIndex: " + fieldIndex + ", Value:" + this.fieldsValues[fieldIndex]);
					newRowIndexes.push(rowNumberIndex);
				}	
			}else{
				if (cellValue.toLowerCase().indexOf(String(colValue).toLowerCase().trim())>-1){
					newRowIndexes.push(rowNumberIndex);
				}
			}
		}else if (column.getColumnType()==5){

			// This is a Drop Down. Retrieve Text Value as well
			var translatedValue = this.getTranslatedValue(colName, cellValue);
			//aa.print(translatedValue);
			if (pExactSearch){
				if (String(translatedValue).toLowerCase().trim() == String(colValue).toLowerCase().trim() || String(cellValue).toLowerCase().trim() == String(colValue).toLowerCase().trim()){
					newRowIndexes.push(rowNumberIndex);
				}
			}else{
				if (String(translatedValue).toLowerCase().trim().indexOf(String(colValue).toLowerCase().trim())>-1 || String(cellValue).toLowerCase().trim().indexOf(String(colValue).toLowerCase().trim())>-1 ){
					newRowIndexes.push(rowNumberIndex);
				}
			}
		}
	}
	this.filteredRowIndexes = newRowIndexes;
	this.filteredRowsCount = this.filteredRowIndexes.length;
	this.log('Added Filter on field: ' + colName + ', value: ' + colValue);
	this.log(this.filteredRowsCount + " Row(s) returned.");
	this.log("The Filtered Rows are: " + this.filteredRowIndexes);
	
	this.filteredRowIndexesIndex = -1;
	this.rowIndex = -1;

	return this.filteredRowsCount;
};

UTILS.ASIT.prototype.nextRow = function(){
	if (!this.tableName){ 
		this.log('[UTILS.ASIT] Please select a table first using UTIL.ASIT.setTable()');
		throw this.getLog();
	}
	//aa.print('this.rowIndex' + this.rowIndex);
	//aa.print('this.filteredRowIndexes: ' + this.filteredRowIndexes.length);
	if (this.rowIndex<this.getRowsCount()-1){
		//aa.print('this.filteredRowIndexes' + this.filteredRowIndexes);
		if (!this.filteredRowIndexes || !this.filteredRowIndexes.length){
			this.rowIndex++;
			return true;
		}else{
			if (this.filteredRowIndexesIndex<this.filteredRowIndexes.length-1){
				this.filteredRowIndexesIndex++;
				this.rowIndex = this.filteredRowIndexes[this.filteredRowIndexesIndex];	
				return true;
			}else{
				return false;
			}
		}
	}else{
		return false;
	}
};

UTILS.ASIT.prototype.goToRow = function (index){
	if (this.getRowsCount()>0 && index>-1){
		if (index<this.getRowsCount()){
			this.rowIndex = index;
			return;
		}else{
			this.rowIndex = this.getRowsCount()-1;
		}
	}else{
		//this.rowIndex = 0;
	}
	
	this.log("[UTIL.ASIT] Error. Row Index: "+index+" out of bounds!");
	throw this.getLog();
};

UTILS.ASIT.prototype.getRowIndex = function (){
	var rowIndex = this.rowIndex;
	if (this.getRowsCount()>0){
		if (rowIndex<0){
			return -1;
		}else if (rowIndex<this.getRowsCount()){
			return rowIndex;
		}else {
			return this.getRowsCount()-1;
		}
	}else{
		return -1
	}
};

UTILS.ASIT.prototype._getValue = function(colName, rowIndex){	// Language is optional, default is en_US
	/* Print Column Value for Current Row*/
	var foundIndex = -1;
	var c = 0;
	var theCol = 0;

	if (this.rowsCount>0 && rowIndex>-1){
		if (rowIndex<this.rowsCount){
			for (c in this.colNames){
				if (String(this.colNames[c]).trim() == String(colName).trim()){
					//aa.print("found Column '"+colName+"' at index: " + c);
					foundIndex = c;
					break;
				}
			}
			if (foundIndex == -1){
				return null;
			}else{
				theCol = Number(foundIndex) + 1;
				var rowNumber = rowIndex + 1;
				fieldIndex = (((rowNumber * this.colCount) - this.colCount) + theCol) - 1; 
				this.fieldIndex = Number(foundIndex);
				var val = this.fieldsValues[fieldIndex];
				return val;
			}
		}else{
			return null;		
		}
	}else{
		return null;
	}
};

UTILS.ASIT.prototype.getValue = function(colName, language, rowIndex){	// Language is optional, default is en_US
	/* Print Column Value for Current Row*/
	var foundIndex = -1;
	var c = 0;
	var theCol = 0;
	if (!language){
		language = 'en_US';
	}
	if (typeof rowIndex == 'undefined'){
		rowIndex = this.rowIndex;
	}
	if (this.getRowsCount()>0 && rowIndex>-1){
		if (rowIndex<this.getRowsCount()){
			for (c in this.colNames){
				if (String(this.colNames[c]).trim() == String(colName).trim()){
					//aa.print("found Column '"+colName+"' at index: " + c);
					foundIndex = c;
					break;
				}
			}
			if (foundIndex == -1){
				return null;
			}else{
				theCol = Number(foundIndex) + 1;
				//var rowNumber = rowIndex + 1;
				//fieldIndex = (((rowNumber * this.colCount) - this.colCount) + theCol) - 1; 
				//this.fieldIndex = Number(foundIndex);
				var val = this.virtualASIT[rowIndex][colName];
				if (language.indexOf('ar')>-1){
					val = this.getTranslatedValue(colName, val);
				}
				return val;
			}
		}else{
			return null;		
		}
	}else{
		return null;
	}
};

UTILS.ASIT.prototype.getValueStr = function(colName, language, rowIndex){
	/* Print Column Value for Current Row*/
	var value = this.getValue(colName, language, rowIndex);
	if (typeof value == "null" || typeof value == "undefined" || String(value).trim() == "null" || String(value).trim() == "undefined"){
		return "";
	}else{
		return String(value).trim();
	}
};

UTILS.ASIT.prototype.getColumn = function (colName){
	var colIndex = this.getColumnIndex(colName);
	var column = this.columns[colIndex];
	return column;
};

UTILS.ASIT.prototype.editField = function(fieldName, fieldValue, rowIndex){
	if (typeof rowIndex == 'undefined'){
		rowIndex = this.rowIndex;
	}
	this.virtualASIT[rowIndex][fieldName] = fieldValue;
	//this.asit.modifyFieldValue(this.rowIndex, fieldName, fieldValue);
	
};

UTILS.ASIT.prototype.save = function (){
	this.log('Saving changes to ASIT.');
	var virtualASIT = this.getRows();
	//aa.print();
	this.disableLog = false;
	this._deleteRows();
	//this.init();
	this._addRows(virtualASIT);
	this.disableLog = false;
	this.init();
	this.log('[ASIT Object] Changes Saved.');

};

UTILS.ASIT.prototype.saveState = function (){
	this.savedRowIndex = this.rowIndex;
	this.savedFilteredRowIndexes = this.filteredRowIndexes;
	this.savedFilteredRowIndexesIndex = this.filteredRowIndexesIndex;
	this.savedFilters = this.filters;
};

UTILS.ASIT.prototype.restoreState = function (){
	this.rowIndex = this.savedRowIndex;
	this.filteredRowIndexes = this.savedFilteredRowIndexes;
	this.filteredRowIndexesIndex = this.savedFilteredRowIndexesIndex;
	this.filters = this.savedFilters;
};

UTILS.ASIT.prototype.getRow = function (index, language){
	var row = {};
	if (index){
		this.saveState();
		this.reset();		
		this.goToRow(index);
	}
	for (var c in this.colNames){
		var col = String(this.colNames[c]).trim();
		row[col] = this.getValueStr(col, language);
	}
	if (index){
		this.restoreState();
	}
	return row;
};
UTILS.ASIT.prototype.getRowJSON = function (index, language){
	var row = this.getRow(index, language);
	return JSON.stringify(row);
};

UTILS.ASIT.prototype._getRows = function (){
	var jsonObj = [];
	var rowsCount = this.rowsCount;
	for (var i=0;i<rowsCount;i++){
		var row = {};
		for (var c in this.colNames){
			var col = String(this.colNames[c]).trim();
			row[col] = this._getValue(col, i);
		}
		jsonObj.push(row);
		//aa.print(asit.getFieldIndex("Id"));
	}
	return jsonObj;
};

UTILS.ASIT.prototype.getRows = function (language){
	var jsonObj = [];
	this.saveState();
	this.reset();
	while (this.nextRow()){
		var row = {};
		for (var c in this.colNames){
			var col = String(this.colNames[c]).trim();
			row[col] = this.getValueStr(col, language);
		}
		jsonObj.push(row);
		//aa.print(asit.getFieldIndex("Id"));
	}
	this.restoreState();
	return jsonObj;
};

UTILS.ASIT.prototype.getRowsJSON = function (language){
	var asitObj = this.getRows(language);
	return JSON.stringify(asitObj);
};

UTILS.ASIT.prototype.deleteRows = function() {
	this.virtualASIT = [];
	this.clearFilters();
};

UTILS.ASIT.prototype._deleteRows = function() {
	if (this.useEnvironmentVariable){
		this.removeTableForPageflow();
	}else{
		this.log("Deleting TableName: ", this.tableName);
		var res = aa.appSpecificTableScript.removeAppSpecificTableInfos(this.tableName, this.capId, aa.getAuditID());
		if (!res.getSuccess()) {
			this.log("[UTILS.ASIT] **WARNING: error removing ASI table " + this.tableName + " " + res.getErrorMessage());
			throw this.getLog();
		}else{
			this.log("Table " + this.tableName, " Deleted Successfully!");
		}	
	}
	//this.init();
};

UTILS.ASIT.prototype.getColumnIndex = function(colName){
	/* Print Column Value for Current Row*/
	var foundIndex = -1;
	var c = 0;
	var theCol = 0;
	for (c in this.colNames){
		if (this.colNames[c] == colName){
			//aa.print("found Column '"+colName+"' at index: " + c);
			foundIndex = c;
			break;
		}
	}
	if (foundIndex == -1){
		return null;
	}else{
		theCol = Number(foundIndex);// + 1;
		return theCol;
	}
};

UTILS.ASIT.prototype.getFieldIndex = function(colName){
	/* Get index of the Cell in the table */
	var foundIndex = -1;
	var c = 0;
	var theCol = 0;
	var colIndex = this.getColumnIndex();
	if (this.rowsCount>0 && this.rowIndex>-1){
		if (this.rowIndex<this.rowsCount){
			if (colIndex == -1){
				return null;
			}else{
				colIndex = Number(colIndex);
				var rowNumber = parseInt(this.rowIndex) + 1;
				var fieldIndex = (((rowNumber * this.colCount) - this.colCount) + colIndex); 
				return fieldIndex;
			}
		}else{
			return null;		
		}
	}else{
		return null;
	} 
};

UTILS.ASIT.prototype.addRow = function(dataset, rowIndex) {		// If rowIndex is not supplied(use cursor), then move the cursor to the newly added row
	var originalIndex = rowIndex;
	// If rowIndex not specified, use the cursor
	if (typeof rowIndex == 'undefined' || typeof rowIndex == 'null' ){
		rowIndex = this.rowIndex;
	}
	this.virtualASIT.splice(rowIndex, 0, dataset);
	this.processFilters();
	// If rowIndex is not specified, move the cursor to point to the newly added row.
	if (typeof originalIndex == 'undefined' || typeof originalIndex == 'null' ){
		this.rowIndex++;
	}
	this.log('[ASIT Object] Added 1 Row, at row Index: ' + rowIndex);
};

UTILS.ASIT.prototype.addRows = function(dataset, rowIndex) {
	if (typeof rowIndex == 'undefined' || typeof rowIndex == 'null' ){
		var originalRowIndex = this.rowIndex;
	}else{
		var originalRowIndex = rowIndex;
	}
	for (var d in dataset){
		this.disableLog = true;
		this.addRow(dataset[d], rowIndex);
		this.disableLog = false;
	}
	if (dataset.length){
		this.log('[ASIT Object] Added ' + dataset.length + ' Row(s), at row Index: ' + originalRowIndex);
	}
};

UTILS.ASIT.prototype._addRow = function(dataSet) {
	if (!dataSet.length){
		dataSet = [dataSet];
	}
	this.addRows(dataSet);
};

UTILS.ASIT.prototype._addRows = function(dataSet) {
	// ACA Pageflow tmp Cap
	this.saveState();
	if (this.useEnvironmentVariable){
		this.addRowsToPageFlow(dataSet);
	}else{
	// Real Cap
		this.addRealCapRows(dataSet);
	}
	//this.init()
	this.restoreState();
};

UTILS.ASIT.prototype.addRowsToPageFlow = function (tableValueArray) // optional capId
{
	//  tableName is the name of the ASI table
	//  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
	//

	var capModel = this.capModel;
	//var destinationTableGroupModel = this.tableGroupModel;
	var itemCap = this.capId;
	var ta = this.tableGroupModel.getTablesMap().values();
	var tai = ta.iterator();

	var found = false;
	while (tai.hasNext()) {
		var tsm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
		if (tsm.getTableName().equals(this.tableName)) {
			found = true;
			break;
		}
	}

	if (!found) {
		
		this.getLog("[UTILS.ASIT] Error: Cannot update asit for ACA, no matching table name: " + this.tableName);
		throw this.getLog();
	}
	
	var i = -1; // row index counter
	if (tsm.getTableFields() != null) {
		i = 0 - tsm.getTableFields().size()
	}
	for (thisrow in tableValueArray) {
		var fld = aa.util.newArrayList(); // had to do this since it was coming up null.
		var fld_readonly = aa.util.newArrayList(); // had to do this since it was coming up null.
		var col = tsm.getColumns()
			var coli = col.iterator();
		while (coli.hasNext()) {
			var colname = coli.next();
			
			if (!tableValueArray[thisrow][colname.getColumnName()]) {
				this.log("[UTILS.ASIT] addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
				tableValueArray[thisrow][colname.getColumnName()] = "";
			}

			if (typeof(tableValueArray[thisrow][colname.getColumnName()].fieldValue) != "undefined") // we are passed an asiTablVal Obj
			{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue ? tableValueArray[thisrow][colname.getColumnName()].fieldValue : "", colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(this.tableName.replace(/ /g, "\+"));
				fldToAdd.setReadOnly(tableValueArray[thisrow][colname.getColumnName()].readOnly.equals("Y"));
				fld.add(fldToAdd);
				fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);

			} else // we are passed a string
			{
				
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()] ? tableValueArray[thisrow][colname.getColumnName()] : "", colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(this.tableName.replace(/ /g, "\+"));
				fldToAdd.setReadOnly(false);
				fld.add(fldToAdd);
				fld_readonly.add("N");

			}
		}
		
		i--;

		if (tsm.getTableFields() == null) {
			tsm.setTableFields(fld);
		} else {
			tsm.getTableFields().addAll(fld);
		}

		if (tsm.getReadonlyField() == null) {
			tsm.setReadonlyField(fld_readonly); // set readonly field
		} else {
			tsm.getReadonlyField().addAll(fld_readonly);
		}
	}

	this.log('[UTILS.ASIT] '+tableValueArray.length+' Row(s) Added.');
	this.capModel.setAppSpecificTableGroupModel(this.tableGroupModel);
	aa.env.setValue('CapModel', this.capModel);
}

UTILS.ASIT.prototype.addRealCapRows = function(dataSet) {
	var data = [];
	/*var asitData = this.getASITArray();
	
	for ( var r in asitData) {
		var row = asitData[r];
		data.push(UTILS.ASIT.toAsiTableValObj(row));
	}*/
	for ( var r in dataSet) {
		var row = dataSet[r];
		data.push(row);
	}
	
	this.log('[UTILS.ASIT] Adding '+dataSet.length+' Row(s) to ASIT Table: '+this.tableName);
	this.updateRealCapAfterNewRow(data);
}


UTILS.ASIT.prototype.updateRealCapAfterNewRow = function(dataSet) {
	//this.disableLog = true;
	// Save the position of the cursor before deleteing everything
	//this.saveState();
	//this._deleteRows();
	//this.disableLog = false;
	
	//var r = this.tableModel;
	
	//aa.appSpecificTableScript.getAppSpecificTableModel(this.capId, this.tableName);
	//if (!r.getSuccess()) {
	//	throw "**WARNING: error retrieving app specific table " + this.tableName + ". ERROR= " + r.getErrorMessage();

	//}
	//var i = r.getOutput();
	this.tableModel = aa.appSpecificTableScript.getAppSpecificTableModel(this.capId, this.tableName).getOutput();

	var tableModel = this.tableModel.getAppSpecificTableModel();
	//logDebug("Table Model for updateASIT is ", tableModel);
	//printValues(tableModel);
	var o = tableModel.getTableField();
	var u = tableModel.getReadonlyField();
	for (thisrow in dataSet) {
		var a = tableModel.getColumns();
		var f = a.iterator();
		while (f.hasNext()) {
			var l = f.next();
			var dt = dataSet[thisrow][l.getColumnName()];
			if (typeof dt == "object") {
				try{
					var val = dataSet[thisrow][l.getColumnName()].fieldValue;					
				}catch(err){
					
				}
				if (val == null) {
					val = "";
				}
				val = UTILS.str(val);
				o.add(val);
				u.add(null)
			} else {
				var val = dataSet[thisrow][l.getColumnName()];
				if (val == null) {
					val = "";
				}
				val = UTILS.str(val);
				o.add(val);
				u.add(null)
			}
		}
		tableModel.setTableField(o);
		tableModel.setReadonlyField(u)
	}
	
	var c = aa.appSpecificTableScript.editAppSpecificTableInfos(tableModel, this.capId, aa.getAuditID());
	if (!c.getSuccess()) {
		this.log("[UTILS.ASIT] Error: adding record to ASI Table:  " + this.tableName + " " + c.getErrorMessage());
		throw this.getLog();
	}else{
		// Restore the position of the cursor before deleteing everything
		this.restoreState();
		this.log('[UTILS.ASIT] ASIT Table: '+this.tableName+' new row count: '+dataSet.length+'.');
	}
};

UTILS.ASIT.prototype.updateASITColumns = function(asit) {

	try{
		var tm = this.tableModel.getAppSpecificTableModel();		
	}catch(err){
		var tm = this.tableModel;		
	}
	
	var cells = tm.getTableField();
	var NumberOfCells = cells.size();
	var newtableFields = aa.util.newArrayList();
	var fields = tm.getTableFields().iterator();
	var columns = aa.util.newArrayList();
	var columnScripts = tm.getColumns();
	var NumberOfColumns = this.columns.length;
	var NumberOfRows = Math.ceil(NumberOfCells / NumberOfColumns);

	if (NumberOfColumns < 0) {
		this.log("[UTILS.ASIT] Error: invalid number of columns for table: " + this.tableName)
		throw this.getLog();
	}
	// set columns
	var colNames = [];
	for (var iterator = columnScripts.iterator(); iterator.hasNext();) {
		var scriptModel = iterator.next();
		try{
			columns.add(scriptModel.getColumnModel());
			colNames.push(scriptModel.getColumnName());			
		}catch(err){
			columns.add(scriptModel);
			colNames.push(scriptModel.getColumnName());
		}
	}
	tm.setColumns(columns);
	// set table fields
	var editedMsg = "";
	var edited = 0;
	for (var ri = 0; ri < NumberOfRows; ri++) {

		for (var colIndex = 0; colIndex < NumberOfColumns; colIndex++) {
			var cname = colNames[colIndex];
			var rowinIndexDB = fields.next().getRowIndex();
			var val = cells.get((ri * NumberOfColumns) + colIndex);
			if (asit.hasField(ri, cname)) {
				var newValue = asit.getFieldValue(ri, cname);

				editedMsg += "** " + cname + "[" + ri + "]=" + newValue + ", was " + val + "\n";
				val = newValue;
				edited++;

			}
			if (val == null) {
				val = "";
			}

			var res = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", [ val, columns.get(colIndex) ]);
			if (!res.getSuccess()) {
				this.log("field creationg failed: " + res.getErrorMessage());
				throw this.getLog();
			}
			field = res.getOutput();
			field.setFieldLabel(cname);
			field.setRowIndex(rowinIndexDB);
			newtableFields.add(field);

		}

	}
	if (edited != asit.fields.length) {
		this.log("**ERROR: Could not edit all edited fields! only " + edited + "/" + asit.fields.length + " was edited:\n" + editedMsg);
		throw this.getLog();
	}
	tm.setTableFields(newtableFields);

	var gsiBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableBusiness").getOutput();
	gsiBiz.editAppSpecificTableInfos(tm, this.capId, aa.getAuditID())
	this.log("Successfully edited ASI Table: " + this.tableName + ". " + edited + " Cell(s) was edited:\n" + editedMsg);
	return edited;
};

UTILS.ASIT.prototype.updateASITColumnsForPageflow = function(asit) {
	var capModel = this.capModel;
	//var destinationTableGroupModel = this.tableGroupModel;
	var itemCap = this.capId;
	var ta = this.tableGroupModel.getTablesMap().values();
	var tai = ta.iterator();

	var found = false;
	while (tai.hasNext()) {
		var tm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
		if (tm.getTableName().equals(this.tableName)) {
			found = true;
			break;
		}
	}

	if (!found) {
		this.log("[UTILS.ASIT] Error: cannot update asit for ACA, no matching table name");
		throw this.getLog();
	}
	
	var i = -1; // row index counter
	if (tm.getTableFields() != null) {
		i = 0 - tm.getTableFields().size()
	}

	var cells = tm.getTableField();
	var NumberOfCells = cells.size();
	var newtableFields = aa.util.newArrayList();
	var fields = tm.getTableFields().iterator();
	var columns = aa.util.newArrayList();
	var columnScripts = tm.getColumns();
	var NumberOfColumns = this.columns.length;
	var NumberOfRows = Math.ceil(NumberOfCells / NumberOfColumns);

	if (NumberOfColumns < 0) {
		this.log("[UTILS.ASIT] Error: invalid number of columns in "+this.tableName+". NumberOfColumns: " + NumberOfColumns);
		throw this.getLog();
	}
	// set columns
	var colNames = [];
	for (var iterator = columnScripts.iterator(); iterator.hasNext();) {
		var scriptModel = iterator.next();
		try{
			columns.add(scriptModel.getColumnModel());
			colNames.push(scriptModel.getColumnName());			
		}catch(err){
			columns.add(scriptModel);
			colNames.push(scriptModel.getColumnName());
		}
	}
	tm.setColumns(columns);
	// set table fields
	var editedMsg = "";
	var edited = 0;
	for (var ri = 0; ri < NumberOfRows; ri++) {

		for (var colIndex = 0; colIndex < NumberOfColumns; colIndex++) {
			var cname = colNames[colIndex];
			var rowinIndexDB = fields.next().getRowIndex();
			var val = cells.get((ri * NumberOfColumns) + colIndex);
			if (asit.hasField(ri, cname)) {
				var newValue = asit.getFieldValue(ri, cname);

				editedMsg += "** " + cname + "[" + ri + "]=" + newValue + ", was " + val + "\n";
				val = newValue;
				edited++;

			}
			if (val == null) {
				val = "";
			}

			var res = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", [ val, columns.get(colIndex) ]);
			if (!res.getSuccess()) {
				this.log("[UTILS.ASIT] Error field creation failed: " + res.getErrorMessage());
				throw this.getLog();
			}
			field = res.getOutput();
			field.setFieldLabel(cname);
			field.setRowIndex(rowinIndexDB);
			newtableFields.add(field);

		}

	}
	if (edited != asit.fields.length) {
		this.log("[UTILS.ASIT] ERROR: Could not edit all edited fields! only " + edited + "/" + asit.fields.length + " was edited:\n" + editedMsg);
		throw this.getLog();
	}
	tm.setTableFields(newtableFields);

	this.capModel.setAppSpecificTableGroupModel(this.tableGroupModel);
	aa.env.setValue('CapModel', this.capModel);
	this.log("Successfully edited ASI Table: " + this.tableName + ". " + edited + " Cell(s) was edited:\n" + editedMsg);
	return edited;
};


UTILS.ASIT.prototype.getASITArray = function() {
	var ret = UTILS.ASIT.asitToArray(this.tableModel);
	return ret;
}

UTILS.ASIT.asitToArray = function (asit) {
	var tsmfldi = asit.getTableField().iterator();
	var tsmcoli = asit.getColumns();
	var rows = new Array();
	var numrows = 0;

	while (tsmfldi.hasNext()) {
		var row = {};
		for (var i = 0; i < tsmcoli.size() && tsmfldi.hasNext(); i++)// cycle

		{
			row[tsmcoli.get(i).getColumnName()] = tsmfldi.next();

		}
		rows.push(row);
		numrows++;
	}

	return rows;
}

UTILS.ASIT.toAsiTableValObj = function(row, differentColNamesMap) {
	var newRow = new Array();
	for (field in row) {
		var newAsitFieldName = differentColNamesMap != null && differentColNamesMap.get(field) || field;
		var fieldValue = row[field] == null ? "" : String(row[field]);
		var f = new asiTableValObj(newAsitFieldName, fieldValue, "N");
		newRow[newAsitFieldName] = f;
	}
	return newRow;
};



//Remove Row from Table

UTILS.ASIT.prototype.deleteRow = function(rowIndex) {
	/*if (typeof rowIndex == "undefined"){
		rowIndex = this.rowIndex;
	}
	var asitJSON = this.getRows();
	asitJSON.splice(rowIndex,1);
	// Save the position of the cursor
	this.saveState();
	this.deleteRows();
	this.addRows(asitJSON);
	// Restore the position of the cursor
	this.restoreState();*/
	if (typeof rowIndex == 'undefined' || typeof rowIndex == 'null' ){
		if (rowIndex == -1){
			rowIndex++;
		}
		rowIndex = this.rowIndex;
		//this.rowIndex--;
	}
	this.virtualASIT.splice(rowIndex,1);
	this.processFilters();
	this.log('[ASIT Object] Deleted Row at Index: ' + rowIndex);
};

/*UTILS.ASIT.prototype.deleteRow = function (vRowIndex) {
	//if (this.useEnvironmentVariable){
	//	this.deleteRow(vRowIndex);
	}else{
	// Real Cap
		this.deleteRowForRealCap(vRowIndex);
	}
}
UTILS.ASIT.prototype.deleteRowForRealCap = function (vRowIndex) {
	if (typeof vRowIndex == "undefined"){
		vRowIndex = this.rowIndex;
	}
	var retVal = false;
	var vTableName = this.tableName;
	
	var columnsList = this.columns;
	if (columnsList != null) {
      try{
          columnsList = columnsList.toArray();
      }catch(err){

      }
      printValues(this.tableModel);
      
		for (column in columnsList) {
			printValues(columnsList[column]);
			var tmpCol = columnsList[column].getTableValues();
			if (tmpCol != null) {
				tmpCol = tmpCol.toArray();
				//aa.print(tmpCol.length);
				if (vRowIndex <= tmpCol.length) {
					var tmpList = aa.util.newArrayList()
						for (row in tmpCol) {
							if (tmpCol[row].getRowNumber() != vRowIndex) {
								tmpList.add(tmpCol[row]);
								//aa.print(tmpCol[row].getColumnNumber() + " :" + tmpCol[row].getRowNumber());
							} else {
								retVal = true;
							}
						}
						columnsList[column].setTableValues(tmpList);
				} //End Remove
			} //end column Check
		} //end column loop
	} //end column list check

	return retVal;
}
*/
UTILS.ASIT.prototype.removeTableForPageflow = function () {
	this.tableModel.setTableFields(null);
}

function asiTableValObj(columnName, fieldValue, readOnly) {
  this.columnName = columnName;
  this.fieldValue = fieldValue;
  this.readOnly = readOnly;

  asiTableValObj.prototype.toString = function() {
    return this.fieldValue
  }
};

function TempASITObject(tableName) {
	this.tableName = tableName;
	this.fields = [];
	this.modifyFieldValue = function(row, name, value) {
		var field = {};
		field.row = row;
		field.name = name;
		if (value == null) {
			value = "";
		}
		field.value = value;
		this.fields.push(field);
	}
	this.getFieldValue = function(row, name) {
		var ret = null;
		for (x in this.fields) {
			var f = this.fields[x];
			if (f.row == row && f.name.toLowerCase() == name.toLowerCase()) {
				ret = f.value + "";
				break;
			}
		}
		return ret;
	}
	this.hasField = function(row, name) {
		var ret = false;
		for (x in this.fields) {
			var f = this.fields[x];
			if (f.row == row && f.name.toLowerCase() == name.toLowerCase()) {
				ret = true
				break;
			}
		}
		return ret;
	}
	this.getTableName = function() {
		return this.tableName;
	}
	this.isEmpty = function() {
		return this.fields.length == 0;
	}
}


UTILS.ASIT.executeQuery = function (sql, params) {
	var strd = "";
	if (!params){
		params = [];
	}
	for ( var c in params) {
		strd += c + "=[" + params[c] + "],";
	}
	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var utilProcessor = new JavaAdapter(
			com.accela.aa.datautil.DBResultSetProcessor,
			{
				processResultSetRow : function(rs) {
					var meta = rs.getMetaData();
					var numcols = meta.getColumnCount();
					var record = {}
					var result = null;

					for (var i = 0; i < numcols; i++) {
						var columnName = meta.getColumnName(i + 1);
						columnName = columnName.toUpperCase()
						result = rs.getObject(i + 1);
						if (result == null) {
							record[columnName] = String("");
						} else {

							if (result.getClass
									&& result.getClass().getName() == "java.sql.Timestamp") {

								record[columnName] = UTILS.str(new Date(rs
										.getTimestamp(i + 1).getTime())
										.toString("dd/MM/yyyy"));
							} else {
								record[columnName] = UTILS.str(rs.getObject(i + 1));
							}

						}
					}
					return record;
				}
			});
	var result = dba.select(sql, params, utilProcessor, null);
	ret = result.toArray()
	var data = [];
	for ( var x in ret) {
		var o = {};
		for ( var y in ret[x]) {
			o[y] = String(ret[x][y])
		}
		data.push(o)
	}

	return data;
}

function logDebug(msg, msg2) {
    if (typeof msg2 === "undefined" || msg2 === null) {
        msg2 = "";
    } else {
        msg2 = " : " + msg2;
    }
    java.lang.System.out.println("===Custom Log for [UTILS.ASIT] ==> " + msg + msg2);
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
UTILS.str = function (value){
	if (typeof value == "null" || typeof value == "undefined" || String(value).trim() == "null" || String(value).trim() == "undefined"){
		value = "";
	}
	return String(value).trim();
}
