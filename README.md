# accela-copilot

Accela uses ECMAScript 5 scripting, so always write code in that version.

Accela's own libraries are accessed through the aa object.
Example:
```
var capModel = aa.cap.getCapID("17CAP-00000020").getOutput();
```
returns the CapModel object with an AltId of "17CAP-00000020";

You can also access the environment session variables that accela provides for your scripting, by accessing:
```
var publicUser = aa.env.getValue("publicUser");
```
retrieves the publicUser string from the environment. The environment is usually populated by the context on which it is running.

The context can be:
- A PageFlow Script: depending on the pageflow Event that ran the script, it can be an onLoad event, or a BeforeClick event, or an AfterClick event.
- A Event Script that runs once the event is fired, this is a partial list of events:
  WorkflowTaskUpdateAfter
  WorkflowTaskUpdateBefore
  ApplicationSpecInfoUpdateAfter
  ApplicationSpecInfoUpdateBefore
  OnLoginScriptAfter4ACA
  ApplicationSubmitAfter
  ApplicationSubmitBefore
  ConvertToRealCapAfter

You can Also access Accela's libraries through the com.accela.* object

Exmaple:
var currentUserLanguage = com.accela.aa.emse.util.LanguageUtil.getCurrentLocale().getLanguage();

Gets the current user's chosen language.

Put in mind, the words Record & CAP are interchangeable, and mean the same thing.
You can also use the Record object to retrieve all kinds of information about a cap, by initializing it like so:
```
var record = new Record('17CAP-00000020');
```

Now, you can use the record object to retrieve all kinds of info about this cap/record:
```
// aa.print prints the result into the Script Test window if the user is running this in the script test window.
aa.print(record.altId);
```

Translations:

```
// This code retrieves the translated value based on the current logged in user's language, using the key "ACLA_ADD_TENANTS"
var errorMessage = aa.messageResources.getLocalMessage("ACLA_ADD_TENANTS")
	
```

In all Before events, the user can cancel the execution and stop the page/flow from moving forward, like so
```
	var errorMessage = aa.messageResources.getLocalMessage("ACLA_ADD_TENANTS")
	aa.env.setValue("ErrorCode", "-2");
	aa.env.setValue("ErrorMessage", errorMessage);
```