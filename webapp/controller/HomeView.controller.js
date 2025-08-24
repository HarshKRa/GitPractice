sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("productdetails.controller.HomeView", {
        onInit() {

            var oModel = this.getOwnerComponent().getModel("product");
            this.__deriveDropDownData(oModel.getData().Products);

            this._openStoreDeptDialog();

        },
        __deriveDropDownData: function (aProducts) {
            var stores = [...new Set(aProducts.map(p => p.store))];
            var depts = [... new Set(aProducts.map(p => p.department))];

            this.getView().setModel(new sap.ui.model.json.JSONModel({ stores: stores, departments: depts }), "dropdowns");
        },

        onOpenStoreDeptDialog : function(){
            this._openStoreDeptDialog();
        },

        _openStoreDeptDialog: function () {
            // Check if dialog already exists
            if (!this._oDialog) {
                // Load dialog fragment
                this._oDialog = sap.ui.xmlfragment(
                    "productdetails.view.StoreDeptDialog", // path to your fragment
                    this // controller reference
                );
                // Make dialog a dependent of the view to ensure proper lifecycle
                this.getView().addDependent(this._oDialog);
            }

            // Open the dialog
            this._oDialog.open();
        },
        onDialogCancel: function () {
            this._oDialog.close();
        },

        onDialogOk: function () {
            var oView = this.getView();

            // Get selected store and department
            var store = sap.ui.getCore().byId("storeSelect").getSelectedItem().getText();
            var dept = sap.ui.getCore().byId("deptSelect").getSelectedItem().getText();

            // Get all products from manifest.json model
            var allProducts = this.getOwnerComponent().getModel("product").getData().products;

            // Filter based on selection
            var filtered = allProducts.filter(p => p.store === store && p.department === dept);

            // Set filtered data to a new model for binding
            oView.setModel(new sap.ui.model.json.JSONModel({ products: filtered }), "filteredProducts");

            this._oDialog.close();
        },
        onAfterRendering: function () {
            var oFlexBox = this.byId("productFlexBox");   // FlexBox, not VBox
            var aItems = oFlexBox.getItems();             // All VBox items

            aItems.forEach(oVBox => {
                var aCustomData = oVBox.getCustomData();
                var oClassData = aCustomData.find(c => c.getKey() === "class");

                if (oClassData) {
                    var sClass = oClassData.getValue();

                    // Remove both to avoid duplicates
                    oVBox.removeStyleClass("card-style");
                    oVBox.removeStyleClass("card-style1");

                    // Add the bound one
                    oVBox.addStyleClass(sClass);
                }
            });
        },

        onSubmit: function () {
            sap.m.MessageToast.show("Submit pressed!");
        },

        onNavBack: function () {
            history.go(-1);
        }
    });
});
