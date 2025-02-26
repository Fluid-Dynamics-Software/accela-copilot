/*------------------------------------------------------------------------------------------------------/
| Program		: ASB:PLOTSMARKETS/MARKETS/NEW MARKET CONTRACT/ANMC.js
| Event			: ApplicationSubmitBefore
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 14/06/2020 11:11:08
|
/------------------------------------------------------------------------------------------------------*/
/*eval(getScriptText("INCLUDE_ANMC"));
try{
	//var anmc = new ANMC(capId);
	//anmc.onApplicationSubmitBefore();
*/
/*
var docModel = aa.env.getValue('DocumentModelList');
msg1 = "Testing By Hisham. ";
logDebug1("aa.env.getValue('DocumentModelList');: " + docModel + ". ");
logDebug1(msg1);
//printValues(docModel);

var submittedDocList = aa.env.getValue('DocumentModelList');
if (submittedDocList && submittedDocList.size()){
	submittedDocList = submittedDocList.toArray();
	logDebug1("submittedDocList: " + submittedDocList);
	for (s in submittedDocList){
		doc = submittedDocList[s];
		logDebug1("doc: " + doc);
		logDebug1("doc type: " + doc.getClass());
		
	}
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
				logDebug1(object.toString() + " | " + theName + ": " + theValue);
			}
		} catch(e) {
			logDebug1("Error: " + e);
		}
    }
    logDebug1(" ");
}


*/
//msg1 = "";
//logDebug1("About to execute AA_VERIFY_ATTACHMENTS!");
eval(getScriptText("AA_VERIFY_ATTACHMENTS"));

function logDebug1(msg){
	java.lang.System.out.println("Hisham Logging: " + msg);
	//msg1 += msg + "<br>";
}
//comment(msg1);

/*} catch (e) {
	cancel = true;
	showMessage = true;
	comment(e);
}*/