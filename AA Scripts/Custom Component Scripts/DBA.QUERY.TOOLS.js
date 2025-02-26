/*------------------------------------------------------------------------------------------------------/
| Program		: DBA.QUERY.TOOLS.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 01/03/2022 17:39:02
|
/------------------------------------------------------------------------------------------------------*/

var lang = com.accela.i18n.I18NContext.getI18NModel().getLanguage();
try{
	var isRtl = lang=="ar_AE"?true:false;
}catch(err){
	var isRtl = false;
}


function getStandardChoiceI18N(sd, isRtl){	//isRtl is optional, if not provided, the Drop Down returns with both English and Arabic Values
	var finalDropDown = [];
	var originalLanguage = com.accela.i18n.I18NContext.getI18NModel().getLanguage();

	com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
	var dropdowns = Record.getStandardChoices(sd);
	//aa.print(engDD);
	for (var e in dropdowns){
		var engValue = str(dropdowns[e].getBizdomainValue());
		var araValue = str(dropdowns[e].getDispBizdomainValue());	
		
		if (isRtl){
			finalDropDown.push({value:engValue, text:araValue, textAR:araValue});
		}else{
			finalDropDown.push({value:engValue, text:engValue, textAR:araValue});
		}
		//aa.print(engValue+": " + araValue);
	}
	com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLanguage);
	return finalDropDown;
}


function getTranslatedDDValue(sd, value){
	var ret = value;
	var originalLanguage = com.accela.i18n.I18NContext.getI18NModel().getLanguage();
	if (originalLanguage == "en_US") {
		com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
	}
	try{
		ret = aa.bizDomain.getBizDomainByValue(sd, value).getOutput().getDispBizdomainValue();
	}catch(err){
		ret = value;
	}
	if (originalLanguage == "en_US") {
		com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLanguage);
	}
	return ret;
}


function getSearchSQL(searchFilter) {
	var fullSql = [];
	var selectSql = "";
	var sql = "";
	java.lang.System.out.println("=searchFiltersearchFilter " + searchFilter);
	if (searchFilter != "" && searchFilter != null) {
		searchFilter = JSON.parse(searchFilter);
		for ( var name in searchFilter) {
			var value = searchFilter[name];
			if (value == '--Select--'){
				continue;
			}
			if (str(value) && str(value) !=="0"){
				if (name == "ALTID") {
					sql += " AND PER.B1_ALT_ID LIKE '" + value + "%' ";

				} else {
					if (name == "INCIDENT DATE" || name == "SEIZURE DATE"
							|| name == "DATE OF BIRTH") {
						var dateArray = String(value).split("/");
						var formatDate = dateArray[1] + "/" + dateArray[0] + "/"
								+ dateArray[2];

						value = formatDate;
					}
					var wordArray = String(name.toLowerCase()).split(" ");
					var asiField = "";
					var isFirst = true;
					for (var i = 0; i < wordArray.length; i++) {
						var word = wordArray[i];
						word = word.charAt(0).toUpperCase() + word.slice(1);
						if (isFirst) {
							asiField += word
							isFirst = false;
						} else {
							asiField += " " + word
						}
					}

					var prefix = String(asiField).replace(/\s/g, "").replace(
							/[^a-zA-Z]/g, "")
					sql += " AND " + prefix + ".B1_CHECKLIST_COMMENT LIKE N'"
							+ value + "%' "
				}			
			}
		}
	}
	//java.lang.System.out.println("=ZAKARIA-SEIZUR " + sql);
	return sql
}

function getDocumentList(recCap, docIDs, capCategory) {
	recCap = String(recCap).split('-');

	var sql = " SELECT B.DOC_SEQ_NBR, B.DOC_CATEGORY, B.DOC_NAME, B.FILE_NAME, B.FILE_UPLOAD_BY, B.FILE_UPLOAD_DATE, B.DOC_STATUS_DATE, B.DOC_STATUS, B.DOC_COMMENT, B.URL, B.DOC_DESCRIPTION FROM BDOCUMENT B ";
	sql += " WHERE ";
	sql += " B.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "' ";
	sql += " AND B.B1_PER_ID1 = '" + recCap[0] + "'";
	sql += " AND B.B1_PER_ID2 = '" + recCap[1] + "'";
	sql += " AND B.B1_PER_ID3 = '" + recCap[2] + "'";		

		
	java.lang.System.out.println("=== EXT_CUSTOM_HANDLEEVENTS: docIDs ==> " + docIDs);
	if (docIDs){
		docIDs = String(docIDs).trim();
		if (docIDs.length){
			sql += " AND B.DOC_SEQ_NBR IN (" + docIDs + ") ";			
		}
	}
	java.lang.System.out.println("=== EXT_CUSTOM_HANDLEEVENTS: sql ==> " + sql);
	var aadba = aa.proxyInvoker.newInstance("com.accela.aa.datautil.AADBAccessor").getOutput();
	var aadba = aadba.getInstance();
	var result = aadba.select(sql, null);

	var docListArray = new Array();
	if (result.size() > 0) {
		for (i = 0; i < result.size(); i++) {
			var documentModel = aa.document.getDocumentByPK(result.get(i)[0]).getOutput();
			docListArray.push(
				{
					document: documentModel,
					"DOC_SEQ_NBR" : result.get(i)[0],
					"DOC_CATEGORY": result.get(i)[1],
					"DOC_NAME": result.get(i)[2],
					"FILE_NAME": result.get(i)[3],
					"FILE_UPLOADED_BY": result.get(i)[4],
					"FILE_UPLOAD_DATE": result.get(i)[5],
					"DOC_STATUS_DATE": result.get(i)[6],
					"DOC_STATUS": result.get(i)[7],
					"DOC_COMMENT": result.get(i)[8],
					"URL": result.get(i)[9],
					"DESCRIPTION": result.get(i)[10]
				});
		}
	}

	return docListArray;
}

function getRecordsSQL(fields, recordTypes, statuses, workflowTasks, conditions, searchFilter) {

	var params = [];

	var sql = "SELECT PER.B1_ALT_ID AS ALTID,PER.B1_APPL_STATUS AS APPSTATUS, i.STATUS AS APPSTATUS_AR,   ";
/*
 * 
	var service = com.accela.aa.emse.dom.service.CachedService.getInstance().getOrganizationService();
	var model = service.getDepartmentByUserInfo(aa.getServiceProviderCode(), aa.getAuditID().toUpperCase());
	var key = model.getDeptKey();
	//var exludedDpt = [ 'ADCA/NA/INSP/DIRECTOR/MANAGER/NA/NA', 'ADCA/NA/INSP/DIRECTOR/MANAGER/HOS/NA', 'ADCA/NA/INSP/DIRECTOR/MANAGER/HOS/SUPER' ];
	
	if (exludedDpt.indexOf(String(key)) >= 0 || statuses) {
		if (lang == 'ar_AE') {
			sql += " , (CASE WHEN ISNULL(G3S_I18N.GA_FNAME,'') <> '' THEN ISNULL(G3S_I18N.GA_FNAME,'') + (CASE WHEN  ISNULL(G3S_I18N.GA_FNAME,'') <> '' AND ISNULL(G3S_I18N.GA_LNAME,'') <> '' THEN  ' ' ELSE '' END ) +  ISNULL(G3S_I18N.GA_LNAME,'') "
					+ " ELSE ISNULL(G.GA_FNAME,'')  + CASE WHEN  ISNULL(G.GA_FNAME,'') <> '' AND ISNULL(G.GA_LNAME,'') <> '' THEN  ' ' ELSE '' END + "
					+ " ISNULL(G.GA_LNAME,'') "
					+ " END )'INSPECTOR' ";
		} else {
			sql += " , ISNULL(G.GA_FNAME,'')  + CASE WHEN  ISNULL(G.GA_FNAME,'') <> '' AND ISNULL(G.GA_LNAME,'') <> '' THEN  ' ' ELSE '' END + "
					+ " ISNULL(G.GA_LNAME,'') 'INSPECTOR'"
		}
	}*/


	for ( var i in fields) {
		var fieldObj = fields[i];
		var asiField = fieldObj.name;
		var asiGroup = fieldObj.subgroup;
		var field = String(asiField).replace(/\s/g, "").replace(/[^a-zA-Z]/g, "")
		sql += "," + field + ".B1_CHECKLIST_COMMENT '" + asiField + "' ";
		sql += "," + field + ".B1_CHECKBOX_IND '" + asiField + "_FIELDTYPE' ";
		sql += "," + field + "_x.BIZDOMAIN '" + asiField + "_SDNAME' ";
		/*if (lang == 'ar_AE') {
			sql += ",(CASE WHEN ISNULL(" + field + "_i.BIZDOMAIN_VALUE,'') <> '' THEN " + field + "_i.BIZDOMAIN_VALUE ELSE " + field + ".B1_CHECKLIST_COMMENT  END) '" + asiField
					+ "' ";
		} else {
			sql += "," + field + ".B1_CHECKLIST_COMMENT '" + asiField + "' ";
		}*/
	}

	sql += " FROM B1PERMIT PER ";
	sql += " LEFT JOIN GPROCESS WKF  ON "
	sql += " PER.SERV_PROV_CODE = WKF.SERV_PROV_CODE AND PER.B1_PER_ID1 = WKF.B1_PER_ID1 AND PER.B1_PER_ID2 = WKF.B1_PER_ID2 AND PER.B1_PER_ID3 = WKF.B1_PER_ID3 "
	sql += " AND WKF.SD_CHK_LV1 = 'Y' AND WKF.SD_CHK_LV2  = 'N' AND WKF.REC_STATUS = 'A'"
	sql += " LEFT JOIN G6ACTION G ON "
	sql += " PER.SERV_PROV_CODE = G.SERV_PROV_CODE AND PER.B1_PER_ID1 = G.B1_PER_ID1 AND PER.B1_PER_ID2 = G.B1_PER_ID2 AND PER.B1_PER_ID3 = G.B1_PER_ID3  "
	sql += " AND G.REC_STATUS = 'A' ";
	sql += " LEFT JOIN [APP_STATUS_GROUP] a " + 
			" ON per.APP_STATUS_GROUP_CODE = a.APP_STATUS_GROUP_CODE " + 
			" AND per.B1_APPL_STATUS = a.STATUS "
			+ " AND per.SERV_PROV_CODE = a.SERV_PROV_CODE " + 
			" AND a.REC_STATUS = 'A' " + 
			" LEFT JOIN [APP_STATUS_GROUP_I18N] i " + 
			" ON a.RES_ID = i.RES_ID "
			+ " AND a.SERV_PROV_CODE = i.SERV_PROV_CODE " + 
			" AND i.REC_STATUS = 'A' " + 
			" AND i.LANG_ID = 'ar_AE' ";

	for ( var k in groups) {
		var subGroups = groups[k];
		for ( var groupName in subGroups) {
			var fields = subGroups[groupName];
			for ( var x in fields) {
				var asiFeild = fields[x];
				sql += getASISQL(groupName, asiFeild);
			}
		}
	}
	
/*
	if (exludedDpt.indexOf(String(key)) >= 0 || statuses) {
		if (lang == "ar_AE") {
			sql += " LEFT OUTER JOIN G3STAFFS G3S ON ";
			sql += " G.SERV_PROV_CODE = G3S.SERV_PROV_CODE ";
			sql += " AND G.GA_USERID = G3S.GA_USER_ID ";
			sql += " AND G3S.REC_STATUS = 'A' ";
			sql += " LEFT OUTER JOIN G3STAFFS_I18N G3S_I18N ON ";
			sql += " G3S.SERV_PROV_CODE = G3S_I18N.SERV_PROV_CODE ";
			sql += " AND G3S.RES_ID = G3S_I18N.RES_ID ";
			sql += " AND G3S_I18N.LANG_ID = 'ar_AE' ";
		}
	}	
	*/
	sql += "WHERE PER.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "' "
	sql += "AND PER.B1_PER_GROUP = 'Licenses' AND PER.B1_PER_TYPE = 'Inspection' AND PER.B1_PER_SUB_TYPE = 'Vehicle Inspection' AND PER.B1_PER_CATEGORY = 'ITURV' ";
	sql += "AND PER.REC_STATUS = 'A' ";
	sql += "AND (PER.B1_APPL_CLASS is null or PER.B1_APPL_CLASS = 'COMPLETE' or PER.B1_APPL_CLASS = 'EDITABLE') ";
	//sql += "AND G.G6_ACT_DES in ('Vehicle Inspection','Assistant Inspection') ";
/*
	if (statuses) {

	} else {
		sql += " AND WKF.SD_PRO_DES = 'Result Inspection' ";
	}
*/
	// Status List
	if (statuses) {
		for ( var s in statuses) {
			var status = statuses[s];
			if (s == 0) {
				sql += " AND ( ";
			}
			sql += " UPPER(PER.B1_APPL_STATUS) = '" + status + "' ";
			if (statuses.length == parseInt(s) + 1) {
				sql += " ) ";
			} else {
				sql += " OR ";
			}
		}
	}

	//if user department is supervisor then ignore the below condition
	/*if (exludedDpt.indexOf(String(key)) < 0 && !statuses) {
		sql += "AND G.GA_USERID = '" + aa.getAuditID().toUpperCase() + "' "
	}*/

	/*var centerCode = ADCABASE.getEmployeeID(aa.getAuditID().toUpperCase());
	if (searchFilter && searchFilter != "") {
		var filter = JSON.parse(searchFilter);
		if (filter["Center Code"] && filter["Center Code"] != "") {
			centerCode = filter["Center Code"];
			delete filter["Center Code"];
			searchFilter = JSON.stringify(filter);
		}
	}
	centerCode = centerCode.replace(/\s/g, '');
	if (centerCode) {
		var centers = centerCode.split('=');
		if (centers.length > 1) {
			sql += " AND CustomsCenter.B1_CHECKLIST_COMMENT in (";
			for (var c = 0; c <= centers.length; c++) {
				sql += "'" + Record.getBizDomainByDescription('SD_CENTRE', centers[c]) + "'";
				if (c != centers.length) {
					sql += ",";
				}
			}
			sql += ") ";
		} else if (centers.length == 1) {
			var center = Record.getBizDomainByDescription('SD_CENTRE', centerCode);
			sql += " AND CustomsCenter.B1_CHECKLIST_COMMENT = '" + center + "' ";
		}

	}*/

	sql += getSearchFilterSQL(searchFilter);
	java.lang.System.out.println("=vehiclesql " + sql);
	return sql;
}

function getASITStructureByGroupCode(groupCode) {
	
	// Get Record Type from GroupCode so we can use it to retrieve ASIT DropDown values by Record Type 
	// (because the one that retrieves by ASICODE alone doesn't work for ASITs for some reason, only ASIs)

	var ASISQL = "SELECT Isnull(l.template_code, r.r1_checkbox_code) AS GROUP_CODE, "
	ASISQL += " r3.R1_PER_GROUP + '/' + r3.R1_PER_TYPE + '/' + r3.R1_PER_SUB_TYPE + '/' + r3.R1_PER_CATEGORY AS RECORD_TYPE, "
	ASISQL += " Isnull(l.template_type, r.r1_checkbox_type) AS SUBGROUP_NAME, "
	ASISQL += " r.r1_checkbox_ind AS FIELD_TYPE, "
	ASISQL += " Isnull(groupEN.alternative_label , r.r1_checkbox_type) AS SUBGROUP_ALIAS_EN, "
	ASISQL += " Isnull(groupAR.alternative_label , fieldNameAR.R1_CHECKBOX_TYPE) AS SUBGROUP_ALIAS_AR, "
	ASISQL += " r.r1_checkbox_desc  AS FIELD_NAME, "
	ASISQL += " fieldNameAR.r1_checkbox_desc AS FIELD_NAME_AR, "
	ASISQL += " r.R1_ATTRIBUTE_VALUE_REQ_FLAG REQUIRED_FLAG,"
	ASISQL += " r.r1_display_order DISPLAY_ORDER, "
	ASISQL += " r.r1_group_display_order AS GRP_ORDER,"
	ASISQL += " r.vch_disp_flag, "
	ASISQL += " r.R1_ATTRIBUTE_VALUE AS DEFAULT_VALUE "				
	ASISQL += " FROM   [r2chckbox] r "
	ASISQL += " LEFT JOIN [R2CHCKBOX_I18N] fieldNameAR "
	ASISQL += " ON r.SERV_PROV_CODE = fieldNameAR.SERV_PROV_CODE "
	ASISQL += " AND r.res_id = fieldNameAR.res_id "
	ASISQL += " AND fieldNameAR.LANG_ID = 'ar_AE' "
	ASISQL += " LEFT JOIN [rtemplate_layout_config] l "
	ASISQL += " ON r.SERV_PROV_CODE = l.SERV_PROV_CODE "
	ASISQL += " AND r.r1_checkbox_code = l.template_code "
	ASISQL += " AND r.r1_checkbox_type = l.template_type "
	ASISQL += " LEFT JOIN [rtemplate_layout_config_i18n] groupEN "
	ASISQL += " ON l.res_id = groupEN.res_id "
	ASISQL += " AND l.serv_prov_code = groupEN.serv_prov_code "
	ASISQL += " AND l.rec_status = 'A' "
	ASISQL += " AND groupEN.lang_id = 'en_US' "
	ASISQL += " LEFT JOIN [rtemplate_layout_config_i18n] groupAR  "
	ASISQL += " ON l.res_id = groupAR.res_id  "
	ASISQL += " AND l.serv_prov_code = groupAR.serv_prov_code "
	ASISQL += " AND l.rec_status = 'A'  "
	ASISQL += " AND groupAR.lang_id = 'ar_AE' "
		
	ASISQL += " LEFT JOIN [R3APPTYP] r3  "
	ASISQL += " ON r.R1_CHECKBOX_CODE = r3.R1_CHCKBOX_CODE  "
	ASISQL += " AND r.serv_prov_code = r3.serv_prov_code "
	ASISQL += " AND r3.rec_status = 'A'  "
	ASISQL += " WHERE  r.R1_CHECKBOX_CODE = '" + groupCode + "' AND r.rec_status = 'A'  "
	ASISQL += " and r.R1_CHECKBOX_GROUP  = 'FEEATTACHEDTABLE' "
	ASISQL += " ORDER BY GRP_ORDER,DISPLAY_ORDER"
	
	logDebug("SQL For ASIT:", ASISQL);
	var asiData = execQuery(ASISQL);
	
	var asis = {};
	for ( var i in asiData) {
		var asiFieldRow = asiData[i];
		var recordType = asiFieldRow["RECORD_TYPE"] + "";
		var groupCode = asiFieldRow["GROUP_CODE"] + "";
		var groupName = asiFieldRow["SUBGROUP_NAME"] + "";
		var groupNameEN = asiFieldRow["SUBGROUP_ALIAS_EN"] + "";
		var groupNameAR = asiFieldRow["SUBGROUP_ALIAS_AR"] + "";
		var fieldName = asiFieldRow["FIELD_NAME"] + "";
		var fieldNameAR = asiFieldRow["FIELD_NAME_AR"] + "";
		var fieldType = asiFieldRow["FIELD_TYPE"] + "";
		var isRequired = asiFieldRow["REQUIRED_FLAG"] + "";
		var order = asiFieldRow["DISPLAY_ORDER"] + "";
		var value = asiFieldRow["DEFAULT_VALUE"] + "";
		//var grpOrder=asiFieldRow["GRP_ORDER"]+ "";
		
		if (!groupNameAR){
			groupNameAR = groupName;
		}
		var asiField = {
			"name" : fieldName,
			"subgroup" : groupName,
			"subgroupEN" : groupNameEN,
			"subgroupAR": groupNameAR,
			"fieldNameEN" : fieldName,
			"fieldNameAR" : fieldNameAR,
			"fieldType" : fieldType,
			"isRequired" : isRequired,
			"value": value,
			"order" : order
		};

		if (fieldType == 5) {
			var dd = getDropDownValuesI18N(recordType, groupName, fieldName, "ASIT");
			asiField["dropdownValues"] = dd.en;
			asiField["dropdownValues_AR"] = dd.ar;	
		}
		if (!asis[groupName]) {
			asis[groupName] = {
				"fields" : [ asiField ],
				"name" : groupName,
				"nameEN" : groupNameEN,
				"nameAR" : groupNameAR
			};
		} else {
			asis[groupName].fields.push(asiField);
		}
	}
	return asis;

}

function getASIStructure(groupCode, module, userGroup) {
	var ASISQL = "SELECT Isnull(l.template_code, r.r1_checkbox_code) AS GROUP_CODE, "
	ASISQL += " Isnull(l.template_type, r.r1_checkbox_type) AS SUBGROUP_NAME, "
	ASISQL += " r.r1_checkbox_ind AS FIELD_TYPE, "
	ASISQL += " Isnull(groupEN.alternative_label , r.r1_checkbox_type) AS SUBGROUP_ALIAS_EN, "
	ASISQL += " groupAR.alternative_label                   AS SUBGROUP_ALIAS_AR, "
	ASISQL += " r.r1_checkbox_desc  AS FIELD_NAME, "
	ASISQL += " fieldNameAR.r1_checkbox_desc AS FIELD_NAME_AR, "
	ASISQL += " r.R1_ATTRIBUTE_VALUE_REQ_FLAG REQUIRED_FLAG,"
	ASISQL += " r.r1_display_order DISPLAY_ORDER, "
	ASISQL += " r.r1_group_display_order AS GRP_ORDER, "
	ASISQL += " r.vch_disp_flag, "
	ASISQL += " COALESCE( "
	ASISQL += " (select sec.right_granted from XPOLICY SEC "
	ASISQL += " left join PPROV_GROUP G "
	ASISQL += " on G.SERV_PROV_CODE = SEC.SERV_PROV_CODE  "
	ASISQL += " AND cast(G.GROUP_SEQ_NBR as nvarchar) = SEC.LEVEL_DATA "
	ASISQL += " where SEC.SERV_PROV_CODE = L.SERV_PROV_CODE "
	ASISQL += " AND SEC.DATA5 = Isnull(l.template_code, r.r1_checkbox_code) "
	ASISQL += " AND SEC.DATA1 = 'ASI' "
	ASISQL += " AND SEC.DATA3 = Isnull(l.template_type, r.r1_checkbox_type) "
	ASISQL += " AND SEC.DATA4 = r.r1_checkbox_desc "
	ASISQL += " AND SEC.LEVEL_TYPE = 'Group' "
	ASISQL += " and (G.DISP_TEXT = '" + userGroup + "'  "
	ASISQL += " or sec.LEVEL_DATA = '" + module + "' "
	ASISQL += " ) "
	ASISQL += " ), "
	ASISQL += " (select sec.right_granted from XPOLICY SEC "
	ASISQL += " left join PPROV_GROUP G "
	ASISQL += " on G.SERV_PROV_CODE = SEC.SERV_PROV_CODE  "
	ASISQL += " AND cast(G.GROUP_SEQ_NBR as nvarchar) = SEC.LEVEL_DATA "
	ASISQL += " where SEC.SERV_PROV_CODE = L.SERV_PROV_CODE "
	ASISQL += " AND SEC.DATA5 = Isnull(l.template_code, r.r1_checkbox_code) "
	ASISQL += " AND SEC.DATA1 = 'ASI' "
	ASISQL += " AND SEC.DATA3 = Isnull(l.template_type, r.r1_checkbox_type) "
	ASISQL += " AND SEC.DATA4 = r.r1_checkbox_desc "
	ASISQL += " AND SEC.LEVEL_TYPE = 'Module' "
	ASISQL += " and (G.DISP_TEXT = '" + userGroup + "'  "
	ASISQL += " or sec.LEVEL_DATA = '" + module + "' "
	ASISQL += " ) "
	ASISQL += " ), "
	ASISQL += " (select sec.right_granted from XPOLICY SEC "
	ASISQL += " left join PPROV_GROUP G "
	ASISQL += " on G.SERV_PROV_CODE = SEC.SERV_PROV_CODE  "
	ASISQL += " AND cast(G.GROUP_SEQ_NBR as nvarchar) = SEC.LEVEL_DATA "
	ASISQL += " where SEC.SERV_PROV_CODE = L.SERV_PROV_CODE "
	ASISQL += " AND SEC.DATA5 = Isnull(l.template_code, r.r1_checkbox_code) "
	ASISQL += " AND SEC.DATA1 = 'ASI' "
	ASISQL += " AND SEC.DATA3 = Isnull(l.template_type, r.r1_checkbox_type) "
	ASISQL += " AND SEC.DATA4 is null "
	ASISQL += " AND SEC.LEVEL_TYPE = 'Group' "
	ASISQL += " and (G.DISP_TEXT = '" + userGroup + "'  "
	ASISQL += " or sec.LEVEL_DATA = '" + module + "' "
	ASISQL += " ) "
	ASISQL += " ), "
	ASISQL += " (select sec.right_granted from XPOLICY SEC "
	ASISQL += " left join PPROV_GROUP G "
	ASISQL += " on G.SERV_PROV_CODE = SEC.SERV_PROV_CODE  "
	ASISQL += " AND cast(G.GROUP_SEQ_NBR as nvarchar) = SEC.LEVEL_DATA "
	ASISQL += " where SEC.SERV_PROV_CODE = L.SERV_PROV_CODE "
	ASISQL += " AND SEC.DATA5 = Isnull(l.template_code, r.r1_checkbox_code) "
	ASISQL += " AND SEC.DATA1 = 'ASI' "
	ASISQL += " AND SEC.DATA3 = Isnull(l.template_type, r.r1_checkbox_type) "
	ASISQL += " AND SEC.DATA4 is null "
	ASISQL += " AND SEC.LEVEL_TYPE = 'Module' "
	ASISQL += " and (G.DISP_TEXT = '" + userGroup + "'  "
	ASISQL += " or sec.LEVEL_DATA = '" + module + "' "
	ASISQL += " ) "
	ASISQL += " ), "
	ASISQL += " (select sec.right_granted from XPOLICY SEC "
	ASISQL += " left join PPROV_GROUP G "
	ASISQL += " on G.SERV_PROV_CODE = SEC.SERV_PROV_CODE "
	ASISQL += " AND cast(G.GROUP_SEQ_NBR as nvarchar) = SEC.LEVEL_DATA "
	ASISQL += " where SEC.SERV_PROV_CODE = L.SERV_PROV_CODE "
	ASISQL += " AND SEC.DATA5 = Isnull(l.template_code, r.r1_checkbox_code) "
	ASISQL += " AND SEC.DATA1 = 'ASI' "
	ASISQL += " AND SEC.DATA3 IS NULL "
	ASISQL += " AND SEC.DATA4 IS NULL "
	ASISQL += " AND SEC.LEVEL_TYPE = 'Group' "
	ASISQL += " and (G.DISP_TEXT = '" + userGroup + "'  "
	ASISQL += " or sec.LEVEL_DATA = '" + module + "' "
	ASISQL += " ) "
	ASISQL += " ), "
	ASISQL += " (select sec.right_granted from XPOLICY SEC "
	ASISQL += " left join PPROV_GROUP G "
	ASISQL += " on G.SERV_PROV_CODE = SEC.SERV_PROV_CODE "
	ASISQL += " AND cast(G.GROUP_SEQ_NBR as nvarchar) = SEC.LEVEL_DATA "
	ASISQL += " where SEC.SERV_PROV_CODE = L.SERV_PROV_CODE "
	ASISQL += " AND SEC.DATA5 = Isnull(l.template_code, r.r1_checkbox_code) "
	ASISQL += " AND SEC.DATA1 = 'ASI' "
	ASISQL += " AND SEC.DATA3 IS NULL "
	ASISQL += " AND SEC.DATA4 IS NULL "
	ASISQL += " AND SEC.LEVEL_TYPE = 'Module' "
	ASISQL += " and (G.DISP_TEXT = '" + userGroup + "'  "
	ASISQL += " or sec.LEVEL_DATA = '" + module + "' "
	ASISQL += " ) "
	ASISQL += " ) "
	ASISQL += " ) AS FIELD_SECURITY "
	ASISQL += " FROM   [r2chckbox] r "
	ASISQL += " LEFT JOIN [R2CHCKBOX_I18N] fieldNameAR "
	ASISQL += " ON r.SERV_PROV_CODE = fieldNameAR.SERV_PROV_CODE "
	ASISQL += " AND r.res_id = fieldNameAR.res_id "
	//ASISQL += " AND r.r1_checkbox_type = fieldNameAR.R1_CHECKBOX_TYPE "  
	//ASISQL += " AND r.r1_checkbox_desc = fieldNameAR.r1_checkbox_desc "
	ASISQL += " AND fieldNameAR.LANG_ID = 'ar_AE' "
	ASISQL += " LEFT JOIN [rtemplate_layout_config] l "
	ASISQL += " ON r.SERV_PROV_CODE = l.SERV_PROV_CODE "
	ASISQL += " AND r.r1_checkbox_code = l.template_code "
	ASISQL += " AND r.r1_checkbox_type = l.template_type "
	ASISQL += " LEFT JOIN [rtemplate_layout_config_i18n] groupEN "
	ASISQL += " ON l.res_id = groupEN.res_id "
	ASISQL += " AND l.serv_prov_code = groupEN.serv_prov_code "
	ASISQL += " AND l.rec_status = 'A' "
	ASISQL += " AND groupEN.lang_id = 'en_US' "
	ASISQL += " LEFT JOIN [rtemplate_layout_config_i18n] groupAR  "
	ASISQL += " ON l.res_id = groupAR.res_id  "
	ASISQL += " AND l.serv_prov_code = groupAR.serv_prov_code "
	ASISQL += " AND l.rec_status = 'A'  "
	ASISQL += " AND groupAR.lang_id = 'ar_AE' "
	ASISQL += " WHERE  r.R1_CHECKBOX_CODE = '" + groupCode + "' AND r.rec_status = 'A'  "
	ASISQL += " AND l.entity_type = 'ASI'  "
	ASISQL += " AND l.CONF_LEVEL = 'TEMPLATENAME' "
	ASISQL += " and r.R1_CHECKBOX_GROUP  = 'APPLICATION' "
	ASISQL += "ORDER BY GRP_ORDER,DISPLAY_ORDER"

	var asiData = execQuery(ASISQL);
	var asis = {};
	for ( var i in asiData) {
		var asiFieldRow = asiData[i];
		var groupCode = asiFieldRow["GROUP_CODE"] + "";
		var groupName = asiFieldRow["SUBGROUP_NAME"] + "";
		var groupNameEN = asiFieldRow["SUBGROUP_ALIAS_EN"] + "";
		var groupNameAR = asiFieldRow["SUBGROUP_ALIAS_AR"] + "";
		var fieldName = asiFieldRow["FIELD_NAME"] + "";
		var fieldNameAR = asiFieldRow["FIELD_NAME_AR"] + "";
		var fieldType = asiFieldRow["FIELD_TYPE"] + "";
		var isRequired = asiFieldRow["REQUIRED_FLAG"] + "";
		var order = asiFieldRow["DISPLAY_ORDER"] + "";
		var security = asiFieldRow["FIELD_SECURITY"] + "";
		var asiField = {
			"name" : fieldName,
			"subgroup" : groupName,
			"fieldNameEN" : fieldName,
			"fieldNameAR" : fieldNameAR,
			"fieldType" : fieldType,
			"isRequired" : isRequired,
			"order" : order,
			"security" : security
		};

		if (fieldType == 5) {
			var dd = getDropDownValuesByGroupCodeI18N(groupCode, groupName, fieldName);
			asiField["dropdownValues"] = dd.en;
			asiField["dropdownValues_AR"] = dd.ar;			
/*			var asiService = com.accela.aa.emse.dom.service.CachedService.getInstance().getAppSpecificInfoService();
			var dropDownList = asiService.getRefAppSpecDropDownList(aa.getServiceProviderCode(), groupCode, groupName, "APPLICATION", fieldName, aa.getAuditID());
			if (dropDownList) {
				var values = new Array();
				for (var k = 0; k < dropDownList.size(); k++) {
					var downdown = dropDownList.get(k);
					var value = downdown.getAttrValue();
					values.push(value + "")
				}
				asiField["dropdownValues"] = values;
			}
			
			// Get Arabic Drop Downs
			var originalLang = lang;
			com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
			var asiService = com.accela.aa.emse.dom.service.CachedService.getInstance().getAppSpecificInfoService();
			var dropDownList = asiService.getRefAppSpecDropDownList(aa.getServiceProviderCode(), groupCode, 
					groupName, "APPLICATION", fieldName,aa.getAuditID());
			if(dropDownList){
				var values = new Array();
				for(var k =0;k<dropDownList.size();k++){
					var downdown = dropDownList.get(k);
					var value = downdown.getDispAttrValue();
					values.push(value + "")
				}
				asiField["dropdownValues_AR"] = values;
			}
			com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLang);*/			
		}

		
		if (!asis[groupName]) {
			asis[groupName] = {
				"fields" : [ asiField ],
				"name" : groupName,
				"nameEN" : groupNameEN,
				"nameAR" : groupNameAR
			};
		} else {
			asis[groupName].fields.push(asiField);
		}
	}
	return asis;

}
function translateDropDownValues(array, recordType, groupName, fieldName, type, isRtl){
	if (isRtl){
		translated = getDropDownValuesArabic(recordType, groupName, fieldName, type);		
	}else{
		translated = {};
	}
	
	var d = [];
	for (var a in array){
		var value = String(array[a]).trim();
		var text = isRtl?String(translated[value]).trim():value;
		d.push({value: value, text: text});
	}
	return d;
}

function getDropDownValuesArabic(recordType, groupName, fieldName, type){
	
	if (type){
		if (type=="ASI"){
			type = "APPLICATION";
		}else{
			type = "FEEATTACHEDTABLE";
		}
	}else{
		type = "APPLICATION";
	}
		
	if (typeof $refAsi == "undefined"){
		eval(getScriptText("INCLUDE_ACCLIB"));
	}
	//var dd = {value:text, value2:text2};
	var dd = {};
	var originalLang = lang;
	com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
	var b = $refAsi.getByRecordTypeFormatted(recordType, type, {
		"removeEmptyGroups" : true
	});
	for (var a in b){
		//aa.print(a);
		var t = b[a];
		var f = t.fieldList;
		//aa.print(t.groupName);
		if (t.groupName == groupName){
			for (var i in f){
				//aa.print(Object.keys(f[i]));
				var c = f[i].valueList;
				if (String(f[i].fieldLabel).toUpperCase() == String(fieldName).toUpperCase()){
					if (f[i].fieldType == 5){
						for (var x in c){
							//aa.print(c[x]);
							var d = c[x];
							//aa.print(d.value);
							//aa.print(d.text);
							dd[String(d.value).trim()] = String(d.text).trim();
							/*for (var y in d){
								aa.print(y);
								aa.print(d[y]);
								
							}*/
						}			
					}					
				}
			}
		}
	}
	com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLang);
	return dd;
}

function getDropDownValuesI18N(recordType, groupName, fieldName, type){
	
	if (type){
		if (type=="ASI"){
			type = "APPLICATION";
		}else{
			type = "FEEATTACHEDTABLE";
		}
	}else{
		type = "APPLICATION";
	}
		
	if (typeof $refAsi == "undefined"){
		eval(getScriptText("INCLUDE_ACCLIB"));
	}
	var dd = {en:[],ar:[]};
	
	var originalLang = lang;
	com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
	var b = $refAsi.getByRecordTypeFormatted(recordType, type, {
		"removeEmptyGroups" : true
	});
	for (var a in b){
		//aa.print(a);
		var t = b[a];
		var f = t.fieldList;
		//aa.print(t.groupName);
		if (t.groupName == groupName){
			for (var i in f){
				//aa.print(Object.keys(f[i]));
				var c = f[i].valueList;
				if (f[i].fieldLabel == fieldName){
					if (f[i].fieldType == 5){
						for (var x in c){
							//aa.print(c[x]);
							var d = c[x];
							//aa.print(d.value);
							//aa.print(d.text);
							dd.en.push(String(d.value).trim());
							dd.ar.push(String(d.text).trim());
							/*for (var y in d){
								aa.print(y);
								aa.print(d[y]);
								
							}*/
						}			
					}					
				}
			}
		}
	}
	com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLang);
	return dd;
}

function getDropDownValuesByGroupCodeI18N(groupCode, groupName, fieldName, type){
	
	if (type){
		if (type=="ASI"){
			type = "APPLICATION";
		}else{
			type = "FEEATTACHEDTABLE";
		}
	}else{
		type = "APPLICATION";
	}
	
	if (typeof $refAsi == "undefined"){
		eval(getScriptText("INCLUDE_ACCLIB"));
	}
	var dd = {en:[],ar:[]};
	
	var originalLang = lang;
	com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
	var b = $refAsi.getByGroupFormatted(groupCode, type, {
	       removeEmptyGroups : true
	});
	for (var a in b){
		//aa.print(a);
		var t = b[a];
		var f = t.fieldList;
		//aa.print(t.groupName);
		if (t.groupName == groupName){
			for (var i in f){
				//aa.print(Object.keys(f[i]));
				var c = f[i].valueList;
				if (f[i].fieldLabel == fieldName){
					if (f[i].fieldType == 5){
						for (var x in c){
							//aa.print(c[x]);
							var d = c[x];
							//aa.print(d.value);
							//aa.print(d.text);
							dd.en.push(String(d.value).trim());
							dd.ar.push(String(d.text).trim());
							/*for (var y in d){
								aa.print(y);
								aa.print(d[y]);
								
							}*/
						}			
					}					
				}
			}
		}
	}
	com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLang);
	return dd;
}

function execQuery(sql) {
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
						//columnName = columnName.toUpperCase()
						result = rs.getObject(i + 1);
						if (result == null) {
							record[columnName] = String("");
						} else {
							if (result.getClass
									&& result.getClass().getName() == "java.sql.Timestamp") {

								record[columnName] = String(new Date(rs
										.getTimestamp(i + 1).getTime())
										.toString("dd/MM/yyyy"));
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
	for ( var x in ret) {
		var o = {};
		for ( var y in ret[x]) {
			o[y] = String(ret[x][y])
		}
		data.push(o)
	}
	return data;
}

function processExecQueryEnhanced(strQry, params, start, limit, handler) {
	//var startTime = new Date().getTime();
	start = parseInt(start, 10);
	limit = parseInt(limit, 10);
	var count = 0;
	var pagination = false;
	logDebug("Start: " + start);
	logDebug("Limit: " + limit);
	
	var top = "";	//,COUNT(*) OVER () as TotalCount
	var distinct = "";
	if ((typeof start!=="undefined" && typeof start!=="null" && start!=="") || limit){
		if (limit){
			top = limit;
		}
		if (!start){
			start = 0;
		}
		pagination = true;
		
		// Add TOP 100 PERCENT at the query to enable sorting inside the subquery
		selectPosition = strQry.indexOf("SELECT");
//		
		if (selectPosition>-1){
			topPosition = strQry.substring(selectPosition, selectPosition + 30);
			if (topPosition.indexOf(" TOP ")==-1){

				var distinctPosition = strQry.indexOf(" DISTINCT ");
				if (distinctPosition>-1){
					strQry = strQry.replace(" DISTINCT ", " ");
					distinct = " DISTINCT ";
				}
				strQry = [strQry.slice(0, selectPosition+6), distinct + " TOP 100 ", strQry.slice(selectPosition+6)].join('');
			}
		}
		var startPos = 0;
		var endPos = false;
		var ordering = " ORDER BY(SELECT NULL) ";
		var orderByPosition = strQry.toUpperCase().lastIndexOf("ORDER BY");
		var groupByPosition = strQry.toUpperCase().lastIndexOf("GROUP BY");
		
		if (orderByPosition>-1){
			startPos = orderByPosition;
			if (groupByPosition>-1 && groupByPosition>orderByPosition){
				endPos = groupByPosition;
			}	
			ordering = strQry.substring(startPos, (endPos?endPos:undefined));
		}
			
		strQry = "SELECT * FROM ( " + strQry;
		
		strQry += " ) AS T1TEMP "+ ordering +" OFFSET "+start+" ROWS FETCH NEXT "+top+" ROWS ONLY";
	}
	var ret = executeQuery(strQry, params);
	/*var jrows = [];
	if (!limit || limit == 0 || limit == "" || limit == "undefined") {
		jrows = ret;
	} else {
		for (r in ret) {
			if (r >= start && jrows.length < limit) {
				if (handler) {
					handler(ret[r])
				}
				jrows.push(ret[r]);
			}
			if (jrows.length > limit) {
				break;
			}
		}
	}*/

	/*var endTime = new Date().getTime();
	var time = (endTime - startTime) / 1000;*/
	
	if (pagination){
		if (ret.length){
			count = ret[0].TOTALCOUNT;
		}
	}else{
		count = ret.length;
	}
	
	java.lang.System.out.println("^^^^ SQL Query: " + strQry);
	var response = {};
	response.data = ret;
	response.total = count;
	return response

}


function processExecQuery(strQry, params, start, limit, handler) {
	//var startTime = new Date().getTime();
	start = parseInt(start, 10);
	limit = parseInt(limit, 10);
	var count = 0;
	var pagination = false;
	logDebug("Start: " + start);
	logDebug("Limit: " + limit);
	
	var top = "";	//,COUNT(*) OVER () as TotalCount
	var distinct = "";
	if ((typeof start!=="undefined" && typeof start!=="null" && start!=="") || limit){
		if (limit){
			top = limit;
		}
		if (!start){
			start = 0;
		}
		pagination = true;
		
		// Add TOP 100 PERCENT at the query to enable sorting inside the subquery
		selectPosition = strQry.indexOf("SELECT");
		
		if (selectPosition>-1){
			topPosition = strQry.substring(selectPosition, selectPosition + 30);
			if (topPosition.indexOf(" TOP ")==-1){

				var distinctPosition = strQry.indexOf(" DISTINCT ");
				if (distinctPosition>-1){
					strQry = strQry.replace(" DISTINCT ", " ");
					distinct = " DISTINCT ";
				}
				strQry = [strQry.slice(0, selectPosition+6), distinct + " TOP 100 PERCENT ", strQry.slice(selectPosition+6)].join('');
			}
		}
		var startPos = 0;
		var endPos = false;
		var ordering = " ORDER BY(SELECT NULL) ";
		var orderByPosition = strQry.toUpperCase().lastIndexOf("ORDER BY");
		var groupByPosition = strQry.toUpperCase().lastIndexOf("GROUP BY");
		
		if (orderByPosition>-1){
			startPos = orderByPosition;
			if (groupByPosition>-1 && groupByPosition>orderByPosition){
				endPos = groupByPosition;
			}	
			ordering = strQry.substring(startPos, (endPos?endPos:undefined));
		}
			
		strQry = "SELECT *, COUNT(*) OVER () as TotalCount FROM ( " + strQry;
		
		strQry += " ) AS T1TEMP "+ordering+" OFFSET "+start+" ROWS FETCH NEXT "+top+" ROWS ONLY";
	}
	var ret = executeQuery(strQry, params);
	/*var jrows = [];
	if (!limit || limit == 0 || limit == "" || limit == "undefined") {
		jrows = ret;
	} else {
		for (r in ret) {
			if (r >= start && jrows.length < limit) {
				if (handler) {
					handler(ret[r])
				}
				jrows.push(ret[r]);
			}
			if (jrows.length > limit) {
				break;
			}
		}
	}*/

	/*var endTime = new Date().getTime();
	var time = (endTime - startTime) / 1000;*/
	// aa.print("//time=" + time + "s")
	if (pagination){
		if (ret.length){
			count = ret[0].TOTALCOUNT;
		}
	}else{
		count = ret.length;
	}
	
	logDebug("^^^^ SQL Query: " + strQry);
	var response = {};
	response.data = ret;
	response.total = count;
	return response

}

function executeQuery(sql, params) {
	var strd = "";
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

								record[columnName] = str(new Date(rs
										.getTimestamp(i + 1).getTime())
										.toString("dd/MM/yyyy"));
							} else {

								if (columnName == "INCIDENT DATE"
										//|| columnName == "SEIZURE DATE"
										|| columnName == "DATE OF BIRTH" || columnName == "LAST CHANGE DATE" || columnName == "MODIFIED ON") {
									var value = str(rs.getObject(i + 1))
									if (value) {
										var array = str(value).split("/");
										record[columnName] = array[1] + "/"
												+ array[0] + "/" + array[2];
									} else {
										record[columnName] = value;
									}

								} else {
									record[columnName] = str(rs
											.getObject(i + 1));
									//logDebug("columnName:" + columnName, columnName.substring(columnName.length - 5));
									
									var sChoice = str(columnName).substring(str(columnName).length - 7);
									//logDebug("sChoice:" + sChoice, String(columnName));
									if (sChoice == "_SDNAME"){
										var colName = str(columnName).substring(0, str(columnName).length - 7);
										var fieldType = record[colName+"_FIELDTYPE"];
										logDebug("_FIELDTYPE:" + colName+"_FIELDTYPE", fieldType);
										if (fieldType == "5"){
											var dropdownValue = record[colName];
											var standardChoice = record[colName+"_SDNAME"];
											record[columnName+"_AR"] = dropdownValue;
											logDebug("dropdownValue:" + dropdownValue, standardChoice);
											if (dropdownValue && standardChoice){
												record[colName+"_AR"] = getTranslatedDDValue(standardChoice, dropdownValue);
												logDebug("dropdownValue:", record[columnName+"_AR"]);
											}
										}
									}
								}

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

if (!String.prototype.replaceAll) {
	Object.defineProperty(String.prototype, 'replaceAll', {
		enumerable: false,
		value: function (find, replace) {
			var theString = String(this);
			if (theString) {
				return theString.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
			} else {
				return theString;
			}
		}
	});
}

function emp(value) {
	if (!value || value == "null" || value == "undefined") {
		value = ""
	}
	return value + "";
}

function str(msg){
	if (msg == "null" || msg == "undefined" || typeof msg == "null" || typeof msg == "undefined") {
		msg = "";
	}
	return String(msg).trim();
}

var logDebug = function(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null) {
		msg2 = "";
	} else {
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2);
};