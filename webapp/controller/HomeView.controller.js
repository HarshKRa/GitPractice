sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("productdetails.controller.HomeView", {
        onInit() {
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
