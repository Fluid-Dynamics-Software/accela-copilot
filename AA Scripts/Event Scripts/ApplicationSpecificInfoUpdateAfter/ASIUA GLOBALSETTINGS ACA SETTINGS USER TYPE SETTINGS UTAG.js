/*------------------------------------------------------------------------------------------------------/
| Program		: ASIUA:GLOBALSETTINGS/ACA SETTINGS/USER TYPE SETTINGS/UTAG.js
| Event			: ApplicationSpecificInfoUpdateAfter
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 22/10/2018 14:51:12
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_UTAG"));
try{
	logDebug("Starting ALT ID Update");
	var utag = new UTAG(capId);
	logDebug("Cap", utag);
	utag.onApplicationSpecificInfoUpdateAfter();
} catch (e) {
	cancel = true;
	showMessage = true;
	comment(e);
}