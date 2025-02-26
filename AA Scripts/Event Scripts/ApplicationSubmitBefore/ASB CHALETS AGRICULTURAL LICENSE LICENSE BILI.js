/*------------------------------------------------------------------------------------------------------/
| Program		: ASB:CHALETS/AGRICULTURAL LICENSE/LICENSE/BILI.js
| Event			: ApplicationSubmitBefore
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HJAMOUS
| Created at	: 22/07/2018 11:17:40
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_BILI"));
try{
	var bili = new BILI(capId);
	bili.onApplicationSubmitBefore();
} catch (e) {
	cancel = true;
	showMessage = true;
	comment(e);
}