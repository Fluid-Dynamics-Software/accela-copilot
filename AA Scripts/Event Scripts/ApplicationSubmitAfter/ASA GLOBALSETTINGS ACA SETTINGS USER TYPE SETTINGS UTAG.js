/*------------------------------------------------------------------------------------------------------/
| Program		: ASA:GLOBALSETTINGS/ACA SETTINGS/USER TYPE SETTINGS/UTAG.js
| Event			: ApplicationSubmitAfter
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 15/10/2018 09:59:49
|
/------------------------------------------------------------------------------------------------------*/
if(publicUser){
	eval(getScriptText("INCLUDE_ACABASE"));
	ACABASE.prototype.execute = function() {
		//TODO: write your script here in case from ACA
	}
	run();
}else{
	eval(getScriptText("INCLUDE_UTAG"));
	try{
		var utag = new UTAG(capId);
		utag.onApplicationSubmitAfter();
	} catch (e) {
		cancel = true;
		showMessage = true;
		comment(e);
	}}