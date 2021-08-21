sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'tcs/hr/hire/util/formatter'
], function(Controller, Formatter) {
    'use strict';
    return Controller.extend("tcs.hr.hire.controller.BaseController",{
        formatter: Formatter,
        onInit: function(){
            console.log("Dude i am in Base Controller --> Base.controller.js");
        }
    });
});