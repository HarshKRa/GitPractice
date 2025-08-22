/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["productdetails/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
