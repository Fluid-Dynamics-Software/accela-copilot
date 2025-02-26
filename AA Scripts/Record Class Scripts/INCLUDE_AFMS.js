/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_AFMS.js
| Event			: N/A
|
| Usage			: contains all the record's specific script
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: HFANGARY
| Created at	: 28/11/2018 16:22:48
|
/------------------------------------------------------------------------------------------------------*/
if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}
function AFMS(capId) {
	Record.call(this, capId);
};
AFMS.prototype = Object.create(Record.prototype);
AFMS.prototype.constructor = AFMS;
/*----------------------------------------------------ASI-----------------------------------------------*/
AFMS.RECORD_TYPE = "GlobalSettings/General Settings/Attachments To Fields Mapping/AFMS";
AFMS.ASI = {};
AFMS.ASI.general = {};
AFMS.ASI.general.TableName = "GENERAL";
AFMS.ASI.general.recordType = "Record Type";

/*----------------------------------------------------ASIT----------------------------------------------*/
AFMS.ASIT = {};
AFMS.ASIT.asiAttachments = {};
AFMS.ASIT.asiAttachments.TableName = "ASI ATTACHMENTS";
AFMS.ASIT.asiAttachments.asiGroup = "ASI Group";
AFMS.ASIT.asiAttachments.asiFields = "ASI Fields";
AFMS.ASIT.asiAttachments.documentType = "Document Type";

AFMS.ASIT.asitAttachments = {};
AFMS.ASIT.asitAttachments.TableName = "ASIT ATTACHMENTS";
AFMS.ASIT.asitAttachments.asitGroup = "ASIT Group";
AFMS.ASIT.asitAttachments.documentType = "Document Type";

/*-------------------------------------------SPECIFIC CODE----------------------------------------------*/

eval(getScriptText("CLASS_ASIT_NAVIGATOR"));

var fieldTranslations = {
		"Date of validity of the authorized signatory in the contract":{
			en:"Date of validity of the authorized signatory in the contract", 
			ar:"تاريخ صلاحية المخول بالتوقيع في العقد"
		},
		"Has Representative":{
			en:"Has Representative", 
			ar:"هل يوجد وكالة"
		},
		"Representative Civil Id":{
			en:"Representative Civil Id", 
			ar:"الرقم المدني للوكيل"
		},
		"Representative Name":{
			en:"Representative Name", 
			ar:"اسم الوكيل"
		},
		"Representative Phone Number":{
			en:"Representative Phone Number", 
			ar:"رقم هاتف الوكيل"
		},
		"Representative":{
			en:"Representative", 
			ar:"الوكيل"
		},
		"Tenant":{
			en:"Tenant", 
			ar:"المستغل"
		},
		"Date of Validity":{
			en:"Date of Validity", 
			ar:"تاريخ الصلاحية"
		},
		"Representative Email address":{
			en:"Representative Email address", 
			ar:"البريد الالكترونى للوكيل"
		},
		"Issue Date":{
			en:"Signature issue date", 
			ar:"تاريخ اصدار صلاحية اعتماد التوقيع"
		},
		"Signature issue date":{
			en:"Signature issue date", 
			ar:"تاريخ اصدار صلاحية اعتماد التوقيع"
		},
		"Expire Date":{
			en:"Signature expire date", 
			ar:"تاريخ انتهاء صلاحية اعتماد التوقيع"
		},
		"Expire_Date":{
			en:"Signature expire date", 
			ar:"تاريخ انتهاء صلاحية اعتماد التوقيع"
		},
		"Signature expire date":{
			en:"Signature expire date", 
			ar:"تاريخ انتهاء صلاحية اعتماد التوقيع"
		},
		"M":{
			en:"M", 
			ar:"ذكر"
		},
		"F":{
			en:"F", 
			ar:"انثى"
		},
		"Name": {en:"Name", ar:"الإسم الكامل"}, 
		"Arabic Name": {en:"Arabic Name", ar:"الإسم الكامل"}, 
		"Contact Type": {en:"Contact Type", ar:"النوع"}, 
		"Country": {en:"Country", ar:"البلد/الإقليم"}, 
		"Civil Id": {en:"Civil Id", ar:"الرقم المدني"}, 
		"Civil ID": {en:"Civil ID", ar:"الرقم المدني"}, 
		"Phone": {en:"Phone", ar:"الهاتف 1"}, 
		"Date of Birth": {en:"Date of Birth", ar:"تاريخ الميلاد"}, 
		"Gender": {en:"Gender", ar:"الجنس"}, 
		"First Name": {en:"First Name", ar:"الاسم الأول"}, 
		"Last Name": {en:"Last Name", ar:"الاسم الأخير"}, 
		"Email": {en:"Email", ar:"البريد الإلكتروني"}, 
		"Contact Seq Number": {en:"Contact Seq Number", ar:"الرقم"}
};


AFMS.prototype.demoFunction = function() {
	// write your code here
}
AFMS.prototype.onApplicationSubmitAfter = function(){
	var name = this.getASI(AFMS.ASI.general.TableName, AFMS.ASI.general.recordType);
	// Update Alt Id
	var altId = "Attachments:" + name;
	//capId = this.capId;
	altIdResults = aa.cap.updateCapAltID(this.capId, altId);
	if (altIdResults.getSuccess()){
		logDebug("Alt ID Updated: " + altId );
	}else{
		logDebug( "**ERROR: ALTID Update Failed: " + altIdResults.getErrorMessage());
	}		
}
AFMS.prototype.onApplicationSubmitBefore = function(){
}
AFMS.prototype.onApplicationSpecificInfoUpdateAfter = function(){
	var name = this.getASI(AFMS.ASI.general.TableName, AFMS.ASI.general.recordType);
	// Update Alt Id
	var altId = "Attachments:" + name;
	//capId = this.capId;
	altIdResults = aa.cap.updateCapAltID(this.capId, altId);
	if (altIdResults.getSuccess()){
		logDebug("Alt ID Updated: " + altId );
	}else{
		logDebug( "**ERROR: ALTID Update Failed: " + altIdResults.getErrorMessage());
	}		
}


//Gets the Attachment Mapping by CapId
AFMS.getAttachmentMappingJSON = function (capId){
	var mappings = {asis:{}, asits:{}, otherDocuments:{}};
	if (capId){
		var capCat = String(aa.cap.getCapTypeModelByCapID(capId).getOutput().getCategory()).trim();
		// Get the AFMS configuration record by Category
		var afms = AFMS.getAFMSByCategory(capCat);
		var mappings =  {};
		if (afms){
			// Get the document Mapping from the AFMS record
			var mappings = afms.getDocumentMapping(capId);
			
		}
	}
	return mappings;
}

AFMS.getASITMappingJSON = function (capId){
	//var mappings = {};
	if (capId){
		var capCat = String(aa.cap.getCapTypeModelByCapID(capId).getOutput().getCategory()).trim();
		// Get the AFMS configuration record by Category
		var afms = AFMS.getAFMSByCategory(capCat);
		var mappings =  {};
		if (afms){
			// Get the document Mapping from the AFMS record
			var mappings = afms.getASITDocumentMapping(capId);
			return mappings;
		}
	}
}
AFMS.prototype.getWorkflowAttachmentMapping = function (){
	var mapping = null;
	var asi = new ASITNavigator(this.capId, "Workflow Attachments");
	//var cap = new Record(capId);
	//var asiResults = getASIFields(capId);
	//aa.print("asiResults: " + JSON.stringify(asiResults));
	if (asi.rowCount){
		mapping = {};
	}
	while (asi.nextRow()){
		var documentTypes = asi.getFieldStr("Document Types");
		var tasks = String(asi.getFieldStr("Workflow Tasks")).trim();
		docTypeArray = documentTypes.split("\r\n");
		tasksArray = tasks.split("\r\n");
		for (t in tasksArray){
			var task = String(tasksArray[t]).trim();
			for (d in docTypeArray){
				var documentType = String(docTypeArray[d]).trim();
				if (!mapping[task]){
					mapping[task] = [];
				}
				mapping[task].push(documentType);	
			}
		}
	}
	return mapping;
}

AFMS.prototype.getWorkflowAttachments = function (capId1){
	finalAttachments = null;
	var record = new Record(capId1);
	var WFTasks = record.getCurrentWorkflowTasks();
	
	var wfTasks = WFTasks.map(function(tas) {
	    return String(tas.getTaskDescription()).trim();
	})

	for (t in wfTasks){
		task = wfTasks[t];
		var attachments = this.getWorkflowAttachmentsByTask(task);
		if (attachments){
			if (finalAttachments == null){
				finalAttachments = [];
			}
			for (a in attachments){				
				attachment = attachments[a];
				if (finalAttachments.indexOf(attachment)==-1){
					finalAttachments.push(attachment);				
				}	
			}
		}
	}
	return finalAttachments;
}

AFMS.prototype.getWorkflowAttachmentsByTask = function (workflowTask){
	var attachments = null;
	var mapping = this.getWorkflowAttachmentMapping();
	if (mapping){
		attachments = [];
		if (mapping[workflowTask]){
			var taskMapping = mapping[workflowTask];
			for (d in taskMapping){
				var doc = taskMapping[d];
				if (attachments.indexOf(doc)==-1){
					attachments.push(doc);
				}				
			}
		}
		if (mapping["*"]){
			var taskMapping = mapping["*"];
			for (d in taskMapping){
				var doc = taskMapping[d];
				if (attachments.indexOf(doc)==-1){
					attachments.push(doc);				
				}				
			}
		}		
	}
	return attachments;
}



AFMS.prototype.getASITDocumentMapping = function (){
	var mapping = null;
	var asi = new ASITNavigator(this.capId, "ASIT Attachments");
	//var cap = new Record(capId);
	//var asiResults = getASIFields(capId);
	//aa.print("asiResults: " + JSON.stringify(asiResults));
	if (asi.rowCount){
		mapping = {};
	}
	while (asi.nextRow()){
		var asitGroup = String(asi.getFieldStr("ASIT Group")).trim();
		var asitField = asi.getFieldStr("ASIT Field");
		var asitExtraFields = asi.getFieldStr("ASIT Extra Fields");
		var documentType = asi.getFieldStr("Document Type");
		var emseCondition = asi.getFieldStr("EMSE Condition");
		var asitFieldAr = getFieldNameTranslated(asitField, asitGroup);
		if (!mapping[documentType]){
			mapping[documentType] = [];
		}		
		mapping[documentType].push({
				name: asitField,
				nameText: asitExtraFields,
				nameAr: asitFieldAr,
				subgroup: asitGroup,
				emseCondition: emseCondition,
				values: []
		});
	}			

	return mapping;
}

AFMS.getContactMappingJSON = function (capId){
	var mappings = {};
	if (capId){
		var capCat = String(aa.cap.getCapTypeModelByCapID(capId).getOutput().getCategory()).trim();
		// Get the AFMS configuration record by Category
		var afms = AFMS.getAFMSByCategory(capCat);
		var mappings =  {};
		if (afms){
			// Get the document Mapping from the AFMS record
			var mappings = afms.getContactDocumentMapping(capId);
			
		}
	}
	return mappings;
}

AFMS.prototype.getDocumentContacts = function (capId, docId){
	var pCapID = capId;
	var docRes = aa.document.getDocumentByPK(docId);
	if (docRes.getSuccess()){
		var doc = docRes.getOutput();
		var docType = doc.getDocCategory();
		var docDescription = doc.getDocDescription();

		eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
		var asi = new ASITNavigator(this.capId, "Contact Attachments");
		
		asi.filterBy("Document Type", docType);
		while (asi.nextRow()){
			var afmsDocumentType = asi.getFieldStr("Document Type");
			var afmsContactType = String(asi.getFieldStr("Contact Type")).trim();
			var afmsContactField = asi.getFieldStr("Contact Field");
			var afmsContactEMSE = asi.getFieldStr("EMSE Condition");
			try{
				var record = null;
				var cat = aa.cap.getCap(pCapID).getOutput().getCapType().getCategory().toString().toUpperCase();
				var altId = pCapID.getCustomID();
				eval(getScriptText("INCLUDE_" + cat));
				eval('if (typeof '+cat+' === "undefined") {	record = new Record("' + altId + '"); } else { record = new ' + cat + '("' + altId + '"); } ');
			}catch(err){
				java.lang.System.out.println("=== Error finding current Record object for AFMS in getDocumentContacts() ==> " + err);
			}
			
			var res = aa.people.getCapContactByCapID(pCapID);
			var contactArray = res.getOutput();
			//contactList = aa.util.newArrayList();
			var contacts = [];
			for (t in contactArray){
				if (contactArray[t]){
					//printValues(contactArray[t].getCapContactModel());
					//contactList.add(contactArray[t].getCapContactModel());
					contact = contactArray[t].getPeople();
					if (contact){
						var isFieldCondition = false;
						var nameAr = stringify(contact.getFullName());
						var name = stringify(contact.getContactName());
						var contactType = stringify(contact.getContactType());
						var phone = stringify(contact.getContactPhoneNum());
						var country = stringify(contact.getBirthRegion());
						var birthDate = contact.getBirthDate();
						
						try{
							if (birthDate){
								birthDate = aa.util.formatDate(contact.getBirthDate(), "MM-dd-yyyy");
							}else{
								birthDate="";
							}
						}catch(err){
							logDebug("Error retrieving contact.getBirthDate()", err);
							birthDate = "";
						}
						var gender = stringify(contact.getGender());
						var firstName = stringify(contact.getFirstName());
						var lastName = stringify(contact.getLastName());
						var email = stringify(contact.getEmail());
						//refContactNumber = contact.getRefContactNumber();
						var contactSeqNumber = stringify(contact.getContactSeqNumber());
						var civilId = stringify(contact.getStateIDNbr());
						var condition = true;
						if (afmsContactType==contactType){
							if (afmsContactField.equalsIgnoreCase("Full Name")){
								if (nameAr == docDescription){
									isFieldCondition = true;
								}
							}
							if (afmsContactField.equalsIgnoreCase("Contact Name")){
								if (name == docDescription){
									isFieldCondition = true;
								}
							}
							if (afmsContactField.equalsIgnoreCase("Contact Type")){
								if (contactType == docDescription){
									isFieldCondition = true;
								}
							}
							if (afmsContactField.equalsIgnoreCase("First Name")){
								if (firstName == docDescription){
									isFieldCondition = true;
								}
							}
							if (afmsContactField.equalsIgnoreCase("Last Name")){
								if (lastName == docDescription){
									isFieldCondition = true;
								}
							}
							if (afmsContactField.equalsIgnoreCase("Civil ID")){
								if (civilId == docDescription){
									isFieldCondition = true;
								}
							}
							if (afmsContactField.equalsIgnoreCase("Email")){
								if (email == docDescription){
									isFieldCondition = true;
								}
							}
							var fields = {
								//"Name": {name:"Name", value:name, nameAr:translateField("Name", "ar")}, 
								"Name": {name:"Name", value:nameAr, nameAr:translateField("Name", "ar")}, 
								"Contact Type": {name:"Contact Type", value:contactType, valueAr:translateField(contactType, "ar"), nameAr:translateField("Contact Type", "ar")}, 
								"Country": {name:"Country", value:country, nameAr:translateField("Country", "ar")}, 
								"Civil Id": {name:"Civil Id", value:civilId, nameAr:translateField("Civil Id", "ar")}, 
								"Phone": {name:"Phone", value:phone, nameAr:translateField("Phone", "ar")}, 
								"Date of Birth": {name:"Date of Birth", value:birthDate, nameAr:translateField("Date of Birth", "ar")}, 
								"Gender": {name:"Gender", value:gender, valueAr:translateField(gender, "ar"), nameAr:translateField("Gender", "ar")}, 
								//"First Name": {name:"First Name", value:nameAr, nameAr:translateField("First Name", "ar")}, 
								//"Last Name": {name:"Last Name", value:lastName, nameAr:translateField("Last Name", "ar")}, 
								"Email": {name:"Email", value:email, nameAr:translateField("Email", "ar")}/*, 
								"Contact Seq Number": {name:"Contact Seq Number", value:contactSeqNumber, nameAr:translateField("Contact Seq Number", "ar")}*/
							};

							fields.getField = function(fieldName){
								for (f in this){
									if (this.hasOwnProperty(f)){
										var val = this[f];
										if (String(fieldName).toUpperCase() == String(f).toUpperCase()){
											return this[f];
										}
									}
								}
							}
							
							templateFields = contact.getAttributes();
							for (var i = 0; i < templateFields.size(); i++) {
								var fieldModel = templateFields.get(i);
								
								var fieldName = String(fieldModel.getAttributeName()).trim();
								var fieldNameAR = translateField(fieldName, "ar");
								fieldName = translateField(fieldName, "en");
								//var fieldNameAR = String(fieldModel.getAttributeLabel()).trim();
								var fieldValue = String(fieldModel.getDispAttributeValue()).trim();
								//aa.print(fieldName + ": " + fieldValue);
								fields[fieldName] = {name:fieldName, value:fieldValue, nameAr:fieldNameAR};
								if (String(afmsContactField).toUpperCase() == String(fieldName).toUpperCase()){
									if (fieldValue == docDescription){
										isFieldCondition = true;
									}
								}
							}								
							if (isFieldCondition){
								if (afmsContactEMSE){
									condition = eval(afmsContactEMSE);
								}
								if (condition){
									contacts.push(fields);		
								}
							}							
						}
					}
				}
			}
			if (contacts.length){
				return contacts;				
			}
		}
	}
}

AFMS.prototype.getContactDocumentMappingForACA = function (capId){
	eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
	var asi = new ASITNavigator(this.capId, "Contact Attachments");
	var mapping = null;
	//var asiResults = getASIFields(capId);
	//aa.print("asiResults: " + JSON.stringify(asiResults));
	//com.accela.i18n.I18NContext.getI18NModel().setLanguage("en_US");
	while (asi.nextRow()){
		var documentType = asi.getFieldStr("Document Type");
		var afmsContactType = String(asi.getFieldStr("Contact Type")).trim();
		var afmsContactField = asi.getFieldStr("Contact Field");
		var afmsContactEMSE = asi.getFieldStr("EMSE Condition");
		var values = [];
		var valuesText = [];
		
        var envCapModel = aa.env.getValue("CapModel");
		if (envCapModel && envCapModel.getAltID){
	        capId = aa.cap.getCapID(envCapModel.getAltID()).getOutput();
	        contactList = envCapModel.getContactsGroup();
	        contactArray = [];
			java.lang.System.out.println("=== Contacts.size ==> " + contactList.size());

	        if (contactList != null && contactList.size() > 0) {
	            for (var i = contactList.size() ; i > 0; i--) {
	                var contactModel = contactList.get(i - 1);
	                contactArray.push(contactModel);
	    			java.lang.System.out.println("=== loop ContactModel ==> " + contactModel);
	            }
	        }
			java.lang.System.out.println("=== ContactArray ==> " + contactArray);
	        
		}else{
			var res = aa.people.getCapContactByCapID(capId);
			var contactArray = res.getOutput();			
		}
		try{
			var record = null;
			var cat = aa.cap.getCap(capId).getOutput().getCapType().getCategory().toString().toUpperCase();
			var altId = capId.getCustomID();
			eval(getScriptText("INCLUDE_" + cat));
			eval('if (typeof '+cat+' === "undefined") {	record = new Record("' + altId + '"); } else { record = new ' + cat + '("' + altId + '"); } ');
		}catch(err){
			java.lang.System.out.println("=== Error finding current Record object for AFMS in getContactDocumentMappingForACA() ==> " + err);
		}
		
		for (t in contactArray){
			if (contactArray[t]){
				//printValues(contactArray[t].getCapContactModel());
				//contactList.add(contactArray[t].getCapContactModel());
				contact = contactArray[t].getPeople();
				java.lang.System.out.println("=== Contact ==> " + contact);
				
				if (contact){
					nameArabic = stringify(contact.getFullName());
					name = stringify(contact.getContactName());
					contactType = stringify(contact.getContactType());
					phone = stringify(contact.getContactPhoneNum());
					country = stringify(contact.getBirthRegion());
					birthDate = stringify(aa.util.formatDate(contact.getBirthDate(), "MM-dd-yyyy"));		
					gender = stringify(contact.getGender());
					firstName = stringify(contact.getFirstName());
					lastName = stringify(contact.getLastName());
					email = stringify(contact.getEmail());
					//refContactNumber = contact.getRefContactNumber();
					contactSeqNumber = stringify(contact.getContactSeqNumber());
					civilId = stringify(contact.getStateIDNbr());
					java.lang.System.out.println("=== contactType ==> " + contactType);
					java.lang.System.out.println("=== civilId ==> " + civilId);
					java.lang.System.out.println("=== afmsContactField ==> " + afmsContactField);
					var condition = true;
					var theTextValue = "";
					
					var fields = {
						"Name": {name:"Name", value:name, nameAr:translateField("Name", "ar")}, 
						"Arabic Name": {name:"Arabic Name", value:nameArabic, nameAr:translateField("Arabic Name", "ar")}, 
						"Contact Type": {name:"Contact Type", value:contactType, nameAr:translateField("Contact Type", "ar")}, 
						"Country": {name:"Country", value:country, nameAr:translateField("Country", "ar")}, 
						"Civil Id": {name:"Civil Id", value:civilId, nameAr:translateField("Civil Id", "ar")}, 
						"Phone": {name:"Phone", value:phone, nameAr:translateField("Phone", "ar")}, 
						"Date of Birth": {name:"Date of Birth", value:birthDate, nameAr:translateField("Date of Birth", "ar")}, 
						"Gender": {name:"Gender", value:gender, nameAr:translateField("Gender", "ar")}, 
						"First Name": {name:"First Name", value:nameArabic, nameAr:translateField("First Name", "ar")}, 
						"Last Name": {name:"Last Name", value:lastName, nameAr:translateField("Last Name", "ar")}, 
						"Email": {name:"Email", value:email, nameAr:translateField("Email", "ar")}, 
						"Contact Seq Number": {name:"Contact Seq Number", value:contactSeqNumber, nameAr:translateField("Contact Seq Number", "ar")}
					};
					
					fields.getField = function(fieldName){
						for (f in this){
							if (this.hasOwnProperty(f)){
								var val = this[f];
								if (String(fieldName).toUpperCase() == String(f).toUpperCase()){
									return this[f];
								}
							}
						}
					}
					
					if (!afmsContactType || afmsContactType==contactType){
						if (afmsContactField == "Full Name"){
							theValue = nameArabic;
							nameAr = "الإسم بالعربية";
						} else if (afmsContactField.equalsIgnoreCase("Contact Name")){
							theValue = name;
							nameAr = "الإسم";
						} else if (afmsContactField.equalsIgnoreCase("Contact Type")){
							theValue = contactType;
							nameAr = "نوع جهة الإتصال";
						} else if (afmsContactField.equalsIgnoreCase("First Name")){
							theValue = firstName;
							nameAr = "اللقب";
						} else if (afmsContactField.equalsIgnoreCase("Last Name")){
							theValue = lastName;
							nameAr = "إسم العائلة";
						} else if (afmsContactField.equalsIgnoreCase("Civil ID")){
							theValue = civilId;
							nameAr = "رقم الهوية";
						} else if (afmsContactField.equalsIgnoreCase("Email")){
							theValue = email;
							nameAr = "البريد الإلكتروني";
						} else {
							templateFields = contact.getAttributes();
							java.lang.System.out.println("=== templateFields.size() ==> " + templateFields.size());
							for (var i = 0; i < templateFields.size(); i++) {
								var fieldModel = templateFields.get(i);
								//printValues(fieldModel);
								
								var fieldName = String(fieldModel.getAttributeName()).trim();
								fieldNameAR = translateField(fieldName, "ar");
								fieldName = translateField(fieldName, "en");
								//var fieldNameAR = String(fieldModel.getAttributeLabel()).trim();
								var fieldValue = String(fieldModel.getDispAttributeValue()).trim();
								fields[fieldName] = {name:fieldName, value:fieldValue, nameAr:fieldNameAR};
								java.lang.System.out.println("=== templateFields.fieldName ==> " + fieldName);
								java.lang.System.out.println("=== templateFields.fieldValue ==> " + fieldValue);

								if (String(afmsContactField).toUpperCase() == String(fieldName).toUpperCase()){
									java.lang.System.out.println("=== Found the fieldName inside the Template : "+fieldName+" ==> value: " + fieldValue);
									theValue = fieldValue;
									nameAr = fieldNameAR;
									
								}
							}
						}
						
						java.lang.System.out.println("=== JSON.stringify(fields) ==> " + JSON.stringify(fields));

						if (afmsContactEMSE){
							java.lang.System.out.println("=== about to execute afmsContactEMSE ==> " + afmsContactEMSE);
							condition = eval(afmsContactEMSE);
							java.lang.System.out.println("=== afmsContactEMSE condition result ==> " + condition);
						} 
						if (condition){
							java.lang.System.out.println("=== theValue ==> " + theValue);
							values.push(theValue);
							if (afmsContactField.indexOf("Representative")>-1 && fields["Representative Name"]){
								valuesText.push(theValue + " - " + fields["Representative Name"].value);
							}else{
								valuesText.push(theValue + " - " + fields["Arabic Name"].value);
							}
						}						
					}
				}
			}
		}
		if (values.length){
			if (!mapping){
				mapping = {};
			}
			
			if (!mapping[documentType]){
				mapping[documentType] = {
					name: afmsContactField,
					nameAr: nameAr,
					values: [],
					valuesText: []
				};
			}
			mapping[documentType].values = mapping[documentType].values.concat(values);		
			mapping[documentType].valuesText = mapping[documentType].valuesText.concat(valuesText);		
			
		}
	}		

	//aa.print("Final mapping for contact: " + JSON.stringify(mapping));
	return mapping;
}

AFMS.prototype.getContactDocumentMapping = function (capId){
	eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
	var asi = new ASITNavigator(this.capId, "Contact Attachments");
	var mapping = {};
	//var asiResults = getASIFields(capId);
	//aa.print("asiResults: " + JSON.stringify(asiResults));
	//com.accela.i18n.I18NContext.getI18NModel().setLanguage("en_US");
	while (asi.nextRow()){
		var documentType = asi.getFieldStr("Document Type");
		var afmsContactType = String(asi.getFieldStr("Contact Type")).trim();
		var afmsContactField = asi.getFieldStr("Contact Field");
		var afmsContactEMSE = asi.getFieldStr("EMSE Condition");
		var values = [];
		
		if (!mapping[documentType]){
			mapping[documentType] = [];
		}		
		mapping[documentType] = {
			name: afmsContactField,
			nameAr: translateField(afmsContactField, "ar"),
			contactType: afmsContactType,
			emseCondition: afmsContactEMSE,
			values: []
		};
		
/*        var envCapModel = aa.env.getValue("CapModel");
		if (envCapModel && envCapModel.getAltID){
	        capId = aa.cap.getCapID(envCapModel.getAltID()).getOutput();
	        contactList = envCapModel.getContactsGroup();
	        contactArray = [];
			java.lang.System.out.println("=== Contacts.size ==> " + contactList.size());

	        if (contactList != null && contactList.size() > 0) {
	            for (var i = contactList.size() ; i > 0; i--) {
	                var contactModel = contactList.get(i - 1);
	                contactArray.push(contactModel);
	    			java.lang.System.out.println("=== loop ContactModel ==> " + contactModel);
	            }
	        }
			java.lang.System.out.println("=== ContactArray ==> " + contactArray);
	        
		}else{
			var res = aa.people.getCapContactByCapID(capId);
			var contactArray = res.getOutput();			
		}*/
/*		try{
			var record = null;
			var cat = aa.cap.getCap(capId).getOutput().getCapType().getCategory().toString().toUpperCase();
			var altId = capId.getCustomID();
			eval(getScriptText("INCLUDE_" + cat));
			eval('if (typeof '+cat+' === "undefined") {	record = new Record("' + altId + '"); } else { record = new ' + cat + '("' + altId + '"); } ');
		}catch(err){
			java.lang.System.out.println("=== Error finding current Record object for AFMS in getContactDocumentMappingForACA() ==> " + err);
		}*/
		/*
		for (t in contactArray){
			if (contactArray[t]){
				//printValues(contactArray[t].getCapContactModel());
				//contactList.add(contactArray[t].getCapContactModel());
				contact = contactArray[t].getPeople();
				java.lang.System.out.println("=== Contact ==> " + contact);
				
				if (contact){
					nameArabic = stringify(contact.getFullName());
					name = stringify(contact.getContactName());
					contactType = stringify(contact.getContactType());
					phone = stringify(contact.getContactPhoneNum());
					country = stringify(contact.getBirthRegion());
					birthDate = stringify(contact.getBirthDate());
					gender = stringify(contact.getGender());
					firstName = stringify(contact.getFirstName());
					lastName = stringify(contact.getLastName());
					email = stringify(contact.getEmail());
					//refContactNumber = contact.getRefContactNumber();
					contactSeqNumber = stringify(contact.getContactSeqNumber());
					civilId = stringify(contact.getStateIDNbr());
					java.lang.System.out.println("=== contactType ==> " + contactType);
					java.lang.System.out.println("=== civilId ==> " + civilId);
					java.lang.System.out.println("=== afmsContactField ==> " + afmsContactField);
					var condition = true;
					
					var fields = {
						"Name": {name:"Name", value:name, nameAr:translateField("Name", "ar")}, 
						"Arabic Name": {name:"Arabic Name", value:nameArabic, nameAr:translateField("Arabic Name", "ar")}, 
						"Contact Type": {name:"Contact Type", value:contactType, nameAr:translateField("Contact Type", "ar")}, 
						"Country": {name:"Country", value:country, nameAr:translateField("Country", "ar")}, 
						"Civil Id": {name:"Civil Id", value:civilId, nameAr:translateField("Civil Id", "ar")}, 
						"Phone": {name:"Phone", value:phone, nameAr:translateField("Phone", "ar")}, 
						"Date of Birth": {name:"Date of Birth", value:birthDate, nameAr:translateField("Date of Birth", "ar")}, 
						"Gender": {name:"Gender", value:gender, nameAr:translateField("Gender", "ar")}, 
						"First Name": {name:"First Name", value:nameArabic, nameAr:translateField("First Name", "ar")}, 
						"Last Name": {name:"Last Name", value:lastName, nameAr:translateField("Last Name", "ar")}, 
						"Email": {name:"Email", value:email, nameAr:translateField("Email", "ar")}, 
						"Contact Seq Number": {name:"Contact Seq Number", value:contactSeqNumber, nameAr:translateField("Contact Seq Number", "ar")}
					};
					
					fields.getField = function(fieldName){
						for (f in this){
							if (this.hasOwnProperty(f)){
								var val = this[f];
								if (String(fieldName).toUpperCase() == String(f).toUpperCase()){
									return this[f];
								}
							}
						}
					}
					
					if (!afmsContactType || afmsContactType==contactType){
						if (afmsContactField == "Full Name"){
							theValue = nameArabic;
							nameAr = "الإسم بالعربية";
						} else if (afmsContactField.equalsIgnoreCase("Contact Name")){
							theValue = name;
							nameAr = "الإسم";
						} else if (afmsContactField.equalsIgnoreCase("Contact Type")){
							theValue = contactType;
							nameAr = "نوع جهة الإتصال";
						} else if (afmsContactField.equalsIgnoreCase("First Name")){
							theValue = firstName;
							nameAr = "اللقب";
						} else if (afmsContactField.equalsIgnoreCase("Last Name")){
							theValue = lastName;
							nameAr = "إسم العائلة";
						} else if (afmsContactField.equalsIgnoreCase("Civil ID")){
							theValue = civilId;
							nameAr = "رقم الهوية";
						} else if (afmsContactField.equalsIgnoreCase("Email")){
							theValue = email;
							nameAr = "البريد الإلكتروني";
						} else {
							templateFields = contact.getAttributes();
							java.lang.System.out.println("=== templateFields.size() ==> " + templateFields.size());
							for (var i = 0; i < templateFields.size(); i++) {
								var fieldModel = templateFields.get(i);
								//printValues(fieldModel);
								
								var fieldName = String(fieldModel.getAttributeName()).trim();
								fieldNameAR = translateField(fieldName, "ar");
								fieldName = translateField(fieldName, "en");
								//var fieldNameAR = String(fieldModel.getAttributeLabel()).trim();
								var fieldValue = String(fieldModel.getDispAttributeValue()).trim();
								fields[fieldName] = {name:fieldName, value:fieldValue, nameAr:fieldNameAR};
								java.lang.System.out.println("=== templateFields.fieldName ==> " + fieldName);
								java.lang.System.out.println("=== templateFields.fieldValue ==> " + fieldValue);

								if (String(afmsContactField).toUpperCase() == String(fieldName).toUpperCase()){
									java.lang.System.out.println("=== Found the fieldName inside the Template : "+fieldName+" ==> value: " + fieldValue);
									theValue = fieldValue;
									nameAr = fieldNameAR;
								}
							}
						}
						
						java.lang.System.out.println("=== JSON.stringify(fields) ==> " + JSON.stringify(fields));

						if (afmsContactEMSE){
							java.lang.System.out.println("=== about to execute afmsContactEMSE ==> " + afmsContactEMSE);
							condition = eval(afmsContactEMSE);
							java.lang.System.out.println("=== afmsContactEMSE condition result ==> " + condition);
						} 
						if (condition){
							java.lang.System.out.println("=== theValue ==> " + theValue);
							values.push(theValue);
						}						
					}
				}
				
			}
		}
		if (values.length){
			if (!mapping){
				mapping = {};
			}
			
			if (!mapping[documentType]){
				mapping[documentType] = {
					name: afmsContactField,
					nameAr: nameAr,
					values: []
				};
			}
			mapping[documentType].values = mapping[documentType].values.concat(values);		
		}*/
	}		

	//aa.print("Final mapping for contact: " + JSON.stringify(mapping));
	return mapping;
}

function printValues(object)
{
    for (x in object.getClass().getMethods())
    {
	try{
		var theName = object.getClass().getMethods()[x].getName();
		var theValue="";
		if (theName.indexOf("get")==0){
			eval("theValue = object."+theName+"();");
			java.lang.System.out.println(object.toString() + " | " + theName + ": " + theValue);
		}
	} catch(e) {
		java.lang.System.out.println("Error: " + e);
	}
    }
    java.lang.System.out.println(" ");
}


function stringify(val){

	if (val){
		return String(val).trim();
	}else{
		return "";
	}
}

AFMS.prototype.getDocumentMapping = function (capId){
	eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
	var mapping = {};
	var asi = new ASITNavigator(this.capId, "ASI Attachments");
	try{
		var cap = new Record(capId);		
	}catch(err){
		var cap = null;
	}
	var asiResults = getASIFields(capId);
	//aa.print("asiResults: " + JSON.stringify(asiResults));
	while (asi.nextRow()){
		var group = String(asi.getFieldStr("ASI Group")).trim();
		var asiFields = asi.getFieldStr("ASI Fields");
		var documentType = asi.getFieldStr("Document Type");
		
		asiFieldsArray = asiFields.split("\r\n");
		asiFieldsArrayNew = [];
		if (asiFieldsArray){
			// If no group, initialize
			if (!mapping[documentType]){
				mapping[documentType] = {};
			}
			for (f in asiFieldsArray){
				field = String(asiFieldsArray[f]).trim();
				if (field){
					if (cap){
						
						if (com.accela.aa.emse.util.LanguageUtil.getCurrentLocale().getLanguage()=="ar_AE"){
							var value = getArabicDDValue(cap.capId, field, group);
							//var value = String(cap.getASI(group, field)).trim();
						}else{
							var value = String(cap.getASI(group, field)).trim();
						}
					}else{
						var value = "";
					}
					
					var groupAR = group;
					var fieldAR = field;
					
					//for (r in asiResults){
						//if (asiResults.hasOwnProperty(r)){
							//row = asiResults[r];
					if (asiResults[group]){
						if (asiResults[group].fields[field]){
							groupAR = String(asiResults[group].fields[field].subgroupAliasAR).trim();
							fieldAR = String(asiResults[group].fields[field].aliasAR).trim();
							fieldEN = String(asiResults[group].fields[field].name).trim();
							asiFieldsArrayNew.push({name:field, name_en:fieldEN, value: value, name_ar: fieldAR, group_ar: groupAR});					
						}
					}					
						//}
					//}
				}

			}	
		}
		if (!mapping[documentType][group]){
			mapping[documentType][group] = {asiFields:[]};
		}

		mapping[documentType][group].asiFields = mapping[documentType][group].asiFields.concat(asiFieldsArrayNew);	
		/*
		// If no group, initialize
		if (!mapping.asis[group]){
			mapping.asis[group] = {};
		}
		mapping.asis[group][documentType] = {category: documentType, files: []};*/
	}			
	/*
	var asit = new ASITNavigator(this.capId, "ASIT Attachments");
	while (asit.nextRow()){
		group = asit.getFieldStr("ASIT Group");
		documentType = asit.getFieldStr("Document Type");
		// If no group, initialize
		if (!mapping.asits[group]){
			mapping.asits[group] = {};
		}
		mapping.asits[group][documentType] = {category: documentType, files: []};				
	}*/
	return mapping;
}

AFMS.prototype.getASIDocumentMapping = function (){
	eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
	var mapping = {};
	var asi = new ASITNavigator(this.capId, "ASI Attachments");
	/*try{
		var cap = new Record(capId);		
	}catch(err){
		var cap = null;
	}*/
	//var asiResults = getASIFields(capId);
	//var asiResults = getASIFields(capId);	
	//logDebug(JSON.stringify(asiResults));
	
	while (asi.nextRow()){
		var group = String(asi.getFieldStr("ASI Group")).trim();
		var asiFields = asi.getFieldStr("ASI Fields");
		var documentType = asi.getFieldStr("Document Type");
		var emseCondition = asi.getFieldStr("EMSE Condition");
		
		var field = "";
		//aa.print("asiFields: " + asiFields);
		asiFieldsArray = asiFields.split("\r\n");
		asiFieldsArrayNew = [];
		// If no group, initialize
		if (!mapping[documentType]){
			mapping[documentType] = {};
		}
		if (!mapping[documentType][group]){
			mapping[documentType][group] = [];
		}
		
		if (asiFieldsArray){

			// Always take the first Field in the "ASI Fields" textbox, that will be the mapped field.
			var fieldKey = null;
			if (asiFieldsArray.length){
				field = String(asiFieldsArray[0]).trim();
				/*if (asiResults[group]){
					if (asiResults[group].fields[field]){
						groupAR = String(asiResults[group].fields[field].subgroupAliasAR).trim();
						fieldAR = String(asiResults[group].fields[field].aliasAR).trim();
						fieldEN = String(asiResults[group].fields[field].name).trim();
					}
				}
				*/
				//mapping[documentType][group].push({name: field, group: group, emseCondition: emseCondition});
				fieldKey = {name: field, group: group, emseCondition: emseCondition, fields:[]};
				mapping[documentType][group].push(fieldKey);
			}
			//aa.print("Field: " + field);
			for (f in asiFieldsArray){
				if (f==0){
					continue;
				}
				field = String(asiFieldsArray[f]).trim();
				/*if (asiResults[group]){
					if (asiResults[group].fields[field]){
						groupAR = String(asiResults[group].fields[field].subgroupAliasAR).trim();
						fieldAR = String(asiResults[group].fields[field].aliasAR).trim();
						fieldEN = String(asiResults[group].fields[field].name).trim();
					}
				}*/
				if (field){
					fieldKey.fields.push({name: field, group: group, emseCondition: emseCondition});
					//mapping[documentType][group].push({name: field, group: group, emseCondition: emseCondition});	
				}
			}	
		}

		/*
		// If no group, initialize
		if (!mapping.asis[group]){
			mapping.asis[group] = {};
		}
		mapping.asis[group][documentType] = {category: documentType, files: []};*/
	}			
	/*
	var asit = new ASITNavigator(this.capId, "ASIT Attachments");
	while (asit.nextRow()){
		group = asit.getFieldStr("ASIT Group");
		documentType = asit.getFieldStr("Document Type");
		// If no group, initialize
		if (!mapping.asits[group]){
			mapping.asits[group] = {};
		}
		mapping.asits[group][documentType] = {category: documentType, files: []};				
	}*/
	
	//aa.print(JSON.stringify(mapping));
	return mapping;
}

AFMS.getAFMSByCategory = function (cat){
	var altId = "Attachments:" + cat;
	try{
		var capId = aa.cap.getCapID(altId).getOutput();
		if (capId){
			var afms = new AFMS(capId);
			return afms;
		}
	}catch(err){
	}
	return null;
}

AFMS.prototype.getASITDocumentMappingForACA = function (){
	var asitSettings = this.getASITDocumentMapping();
	var valuesReturned = false;
	var finalAsitSettings = {};
	try{
		var record = null;
		var envCapModel = aa.env.getValue("CapModel");
		if (envCapModel && envCapModel.getAltID){
	        capId = aa.cap.getCapID(envCapModel.getAltID()).getOutput();
			var cat = aa.cap.getCap(capId).getOutput().getCapType().getCategory().toString().toUpperCase();
			var altId = capId.getCustomID();
			eval(getScriptText("INCLUDE_" + cat));
			eval('if (typeof '+cat+' === "undefined") {	record = new Record("' + altId + '"); } else { record = new ' + cat + '("' + altId + '"); } ');
		}
	}catch(err){
		java.lang.System.out.println("=== Error finding current Record object for AFMS in getASITDocumentMappingForACA() ==> " + err);
	}
	for (a in asitSettings){
		if (asitSettings.hasOwnProperty(a)){
			docTypeCategory = asitSettings[a];
			
			for (d in docTypeCategory){
				var asitSettingsRow = docTypeCategory[d];
				
				var subgroup = asitSettingsRow.subgroup;
				var name = asitSettingsRow.name;
				var nameAr = asitSettingsRow.nameAr;
				var nameText = asitSettingsRow.nameText;
				var emseCondition = asitSettingsRow.emseCondition;
				var asit = new ASITNavigator("", subgroup, true);
				var condition = true;
				var valueAr;
				//java.lang.System.out.println("=== getASITDocumentMappingForACA ==> subgroup: " + subgroup);
				//java.lang.System.out.println("=== getASITDocumentMappingForACA ==> name: " + name);
				
				while (asit.nextRow()){
					valuesReturned = true;
					//java.lang.System.out.println("=== getASITDocumentMappingForACA ==> Before : asit.getFieldStr(name);" + name);
					value = asit.getFieldStr(name);
					valueAr = asit.getFieldStrByLanguage(name, 'ar_AE', value);
					//java.lang.System.out.println("=== getASITDocumentMappingForACA ==> value: " + value);
					var colNames = asit.colNames;
					var fields = {};
					for (c in colNames){
						colName = colNames[c];
						colVal = asit.getFieldStr(colName);
						fields[colName] = {name: colName, value: colVal, valueAr: valueAr};
					}
					//java.lang.System.out.println("=== getASITDocumentMappingForACA ==> Arabic value: " + valueAr);

					fields.getField = function(fieldName){
						for (f in this){
							if (this.hasOwnProperty(f)){
								var val = this[f];
								if (String(fieldName).toUpperCase() == String(f).toUpperCase()){
									return this[f];
								}
							}
						}
					}
					
					if (emseCondition){
						condition = eval(emseCondition);
					}
					if (condition){
						if (!finalAsitSettings[a]){
							finalAsitSettings[a] = {subgroup:subgroup, name:name, nameAr:nameAr, emseCondition:emseCondition, values: [], valuesText: []};
						}
						//if (name.split(",").length>1){
						// Drop Down Value
						var value = "";
						var valueText = "";
						
						var valueFieldName = String(name).trim();
						if (fields.getField(valueFieldName) && fields.getField(valueFieldName).value){
							value = fields.getField(valueFieldName).value;
						}
						finalAsitSettings[a].values = finalAsitSettings[a].values.concat(value);
						
						// Drop Down Text Values
						var fieldNames = nameText.split("\r\n");
						if (fieldNames.length==1){
							fieldNames = nameText.split("\n");
						}
						//java.lang.System.out.println("=== getASITDocumentMappingForACA ==> about to start fieldNames loop ");
						//java.lang.System.out.println('Current Language: '+ com.accela.i18n.I18NContext.getI18NModel().getLanguage());
						//java.lang.System.out.println('fields.getField("'+valueFieldName+'").valueAr: ' + fields.getField(valueFieldName).valueAr);
					
						if (com.accela.i18n.I18NContext.getI18NModel().getLanguage()=="ar_AE"){
							valueText += fields.getField(valueFieldName).valueAr;
						}else{
							valueText += fields.getField(valueFieldName).value;
						}
						
						for (var f in fieldNames){
							var theFieldName = String(fieldNames[f]).trim();
							if (fields.getField(theFieldName) && fields.getField(theFieldName).value){
								if (valueText){
									valueText += " ";
								}
								//logDebug('Current Language', com.accela.aa.emse.util.LanguageUtil.getCurrentLocale().getLanguage());
								//logDebug('fields.getField(theFieldName).valueAr', fields.getField(theFieldName).valueAr);
								if (com.accela.i18n.I18NContext.getI18NModel().getLanguage()=="ar_AE"){
									valueText += fields.getField(theFieldName).valueAr;
								}else{
									valueText += fields.getField(theFieldName).value;
								}
								
							}else if (!fields.getField(theFieldName)){
								// This is a seperator character, insert it as is.
								if (valueText){
									valueText += " ";
								}
								valueText += theFieldName;
							}
						}
						finalAsitSettings[a].valuesText = finalAsitSettings[a].valuesText.concat(valueText);
						//}
						/*
						if (name.indexOf("Representative")>-1 && fields.getField("Representative Name")){
							finalAsitSettings[a].valuesText = finalAsitSettings[a].valuesText.concat(value + " - " + fields.getField("Representative Name").value);							
						}else if (fields.getField("Full Name")){
							finalAsitSettings[a].valuesText = finalAsitSettings[a].valuesText.concat(value + " - " + fields.getField("Full Name").value);
						}else if (fields.getField("Tenanet Name")){
							finalAsitSettings[a].valuesText = finalAsitSettings[a].valuesText.concat(value + " - " + fields.getField("Tenanet Name").value);
						}
						else{*/
						
							/*
							var theFieldName = "";
							var theFieldValue = "";
							for (var i in fields){
								if (fields.hasOwnProperty(i)){
									if (i.indexOf("Name")>-1 || i.indexOf("name")>-1){
										theFieldName = i;
										theFieldValue = fields.getField(theFieldName).value;
									}
								}
							}
							if(theFieldValue == ""){
								finalAsitSettings[a].valuesText = finalAsitSettings[a].valuesText.concat(value);	
							} else {
								finalAsitSettings[a].valuesText = finalAsitSettings[a].valuesText.concat(value + " - " + theFieldValue);
							}
							*/
						/*}*/
					}
				}
			}
			
		}
	}
	if (valuesReturned){
		java.lang.System.out.println("FinalASITSettings: " + JSON.stringify(finalAsitSettings));
		return finalAsitSettings;		
	}
};
/****
 * Combines Both ASIT Document mappings & Contact Document Mappings
 * @returns
 */
AFMS.prototype.getDocumentMappingForACA = function (){
	var asitSettings = null;
	var contactSettings = null;
	var finalMappingSettings = null;
	var asiSettings = null;
	
	if (this.getASITDocumentMappingForACA){
		java.lang.System.out.println("=== Before asitSettings ==> ");
		asitSettings = this.getASITDocumentMappingForACA();
		java.lang.System.out.println("=== After asitSettings ==> " + asitSettings);
		if (asitSettings){
			// Clone to FinalMappingSettings
			attachmentDropDownValues = JSON.stringify(asitSettings);
			finalMappingSettings = JSON.parse(attachmentDropDownValues);
			java.lang.System.out.println("=== finalMappingSettings 1 ==> " + finalMappingSettings);
		}				
	}
	if (this.getASIDocumentMappingForACA){
		asiSettings = this.getASIDocumentMappingForACA();
		java.lang.System.out.println("=== asiSettings ==> " + JSON.stringify(asiSettings));
		
		if (asiSettings){
			if (finalMappingSettings){
				for (var docType in asiSettings){
					//for (var docType in finalMappingSettings){
					if (finalMappingSettings.hasOwnProperty(docType)){
						//var asitGroup = asitSettings[a]
						if (asiSettings[docType]){
							//if (asiSettings[docType].name == finalMappingSettings[docType].name){
							finalMappingSettings[docType].values = asiSettings[docType].values.concat(finalMappingSettings[docType].values).unique();
							finalMappingSettings[docType].valuesText = asiSettings[docType].valuesText.concat(finalMappingSettings[docType].valuesText).unique();
							//}
						}
					}else{
						finalMappingSettings[docType] = asiSettings[docType];
					}
					//}
				}
				
			}else{
				finalMappingSettings = asiSettings;
			}
		}
		if (asiSettings){
			// Clone to FinalMappingSettings
			/*attachmentDropDownValues = JSON.stringify(asiSettings);
			finalMappingSettings = JSON.parse(attachmentDropDownValues);*/
			java.lang.System.out.println("=== ASI finalMappingSettings 1 ==> " + finalMappingSettings);
		}				
	}

	if (this.getContactDocumentMappingForACA){
		contactSettings = this.getContactDocumentMappingForACA();
		if (contactSettings){
			// Check to see if there are ASIT values too, if so, concatenate them to the contacts
			if (finalMappingSettings){
				for (var docType in finalMappingSettings){
					if (finalMappingSettings.hasOwnProperty(docType)){
						//var asitGroup = asitSettings[a]
						if (contactSettings[docType]){
							if (contactSettings[docType].name == finalMappingSettings[docType].name){
								finalMappingSettings[docType].values = contactSettings[docType].values.concat(finalMappingSettings[docType].values).unique();
								finalMappingSettings[docType].valuesText = contactSettings[docType].valuesText.concat(finalMappingSettings[docType].valuesText).unique();
							}
						}
					}
				}
			}else{
				// Clone Contact Settings
				finalMappingSettings = contactSettings;
			}
			/*attachmentDropDownValues = JSON.stringify(finalMappingSettings);
			attachmentDropDownValues = encodeURIComponent(attachmentDropDownValues);
			contactScript = " convertAttachmentDescriptionToDropDown(decodeURIComponent('"+attachmentDropDownValues+"')); ";
			java.lang.System.out.println("=== contactScript ==> " + contactScript);*/
		}			
	}
	return finalMappingSettings;
};

AFMS.prototype.getASIDocumentMappingForACA = function (){
	var asiSettings = this.getASIDocumentMapping();
	var valuesReturned = false;
	var finalAsiSettings = {};
	var fields = {
		getField : function(fieldName){
			logDebug("getField("+fieldName+")", getAppSpecificFromEnv(fieldName));
			return {name: fieldName, value: getAppSpecificFromEnv(fieldName)};
		}
	};
	logDebug("asiSettings: " + JSON.stringify(asiSettings));
	try{
		var record = null;
		var envCapModel = aa.env.getValue("CapModel");
		if (envCapModel && envCapModel.getAltID){
	        capId = aa.cap.getCapID(envCapModel.getAltID()).getOutput();
			var cat = aa.cap.getCap(capId).getOutput().getCapType().getCategory().toString().toUpperCase();
			var altId = capId.getCustomID();
			eval(getScriptText("INCLUDE_" + cat));
			eval('if (typeof '+cat+' === "undefined") {	record = new Record("' + altId + '"); } else { record = new ' + cat + '("' + altId + '"); } ');
		}
	}catch(err){
		java.lang.System.out.println("=== Error finding current Record object for AFMS in getASIDocumentMappingForACA() ==> " + err);
	}
	for (a in asiSettings){
		if (asiSettings.hasOwnProperty(a)){
			docTypeCategory = asiSettings[a];
			
			logDebug("asiSettings["+a+"]: " + JSON.stringify(docTypeCategory));
			for (d in docTypeCategory){
				var asiSettingsGroup = docTypeCategory[d];
				var dropDownText = "";
				for (var i in asiSettingsGroup){
					var asiSettingsItem = asiSettingsGroup[i];
					valuesReturned = true;
					var condition = true;
					var emseCondition = asiSettingsItem.emseCondition;
					var value = str(getAppSpecificFromEnv(asiSettingsItem.name));
					dropDownText = value;
					
					logDebug("emseCondition: ", emseCondition);
					if (emseCondition && emseCondition != ""){
						condition = eval(emseCondition);
						logDebug("condition result: ", condition);
					}
					if (condition){
						logDebug("creating finalAsiSettings["+a+"]: ");

						if (!finalAsiSettings[a]){ 
							var labels = getAppSpecificLabelFromEnv(asiSettingsItem.name);
							finalAsiSettings[a] = {subgroup:str(d), name:str(asiSettingsGroup[0].name), nameEn:str(labels.en), nameAr:str(labels.ar), emseCondition:1, values: [], valuesText: []};
						}
						logDebug("created finalAsiSettings["+a+"]: ");
						
						for (var asi in asiSettingsItem.fields){
							/*if (asi==0){
								continue;
							}*/
							var asiField = asiSettingsItem.fields[asi];
							//var childValue = str(getAppSpecificFromEnv(asiField.name));
							var text = str(getAppSpecificFromEnv(asiField.name));
							dropDownText += " - " + text;
						}
						finalAsiSettings[a].values = finalAsiSettings[a].values.concat(value);
						finalAsiSettings[a].valuesText = finalAsiSettings[a].valuesText.concat(dropDownText);							
					}
				}
			}
			
		}
	}
	java.lang.System.out.println("=== finalAsiSettings for AFMS in getASIDocumentMappingForACA() ==> " + JSON.stringify(finalAsiSettings));
	if (valuesReturned){
		return finalAsiSettings;		
	}
};

AFMS.prototype.getASITByAttachment = function (capId, docId, lang){
	var pCapId = capId;
	var asitSettings = this.getASITDocumentMapping();
	if (asitSettings){
		var asitObj = {headers:[], headersAR:[], rows:[]};
		var docRes = aa.document.getDocumentByPK(docId);
		
		try{
			var record = null;
			var cat = aa.cap.getCap(pCapId).getOutput().getCapType().getCategory().toString().toUpperCase();
			var altId = pCapId.getCustomID();
			eval(getScriptText("INCLUDE_" + cat));
			eval('if (typeof '+cat+' === "undefined") {	record = new Record("' + altId + '"); } else { record = new ' + cat + '("' + altId + '"); } ');
		}catch(err){
			java.lang.System.out.println("=== Error finding current Record object for AFMS in getASITByAttachment()==> " + err);
		}
		
		if (docRes.getSuccess()){
			var doc = docRes.getOutput();
			var docType = doc.getDocCategory();
			var docDescription = doc.getDocDescription();
			if (asitSettings[docType]){
				asitRows = asitSettings[docType];
				for (r in asitRows){
					var asitRowSetting = asitRows[r];
					var condition = true;
					var subgroup = asitRowSetting.subgroup;
					var name = asitRowSetting.name;
					var emseCondition = asitRowSetting.emseCondition;
					var asit = new ASITNavigator(pCapId, subgroup);
					var cols = asit.colNames;
					asitObj.subgroup = subgroup;
					asitObj.headers = cols;
					asit.filterBy(name, docDescription);
					row = -1;
					while (asit.nextRow()){
						var fields = [];
						var values = [];
						for (c in cols){
							var col = cols[c];
							var val = asit.getFieldStr(col);
							if (typeof lang != "undefined" && lang.indexOf("ar")>-1){
								val = asit.getFieldStrByLanguage(col, "ar_AE");
							}
							fields[col] = {name:col, value: val};
							values.push(val);
							//asitObj.rows[row].push(val);
						}

						fields.getField = function(fieldName){
							for (f in this){
								if (this.hasOwnProperty(f)){
									var val = this[f];
									if (String(fieldName).toUpperCase() == String(f).toUpperCase()){
										return this[f];
									}
								}
							}
						}
						
						if (emseCondition){
							condition = eval(emseCondition);
						}
						if (condition){
							row++;
							asitObj.rows.push(values);
						}
					}
					for (c in cols){
						var col = cols[c];
						var colAr = getFieldNameTranslated(col, subgroup);
						asitObj.headersAR.push(colAr);
					}
				}
				return asitObj;
			}
		}		
	}
};


AFMS.getAFMS = function (capId){
	try{
		if (capId){
			var capCat = String(aa.cap.getCapTypeModelByCapID(capId).getOutput().getCategory()).trim();
			// Get the AFMS configuration record by Category
			var afms = AFMS.getAFMSByCategory(capCat);
			if (afms){
				return afms;				
			}
		}
	}catch(err){
	}
	return null;
}

AFMS.fetchDocuments = function (capId) {
	arrAttachments = [];
    var arrDocuments = aa.document.getDocumentListByEntity(capId, "CAP").getOutput().toArray();
    if (arrDocuments != null && arrDocuments.length > 0) {
        aa.print("fetchDocuments() >> arrDocuments.length >> " + arrDocuments.length);
        for ( var j in arrDocuments) {
            var document = arrDocuments[j];
            //var documentName = String(document.getDocName()).replace(/[^a-zA-Z0-9]+/g, '');
            var documentName = String(document.getDocName()).trim();
            var filename = String(document.getFileName()).trim();
            var source = String(document.getSource()).trim();
            var docCategory = String(document.getDocCategory()).trim();
            var documentNo = String(document.getDocumentNo()).trim();
            var docDescription = String(document.getDocDescription()).trim();
            var fileKey = String(document.getFileKey()).trim();
            var docStatus = String(document.getDocStatus()).trim();
            
            var url = "/portlets/document/adobeDoc.do?mode=download&documentID="+documentNo+"&fileKey="+fileKey+"&source="+source+"&edmsType="+source;
            documentObj = {
            		documentName: documentName, 
            		filename: filename, 
            		source: source, 
            		category: docCategory, 
            		documentNo: documentNo,
            		fileKey: fileKey,
            		description: docDescription,
            		status: docStatus,
            		url: url
            	};
            arrAttachments.push(documentObj);
        }
    }
    return arrAttachments;
}


function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function getASIFields(capId){
	sql = getSQLQueryForASI(capId);
	var asiData = execQuery(sql);
	var asis = {};
	for (i in asiData){
		var asiFieldRow = asiData[i];
		groupCode = asiFieldRow["GROUP_CODE"];
		groupName = asiFieldRow["SUBGROUP_NAME"];
		groupNameEN = asiFieldRow["SUBGROUP_ALIAS_EN"];
		groupNameAR = asiFieldRow["SUBGROUP_ALIAS_AR"];
		fieldName = asiFieldRow["FIELDNAME"];//asiFieldRow["FIELDNAME"];
		fieldKey = asiFieldRow["FIELD"];//asiFieldRow["FIELDNAME"];
		fieldNameEN = asiFieldRow["ALTERNATIVE_LABEL_EN"];
		fieldNameAR = asiFieldRow["ALTERNATIVE_LABEL_AR"];
		value = asiFieldRow["FIELD_VALUE"];
		fieldType = asiFieldRow["FIELD_TYPE"];
		displayable = asiFieldRow["VCH_DISP_FLAG"];
	
		//aa.print(displayable)
		//if (displayable == "Y" || displayable == "H"){
			if (value == null){
				value = "";			
			} 
			//var id = generateHTMLId(groupName, fieldName);
			//if (fieldType=="3"){	// 3 = radio
			//	id = id + "_r1";
			//}			
			if (!asis[groupName]){
				asis[groupName] = {"fields": {}, "name": groupName, "aliasEN": groupNameEN, "aliasAR": groupNameAR};
			}			
			asiField = {"name": fieldNameEN, "subgroup": groupName, "subgroupAliasEN": groupNameEN, "subgroupAliasAR": groupNameAR, "value": String(value).trim(), "aliasEN": fieldNameEN, "aliasAR": fieldNameAR};
			//asiFields[name] = asiField;
			asis[groupName].fields[fieldKey] = asiField;
		//}
	}
	return asis;
}

function getSQLQueryForASI(capId){
	var capId1 = capId.getID1();
	var capId2 = capId.getID2();
	var capId3 = capId.getID3();
	
	var sql = "";
	sql += "SELECT b.serv_prov_code,  " + 
	"       per.b1_alt_id,  " + 
	"       b.b1_per_id1,  " + 
	"       b.b1_per_id2,  " + 
	"       b.b1_per_id3,  " + 
	"       l.template_code           AS GROUP_CODE,  " + 
	"       l.template_type           AS SUBGROUP_NAME,  " + 
	"       b.B1_CHECKBOX_IND 		AS 	FIELD_TYPE,  " + 
	"       groupEN.alternative_label AS SUBGROUP_ALIAS_EN,  " + 
	"       groupAR.alternative_label AS SUBGROUP_ALIAS_AR,  " + 
	"       l.conf_level,  " + 
	"       b.B1_CHECKBOX_DESC AS FIELD," +
	"       l.field_name              AS FIELDNAME,  " + 
	"       l.alternative_label       AS ALTERNATIVE_LABEL,  " + 
	"       leng.alternative_label    AS ALTERNATIVE_LABEL_EN,  " + 
	"       lara.alternative_label    AS ALTERNATIVE_LABEL_AR,  " + 

	"       b.b1_checklist_comment    AS FIELD_VALUE,  " + 
	"       r.r1_checkbox_ind,  " + 
	"       r.r1_display_order,  " + 
	"       r.r1_group_display_order,  " + 
	"       r.vch_disp_flag,  " + 
	"       r.res_id  " + 
	"FROM   b1permit per  " + 
	"       JOIN [bchckbox] b  " + 
	"         ON per.serv_prov_code = b.serv_prov_code  " + 
	"            AND per.b1_per_id1 = b.b1_per_id1  " + 
	"            AND per.b1_per_id2 = b.b1_per_id2  " + 
	"            AND per.b1_per_id3 = b.b1_per_id3  " + 
	"       JOIN [r2chckbox] r  " + 
	"         ON b.serv_prov_code = r.serv_prov_code  " + 
	"            AND b.b1_checkbox_type = r.r1_checkbox_type  " + 
	"            AND b.b1_checkbox_desc = r.r1_checkbox_desc  " + 
	"			 AND b.B1_ACT_STATUS = r.r1_checkbox_code " + 
	"       LEFT JOIN [rtemplate_layout_config] l  " + 
	"              ON r.r1_checkbox_code = l.template_code  " + 
	"                 AND r.r1_checkbox_type = l.template_type  " + 
	"                 AND r.serv_prov_code = l.serv_prov_code  " + 
	"                 AND r.r1_checkbox_desc = l.field_name  " + 
	"                 AND l.entity_type = 'ASI'  " + 
	"                 AND l.conf_level = 'FIELDNAME'  " + 
	"       LEFT JOIN [rtemplate_layout_config_i18n] leng  " + 
	"              ON l.res_id = leng.res_id  " + 
	"                 AND l.serv_prov_code = leng.serv_prov_code  " + 
	"                 AND l.rec_status = 'A'  " + 
	"                 AND leng.lang_id = 'en_US'  " + 
	"       LEFT JOIN [rtemplate_layout_config_i18n] lara  " + 
	"              ON l.res_id = lara.res_id  " + 
	"                 AND l.serv_prov_code = lara.serv_prov_code  " + 
	"                 AND l.rec_status = 'A'  " + 
	"                 AND lara.lang_id = 'ar_AE'  " + 
	"       LEFT JOIN [rtemplate_layout_config] g  " + 
	"              ON l.template_type = g.template_type  " + 
	"                 AND g.conf_level = 'TEMPLATENAME'  " + 
	"                 AND l.serv_prov_code = g.serv_prov_code  " + 
	"                 AND l.template_code = g.template_code  " + 
	"       LEFT JOIN [rtemplate_layout_config_i18n] groupEN  " + 
	"              ON g.res_id = groupEN.res_id  " + 
	"                 AND g.serv_prov_code = groupEN.serv_prov_code  " + 
	"                 AND g.rec_status = 'A'  " + 
	"                 AND groupEN.lang_id = 'en_US'  " + 
	"       LEFT JOIN [rtemplate_layout_config_i18n] groupAR  " + 
	"              ON g.res_id = groupAR.res_id  " + 
	"                 AND g.serv_prov_code = groupAR.serv_prov_code  " + 
	"                 AND g.rec_status = 'A'  " + 
	"                 AND groupAR.lang_id = 'ar_AE'  " + 
	"WHERE  per.b1_per_id1 = '"+capId1+"'  " + 
	"       AND per.b1_per_id2 = '"+capId2+"'  " + 
	"       AND per.b1_per_id3 = '"+capId3+"'  " + 
	//"       AND r.r1_checkbox_code = 'ANMC'  " + 
	//"       AND r.r1_checkbox_type = 'CONTRACTDETAILS'  " + 
	"       AND per.serv_prov_code = '"+aa.getServiceProviderCode()+"' ";
	logDebug("SENDBACK:GETCAPASIDATA SQL: " + sql);
	return sql;
}

function execQuery(sql) {
	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var utilProcessor = new JavaAdapter(com.accela.aa.datautil.DBResultSetProcessor, {
		processResultSetRow: function(rs) {
			var meta = rs.getMetaData();
			var numcols = meta.getColumnCount();
			var record = {}
			var result = null;
			for (var i = 0; i < numcols; i++) {
				var columnName = meta.getColumnName(i + 1);
				columnName = columnName.toUpperCase()
				result = rs.getObject(i + 1);
				if (result == null) {
					record[columnName] = String("");
				} else {
					if (result.getClass && result.getClass().getName() == "java.sql.Timestamp") {

						record[columnName] = String(new Date(rs.getTimestamp(i + 1).getTime()).toString("MM/dd/yyyy"));
					} else {
						record[columnName] = String(rs.getObject(i + 1));
					}
				}
			}
			return record;
		}
	});
	var result = dba.select(sql, [], utilProcessor, null);
	ret = result.toArray()
	var data = [];
	for (var x in ret) {
		var o = {};
		for (var y in ret[x]) {
			o[y] = String(ret[x][y])
		}
		data.push(o)
	}
	return data;
}



useAppSpecificGroupName = true;
function getAppSpecificByAlias(itemName)  // optional: itemCap
{
	var updated = false;
	var i=0;
	//var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
   	
	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)
			{ logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ; return false }
		
		
		var itemGroup = itemName.substr(0,itemName.indexOf("."));
		var itemName = itemName.substr(itemName.indexOf(".")+1);
	}
	
    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
 	{
		var appspecObj = appSpecInfoResult.getOutput();
		
		if (itemName != "")
		{
			for (i in appspecObj)
				if( appspecObj[i].getLabelAlias() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup) )
				{
					return appspecObj[i].getChecklistComment();
					break;
				}
		} // item name blank
	} 
	else
		{ logDebug( "**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage()) }
	return "";
}

function getFieldNameTranslated(fieldName, groupName) {
	var sql = "SELECT DISTINCT R.R1_CHECKBOX_DESC " +
	"FROM R2CHCKBOX T " +
	"LEFT JOIN R2CHCKBOX_I18N R " +
	"ON R.RES_ID = T.RES_ID " +
	"AND R.Lang_Id = 'ar_AE' " +
	"AND T.SERV_PROV_CODE = R.SERV_PROV_CODE " +
	"WHERE T.REC_STATUS='A' " +
	"AND T.SERV_PROV_CODE = '"+aa.getServiceProviderCode()+"' " +
	"AND T.R1_CHECKBOX_TYPE='"+groupName+"' " +
	"AND T.R1_CHECKBOX_DESC='"+fieldName+"' " + 
	"  AND R.R1_CHECKBOX_DESC IS NOT NULL ";
	logDebug("SQL Query for translated fieldname", sql);
	var results = execQuery(sql);
	var value = "";
	if (results.length){
		value = results[0]["R1_CHECKBOX_DESC"];
	}
	if(value == null || value == "")
	{
		value = fieldName;
	}

	return value;
}

function translateField(name, lang){
	if (name){
		var pName = String(name).toUpperCase();
		for (f in fieldTranslations)	{
			if(fieldTranslations.hasOwnProperty(f)){
				var theName = String(f).toUpperCase();
				if (pName == theName){
					if (fieldTranslations[f][lang]){
						return fieldTranslations[f][lang];						
					}else{
						return fieldTranslations[f].en;
					}
				}
			}
		}	
	}
	return name;
}

if (!Array.prototype.unique){
	Object.defineProperty(Array.prototype, 'unique', {
		enumerable: false,
		value: function(){
			var a = this.concat();
			for(var i=0; i<a.length; ++i) {
				for(var j=i+1; j<a.length; ++j) {
					// If it's a JS object, look for the capType as the unique property
					if (typeof a[i] == "object"){
						if(a[i].capType == a[j].capType){
							a.splice(j--, 1);
						}
					}else{
						if(a[i] === a[j])
							a.splice(j--, 1);
					}
				}
			}
			return a;
		}
	});	
}

function getAppSpecificFromEnv(itemName)  
{
    var thisCapModel = aa.env.getValue("CapModel");     
    var asiGroups = thisCapModel.getAppSpecificInfoGroups();
    var conditionValue = getFieldValue(itemName,asiGroups); 
    return conditionValue;
}

function getFieldValue(fieldName, asiGroups)
{     
        if(asiGroups == null)
        {
            return null;
        }
        
    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext())
    {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null)
        {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                var field = iteFields.next();
                if (fieldName == field.getCheckboxDesc())
                {
                    return field.getChecklistComment();
                }
            }
        }
    }   
    return null;    
}

function getAppSpecificLabelFromEnv(itemName)  
{

    var thisCapModel = aa.env.getValue("CapModel");     
    var asiGroups = thisCapModel.getAppSpecificInfoGroups();
    var conditionValue = getFieldLabel(itemName,asiGroups); 
    return conditionValue;
}

function getFieldLabel(fieldName, asiGroups)
{     
        if(asiGroups == null)
        {
            return null;
        }
        
    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext())
    {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null)
        {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                var field = iteFields.next();
                if (fieldName == field.getCheckboxDesc())
                {
                	printValues(field);
                	var groupCode = field.getGroupCode();
                	var subGroup = field.getCheckboxType();
                	var arabicLabel = getArabicLabel(fieldName, subGroup, groupCode);
                	//var arabicLabel = getFieldNameTranslated(fieldName, subGroup);
                    return {en: field.getLabelAlias(), ar: arabicLabel};
                }
            }
        }
    }   
    return null;    
}

function getArabicLabel(fieldName, subGroup, groupCode){

	var sql = "";
	sql += "SELECT lara.ALTERNATIVE_LABEL FROM rtemplate_layout_config l " + 
	"	LEFT JOIN [rtemplate_layout_config_i18n] lara " +   
	"	             ON l.res_id = lara.res_id   " + 
	"				 AND l.serv_prov_code = lara.serv_prov_code   " + 
	"		        AND l.rec_status = 'A'  " + 
	"				AND lara.lang_id = 'ar_AE'  " + 
	"	WHERE FIELD_NAME = '"+fieldName+"' " + 
	"	AND TEMPLATE_CODE = '"+groupCode+"' " + 
	"	AND TEMPLATE_TYPE = '"+subGroup+"' " + 
	"   AND l.serv_prov_code = '"+aa.getServiceProviderCode()+"' ";
	logDebug("getArabicLabel SQL: " + sql);
	
	var results = execQuery(sql);
	var value = "";
	if (results.length){
		value = results[0]["ALTERNATIVE_LABEL"];
	}
	if(value == null || value == "")
	{
		value = fieldName;
	}

	return value;
}

function getAppSpecificFromEnvPrint(itemName)  
{

    var thisCapModel = aa.env.getValue("CapModel");     
	com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");
    var asiGroups = thisCapModel.getAppSpecificInfoGroups();
    var conditionValue = getFieldValuePrint(itemName,asiGroups); 
    return conditionValue;
}

function getFieldValuePrint(fieldName, asiGroups)
{     
        if(asiGroups == null)
        {
            return null;
        }
        
    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext())
    {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null)
        {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                var field = iteFields.next();
                if (fieldName == field.getCheckboxDesc())
                {
                	printValues(field);
                    return field.getChecklistComment();
                }
            }
        }
    }   
    return null;    
}


function printValues(object)
{
    for (x in object.getClass().getMethods())
    {
		try{
			var theName = object.getClass().getMethods()[x].getName();
			var theValue="";
			if (theName.indexOf("get")==0){
				eval("theValue = object."+theName+"();");
				logDebug(object.toString() + " | " + theName + ": " + theValue);
			}
		} catch(e) {
			logDebug("Error: " + e);
		}
    }
	logDebug(" ");
}

function formatDate(input) {
	var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
	if (!input || !input.match(pattern)) {
		return null;
	}
	return input.replace(pattern, '$2/$3/$1');
};
function str(msg){
	if (msg == "null" || msg == "undefined" || typeof msg == "null" || typeof msg == "undefined") {
		msg = "";
	}
	return String(msg).trim();
}

function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null){
		msg2 = "";
	}else{
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2); 
}

function getArabicDDValue(capId, fieldName, group){
	var originalLanguage = com.accela.i18n.I18NContext.getI18NModel().getLanguage();
	if (originalLanguage == "en-US"){
		com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");		
	}
	
	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(capId);
	if (appSpecInfoResult.getSuccess()) {
	    var appspecObj = appSpecInfoResult.getOutput();

        if (fieldName != "") {
            for (i in appspecObj){
            	if (!group){
            		var groupCodeCondition = true;
            	}else{
            		var groupCodeCondition = (String(appspecObj[i].getCheckboxType()).trim()==String(group).trim());
            	}
                if ((String(appspecObj[i].getCheckboxDesc()).trim() == String(fieldName).trim()) && (groupCodeCondition)) {
                	var field = appspecObj[i];
                	//printValues(field);
                	var valueEn = field.getChecklistComment();
                	aa.print("Selected Value: " + valueEn);
                	var valueList = field.getValueList();
                	for (var i=0; i<valueList.size(); i++){
                    	var listItem = valueList.get(i);
                    	if (listItem.getAttrValue() == valueEn){
//                    		printValues(valueInList);
                    		return listItem.getDispAttrValue();
                    	}
                		
                	}
                }          	
            }
        } // item name blank
	    //aa.print(appspecObj[1].getValueList().get(0).getDispAttrValue());
	    //printValues(appspecObj[1].getValueList().get(0));
	}
	if (originalLanguage == "en-US"){
		com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLanguage);		
	}
}


function getArabicDDValueASIT(capId, group, fieldName, value){
	var originalLanguage = com.accela.i18n.I18NContext.getI18NModel().getLanguage();
	if (originalLanguage == "en-US"){
		com.accela.i18n.I18NContext.getI18NModel().setLanguage("ar_AE");		
	}
	
	var asit = new ASITNavigator(capId, group);
	//aa.print(asit.columns[2]);
	var column = asit.getColumn(fieldName).getColumnModel();
	//printValues(asit.columns[2].getColumnModel());
	
	var valueList = column.getValueList();
	for (var i=0; i<valueList.size(); i++){
    	var listItem = valueList.get(i);
    	//aa.print("getAttrValue: " + listItem.getAttrValue());
    	//aa.print("value: " + value);
    	if (String(listItem.getAttrValue()).trim() == String(value).trim()){
//    		printValues(valueInList);
    		return listItem.getDispAttrValue();
    	}
	}
	if (originalLanguage == "en-US"){
		com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLanguage);		
	}
}