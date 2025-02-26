/*------------------------------------------------------------------------------------------------------/
| Program		: ASB:CHALETS/PLAN SERVICES/ADD CHALET LAND/ACLA.js
| Event			: ApplicationSubmitBefore
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 14/12/2018 16:09:20
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_ACLA"));
try{
	if ( capId != null){
		var acla = new ACLA(capId);
		acla.onApplicationSubmitBefore();
	}
} catch (e) {
	cancel = true;
	showMessage = true;
	comment(e);
}