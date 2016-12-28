"strict";
var _        = require('underscore');
var Backbone = require('backbone');
var Session  = require('../services/session');
var Parse    = require('parse');
var moment   = require('moment-timezone');

Backbone.$ = $;
/*========================================*
 *      Order Model Class 
 *========================================*/
var Order = Backbone.Model.extend({
    idAttribute: 'objectId',
    sync: function(method,model,options){
        var self = this;
        var apiName;   //insertOrder updateOrder deleteOrder
        options = options || {};
        var data = options.data || {};
        var user = Session.get('user'); 
        _.extend(data,user);

        switch(method){
            case 'delete':
                apiName  = 'deleteOrder';
                var ids  = {objectIds: [model.id]};
                //apiName  = 'cancelOrder';
                //var ids  = {objectId: model.id};
                _.extend(data,ids);
                break;
            case 'create':   //insertOrder 
                if (model.isEmpty()) return;
                apiName = 'insertOrder';
                _.extend(data,model.toJSON());
                break;
            case 'update':   //updateOrder
                /*apiName = 'updateOrder'; 
                _.extend(data,model.toJSON());*/
                apiName  = 'cancelOrder';
                var ids  = {objectId: model.id};
                _.extend(data,ids);
                break;
        }

        if(data.pickupTime) data.pickupTime = new Date(data.pickupTime);
        if(data.deliveryTime) data.deliveryTime = new Date(data.deliveryTime);

        Parse.Cloud.run(apiName,data,{
            success: function(result){
                options.success.call(model,result);
            }, error: function(result){
                options.error.call(model,result);
            }
        });
    },
    /*==============================*
     * Helper function
     * result: return geoLocation by order type
     *==============================*/ 
    getLocation: function (){
        if(this.get('orderType')){   //pickup 
            return {lat:this.get('pickupLatitude'),lng:this.get('pickupLongitude')};
        }else{      //delivery
            return {lat:this.get('deliveryLatitude'),lng:this.get('deliveryLongitude')};
        }
    },
    getAddress: function (){
        if(this.get('orderType')){   //pickup 
            return this.get('pickupAddress');
        }else{
            return this.get('deliveryAddress');
        }
    }
});


    window.Order = Order; //Todo: Remove this line
    module.exports = Order;
