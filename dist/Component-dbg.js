sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("tcs.hr.hire.Component",{
        metadata: {
            manifest: "json"
        },
        init: function(){
            //this is a constructor, here i want to call base class constructor
            //super->constructor()
            //this is calling base class constructor - To initialize base class variables
            UIComponent.prototype.init.apply(this);
            //Get the Router Object
            var oRouter = this.getRouter();
            //Which will go and READ the Routing Configuration
            oRouter.initialize();

        },
        // createContent: function(){
        //     //creating Root View of our project
        //     var oView = new sap.ui.view({
        //         viewName: "tcs.hr.hire.view.App",
        //         id: "idAppView",
        //         type: "XML"
        //     });

        //     //Create child views - Individual view objects
        //     var oView1 = new sap.ui.view({
        //         viewName: "tcs.hr.hire.view.View1",
        //         id: "idV1",
        //         type: "XML"
        //     });
        //     var oView2 = new sap.ui.view({
        //         viewName: "tcs.hr.hire.view.View2",
        //         id: "idV2",
        //         type: "XML"
        //     });
        //     var oEmpty = new sap.ui.view({
        //         viewName: "tcs.hr.hire.view.Empty",
        //         id: "idEmpty",
        //         type: "XML"
        //     });

        //     //Get The App Container Object -- mumma of both child views
        //     var oAppCon = oView.byId("idAppCon");

        //     //add all child views inside the container
        //     oAppCon.addMasterPage(oView1).addDetailPage(oEmpty).addDetailPage(oView2);

        //     return oView;
        // },
        destroy: function(){

        }
    });
});