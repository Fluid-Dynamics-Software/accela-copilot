/*------------------------------------------------------------------------------------------------------/
| Rule 			: 114:On Submit from AA set Creator ACA Public User V3.1.0
| Rule 			: 1772:MRPW_ASA_UPDATEDBYAPPLICANT V3.0.0
| Rule 			: 2133:MRPW_ASA_CREATE_ADDRESS V2.0.0
| Rule 			: 2632:MRPW_Generate _Cutom_ID V1.0.0
| Program		: ASA.BRE:BUILDINGMAINT/MAINTENANCE/MAINT REQUEST, PERFORM WORK/MRPW
| Event			: ApplicationSubmitAfter
|
| Usage			:
| Notes			: auto generated  Script by Business Rule Engine
| Published by	: NOOR
| Published at	: 03/05/2021 09:17:24
|
/------------------------------------------------------------------------------------------------------*/


/**
 * RULE NAME: On Submit from AA set Creator ACA Public User
 * RULE ID: 114
 * RULE VERSION: 3.1.0
 */
if ( !this.isPublicUser()){
CTX.RULEID =114;
/** BRE GENERATED SCRIPT*/
if(this.recordAPI.getCapModel().getCreatedByACA()=="N"&&this.Record.ActiveTask=='Initial Review'){
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.recordAPI.copyContacts(new Record(this.Record.ASI['contractid']))\nvar capRes = aa.cap.getCapBasicInfo(this.recordAPI.getCapID());\nif (!capRes.getSuccess())\n{\n  throw capRes.getErrorMessage();\n}\nvar capModel = capRes.getOutput();\nif (!capModel) \n{\n  throw 'Could not get capModel for ' + this.recordAPI.getCapID() ;\n}\ncapModel = capModel.getCapModel();\n\nvar publicUser ='';\n\nvar contactList  = this.recordAPI.getContacts();\nif(contactList && contactList.length>0){\n  try{\n      var poepleModel = contactList[0].getCapContactModel().getPeople();\n      var refContact = contactList[0].getCapContactModel().getRefContactNumber();\n      var puserList = aa.publicUser.getPublicUserListByContactNBR(parseInt(refContact)).getOutput();\n      if(puserList&& puserList.size()>0){\n      publicUser = 'PUBLICUSER'+puserList.get(0).getUserSeqNum();\n      capModel.setCreatedBy(publicUser);  \n      }\n    }catch(e){}\n}\naa.cap.editCapByPK(capModel);\nthis.recordAPI.addParent(this.Record.ASI['contractid'])","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true});
	}
	else{
	}
}

/**
 * RULE NAME: MRPW_ASA_UPDATEDBYAPPLICANT
 * RULE ID: 1772
 * RULE VERSION: 3.0.0
 */
if ( this.isPublicUser()){
CTX.RULEID =1772;
/** BRE GENERATED SCRIPT*/
//execute Declare Variable appStatus
this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getCapStatus()","RuntineVarName":"appStatus","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
if(this.Runtime['appStatus']=='Waiting on Contractor'){
		//execute Update Record Status
		this.executeAction('UPDATERECORDSTATUS',{"Status":"'Review Initial WO'","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Activate Task
		this.executeAction('ACTIVATETASK',{"TaskName":"this.Record.TASKS['WO Follow Up']","DeactivateCurrent":true,"STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute MRPW
		this.executeAction('DECLAREVAR',{"Value":"this.recordAPI.getInstance(\"INCLUDE_MRPW\", \"MRPW\")","RuntineVarName":"MRPW","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.Runtime['MRPW'].copyFinalWOASIT();","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.Runtime['MRPW'].validateFinalWOASIT();","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}
}

/**
 * RULE NAME: MRPW_ASA_CREATE_ADDRESS
 * RULE ID: 2133
 * RULE VERSION: 2.0.0
 */
CTX.RULEID =2133;
/** BRE GENERATED SCRIPT*/
//execute Run EMSE
this.executeAction('RUNEMSE',{"script":"this.recordAPI.createAddressFromStdChoice();","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});


/**
 * RULE NAME: MRPW_Generate _Cutom_ID
 * RULE ID: 2632
 * RULE VERSION: 1.0.0
 */
CTX.RULEID =2632;
/** BRE GENERATED SCRIPT*/
if(this.recordAPI.getCapStatus()=="Submitted"){
		//execute Run EMSE
		this.executeAction('RUNEMSE',{"script":"this.recordAPI.generateMRPWMaskCustomeID();","RuntineVarName":"ScriptResult","STOPONERROR":true,"CANCELEVENT":true,"RECORDTYPE":"","RECORDID":""});
	}
	else{
	}