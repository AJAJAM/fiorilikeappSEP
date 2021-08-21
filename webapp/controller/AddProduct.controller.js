sap.ui.define([
    'tcs/hr/hire/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
], function(BaseController, JSONModel, MessageBox, MessageToast, Fragment) {
    'use strict';
    return BaseController.extend("tcs.hr.hire.controller.AddProduct",{
        onInit: function () {
            this.localModel = new JSONModel();
            this.localModel.setData({
                "productData": {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "Notebook Basic 15",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000046",
                    "SUPPLIER_NAME" : "SAP",
                    "TAX_TARIF_CODE" : 1,
                    "PRICE" : "",
                    "CURRENCY_CODE" : "",
                    "DIM_UNIT" : "CM",
                    "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/AG-1010.jpg"
                }
            });
            this.getView().setModel(this.localModel, "localModel");
        },
        supplierPopup:null,
        onValHelp:function(params){
             if(!this.supplierPopup){
                Fragment.load({
                    id: "supplier",
                    name: "tcs.hr.hire.fragments.popup",
                    controller: this
                }).then(function(oSuperman){
                    this.supplierPopup = oSuperman;
                    this.supplierPopup.setTitle("Select Supplier to Filter");
                    this.supplierPopup.setMultiSelect(false);
                    this.supplierPopup.bindAggregation("items",{
                        path : "/BusinessPartnerSet",
                        template: new sap.m.StandardListItem({
                            icon: "sap-icon://supplier",
                            description : "{COMPANY_NAME} From {COUNTRY}",
                            title : "{BP_ID}"
                        })
                    });
                    this.getView().addDependent(this.supplierPopup);
                    this.supplierPopup.open();
                }.bind(this));
            }else{
                this.supplierPopup.open();
            }
        },
        mode:"Create",
        onSubmit:function(oEvent){
           var sValue = oEvent.getSource().getValue();
           var oDataModel = this.getView().getModel();
           var that = this;
           oDataModel.read("/ProductSet('" + sValue +"')",{
               success:function(record){
                   that.localModel.setProperty("/productData", record);
                   that.mode = "Update";
                   that.getView().byId("idSave").setText("Update");
                   that.getView().byId("idDel").setEnabled(true);
               }
           })
        },
        onExpensive:function(){
           var oDataModel = this.getView().getModel();
           var that = this;
           oDataModel.callFunction("/GetMostExpensiveProduct",{
               urlParameters: {
                   "I_CATEGORY":"Notebooks"
               },
               success:function(record){
                that.localModel.setProperty("/productData",record);
               }
           })
        },
        onConfirm: function(oEvent){
            //Step 1: get the selected item based on confirm event
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if(oEvent.getSource().getId().indexOf("supplier") !== -1){
                var supplierName = oSelectedItem.getTitle();
            this.getView().getModel("localModel").setProperty("/productData/SUPPLIER_ID", supplierName)
            }   
        },
        onClear:function(params){
            this.mode = "Create";
            this.getView().byId("idSave").setText("Create");
            this.getView().byId("idDel").setEnabled(false);
            this.getView().getModel("localModel").setProperty("/",{
                "productData": {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "Notebook Basic 15",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000046",
                    "SUPPLIER_NAME" : "SAP",
                    "TAX_TARIF_CODE" : 1,
                    "PRICE" : "",
                    "CURRENCY_CODE" : "USD",
                    "DIM_UNIT" : "CM",
                    "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/AG-1010.jpg"
                }
            })
        },
        onDel:function(){
            var productId = this.localModel.getProperty("/productData/PRODUCT_ID");
            var that = this;
            var oDataModel = this.getView().getModel();
            oDataModel.remove("/ProductSet('" + productId + "')",{
                success:function(record){
                    MessageBox.show("The record is deleted");
                    that.onClear();
                }
            })
        },
        onSave: function(){
            //Step 1: Read data from model <-- screen
            var payload = this.localModel.getProperty("/productData");
            //Step 2: Get the odata model object - default model
            var oDataModel = this.getView().getModel();
            // payload.PRICE = parseInt(payload.PRICE);
            // payload.CURRENCY_CODE = 
            //Step 3: Fire Post Call
            if(this.mode === "Create"){
               oDataModel.create("/ProductSet", payload, {
                //Step 4: Handle callback
                success: function(data){
                    MessageToast.show("The Product was Created Successfully, Amigo!");
                },
                error: function(oErr){
                    MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                }
            });
            }
            else{
                oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')", payload,{
                    success:function(record){
                       MessageToast.show("The product is succesfully updated")
                    }
                })
            }
            
        }
    });
});