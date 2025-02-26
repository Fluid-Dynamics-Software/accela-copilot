/*------------------------------------------------------------------------------------------------------/
| Program		: SENDBACK:GETCAPASIDATA.js
| Event			: 
|
| Usage			: json = getCapASIData(capId);
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HISHAM
| Created at	: 07/08/2018 10:02:21
|
/------------------------------------------------------------------------------------------------------*/

eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
var dbObjectPrefix = "";//aa.bizDomain.getBizDomainByValue("DB Settings", "Query DB Prefix").getOutput().getDescription();

function getCapASIData(capId){
	java.lang.System.out.println("Inside getCapASIData!");
	if (typeof capId == "string"){
		capId = aa.cap.getCapID(capId).getOutput();
	}	
	var data = {};
	data.asis = getASIs(capId);
	data.asits = getASITs(capId);
	return data;
}
function getASIs(capId){
	java.lang.System.out.println("Inside getASIs!");

	sql = getSQLQuery(capId);
	var asiData = execQuery(sql);
	var asis = {};
	for (i in asiData){
		var asiFieldRow = asiData[i];
		groupCode = asiFieldRow["GROUP_CODE"];
		groupName = asiFieldRow["SUBGROUP_NAME"];
		groupNameEN = asiFieldRow["SUBGROUP_ALIAS_EN"];
		groupNameAR = asiFieldRow["SUBGROUP_ALIAS_AR"];
		fieldName = asiFieldRow["FIELDNAME"];
		fieldNameEN = asiFieldRow["ALTERNATIVE_LABEL_EN"];
		fieldNameAR = asiFieldRow["ALTERNATIVE_LABEL_AR"];
		value = asiFieldRow["FIELD_VALUE"];
		fieldType = asiFieldRow["FIELD_TYPE"];
		displayable = asiFieldRow["VCH_DISP_FLAG"];
	
		java.lang.System.out.println("fieldName: " + fieldName);
		if (displayable == "Y" || displayable == "H"){
			if (value == null){
				value = "";			
			}
			var id = generateHTMLId(groupName, fieldName);
			if (fieldType=="3"){	// 3 = radio
				id = id + "_r1";
			}			
			if (!asis[groupName]){
				asis[groupName] = {"fields": {}, "name": groupName, "aliasEN": groupNameEN, "aliasAR": groupNameAR};
			}			
			asiField = {"name": fieldName, "subgroup": groupName, "subgroupAliasEN": groupNameEN, "subgroupAliasAR": groupNameAR, "value": String(value).trim(), "id": id, "aliasEN": fieldNameEN, "aliasAR": fieldNameAR};
			//asiFields[name] = asiField;
			asis[groupName].fields[fieldName] = asiField;
		}
	}
	java.lang.System.out.println("asis: " +JSON.stringify(asis));
	return asis;
}
function getASITs(capId){
	sql = getSQLQueryASIT(capId);
	var asitData = execQuery(sql);
	var asits = {};	
	var oldRowIndex = -2;
	for (i in asitData){
		var asiFieldRow = asitData[i];
		groupCode = asiFieldRow["GROUP_CODE"];
		groupName = asiFieldRow["TABLE_NAME"];
		groupNameEN = asiFieldRow["GROUP_EN"];
		groupNameAR = asiFieldRow["GROUP_AR"];
		fieldName = asiFieldRow["COLUMN_NAME"];
		fieldNameAR = asiFieldRow["FIELDNAME_AR"];
		fieldNameAliasEN = asiFieldRow["FIELDNAME_ALIAS_EN"];
		fieldNameAliasAR = asiFieldRow["FIELDNAME_ALIAS_AR"];
		value = asiFieldRow["ATTRIBUTE_VALUE"];
		valueAR = asiFieldRow["VALUE_ARABIC"];
		fieldType = asiFieldRow["COLUMN_TYPE"];
		columnIndex = asiFieldRow["COLUMN_INDEX"];
		rowIndex = parseInt(asiFieldRow["ROW_INDEX"]);
		displayable = asiFieldRow["ACA"];

		//aa.print("fieldName:" + fieldName);
		//aa.print("value:" + value);
		//aa.print(isNaN(parseInt(rowIndex)));

		var groupName = String(groupName).trim();
		//var asitObject = new ASITNavigator(capId, groupName);
		//var columnNames = String(asitObject.colNames).trim().split(",");

				
		//aa.print(groupName);
		//aa.print(columnNames);
		//aa.print(asitObject.rowCount);
		if (!asits[groupName]){
			// Get ACA Column Names
			var ACAColumnIndexes = {};
			var ACAFields = [];
			var ACAIndex = -1;
			var asitRows = [];
			//var rowIndex = -1;
			var oldRowIndex = -1;
			var fieldIndex = -1;
			asits[groupName] = {"name": groupName, "nameAR":groupNameAR, "fields": [], "ACAFields": [], "aliasEN": groupNameEN, "aliasAR":groupNameAR, rows:[]};
		}
		if (!asits[groupName].fields.includes(fieldName)){
			asits[groupName].fields.push(fieldName);
		}
		
		if (!asits[groupName].ACAFields.includes(fieldName)){
			asits[groupName].ACAFields.push(fieldName); 
		}
		
		// If Row Index is not a number, skip and don't insert row.
		if (isNaN(parseInt(rowIndex))){
			continue;
		}
		
		//displayable = displayable;
		if (displayable != "N"){
			//asits[groupName].ACAFields.push(columnName);
		}
		//rowIndex++;
		//var asitRow = {};
		
		
		
		var columnName = String(fieldName).trim();
		//columnObj = asitObject.columns[c].getColumnModel();
		//displayable = columnObj.getVchDispFlag();
		if (displayable != "N"){
			//aa.print("oldRowIndex:" + oldRowIndex);
			//aa.print("rowIndex:" + rowIndex);

			// New Row
			if (oldRowIndex != rowIndex){
				var fieldIndex = -1;		
				var ACAIndex = -1;
				oldRowIndex = rowIndex;
				asits[groupName].rows.push({});
			}
			fieldIndex++;		
			ACAIndex++;
			ACAColumnIndexes[fieldName]=ACAIndex;

			var field = fieldName;
			asiField = {"name": columnName, "nameAR": fieldNameAR, "aliasEN":fieldNameAliasEN, "aliasAR":fieldNameAliasAR, "subgroup":groupName, "subgroupAliasEN": groupNameEN, "subgroupAliasAR":groupNameAR, "fieldType": fieldType, "value": value, "valueAR":valueAR, "rowIndex": ""+rowIndex, "index": ""+fieldIndex, "ACAIndex": ""+ACAColumnIndexes[columnName]};
			if (asits[groupName].rows.length){
				asits[groupName].rows[asits[groupName].rows.length-1][columnName] = asiField;
			}
		}
	}

	//asit["rows"] = asitRows;
	//asits[groupName] = asitRows;
	//aa.print(JSON.stringify(asits));
	return asits;
}

function getASIsFromCap(capId){
	if (typeof capId == "string"){
		capId = aa.cap.getCapID(capId).getOutput();
	}
	var asis = {};
	
	var group = aa.cap.getCap(capId).getOutput().getCapModel().getAppSpecificInfoGroups().get(0).getGroupCode();
	var asiGroups = aa.appSpecificInfo.getRefASISubgroups(group).getOutput(); 

	for (i in asiGroups){
		var asiGroupName = asiGroups[i];
		var name = String(asiGroupName).trim();
		var asi = {"name": name};
		//aa.print(asiGroupName);
		
		aa.print("-----------------------");
		var asiGroupObj = aa.appSpecificInfo.getAppSpecificInfos(capId, name, "").getOutput();
		var asiFields = {};
		for (i in asiGroupObj){
			var asiFieldObj = asiGroupObj[i];
			//aa.print(asiFieldObj.getCheckboxDesc());
			//asiFieldObj.getCheckboxDesc();
			var name = String(asiFieldObj.getCheckboxDesc()).trim();
			var type = String(asiFieldObj.getCheckboxType()).trim();
			var fieldType = String(asiFieldObj.getFieldType()).trim();
			var value = asiFieldObj.getChecklistComment();
			var id = generateHTMLId(type, name);
			if (fieldType=="3"){	// 3 = radio
				id = id + "_r1";
			}
			displayable = asiFieldObj.getVchDispFlag();
			//aa.print(displayable)
			if (displayable == "Y" || displayable == "H"){
				if (value == null){
					value = "";			
				}
				asiField = {"name": name, "subgroup":type,"value": String(value).trim(), "id": id};
				asiFields[name] = asiField;				
			}
		}
		asi.fields = asiFields;
		asis[asiGroupName] = asi;
	}
	return(asis);
}

function generateHTMLId(group, fieldname, table){
	//"app_spec_info_IN_PATIENT_SERVICES_Inpatient_Bed_Capacity"
	if (table){
		var id = "app_spec_info_table";
		var groupId = generateId(group, true, "+");
		var fieldId = generateId(fieldname);
	}else{
		var id = "app_spec_info";		
		var groupId = sanitizedId(String(group).trim()).toUpperCase();
		var fieldId = sanitizedId(String(fieldname).trim());
	}
	id = id + "_" + groupId + "_" + fieldId;
	return id;
}

function getASITsFromCap(capId){
	if (typeof capId == "string"){
		capId = aa.cap.getCapID(capId).getOutput();
	}

	var asits = {};
	var asitGroupNames = aa.appSpecificTableScript.getAppSpecificGroupTableNames(capId).getOutput();

	// Loop through ASIT Groups
	for (i in asitGroupNames){
		var groupName = String(asitGroupNames[i]).trim();
		var asitObject = new ASITNavigator(capId, groupName);
		var columnNames = String(asitObject.colNames).trim().split(",");

		// Get ACA Column Names
		var ACAColumnIndexes = {};
		var ACAFields = [];
		var ACAIndex = -1;
		for (c in columnNames){
			var columnName = String(columnNames[c]).trim();
			columnObj = asitObject.columns[c].getColumnModel();
			displayable = columnObj.getVchDispFlag();
			if (displayable == "Y"){
				ACAIndex++;
				ACAColumnIndexes[columnName]=ACAIndex;
				ACAFields.push(columnName);
			}
		}		
				
		//aa.print(groupName);
		//aa.print(columnNames);
		//aa.print(asitObject.rowCount);
		
		var asit = {"name": groupName, "fields": columnNames, "ACAFields": ACAFields};

		var asitRows = [];
		var rowIndex = -1;
		
		while (asitObject.nextRow()){
			rowIndex++;
			asitRow = {};
			for (c in columnNames){
				var columnName = String(columnNames[c]).trim();
				columnObj = asitObject.columns[c].getColumnModel();
				displayable = columnObj.getVchDispFlag();
				if (displayable == "Y"){
					var field = asitObject.getFieldStr(columnName);
					var fieldIndex = asitObject.fieldIndex;
					asiField = {"name": columnName, "subgroup":groupName, "value": field, "rowIndex": ""+rowIndex, "index": ""+fieldIndex, "ACAIndex": ""+ACAColumnIndexes[columnName]};
					asitRow[columnName] = asiField;					
				}
			}
			asitRows.push(asitRow);
		}	
		asit["rows"] = asitRows;
		asits[groupName] = asit;
		//aa.print(JSON.stringify(asit));
	}
	return(asits);	
}

function generateId(label, uppercase, alternativeForSpaces){	// convert to Upper Case
	var theLabel = String(label).trim();
	if (alternativeForSpaces){
		theLabel = theLabel.replaceAll(" ", alternativeForSpaces);		
		theLabel = theLabel.replaceAll("%", alternativeForSpaces);
	}else{
		theLabel = theLabel.replaceAll(" ", "_");
		theLabel = theLabel.replaceAll("%", "_");		
	}

	theLabel = theLabel.replaceAll("'", "");
	theLabel = theLabel.replaceAll("\"", "");
	theLabel = theLabel.replaceAll("(", "%28");
	theLabel = theLabel.replaceAll(")", "%29");
	theLabel = theLabel.replaceAll("/", "%2F");
	if (uppercase){
		theLabel = theLabel.toUpperCase();
	}
	return theLabel;
}

function sanitizedId(label){
	var theLabel = String(label).trim();
	theLabel = theLabel.replaceAll(" ", "_");
	theLabel = theLabel.replaceAll(".", "_");
	theLabel = theLabel.replaceAll("-", "_");
	theLabel = encodeURIComponent(theLabel);
	theLabel = theLabel.replaceAll("(", "%28");
	theLabel = theLabel.replaceAll(")", "%29");
	return theLabel;
}



function getSQLQuery(capId){
	var capId1 = capId.getID1();
	var capId2 = capId.getID2();
	var capId3 = capId.getID3();
	
	var sql = "";
	sql += "SELECT b.serv_prov_code,  " + 
	"       per.b1_alt_id,  " + 
	"       b.b1_per_id1,  " + 
	"       b.b1_per_id2,  " + 
	"       b.b1_per_id3,  " + 
	"       ISNULL(l.template_code, b.b1_act_status)           AS GROUP_CODE, " + 
	"       ISNULL(l.template_type, b.b1_checkbox_type)        AS SUBGROUP_NAME, " + 
	"       b.b1_checkbox_ind         AS FIELD_TYPE, " + 
	"       ISNULL(groupEN.alternative_label, i18n_EN.R1_CHECKBOX_TYPE) AS SUBGROUP_ALIAS_EN, " + 
	"       ISNULL(groupAR.alternative_label, i18n_EN.R1_CHECKBOX_TYPE) AS SUBGROUP_ALIAS_AR, " + 
	"       l.conf_level, " + 
	"       ISNULL(l.field_name,  b.b1_checkbox_desc)          AS FIELDNAME, " + 
	"       ISNULL(l.alternative_label, i18n_EN.R1_CHECKBOX_DESC)       AS ALTERNATIVE_LABEL, " + 
	"       ISNULL(l.alternative_label, i18n_EN.R1_CHECKBOX_DESC_ALIAS)    AS ALTERNATIVE_LABEL_EN, " + 
	"       ISNULL(lara.alternative_label, i18n_AR.R1_CHECKBOX_DESC)    AS ALTERNATIVE_LABEL_AR, " + 

	"       b.b1_checklist_comment    AS FIELD_VALUE,  " + 
	"       r.r1_checkbox_ind,  " + 
	"       r.r1_display_order,  " + 
	"       r.r1_group_display_order,  " + 
	"       r.vch_disp_flag,  " + 
	"       r.res_id  " + 
	"FROM   b1permit per  " + 
	"       JOIN "+dbObjectPrefix+"[bchckbox] b  " + 
	"         ON per.serv_prov_code = b.serv_prov_code  " + 
	"            AND per.b1_per_id1 = b.b1_per_id1  " + 
	"            AND per.b1_per_id2 = b.b1_per_id2  " + 
	"            AND per.b1_per_id3 = b.b1_per_id3  " + 
	"       JOIN "+dbObjectPrefix+"[r2chckbox] r  " + 
	"         ON b.serv_prov_code = r.serv_prov_code  " + 
	"            AND b.b1_checkbox_type = r.r1_checkbox_type  " + 
	"            AND b.b1_checkbox_desc = r.r1_checkbox_desc  " + 
	"			 AND b.B1_ACT_STATUS = r.r1_checkbox_code " + 
	"       LEFT JOIN "+dbObjectPrefix+"[R2CHCKBOX_I18N] i18n_EN  " + 
	"       	ON r.RES_ID = i18n_EN.RES_ID " + 
	"       	AND r.SERV_PROV_CODE = i18n_EN.SERV_PROV_CODE " + 
	"       	AND i18n_EN.LANG_ID = 'en_US' " + 
	"       LEFT JOIN "+dbObjectPrefix+"[R2CHCKBOX_I18N] i18n_AR  " + 
	"       	ON r.RES_ID = i18n_AR.RES_ID " + 
	"       	AND r.SERV_PROV_CODE = i18n_AR.SERV_PROV_CODE " + 
	"       	AND i18n_AR.LANG_ID = 'ar_AE'	 " + 
	"       LEFT JOIN "+dbObjectPrefix+"[rtemplate_layout_config] l  " + 
	"              ON r.r1_checkbox_code = l.template_code  " + 
	"                 AND r.r1_checkbox_type = l.template_type  " + 
	"                 AND r.serv_prov_code = l.serv_prov_code  " + 
	"                 AND r.r1_checkbox_desc = l.field_name  " + 
	"                 AND l.entity_type = 'ASI'  " + 
	"                 AND l.conf_level = 'FIELDNAME'  " + 
	"       LEFT JOIN "+dbObjectPrefix+"[rtemplate_layout_config_i18n] leng  " + 
	"              ON l.res_id = leng.res_id  " + 
	"                 AND l.serv_prov_code = leng.serv_prov_code  " + 
	"                 AND l.rec_status = 'A'  " + 
	"                 AND leng.lang_id = 'en_US'  " + 
	"       LEFT JOIN "+dbObjectPrefix+"[rtemplate_layout_config_i18n] lara  " + 
	"              ON l.res_id = lara.res_id  " + 
	"                 AND l.serv_prov_code = lara.serv_prov_code  " + 
	"                 AND l.rec_status = 'A'  " + 
	"                 AND lara.lang_id = 'ar_AE'  " + 
	"       LEFT JOIN "+dbObjectPrefix+"[rtemplate_layout_config] g  " + 
	"              ON l.template_type = g.template_type  " + 
	"                 AND g.conf_level = 'TEMPLATENAME'  " + 
	"                 AND l.serv_prov_code = g.serv_prov_code  " + 
	"                 AND l.template_code = g.template_code  " + 
	"				  AND g.entity_type = 'ASI' " +
	"       LEFT JOIN "+dbObjectPrefix+"[rtemplate_layout_config_i18n] groupEN  " + 
	"              ON g.res_id = groupEN.res_id  " + 
	"                 AND g.serv_prov_code = groupEN.serv_prov_code  " + 
	"                 AND g.rec_status = 'A'  " + 
	"                 AND groupEN.lang_id = 'en_US'  " + 
	"       LEFT JOIN "+dbObjectPrefix+"[rtemplate_layout_config_i18n] groupAR  " + 
	"              ON g.res_id = groupAR.res_id  " + 
	"                 AND g.serv_prov_code = groupAR.serv_prov_code  " + 
	"                 AND g.rec_status = 'A'  " + 
	"                 AND groupAR.lang_id = 'ar_AE'  " + 
	"WHERE  per.b1_per_id1 = '"+capId1+"'  " + 
	"       AND per.b1_per_id2 = '"+capId2+"'  " + 
	"       AND per.b1_per_id3 = '"+capId3+"'  " + 
	//"       AND r.r1_checkbox_code = 'ANMC'  " + 
	//"       AND r.r1_checkbox_type = 'CONTRACTDETAILS'  " + 
	"       AND per.serv_prov_code = '"+aa.getServiceProviderCode()+"' ";
	java.lang.System.out.println("SENDBACK:GETCAPASIDATA SQL: " + sql);
	return sql;
}

function getSQLQueryASIT(capId){
	var capId1 = capId.getID1();
	var capId2 = capId.getID2();
	var capId3 = capId.getID3();
	
	var sql = "";
	sql += "SELECT per.serv_prov_code," + 
 	"        per.b1_alt_id," + 
 	"        per.b1_per_id1," + 
 	"        per.b1_per_id2," + 
 	"        per.b1_per_id3," + 
 	"        asit.group_name            'GROUP_CODE'," + 
 	"        asit.table_name," + 
 	"        asit.column_name," + 
 	"        asit.column_type," + 
 	"        asit.b1_attribute_value    'ACA'," + 
 	"        asit.b1_display_order," + 
 	"        asit.b1_table_display_order," + 
 	"        val.column_index," + 
 	"        val.row_index," + 
 	"        val.attribute_value," + 
 	" 	   MAX(ddAR.BIZDOMAIN_VALUE)	'VALUE_ARABIC', " +
 	" 	     ien.r1_checkbox_type       'GROUP_EN'," + 
 	"        ien.r1_checkbox_desc       'FIELDNAME_EN'," + 
 	"        ien.r1_checkbox_desc_alt   'FIELDNAME_ALT_EN'," + 
 	"        ien.r1_checkbox_desc_alias 'FIELDNAME_ALIAS_EN'," + 
 	"        iar.r1_checkbox_type       'GROUP_AR'," + 
 	"        iar.r1_checkbox_desc       'FIELDNAME_AR'," + 
 	"        iar.r1_checkbox_desc_alt   'FIELDNAME_ALT_AR'," + 
 	"        iar.r1_checkbox_desc_alias 'FIELDNAME_ALIAS_AR'" + 
 	" FROM   b1permit per" + 
 	"        JOIN "+dbObjectPrefix+"[bappspectable] asit" + 
 	"          ON per.serv_prov_code = asit.serv_prov_code" + 
 	"             AND per.b1_per_id1 = asit.b1_per_id1" + 
 	"             AND per.b1_per_id2 = asit.b1_per_id2" + 
 	"             AND per.b1_per_id3 = asit.b1_per_id3" + 
 	"        LEFT JOIN "+dbObjectPrefix+"[bappspectable_value] val" + 
 	"               ON asit.serv_prov_code = val.serv_prov_code" + 
 	"                  AND asit.b1_per_id1 = val.b1_per_id1" + 
 	"                  AND asit.b1_per_id2 = val.b1_per_id2" + 
 	"                  AND asit.b1_per_id3 = val.b1_per_id3" + 
 	"                  AND asit.group_name = val.group_name" + 
 	"                  AND asit.table_name = val.table_name" + 
 	"                  AND asit.column_name = val.column_name" + 
 	"        LEFT JOIN "+dbObjectPrefix+"[r2chckbox] c" + 
 	"               ON asit.serv_prov_code = c.serv_prov_code" + 
 	"                  AND asit.group_name = c.r1_checkbox_code" + 
 	"                  AND asit.table_name = c.r1_checkbox_type" + 
 	"                  AND asit.column_name = c.r1_checkbox_desc" + 
 	"        LEFT JOIN "+dbObjectPrefix+"[r2chckbox_i18n] ien" + 
 	"               ON c.serv_prov_code = ien.serv_prov_code" + 
 	"                  AND c.res_id = ien.res_id" + 
 	"                  AND ien.lang_id = 'en_US'" + 
 	"        LEFT JOIN "+dbObjectPrefix+"[r2chckbox_i18n] iar" + 
 	"               ON c.serv_prov_code = iar.serv_prov_code" + 
 	"                  AND c.res_id = iar.res_id" + 
 	"                  AND iar.lang_id = 'ar_AE'" + 
 	" 		left JOIN RBIZDOMAIN_VALUE b " + 
 	" 		  on b.BIZDOMAIN_VALUE = val.attribute_value " + 
 	" 		  AND b.serv_prov_code = val.serv_prov_code " + 
 	" 		left JOIN RBIZDOMAIN_VALUE_I18N ddAR " + 
 	" 		  on b.RES_ID = ddAR.RES_ID " + 
 	" 		  AND ddAR.LANG_ID = 'ar_AE' " + 
 	" 		  AND asit.column_type = 5 " + 
	" WHERE per.b1_per_id1 = '"+capId1+"' AND per.b1_per_id2 = '"+capId2+"' AND per.b1_per_id3 ='"+capId3+"' " + 
	" AND asit.REC_STATUS = 'A' " + 
	" AND per.serv_prov_code = '"+aa.getServiceProviderCode()+"' " + 
 	" " + 
 	" 	GROUP BY per.serv_prov_code," + 
 	"        per.b1_alt_id," + 
 	"        per.b1_per_id1," + 
 	"        per.b1_per_id2," + 
 	"        per.b1_per_id3," + 
 	"        asit.group_name," + 
 	"        asit.table_name," + 
 	"        asit.column_name," + 
 	"        asit.column_type," + 
 	"        asit.b1_attribute_value," + 
 	"        asit.b1_display_order," + 
 	"        asit.b1_table_display_order," + 
 	"        val.column_index," + 
 	"        val.row_index," + 
 	"        val.attribute_value," + 
 	"        ien.r1_checkbox_type      ," + 
 	"        ien.r1_checkbox_desc       ," + 
 	"        ien.r1_checkbox_desc_alt   ," + 
 	"        ien.r1_checkbox_desc_alias ," + 
 	"        iar.r1_checkbox_type       ," + 
 	"        iar.r1_checkbox_desc       ," + 
 	"        iar.r1_checkbox_desc_alt   ," + 
 	"        iar.r1_checkbox_desc_alias" + 
 	" 	ORDER  BY asit.b1_table_display_order ASC," + 
 	"           val.row_index ASC," + 
 	"           asit.b1_display_order ASC," + 
 	"           val.column_index ASC" ;
	java.lang.System.out.println("SENDBACK:GETCAPASIDATA ASIT SQL: " + sql);
	return sql;
}

function execQuery(sql) {
	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var utilProcessor = new JavaAdapter(com.accela.aa.datautil.DBResultSetProcessor, {
		processResultSetRow: function(rs) {
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
	var result = dba.select(sql, [], utilProcessor, null);
	ret = result.toArray()
	var data = [];
	for (var x in ret) {
		var o = {};
		for (var y in ret[x]) {
			o[y] = String(ret[x][y])
		}
		data.push(o)
	}
	return data;
}

function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null){
		msg2 = "";
	}else{
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2); 
}