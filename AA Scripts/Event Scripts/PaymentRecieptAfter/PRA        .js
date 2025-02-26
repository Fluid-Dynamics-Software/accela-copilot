/*------------------------------------------------------------------------------------------------------/
| Program		: PRA:Global.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 02/11/2021 16:02:10
|
/------------------------------------------------------------------------------------------------------*/

try{
	eval(getScriptText('INCLUDE_GLOBALNOTIFICATIONS'));
	var gn = new GlobalNotifications();
	gn.sendNotification('PRA',"*","*");	
}catch(err){
	logDebug("Error on Notification in PRA:*/*/*/*, capId: " + capId, err);
}