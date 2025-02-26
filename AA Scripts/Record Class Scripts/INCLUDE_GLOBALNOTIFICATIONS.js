/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_GLOBALNOTIFICATIONS.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: KBAYOQ
| Created at	: 08/10/2018 14:50:48
|
/------------------------------------------------------------------------------------------------------*/
/*-USER-----------DATE----------------COMMENTS----------------------------------------------------------/
 | VASU            02/07/2020 03:57:04 HFL Stamp
 | AFAKHRY         02/06/2021 09:46:08 Add CRI Module
 /-----END CHANGE LOG-----------------------------------------------------------------------------------*/

var showDebug = true;
eval(getScriptText("INCLUDE_RECORD"));
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
if (typeof Utils === "undefined") {
	eval(getScriptText("INCLUDE_UTILS"));
}

var edmsDocumentUploadWebService = aa.proxyInvoker.newInstance("com.accela.webservice.service.EDMSDocumentUploadWebService").getOutput();
function GlobalNotifications(currentCapId) {
	this.currentCapId = currentCapId != null ? currentCapId : capId;
	this.globalNotificationsHash = aa.util.newHashMap();
	this.receipientsHash = aa.util.newHashMap();
	var ret = this.loadNotifications();
	if (ret) {
		this.loadReceipients();
	}
}

GlobalNotifications._RecordPrefex = "GSSGNT";
GlobalNotifications._ASITName = "NOTIFICATION EVENTS";
GlobalNotifications._Event = "Event";
GlobalNotifications._WorkflowStep = "Workflow Step";
GlobalNotifications._Workflow_Step_Status = "Workflow Step Status";
GlobalNotifications._TemplateName = "Template Name";
GlobalNotifications._NotifyApplicant = "Notify Applicant";
GlobalNotifications._NotifyEmployee = "Notify Employee";
GlobalNotifications._NotifyRepresentitives = "Notify Representatives";



GlobalNotifications._NotificationParameters = "Notification Parameters";
GlobalNotifications._Type = "";
GlobalNotifications._Category = "";
GlobalNotifications._Attachment = {}
GlobalNotifications._Attachment._FileName = "";
GlobalNotifications._Attachment._FileContent = "";

//TODO set showDebug true for logging
GlobalNotifications.prototype.log = function(msg) {
	if (showDebug && msg != null){
		java.lang.System.out.println(msg);
		//aa.print(msg);
	}
}

GlobalNotifications.log = function(msg) {
	if (showDebug && msg != null){
		java.lang.System.out.println(msg);
		//aa.print(msg);
	}
}

var currentCapId = null;
var currentRecord = null;
GlobalNotifications.prototype.getRecord = function() {
	if (this.currentRecord == null){

		if(this.currentCapId != null)
			this.currentRecord  = new Record(this.currentCapId);

		else if(capId != null)
			this.currentRecord = new Record(capId);
	}
	return this.currentRecord;
}

GlobalNotifications.prototype.getCapID = function() {
	if(this.currentCapId == null)
		this.log("GlobalNotifications: capId is null");
	return this.getRecord().getCapID();
}

GlobalNotifications.prototype.loadNotifications = function() {
	var record = this.getRecord();
	var emailParameters = aa.util.newHashtable();
	var capType = record.getCapType().toString();
	var capTypeArr = capType.split("/");
	var module = capTypeArr[0];
	var type = capTypeArr[1];
	var category = capTypeArr[3];
	var typeAbb = module;

	this._Type = typeAbb;
	this._Category = category;
	var gssgntRecId = GlobalNotifications._RecordPrefex + "-" + typeAbb + "-" + category;

	var configExists = aa.cap.getCapID(gssgntRecId).getSuccess();

	if (configExists) {
		var confRec = new Record(gssgntRecId);
		this.log("GSSGNT::Notification Configuration recoed Exist: " + confRec)
		var confASIT = confRec.getASIT(GlobalNotifications._ASITName, true);
		this.log("GSSGNT::Notification Configuration recoed ASIT Length: " + confASIT.length)

		for (var index = 0; index < confASIT.length; index++) {
			var event = confASIT[index][GlobalNotifications._Event];
			var workflowStep = confASIT[index][GlobalNotifications._WorkflowStep];
			var workflowStepStatus = confASIT[index][GlobalNotifications._Workflow_Step_Status];
			var templateName = String(confASIT[index][GlobalNotifications._TemplateName]).trim();
			var notifyApplicant = confASIT[index][GlobalNotifications._NotifyApplicant];
			var notifyEmployee = confASIT[index][GlobalNotifications._NotifyEmployee];
			var notifyRepresentitives = confASIT[index][GlobalNotifications._NotifyRepresentitives];

			this.log("notifyRepresentitives 1 : " + notifyRepresentitives);
			var notificationParameter = confASIT[index][GlobalNotifications._NotificationParameters];
			this.globalNotificationsHash.put(event + workflowStep + workflowStepStatus, new this.Notification(templateName, notifyApplicant, notifyEmployee, notificationParameter, notifyRepresentitives)

			);

		}
		//aa.print("globalNotificationsHash size: " + this.globalNotificationsHash.size());

		this.log("GSSGNT::Notification Configuration recoed Exist return true")
		return true;
	} else {
		this.log("GSSGNT::Notification Configuration recoed does not exist for record type: " + capType)
		return false;
	}

}
GlobalNotifications.prototype.Notification = function(tName, notifyApplicant, notifyEmployee, nParameter, notifyRepresentitives) {
	this.templateName = tName;
	this.notifyApplicant = notifyApplicant;
	this.notifyEmployee = notifyEmployee;
	
	this.notificationParameter = nParameter;
	this.notifyRepresentitives = notifyRepresentitives;
}

GlobalNotifications.prototype.sendNotification = function(event, workflowStep, workflowStepStatus, emailParams, filename, fileContent, attachmentList, emailArrayList, bccEmail, smsArrayList) {
	try {
		this.log("MISSA==> send notification started");
		GlobalNotifications._Attachment._FileName = filename;
		GlobalNotifications._Attachment._FileContent = fileContent;
		
		var notification = this.globalNotificationsHash.get(event + workflowStep + workflowStepStatus);
		if (notification == null) {
			notification = this.globalNotificationsHash.get(event + "*" + workflowStepStatus);
		}
		// event + workflowStep + workflowStepStatus
		if (notification != null) {
			var notificationParameter = notification.notificationParameter;
			var notificationTemplate = notification.templateName;
			var CommunicationHelper = aa.proxyInvoker.newInstance("com.accela.aa.communication.CommunicationHelper").getOutput();
			var emailArray = [];
			var smsArray = [];
			/*
			for (var n in notification){
				if (notification.hasOwnProperty(n)){
					var notificationContactType = n;
					var notificationContactTypeValue = notification[n];
					
				}
			}*/
			if (notification.notifyEmployee != "None") {
				var PROArr = this.receipientsHash.get("Employee");
				for (var index = 0; index < PROArr.length; index++) {
					var currContact = PROArr[index];
					if(currContact.isInternalUser != "Y")
					{
						if (notification.notifyEmployee.contains("Email") && currContact.Email != null && currContact.Email != "" && !isInclude(emailArray, currContact.Email + ',TO')) {
							emailArray.push([ currContact.Email, 'TO' ]);
						}
						if (notification.notifyEmployee.contains("SMS") && currContact.Phone != null && currContact.Phone != "" && !isInclude(smsArray, currContact.Phone)) {
							smsArray.push(currContact.Phone);
						}
					}
				}
			}
			if (notification.notifyApplicant != "None") {
				var CMEProvArr = this.receipientsHash.get("Applicant");
				for (var index = 0; index < CMEProvArr.length; index++) {
					var currContact = CMEProvArr[index];

					if(currContact.isInternalUser != "Y")
					{
						if (notification.notifyApplicant.contains("Email") && currContact.Email != null && currContact.Email != "" && !isInclude(emailArray, currContact.Email + ',TO')) {
							emailArray.push([ currContact.Email, 'TO' ]);
						}
						if (notification.notifyApplicant.contains("SMS") && currContact.Phone != null && currContact.Phone != "" && !isInclude(smsArray, currContact.Phone)) {
							smsArray.push(currContact.Phone);
						}
					}
				}
			}
			
			var record = this.getRecord();

			this.log("notifyRepresentitives: " + notification.notifyRepresentitives);
			if (notification.notifyRepresentitives != "None") {
				var licenses = record.getLicenses();
	
				for(var x in licenses)
				{
					if (notification.notifyRepresentitives.contains("Email")) {
						emailArray.push([ licenses[x].getEmail(), 'TO' ]);
					}
					
					if (notification.notifyRepresentitives.contains("SMS")) {
						var phoneNumber = licenses[x].getPhone1();
						if(phoneNumber != null && phoneNumber != "")
						{
							smsArray.push(licenses[x].getPhone1());
						}
					}
				}
	
				if (emailArrayList != null) {
					for ( var emailIndex in emailArrayList) {
						emailArray.push([ emailArrayList[emailIndex], 'TO' ]);
					}
				}
			}

			this.log("emailArray: " + emailArray.length + "::" + emailArray);
			this.log("templateName: " + notification.templateName);
			
			var altId = record.getCustomID();

			if (emailArray != null && emailArray.length > 0) {
				var finalTemplateName = notification.templateName;
				this.log("finalTemplateName: " + notification.templateName);
				this.log("To email Array: " + emailArray.length);
				
				var originalLanguage = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale();
				
				// Send Both Languages as Emails
				var languages = ["en_US"];//,"ar_AE"];
				var smsContent = "";
				
				for (var l in languages){
					var lang = languages[l];
					com.accela.i18n.I18NContext.getI18NModel().setLanguage(lang);
					
					templateResult = aa.communication.getNotificationTemplate(finalTemplateName).getOutput();

					if (templateResult != null) {
						
						// Process all the Email Parameters & store them in this.emailParameters
						this.initEmailParameters(emailParams, notificationParameter);
						this.log("emailParameters: " + this.emailParameters);
						
						CommunicationHelper.replaceVariables(templateResult, this.emailParameters);
						emailTempModel = templateResult.getEmailTemplateModel();
						this.log(emailTempModel)

						// append second email

						//var templateContent = emailTempModel.getI18NModel().getContentText();
						
						var title = this.replaceVariables(emailTempModel.getI18NModel().getTitle());
						var content = this.replaceVariables(emailTempModel.getI18NModel().getContentText());
						
						this.log("email Template Title After Parameters:" + title);
						this.log("email Template Content After Parameters multiLang:" + content);

						content = mergeTempaltes(content, this.emailParameters);
						
						// end second email
						
						//if (lang=="ar_AE"){
							title = "=?utf-8?B?" + base64_encode(title) + "?=";
						//}
						
						// Construct SMS Message
						var smsTempModel = templateResult.getSmsTemplateModel();
						if (!smsContent){
							// Start With the English Content
							smsContent = this.replaceVariables(smsTempModel.getI18NContent());							
						}else{
							// English Already Added, so add Arabic to the end of the TXT message.
							smsContent += '\n' + this.replaceVariables(smsTempModel.getI18NContent());							
						}
						
						cmId = this.sendEmailByModel(title, content, emailArray, attachmentList, finalTemplateName);
						
						
						if (!Utils.isBlankOrNull(title) && !Utils.isBlankOrNull(cmId)) {

							var comBusiness = aa.proxyInvoker.newInstance("com.accela.aa.communication.business.CommunicationBusiness").getOutput();
							var msgModel = comBusiness.getMessageModel(aa.getServiceProviderCode(), com.accela.aa.communication.model.MessageType.EMAIL, cmId, true);

							// msgModel.setTitle("=?utf-8?B?" + base64_encode(emailTempModel.getTitle()) + "?=");
							msgModel.setTitle(title);
							comBusiness.updateCommunication(msgModel);
						}

						aa.communication.associateEnities(cmId, altId, 'RECORD');
						try {
							var notificationDocumentCategory = Record.getLookupVal("CONVERT_EMAIL_TO_PDF", finalTemplateName);

							if (!Utils.isBlankOrNull(notificationDocumentCategory)) {
								if (typeof PdfConversion === "undefined") {
									eval(getScriptText("INCLUDE_PDFCONVERSION"));
								}

								PdfConversion.callConversionAPI(cmId, this.getCapID(), notificationDocumentCategory);

							}
						} catch (e) {
							this.log("Error In sendNotification PDF Conversion::" + e);
						}
					}
				}
				
				// Restore Original Language
				com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLanguage);
			}
			try {
				if (smsArrayList != null && smsArrayList.length > 0) {	
					for(var n in smsArrayList)
					{
						smsArray.push(smsArrayList[n])
					}
				}
				
				if (smsArray != null && smsArray.length > 0) {
					this.log("SMS: " + smsArray.length);
					// this.log(smsTempModel)
					if (smsContent) {
						this.sendSMSByModel(smsContent, smsArray, altId);
					}
				}
			} catch (e) {
				this.log("Error In sendNotification SMS " + e);
			}

		}
	} catch (e) {
		this.log("Error In sendNotification " + e);
		//aa.print("Error In sendNotification " + e);
	}
}
GlobalNotifications.prototype.loadReceipients = function() {
	this.receipientsHash.put("Applicant", []);
	this.receipientsHash.put("Employee", []);

	var contactArr = aa.people.getCapContactByCapID(this.getCapID()).getOutput();

	logDebug("GSSGNT::Notification Configuration recoed loadReceipients :" + contactArr.length)
	if (contactArr.length > 0) {
		for (var q = 0; q < contactArr.length; q++) {
			var contactOBj = new Object();
			var contactModel = contactArr[q].getCapContactModel();
			var contactType = contactModel.getContactType();
			var email = contactModel.getEmail();
			if (email && email != "") {
				contactOBj.Email = email;
			}
			var phone = contactModel.getPhone1();
			if (phone && phone != "") {
				contactOBj.Phone = phone;
			}
			
			var isInternalUser = contactModel.getInternalUserFlag()
			if (isInternalUser && isInternalUser != "") {
				contactOBj.isInternalUser = isInternalUser;
			}
			else
			{
				contactOBj.isInternalUser = "N";
			}

			logDebug("GSSGNT::Notification Configuration recoed Email :" + contactOBj.Email + " Email = " + email)
			logDebug("GSSGNT::Notification Configuration recoed Phone :" + contactOBj.Phone + " Phone = " + phone)

			logDebug("GSSGNT::Notification Configuration recoed contactType :" + contactType)
			logDebug("GSSGNT::Notification Configuration recoed contactOBj :" + contactOBj)

			this.receipientsHash.get(contactType).push(contactOBj);

		}
	}
}
GlobalNotifications.prototype.sendEmailByModel = function(pTitle, pContent, pContactArr, attachmentList, templateName, bccEmail) {

	var isLetter = false;
	if (!Utils.isBlankOrNull(templateName)) {
		isLetter = lookup("CONVERT_EMAIL_TO_PDF", templateName);
	}

	function formContacts(pContactArr) {
		var contacts = aa.communication.getContactList(pContactArr, "email").getOutput();
		return contacts;
	}
	var messageModel = aa.communication.getEmailMessageScriptModel().getOutput();

	var acaUrl = "https://aca.ahc.gov.ae/DOH/";
	var getBizDomain = aa.bizDomain.getBizDomainByValue("ACA_CONFIGS", "ACA_SITE").getOutput();
	if (getBizDomain && getBizDomain != "") {
		acaUrl = getBizDomain.getDescription();
		acaUrl = acaUrl.substring(0, acaUrl.toLowerCase().indexOf('admin'));
	}
	var header = "";//acaUrl + "customization/images/Deparment%20of%20Health-stamp-01.png";
	var headerConfidetial = "";//acaUrl + "customization/images/confidential1.png";
	var footerConfidetial = "";//acaUrl + "customization/images/confidential2.png";
	var hflLetterFooter = "";//acaUrl + "customization/images/HFL%20Letter%20Footer.png";
	var hflLetterStamp = "";// acaUrl + "customization/images/Stamp.png";
	// var getBizDomain =
	// aa.bizDomain.getBizDomainByValue("ACA_EMAIL_IMAGE_SRC","header").getOutput();
	// if(getBizDomain && getBizDomain!=""){
	// header = getBizDomain.getDescription();
	// }
	var footer = "";//acaUrl + "customization/images/Untitled.png";
	// var getBizDomain =
	// aa.bizDomain.getBizDomainByValue("ACA_EMAIL_IMAGE_SRC","footer").getOutput();
	// if(getBizDomain && getBizDomain!=""){
	// footer = getBizDomain.getDescription();
	// }

	// pTitle = base64_encode(pTitle);
	messageModel.setHeader("Content-Type: text/plain; charset=\"UTF-8\"");
	messageModel.setTitle("" + pTitle + "");
	pContent = pContent.replaceAll("&lt;", "<");
	pContent = pContent.replaceAll("&gt;", ">");
	var contentHeader = "";//"<div style=\"text-align:center;\"><img src=\"" + header + "\"></div>";

	if (this._Type == "HPL") {
		var contentFooter = '<div dir="ltr"><p>For more information please communicate with Health Professional Licensing Department through email :hplicensing@doh.gov.ae or direct numbers : 0097124193428, 0097124193628</span></p><br></div>';
		// var contentFooter = '<div dir="rtl"><p><strong>وتفضلوا بقبول فائق الاحترام والتقدير ،،،</strong></p><p>لمزيد من المعلومات يرجى التكرم بمراجعة تراخيص المهن الصحية | تراخيص الرعاية الصحية
		// والتعليم
		// الطبي عن طريق البريد الإلكتروني <a dir="ltr" href="mailto:hplicensing@doh.gov.ae">hplicensing@doh.gov.ae</a> أو على الأرقام التالية: <span dir="ltr">0097124193428,
		// 0097124193628</span></p><br><div
		// style="float:right;" align="right"><strong>تراخيص المهن الصحية | تراخيص الرعاية الصحية والتعليم الطبي&nbsp; </strong></div></div>';
	} else if (this._Type == "HFL") {
		var contentFooter = "";
		// contentFooter = '<div dir="ltr"><p>For more information please communicate with Health Facility Licensing Department through email :HFLD@doh.gov.ae or direct numbers : 037165089 ,
		// 024193396</span></p><br></div>';
		// var contentFooter = '<div dir="rtl"><p><strong>وتفضلوا بقبول فائق الاحترام والتقدير ،،،</strong></p><p>لمزيد من المعلومات يرجى التكرم بمراجعة إدارة تراخيص المنشآت الصحية عن طريق البريد
		// الإلكتروني
		// <a dir="ltr" href="mailto:HFLD@doh.gov.ae">HFLD@doh.gov.ae</a> أو على الأرقام التالية: <span dir="ltr">037165089 , 024193396</span></p><br><div style="float:right;"
		// align="right"><strong>إدارة
		// تراخيص المنشآت الصحية&nbsp; </strong></div></div>';
		if (isLetter) {
			contentFooter += '<div dir="rtl"><p>لمزيد من المعلومات يرجى التكرم بمراجعة إدارة تراخيص المنشآت الصحية عن طريق البريد الإلكتروني </span><br/><a dir="ltr" href="mailto:HFLD@doh.gov.ae">HFLD@doh.gov.ae</a> أو على الأرقام التالية: <span dir="ltr">037165089 , 024193396</p><br/></div>';
			contentFooter += '<div dir="rtl" style=\"text-align:center;\"><p><strong>وتفضلوا بقبول فائق الاحترام والتقدير،،،</strong></p></div>';
			contentFooter += '<div dir="rtl" style=\"text-align:left;\"><span><strong>إدارة تراخيص المنشآت الصحية&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></span></div>';
			contentHeader = "<div dir=\"rtl\"><span><img src=\"" + header + "\"/></span> <span style=\"float: left;\"><img src=\"" + headerConfidetial + "\"/></span></div><br/>";
			contentFooter += "<div id ='dohStamp' style=\"text-align:center;\"><img src=\"" + hflLetterStamp + "\"></div>";
			contentFooter += "<div style=\"text-align:left;\"><img src=\"" + footerConfidetial + "\"></div>";
			contentFooter += "<div style=\"text-align:center;\"><img src=\"" + hflLetterFooter + "\"></div>";
		} else {
			contentFooter = '<div dir="ltr"><p>For more information please communicate with Health Facility Licensing Department through email :HFLD@doh.gov.ae or direct numbers : 037165089 , 024193396</span></p><br></div>';
		}
	} else {
		// var contentFooter = '<div dir="rtl"><p><strong>وتفضلوا بقبول
		// فائق الاحترام والتقدير ،،،</strong></p><p>لمزيد من المعلومات
		// يرجى التكرم بمراجعة إدارة تراخيص المنشآت الصحية عن طريق
		// البريد الإلكتروني <a
		// href="mailto:HFLD@doh.gov.ae">HFLD@doh.gov.ae</a> أو على
		// الأرقام التالية: <span dir="ltr">02-4193396,
		// 03-7165089</span></p><br><div style="float:right;"
		// align="right"><strong>إدارة تراخيص المنشآت الصحية&nbsp;
		// </strong></div><div style="float:left;"
		// align="left"><strong>Health facility Licensing
		// Department</strong></div><div><img
		// src="'+footer+'"></div></div>';
		var contentFooter = "";//'<div dir="rtl"><div><img src="' + footer + '"></div></div>';

	}
	if ((GlobalNotifications._Attachment && GlobalNotifications._Attachment._FileName && GlobalNotifications._Attachment._FileName != "" && GlobalNotifications._Attachment._FileContent && GlobalNotifications._Attachment._FileContent != "")
			|| (attachmentList != null && attachmentList.length > 0)) {

		var contacts = formContacts(pContactArr);
		this.log("contacts : " + contacts);
		for (var c = 0; c < contacts.size(); c++) {
			if (attachmentList != null && attachmentList.length > 0) {
				var cmId = this.sendEmailWithAttachment("" + pTitle + "", "", contacts.get(c).getContactInfo(), contentHeader + pContent + contentFooter, null, null, attachmentList, bccEmail);
				aa.communication.associateEnities(cmId, this.getCapID().getCustomID(), 'RECORD');
			} else {
				var cmId = this.sendEmailWithAttachment("" + pTitle + "", "", contacts.get(c).getContactInfo(), contentHeader + pContent + contentFooter, GlobalNotifications._Attachment._FileName,
						GlobalNotifications._Attachment._FileContent, null, bccEmail)
						aa.communication.associateEnities(cmId, this.getCapID().getCustomID(), 'RECORD');
			}
		}
	} else {
		messageModel.setContent(contentHeader + pContent + contentFooter);
		if (bccEmail != null) {
			pContactArr.push([ bccEmail, 'BCC' ]);
		}
		var contacts = formContacts(pContactArr);

		messageModel.setContacts(contacts);
		messageModel.setTriggerEvent('From EMSE script');

		var result = aa.communication.sendMessage(messageModel);

		aa.debug("sendEmailByModel result", result.getOutput());
		return result.getOutput();
	}
}

GlobalNotifications.prototype.sendEmailWithAttachment = function(title, from, to, content, fileName, docContent, attachmentList, bccEmail) {
	try {
		var files = [];
		var tempFiles = [];
		if (attachmentList != null) {
			for ( var docIndex in attachmentList) {
				var docContent = this.getDocumentContent(attachmentList[docIndex]);
				this.log("docContent :" + docContent);
				var byteArray = javax.xml.bind.DatatypeConverter.parseBase64Binary(docContent);
				var filename = attachmentList[docIndex].getFileName();
				this.log("filename :" + filename);
				var filetype = filename.substring(filename.lastIndexOf('.') + 1);
				this.log("filetype :" + filetype);
				var tempFile = null;
				if (filetype)
					tempFile = java.io.File.createTempFile(attachmentList[docIndex].getFileName(), "." + filetype, null);
				else
					tempFile = java.io.File.createTempFile(attachmentList[docIndex].getFileName(), ".pdf", null);
				var fos = new java.io.FileOutputStream(tempFile);
				fos.write(byteArray);
				this.log("***RRRR2***,  about to call uploadDocument");
				this.log('tempFile: ' + tempFile);
				files.push(tempFile.getAbsolutePath());
				tempFiles.push(tempFile);
				fos.close();
			}
		} else {
			var byteArray = javax.xml.bind.DatatypeConverter.parseBase64Binary(docContent);
			var tempFile = java.io.File.createTempFile(fileName, ".pdf", null);
			var fos = new java.io.FileOutputStream(tempFile);
			fos.write(byteArray);
			this.log("***RRRR2***,  about to call uploadDocument");
			// this.log(tempFile);
			files.push(tempFile.getAbsolutePath());
			tempFiles.push(tempFile);
			fos.close();
		}

		// var sendMail = aa.sendEmailWithAttachedFiles(emailTemplateModel.getFrom(),
		// emailTemplateModel.getTo(), emailTemplateModel.getCc(),
		// emailTemplateModel.getTitle(), emailTemplateModel.getContentText(), files);
		// var sendMail = aa.sendEmailWithAttachedFiles("HAA.Notifications@doh.gov.ae",
		// to, "",title, content, files);

		var communication = com.accela.aa.communication.CommunicationImpl();
		var emailMessage = communication.buildEmailMessage(aa.getServiceProviderCode(), title, content, from, to, null, bccEmail, null, null, null, "EMSE Attached Files",
				tempFiles);
		emailMessage.setAuditModel(new com.accela.orm.model.common.AuditModel(null, aa.getAuditID(), "A"));
		var cmId = communication.sendMessage(emailMessage);
		for ( var index in tempFiles) {
			tempFiles[index].delete();
		}

		this.log(cmId + '');
		return cmId;

	} catch (e) {
		Utils.printLog("Error in GlobalNotifications.prototype.sendEmailWithAttachment: " + e);
	}
}

GlobalNotifications.prototype.sendSMSByModel = function(pContent, pContactArr, altId) {
	eval(getScriptText("INCLUDE_SMS_GATEWAY"))
	try {
		var smsGateway = new SmsGateway();
		for (var i = 0; i < pContactArr.length; i++) {
			var smsModel = smsGateway.sendSMS(String(pContactArr[i]), String(pContent), String(altId));
			this.log(smsModel.toString());
		}
	} catch (e) {
		this.log(e);
	}

}

GlobalNotifications.prototype.sendEmailNotification = function(event, workflowStep, workflowStepStatus, parametersList, emailAddressList) {

	var emailParameters = aa.util.newHashtable();
	if (parametersList != null) {
		emailParameters = parametersList;
	}

	var notification = this.globalNotificationsHash.get(event + workflowStep + workflowStepStatus);
	if (notification == null) {
		notification = this.globalNotificationsHash.get(event + "*" + workflowStepStatus);
	}

	if (notification != null) {
		var notificationParameter = notification.notificationParameter;
		var notificationTemplate = notification.templateName;
		var CommunicationHelper = aa.proxyInvoker.newInstance("com.accela.aa.communication.CommunicationHelper").getOutput();
		var emailArray = [];
		emailAddressList.forEach(function(email) {
			emailArray.push([ email, 'TO' ]);
		})

		this.log("this.getCapID()---" + this.getCapID());
		var record = this.getRecord();
		if (notificationParameter != null && notificationParameter.contains("$$SERVICENAME$$")) {
			var aliasOfCapTypeEN = record.getCap().getCapModel().getAppTypeAlias();
			addParameter(emailParameters, "$$SERVICENAME$$", aliasOfCapTypeEN);

		}

		if (notificationParameter != null && notificationParameter.contains("$$ALTID$$")) {
			var altId = record.getCustomID();
			addParameter(emailParameters, "$$ALTID$$", altId);

		}

		if (notificationParameter != null && notificationParameter.contains("$$DEPARTMENT$$")) {
			// addParameter(emailParameters, "$$DEPARTMENT$$",
			// aliasOfCapTypeEN);
		}

		if (notificationParameter != null && notificationParameter.contains("$$COMMENTS$$")) {
			var comments = record.getWorkflowTaskComment(workflowStep, workflowStepStatus)
			addParameter(emailParameters, "$$COMMENTS$$", comments);
		}
		var capType = record.getCapType().toString();
		var capTypeArr = capType.split("/");
		var type = capTypeArr[1];
		var module = capTypeArr[0];
		//aa.print("type == " + type)
		if (notificationParameter != null && notificationParameter.contains("$$TODAY$$")) {
			var d = aa.util.now();
			if (type == "Health Facility Licensing") {
				//aa.print("type == " + type)
				addParameter(emailParameters, "$$TODAY$$", aa.util.formatDate(d, "yyyy/MM/dd"));
				//aa.print("date == " + aa.util.formatDate(d, "yyyy/MM/dd"))
			} else {
				addParameter(emailParameters, "$$TODAY$$", aa.util.formatDate(d, "dd/MM/yyyy"));
			}
		}
		if (type == "Health Facility Licensing") {
			if (notificationParameter != null && notificationParameter.contains("$$PRFNAME$$")) {
				var profileArabicName = emailParameters.get("$$PRFNAME$$")
				// fix parentheses problem for arabic names
				profileArabicName = "<span dir=ltr>" + profileArabicName + "</span>"
				addParameter(emailParameters, "$$PRFNAME$$", profileArabicName);

			}
		}

		
		this.log("emailArray: " + emailArray)
		if (emailArray != null && emailArray.length > 0) {
			var finalTemplateName = notification.templateName;
			
			var originalLanguage = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale();
			
			// Send Both Languages as Emails
			var languages = ["en_US"];//,"ar_AE"];
			
			for (var l in languages){
				var lang = languages[l];
				com.accela.i18n.I18NContext.getI18NModel().setLanguage(lang);
				
				var templateResult = aa.communication.getNotificationTemplate(finalTemplateName).getOutput();
				if (templateResult != null) {
					CommunicationHelper.replaceVariables(templateResult, emailParameters);
					var emailTempModel = templateResult.getEmailTemplateModel();
					// this.log(emailTempModel)
					var title = this.replaceVariables(emailTempModel.getI18NModel().getTitle());
					var content = this.replaceVariables(emailTempModel.getI18NModel().getContentText());
					
					//if (lang=="ar_AE"){
						title = "=?utf-8?B?" + base64_encode(title) + "?=";
					//}

					var cmId = this.sendEmailByModel(title, content, emailArray, null, finalTemplateName);
					this.log(cmId + '')
					aa.communication.associateEnities(cmId, this.getCapID().getCustomID(), 'RECORD');
					var notificationDocumentCategory = Record.getLookupVal("CONVERT_EMAIL_TO_PDF", finalTemplateName);
					if (!Utils.isBlankOrNull(notificationDocumentCategory)) {
						if (typeof PdfConversion === "undefined") {
							eval(getScriptText("INCLUDE_PDFCONVERSION"));
						}

						PdfConversion.callConversionAPI(cmId, this.getCapID(), notificationDocumentCategory);
					}
				}
			}
			
			// Restore Original Language
			com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLanguage);
		}
	}
}

function base64_encode(str) {
	return eb64(unescape(encodeURIComponent(str)));
}
function eb64(data) {

	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];

	if (!data) {
		return data;
	}

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded
		// string
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	enc = tmp_arr.join('');

	var r = data.length % 3;

	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

GlobalNotifications.prototype.replaceVariables = function(content) {
	//extend();
	var emailParameters = this.emailParameters;
	content = GlobalNotifications.replaceVariables(content, emailParameters)
	return content;
};

GlobalNotifications.replaceVariables = function(content, emailParameters) {
	//extend();
	var ep = emailParameters.keys();
	while (ep.hasNext()){
		var key = String(ep.next()).trim();
		var value = String(emailParameters.get(key)).trim();
		while (content.indexOf(key)>-1){
			content = content.replace(key, value);			
		}
	}
	return content;
};

GlobalNotifications.prototype.getDocumentContent = function(documentModel) {
	var docNo = documentModel.getDocumentNo();
	var entityModel = aa.proxyInvoker.newInstance("com.accela.v360.document.EntityModel").getOutput();
	entityModel.setServiceProviderCode(documentModel.getServiceProviderCode());
	entityModel.setEntityID(documentModel.getEntityType());
	entityModel.setEntityType(documentModel.getEntityType());
	entityModel.setEntity(documentModel.getEntity());
	var dowloadDocumentResult = edmsDocumentUploadWebService.doDownload(documentModel.getServiceProviderCode(), documentModel.getModuleName(), aa.getAuditID(), entityModel, null, docNo,
			documentModel.getFileKey);
	var fileInputStream = dowloadDocumentResult.getDocumentContent().getDocContentStream().getInputStream();
	var byteArrOutputStream = aa.proxyInvoker.newInstance("java.io.ByteArrayOutputStream").getOutput();
	var nRead;
	while (true) {
		nRead = fileInputStream.read();
		if (nRead == -1) {
			break;
		}

		byteArrOutputStream.write(nRead);
	}
	byteArrOutputStream.flush();
	var bytesArr = byteArrOutputStream.toByteArray();
	var base64Bytes = dj_readInputStream(bytesArr, "UTF-8");
	var base64Str = new Packages.java.lang.String(base64Bytes);
	fileInputStream.close();
	byteArrOutputStream.close();
	return base64Str;
}

function dj_readInputStream(is, encoding) {
	var output = new java.io.ByteArrayOutputStream();
	var base64Obj = aa.proxyInvoker.newInstance("sun.misc.BASE64Encoder").getOutput();
	base64Obj.encode(is, output);
	return output;
}

GlobalNotifications.prototype.sendEmailWithAttachedFiles = function(FROM, TO, CC, SUBJECT, CONTENT, attachmentList) {

	try {

		var files = [];
		var tempFiles = [];
		if (attachmentList != null) {

			for ( var docIndex in attachmentList) {
				var docContent = this.getDocumentContent(attachmentList[docIndex]);
				var byteArray = javax.xml.bind.DatatypeConverter.parseBase64Binary(docContent);
				var filename = attachmentList[docIndex].getFileName();
				var filetype = filename.substring(filename.lastIndexOf('.') + 1);
				var tempFile = null;
				if (filetype)
					tempFile = java.io.File.createTempFile(attachmentList[docIndex].getFileName(), "." + filetype, null);
				else
					tempFile = java.io.File.createTempFile(attachmentList[docIndex].getFileName(), ".pdf", null);
				var fos = new java.io.FileOutputStream(tempFile);
				fos.write(byteArray);
				this.log("***RRRR2***,  about to call uploadDocument");
				files.push(tempFile.getAbsolutePath());
				tempFiles.push(tempFile);
				fos.close();

			}
		} else {
			var byteArray = javax.xml.bind.DatatypeConverter.parseBase64Binary(docContent);
			var tempFile = java.io.File.createTempFile(fileName, ".pdf", null);
			var fos = new java.io.FileOutputStream(tempFile);
			fos.write(byteArray);
			this.log("***RRRR2***,  about to call uploadDocument");
			// this.log(tempFile);
			files.push(tempFile.getAbsolutePath());
			tempFiles.push(tempFile);
			fos.close();
		}

		var communication = com.accela.aa.communication.CommunicationImpl();
		var emailMessage = communication.buildEmailMessage(aa.getServiceProviderCode(), SUBJECT, CONTENT, FROM, TO, CC, null, null, null, null, "EMSE Attached Files", tempFiles);
		emailMessage.setAuditModel(new com.accela.orm.model.common.AuditModel(null, aa.getAuditID(), "A"));
		var cmId = communication.sendMessage(emailMessage);
		this.log(cmId + '');
		for ( var index in tempFiles) {
			tempFiles[index].delete();
		}

		return cmId;
	} catch (e) {
		this.log(" Error in sendEmailWithAttachedFiles:: " + e);
	}
}

function lookup(stdChoice, stdValue) {
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

	if (bizDomScriptResult.getSuccess()) {
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs. who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
	} else {
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
	}

	return strControl;
}
function mergeTempaltes(templateContent, emailParameters) {
	if (templateContent.contains("##TEMPLATEID_")) {

		var mySubString = templateContent.substring(templateContent.lastIndexOf("##TEMPLATEID_") + 1, templateContent.lastIndexOf("##"));

		var finalsecondtemplate = mySubString.replace("#TEMPLATEID_", "");

		this.log("finalsecondtemplate" + finalsecondtemplate);
		secondtemplateResult = aa.communication.getNotificationTemplate(finalsecondtemplate).getOutput();
		var CommunicationHelper = aa.proxyInvoker.newInstance("com.accela.aa.communication.CommunicationHelper").getOutput();
		CommunicationHelper.replaceVariables(secondtemplateResult, emailParameters);

		if (secondtemplateResult != null) {

			var secemailTempModel = secondtemplateResult.getEmailTemplateModel();
			var title = GlobalNotifications.replaceVariables(secemailTempModel.getI18NModel().getTitle(), emailParameters);
			var content = GlobalNotifications.replaceVariables(secemailTempModel.getI18NModel().getContentText(), emailParameters);
			templateContent = templateContent.replace("##TEMPLATEID_" + finalsecondtemplate + "##", content);
			if (templateContent.contains("##TEMPLATEID_")) {
				templateContent = mergeTempaltes(templateContent, emailParameters)
			}
		}
	}
	return templateContent;
}

function isInclude(array, value) {
	if (array != null) {
		if (array.length > 0) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] == value) {
					return true;
				}
			}
		}
	}
	return false;
}


function addParameter(pamaremeters, key, value) {
	if (key != null) {
		if (value == null) {
			value = "";
		}
		pamaremeters.put(key, value);
	}
}

/******
 * Function: sendEmailByTemplate
 * usage:
 * ---------------------------------------------

	var emailParameters = aa.util.newHashtable();
	emailParameters.put("$$ALT_ID$$", "PARP-1021-000016");
	emailParameters.put("$$SERVICE_NAME$$", "Service Test");
	
	GlobalNotifications.sendEmailByTemplate("TEMPLATE_NAME", ["hfangary@accela.com"], emailParameters);
 * 	
 */

GlobalNotifications.sendEmailByTemplate = function (notfyTemp, toArray, emailParameters) //optional capId
{
	var CommunicationHelper = aa.proxyInvoker.newInstance("com.accela.aa.communication.CommunicationHelper").getOutput();

	// use cap ID specified in args
	if (arguments.length == 4)
	{
		capId = arguments[3];
	}
	
	if (!toArray || toArray.length == 0)
	{
		throw "No 'To Emails' were specified!";
		return;
	}


	var originalLanguage = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale();
	
	// Send Both Languages as Emails
	var languages = ["en_US"];//,"ar_AE"];
	
	for (var l in languages){
		var lang = languages[l];
		com.accela.i18n.I18NContext.getI18NModel().setLanguage(lang);
		var templateResult = aa.communication.getNotificationTemplate(notfyTemp).getOutput();

		CommunicationHelper.replaceVariables(templateResult, emailParameters);
		var emailTempModel = templateResult.getEmailTemplateModel();
		
		var title = GlobalNotifications.replaceVariables(emailTempModel.getI18NModel().getTitle(), emailParameters);
		var content = GlobalNotifications.replaceVariables(emailTempModel.getI18NModel().getContentText(), emailParameters);
		//if (lang=="ar_AE"){
			title = "=?utf-8?B?" + base64_encode(title) + "?=";
		//}

		var cmId = GlobalNotifications.sendEmail(title, content, toArray);
		//aa.print("cmId:" + cmId);
		if (capId){
			aa.communication.associateEnities(cmId,capId.getCustomID(),'RECORD');    			
		}
	}

	// Restore Original Language
	com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLanguage);
}


GlobalNotifications.sendNotificationByTemplate = function (notfyTemp, toArray, emailParameters) //optional capId
{
	var CommunicationHelper = aa.proxyInvoker.newInstance("com.accela.aa.communication.CommunicationHelper").getOutput();

	// use cap ID specified in args
	if (arguments.length == 4)
	{
		capId = arguments[3];
	}
	
	if (!toArray || toArray.length == 0)
	{
		throw "No 'To Emails' were specified!";
		return;
	}


	var originalLanguage = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale();
	
	// Send Both Languages as Emails
	var languages = ["en_US"];//,"ar_AE"];
	
	for (var l in languages){
		var lang = languages[l];
		com.accela.i18n.I18NContext.getI18NModel().setLanguage(lang);
		var templateResult = aa.communication.getNotificationTemplate(notfyTemp).getOutput();

		CommunicationHelper.replaceVariables(templateResult, emailParameters);
		var emailTempModel = templateResult.getEmailTemplateModel();
		
		var title = GlobalNotifications.replaceVariables(emailTempModel.getI18NModel().getTitle(), emailParameters);
		var content = GlobalNotifications.replaceVariables(emailTempModel.getI18NModel().getContentText(), emailParameters);
		//if (lang=="ar_AE"){
			title = "=?utf-8?B?" + base64_encode(title) + "?=";
		//}

		var cmId = GlobalNotifications.sendEmail(title, content, toArray);
		//aa.print("cmId:" + cmId);
		if (capId){
			aa.communication.associateEnities(cmId,capId,'RECORD');    			
		}
	}

	// Restore Original Language
	com.accela.i18n.I18NContext.getI18NModel().setLanguage(originalLanguage);
}


GlobalNotifications.sendEmail = function(pTitle, pContent, toArray){
	
	var emailsArray = [];
	for (var e in toArray){
		var email = toArray[e];
		if (email){
			emailsArray.push([email, 'TO']);		
		}
	}
    var contacts = aa.communication.getContactList(emailsArray, 'EMAIL').getOutput();
    
    var messageModel = aa.communication.getEmailMessageScriptModel().getOutput();
    messageModel.setTitle(pTitle);
    messageModel.setContent(pContent);
    messageModel.setContacts(contacts);
    messageModel.setTriggerEvent('From EMSE script');
    var result = aa.communication.sendMessage(messageModel);
    logDebug((result.getOutput() != null)?'email sent successfully.': 'email sent failed.');
    return result.getOutput();
};


GlobalNotifications.getEmailsByCapId = function(capId) {

	var capID = capId;
    var capContactResult = aa.people.getCapContactByCapID(capID);
    var contacts = capContactResult.getOutput();
    var conArr  = [];

    for (var contactIdx in contacts) {
        var contactModel = contacts[contactIdx].getCapContactModel();
        var email = GlobalNotifications.getEmailByContact(contactModel);
        if (email){
            conArr.push(email);        	
        }
    }
    return conArr;
};

GlobalNotifications.getEmailByContact = function(contactModel) {
	var people  = contactModel.getPeople();
    var email = people.getEmail();
    if (email != "") {
    	return email;
    }
};


GlobalNotifications.prototype.initEmailParameters = function (emailParams, notificationParameter){
	
	this.emailParameters = aa.util.newHashtable();
	if (emailParams){
		this.emailParameters = emailParams;
	}

	var record = this.getRecord();
	
	// -- Email Parameters -------------------------------------------------------------------------------------------
	
	if (notificationParameter){
		if (notificationParameter.contains("$$SERVICE_NAME$$") || notificationParameter.contains("$$SERVICENAME$$")) {
			var aliasOfCapTypeEN = record.getCap().getCapModel().getAppTypeAlias();
			this.emailParameters.put("$$SERVICE_NAME$$", aliasOfCapTypeEN);
			this.emailParameters.put("$$SERVICENAME$$", aliasOfCapTypeEN);
		}
		
		if(notificationParameter.contains("$$SERVICE_NAME_AR$$") || notificationParameter.contains("$$SERVICENAME_AR$$"))
		{
			var aliasOfCapTypeAR = "";
			
			var aliasOfCapTypeEN = record.getCap().getCapModel().getAppTypeAlias();
			var sql = "select R1_APP_TYPE_ALIAS "+
			"from R3APPTYP_I18N " +
			"where LANG_ID = 'ar_AE' and " +
			"RES_ID in (select RES_ID from R3APPTYP_I18N where R1_APP_TYPE_ALIAS = '" + aliasOfCapTypeEN + "')";
			var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
			 var sqlresult = dba.select(sql, []);
			 if (sqlresult != "" && sqlresult != null) {
	                if (sqlresult.size() > 0) {
	                 aliasOfCapTypeAR = sqlresult.get(0)[0];
	                }
			}
			 

				this.emailParameters.put("$$SERVICE_NAME_AR$$", aliasOfCapTypeAR);
				this.emailParameters.put("$$SERVICENAME_AR$$", aliasOfCapTypeAR);
		}

		if (notificationParameter.contains("$$ALT_ID$$") || notificationParameter.contains("$$ALTID$$")) {
			this.emailParameters.put("$$ALT_ID$$", record.getCustomID());
			this.emailParameters.put("$$ALTID$$", record.getCustomID());
		}

		if (notificationParameter.contains("$$REASONS$$")) {
			var comments = record.getWorkflowTaskComment(workflowStep, workflowStepStatus)
			this.emailParameters.put("$$REASONS$$", comments);
		}
		if (notificationParameter.contains("$$EXTENSION_DATE$$")) {
			var iirpRec = new Record(record.getCustomID() + "");
			var extensionDate = iirpRec.getTSI("Extension Review", "Extended Due Date");
			this.emailParameters.put("$$EXTENSION_DATE$$", extensionDate);
		}

		if (notificationParameter.contains("$$COMMENTS$$")) {
			var comments = record.getWorkflowTaskComment(workflowStep, workflowStepStatus)
			this.emailParameters.put("$$COMMENTS$$", comments);
		}

		if (notificationParameter.contains("$$TODAY$$")) {
			var d = aa.util.now();
			this.emailParameters.put("$$TODAY$$", aa.util.formatDate(d, "dd/MM/yyyy"));
		}
		
		if (notificationParameter.contains("$$ENTITY_NAME$$")) {
			eval(getScriptText("INCLUDE_EPRF"));
			var entityName = "";
			// In Case ESDE Record Type Only
			if (record.getCapType() == "OSHJ/Reporting/Entity Self Declaration/ESDE") {			
				var eprfRec = new Record(record.getASI("REQUEST DETAILS", "Entity Profile ID"));
				if (eprfRec != null) {
					var eName_AR = eprfRec.getASI("ENTITY DETAILS", "Entity Name in Arabic");
					var eName_EN = eprfRec.getASI("ENTITY DETAILS", "Entity Name in English");
					entityName = eName_EN + " (" + eName_AR + ") ";
				}
				this.emailParameters.put("$$ENTITY_NAME$$", entityName);
			}
		}
		
		var arrRecordType = record.getCapType().toString().split("/");
		module = arrRecordType[0]
		//aa.print("RSA module: " + module)
		if(module == "AMAN")
		{
			if (notificationParameter != null && notificationParameter.contains("$$ESTABLISHMENT_ID$$")) {
				var establishmentId = record.getASI("", "Establishment ID")
				//aa.print("RSA establishmentId: " + establishmentId)
				this.emailParameters.put("$$ESTABLISHMENT_ID$$", establishmentId);
			}
			
			if (notificationParameter != null && notificationParameter.contains("$$ESTABLISHMENT_NAME$$")) {
				var establishmentName = record.getASI("", "Establishment Name")
				//aa.print("RSA establishmentName: " + establishmentName)
				this.emailParameters.put("$$ESTABLISHMENT_NAME$$", establishmentName);
			}
		}


		if (notificationParameter.contains("$$USER_NAME$$")) {
			// TO DO...
			var userName = "";
			var contactArr = aa.people.getCapContactByCapID(this.getCapID()).getOutput();
			if (contactArr.length > 0) {
				for (var q = 0; q < contactArr.length; q++) {
					var contactOBj = new Object();
					var contactModel = contactArr[q].getCapContactModel();
					var contactType = contactModel.getContactType();
					var email = contactModel.getEmail();
					var fullName = "";
					var firstName = contactModel.getFirstName();
					var lastName = contactModel.getLastName();
					if (firstName){
						fullName = firstName;
						if (lastName){
							fullName += " " + lastName; 
						}
					}else{
						if (lastName){
							fullName = lastName;								
						}
					}
					userName = fullName;
					//if (email && email != "") {
						//emailsArr.push(email);
					//}
					
				}
			}
			if (!userName){
				//com.accela.i18n.I18NContext.getLanguage()
				if(com.accela.aa.emse.util.LanguageUtil.getCurrentLocale()=="ar_AE")
				{
					userName = "المتعامل"; //""
				}
				else
				{
					userName = "Customer";
				}					
			}
			this.emailParameters.put("$$USER_NAME$$", userName);
		}
	}
};


function extend(){

	if (!Array.prototype.includes) {
		Object.defineProperty(Array.prototype, 'includes', {
			enumerable: false,
			value: function(searchElement /*, fromIndex*/ ) {
				'use strict';
				var O = Object(this);
				var len = parseInt(O.length) || 0;
				if (len === 0) {
				  return false;
				}
				var n = parseInt(arguments[1]) || 0;
				var k;
				if (n >= 0) {
				  k = n;
				} else {
				  k = len + n;
				  if (k < 0) {k = 0;}
				}
				var currentElement;
				while (k < len) {
				  currentElement = O[k];
				  if (searchElement === currentElement ||
					 (searchElement !== searchElement && currentElement !== currentElement)) {
					return true;
				  }
				  k++;
				}
				return false;
			} 
		});
	}
	/**
	 * String.prototype.replaceAll() polyfill
	 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
	 * @author Chris Ferdinandi
	 * @license MIT
	 */
	if (!String.prototype.replaceAll) {
		String.prototype.replaceAll = function(str, newStr){

			// If a regex pattern
			if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
				return this.replace(str, newStr);
			}

			// If a string
			if (str.indexOf("$")){
				
			}
			return this.replace(new RegExp(str, 'g'), newStr);

		};
	}
	logDebug = function(msg, msg2) {
		if (typeof msg2 === "undefined" || msg2 === null){
			msg2 = "";
		}else{
			msg2 = " : " + msg2;
		}
		//aa.print("===Custom Log ==> " + msg + msg2); 
	};
}