sap.ui.define([
    'tcs/hr/hire/controller/BaseController'
], function(BaseController) {
    'use strict';
    return BaseController.extend("tcs.hr.hire.controller.App",{
        onInit: function(){
            console.log("Dude i am in child Controller --> App.controller.js");
            BaseController.prototype.onInit.apply(this);
        }
    });
});