/*------------------------------------------------------------------------------------------------------/
| Program		: CTRCA:OSHJ/USER PROFILE/USER REGISTRATION/USRG.js
| Event			: ConvertToRealCAPAfter
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MDERNAIKA
| Created at	: 11/07/2021 10:54:04
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_USRG"));
try{
	var usrg = new USRG(capId);
	usrg.onConvertToRealCAPAfter();
} catch (e) {
	cancel = true;
	showMessage = true;
	comment(e);
}