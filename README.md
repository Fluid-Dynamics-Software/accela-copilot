# accela-copilot

Accela uses ECMAScript 5 scripting, so always write code in that version.

Accela's own libraries are accessed through the aa object.
Example:
var capModel = aa.cap.getCapID("17CAP-00000020").getOutput();
returns the CapModel object with an AltId of "17CAP-00000020";

You can also access the environment session variables that accela provides for your scripting, by accessing:

var publicUser = aa.env.getValue("publicUser");

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


  
