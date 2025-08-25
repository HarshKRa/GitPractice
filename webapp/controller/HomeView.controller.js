sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "productdetails/util/formatter"
], (Controller, JSONModel, Fragment, formatter) => {
    "use strict";

    return Controller.extend("productdetails.controller.HomeView", {
        formatter: formatter,
        onInit() {

            this._store = null;
            this._dept = null;
            this._section = null;
            this._filtered = [];

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

        _deriveSectiondata: function (aProducts) {
            var sections = [... new Set(aProducts.map(p => p.section))];
            if(sections.length != 0){
                this._section = sections[0];
            }
            this.getView().setModel(new JSONModel({ sections: sections }), "sectionData");
        },

        onDialogOk: function () {
            var store = sap.ui.getCore().byId(this.getView().getId() + "--storeSelect").getSelectedItem().getText();
            var dept = sap.ui.getCore().byId(this.getView().getId() + "--deptSelect").getSelectedItem().getText();

            var allProducts = this.getOwnerComponent().getModel("product").getData().Products;
            this._filtered = allProducts.filter(p => p.store === store && p.department === dept);

            this._deriveSectiondata(this._filtered);
            this._filteredProduct(this._section,this._filtered);
            this._oDialog.close();

            // Render nested fragment with filtered data
            this._showNestedFragment();
        },
        _filteredProduct(sec,arr){
            var filtered = arr.filter(p => p.section === sec);
            this.getView().setModel(new JSONModel({ products: filtered }), "filteredProducts");
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

                    // 🔑 Add delegate so this logic runs after every render
                    var oFlexBox = this.byId("productFlexBox");
                    oFlexBox.addDelegate({
                        onAfterRendering: () => {
                            var aItems = oFlexBox.getItems();
                            aItems.forEach(oVBox => {
                                var oCompletedData = oVBox.getCustomData().find(c => c.getKey() === "completed");
                                if (oCompletedData) {
                                    var bCompleted = oCompletedData.getValue();
                                    var sClass = this.formatter.cardClass(bCompleted);

                                    oVBox.removeStyleClass("card-style card-style1");
                                    oVBox.addStyleClass(sClass);
                                }
                            });
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
        },
        onSectionPress(oEvent) {
            // Get the button control that was pressed
            var oButton = oEvent.getSource();

            // Get the text of that button
            var sText = oButton.getText();

            this._filteredProduct(sText,this._filtered);
        }

    });
});
