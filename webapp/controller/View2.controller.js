sap.ui.define([
    'tcs/hr/hire/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(BaseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("tcs.hr.hire.controller.View2",{
        onInit: function(){
            //step 1: need router
            this.oRouter = this.getOwnerComponent().getRouter();
            //Step 2: everytime route changes, call event handler
            this.oRouter.getRoute("detail").attachMatched(this.herculis.bind(this));
        },
        cityPopup: null,
        supplierPopup: null,
        fieldObject: null,
        onF4: function(oEvent){
            this.fieldObject = oEvent.getSource();
            if(!this.cityPopup){
                //Fragment is a UI5 dependency and then is a promise
                //like in ABAP in PBO we check lo_alv is NOT BOUND
                Fragment.load({
                    id:"city",
                    name: "tcs.hr.hire.fragments.popup",
                    controller: this
                }).then(function(oSpiderman){
                    this.cityPopup = oSpiderman;
                    this.cityPopup.bindAggregation("items",{
                        path: '/cities',
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{state}"
                        })
                    });
                    this.cityPopup.setTitle("Cities");
                    //allowing explicit access to resources which view can access
                    //just like immune system allow access to parasite which
                    //the body part can access
                    this.getView().addDependent(this.cityPopup);
                    this.cityPopup.open();
                }.bind(this));
            }else{
                this.cityPopup.open();
            }
        },
        onFilter: function(){

            if(!this.supplierPopup){
                Fragment.load({
                    id: "supplier",
                    name: "tcs.hr.hire.fragments.popup",
                    controller: this
                }).then(function(oSuperman){
                    this.supplierPopup = oSuperman;
                    this.supplierPopup.setTitle("Select Supplier to Filter");
                    this.supplierPopup.bindAggregation("items",{
                        path : "/supplier",
                        template: new sap.m.StandardListItem({
                            icon: "sap-icon://supplier",
                            description : "Since {sinceWhen} in {city}",
                            title : "{name}"
                        })
                    });
                    this.getView().addDependent(this.supplierPopup);
                    this.supplierPopup.open();
                }.bind(this));
            }else{
                this.supplierPopup.open();
            }

            //MessageBox.confirm("this functionality is under construction");
        },
        onConfirm: function(oEvent){
            //Step 1: get the selected item based on confirm event
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if(oEvent.getSource().getId().indexOf("supplier") !== -1){
                var supplierName = oSelectedItem.getTitle();
                var oFilter = new Filter("name", FilterOperator.EQ, supplierName);
                //this.supplierPopup.getBinding("items").filter(oFilter);
                var oTable = this.getView().byId("mobileTable");
                oTable.getBinding("items").filter(oFilter);
            }else{
                //step 2: extract the value of city for the selected item DisplayListItem
                var selectedCity = oSelectedItem.getLabel();
                //step 3: set the value to the input field in table on which F4 was pressed
                //the object of field was taken already when we pressed F4
                this.fieldObject.setValue(selectedCity);
            }
            
        },
        onSave: function(){
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var XMSG_CONFIRM = oResourceBundle.getText("XMSG_CONFIRM");
            var fruitName = this.getView().getModel().getProperty(this.path).name;
            var XMSG_SAVED = oResourceBundle.getText("XMSG_SAVED",[fruitName]);
            var XMSG_CANCEL = oResourceBundle.getText("XMSG_CANCEL");
            MessageBox.confirm(XMSG_CONFIRM,{
                onClose: function(status){
                    if(status === "OK"){
                        MessageToast.show(XMSG_SAVED);
                    }else{
                        MessageBox.error(XMSG_CANCEL);
                    }
                }
            });
        },
        onCancel: function(){
            MessageBox.error(XMSG_CANCEL);
        },
        herculis: function(oEvent){
            debugger;
            //Step 1: Read the value of variable which contains fruit id sent fron first view
            var sFruitId = oEvent.getParameter("arguments").contra;
            //Step 2: Build the path
            var sPath = "/" + sFruitId;
            var sImgPath = sPath + "/$value";
            sImgPath = sImgPath.replace("ProductSet","ProductImgSet");
            this.getView().byId("idImage").setSrc("/sap/opu/odata/sap/ZJULY_2021_SRV" + sImgPath);
            this.path = sPath;
            //Step 3: Bind the element to set the data on V2
            this.getView().bindElement(sPath,{expand:"To_Supplier"});
        },
        onBack: function(){
            this.getView().getParent().getParent().to("idEmpty");
        }
    });
});