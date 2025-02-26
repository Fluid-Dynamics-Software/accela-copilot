/*------------------------------------------------------------------------------------------------------/
| Program		: REST_EMSE_AUTOCOMPLETE_SC.js
| Event			: 
|
| Usage			: 	returns a 2 dimensional list of values & labels to be used to populate the AJAX autcomplete component: 
|					var listOfFacilities = [[value,label], [value,label], ...];
|					
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: Hisham
| Created at	: 121/05/2019 
/------------------------------------------------------------------------------------------------------*/

var params = aa.env.getValue('params');
logDebug('params: ' + params);
try{
	params = JSON.parse(params);
	var sc = params.sc;
	var term = params.term;
	var lang = params.language;
	term = decodeURIComponent(term);
}
catch(err){
	var sc = params;
}
logDebug('params: ' + params);
logDebug("Result",JSON.stringify(getLookup(sc, term)));
aa.print(JSON.stringify({result: {Result: JSON.stringify(getLookup(sc, term))}}));
aa.env.setValue("Result",JSON.stringify(getLookup(sc, term)));

function getLookup(strControl, partialValue) {
	var actArray = new Array();
	var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);
	
	if (bizDomScriptResult.getSuccess()) {
		bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
		
		for (var i in bizDomScriptArray){
			// this list is sorted the same as the UI, no reason to re-sort
			
			var value = String(bizDomScriptArray[i].getBizdomainValue()).trim();
			var des = String(bizDomScriptArray[i].getDescription()).trim();
			if (bizDomScriptArray[i].getAuditStatus() != 'I') {
				if (value.indexOf(partialValue)>-1 || des.indexOf(partialValue)>-1 ){
					actArray.push([value, des]);
					//logDebug(value + des);				
				}
			}
		}
	}
	
	return actArray;
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
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


function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null){
		msg2 = "";
	}else{
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2); 
}