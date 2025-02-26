/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_PROFILEREPORTS.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 13/06/2022 12:38:42
|
/------------------------------------------------------------------------------------------------------*/

if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}
eval(getScriptText("INCLUDE_UTILS"));
function PROFILEREPORTS(capId) {
	Record.call(this, capId);
};
PROFILEREPORTS.prototype = Object.create(Record.prototype);
PROFILEREPORTS.prototype.constructor = PROFILEREPORTS;
PROFILEREPORTS.REPORT_PARAMETER_PAGE = "";

/*-------------------------------------------SPECIFIC CODE----------------------------------------------*/
var language = String(aa.env.getValue("language")).trim();
var reportsTranslation = {
	"Self Declaration Certificate" : {

		translation : {
			"en-US" : "Self Declaration Certificate",
			"ar-AE" : "الإبلاغ عن الامتثال الذاتي"
		}
	},
	"Certificate of Registration" : {
		translation : {

			"en-US" : "Certificate of Registration",
			"ar-AE" : "إفادة بالتسجيل"
		}
	},
	"Entity Details Report" : {
		translation : {

			"en-US" : "Entity Details Report",
			"ar-AE" : "تفاصيل المنشأة"
		}
	},
	"Inspection Report" : {
		translation : {

			"en-US" : "Inspection Report",
			"ar-AE" : "تفاصيل التفتيش"
		}
	},
	"Payment Receipt" : {
		translation : {

			"en-US" : "Payment Receipt",
			"ar-AE" : "وصل الدفع"
		}
	},
	"Payment Report" : {
		translation : {

			"en-US" : "Payment Report",
			"ar-AE" : "تقرير الدفع"
		}
	},
	"POA" : {
		translation : {

			"en-US" : "POA",
			"ar-AE" : "ممثل نظام الشارقة للسلامة والصحة المهنية"
		}
	},
	"Violation Report" : {
		translation : {

			"en-US" : "Violation Report",
			"ar-AE" : "تقرير المخالفات"
		}
	},
	"Certificates" : {
		translation : {

			"en-US" : "Certificates",
			"ar-AE" : "الشهادات"
		}
	},
	"Receipt Report" : {
		translation : {

			"en-US" : "Receipt Report",
			"ar-AE" : "تقرير الدفع المفصل لنظام أمان"
		}
	},
	"Assessment Report" : {
		translation : {

			"en-US" : "Assessment Report",
			"ar-AE" : "تقرير التقييم"
		}
	},
	"DAMAGE REPORT" : {
		translation : {

			"en-US" : "DAMAGE REPORT",
			"ar-AE" : "تقرير اصلاح الضرر وتبديله"
		}
	},
	"Installation Report" : {
		translation : {

			"en-US" : "Installation Report",
			"ar-AE" : "تقرير التركيب"
		}
	},
	"MAINTENANCE REPORT" : {
		translation : {

			"en-US" : "MAINTENANCE REPORT",
			"ar-AE" : "تقرير الصيـانة"
		}
	},
	"QA/QC Report" : {
		translation : {

			"en-US" : "QA/QC Report",
			"ar-AE" : "تقرير مراقبة الجودة - ضمان الجودة"
		}
	},
	"SITE VISIT REPORT" : {
		translation : {

			"en-US" : "SITE VISIT REPORT",
			"ar-AE" : "تقرير زيارة الموقع"
		}
	},
	"Program Inspection Report" : {
		translation : {

			"en-US" : "Program Inspection Report",
			"ar-AE" : "تفاصيل التفتيش"
		}
	},
	"Program Violation Report" : {
		translation : {

			"en-US" : "Program Violation Report",
			"ar-AE" : "تقرير المخالفات"
		}
	}	///////////////////////////////////////////////
	,
	"SALAMA Receipts" : {
		translation : {

			"en-US" : "SALAMA Receipts",
			"ar-AE" : "الايصالات"
		}
	},
	"Invoice" : {
		translation : {

			"en-US" : "Invoice",
			"ar-AE" : "الايصالات"
		}
	},
	"NoC to Establish" : {
		translation : {

			"en-US" : "NoC to Establish",
			"ar-AE" : "تصريح إقامة معهد تدريب"
		}
	},
	"Noc to Operate" : {
		translation : {

			"en-US" : "Noc to Operate",
			"ar-AE" : "تصريح تشغيل معهد تدريب"
		}
	},
	"Visit Report" : {
		translation : {

			"en-US" : "Visit Report",
			"ar-AE" : "تقرير زيارة الموقع"
		}
	},
	"Trainee Certificate" : {
		translation : {

			"en-US" : "Trainee Certificate",
			"ar-AE" : "شهادة استكمال تدريب"
		}
	},
	"NoC to deliver Training /trainer" : {
		translation : {

			"en-US" : "NoC to deliver Training /trainer",
			"ar-AE" : "تصريح مزاولة نشاط تدريب السلامة والصحة المهنية/مدرب"
		}
	},
	"NoC to Deliver Training" : {
		translation : {

			"en-US" : "NoC to Deliver Training",
			"ar-AE" : "تصريح مزاولة نشاط تدريب السلامة والصحة المهنية"
		}
	},
	"Trainer Permit" : {
		translation : {

			"en-US" : "Trainer Permit",
			"ar-AE" : "تصريح مدرب"
		}
	},
	"PRACTITIONER/TRAINER) PERMIT" : {
		translation : {

			"en-US" : "PRACTITIONER/TRAINER) PERMIT",
			"ar-AE" : "تصريح ضابط/مدرب"
		}
	},
	"License" : {
		translation : {

			"en-US" : "License",
			"ar-AE" : "تصريح ضابط/مدرب"
		}
	},
	"Certificate of Compliance" : {
		translation : {

			"en-US" : "Certificate of Compliance",
			"ar-AE" : "شهادة امتثال"
		}
	},
	/////
	"NoC to Deliver a Course" : {
		translation : {

			"en-US" : "NoC to Deliver a Course",
			"ar-AE" : "تصريح مزاولة تدريب السلامة والصحة المهنية"
		}
	},
	"Salama Payment" : {
		translation : {

			"en-US" : "Salama Payment",
			"ar-AE" : "تقرير الدفع سلامة"
		}
	},
	"Trainer Card" : {
		translation : {

			"en-US" : "Trainer Card",
			"ar-AE" : "تصريح ضابط/مدرب"
		}
	},
	"Payment Report (Annual Service Renewal)" : {
		translation : {

			"en-US" : "Payment Report (Annual Service Renewal)",
			"ar-AE" : "تقرير الدفع المفصل لنظام أمان (تجديد الاشتراك)"
		}
	},
	"PRACTITIONER PERMIT" : {
		translation : {
			"en-US" : "Practitioner Permit",
			"ar-AE" : "تصريح ضابط صحة وسلامة مهنية"
		}
	}
};

PROFILEREPORTS.prototype.getProfileReports = function(count,selectedModule) {
	var profileAltID = this.altId;
	eval(getScriptText("INCLUDE_RECORD"));
	var returnValue = [];
	var retVal = [];
	var reportsCount = 0;
	if (count) {
		returnValue = 0;
	}

	language = String(aa.env.getValue("language")).trim();
	
	var recType = this.getCapType();
	var sql = "";
	if (recType == "OSHJ/Projects/Project Profile/PRPL") {
		// sql = "SELECT DISTINCT(P.b1_alt_id) AS ALT_ID ";
		// sql += " FROM BCHCKBOX B ";
		// sql += " INNER JOIN b1permit P ON P.serv_prov_code = B.serv_prov_code
		// ";
		// sql += " AND P.b1_per_id1 = B.b1_per_id1 ";
		// sql += " AND P.b1_per_id2 = B.b1_per_id2 ";
		// sql += " AND P.b1_per_id3 = B.b1_per_id3 ";
		// sql += " WHERE B.B1_CHECKBOX_DESC = 'Project ID' ";
		// sql += " AND B.B1_CHECKLIST_COMMENT = '" + profileAltID + "' ";
		// sql += " AND B1_APPL_CLASS = 'COMPLETE' ";
		// sql += " OR P.b1_alt_id ='" + profileAltID + "'";
		sql += "SELECT DISTINCT( P.b1_alt_id ) AS ALT_ID, bd.B1_CHECKLIST_COMMENT AS Decision , p.B1_PER_CATEGORY AS Category, p.B1_APPL_STATUS AS AppStatus, P.B1_APP_TYPE_ALIAS AS RECORD_TYPE_ALIAS, ar.R1_APP_TYPE_ALIAS AS ARABIC_ALIAS, CAST (P.B1_APPL_STATUS_DATE AS date) AS STATUS_DATE "
		sql += " FROM b1permit P "
		sql += " LEFT JOIN "
		sql += " R3APPTYP app "
		sql += "   on app.SERV_PROV_CODE = P.SERV_PROV_CODE  "
		sql += "   	and app.R1_PER_GROUP = P.B1_PER_GROUP  "
		sql += " 	and app.R1_PER_TYPE = P.B1_PER_TYPE  "
		sql += " 	and app.R1_PER_SUB_TYPE = P.B1_PER_SUB_TYPE  "
		sql += " 	and app.R1_PER_CATEGORY = P.B1_PER_CATEGORY  "
		sql += " LEFT JOIN "
		sql += " 	R3APPTYP_I18N ar  "
		sql += " 	on ar.SERV_PROV_CODE = app.SERV_PROV_CODE  "
		sql += " 	and ar.LANG_ID = 'ar_AE'  "
		sql += " 	and ar.RES_ID = app.RES_ID  "
		sql += " LEFT JOIN bchckbox B "
		sql += " ON P.serv_prov_code = B.serv_prov_code "
		sql += " AND P.b1_per_id1 = B.b1_per_id1 "
		sql += " AND P.b1_per_id2 = B.b1_per_id2 "
		sql += " AND P.b1_per_id3 = B.b1_per_id3 "
		sql += " LEFT JOIN bchckbox BD "
		sql += " ON P.serv_prov_code = BD.serv_prov_code "
		sql += " AND P.b1_per_id1 = BD.b1_per_id1 "
		sql += " AND P.b1_per_id2 = BD.b1_per_id2 "
		sql += " AND P.b1_per_id3 = BD.b1_per_id3 "
		sql += " AND bd.B1_CHECKBOX_DESC = 'Decision Type' "
		sql += " WHERE  B.b1_checkbox_desc = 'Project ID' "
		sql += " AND B.b1_checklist_comment = '" + profileAltID + "' "
		sql += " AND b1_appl_class = 'COMPLETE' "
		sql += " OR P.b1_alt_id = '" + profileAltID + "'  "
	} else if (recType == "OSHJ/Profile/Entity Profile/EPRF") {
		// var sql = "SELECT DISTINCT(P.b1_alt_id) as ALT_ID ";
		// sql += " FROM BCHCKBOX B ";
		// sql += " INNER JOIN b1permit P ON P.serv_prov_code = B.serv_prov_code
		// ";
		// sql += " AND P.b1_per_id1 = B.b1_per_id1 ";
		// sql += " AND P.b1_per_id2 = B.b1_per_id2 ";
		// sql += " AND P.b1_per_id3 = B.b1_per_id3 ";
		// sql += " WHERE B.B1_CHECKBOX_DESC = 'Entity Profile ID' ";
		// sql += " AND B.B1_CHECKLIST_COMMENT = '" + profileAltID + "' ";
		// sql += " AND B1_APPL_CLASS = 'COMPLETE' "
		// sql += " or P.b1_alt_id ='" + profileAltID + "'"
		sql += "SELECT DISTINCT( P.b1_alt_id ) AS ALT_ID, bd.B1_CHECKLIST_COMMENT AS Decision , p.B1_PER_CATEGORY AS Category, p.B1_APPL_STATUS AS AppStatus, P.B1_APP_TYPE_ALIAS AS RECORD_TYPE_ALIAS, ar.R1_APP_TYPE_ALIAS AS ARABIC_ALIAS, CAST (P.B1_APPL_STATUS_DATE AS date) AS STATUS_DATE "
		sql += " FROM   b1permit P "
		sql += " LEFT JOIN "
		sql += " R3APPTYP app "
		sql += "   on app.SERV_PROV_CODE = P.SERV_PROV_CODE  "
		sql += "   	and app.R1_PER_GROUP = P.B1_PER_GROUP  "
		sql += " 	and app.R1_PER_TYPE = P.B1_PER_TYPE  "
		sql += " 	and app.R1_PER_SUB_TYPE = P.B1_PER_SUB_TYPE  "
		sql += " 	and app.R1_PER_CATEGORY = P.B1_PER_CATEGORY  "
		sql += " LEFT JOIN "
		sql += " 	R3APPTYP_I18N ar  "
		sql += " 	on ar.SERV_PROV_CODE = app.SERV_PROV_CODE  "
		sql += " 	and ar.LANG_ID = 'ar_AE'  "
		sql += " 	and ar.RES_ID = app.RES_ID  "
		sql += " LEFT JOIN bchckbox B "
		sql += " ON P.serv_prov_code = B.serv_prov_code "
		sql += " AND P.b1_per_id1 = B.b1_per_id1 "
		sql += " AND P.b1_per_id2 = B.b1_per_id2 "
		sql += " AND P.b1_per_id3 = B.b1_per_id3 "
		sql += " LEFT JOIN bchckbox BD "
		sql += " ON P.serv_prov_code = BD.serv_prov_code "
		sql += " AND P.b1_per_id1 = BD.b1_per_id1 "
		sql += " AND P.b1_per_id2 = BD.b1_per_id2 "
		sql += " AND P.b1_per_id3 = BD.b1_per_id3 "
		sql += " AND bd.B1_CHECKBOX_DESC = 'Decision Type' "
		sql += " LEFT JOIN bchckbox BP "
		sql += " ON P.serv_prov_code = BP.serv_prov_code "
		sql += " AND P.b1_per_id1 = BP.b1_per_id1 "
		sql += " AND P.b1_per_id2 = BP.b1_per_id2 "
		sql += " AND P.b1_per_id3 = BP.b1_per_id3 "
		sql += " AND BP.B1_CHECKBOX_DESC = 'Project ID' "
		sql += " WHERE  ( B.b1_checkbox_desc = 'Entity Profile ID' "
		sql += " AND B.b1_checklist_comment = '" + profileAltID + "' "
		sql += " AND bp.B1_CHECKLIST_COMMENT IS NULL "
		sql += " AND P.b1_appl_class = 'COMPLETE' "
		sql += " OR P.b1_alt_id = '" + profileAltID + "'  )"
		if(selectedModule){
			sql += " AND p.B1_PER_GROUP = '"+selectedModule+"' "			
		}
	} else {
		sql += "SELECT DISTINCT( P.b1_alt_id ) AS ALT_ID, ISNULL(bd.b1_checklist_comment, '') AS Decision , p.B1_PER_CATEGORY AS Category, p.B1_APPL_STATUS AS AppStatus, P.B1_APP_TYPE_ALIAS AS RECORD_TYPE_ALIAS, ar.R1_APP_TYPE_ALIAS AS ARABIC_ALIAS, CAST (P.B1_APPL_STATUS_DATE AS date) AS STATUS_DATE "
		sql += " FROM b1permit P "
		sql += " LEFT JOIN "
		sql += " R3APPTYP app "
		sql += "   on app.SERV_PROV_CODE = P.SERV_PROV_CODE  "
		sql += "   	and app.R1_PER_GROUP = P.B1_PER_GROUP  "
		sql += " 	and app.R1_PER_TYPE = P.B1_PER_TYPE  "
		sql += " 	and app.R1_PER_SUB_TYPE = P.B1_PER_SUB_TYPE  "
		sql += " 	and app.R1_PER_CATEGORY = P.B1_PER_CATEGORY  "
		sql += " LEFT JOIN "
		sql += " 	R3APPTYP_I18N ar  "
		sql += " 	on ar.SERV_PROV_CODE = app.SERV_PROV_CODE  "
		sql += " 	and ar.LANG_ID = 'ar_AE'  "
		sql += " 	and ar.RES_ID = app.RES_ID  "
		sql += " LEFT JOIN bchckbox B "
		sql += " ON P.serv_prov_code = B.serv_prov_code "
		sql += " AND P.b1_per_id1 = B.b1_per_id1 "
		sql += " AND P.b1_per_id2 = B.b1_per_id2 "
		sql += " AND P.b1_per_id3 = B.b1_per_id3 "
		sql += " LEFT JOIN bchckbox BD "
		sql += " ON P.serv_prov_code = BD.serv_prov_code "
		sql += " AND P.b1_per_id1 = BD.b1_per_id1 "
		sql += " AND P.b1_per_id2 = BD.b1_per_id2 "
		sql += " AND P.b1_per_id3 = BD.b1_per_id3 "
		sql += " AND bd.B1_CHECKBOX_DESC = 'Decision Type' "
		sql += " WHERE  b1_appl_class = 'COMPLETE' "
		sql += " AND P.b1_alt_id = '" + profileAltID + "'  "
		sql += " UNION  "
		sql += "SELECT DISTINCT( CHILD.b1_alt_id ) AS ALT_ID, '' AS Decision , CHILD.B1_PER_CATEGORY AS Category, CHILD.B1_APPL_STATUS AS AppStatus, CHILD.B1_APP_TYPE_ALIAS AS RECORD_TYPE_ALIAS, ar.R1_APP_TYPE_ALIAS AS ARABIC_ALIAS, CAST (CHILD.B1_APPL_STATUS_DATE AS date) AS STATUS_DATE "
		sql += " FROM b1permit P " 
		sql += " LEFT JOIN XAPP2REF X " 
		sql += " ON  X.SERV_PROV_CODE=p.SERV_PROV_CODE " 
		sql += " AND X.B1_MASTER_ID1    =p.B1_PER_ID1 " 
		sql += " AND X.B1_MASTER_ID2    =p.B1_PER_ID2 " 
		sql += " AND X.B1_MASTER_ID3    =p.B1_PER_ID3 " 
		sql += " AND p.REC_STATUS  ='A'  " 
		sql += " AND X.REC_STATUS='A'  " 
		//sql += " AND X.B1_RELATIONSHIP = 'R' " 
			
		sql += " LEFT JOIN B1PERMIT CHILD " 
		sql += " ON   CHILD.SERV_PROV_CODE=X.SERV_PROV_CODE " 
		sql += " AND  CHILD.B1_PER_ID1  =X.B1_PER_ID1 " 
		sql += " AND  CHILD.B1_PER_ID2  =X.B1_PER_ID2 " 
		sql += " AND  CHILD.B1_PER_ID3  =X.B1_PER_ID3 " 
		sql += " AND  CHILD.REC_STATUS='A'  " 			
		sql += " LEFT JOIN "
		sql += " R3APPTYP app "
		sql += "   on app.SERV_PROV_CODE = CHILD.SERV_PROV_CODE  "
		sql += "   	and app.R1_PER_GROUP = CHILD.B1_PER_GROUP  "
		sql += " 	and app.R1_PER_TYPE = CHILD.B1_PER_TYPE  "
		sql += " 	and app.R1_PER_SUB_TYPE = CHILD.B1_PER_SUB_TYPE  "
		sql += " 	and app.R1_PER_CATEGORY = CHILD.B1_PER_CATEGORY  "
		sql += " LEFT JOIN "
		sql += " 	R3APPTYP_I18N ar  "
		sql += " 	on ar.SERV_PROV_CODE = app.SERV_PROV_CODE  "
		sql += " 	and ar.LANG_ID = 'ar_AE'  "
		sql += " 	and ar.RES_ID = app.RES_ID  "
		sql += " LEFT JOIN bchckbox B "
		sql += " ON P.serv_prov_code = B.serv_prov_code "
		sql += " AND P.b1_per_id1 = B.b1_per_id1 "
		sql += " AND P.b1_per_id2 = B.b1_per_id2 "
		sql += " AND P.b1_per_id3 = B.b1_per_id3 "
		sql += " LEFT JOIN bchckbox BD "
		sql += " ON P.serv_prov_code = BD.serv_prov_code "
		sql += " AND P.b1_per_id1 = BD.b1_per_id1 "
		sql += " AND P.b1_per_id2 = BD.b1_per_id2 "
		sql += " AND P.b1_per_id3 = BD.b1_per_id3 "
		sql += " AND bd.B1_CHECKBOX_DESC = 'Decision Type' "
		sql += " WHERE  CHILD.b1_appl_class = 'COMPLETE' "
		sql += " AND P.b1_alt_id = '" + profileAltID + "'  "
		if(selectedModule){
			sql += " AND p.B1_PER_GROUP = '"+selectedModule+"' "			
		}
		sql += "  UNION    " 
		sql += " SELECT  " 
		sql += " 	DISTINCT( PER.b1_alt_id ) AS ALT_ID,  " 
		sql += " 	'' AS Decision ,  " 
		sql += " 	PER.B1_PER_CATEGORY AS Category,  " 
		sql += " 	PER.B1_APPL_STATUS AS AppStatus,  " 
		sql += " 	PER.B1_APP_TYPE_ALIAS AS RECORD_TYPE_ALIAS,  " 
		sql += " 	ar.R1_APP_TYPE_ALIAS AS ARABIC_ALIAS,  " 
		sql += " 	CAST (PER.B1_APPL_STATUS_DATE AS date) AS STATUS_DATE   " 
		sql += " FROM " 
		sql += " 	   B3CONTRA Biz  " 
		sql += " 	   INNER JOIN " 
		sql += "   B1PERMIT PER  " 
		sql += " 	  ON Biz.SERV_PROV_CODE = PER.SERV_PROV_CODE  " 
		sql += " 	  AND Biz.B1_PER_ID1 = PER.B1_PER_ID1  " 
		sql += " 	  AND Biz.B1_PER_ID2 = PER.B1_PER_ID2  " 
		sql += " 	  AND Biz.B1_PER_ID3 = PER.B1_PER_ID3 " 
		sql += " 	  AND  Biz.B1_LICENSE_NBR IN ('" + profileAltID.toString() + "')  " 
		sql += "  LEFT JOIN   " 
		sql += "  R3APPTYP app   " 
		sql += "    on app.SERV_PROV_CODE = PER.SERV_PROV_CODE    " 
		sql += "    	and app.R1_PER_GROUP = PER.B1_PER_GROUP    " 
		sql += "  	and app.R1_PER_TYPE = PER.B1_PER_TYPE    " 
		sql += "  	and app.R1_PER_SUB_TYPE = PER.B1_PER_SUB_TYPE    " 
		sql += "  	and app.R1_PER_CATEGORY = PER.B1_PER_CATEGORY    " 
		sql += "  LEFT JOIN   " 
		sql += "  	R3APPTYP_I18N ar    " 
		sql += "  	on ar.SERV_PROV_CODE = app.SERV_PROV_CODE    " 
		sql += "  	and ar.LANG_ID = 'ar_AE'    " 
		sql += "  	and ar.RES_ID = app.RES_ID     " 
		sql += "  WHERE  PER.b1_appl_class = 'COMPLETE'  "
	}
	var result = [];
	if (sql != "") {
		logDebug("[GET_PROFILE_REPORT] returnSql:", sql);
		result = this.runSQL(sql);
		result = result.toArray();
	}/*
		 * else{ var decision = this.getASI("DECISION DETAILS","Decision
		 * Type","") result.push({ "ALT_ID":""+profileAltID,
		 * "CATEGORY":recType.getCategory(), "DECISION":decision,
		 * "APPSTATUS":this.getCapStatus(), "STATUS_DATE":, RECORD_TYPE_ALIAS:
		 * result[x]["RECORD_TYPE_ALIAS"], ARABIC_ALIAS:
		 * result[x]["ARABIC_ALIAS"], }); }
		 */
	if (result.length != 0) {
		// aa.print(result.toArray().length)

		// aa.print(result[0]["ALT_ID"])
		for ( var x in result) {
			var capId = aa.cap.getCapID(result[x]["ALT_ID"]).getOutput()
			var cap = aa.cap.getCap(capId).getOutput();
			var capType = String(cap.getCapType()).split("/")[2];
			var capDate = cap.getFileDate().getYear() + "-"
					+ cap.getFileDate().getMonth() + "-"
					+ cap.getFileDate().getDayOfMonth();

			var reports = this.getReportUrlList(capId, result[x]["CATEGORY"],
					result[x]["DECISION"], result[x]["APPSTATUS"])
			if (count) {
				reportsCount += reports.length;
			} else {
				// aa.print(reports.length)
				for ( var y in reports) {
					var reportName = reports[y].reportName;
					// aa.print("Report Name " + reportName)
					if (retVal.indexOf(reportName) == -1) {
						retVal.push(reportName)
						retVal[reportName] = [];
					}

					var lang = String(aa.env.getValue("language")).trim();
					var recordTypeAlias = result[x]["RECORD_TYPE_ALIAS"];
					var recordTypeAliasArabic = result[x]["ARABIC_ALIAS"];

					var repName = translate(reportName, lang); //reportsTranslation[reportName].translation[lang]
					if (reportName == "Certificate of Registration"
							|| reportName == "Self Declaration Certificate") {

						recordTypeAlias += " - " + repName;
						recordTypeAliasArabic += " - " + repName;
					}
					
					// aa.print("new array "
					// + JSON.stringify(retVal[reportName]))
					retVal[reportName].push({
						ALT_ID : String(capId.getCustomID()),
						RECORD_ID : String(capId),
						// RECORD_TYPE: String(cap.getCapType()),
						reportUrl : reports[y].reportURL,
						OPENED_DATE : result[x]["STATUS_DATE"],
						RECORD_TYPE_ALIAS : recordTypeAlias,// result[x]["RECORD_TYPE_ALIAS"],
						ARABIC_ALIAS : recordTypeAliasArabic,//result[x]["ARABIC_ALIAS"],
						actions : [ {
							"name" : "download",
							"action" : "download",
							"icon" : "bi bi-download",
							"url" : reports[y].reportURL,
							"target" : "_blank",
							"translation" : {
								"ar-AE" : "تحميل"
							}
						} ]
					})
				}
				// var reports = getReportUrlList(capId, retVal)
				// retVal.push({
				// altID : String(capId.getCustomID()),
				// capID : String(capId),
				// capType : String(capType),
				// capDate : String(capDate),
				// reports : reports
				//			
				// });
			}
		}
		if (count) {
			returnValue = reportsCount;
		} else {
			var certArray = []
			for (var z = 0; z < retVal.length; z++) {
				var reportName = retVal[z];

				var repName = translate(reportName, lang); //reportsTranslation[reportName].translation[lang]
				if (reportName == "Certificate of Registration"
						|| reportName == "Self Declaration Certificate") {
					if (certArray.length == 0) {
						certArray = retVal[reportName]
					} else {
						certArray.push(retVal[reportName][0])
					}
				} else {


					returnValue.push({
						reportName : repName,
						dataset : retVal[reportName]
					})
				}
			}

			if (certArray.length > 0) {
				returnValue.push({
					reportName : reportsTranslation["Certificates"].translation[lang],
					dataset : certArray
				})
			}
			returnValue.sort(compare);
		}
	}
	return returnValue;
}

PROFILEREPORTS.prototype.getReports = function(count) {
	var recCapId = this.capId;
	var status = this.getCapStatus();
	var ModuleName = this.getCapType().toString().split('/')[0];
	var reports = [];
	// var reportUrlList = [];
	try {
		var reportWebService = com.accela.webservice.service.ReportWebService();
		var reportButtonInfo4WS = new com.accela.webservice.model.ReportButtonInfoModel4WS();
		var capIDWS = new com.accela.webservice.model.CapIDModel4WS();
		capIDWS.setId1(recCapId.getID1());
		capIDWS.setId2(recCapId.getID2());
		capIDWS.setId3(recCapId.getID3());
		capIDWS.setCustomID(recCapId.getCustomID());
		capIDWS.setServiceProviderCode(recCapId.getServiceProviderCode());
		reportButtonInfo4WS.setCallerID(aa.getAuditID());
		reportButtonInfo4WS.setCapID(capIDWS);
		reportButtonInfo4WS.setCurrentModule(ModuleName);
		reportButtonInfo4WS.setMultipleCaps(false);
		var reportList = reportWebService.getReportButtonProperty(null,
				reportButtonInfo4WS);
		for ( var i in reportList) {
			var report = reportList[i];
			// for(var x in report.getClass().getMethods())
			// {
			// aa.print(report.getClass().getMethods()[x])
			// }

			var buttonName = report.buttonName;
			var errorInfo = report.errorInfo;
			var reportID = report.reportId;
			var reportName = report.reportName;

			// aa.print(reportID + " - " + report.buttonName + " - " +
			// reportName + " - " + errorInfo + " - " + report)
			var rcptNo = 0;

			var isDisplayed = report.isDisplayed;
			if (isDisplayed) {
				var serviceProviderCode = aa.getServiceProviderCode()
				var reportUrl = "";
				if (buttonName == "PRINT_PAYMENT_RECEIPT_REPORT") {
					reportUrl = PROFILEREPORTS.REPORT_PARAMETER_PAGE
							+ "Report/CustomizeReport.aspx?Module="
							+ ModuleName;
					reportUrl += "&reportType=" + buttonName;
					reportUrl += "&RecepitNbr=" + rcptNo;
					reportUrl += "&reportID=" + reportID;
					reportUrl += "&batchTransactionNbr=&ID="
					reportUrl += "&agencyCode=" + serviceProviderCode;
					reportUrl += "&subID1=" + recCapId.getID1();
					reportUrl += "&subID2=" + recCapId.getID2();
					reportUrl += "&subID3=" + recCapId.getID3();
					reportUrl += "&subCustomerID=" + recCapId.getCustomID();

				} else {
					reportUrl = PROFILEREPORTS.REPORT_PARAMETER_PAGE
							+ "Report/CustomizeReport.aspx?Module="
							+ ModuleName;
					reportUrl += "&reportType=" + buttonName;
					reportUrl += "&reportID=" + reportID;
					reportUrl += "&agencyCode=" + serviceProviderCode;
					reportUrl += "&subID1=" + recCapId.getID1();
					reportUrl += "&subID2=" + recCapId.getID2();
					reportUrl += "&subID3=" + recCapId.getID3();
					reportUrl += "&subCustomerID=" + recCapId.getCustomID();
				}
				// aa.print(reportUrl)

				reports.push({
					reportName : String(reportName),
					reportURL : String(reportUrl)
				})
			}
		}
	} catch (e) {
		aa.print("Error in getReportUrlList: " + e);
	}
	if (count){
		return reports.length
	}
	return reports;
}

PROFILEREPORTS.prototype.getReportUrlList = function(recCapId, Category,
		Decision, status) {
	var ModuleName = this.getCapType().toString().split('/')[0];//"OSHJ";//
	var reports = [];
	// var reportUrlList = [];
	try {
		var reportWebService = com.accela.webservice.service.ReportWebService();
		var reportButtonInfo4WS = new com.accela.webservice.model.ReportButtonInfoModel4WS();
		var capIDWS = new com.accela.webservice.model.CapIDModel4WS();
		capIDWS.setId1(recCapId.getID1());
		capIDWS.setId2(recCapId.getID2());
		capIDWS.setId3(recCapId.getID3());
		capIDWS.setCustomID(recCapId.getCustomID());
		capIDWS.setServiceProviderCode(recCapId.getServiceProviderCode());
		reportButtonInfo4WS.setCallerID(aa.getAuditID());
		reportButtonInfo4WS.setCapID(capIDWS);
		reportButtonInfo4WS.setCurrentModule(ModuleName);
		reportButtonInfo4WS.setMultipleCaps(false);
		var reportList = reportWebService.getReportButtonProperty(null,
				reportButtonInfo4WS);
		for ( var i in reportList) {
			var report = reportList[i];
			// for(var x in report.getClass().getMethods())
			// {
			// aa.print(report.getClass().getMethods()[x])
			// }

			var buttonName = report.buttonName;
			var errorInfo = report.errorInfo;
			var reportID = report.reportId;
			var reportName = report.reportName;

			// aa.print(reportID + " - " + report.buttonName + " - " +
			// reportName + " - " + errorInfo + " - " + report)
			//logDebug("REPORTS: ReportName: " + report.reportName + '. ResReportName: ' + report.getResReportName());
			
			var rcptNo = 0;
			if (reportName == 'Payment Receipt') {
				var paymentList = aa.finance.getPaymentByCapID(recCapId,
						aa.util.newQueryFormat()).getOutput();
				if (!(paymentList && paymentList.length > 0)) {
					continue;
				} else {
					rcptNo = paymentList[0].getReceiptNbr();
				}
			} else if (reportName == "Inspection Report") {
				if ((status == "Completed" || status == "Rejected")
						&& Utils.isBlankOrNull(Decision)) {
					continue;
				}

			} else if (reportName == "Violation Report") {
				if (Category != "ESDE") {
					if ((status == "Completed" || status == "Extended" || status == "Rejected")
							&& Utils.isBlankOrNull(Decision)) {
						continue;
					}
				} else {
					if ((status == "Extended") && Utils.isBlankOrNull(Decision)) {
						continue;
					}
				}

			}

			var isDisplayed = report.isDisplayed;
			if (isDisplayed) {
				var serviceProviderCode = aa.getServiceProviderCode()
				var reportUrl = "";
				if (buttonName == "PRINT_PAYMENT_RECEIPT_REPORT") {
					reportUrl = PROFILEREPORTS.REPORT_PARAMETER_PAGE
							+ "Report/CustomizeReport.aspx?Module="
							+ ModuleName;
					reportUrl += "&reportType=" + buttonName;
					reportUrl += "&RecepitNbr=" + rcptNo;
					reportUrl += "&reportID=" + reportID;
					reportUrl += "&batchTransactionNbr=&ID="
					reportUrl += "&agencyCode=" + serviceProviderCode;
					reportUrl += "&subID1=" + recCapId.getID1();
					reportUrl += "&subID2=" + recCapId.getID2();
					reportUrl += "&subID3=" + recCapId.getID3();
					reportUrl += "&subCustomerID=" + recCapId.getCustomID();

				} else {
					reportUrl = PROFILEREPORTS.REPORT_PARAMETER_PAGE
							+ "Report/CustomizeReport.aspx?Module="
							+ ModuleName;
					reportUrl += "&reportType=" + buttonName;
					reportUrl += "&reportID=" + reportID;
					reportUrl += "&agencyCode=" + serviceProviderCode;
					reportUrl += "&subID1=" + recCapId.getID1();
					reportUrl += "&subID2=" + recCapId.getID2();
					reportUrl += "&subID3=" + recCapId.getID3();
					reportUrl += "&subCustomerID=" + recCapId.getCustomID();
				}
				// aa.print(reportUrl)

				reports.push({
					reportName : String(reportName),
					reportURL : String(reportUrl)
				})
			}
		}
	} catch (e) {
		aa.print("Error in getReportUrlList: " + e);
	}

	return reports;
}

PROFILEREPORTS.prototype.runSQL = function(sqlCMD, parameters) {
	var params = [];
	if (arguments.length == 2)
		params = parameters;

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
								record[columnName] = String(new Date(rs
										.getTimestamp(i + 1).getTime())
										.toString("MM/dd/yyyy"));
							} else {
								record[columnName] = String(rs.getObject(i + 1));
							}
						}
					}
					return record;
				}
			});

	var result = dba.select(sqlCMD, params, utilProcessor, null);

	return result;
}
function compare(a, b) {
	if (a.reportName < b.reportName) {
		return -1;
	}
	if (a.reportName > b.reportName) {
		return 1;
	}
	return 0;
}

function translate(reportName, lang){
	if (reportsTranslation[reportName]){
		if (reportsTranslation[reportName].translation[lang]){
			return reportsTranslation[reportName].translation[lang];
		}else{
			return reportName;
		}
	}else{
		return reportName;
	}
	
}