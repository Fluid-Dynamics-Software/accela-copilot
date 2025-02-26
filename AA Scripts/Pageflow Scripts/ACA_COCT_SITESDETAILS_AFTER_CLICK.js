/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_COCT_SITESDETAILS_AFTER_CLICK.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: SALAHA
| Created at	: 14/03/2022 19:12:01
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("COMMON_PAGEFLOW_FUNCTIONS"));
eval(getScriptText("CLASS_ASIT_NAVIGATOR"));
//eval(getScriptText("Include_RECORD"));
java.lang.System.out.println('start direct: ');
var capModel = aa.env.getValue("CapModel");
var capId = capModel.getCapID();


var capClass = "";

var capModRes = aa.cap.getCap(capId);
if (capModRes.getSuccess()){
	var capMod = capModRes.getOutput();
	if (capModRes){
		capClass = capMod.getCapModel().getCapClass();
	}
}

//var currRecord = new Record(capId);
//var activitiesASIT = currRecord.loadASITForACA("SITES DETAILS");
java.lang.System.out.println('mid direct: ');
fillCOOPDetailsASI();
fillannualFees();
java.lang.System.out.println('end direct: ');
function fillCOOPDetailsASI()
{
	java.lang.System.out.println('in func direct: ');
var direct = 0;
var indirect = 0;
var vacant = 0;

var annualFees = 0;
var deservedfees = 0;

var totalArea = 0;

try{
	//if (capClass != "EDITABLE"){
		var sitesDetailsJSON = getAppSpecific("SITES DETAILS");
		//var sitesInformationJSON = getAppSpecific("SITES INFORMATION");

		logDebug("sitesDetailsJSON", sitesDetailsJSON);
		//logDebug("sitesInformationJSON", sitesInformationJSON);
		
		sitesDetailsJSON = JSON.parse(sitesDetailsJSON);
		//sitesInformationJSON = JSON.parse(sitesInformationJSON);
		
		var asit = new ASITNavigator("", "SITES DETAILS", true);
		asit.removeAll();			
		asit.addRows(sitesDetailsJSON);
		logDebug("sitesDetailsJSON From Pageflow!", sitesDetailsJSON);

		/****
		 * Remove real cap ASIT & ASI for ASIT filler
		 */

		//var asit2 = new ASITNavigator(capId, "SITES DETAILS");
		//asit2.removeAll();
		//asit.addRows(sitesDetailsJSON);	
		
	//}
	editAppSpecific("SITES DETAILS", "");
	

	var rows = getASITablesRowsFromSession4ACA("SITES DETAILS");
	
	var cArray = new Array();
	for (y in rows)
		{
		var ASITarray = new Array();
		var yrow=rows[y];
		ASITarray["Seq Number"] = yrow['Seq Number'];
		
		ASITarray["Investment Type"] = yrow['Investment Type'];
		ASITarray["Start Date"] = yrow['Start Date'];
		ASITarray["Monthly Rent"] = yrow['Monthly Rent'];
		ASITarray["MoF Deserved Amount"] = yrow['MoF Deserved Amount'];
		ASITarray["Surface Area"] = yrow['Surface Area'];
		
		ASITarray["Flag"] = '0';
		aa.print(ASITarray["Seq Number"]+" "+ASITarray["Start Date"]);
	//	aa.print("Flag= "+ASITarray["Flag"]);
		cArray.push(ASITarray);
		
		}
	
	var map = aa.util.newHashMap();
	if(rows && rows.length > 0){
		//javaLog('rows.length: ' + rows.length);
		for(i in rows){
			var row = rows[i];
			var investmentType = row['Investment Type']+"";
			var SeqNumber = row['Seq Number'];
			var StartDate =aa.util.formatDate(strToDate(row['Start Date']), 'MM/dd/yyyy');		
			var mappedItem = map.get(SeqNumber)
			if (mappedItem == null){
				map.put(SeqNumber, SeqNumber)
				
			if(investmentType == 'Direct'){
				direct = parseInt(direct) + 1;
			}
			if(investmentType == 'Indirect'){
				indirect = parseInt(indirect) + 1;			
			}
			if(investmentType == 'Unused'){
				vacant = parseInt(vacant) + 1;	
			}			
			var area = row['Surface Area']+"";
			try{
				area = parseFloat(area);
			}catch(e){
				area = 0;
			}
			
			totalArea = totalArea + area;			
			}
			else {
				for(x in cArray){
					
					var xrow = cArray[x];
					var SN = xrow['Seq Number'];
					
					var SD = aa.util.formatDate(strToDate(xrow['Start Date']), 'MM/dd/yyyy');
					var IT= xrow['Investment Type']+"";
					var Flag = xrow['Flag'];
					if (SeqNumber==SN && Flag==0)
						{
						if(!Utils.CompareTwoDates(StartDate,SD))
							{
							aa.print("StartDate= "+StartDate+"  "+SD);
							xrow['Flag']=1;
							
						if(IT == 'Direct'){
							direct = parseInt(direct) - 1;
						}
						if(IT == 'Indirect'){
							indirect = parseInt(indirect) - 1;			
						}
						if(IT == 'Unused'){
							vacant = parseInt(vacant) - 1;	
						}						
						var area = xrow['Surface Area']+"";
						try{
							area = parseFloat(area);
						}catch(e){
							area = 0;
						}
						
						totalArea = totalArea - area;
												
					if(investmentType == 'Direct'){
						direct = parseInt(direct) + 1;
					}
					if(investmentType == 'Indirect'){
						indirect = parseInt(indirect) + 1;			
					}
					if(investmentType == 'Unused'){
						vacant = parseInt(vacant) + 1;	
					}					
					var area = row['Surface Area']+"";
					try{
						area = parseFloat(area);
					}catch(e){
						area = 0;
					}
					
					totalArea = totalArea + area;
					
							}
						break;}
				}
				
				
			}
		}
	}else{
		java.lang.System.out.println('rows is NULL or zero length...................');
	}
}catch(e){
	java.lang.System.out.println('Error updating ASIs from ASIT: ' + e);
}

java.lang.System.out.println('direct: ' + direct);
java.lang.System.out.println('indirect: ' + indirect);
java.lang.System.out.println('vacant: ' + vacant);
java.lang.System.out.println('totalArea: ' + totalArea);


editAppSpecific("numberOfDirectInvestment", direct);
editAppSpecific("numberOfIndirectInvestment", indirect);
editAppSpecific("numberOfVacantSites", vacant);
editAppSpecific("surfaceArea", totalArea);

}
function fillannualFees()
{
	java.lang.System.out.println('start fillannualFees: ');
	eval(getScriptText("INCLUDE_COOP"));
	eval(getScriptText("INCLUDE_COCT"));
	var coctObj = new COCT(capId);
	var coopObj = new Coop(capId);
	java.lang.System.out.println('mid fillannualFees: ');
	//var coctObj = this.getInstance("INCLUDE_COCT", "COCT");
	//var coopObj = this.getInstance("INCLUDE_COOP", "Coop");
	
	var totalRentFees = 0;
	for(i=0;i<parseInt(getAppSpecific('contractDurationYears'));i=i+1){
	//execute annualRentFees
		java.lang.System.out.println('mid execute fillannualFees: '+getAppSpecific('contractDurationYears'));
	var annualRentFees = coopObj.calculateAnnualRentFees(i)
	java.lang.System.out.println('annualRentFees fillannualFees: '+annualRentFees);
	if(i==0){
	//execute update total
	totalRentFees = annualRentFees;
	java.lang.System.out.println('totalRentFees fillannualFees: '+totalRentFees);
	//execute set annual rent fees
	editAppSpecificCOCT("annualRentingFees",annualRentFees);
	}
	if(i==1){
	//execute set annual rent fees2
		editAppSpecificCOCT("annualRentingFeesSecondYear",annualRentFees);
	if(annualRentFees!=''){
	//execute update total
	totalRentFees = totalRentFees + annualRentFees;
	}
	java.lang.System.out.println('totalRentFees fillannualFees sec: '+totalRentFees);
	}
	if(i==2){
	//execute Update ASI
		editAppSpecificCOCT("annualRentingFeesThirdYear",annualRentFees);
	if(annualRentFees!=''){
	//execute update total
	totalRentFees = totalRentFees + annualRentFees;
	}
	java.lang.System.out.println('totalRentFees fillannualFees third: '+totalRentFees);
	}
	}
	editAppSpecificCOCT("totalRentingFees",parseFloat(totalRentFees).toFixed( 3 ));	
}

function strToDate(dateSTR) {
	var parts = dateSTR.split(" ")[0];
	if (parts.indexOf("-") != -1) {
		parts = parts.split('-');
	} else {
		parts = parts.split('/');
	}

	var date = new Date(parts[0], parts[1] - 1, parts[2]);
	date.setDate(parts[1]);
	date.setMonth(parts[0] - 1);
	date.setFullYear(parts[2]);

	return date;
}

function getASITablesRowsFromSession4ACA(tableName){
	var cap= aa.env.getValue("CapModel");	
	var gm = cap.getAppSpecificTableGroupModel();
		var ta = gm.getTablesMap();
		var tai = ta.values().iterator();
		
		while (tai.hasNext()) {
			
			var tsm = tai.next();
			if (tsm.rowIndex.isEmpty())
				continue;
 
			var asitRow = new Array;
			var asitTables = new Array;
			var tn = tsm.getTableName();
		
			if (tn != tableName) {
				continue;
			}

			var tsmfldi = tsm.getTableField().iterator();
			var tsmcoli = tsm.getColumns().iterator();
			while (tsmfldi.hasNext()) {

				var tcol = tsmcoli.next();
				var tval = tsmfldi.next();

				asitRow[tcol.getColumnName()] = tval;

				if (!tsmcoli.hasNext()) {
					
					tsmcoli = tsm.getColumns().iterator();
					asitTables.push(asitRow);
				
					asitRow = new Array;
				}
			}
			return asitTables;
		}
		return false;
	}
function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}


function editAppSpecificCOCT(fieldName, value){
    var thisCapModel = aa.env.getValue("CapModel");     
    var asiGroups = thisCapModel.getAppSpecificInfoGroups();
    var asiGroupsRet = setFieldValueCOCT(fieldName, asiGroups, value);
    thisCapModel.setAppSpecificInfoGroups(asiGroupsRet);
    aa.env.setValue("CapModel", thisCapModel);      
}

function setFieldValueCOCT(fieldName, asiGroups, value)
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
                     field.setChecklistComment(value);
                     group.setFields(fields);
                }
            }
        }
    }   
    return asiGroups;   
}


function logDebug(msg, msg2) {
	if (typeof msg2 === "undefined" || msg2 === null){
		msg2 = "";
	}else{
		msg2 = " : " + msg2;
	}
	java.lang.System.out.println("===Custom Log ==> " + msg + msg2); 
}
