/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_COAC_SITESDETAILS_FILLFROMPARENT.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 12/07/2023 14:57:31
|
/------------------------------------------------------------------------------------------------------*/

try {
	    eval(getScriptText("COMMON_PAGEFLOW_FUNCTIONS"));
	    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
	    if (typeof COAC === "undefined")
		{
			eval(getScriptText("INCLUDE_COAC"));
		}  
	    
	 var coac = new COAC(capModel.getCapID());
	 coac.copyASITFromParentACA();	 

} catch (e) {

    aa.env.setValue("ErrorCode", "-2");
    aa.env.setValue("ErrorMessage", "Error: " + e);

}
