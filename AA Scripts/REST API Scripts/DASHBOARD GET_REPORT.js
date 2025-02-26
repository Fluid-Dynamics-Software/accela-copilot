/*------------------------------------------------------------------------------------------------------/
| Program		: DASHBOARD:GET_REPORT.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 13/12/2021 11:21:59
|
/------------------------------------------------------------------------------------------------------*/

/* 
var reportName = 'Chalet Contract License';
var theLocale ='en-US'
var capID1 = '17CAP';
var capID2 = '00000';
var capID3 = '0007D';
var user="admin";
 */
var altId = aa.env.getValue("altId");
var reportName =  aa.env.getValue("reportName");
var reportParameters = aa.util.newHashMap();
var capId =  aa.cap.getCapID(altId).getOutput();
var agencyid =  aa.getServiceProviderCode();
var reportParams = null;
if (!reportName || String(reportName).trim()==""){
	var params = aa.env.getValue("params");
	params = JSON.parse(params);
	reportName = params.reportName;
	reportParams = params.reportParams;
	
}
if (reportParams){
	for (var r in reportParams){
		logDebug("Report Parameters: " + r, reportParams[r]);
		reportParameters.put(String(r), String(reportParams[r]));	
	}
}else{
	reportParameters.put(String("agencyid"), String(agencyid));	
	reportParameters.put(String("recordid"), String(altId));
	reportParameters.put(String("capid"), String(capId));
	
}

var fileContent = downloadReportContent(reportName, capId, reportParameters);


if (fileContent){
    var base64Bytes = new java.io.ByteArrayOutputStream();
    var base64Obj = aa.proxyInvoker.newInstance("sun.misc.BASE64Encoder").getOutput();
    base64Obj.encode(fileContent, base64Bytes);
    var base64StrEncodedPDF = new Packages.java.lang.String(base64Bytes);
}else{
    var base64StrEncodedPDF = "";
}

// java.lang.System.out.print("GET_REPORT fileContent__ => "+ base64StrEncodedPDF);

//aa.print(base64StrEncodedPDF);
aa.env.setValue("fileContent", base64StrEncodedPDF);
aa.env.setValue("Success", true);

function downloadReportContent(reportName, capId, parameters) {


    var capModel = aa.cap.getCap(capId).getOutput().getCapModel();


    var CurrCapModule=capModel.getModuleName();
    var report = aa.reportManager.getReportInfoModelByName(reportName).getOutput();
    if(report) {
        report.setModule(CurrCapModule);
        report.setCapId(capId);
        report.setReportParameters(parameters);
        report.getReportInfoModel().setCallerId("ADMIN") 
        var reportModel = report.getReportInfoModel();
        var reportBiz = aa.proxyInvoker.newInstance("com.accela.v360.reports.proxy.ReportBusiness").getOutput();
        var result = reportBiz.handleReport(reportModel); 
        var finalReport = result.getContent();
        //aa.print(finalReport);
        return finalReport;
    }else{
        return null;
    }
}


function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null){
		msg2 = "";
	}else{
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2); 
}


// var Parameter1Value= String(capId.getCustomID());

// if (reportName == "Preview Invoices"){
// 	var Parameter2Name= String('capID');
// 	var Parameter2Value= String(altId);
	
// 	var Parameter4Name= String('invoicenbr');
// 	var invoicesRes = aa.finance.getInvoiceByCapID(capId, null).getOutput();
// 	var Parameter4Value= String(invoicesRes[0].getInvNbr());
// 	reportParameters.put(Parameter4Name, Parameter4Value);
// }else{
// 	var Parameter2Name= String('capid');	
// 	var Parameter2Value= String(capId);
// }

// var Parameter3Name= String('agencyid');
// var Parameter3Value= String('MOTA');


// if (reportName != "Preview Invoices"){
// 	reportParameters.put(Parameter1Name, Parameter1Value);	
// }
// reportParameters.put(Parameter2Name, Parameter2Value);
// reportParameters.put(Parameter3Name, Parameter3Value);