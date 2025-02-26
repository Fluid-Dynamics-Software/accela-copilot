/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_ERCL_REQUEST_DETAILS_ON_LOAD.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: RSA
| Created at	: 14/11/2021 12:00:06
|
/------------------------------------------------------------------------------------------------------*/

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance(
			"com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName,
				"ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
eval(getScriptText("INCLUDE_ACABASE"));
eval(getScriptText("INCLUDE_SPSABASE"));
ACABASE.prototype.execute = function() {
	try {
		var capModel = this.getCapModel();
		var orgType = this.getFieldValue('Organization Type');
		var arabicName = this.getFieldValue('Entity Name in Arabic')
		var englishName = this.getFieldValue('Entity Name in English')
		
			var capId = capModel.getCapID();
		var customId = capId.getCustomID();
		var record = new Record(capId);
		if (record.getCapStatus() == null) {
		var sql = "SELECT count(P.b1_alt_id) as c ";
		sql += "FROM   BCHCKBOX B ";
		sql += "INNER JOIN b1permit P ";
		sql += "   ON P.serv_prov_code = B.serv_prov_code ";
		sql += "      AND P.b1_per_id1 = B.b1_per_id1 ";
		sql += "      AND P.b1_per_id2 = B.b1_per_id2 ";
		sql += "      AND P.b1_per_id3 = B.b1_per_id3 ";
		sql += "WHERE P.b1_alt_id != '" + customId + "' and  ((B.b1_per_type = 'Profile' ";
		sql += "AND B.b1_per_sub_type = 'Entity Profile' ";
		sql += "AND B.b1_act_status = 'EPRF') ";
		sql += "or ";
		sql += "( B.b1_per_type = 'Classification' ";
		sql += "AND B.b1_per_sub_type = 'Entity Registration' ";
		sql += "AND B.b1_act_status = 'ERCL')) ";
		sql += "and B.B1_CHECKBOX_TYPE = 'ENTITY DETAILS' ";
		sql += "AND ( (B.b1_checkbox_desc = 'Entity Name in Arabic' ";
			sql += "AND B.b1_checklist_comment = N'" + arabicName.replace("'", "\''") + "') or (B.b1_checkbox_desc = 'Entity Name in English' ";
				sql += " AND B.b1_checklist_comment = N'" + englishName.replace("'", "\''") + "' )) ";
		sql += "and P.B1_ALT_ID in (SELECT P.b1_alt_id ";
		sql += "FROM   BCHCKBOX B ";
		sql += "INNER JOIN b1permit P ";
		sql += "   ON P.serv_prov_code = B.serv_prov_code ";
		sql += "      AND P.b1_per_id1 = B.b1_per_id1 ";
		sql += "      AND P.b1_per_id2 = B.b1_per_id2 ";
		sql += "      AND P.b1_per_id3 = B.b1_per_id3 ";
		sql += "  WHERE (B.b1_per_type = 'Profile' ";
		sql += "  AND B.b1_per_sub_type = 'Entity Profile' ";
		sql += "  AND B.b1_act_status = 'EPRF') ";
		sql += "  AND B.B1_CHECKBOX_TYPE = 'REQUEST DETAILS' ";
		sql += "  AND B.B1_CHECKBOX_DESC = 'Organization Type' ";
		sql += "  AND B.B1_CHECKLIST_COMMENT = '" + orgType + "' ";
		sql += "  AND P.B1_APPL_CLASS = 'COMPLETE')";

		var count = 0;
		var data = SPSABASE.runSQL(sql);

		if (data != null) {
			data = data.toArray();
			if (data.length > 0) {
				count = data[0]["C"];
			}
		}
		
		if (count > 0) {
			this.showMessage(aa.messageResources
							.getLocalMessage("ERCL_ENTITY_ARABIC_NAME_VALIDATION"));
		}
		}

	} catch (e) {
		this.showMessage("ERROR:" + e, e + "");
	}
}
run();