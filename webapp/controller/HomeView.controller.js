sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], (Controller, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("productdetails.controller.HomeView", {

        onInit() {
            var oModel = this.getOwnerComponent().getModel("product");
            this.__deriveDropDownData(oModel.getData().Products);

            // Open filter dialog on app start
            this._openStoreDeptDialog();
        },

        __deriveDropDownData: function (aProducts) {
            var stores = [...new Set(aProducts.map(p => p.store))];
            var depts = [... new Set(aProducts.map(p => p.department))];

            this.getView().setModel(new JSONModel({ stores: stores, departments: depts }), "dropdowns");
        },

        onOpenStoreDeptDialog: function () {
            this._openStoreDeptDialog();
        },

        _openStoreDeptDialog: function () {
            if (!this._oDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "productdetails.view.StoreDeptDialog",
                    controller: this
                }).then(oDialog => {
                    this.getView().addDependent(oDialog);
                    this._oDialog = oDialog;
                    this._oDialog.open();
                });
            } else {
                this._oDialog.open();
            }
        },

        onDialogOk: function () {
            var store = sap.ui.getCore().byId(this.getView().getId() + "--storeSelect").getSelectedItem().getText();
            var dept = sap.ui.getCore().byId(this.getView().getId() + "--deptSelect").getSelectedItem().getText();

            var allProducts = this.getOwnerComponent().getModel("product").getData().Products;
            var filtered = allProducts.filter(p => p.store === store && p.department === dept);

            this.getView().setModel(new JSONModel({ products: filtered }), "filteredProducts");

            this._oDialog.close();

            // Render nested fragment with filtered data
            this._showNestedFragment();
        },

        _showNestedFragment: function () {
            var oContainer = this.byId("nestedCardContainer");

            if (!this._oNestedFragment) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "productdetails.view.NestedView",
                    controller: this
                }).then(oFragment => {
                    this._oNestedFragment = oFragment;
                    oContainer.addItem(oFragment);

                    // Apply card color dynamically
                    var aItems = oFragment.getItems();
                    aItems.forEach(oVBox => {
                        var aCustomData = oVBox.getCustomData();
                        var oClassData = aCustomData.find(c => c.getKey() === "class");
                        if (oClassData) {
                            var sClass = oClassData.getValue();
                            oVBox.removeStyleClass("card-style card-style1");
                            oVBox.addStyleClass(sClass);
                        }
                    });
                });
            }
        },

        onDialogCancel: function () {
            this._oDialog.close();
        },

        onSubmit: function () {
            sap.m.MessageToast.show("Submit pressed!");
        }

    });
});
