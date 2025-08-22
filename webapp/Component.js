sap.ui.define([
    "sap/ui/core/UIComponent",
    "productdetails/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("productdetails.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

             sap.ui.require(["sap/ui/dom/includeStylesheet"], function (includeStylesheet) {
                includeStylesheet(sap.ui.require.toUrl("productdetails/css/style.css"));
            });
        }
    });
});