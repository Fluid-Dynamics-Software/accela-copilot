/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_SMS_GATEWAY.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 07/11/2021 15:51:53
|
/------------------------------------------------------------------------------------------------------*/
if (typeof IntegrationUtils === "undefined") {
	eval(getScriptText("INCLUDE_INTEGRATION_UTILS"));
}
if (typeof HTTPAPI === "undefined") {
	eval(getScriptText("INCLUDE_HTTPAPI"));
}
if (typeof Record === "undefined") {
	eval(getScriptText("INCLUDE_RECORD"));
}
if (typeof Utils === "undefined") {
	eval(getScriptText("INCLUDE_UTILS"));
}

function SmsGateway() {
	this.configStdChoice = "INT_SMS_GATEWAY_CONFIG";
	this.cacheStdChoice = "INT_SMS_GATEWAY_CACHE";

	this.cachedConfig = null;

	this.getConfig = function(key) {
		if (!this.cachedConfig)
			this.cachedConfig = Record.getStandardChoices(this.configStdChoice);

		if (this.cachedConfig) {
			for (var i in this.cachedConfig) {
				if (String(this.cachedConfig[i].getBizdomainValue()) == key) {
					return String(this.cachedConfig[i].getDescription());
				}
			}	
		}
			
		return null;
	}

	this.getCache = function(key) {
		return String(Record.getLookupVal(this.cacheStdChoice, key));
	}

	this.setCache = function(key, value) {
		IntegrationUtils.updateOrCreateStdChoiceByValue(this.cacheStdChoice, key, key, value);
	}
}

// ENUMS -------------------------------------------
SmsGateway.Enums = {};
SmsGateway.Enums.httpStatus = {
	"200" : "200 - OK",
	"201" : "201 - Created",
	"400" : "400 - Mandatory Fields Missing",
	"401" : "401 - Unauthorized",
	"402" : "402 - Insufficient Balance",
	"403" : "403 - Forbidden.",
	"500" : "500 - Internal server error",
	"503" : "503 - Service Unavailable"
};

// Methods -----------------------------------------
/**
 * Get Service Token
 * @param userFreshToken *Optional
 * @returns {"token": "", "tokenType": ""}
 */
SmsGateway.prototype.getToken = function(useFreshToken) {
	var currTime = (new Date()).getTime();
	var output = {
		"token" : null,
		"tokenType" : "Bearer"
	};

	if (!useFreshToken) {
		// Get cache from StdChoice
		var cachedExpiration = null;
		var cachedtokenSmsCount = null;

		output.token = this.getCache("CACHED_TOKEN");
		cachedtokenSmsCount = this.getCache("CACHED_TOKEN_SMS_COUNT");
		cachedExpiration = this.getCache("CACHED_TOKEN_EXPIRE_TIME");

		if (Utils.isBlankOrNull(output.token) || !cachedExpiration) {
			useFreshToken = true;
		} else {
			var cachedExpTime = parseInt(cachedExpiration, 10);
			var cachedtokenSmsCountInt = parseInt(cachedtokenSmsCount, 10);
			var maxAllowedSmsPerToken = parseInt(this.getConfig("MAX_ALLOWED_SMS_PER_TOKEN"), 10);
			if (isNaN(cachedExpTime) || currTime >= (cachedExpTime)) {
				// Token Expired
				useFreshToken = true;
			} else if (isNaN(cachedtokenSmsCountInt) || cachedtokenSmsCountInt > maxAllowedSmsPerToken) {
				// SMS Count is over limit
				useFreshToken = true;
			}
		}
	}

	if (useFreshToken) {
		var baseUrl = this.getConfig("BASE_URL");
		var username = this.getConfig("USERNAME");
		var password = this.getConfig("PASSWORD");
		var defaultExpirationInMinutes = this.getConfig("DEFAULT_TOKEN_EXPIRE_MINUTES");
		

		var authEndpoint = this.getConfig("AUTH_ENDPOINT");
		var url = baseUrl + authEndpoint;

		// Prepare HTTP request
		var headers = [];
		headers["Content-Type"] = "application/json";

		var body = {
			"username" : username,
			"password" : password
		};

		var result = HTTPAPI.post(url, JSON.stringify(body), headers);
		if (result.status != 200) {
			var statusDesc = SmsGateway.Enums.httpStatus[result.status];
			if (Utils.isBlankOrNull(statusDesc)) {
				statusDesc = String(result.status);
			}

			var errMsg = this.tryReadResponseErrorMessage(result.response);
			if (errMsg) {
				errMsg = " Error Details: " + errMsg;
			} else {
				errMsg = "";
			}


			throw "Could not get token: " + statusDesc + "." + errMsg;
		}

		var response = JSON.parse(result.response);

		// Calculate Expiration
		var buffer = (5 * 1000); // five seconds buffer
		var expInSeconds = parseInt(defaultExpirationInMinutes, 10) * 60;
		var newExpTime = (currTime + (expInSeconds * 1000)) - buffer;

		// Cache results
		this.setCache("CACHED_TOKEN", response.token);
		this.setCache("CACHED_TOKEN_EXPIRE_TIME", newExpTime);
		this.setCache("CACHED_TOKEN_SMS_COUNT", "0");

		output.token = response.token;
	}

	return output;
}


/**
 * Send single SMS message
 * @param phoneNumber {string} required
 * @param messageText {string} required
 * @param transactionId {string} optional
 * @returns {___anonymous4833_4876}
 */
SmsGateway.prototype.sendSMS = function(phoneNumber, messageText, transactionId) {
	var output = {
		"success" : false,
		"message" : null
	};

	try {
		Utils.printLog("SmsGateway.sendSMS() >> START...");
		// Validate request params
		if (Utils.isBlankOrNull(phoneNumber)) {
			throw "phoneNumber is required";
		} else {
			var jStr = java.lang.String(phoneNumber);
			if (!jStr.startsWith("971") && !jStr.startsWith("00971") && !jStr.startsWith("+971")) {
				throw "Invalid phone number '" + phoneNumber + "'. must be a UAE phone number starting with 971.";
			}

			if (jStr.startsWith("00971")) {
				phoneNumber = String(parseInt(phoneNumber, 10));
			} else if (jStr.startsWith("+971")) {
				phoneNumber = String(phoneNumber.replace('+', ''));
			}

			// Validate if number is whitelisted
			if (this.getConfig("SEND_TO_WHITELIST_ONLY") == "Y") {
				/*if (jStr.startsWith("00971") || jStr.startsWith("+971")) {
					phoneNumber = String(parseInt(phoneNumber, 10));
				}*/
				var whitelistedNumbers = this.getConfig("WHITELISTED_NUMBERS").split(',');
				if (whitelistedNumbers.indexOf(phoneNumber) == -1) {
					throw "phone number is not whitelisted, check configuration.";
				}
			}
		}
		if (Utils.isBlankOrNull(messageText)) {
			throw "messageText message text is required";
		}


		/* OM 19/6/2022: STOPPED To avoid Impacting Production Activities */
		return {
			"success" : true,
			"message" : "Service Stopped, Actual SMS will not be sent",
			"data": {}
		}
		/* OM 19/6/2022: END */

		// Prepare Request Object
		var requestObj = {};
		requestObj["desc"] = this.getConfig("DEFAULT_CAMPAIGN_DESC");
		requestObj["campaignName"] = this.getConfig("DEFAULT_CAMPAIGN_NAME");
		requestObj["msgCategory"] = this.getConfig("DEFAULT_MSG_CATEGORY");
		requestObj["contentType"] = this.getConfig("DEFAULT_CONTENT_TYPE");
		requestObj["senderAddr"] = this.getConfig("DEFAULT_SENDER_ADDRESS");
		requestObj["dndCategory"] = this.getConfig("DEFAULT_DND_CATEGORY");
		requestObj["priority"] = this.getConfig("DEFAULT_PRIORITY");
		requestObj["clientTxnId"] = transactionId ? transactionId : "";
		requestObj["recipient"] = phoneNumber;
		requestObj["msg"] = messageText;

		// Get Token
		Utils.printLog("SmsGateway.sendSMS() >> get token");
		var tokenObj = this.getToken();

		// Send Message
		var baseUrl = this.getConfig("BASE_URL");
		var endpoint = this.getConfig("SINGLE_SMS_ENDPOINT");
		var url = baseUrl + endpoint;

		var headers = [];
		headers["Authorization"] = tokenObj.tokenType + " " + tokenObj.token;
		headers["Content-Type"] = "application/json";
		
		var body = JSON.stringify(requestObj);

		Utils.printLog("SmsGateway.sendSMS() >> calling webservice: " + url);
		
		var result = HTTPAPI.post(url, body, headers);
		
		var statusDesc = SmsGateway.Enums.httpStatus[result.status];
		if (Utils.isBlankOrNull(statusDesc)) {
			statusDesc = String(result.status);
		}
		output.message = statusDesc;
		Utils.printLog("SmsGateway.sendSMS() >> Result: " + statusDesc);
		
		// Validate Response
		if (result.status != 200 && result.status != 201) {
			var errMsg = this.tryReadResponseErrorMessage(result.response);
			if (errMsg) {
				errMsg = " Error Details: " + errMsg;
			} else {
				errMsg = "";
			}

			throw "Error: " + statusDesc + "." + errMsg;
		}

		// increase the cached counter
		this.increaseCachedTokenSmsCounter(1);
		
		output.success = true;
		output.data = JSON.parse(result.response);
	} catch (e) {
		Utils.printErrorLog("ERROR SmsGateway.sendSMS(): " + e, e, false);
		output.success = false;
		output.message = String(e);
	}

	Utils.printLog("SmsGateway.sendSMS() >> END...");
	return output;
}

/**
 * Try to read error messages from Gateway
 * @param dataStr
 * @returns
 */
SmsGateway.prototype.tryReadResponseErrorMessage = function(dataStr) {
	var msg = null;
	try {
		var data = IntegrationUtils.tryParseJSON(dataStr);
		if (data) {
			if (data.msg) {
				return data.msg;
			}
		}
	} catch (e) {
		msg = null;
	}

	return msg;
}

/**
 * Increase used SMS for the current token
 * @param smsCount
 */
SmsGateway.prototype.increaseCachedTokenSmsCounter = function (smsCount) {
	try {
		var cachedCount = parseInt(this.getCache("CACHED_TOKEN_SMS_COUNT"), 0);
		this.setCache("CACHED_TOKEN_SMS_COUNT", cachedCount + smsCount);
	} catch (e) {
		Utils.printLog("Error in SmsGateway.prototype.increaseCachedTokenSmsCounter(): " + e);
	}
}