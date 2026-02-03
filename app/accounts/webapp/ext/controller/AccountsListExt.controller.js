sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
	'sap/ui/core/Fragment',
	'sap/m/MessageToast'
], function (ControllerExtension, Fragment, MessageToast) {
	'use strict';

	return ControllerExtension.extend('com.mbec.ledgerpoc.accounts.ext.controller.AccountsListExt', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf com.mbec.ledgerpoc.accounts.ext.controller.AccountsListExt
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			}
		},

		UploadBalances: function() {
			console.log("Upload Balances Invoked");
			this.fileContent = ""; 
			this._onBalancesOpenUploadDialog();
		},

		handleBalancesTypeMissmatch: function(oEvent) {
			this._handleFileTypeMismatch(oEvent);
		},

		handleBalancesValueChange: function(oEvent) {
			this._handleFileValueChange(oEvent);
		},

		onCompanyInputChange: function(oEvent){
			var oCompany = oEvent.getSource();
			var sCompany = oCompany.getValue();
			if(!sCompany){
				oCompany.setValueState("Error");
        		oCompany.setValueStateText("Please enter Company to continue");
			}else{
				oCompany.setValueState("None");
				oCompany.setValueStateText("");
			}
		},

        onBalancesUpload: function () {
			var aMessages = [];
            var oFileUploader = this.getView().byId("loadBalanceFileUploader");
            if (!oFileUploader.getValue()) {
				oFileUploader.setValueState("Error");
        		oFileUploader.setValueStateText("Please select a file to continue");
				aMessages.push("Choose a file first")
            }else{
				oFileUploader.setValueState("None");
				oFileUploader.setValueStateText("");
			}
			var oCompany = this.getView().byId("loadBalanceCompanyInput");
			var sCompany = oCompany.getValue();
			if(!sCompany){
				oCompany.setValueState("Error");
        		oCompany.setValueStateText("Please enter Company to continue");
				aMessages.push("Please enter a Company");
			}else{
				oCompany.setValueState("None");
				oCompany.setValueStateText("");
			}
			if(!oFileUploader.getValue() || !sCompany){
				MessageToast.show(aMessages.join(" and "))
				return;
			}else{
				MessageToast.show("Loading of Balances started");		
				const oDialog = this._oBalancesDialog;
    			oDialog.setBusy(true); // Start busy indicator on dialog

				var oExtensionAPI = this.base.getExtensionAPI();
				const oModel = this.base.getView().getModel(); // Get the OData V4 model
				// Note: 'this' is the ExtensionAPI if called correctly
				oExtensionAPI.editFlow.invokeAction("LedgerService.loadBalances", {
					// CRITICAL: Pass the model for unbound actions
					model: oModel,
					skipParameterDialog: true,
					parameterValues: [
						{ name: "file", value: this.fileContent },
						{ name: "company", value: sCompany }
					]
				})
				.then(function(oResponse) {
					//sap.m.MessageToast.show("Balances loaded successfully!");
					this._oBalancesDialog.setBusy(true);
					this.onBalancesCloseDialog();
					// Optional: Refresh the table data
					oExtensionAPI.refresh(); 
				}.bind(this))
				.catch(function(oError) {
					//debugger;
					if(oError.message){
						sap.m.MessageBox.error("Action failed: " + oError.message);
					}
				})
				.finally(() => {
					oDialog.setBusy(false); // Stop busy indicator
				});
			}
        },

        onBalancesCloseDialog: function () {
			this.fileContent = "";
			var oFileUploader = this.getView().byId("loadBalanceFileUploader");
			if(oFileUploader){
				oFileUploader.setValueState("None");
				oFileUploader.setValueStateText("");
				oFileUploader.setValue("");
			}
			var oCompany = this.getView().byId("loadBalanceCompanyInput");
			if(oCompany){
				oCompany.setValueState("None");
				oCompany.setValueStateText("");
				oCompany.setValue("");
			}

            this._oBalancesDialog.close();
        },

		UploadTransactions: function() {
            MessageToast.show("Upload Transactions invoked.");
			this.fileContent = ""; 
			this._onTransactionsOpenUploadDialog();
        },

		handleTransactionsTypeMissmatch: function(oEvent) {
			this._handleFileTypeMismatch(oEvent);
		},

		handleTransactionsValueChange: function(oEvent) {
			this._handleFileValueChange(oEvent);
		},

		onTransactionsUpload: function () {
            var oFileUploader = this.getView().byId("uploadTransactionFileUploader");
            if (!oFileUploader.getValue()) {
				oFileUploader.setValueState("Error");
        		oFileUploader.setValueStateText("Please select a file to continue");
				MessageToast.show("Choose a file first");
				return;
            }else{
				oFileUploader.setValueState("None");
				oFileUploader.setValueStateText("");
				MessageToast.show("Transactions upload started");		
				const oDialog = this._oTransactionsDialog;
    			oDialog.setBusy(true); // Start busy indicator on dialog

				var oExtensionAPI = this.base.getExtensionAPI();
				const oModel = this.base.getView().getModel(); // Get the OData V4 model
				// Note: 'this' is the ExtensionAPI if called correctly
				oExtensionAPI.editFlow.invokeAction("LedgerService.processTransactions", {
					// CRITICAL: Pass the model for unbound actions
					model: oModel,
					skipParameterDialog: true,
					parameterValues: [
						{ name: "file", value: this.fileContent }
					]
				})
				.then(function(oResponse) {
					//sap.m.MessageToast.show("Balances loaded successfully!");
					this.onTransactionsCloseDialog();
					// Optional: Refresh the table data
					oExtensionAPI.refresh(); 
				}.bind(this))
				.catch(function(oError) {
					//debugger;
					if(oError.message){
						sap.m.MessageBox.error("Action failed: " + oError.message);
					}
				})
				.finally(() => {
					oDialog.setBusy(false); // Stop busy indicator
				});
			}
        },

        onTransactionsCloseDialog: function () {
			this.fileContent = "";
			var oFileUploader = this.getView().byId("uploadTransactionFileUploader");
			if(oFileUploader){
				oFileUploader.setValueState("None");
				oFileUploader.setValueStateText("");
				oFileUploader.setValue("");
			}

            this._oTransactionsDialog.close();
        },

		_onBalancesOpenUploadDialog: async function () {
            if (!this._oBalancesDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.mbec.ledgerpoc.accounts.ext.view.fragments.LoadBalances",
                    controller: this
                }).then(function (oDialog) {
                    this._oBalancesDialog = oDialog;
                    this.getView().addDependent(this._oBalancesDialog);
                    this._oBalancesDialog.open();
                }.bind(this));
            } else {
                this._oBalancesDialog.open();
            }
        },

		_onTransactionsOpenUploadDialog: async function () {
            if (!this._oTransactionsDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.mbec.ledgerpoc.accounts.ext.view.fragments.UploadTransactions",
                    controller: this
                }).then(function (oDialog) {
                    this._oTransactionsDialog = oDialog;
                    this.getView().addDependent(this._oTransactionsDialog);
                    this._oTransactionsDialog.open();
                }.bind(this));
            } else {
                this._oTransactionsDialog.open();
            }
        },
		
		_handleFileTypeMismatch: function(){
			var aFileTypes = oEvent.getSource().getFileType();
			aFileTypes.map(function(sType) {
				return "*." + sType;
			});
		
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
									" is not supported. Choose one of the following types: " +
									aFileTypes.join(", "));
		},

		_handleFileValueChange: function(oEvent) {
		    // Get the file from the event parameters
			var oFile = oEvent.getParameter("files")[0];
			var oFileUploader = oEvent.getSource();

			if (oFile) {
				oFileUploader.setValueState("None");
				oFileUploader.setValueStateText("");
				
				var oReader = new FileReader();

				// Define what happens when reading is complete
				oReader.onload = function(e) {
					// Get the standard JS string
					var sContent = e.target.result; // This is your file content
					//console.log("File Content:", sContent);		

					// Convert string to UTF-8 bytes
					const encoder = new TextEncoder(); // Default is utf-8
					const utf8ContentArray = encoder.encode(sContent);

					// Convert bytes to Base64 string
					const sContentBase64 = btoa(String.fromCharCode.apply(null, utf8ContentArray));

					//console.log("UTF-8 encoded Base64:", sContentBase64);
					this.fileContent = sContentBase64;
					// Perform logic here (e.g., parsing CSV or JSON)
				}.bind(this);

				// Start reading (choose method based on file type)
				oReader.readAsText(oFile); // For text/CSV
			};
		}
        
	});
});
