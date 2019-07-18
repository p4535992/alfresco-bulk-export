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
	 * Bulk Export Action
	 *
	 * @method onActionBulkExport
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
			 var ignoreExported = true;
			 var exportVersions = true;
			 var revisionHead = true;
			 var useNodeCache = true;
			 var cancel = true;
			 
			 // /extensions/bulkexport/export?nodeRef={NodeRef}&amp;base={base}&amp;ignoreExported={ignoreExported?}&amp;exportVersions={exportVersions}&amp;revisionHead={revisionHead}&amp;useNodeCache={useNodeCache}&amp;cancel={cancel}
		     var actionUrl = YAHOO.lang.substitute(
		    		 	encodeURIComponent(
		    				 Alfresco.constants.PROXY_URI +"/extensions/bulkexport/export?" +
		    		 			"nodeRef={NodeRef}&" +
		    		 			"base={base}&" +
		    		 			"ignoreExported={ignoreExported}&" +
		    		 			"exportVersions={exportVersions}&" +
		    		 			"revisionHead={revisionHead}&" +
		    		 			"useNodeCache={useNodeCache}&" +
		    		 			"cancel={cancel}"
		    		 	),
	                {
		    		 	nodeRef: encodeURIComponent(nodesRef || ""),
		    		 	base : encodeURIComponent(""),
		    		 	ignoreExported: encodeURIComponent(ignoreExported || true),
		    		 	exportVersions: encodeURIComponent(exportVersions || true)
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
})();