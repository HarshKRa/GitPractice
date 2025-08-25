sap.ui.define([], function () {
    "use strict";
    return {
        cardClass: function (bCompleted) {
            console.log("Formatter called with:", bCompleted);
            return bCompleted ? "card-style" : "card-style1";
        }
    };
});