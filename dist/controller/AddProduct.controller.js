sap.ui.define(["tcs/hr/hire/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageBox","sap/m/MessageToast","sap/ui/core/Fragment"],function(e,t,o,s,i){"use strict";return e.extend("tcs.hr.hire.controller.AddProduct",{onInit:function(){this.localModel=new t;this.localModel.setData({productData:{PRODUCT_ID:"",TYPE_CODE:"PR",CATEGORY:"Notebooks",NAME:"Notebook Basic 15",DESCRIPTION:"",SUPPLIER_ID:"0100000046",SUPPLIER_NAME:"SAP",TAX_TARIF_CODE:1,PRICE:"",CURRENCY_CODE:"",DIM_UNIT:"CM",PRODUCT_PIC_URL:"/sap/public/bc/NWDEMO_MODEL/IMAGES/AG-1010.jpg"}});this.getView().setModel(this.localModel,"localModel")},supplierPopup:null,onValHelp:function(e){if(!this.supplierPopup){i.load({id:"supplier",name:"tcs.hr.hire.fragments.popup",controller:this}).then(function(e){this.supplierPopup=e;this.supplierPopup.setTitle("Select Supplier to Filter");this.supplierPopup.setMultiSelect(false);this.supplierPopup.bindAggregation("items",{path:"/BusinessPartnerSet",template:new sap.m.StandardListItem({icon:"sap-icon://supplier",description:"{COMPANY_NAME} From {COUNTRY}",title:"{BP_ID}"})});this.getView().addDependent(this.supplierPopup);this.supplierPopup.open()}.bind(this))}else{this.supplierPopup.open()}},mode:"Create",onSubmit:function(e){var t=e.getSource().getValue();var o=this.getView().getModel();var s=this;o.read("/ProductSet('"+t+"')",{success:function(e){s.localModel.setProperty("/productData",e);s.mode="Update";s.getView().byId("idSave").setText("Update");s.getView().byId("idDel").setEnabled(true)}})},onExpensive:function(){var e=this.getView().getModel();var t=this;e.callFunction("/GetMostExpensiveProduct",{urlParameters:{I_CATEGORY:"Notebooks"},success:function(e){t.localModel.setProperty("/productData",e)}})},onConfirm:function(e){var t=e.getParameter("selectedItem");if(e.getSource().getId().indexOf("supplier")!==-1){var o=t.getTitle();this.getView().getModel("localModel").setProperty("/productData/SUPPLIER_ID",o)}},onClear:function(e){this.mode="Create";this.getView().byId("idSave").setText("Create");this.getView().byId("idDel").setEnabled(false);this.getView().getModel("localModel").setProperty("/",{productData:{PRODUCT_ID:"",TYPE_CODE:"PR",CATEGORY:"Notebooks",NAME:"Notebook Basic 15",DESCRIPTION:"",SUPPLIER_ID:"0100000046",SUPPLIER_NAME:"SAP",TAX_TARIF_CODE:1,PRICE:"",CURRENCY_CODE:"USD",DIM_UNIT:"CM",PRODUCT_PIC_URL:"/sap/public/bc/NWDEMO_MODEL/IMAGES/AG-1010.jpg"}})},onDel:function(){var e=this.localModel.getProperty("/productData/PRODUCT_ID");var t=this;var s=this.getView().getModel();s.remove("/ProductSet('"+e+"')",{success:function(e){o.show("The record is deleted");t.onClear()}})},onSave:function(){var e=this.localModel.getProperty("/productData");var t=this.getView().getModel();if(this.mode==="Create"){t.create("/ProductSet",e,{success:function(e){s.show("The Product was Created Successfully, Amigo!")},error:function(e){o.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message)}})}else{t.update("/ProductSet('"+e.PRODUCT_ID+"')",e,{success:function(e){s.show("The product is succesfully updated")}})}}})});