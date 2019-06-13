/**
 * DocumentList and DocumentActions (details page) email actions
 * 
 * Adding action event handlers to Alfresco.doclib.Actions, which is picked up
 * by both Alfresco.DocumentList and Alfresco.DocumentActions
 * 
 * Note. this file must be loaded before document-actions.js and documentlist.js
 * 
 * @author ecmstuff.blogspot.com
 */
(function() {
	
	/**
	 * YUI Library aliases
	 */
	 var Dom = YAHOO.util.Dom,
	 	Event = YAHOO.util.Event;

	 /**
	  * Alfresco Slingshot aliases
	  */
	  var $html = Alfresco.util.encodeHTML,
	      $combine = Alfresco.util.combinePaths;
	
	
	var $div = '';

	/**
	 * Convert document to pdf.
	 *
	 * @method onActionConvertDocToPdfv2
	 * @param record
	 *            {object} record to be actioned
	 */
	YAHOO.Bubbling.fire("registerAction",
	{
		actionName: "onActionBulkExport",
		fn: function mycompany_onActionBulkExport(record)
		{
		 try{
			 var jsNode = record.jsNode,
			    displayName = record.displayName,    
			    maxLabelSize=0;
			 
			 var nodesRef = [];
			 var multiple = false;
		     if (record instanceof Array) {
		    	 multiple = true;
		    	 for (var i=0, ii=record.length ; i<ii ; i++){
		        	nodesRef.push(record[i].nodeRef);
		    	 }
		     } else {
		        nodesRef.push(record.nodeRef);
		     }
		     
			 var resultRefs =[];
				
			 var currentId = this.id;
			

		     var actionUrl = YAHOO.lang.substitute(
		    		 	Alfresco.constants.PROXY_URI +"/extensions/bulkexport/export?" +
		    		 			"nodeRef={NodeRef}&" +
		    		 			"base={base}&" +
		    		 			"ignoreExported={ignoreExported}&" +
		    		 			"exportVersions={exportVersions}",
	                {
		    		 	nodeRef: encodeURIComponent(nodesRef || ""),
		    		 	base : encodeURIComponent(""),
		    		 	ignoreExported: encodeURIComponent(true || ""),
		    		 	exportVersions: encodeURIComponent(true || "")
	                }
	            );
		     
		     Alfresco.util.Ajax.jsonGet({
	                url: actionUrl,
	                responseContentType: Alfresco.util.Ajax.JSON,
	                successCallback: {
	                    fn: function (response) {	                        
	 			    	   // Hide waiting dialog
	 					   if (this.waitDialog)
	 					   {
	 	                     this.waitDialog.destroy();
	 	                     this.waitDialog = null;
	 					   }
	 			    	   
	 			    	   var responseJSON = Alfresco.util.parseJSON(response.serverResponse.responseText);
	 			    	   if (responseJSON.result == "success") {
	 			    		   var successMessage = this.msg("bulk-export-action.msg.success");
	 				    	   if (nodesRef.length > 1) {
	 				    		   successMessage = this.msg("bulk-export-action.msg.success.multiple");
	 				    	   }
	 			    		   Alfresco.util.PopupManager.displayMessage({
	 				    		   text: successMessage,
	 				    		   displayTime: 10
	 				    	   });
	 			    	   } else {
	 			    		   var errorMessage = "bulk-export-action.msg.failure";
	 				    	   if (nodesRef.length > 1) {
	 				    		   errorMessage = "bulk-export-action.msg.failures";
	 				    	   }
	 			    		   Alfresco.util.PopupManager.displayMessage({
	 				    		   text: this.msg(errorMessage, responseJSON.error),
	 				    		   displayTime: 10
	 				    	   });
	 			    	   }
	 			           // Fire metadataRefresh so other components may update themselves
	 			           YAHOO.Bubbling.fire("metadataRefresh", this);
	 			           YAHOO.Bubbling.fire("metadataRefresh");
	                    },
	                    scope: this
	                },
	                failureCallback: {
	                    fn: function (response) {
	 			    	   // Hide waiting dialog
	 			    	   if (this.waitDialog)
	 					   {
	 	                     this.waitDialog.destroy();
	 	                     this.waitDialog = null;
	 					   }
	 			    	   
	 			    	   var responseJSON = Alfresco.util.parseJSON(response.serverResponse.responseText);
	 			    	   var errorMessage = "bulk-export-action.msg.failure";
	 			    	   if (nodesRef.length > 1) {
	 			    		   errorMessage = "bulk-export-action.msg.failures";
	 			    	   }
	 			    	   Alfresco.util.PopupManager.displayMessage({
	 			    		   text: this.msg(errorMessage, responseJSON.error),
	 			    		   displayTime: 10
	 			    	   });
	 			           // Fire metadataRefresh so other components may update themselves
	 			           YAHOO.Bubbling.fire("metadataRefresh", this);
	 			           YAHOO.Bubbling.fire("metadataRefresh");
	                    },
	                    scope: this
	                }
	            });
		     
		     //TODO make a form for more friendly usage
		     /*
			 this.modules.bulkExportModule = new Alfresco.module.SimpleDialog(this.id + "-bulkExportModule").setOptions(
			 {
			    width: "50em",
			    templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/service-doc-to-pdf/convertDocToPdf?displayName=" + encodeURIComponent(displayName) + "&nodeRef=" + encodeURIComponent(nodesRef.join()) + "&multiple=" + multiple,		    
			    actionUrl: actionUrl,
			    onSuccess:
			    {
			       fn: function dlA_onActionDepotCasier_success(response)
			       {
			    	   // Hide waiting dialog
					   if (this.waitDialog)
					   {
	                     this.waitDialog.destroy();
	                     this.waitDialog = null;
					   }
			    	   
			    	   var responseJSON = Alfresco.util.parseJSON(response.serverResponse.responseText);
			    	   if (responseJSON.result == "success") {
			    		   var successMessage = this.msg("service.doc.to.pdf.action.msg.success");
				    	   if (nodesRef.length > 1) {
				    		   successMessage = this.msg("service.doc.to.pdf.action.msg.success.multiple");
				    	   }
			    		   Alfresco.util.PopupManager.displayMessage({
				    		   text: successMessage,
				    		   displayTime: 10
				    	   });
			    	   } else {
			    		   var errorMessage = "service.doc.to.pdf.action.msg.failure";
				    	   if (nodesRef.length > 1) {
				    		   errorMessage = "service.doc.to.pdf.action.msg.failures";
				    	   }
			    		   Alfresco.util.PopupManager.displayMessage({
				    		   text: this.msg(errorMessage, responseJSON.error),
				    		   displayTime: 10
				    	   });
			    	   }
			           // Fire metadataRefresh so other components may update themselves
			           YAHOO.Bubbling.fire("metadataRefresh", this);
			           YAHOO.Bubbling.fire("metadataRefresh");
			       },
			       scope: this
			    },
			    onFailure:
			    {
			       fn: function dlA_onActionDepotCasier_failure(response)
			       {
			    	   // Hide waiting dialog
			    	   if (this.waitDialog)
					   {
	                     this.waitDialog.destroy();
	                     this.waitDialog = null;
					   }
			    	   
			    	   var responseJSON = Alfresco.util.parseJSON(response.serverResponse.responseText);
			    	   var errorMessage = "service.doc.to.pdf.action.msg.failure";
			    	   if (nodesRef.length > 1) {
			    		   errorMessage = "service.doc.to.pdf.action.msg.failures";
			    	   }
			    	   Alfresco.util.PopupManager.displayMessage({
			    		   text: this.msg(errorMessage, responseJSON.error),
			    		   displayTime: 10
			    	   });
			           // Fire metadataRefresh so other components may update themselves
			           YAHOO.Bubbling.fire("metadataRefresh", this);
			           YAHOO.Bubbling.fire("metadataRefresh");
			       },
			       scope: this
			    },
			    doBeforeFormSubmit :
		        {
		            fn: function(form, obj)
		            {
		            	var msg = this.msg("service.doc.to.pdf.action.msg.processing.document");
		            	if (multiple) {
		            		msg = this.msg("service.doc.to.pdf.action.msg.processing.documents");
		            	}
		            	
		            	this.waitDialog = Alfresco.util.PopupManager.displayMessage({
			                text : msg,
			                spanClass : "wait",
			                displayTime : 0
			             });
		            },
		            scope: this
		         }
			 });			 
			 this.modules.convertDocToPdfModule.show();
			 */
		 }catch(e){
			console.error(e.message);
			Alfresco.util.PopupManager.displayMessage(
			{
				text: "Exception javascript:" + e.message
			});
		 }
		}	
	});
	
	/*
	https://angelborroy.wordpress.com/2016/08/10/alfresco-share-actions-adding-a-waiting-dialog-while-performing-action-in-repo/
	Alfresco Share actions: adding a waiting dialog while performing action in repo
	agosto 10, 2016 / angelborroy	
	
	When developing new Alfresco actions in Share part, there are two out-of-the-box JavaScript YUI functions to interact with the user:
	
	    onActionSimpleRepoAction, which invokes a repo action and shows a success or failure message when this action has finished
	    onActionFormDialog, which shows a form to the user to recover data fields and shows a success or failure message when this actions has finished
	
	These implementations does not include a waiting message between user click and repo response. In some scenarios, the use of this components will produce weird effects on user experience, as the screen is doing “nothing” during some seconds.
	
	Below you can find an alternative implementation for these functions which includes that waiting message.
	 */
	/*
    YAHOO.Bubbling.fire("registerAction", {
        actionName : "onActionWaitingSimpleRepoAction",
        fn: function onActionWaitingSimpleRepoAction(record, owner) {
             
            this.widgets.waitDialog = Alfresco.util.PopupManager.displayMessage({
                text : this.msg("action.waiting.message"),
                spanClass : "wait",
                displayTime : 0
            });
             
            // Get action params
             var params = this.getAction(record, owner).params,
                displayName = record.displayName,
                namedParams = ["function", "action", "success", "successMessage", "failure", "failureMessage"],
                repoActionParams = {};
 
             for (var name in params)
             {
                if (params.hasOwnProperty(name) && !Alfresco.util.arrayContains(namedParams, name))
                {
                   repoActionParams[name] = params[name];
                }
             }
 
             // Deactivate action
             var ownerTitle = owner.title;
             owner.title = owner.title + "_deactivated";
 
             // Prepare genericAction config
             var config =
             {
                success:
                {
                   event:
                   {
                      name: "metadataRefresh",
                      obj: record
                   }
                },
                failure:
                {
                   message: this.msg(params.failureMessage, displayName),
                   fn: function showAction()
                   {
                      owner.title = ownerTitle;
                   },
                   scope: this
                },
                webscript:
                {
                   method: Alfresco.util.Ajax.POST,
                   stem: Alfresco.constants.PROXY_URI + "api/",
                   name: "actionQueue"
                },
                config:
                {
                   requestContentType: Alfresco.util.Ajax.JSON,
                   dataObj:
                   {
                      actionedUponNode: record.nodeRef,
                      actionDefinitionName: params.action,
                      parameterValues: repoActionParams
                   }
                }
             };
 
             // Add configured success callbacks and messages if provided
             if (YAHOO.lang.isFunction(this[params.success]))
             {
                config.success.callback =
                {
                   fn: this[params.success],
                   obj: record,
                   scope: this
                };
             }
             if (params.successMessage)
             {
                config.success.message = this.msg(params.successMessage, displayName);
             }
 
             // Acd configured failure callback and message if provided
             if (YAHOO.lang.isFunction(this[params.failure]))
             {
                config.failure.callback =
                {
                   fn: this[params.failure],
                   obj: record,
                   scope: this
                };
             }
             if (params.failureMessage)
             {
                config.failure.message = this.msg(params.failureMessage, displayName);
             }
 
             // Execute the repo action
             this.modules.actions.genericAction(config);
             
          }     
    });    
	*/
	/*
    YAHOO.Bubbling.fire("registerAction",
    {
        actionName: "onActionWaitingFormDialog",
        fn: function dlA_onActionWaitingFormDialog(record, owner)
        {
               // Get action & params and start create the config for displayForm
               var action = this.getAction(record, owner),
                  params = action.params,
                  config =
                  {
                     title: this.msg(action.label)
                  },
                  displayName = record.displayName;
 
               // Make sure we don't pass the function as a form parameter
               delete params["function"];
 
               // Add configured success callback
               var success = params["success"];
               delete params["success"];
               var failureMessage = params["failureMessage"];
               delete params["failureMessage"];
               config.success =
               {
                  fn: function(response, obj)
                  {
                     // Invoke callback if configured and available
                     if (YAHOO.lang.isFunction(this[success]))
                     {
                       if (response != null && response.json != null
                               && response.json.status != null
                               && response.json.status.code != null
                               && response.json.status.code == "500"){
                           this[success].call(this, response, obj);
                           // Add configure failure message
                           if (failureMessage != null) {
                               this.msg(failureMessage, displayName);
                           }
                       }
                     }
 
                     // Fire metadataRefresh so other components may update themselves
                     YAHOO.Bubbling.fire("metadataRefresh", obj);
                  },
                  obj: record,
                  scope: this
               };
 
               // Add configured failure
               var success = params["failure"];
               delete params["failure"];
               nodeRef = record.nodeRef;
                
               // Add configure success message
               if (params.successMessage) {
                  config.successMessage = this.msg(params.successMessage, displayName);
                  delete params["successMessage"];
               }
 
               // Use the remaining properties as form properties
               config.properties = params;
                
               // Finally display form as dialog
               Alfresco.util.PopupManager.displayForm(config);
                
               // Waiting dialog
               waitDialog = Alfresco.util.PopupManager.displayMessage({
                    text : this.msg("action.waiting.message"),
                    spanClass : "wait",
                    displayTime : 0
               });
                
               YAHOO.Bubbling.on("beforeFormRuntimeInit", function PopupManager_displayForm_onBeforeFormRuntimeInit(layer, args)
               {
                    
                   // Clear wait dialog on close button click
                   var panel = document.getElementById(config.properties.htmlid + "-panel");
                   var closeButton = panel.getElementsByClassName("container-close")[0];
                   if (closeButton) {
                       closeButton.addEventListener("click", function(){
                          waitDialog.destroy();
                       });
                   }
                    
                   // Clear wait dialog on cancel button click
                   var cancelButton = document.getElementById(config.properties.htmlid + "-form-cancel-button");
                   if (cancelButton) {
                      cancelButton.addEventListener("click", function(){
                          waitDialog.destroy();
                      });
                       
                   }
               },
               {
                  config: config
               });
                
            }
 
    });
	*/
})();