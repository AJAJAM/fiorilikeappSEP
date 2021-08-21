sap.ui.define([
    'tcs/hr/hire/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment'
], function(BaseController, MessageBox, MessageToast, FilterOperator, Filter, JSONModel, Fragment) {
    'use strict';
    return BaseController.extend("tcs.hr.hire.controller.View1",{
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            var prodData = {
                "singleRecord": {}
            };
            this.localModel = new JSONModel();
            this.localModel.setData(prodData);
            this.getView().setModel(this.localModel, "localModel");
        },
        onDelete2: function(oEvent){
            //Since the delete event belongs to the List Control
            //we get the object of our List control directly from oEvent.getSource()
            var oList = oEvent.getSource();
            //Read parameter of the event object which have the details of
            //the item which was selected
            var oSelectedItem = oEvent.getParameter("listItem");
            //Delete the item from the list Control
            oList.removeItem(oSelectedItem);
        },
        onDelete: function(){
            //Step 1: I need my list Control object
            var oList = this.getView().byId("idList");
            //Step 2: Read all selected items
            var aSelectedItems = oList.getSelectedItems();
            ////-----Technique No . 1

            // //Step 4: Read Data from JSON Model
            // var aData = this.getView().getModel().getProperty("/fruits");
            // //Step 3: Loop over them
            // var aItems = [];
            // debugger;
            // for (let i = 0; i < aSelectedItems.length; i++) {
            //     const element = aSelectedItems[i];
            //     var sPath = element.getBindingContext().getPath();
            //     var index = sPath.split("/")[sPath.split("/").length -1];
            //     //Step 5: Delete each item from the data
            //     aItems.push(parseInt(index));
            // }

            // aItems.sort((a, b) => (a > b ? -1 : 1)) ;

            // for (let j = 0; j < aItems.length; j++) {
            //     aData.splice(aItems[j],1);               
            // }
            
            // //Step 6: Set Data back on screen
            // this.getView().getModel().setProperty("/fruits", aData);

            ////-----Technique No . 2
            for (let i = 0; i < aSelectedItems.length; i++) {
                const element = aSelectedItems[i];
                oList.removeItem(element);
            }


        },
        detailPopup: null,
        showPopup: function(){
            if(!this.detailPopup){
                //Fragment is a UI5 dependency and then is a promise
                //like in ABAP in PBO we check lo_alv is NOT BOUND
                Fragment.load({
                    id:"prodDetails",
                    name: "tcs.hr.hire.fragments.showDetails",
                    controller: this
                }).then(function(oSpiderman){
                    this.detailPopup = oSpiderman;
                    this.detailPopup.bindElement("/singleRecord");
                    this.detailPopup.setTitle("Product Details");
                    this.detailPopup.setModel(this.getView().getModel("localModel"));
                    //allowing explicit access to resources which view can access
                    //just like immune system allow access to parasite which
                    //the body part can access
                    this.getView().addDependent(this.detailPopup);
                    this.detailPopup.open();
                }.bind(this));
            }else{
                this.detailPopup.open();
            }
        },
        onAdd: function(){
            this.oRouter.navTo("add");
        },
        onClose: function (params) {
            this.detailPopup.close();
        },
        onSearch: function(oEvent){
            //Read from screen what user entered on UI in search field
            var sQuery = oEvent.getParameter("query");
            //Create a filter object
            if(sQuery.indexOf("-") != -1){

                //get odata model object which is default
                var oDataModel = this.getView().getModel();
                var that = this;
                //fire a read call
                oDataModel.read("/ProductSet('" + sQuery  +"')",{
                    success: function(data){
                        //handle the call back
                        console.log(data);
                        that.localModel.setProperty("/singleRecord", data);
                        that.showPopup();
                    },
                    error: function (oError) {
                        //error handling of backend messages
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                });
                

            }else{
                var oFilter1 = new Filter("CATEGORY",FilterOperator.Contains, sQuery);
                //var oFilter2 = new Filter("taste", FilterOperator.Contains, sQuery);
                // var oFilter = new Filter({
                //     filters: [oFilter1, oFilter2],
                //     and: false
                // });
                //Inject the filter object inside items aggregation
                this.getView().byId("idList").getBinding("items").filter(oFilter1);
            }
            
        },
        onItemSelection: function(oEvent){

            //Step 1: Get the address of the MEMEORY/ELEMENT of SELECTED ITEM
            var oSelectedItem = oEvent.getParameter("listItem");
            var sPath = oSelectedItem.getBindingContext().getPath();
            console.log(sPath);
            console.log(this.getView().getModel().getProperty(sPath));

            ////fruits/5 == [fruits,5] == last item = 5
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];

            //Step 2: Get Second view object and then bind this element
            // var oAppCon = this.getView().getParent().getParent();
            // var oV2 = oAppCon.getDetailPage("idV2");
            // oV2.bindElement(sPath);

            //Navigate
            this.onNext(sIndex);
        },
        getStatus: function(inp){
            var statuses = this.getView().getModel().getProperty("/status");
            for (let i = 0; i < statuses.length; i++) {
                const element = statuses[i];
                if(element.key === inp){
                    return element.value;
                }
            }
            // statuses.forEach(element => {
            //     if(element.key === inp){
            //         return element.value;
            //     }
            // });
        },
        onNext: function(sIndex){
            //This view does not know the View2
            //But its parent know, so we first get the parent object
            //From the view we go to --> Master Section --> Split App Container
            //var oAppCon = this.getView().getParent().getParent();
            //Step 2: From the parent we can now navigate to View 2
            //View 2 is in detail section and we want our Empty view to replaced by V2
            //oAppCon.toDetail("idV2");

            //Pass the selected fruit Path index to the pattern/rooute/end point/hash
            this.oRouter.navTo("detail",{
                contra: sIndex
            });
        },
        onOrder: function(){
            MessageBox.confirm("Do you want to proceed?",{
                //Here we are explicitly passing controller object to the event handler
                //so UI5 can set this pointer as controller object
                onClose: this.onConfirmation.bind(this)
            });
            //alert("your order has been placed successfully");
        },
        onConfirmation: function(response){
            if(response === "OK"){
                //here this pointer will not point to controller object by default
                this.getView().setBusy(true);
                var that = this;
                setTimeout(function(){
                    MessageToast.show("your order has been placed successfully");
                    //this is called inside an asynchronous function, this is not into the scope
                    // to make it in scope, we will use a local variable which hold this object
                    that.getView().setBusy(false);
                }, 5000);
            }else{
                MessageBox.error("Dude! you cancelled it!");
            }
        }
    });
});