"strict";
var _      = require('underscore');
$            = require('twbs'); 
window._ = _;
var Order  = require('./order');
var Session = require('../services/session');
var Parse    = require('parse');
var moment   = require('moment-timezone');

var OrderCollection = Backbone.Collection.extend({
    orderTypeFilter:0, //default to delivery order
    cache: [],
    model: Order,
    initialize: function(){
        this.bind('add',this.onModelAdded,this);
        this.bind('remove',this.onModelRemoved,this);
    },
    assignToDriver: function(driverId,options){
        var orderIDs = this.pluck('objectId');
        var self = this;
        var apiName;  
        options = options || {};
        var data = {};
        var user = Session.get('user'); 
        _.extend(data,user);
        if(driverId){
            _.extend(data,{driverId:driverId});
        }

        apiName  = 'assignDriver';
        var params  = {objectIds: orderIDs};
        _.extend(data,params);

        Parse.Cloud.run(apiName,data,{
            success: function(result){
                if ( typeof(options.success) === 'function' )
                    options.success.call(result);
                else
                    return;
            }, error: function(result){
                if ( typeof(options.error) === 'function' )
                    options.error.call(result);
                else
                    return;
            }
        });
    },
    onModelRemoved: function(model,collection,options){
        console.log('onremove');
    },
    onModelAdded: function(model,collection,options){
    },
    sync: function(method,collection,options){
        var user = Session.get('user');
        switch(method){
            case 'read':
                options = options || {};
                options.data = options.data || {};
                _.extend(options.data,user);
                var self = collection;
                var page = options.data && options.data.page || 0;

                Parse.Cloud.run('getAllOrder',options.data,{
                    success: function(result){
                        collection.cache[page] = result;
                        options.success.call(collection,result);
                    },
                    error: function(result){
                        options.error.call(collection,result);
                    }
                });
                break;
        }
    },
    parse: function(parseObjects){
        return _.map(parseObjects,function(v){
            var temp = v.toJSON();
            var result = _.omit(temp,'type','className','partner');
            result.driverName = null;
            $.each(activeDrivers, function( i, val ) {
                if (activeDrivers[i].objectId === result.assignedDriverId){
                    result.driverName = activeDrivers[i].name;
                } 
            });

            result.createdAt = moment(temp.createdAt).format('MM/d/YY h:mm A');
            if(temp.pickupTime)  result.pickupTime = moment(temp.pickupTime.iso).format('MM/d/YY h:mm A');
            if(temp.deliveryTime) result.deliveryTime =  moment(temp.deliveryTime.iso).format('MM/d/YY h:mm A');
            return result;
        });
    },
    /*==============================*
     * Helper function : split models into groups by same location
     * result: [{count:x,lat:xx,lng:xxx},{....}]
     *==============================*/ 
    groupByAddress : function (){
        return this.groupBy(function(model){
            return model.getAddress();
        });
    },
    selectByIds: function (ids){
       if(typeof ids!=='object' || !ids || ids.length === undefined) 
           throw new Error('selectByIds only take array as parameter');
       
       var selectModel = this.filter(function(model){
           return ids.indexOf(model.id) !== -1;
       });

       return new OrderCollection(selectModel);
    },
    getCenter:function(){
        var self = this;

        var lngs  = [];
        var lats  = [];
        var orders  = this.toJSON();

        _.each(orders,function(v){
            if(self.orderTypeFilter){  //pickup order list
                lngs.push(v.pickupLongitude);
                lats.push(v.pickupLatitude);
            }else{                      //delivery order list
                lngs.push(v.deliveryLongitude);
                lats.push(v.deliveryLatitude);
            }
        });

        var centerLatitude = (Math.min.apply(Math,lats)+Math.max.apply(Math,lats))/2;
        var centerLongitude = (Math.min.apply(Math,lngs)+Math.max.apply(Math,lngs))/2;

        return {lat: centerLatitude, lng: centerLongitude};
    },
});

window.OrderCollection = OrderCollection;
module.exports = OrderCollection;
