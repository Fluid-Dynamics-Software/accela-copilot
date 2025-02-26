/*------------------------------------------------------------------------------------------------------/
| Program		: EXEC_SCRIPT.js
| Event		: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: SLEIMAN
| Created at	: 28/10/2015 10:13:37
|
/------------------------------------------------------------------------------------------------------*/
/*-USER-----------DATE----------------COMMENTS----------------------------------------------------------/
| SABA            29/04/2018 12:37:41 Merging changes with ADMA Project
/-----END CHANGE LOG-----------------------------------------------------------------------------------*/


try {

	var cls = "com.accela.aa.emse.emse.EMSEBusiness";
	var proxy = aa.proxyInvoker.newInstance(cls).getOutput();

	var htparams = aa.env.getValue("SCRIPT_PARAMS");
	var ht = aa.util.newHashtable();

	if (htparams != null && htparams != "") {
		if (htparams.getClass().getName() == "[Lcom.accela.ws.model.EMSEModel4WS;") {
			for (var x = 0; x < htparams.length; x++) {
				var p = htparams[x];
				if (p != null && p.getKey() != null && p.getValue() != null) {
					ht.put(p.getKey(), p.getValue())
				}

			}
		} else {
			ht.putAll(htparams);
		}

	}
	var scriptText = aa.env.getValue("SCRIPT_TEXT");

	var htResult = proxy.testScript(scriptText, aa.getServiceProviderCode(), ht, "admin", true);
	var ret = htResult.get("ScriptReturnDebug");
	aa.print(ret)
	aa.env.setValue("SCRIPT_RESULT", ret)
} catch (e) {
	aa.print("ERROR: " + e)
}