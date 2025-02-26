/**
 * contains Utilities functions
 * @class
 */
/*-USER-----------DATE----------------COMMENTS----------------------------------------------------------/
| RSA             11/08/2021 09:15:19 add formatDate function
| RSA             11/08/2021 09:17:16 add printlog and printerrorlog
| RSA             11/08/2021 09:29:22 add getDateDifferenceInDays function
| RSA             11/08/2021 09:33:57 add getCalendar function
| RSA             11/08/2021 09:59:26 Add getDifferenceInHours function
| RSA             22/08/2021 14:36:23 Add ValidateEmail function
| RSA             22/08/2021 14:51:27 add validateMobile function
| RSA             24/08/2021 16:06:59 Add function validateEmiratesId
| RSA             25/08/2021 14:59:38 add getLookupValue function
| RSA             31/08/2021 10:04:12 add getContactDataByEmailID function
| RSA             02/09/2021 10:25:32 add getCountryNameByCode and getCountryCodeByName 
/-----END CHANGE LOG-----------------------------------------------------------------------------------*/

function Utils() {

}
Utils.getFormattedDate = function(date) {
	var year = date.getFullYear();
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;
	return month + '/' + day + '/' + year;
}
Utils.getNextWorkingDate = function(dDate, includeThisDate) {
	var month = dDate.getMonth() + 1;
	var day = dDate.getDate();
	var year = dDate.getFullYear();
	if (includeThisDate) {
		day--;
	}
	return new Date(aa.calendar.getNextWorkDay(aa.date.parseDate(month + "/" + day + "/" + year)).getOutput().getTime());

}
/**
 * null safe check if specified string is null or empty.
 *
 * @param {string} value - the string to be checked.
 * @returns {Boolean}
 */
Utils.isBlankOrNull = function(value) {
	return value == null || String(value).trim().equals(String('')) || String(value).trim().equals(String('null'));
}

/**
 * check if passed parameter is java script array.
 *
 * @param {object} arr - parameter to be checked
 * @returns {Boolean} if passed parameter is java script array.
 */
Utils.isJSArray = function(arr) {
	//Array.isArray(arr)
	return arr != null && arr.constructor != null && arr.constructor.toString().indexOf("Array") > -1;
}

/**
 * check if passed parameter is java array.
 *
 * @param {object} arr - parameter to be checked
 * @returns {Boolean} if passed parameter is java array.
 */
Utils.isJavaArray = function(arr) {
	return arr != null && ("getClass" in arr) && arr.getClass().equals(aa.util.newArrayList().getClass());
}

/**
 * check if passed parameter is java or java script array.
 *
 * @param {object} arr - parameter to be checked
 * @returns {Boolean} if passed parameter is java or java script array.
 */
Utils.isArray = function(arr) {
	return Utils.isJSArray(arr) || Utils.isJavaArray(arr);
}

/**
 * get java script array size.
 *
 * @param {Array} arr - parameter to get size.
 * @returns {number} array size.
 */
Utils.getJSArraySize = function(arr) {

	if (!Utils.isJSArray(arr)) {
		throw "Expected JS Array, but found : " + arr;
	}

	var size = 0, key;
	for (key in arr) {
		if (arr.hasOwnProperty(key)) {
			size++;
		}
	}
	return size;
}

/**
 * check if passed parameter is java script array.
 *
 * @param {Array} arr - parameter to be checked
 * @returns {Boolean} if passed parameter is java script array.
 */
Utils.isEmptyJSArray = function(arr) {

	if (!Utils.isJSArray(arr)) {
		throw "expected JS Array, but found : " + arr;
	}

	return arr.length == 0 && Utils.getJSArraySize(arr) == 0;
}

/**
 * null safe check if specified array is null or empty.
 *
 * @param {(Array|java.util.ArrayList)} arr - array to be checked
 * @returns {Boolean}
 */
Utils.isNullOrEmptyArr = function(arr) {

	if (arr == null) {
		return true;
	}

	if (Utils.isJSArray(arr)) {
		return Utils.isEmptyJSArray(arr);
	}

	if (Utils.isJavaArray(arr)) {
		return arr.isEmpty();
	}

	throw "not supported object type";
}

/**
 * check if check box value is not checked.
 *
 * @param {string} checkBoxValue check box value.
 * @returns {boolean} true if check box value is not checked.
 */
Utils.isCheckBoxUnChecked = function(checkBoxValue) {
	return String(checkBoxValue).equalsIgnoreCase(String('NO')) || String(checkBoxValue).equalsIgnoreCase(String('N'))
			|| String(checkBoxValue).equalsIgnoreCase(String('UNCHECKED')) || String(checkBoxValue).equalsIgnoreCase(String('UNSELECTED'))
			|| String(checkBoxValue).equalsIgnoreCase(String('FALSE')) || String(checkBoxValue).equalsIgnoreCase(String('OFF'));
}

/**
 * check if check box value is checked.
 *
 * @param {string} checkBoxValue check box value.
 * @returns {boolean} true if check box value is checked.
 */
Utils.isCheckBoxChecked = function(checkBoxValue) {
	return String(checkBoxValue).equalsIgnoreCase(String('YES')) || String(checkBoxValue).equalsIgnoreCase(String('Y'))
			|| String(checkBoxValue).equalsIgnoreCase(String('CHECKED')) || String(checkBoxValue).equalsIgnoreCase(String('SELECTED'))
			|| String(checkBoxValue).equalsIgnoreCase(String('TRUE')) || String(checkBoxValue).equalsIgnoreCase(String('ON'));
}

/**
 * compare if two dates are equal.
 *
 * @param {Date} date2 - date object to be compared.
 * @returns true if both dates are equal.
 */
Date.prototype.isEqual = function(date2) {
	return this.getTime() == date2.getTime();
}

/**
 * construct new date with the same year and month and day of this date
 *
 * @returns {Date} new java script date without minutes and seconds of this date.
 */
Date.prototype.trimTime = function() {
	return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}

/**
 * Check if this date is less than passed date.
 *
 * @param {Date} date2 - date object to be compared.
 * @returns true if this date is less than passed date.
 */
Date.prototype.isBefore = function(date2) {
	return this.getTime() < date2.getTime();
}

/**
 * get time of this date in 24 format ex. (15:23)
 *
 * @param {String} [separator] - to be used between minutes and hours
 * @returns {String} time of this date in 24 format
 */
Date.prototype.formatTime24 = function(separator) {
	separator = separator || ":"
	var timeStr = this.getHours() + separator + this.getMinutes();
	return timeStr;
}

/**
 * construct date object of passed data default today.
 *
 * @param {String} [date] - date string used to construct date object (ex. 30/11/2015).
 * @param {String} [time] - time string used to construct date object (ex. 10:01).
 * @param {String} [amPm] - am / pm value used to construct date object (ex. AM).
 *
 * @returns date object of passed data.
 */
Utils.constructDateObj = function(date, time, amPm) {

	var dateTimeObj = null;

	if (!Utils.isBlankOrNull(date) || !Utils.isBlankOrNull(time)) {

		dateTimeObj = new Date();
		dateTimeObj.setMilliseconds(0);
		dateTimeObj.setSeconds(0);
		dateTimeObj.setMinutes(0);
		dateTimeObj.setHours(0);

		if (!Utils.isBlankOrNull(date)) {

			var day = date.split("/")[0];
			var month = parseInt(date.split("/")[1]) - 1;
			var year = date.split("/")[2];

			dateTimeObj.setDate(day);
			dateTimeObj.setMonth(month);
			dateTimeObj.setFullYear(year);
		}

		if (!Utils.isBlankOrNull(time)) {
			var hours = parseInt(time.split(":")[0], 10);
			var minutes = parseInt(time.split(":")[1], 10);
			hours = amPm == "PM" ? (parseInt(hours) + 12) : hours;
			dateTimeObj.setMinutes(minutes);
			dateTimeObj.setHours(hours);
		}
	}

	return dateTimeObj;
}

/**
 * construct hash map of rows from passed array using passed key name.
 *
 * @param {[][]} array - array of rows to fill the map with them.
 * @param {String} keyName - name of row property to be the key of map.
 *
 * @returns {HashMap} - Map contains rows from passed array.
 */
Utils.toHashMap = function(arrayOfRows, keyName) {

	var rowsMap = aa.util.newHashMap();

	if (arrayOfRows == null || arrayOfRows.length == 0) {
		return rowsMap;
	}

	if (Utils.isBlankOrNull(keyName)) {
		throw "Utils.toHashMap :: keyName can not be null";
	}

	for (idx in arrayOfRows) {
		var row = arrayOfRows[idx];
		rowsMap.put(String(row[keyName]), row);
	}
	return rowsMap;
}

/**
 *
 * @returns The language of the current user session like "ar" or "en".
 */
Utils.getCurrentUserSessionLanguage = function() {
	return Utils.getCurrentUserSessionLocale().getLanguage();
}

/**
 * @returns the locale of the current user session like "ar_AE" or "en_US".
 */
Utils.getCurrentUserSessionLocale = function() {
	return com.accela.aa.emse.util.LanguageUtil.getCurrentLocale();
}

Utils.GetPublicUserContactList = function(userid) {
    var contacts = [];
    try {
        if (!Utils.isBlankOrNull(userid)) {
            var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
            var psql = "SELECT G.G1_CONTACT_NBR FROM G3CONTACT G ";
            psql += "   INNER JOIN   XPUBLICUSER_PEOPLE XP ";
            psql += "   ON     G.G1_CONTACT_NBR=XP.ENT_ID ";
            psql += "   INNER JOIN PUBLICUSER P  ";
            psql += "   ON XP.AGENCY  = 'SPSA' ";
            psql += "   AND    XP.USER_SEQ_NBR = P.USER_SEQ_NBR  ";
            psql += "   AND    XP.ENT_TYPE     = 'REF_CONTACT' ";
            psql += "   WHERE G.SERV_PROV_CODE = 'SPSA'  ";
            psql += "   AND   P.USER_ID = '" + userid + "'";

            var pubUSerList = dba.select(psql, []);

            if (pubUSerList != "" && pubUSerList != null) {
                if (pubUSerList.size() > 0) {
                    for (var j = 0; j < pubUSerList.size(); j++) {
                        var contactSeq = pubUSerList.get(j)[0];
                        if (contactSeq != null) {
                            contacts.push(contactSeq);
                        }

                    }
                }

            }

        }
    } catch (e) {
        Utils.printLog("link public user to contact" + e.message);
    }
    return contacts;
}


/**
 * Interval class
 */
function Interval(from, to) {
	this.from = parseFloat(from);
	this.to = parseFloat(to);

}

/**
 * check if interval is valid
 *
 * @returns {Boolean} true if interval start is less tahn or equal interval end
 */
Interval.prototype.isValid = function() {
	return (this.from <= this.to);
}

/**
 * check if passed interval overlap with current interval.
 *
 * @param interval interval to be compared.
 * @returns {Boolean} true if the two intervals ovelap.
 */
Interval.prototype.overlapWith = function(interval) {
	var overlap = false;

	if (!interval.isValid()) {
		throw "invalid interval : " + interval;
	}

	if (!this.isValid()) {
		throw "invalid interval : " + this;
	}

	if (this.from <= interval.to && interval.from <= this.to) {
		overlap = true
	}

	return overlap;
}

Utils.asyncExec = function(scriptCode, envParameters) {
	aa.runAsyncScript(scriptCode, envParameters);

}

/**
 * override to string
 */
Interval.prototype.toString = function() {
	return "[" + this.from + "-" + this.to + "]";
}


/**
 * Validate regex strings
 * @class
 */

function Validator() {
}

Validator.prototype.constructor = Validator;

/**
 * validate mobile
 */
Validator.prototype.isValidMobile = function(mobile) {
    return this.regexValidator(mobile, /^(\+\d{1,3}[- ]?)?\d{10}$/, true);
};

/**
 * validate mobile in UAE only
 */
Validator.prototype.isValidUAEMobile = function(mobile) {
    return this.regexValidator(mobile, /^(?:\+971|00971|0)?(?:50|51|52|55|56)\d{7}$/, true);
};

/**
 * validate email
 */
Validator.prototype.isValidEmail = function(email) {
    return this.regexValidator(email, /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, true);
};

/**
 * validate phone
 */
Validator.prototype.isValidPhone = function(phone) {
    return this.regexValidator(phone, /^\d{2}\d{7}$/, true);
};

/**
 * validate mobile in UAE only
 */
Validator.prototype.isValidUAEPhone = function(mobile) {
    return this.regexValidator(mobile, /^(?:\+971|00971|0)?(?:2|3|4|6|7|9)\d{7}$/, true);
};

/**
 * validate MAKANI ID in UAE only
 */
Validator.prototype.isValidMakaniId = function(makaniId) {
    return this.regexValidator(makaniId, /^\d{5}\s\d{5}$/, true);
};

/**
 * validate string with given regex
 * @param str to be validated.
 * @param reg Regular Expression string.
 * @returns {Boolean} true if the string matches the given regex.
 * @returns {Boolean} true if the string matches the given regex.
 */
Validator.prototype.regexValidator = function(str, reg, passIfEmpty) {
		if(passIfEmpty)//passIfEmpty defined
				if(passIfEmpty === true)// defently true
						if(Utils.isBlankOrNull(str))//not null or blank
								return true;
    return reg.test(String(str));
};

/**
 * creates a shallow clone of the object.
 * 
 * @param {object}
 *            the object to clone.
 * @returns {object} a clone of the object.
 */
Utils.shallowClone = function(obj) {
	var copy = {};
	for ( var key in obj) {
		if (obj.hasOwnProperty(key)) {
			copy[key] = obj[key];
		}
	}
	return copy;
}

/**
 * encodes XML entities in the string.
 */
Utils.encodeXML = function(str) {
	if (Utils.isBlankOrNull(str)) {
		return str;
	}
	
	if (typeof str != "string") {
		str = String(str);
	}

	return str.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
};

/**
 * construct hash map from passed JS object
 * 
 * @param {object}
 *            object - JS object with key-value structure.
 * 
 * @returns {HashMap} - Map contains key-values from passed JS object.
 */
Utils.objectToHashtable = function(obj) {
	var hashtable = aa.util.newHashtable();
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			hashtable.put(key, obj[key]);
		}
	}
	return hashtable;
}

/**
 * encodes the string in base64 format
 * 
 * @param {string}
 *            str - the string to be encoded.
 * 
 * @returns {string} - the base64 encoded value of the provided string.
 */
Utils.base64Encode = function(str) {
	return javax.xml.bind.DatatypeConverter.printBase64Binary(str.getBytes(java.nio.charset.StandardCharsets.UTF_8));
}

/**
 * Format Date
 * 
 * @param date :
 *                Date to be formatted(java.util.Date)
 * @param formatPattern :
 *                The format pattern
 * @returns {String} : Formatted Date
 */
Utils.formatDate = function(date, formatPattern) {
	var newFormattedDate = "";
	var dateFormat = formatPattern;
	
	if (Utils.isBlankOrNull(date)) {
		throw "Invalid date value";
	}
	
	if (Utils.isBlankOrNull(dateFormat)) {
		dateFormat = 'MM/dd/yyyy';
	}
	
	try {
		newFormattedDate = aa.util.formatDate(date, dateFormat);
	} catch (e) {
		Utils.printErrorLog("Error at Utils.formatDate", e);
	}
	
	return newFormattedDate;
}

Utils.printLog = function(logMessage) {
	//aa.print(logMessage);
	java.lang.System.out.println(logMessage);
}

Utils.printErrorLog = function(logMessage, e, throwException) {
	//aa.print(logMessage + ": " + e)
	java.lang.System.out.println(logMessage + ": " + e);
	if (throwException) {
		throw e;
	}
}

/**
 * Utility function to calculate difference between two dates
 * 
 * @param date1
 *                Start date
 * @param date2
 *                End Date
 * @param addStartDay
 *                flag to calculate the start day or just the difference
 * 
 * @returns {Number} number of days
 */
Utils.getDateDifferenceInDays = function(date1, date2, addStartDay) {
	var diffDays = 0;
	try {
	var start = Utils.getCalendar(date1)
	var end = Utils.getCalendar(date2)
	var startDate = start.getTime();
	var endDate = end.getTime();
	var startTime = startDate.getTime();
	var endTime = endDate.getTime();
	var diffTime = endTime - startTime;
	diffDays = diffTime / (1000 * 60 * 60 * 24);
	if (addStartDay && (addStartDay == true)) {
	diffDays += 1;
	}
	} catch (e) {
	Utils.printErrorLog('Error at Utils.getDateDifferenceInDays', e, true);
	}

	return diffDays;
	}

Utils.getCalendar = function(date, hour, minute, second, millisecond) {
	hour = !Utils.isBlankOrNull(hour) ? hour : 0;
	minute = !Utils.isBlankOrNull(minute) ? minute : 0;
	second = !Utils.isBlankOrNull(second) ? second : 0;
	millisecond = !Utils.isBlankOrNull(millisecond) ? millisecond : 0;

	try {
	if (!(date instanceof java.util.Date || date instanceof Date)) {
	date = aa.util.parseDate(date);
	}

	java.lang.System.out.println("Utils.getCalendar: " + date instanceof java.util.GregorianCalendar)
	if (date instanceof java.util.GregorianCalendar) {
	return date;
	}

	var cal = java.util.Calendar.getInstance();
	cal.setTime(date);
	cal.set(java.util.Calendar.HOUR_OF_DAY, hour);
	cal.set(java.util.Calendar.MINUTE, minute);
	cal.set(java.util.Calendar.SECOND, second);
	cal.set(java.util.Calendar.MILLISECOND, millisecond);
	return cal;
	} catch (e) {
	throw date + " is not a Date object";
	aa.debug("Error at Utils.getCalendar", e);
	}
	}

/**
 * Utility functio to return the instance of calendar
 * 
 * @returns instance of java.util.Calendar
 */
Utils.getToday = function(clearTime) {
	var today = java.util.Calendar.getInstance();
	if (clearTime) {
	today.set(java.util.Calendar.HOUR_OF_DAY, 0);
	today.set(java.util.Calendar.MINUTE, 0);
	today.set(java.util.Calendar.SECOND, 0);
	today.set(java.util.Calendar.MILLISECOND, 0);
	}
	
	return today;
}

/**
 * Utility method to get differences between times
 * 
 * @param time1 :
 *                First time ex:09:00
 * @param time2 :
 *                Second time ex:13:00
 * 
 * @returns {Number}
 */
Utils.getTimeDifferencesInHours = function(date1, date2, time1, time2) {
	if (Utils.isBlankOrNull(time1) || (time1.split(":").length != 2)) {
	throw "Invalid time format";
	}
	
	if (Utils.isBlankOrNull(time2) || (time2.split(":").length != 2)) {
	throw "Invalid time format";
	}
	
	var diffInHours = 0;
	try {
	var tim1Arr = time1.split(":");
	var tim2Arr = time2.split(":");
	
	var date1 = Utils.getDateFromTime(date1, tim1Arr[0], tim1Arr[1]);
	aa.print("date1 " + date1)
	aa.print("date2 " + date2)
	var date2 = Utils.getDateFromTime(date2, tim2Arr[0], tim2Arr[1]);
	var diffTime = date2.getTime().getTime() - date1.getTime().getTime();
	diffInHours = diffTime / (1000 * 60 * 60);
	} catch (e) {
	throw "Error at getTimeDifferencesInHours: " + e;
	aa.debug("Error at Utils.getTimeDifferencesInHours", e);
	}
	
	return diffInHours;
}

Utils.getLoggedInUserSeqNum = function() {
	var curentUserSeqNum = "";
	try {
		var currentUserId = String(aa.env.getValue("CurrentUserID"));
		if (!Utils.isBlankOrNull(currentUserId) && currentUserId.indexOf("PUBLICUSER") == 0) {
			curentUserSeqNum = currentUserId.replace("PUBLICUSER", "");
		}
	} catch (e) {
		Utils.printErrorLog("Error at Utils.getACACurentUserSeqNum", e, true);
	}
	
	return curentUserSeqNum;
}

Utils.getUserLicenses = function(userSeqNum) {
	var userLicensesList = null;
	try {
		userLicensesList = aa.licenseScript.getRefLicProfByOnlineUser(userSeqNum).getOutput();
	} catch (e) {
		Utils.printErrorLog("Utils.getUserLicenses", e);
		throw e;
	}
	
	return userLicensesList;
}

/**
 * Utility functio to return the instance of calendar
 * 
 * @returns instance of java.util.Calendar
 */
Utils.getDateFromTime = function(date, hour, minute, second, millisecond) {
	hour = !Utils.isBlankOrNull(hour) ? hour : 0;
	minute = !Utils.isBlankOrNull(minute) ? minute : 0;
	second = !Utils.isBlankOrNull(second) ? second : 0;
	millisecond = !Utils.isBlankOrNull(millisecond) ? millisecond : 0;
	
	var today = Utils.getToday(true);
	today.setTime(date);
	today.set(java.util.Calendar.HOUR_OF_DAY, hour);
	
	today.set(java.util.Calendar.HOUR_OF_DAY, hour);
	today.set(java.util.Calendar.MINUTE, minute);
	today.set(java.util.Calendar.SECOND, second);
	today.set(java.util.Calendar.MILLISECOND, millisecond);
	return today;
}

Utils.getRecordFields = function(agency, group, type, subtype, category) {
	var service = com.accela.aa.emse.dom.service.CachedService.getInstance().getAppSpecificInfoService();
	var capTypeService = com.accela.aa.emse.dom.service.CachedService.getInstance().getCapTypeService();

	var capModel = aa.cap.getCapModel().getOutput();
	var capType = capModel.getCapType();
	capType.setGroup(group);
	capType.setType(type);
	capType.setSubType(subtype);
	capType.setCategory(category);
	capType.setServiceProviderCode(agency)

	var res = capTypeService.getCapTypeByPK(capType)
	var group = service.getRefAppSpecInfoWithFieldList(agency, res.getSpecInfoCode(), aa.getAuditID())
	var fields = group.getFieldList().toArray();
	return fields;
}

/**
 * Utility function to validate email format
 * 
 * @returns true if valid
 */
Utils.validateEmail = function(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}

/**
 * Utility function to validate mobile number 
 * 
 * @returns true if valid
 */
Utils.validateMobile = function(mobile) {
	var re = /^(?:\+971|00971)?(?:50|51|52|55|56|54|58|2|3|4|6|7|9)\d{6,7}$/;
	return re.test(mobile.trim());
}
/**
 * Utility function to validate mobile number for SALAMA 
 * 
 * @returns true if valid
 */
Utils.validateSALAMAMobile = function(mobile) {
	var re = /^(?:\+971|00971)?(?:5)\d{8}$/;
	return re.test(mobile.trim());
}

/**
 * Utility function to validate landline and phone number 
 * 
 * @returns true if valid
 */
Utils.isValidLandlineNumber = function(phone){
	//var re = /^(?:\+971|00971)?(?:50|51|52|55|56|54|58|2|3|4|6|7|9)\d{6}$/;
	var re = /^(?:\+971|00971)?\d{8}$/;
	return re.test(phone);
}

/**
 * Utility function to validate Emirates ID
 * 
 * @returns true if valid
 */
Utils.validateEmiratesId = function(emiratesId) {
	if (emiratesId == null || emiratesId == "" || emiratesId.length != 15) {
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * Utility function to validate User Name
 * 
 * @returns true if valid
 */
Utils.validateUserName = function(userName)
{
	var re = /^[A-Za-z][A-Za-z0-9_]{7,19}$/;
	return re.test(userName);
}

/**
 * Utility function to validate Password
 * 
 * @returns true if valid
 */
Utils.validatePassword = function(password)
{
	var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,15}$/;
	return re.test(password);
}

Utils.getLookupValue = function(sdName, sdKey) {
	var retVal;
	var r = aa.bizDomain.getBizDomainByValue(sdName, sdKey);
	if (r.getSuccess()) {
		var i = r.getOutput();
		retVal = "" + i.getDescription();
		aa.debug("", "lookup(" + sdName + "," + sdKey + ") = " + retVal)
	} else {
		aa.debug("", "lookup(" + sdName + "," + sdKey + ") does not exist")
	}
	return retVal
}

Utils.setLookupValue = function(sdName, sdKey, sdValue) {
	var r = aa.bizDomain.getBizDomainByValue(sdName, sdKey);
	if (r.getSuccess()) {
		var i = r.getOutput();
		i.setDescription(sdValue);
		var editResult = aa.bizDomain.editBizDomain(i.getBizDomain(), "en_US");
		if (!editResult.getSuccess()) {
			throw ("**ERROR editing Std Choice " + editResult.getErrorMessage());
		}
		aa.debug("", "lookup(" + sdName + "," + sdKey + ") = " + sdValue)
	} else {
		aa.debug("", "lookup(" + sdName + "," + sdKey + ") does not exist")
	}
}


Utils.getContactDataByEmailID = function(email) {
	var po = aa.people.getPeopleModel();
	po.setFirstName("*");
	po.setAuditStatus("A");
	po.setServiceProviderCode(aa.getServiceProviderCode());
	po.setEmail(email);
	var ModelArray = aa.people.getPeopleByPeopleModel(po).getOutput();
	for ( var c in ModelArray) {
		var pModel = ModelArray[c].getPeopleModel();
		if (pModel) {
			return pModel;
		}
	}
	return null;
}

Utils.getContactDataByPhoneNumber = function(phoneNumber) {
	var po = aa.people.getPeopleModel();
	po.setFirstName("*");
	po.setAuditStatus("A");
	po.setServiceProviderCode(aa.getServiceProviderCode());
	po.setPhone1(phoneNumber);
	var ModelArray = aa.people.getPeopleByPeopleModel(po).getOutput();
	for ( var c in ModelArray) {
		var pModel = ModelArray[c].getPeopleModel();
		if (pModel) {
			return pModel;
		}
	}
	return null;
}

Utils.getContactDataByEmirateID = function(eId) {
	var po = aa.people.getPeopleModel();
	po.setFirstName("*")
	po.setAuditStatus("A");
	po.setServiceProviderCode(aa.getServiceProviderCode());
	po.setStateIDNbr(eId);
	var ModelArray = aa.people.getPeopleByPeopleModel(po).getOutput();
	for ( var c in ModelArray) {
		var pModel = ModelArray[c].getPeopleModel();
		if (pModel) {
			return pModel;
		}
	}
	return null;
}

Utils.getContactDataByPassportNumber = function(passportNumber) {
	var po = aa.people.getPeopleModel();
	po.setFirstName("*")
	po.setAuditStatus("A");
	po.setServiceProviderCode(aa.getServiceProviderCode());
	po.setPassportNumber(passportNumber);
	var ModelArray = aa.people.getPeopleByPeopleModel(po).getOutput();
	for ( var c in ModelArray) {
		var pModel = ModelArray[c].getPeopleModel();
		if (pModel) {
			return pModel;
		}
	}
	return null;
}


var iso3ToIso2Mapping = {
	    "AFG": "AF",
	    "ALA": "AX",
	    "ALB": "AL",
	    "DZA": "DZ",
	    "ASM": "AS",
	    "AND": "AD",
	    "AGO": "AO",
	    "AIA": "AI",
	    "ATA": "AQ",
	    "ATG": "AG",
	    "ARG": "AR",
	    "ARM": "AM",
	    "ABW": "AW",
	    "AUS": "AU",
	    "AUT": "AT",
	    "AZE": "AZ",
	    "BHS": "BS",
	    "BHR": "BH",
	    "BGD": "BD",
	    "BRB": "BB",
	    "BLR": "BY",
	    "BEL": "BE",
	    "BLZ": "BZ",
	    "BEN": "BJ",
	    "BMU": "BM",
	    "BTN": "BT",
	    "BOL": "BO",
	    "BES": "BQ",
	    "BIH": "BA",
	    "BWA": "BW",
	    "BVT": "BV",
	    "BRA": "BR",
	    "IOT": "IO",
	    "BRN": "BN",
	    "BGR": "BG",
	    "BFA": "BF",
	    "BDI": "BI",
	    "CPV": "CV",
	    "KHM": "KH",
	    "CMR": "CM",
	    "CAN": "CA",
	    "CYM": "KY",
	    "CAF": "CF",
	    "TCD": "TD",
	    "CHL": "CL",
	    "CHN": "CN",
	    "CXR": "CX",
	    "CCK": "CC",
	    "COL": "CO",
	    "COM": "KM",
	    "COG": "CG",
	    "COD": "CD",
	    "COK": "CK",
	    "CRI": "CR",
	    "CIV": "CI",
	    "HRV": "HR",
	    "CUB": "CU",
	    "CUW": "CW",
	    "CYP": "CY",
	    "CZE": "CZ",
	    "DNK": "DK",
	    "DJI": "DJ",
	    "DMA": "DM",
	    "DOM": "DO",
	    "ECU": "EC",
	    "EGY": "EG",
	    "SLV": "SV",
	    "GNQ": "GQ",
	    "ERI": "ER",
	    "EST": "EE",
	    "ETH": "ET",
	    "FLK": "FK",
	    "FRO": "FO",
	    "FJI": "FJ",
	    "FIN": "FI",
	    "FRA": "FR",
	    "GUF": "GF",
	    "PYF": "PF",
	    "ATF": "TF",
	    "GAB": "GA",
	    "GMB": "GM",
	    "GEO": "GE",
	    "DEU": "DE",
	    "GHA": "GH",
	    "GIB": "GI",
	    "GRC": "GR",
	    "GRL": "GL",
	    "GRD": "GD",
	    "GLP": "GP",
	    "GUM": "GU",
	    "GTM": "GT",
	    "GGY": "GG",
	    "GIN": "GN",
	    "GNB": "GW",
	    "GUY": "GY",
	    "HTI": "HT",
	    "HMD": "HM",
	    "VAT": "VA",
	    "HND": "HN",
	    "HKG": "HK",
	    "HUN": "HU",
	    "ISL": "IS",
	    "IND": "IN",
	    "IDN": "ID",
	    "IRN": "IR",
	    "IRQ": "IQ",
	    "IRL": "IE",
	    "IMN": "IM",
	    "ISR": "IL",
	    "ITA": "IT",
	    "JAM": "JM",
	    "JPN": "JP",
	    "JEY": "JE",
	    "JOR": "JO",
	    "KAZ": "KZ",
	    "KEN": "KE",
	    "KIR": "KI",
	    "PRK": "KP",
	    "KOR": "KR",
	    "KWT": "KW",
	    "KGZ": "KG",
	    "LAO": "LA",
	    "LVA": "LV",
	    "LBN": "LB",
	    "LSO": "LS",
	    "LBR": "LR",
	    "LBY": "LY",
	    "LIE": "LI",
	    "LTU": "LT",
	    "LUX": "LU",
	    "MAC": "MO",
	    "MKD": "MK",
	    "MDG": "MG",
	    "MWI": "MW",
	    "MYS": "MY",
	    "MDV": "MV",
	    "MLI": "ML",
	    "MLT": "MT",
	    "MHL": "MH",
	    "MTQ": "MQ",
	    "MRT": "MR",
	    "MUS": "MU",
	    "MYT": "YT",
	    "MEX": "MX",
	    "FSM": "FM",
	    "MDA": "MD",
	    "MCO": "MC",
	    "MNG": "MN",
	    "MNE": "ME",
	    "MSR": "MS",
	    "MAR": "MA",
	    "MOZ": "MZ",
	    "MMR": "MM",
	    "NAM": "NA",
	    "NRU": "NR",
	    "NPL": "NP",
	    "NLD": "NL",
	    "NCL": "NC",
	    "NZL": "NZ",
	    "NIC": "NI",
	    "NER": "NE",
	    "NGA": "NG",
	    "NIU": "NU",
	    "NFK": "NF",
	    "MNP": "MP",
	    "NOR": "NO",
	    "OMN": "OM",
	    "PAK": "PK",
	    "PLW": "PW",
	    "PSE": "PS",
	    "PAN": "PA",
	    "PNG": "PG",
	    "PRY": "PY",
	    "PER": "PE",
	    "PHL": "PH",
	    "PCN": "PN",
	    "POL": "PL",
	    "PRT": "PT",
	    "PRI": "PR",
	    "QAT": "QA",
	    "REU": "RE",
	    "ROU": "RO",
	    "RUS": "RU",
	    "RWA": "RW",
	    "BLM": "BL",
	    "SHN": "SH",
	    "KNA": "KN",
	    "LCA": "LC",
	    "MAF": "MF",
	    "SPM": "PM",
	    "VCT": "VC",
	    "WSM": "WS",
	    "SMR": "SM",
	    "STP": "ST",
	    "SAU": "SA",
	    "SEN": "SN",
	    "SRB": "RS",
	    "SYC": "SC",
	    "SLE": "SL",
	    "SGP": "SG",
	    "SXM": "SX",
	    "SVK": "SK",
	    "SVN": "SI",
	    "SLB": "SB",
	    "SOM": "SO",
	    "ZAF": "ZA",
	    "SGS": "GS",
	    "SSD": "SS",
	    "ESP": "ES",
	    "LKA": "LK",
	    "SDN": "SD",
	    "SUR": "SR",
	    "SJM": "SJ",
	    "SWZ": "SZ",
	    "SWE": "SE",
	    "CHE": "CH",
	    "SYR": "SY",
	    "TWN": "TW",
	    "TJK": "TJ",
	    "TZA": "TZ",
	    "THA": "TH",
	    "TLS": "TL",
	    "TGO": "TG",
	    "TKL": "TK",
	    "TON": "TO",
	    "TTO": "TT",
	    "TUN": "TN",
	    "TUR": "TR",
	    "TKM": "TM",
	    "TCA": "TC",
	    "TUV": "TV",
	    "UGA": "UG",
	    "UKR": "UA",
	    "ARE": "AE",
	    "GBR": "GB",
	    "USA": "US",
	    "UMI": "UM",
	    "URY": "UY",
	    "UZB": "UZ",
	    "VUT": "VU",
	    "VEN": "VE",
	    "VNM": "VN",
	    "VGB": "VG",
	    "VIR": "VI",
	    "WLF": "WF",
	    "ESH": "EH",
	    "YEM": "YE",
	    "ZMB": "ZM",
	    "ZWE": "ZW"
	}

Utils.convertCountryCodeToIso2 = function(isoCode) {
    return iso3ToIso2Mapping[isoCode];
}

var isoCountriesbyCodeName = {
	     'AF' : 'Afghanistan',
	     'AX' : 'Aland Islands',
	     'AL' : 'Albania',
	     'DZ' : 'Algeria',
	     'AS' : 'American Samoa',
	     'AD' : 'Andorra',
	     'AO' : 'Angola',
	     'AI' : 'Anguilla',
	     'AQ' : 'Antarctica',
	     'AG' : 'Antigua And Barbuda',
	     'AR' : 'Argentina',
	     'AM' : 'Armenia',
	     'AW' : 'Aruba',
	     'AU' : 'Australia',
	     'AT' : 'Austria',
	     'AZ' : 'Azerbaijan',
	     'BS' : 'Bahamas',
	     'BH' : 'Bahrain',
	     'BD' : 'Bangladesh',
	     'BB' : 'Barbados',
	     'BY' : 'Belarus',
	     'BE' : 'Belgium',
	     'BZ' : 'Belize',
	     'BJ' : 'Benin',
	     'BM' : 'Bermuda',
	     'BT' : 'Bhutan',
	     'BO' : 'Bolivia',
	     'BA' : 'Bosnia and Herzegovina',
	     'BW' : 'Botswana',
	     'BV' : 'Bouvet Island',
	     'BR' : 'Brazil',
	     'IO' : 'British Indian Ocean Territory',
	     'BN' : 'Brunei Darussalam',
	     'BG' : 'Bulgaria',
	     'BF' : 'Burkina Faso',
	     'BI' : 'Burundi',
	     'KH' : 'Cambodia',
	     'CM' : 'Cameroon',
	     'CA' : 'Canada',
	     'CV' : 'Cape Verde',
	     'KY' : 'Cayman Islands',
	     'CF' : 'Central African Republic',
	     'TD' : 'Chad',
	     'CL' : 'Chile',
	     'CN' : 'China',
	     'CX' : 'Christmas Island',
	     'CC' : 'Cocos (Keeling) Islands',
	     'CO' : 'Colombia',
	     'KM' : 'Comoros',
	     'CG' : 'Congo',
	     'CD' : 'Democratic Republic of the Congo',
	     'CK' : 'Cook Islands',
	     'CR' : 'Costa Rica',
	     'CI' : 'Cote dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢Ivoire',
	     'HR' : 'Croatia',
	     'CU' : 'Cuba',
	     'CY' : 'Cyprus',
	     'CZ' : 'Czech Republic',
	     'DK' : 'Denmark',
	     'DJ' : 'Djibouti',
	     'DM' : 'Dominica',
	     'DO' : 'Dominican Republic',
	     'EC' : 'Ecuador',
	     'EG' : 'Egypt',
	     'SV' : 'El Salvador',
	     'GQ' : 'Equatorial Guinea',
	     'ER' : 'Eritrea',
	     'EE' : 'Estonia',
	     'ET' : 'Ethiopia',
	     'FK' : 'Falkland Islands (Malvinas)',
	     'FO' : 'Faroe Islands',
	     'FJ' : 'Fiji',
	     'FI' : 'Finland',
	     'FR' : 'France',
	     'GF' : 'French Guiana',
	     'PF' : 'French Polynesia',
	     'TF' : 'French Southern Territories',
	     'GA' : 'Gabon',
	     'GM' : 'Gambia',
	     'GE' : 'Georgia',
	     'DE' : 'Germany',
	     'GH' : 'Ghana',
	     'GI' : 'Gibraltar',
	     'GR' : 'Greece',
	     'GL' : 'Greenland',
	     'GD' : 'Grenada',
	     'GP' : 'Guadeloupe',
	     'GU' : 'Guam',
	     'GT' : 'Guatemala',
	     'GG' : 'Guernsey',
	     'GN' : 'Guinea',
	     'GW' : 'Guinea-Bissau',
	     'GY' : 'Guyana',
	     'HT' : 'Haiti',
	     'HM' : 'Heard Island & Mcdonald Islands',
	     'VA' : 'Holy See (Vatican City State)',
	     'HN' : 'Honduras',
	     'HK' : 'Hong Kong',
	     'HU' : 'Hungary',
	     'IS' : 'Iceland',
	     'IN' : 'India',
	     'ID' : 'Indonesia',
	     'IR' : 'Iran',
	     'IQ' : 'Iraq',
	     'IE' : 'Ireland',
	     'IM' : 'Isle Of Man',
	     'IL' : 'Israel',
	     'IT' : 'Italy',
	     'JM' : 'Jamaica',
	     'JP' : 'Japan',
	     'JE' : 'Jersey',
	     'JO' : 'Jordan',
	     'KZ' : 'Kazakhstan',
	     'KE' : 'Kenya',
	     'KI' : 'Kiribati',
	     'KR' : 'Democratic PeopleÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢s Republic of Korea',
	     'KP' : 'Korea',
	     'KW' : 'Kuwait',
	     'KG' : 'Kyrgyzstan',
	     'LA' : 'Lao People Democratic Republic',
	     'LV' : 'Latvia',
	     'LB' : 'Lebanon',
	     'LS' : 'Lesotho',
	     'LR' : 'Liberia',
	     'LY' : 'Libya',
	     'LI' : 'Liechtenstein',
	     'LT' : 'Lithuania',
	     'LU' : 'Luxembourg',
	     'MO' : 'Macao',
	     'MK' : 'Macedonia, the former Yugoslav Republic of',
	     'MG' : 'Madagascar',
	     'MW' : 'Malawi',
	     'MY' : 'Malaysia',
	     'MV' : 'Maldives',
	     'ML' : 'Mali',
	     'MT' : 'Malta',
	     'MH' : 'Marshall Islands',
	     'MQ' : 'Martinique',
	     'MR' : 'Mauritania',
	     'MU' : 'Mauritius',
	     'YT' : 'Mayotte',
	     'MX' : 'Mexico',
	     'FM' : 'Micronesia, Federated States of',
	     'MD' : 'Moldova, Republic of',
	     'MC' : 'Monaco',
	     'MN' : 'Mongolia',
	     'ME' : 'Montenegro',
	     'MS' : 'Montserrat',
	     'MA' : 'Morocco',
	     'MZ' : 'Mozambique',
	     'MM' : 'Myanmar',
	     'NA' : 'Namibia',
	     'NR' : 'Nauru',
	     'NP' : 'Nepal',
	     'NL' : 'Netherlands',
	     'AN' : 'Netherlands Antilles',
	     'NC' : 'New Caledonia',
	     'NZ' : 'New Zealand',
	     'NI' : 'Nicaragua',
	     'NE' : 'Niger',
	     'NG' : 'Nigeria',
	     'NU' : 'Niue',
	     'NF' : 'Norfolk Island',
	     'MP' : 'Northern Mariana Islands',
	     'NO' : 'Norway',
	     'OM' : 'Oman',
	     'PK' : 'Pakistan',
	     'PW' : 'Palau',
	     'PS' : 'Palestine',
	     'PA' : 'Panama',
	     'PG' : 'Papua New Guinea',
	     'PY' : 'Paraguay',
	     'PE' : 'Peru',
	     'PH' : 'Philippines',
	     'PN' : 'Pitcairn',
	     'PL' : 'Poland',
	     'PT' : 'Portugal',
	     'PR' : 'Puerto Rico',
	     'QA' : 'Qatar',
	     'RE' : 'Reunion',
	     'RO' : 'Romania',
	     'RU' : 'Russian Federation',
	     'RW' : 'Rwanda',
	     'BL' : 'Saint Barthelemy',
	     'SH' : 'Saint Helena',
	     'KN' : 'Saint Kitts and Nevis',
	     'LC' : 'Saint Lucia',
	     'MF' : 'Saint Martin',
	     'PM' : 'Saint Pierre And Miquelon',
	     'VC' : 'Saint Vincent and the Grenadines',
	     'WS' : 'Samoa',
	     'SM' : 'San Marino',
	     'ST' : 'Sao Tome and Principe',
	     'SA' : 'Saudi Arabia',
	     'SN' : 'Senegal',
	     'RS' : 'Serbia',
	     'SC' : 'Seychelles',
	     'SL' : 'Sierra Leone',
	     'SG' : 'Singapore',
	     'SK' : 'Slovakia',
	     'SI' : 'Slovenia',
	     'SB' : 'Solomon Islands',
	     'SO' : 'Somalia',
	     'ZA' : 'South Africa',
	     'GS' : 'South Georgia And Sandwich Isl.',
	     'ES' : 'Spain',
	     'LK' : 'Sri Lanka',
	     'SD' : 'Sudan',
	     'SD' : 'South Sudan',
	     'SR' : 'Suriname',
	     'SJ' : 'Svalbard And Jan Mayen',
	     'SZ' : 'Swaziland',
	     'SE' : 'Sweden',
	     'CH' : 'Switzerland',
	     'SY' : 'Syrian Arab Republic',
	     'TW' : 'Taiwan',
	     'TJ' : 'Tajikistan',
	     'TZ' : 'Tanzania',
	     'TH' : 'Thailand',
	     'TL' : 'Timor-Leste',
	     'TG' : 'Togo',
	     'TK' : 'Tokelau',
	     'TO' : 'Tonga',
	     'TT' : 'Trinidad and Tobago',
	     'TN' : 'Tunisia',
	     'TR' : 'Turkey',
	     'TM' : 'Turkmenistan',
	     'TC' : 'Turks And Caicos Islands',
	     'TV' : 'Tuvalu',
	     'UG' : 'Uganda',
	     'UA' : 'Ukraine',
	     'AE' : 'United Arab Emirates',
	     'GB' : 'United Kingdom',
	     'US' : 'United States of America',
	     'UM' : 'United States Outlying Islands',
	     'UY' : 'Uruguay',
	     'UZ' : 'Uzbekistan',
	     'VU' : 'Vanuatu',
	     'VE' : 'Venezuela',
	     'VN' : 'Viet Nam',
	     'VG' : 'Virgin Islands, British',
	     'VI' : 'Virgin Islands, U.S.',
	     'WF' : 'Wallis And Futuna',
	     'EH' : 'Western Sahara',
	     'YE' : 'Yemen',
	     'ZM' : 'Zambia',
	     'ZW' : 'Zimbabwe'
	}
	Utils.getCountryNameByCode = function(isoCode) {
	     return isoCountriesbyCodeName[isoCode];
	}

	var isoCountriesbyName = {
	     'Afghanistan' : 'AF',
	     'Aland Islands' : 'AX',
	     'Albania' : 'AL',
	     'Algeria' : 'DZ',
	     'American Samoa' : 'AS',
	     'Andorra' : 'AD',
	     'Angola' : 'AO',
	     'Anguilla' : 'AI',
	     'Antarctica' : 'AQ',
	     'Antigua And Barbuda' : 'AG',
	     'Argentina' : 'AR',
	     'Armenia' : 'AM',
	     'Aruba' : 'AW',
	     'Australia' : 'AU',
	     'Austria' : 'AT',
	     'Azerbaijan' : 'AZ',
	     'Bahamas' : 'BS',
	     'Bahrain' : 'BH',
	     'Bangladesh' : 'BD',
	     'Barbados' : 'BB',
	     'Belarus' : 'BY',
	     'Belgium' : 'BE',
	     'Belize' : 'BZ',
	     'Benin' : 'BJ',
	     'Bermuda' : 'BM',
	     'Bhutan' : 'BT',
	     'Bolivia' : 'BO',
	     'Bosnia and Herzegovina' : 'BA',
	     'Botswana' : 'BW',
	     'Bouvet Island' : 'BV',
	     'Brazil' : 'BR',
	     'British Indian Ocean Territory' : 'IO',
	     'Brunei Darussalam' : 'BN',
	     'Bulgaria' : 'BG',
	     'Burkina Faso' : 'BF',
	     'Burundi' : 'BI',
	     'Cambodia' : 'KH',
	     'Cameroon' : 'CM',
	     'Canada' : 'CA',
	     'Cape Verde' : 'CV',
	     'Cayman Islands' : 'KY',
	     'Central African Republic' : 'CF',
	     'Chad' : 'TD',
	     'Chile' : 'CL',
	     'China' : 'CN',
	     'Christmas Island' : 'CX',
	     'Cocos (Keeling) Islands' : 'CC',
	     'Colombia' : 'CO',
	     'Comoros' : 'KM',
	     'Congo' : 'CG',
	     'Democratic Republic of the Congo' : 'CD',
	     'Cook Islands' : 'CK',
	     'Costa Rica' : 'CR',
	     'Cote d\ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ivoire' : 'CI',
	     'Croatia' : 'HR',
	     'Cuba' : 'CU',
	     'Cyprus' : 'CY',
	     'Czech Republic' : 'CZ',
	     'Denmark' : 'DK',
	     'Djibouti' : 'DJ',
	     'Dominica' : 'DM',
	     'Dominican Republic' : 'DO',
	     'Ecuador' : 'EC',
	     'Egypt' : 'EG',
	     'El Salvador' : 'SV',
	     'Equatorial Guinea' : 'GQ',
	     'Eritrea' : 'ER',
	     'Estonia' : 'EE',
	     'Ethiopia' : 'ET',
	     'Falkland Islands (Malvinas)' : 'FK',
	     'Faroe Islands' : 'FO',
	     'Fiji' : 'FJ',
	     'Finland' : 'FI',
	     'France' : 'FR',
	     'French Guiana' : 'GF',
	     'French Polynesia' : 'PF',
	     'French Southern Territories' : 'TF',
	     'Gabon' : 'GA',
	     'Gambia' : 'GM',
	     'Georgia' : 'GE',
	     'Germany' : 'DE',
	     'Ghana' : 'GH',
	     'Gibraltar' : 'GI',
	     'Greece' : 'GR',
	     'Greenland' : 'GL',
	     'Grenada' : 'GD',
	     'Guadeloupe' : 'GP',
	     'Guam' : 'GU',
	     'Guatemala' : 'GT',
	     'Guernsey' : 'GG',
	     'Guinea' : 'GN',
	     'Guinea-Bissau' : 'GW',
	     'Guyana' : 'GY',
	     'Haiti' : 'HT',
	     'Heard Island & Mcdonald Islands' : 'HM',
	     'Holy See (Vatican City State)' : 'VA',
	     'Honduras' : 'HN',
	     'Hong Kong' : 'HK',
	     'Hungary' : 'HU',
	     'Iceland' : 'IS',
	     'India' : 'IN',
	     'Indonesia' : 'ID',
	     'Iran' : 'IR',
	     'Iraq' : 'IQ',
	     'Ireland' : 'IE',
	     'Isle Of Man' : 'IM',
	     'Israel' : 'IL',
	     'Italy' : 'IT',
	     'Jamaica' : 'JM',
	     'Japan' : 'JP',
	     'Jersey' : 'JE',
	     'Jordan' : 'JO',
	     'Kazakhstan' : 'KZ',
	     'Kenya' : 'KE',
	     'Kiribati' : 'KI',
	     'Democratic PeopleÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢s Republic of Korea' : 'KR',
	     'Korea' : 'KP',
	     'Kuwait' : 'KW',
	     'Kyrgyzstan' : 'KG',
	     'Lao People Democratic Republic' : 'LA',
	     'Latvia' : 'LV',
	     'Lebanon' : 'LB',
	     'Lesotho' : 'LS',
	     'Liberia' : 'LR',
	     'Libya' : 'LY',
	     'Liechtenstein' : 'LI',
	     'Lithuania' : 'LT',
	     'Luxembourg' : 'LU',
	     'Macao' : 'MO',
	     'Macedonia, the former Yugoslav Republic of' : 'MK',
	     'Madagascar' : 'MG',
	     'Malawi' : 'MW',
	     'Malaysia' : 'MY',
	     'Maldives' : 'MV',
	     'Mali' : 'ML',
	     'Malta' : 'MT',
	     'Marshall Islands' : 'MH',
	     'Martinique' : 'MQ',
	     'Mauritania' : 'MR',
	     'Mauritius' : 'MU',
	     'Mayotte' : 'YT',
	     'Mexico' : 'MX',
	     'Micronesia, Federated States of' : 'FM',
	     'Moldova, Republic of' : 'MD',
	     'Monaco' : 'MC',
	     'Mongolia' : 'MN',
	     'Montenegro' : 'ME',
	     'Montserrat' : 'MS',
	     'Morocco' : 'MA',
	     'Mozambique' : 'MZ',
	     'Myanmar' : 'MM',
	     'Namibia' : 'NA',
	     'Nauru' : 'NR',
	     'Nepal' : 'NP',
	     'Netherlands' : 'NL',
	     'Netherlands Antilles' : 'AN',
	     'New Caledonia' : 'NC',
	     'New Zealand' : 'NZ',
	     'Nicaragua' : 'NI',
	     'Niger' : 'NE',
	     'Nigeria' : 'NG',
	     'Niue' : 'NU',
	     'Norfolk Island' : 'NF',
	     'Northern Mariana Islands' : 'MP',
	     'Norway' : 'NO',
	     'Oman' : 'OM',
	     'Pakistan' : 'PK',
	     'Palau' : 'PW',
	     'Palestine' : 'PS',
	     'Panama' : 'PA',
	     'Papua New Guinea' : 'PG',
	     'Paraguay' : 'PY',
	     'Peru' : 'PE',
	     'Philippines' : 'PH',
	     'Pitcairn' : 'PN',
	     'Poland' : 'PL',
	     'Portugal' : 'PT',
	     'Puerto Rico' : 'PR',
	     'Qatar' : 'QA',
	     'Reunion' : 'RE',
	     'Romania' : 'RO',
	     'Russian Federation' : 'RU',
	     'Rwanda' : 'RW',
	     'Saint Barthelemy' : 'BL',
	     'Saint Helena' : 'SH',
	     'Saint Kitts and Nevis' : 'KN',
	     'Saint Lucia' : 'LC',
	     'Saint Martin' : 'MF',
	     'Saint Pierre And Miquelon' : 'PM',
	     'Saint Vincent and the Grenadines' : 'VC',
	     'Samoa' : 'WS',
	     'San Marino' : 'SM',
	     'Sao Tome and Principe' : 'ST',
	     'Saudi Arabia' : 'SA',
	     'Senegal' : 'SN',
	     'Serbia' : 'RS',
	     'Seychelles' : 'SC',
	     'Sierra Leone' : 'SL',
	     'Singapore' : 'SG',
	     'Slovakia' : 'SK',
	     'Slovenia' : 'SI',
	     'Solomon Islands' : 'SB',
	     'Somalia' : 'SO',
	     'South Africa' : 'ZA',
	     'South Georgia And Sandwich Isl.' : 'GS',
	     'Spain' : 'ES',
	     'Sri Lanka' : 'LK',
	     'Sudan' : 'SD',
	     'South Sudan' : 'SD',
	     'Suriname' : 'SR',
	     'Svalbard And Jan Mayen' : 'SJ',
	     'Swaziland' : 'SZ',
	     'Sweden' : 'SE',
	     'Switzerland' : 'CH',
	     'Syrian Arab Republic' : 'SY',
	     'Taiwan' : 'TW',
	     'Tajikistan' : 'TJ',
	     'Tanzania' : 'TZ',
	     'Thailand' : 'TH',
	     'Timor-Leste' : 'TL',
	     'Togo' : 'TG',
	     'Tokelau' : 'TK',
	     'Tonga' : 'TO',
	     'Trinidad and Tobago' : 'TT',
	     'Tunisia' : 'TN',
	     'Turkey' : 'TR',
	     'Turkmenistan' : 'TM',
	     'Turks And Caicos Islands' : 'TC',
	     'Tuvalu' : 'TV',
	     'Uganda' : 'UG',
	     'Ukraine' : 'UA',
	     'United Arab Emirates' : 'AE',
	     'United Kingdom' : 'GB',
	     'United States of America' : 'US',
	     'United States Outlying Islands' : 'UM',
	     'Uruguay' : 'UY',
	     'Uzbekistan' : 'UZ',
	     'Vanuatu' : 'VU',
	     'Venezuela' : 'VE',
	     'Viet Nam' : 'VN',
	     'Virgin Islands, British' : 'VG',
	     'Virgin Islands, U.S.' : 'VI',
	     'Wallis And Futuna' : 'WF',
	     'Western Sahara' : 'EH',
	     'Yemen' : 'YE',
	     'Zambia' : 'ZM',
	     'Zimbabwe' : 'ZW'
	};
	Utils.getCountryCodeByName = function(cntryName) {
	     return isoCountriesbyName[cntryName];
	}
	


	Utils.getPublicUserContact = function(publicUserId) {
		var retVal = null;
		var userSeqNum = String(publicUserId).replace(/\D/g, '');
		userSeqNum = parseFloat(userSeqNum);
		if (isNaN(userSeqNum)) {
		} else {
			userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput();
			var puSeq = userModel.getUserSeqNum();
			var publicUserIDList = aa.util.newArrayList();
			publicUserIDList.add(puSeq);
			// Get Public User Related Contacts
			var contractorBiz = aa.proxyInvoker.newInstance(
					"com.accela.pa.people.ContractorPeopleBusiness").getOutput();
			var contractorPeopleModelList = contractorBiz
					.getContractorPeopleListByUserSeqNBR(aa
							.getServiceProviderCode(), publicUserIDList);
			var peopleList = [];
			if (contractorPeopleModelList != null
					&& contractorPeopleModelList.size() > 0) {
				peopleList = contractorPeopleModelList.toArray();
				for (p in peopleList) {
					var contactType = peopleList[p].getContactType()
					if (contactType == "Employee" || contactType == "Applicant") {
						retVal = peopleList[p];
						break;
					}
				}
			}
		}
		return retVal
	}