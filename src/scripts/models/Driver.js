"strict";
var _        = require('underscore');
var Backbone = require('backbone');
var Session  = require('../services/session');
var Parse    = require('parse');
var moment   = require('moment-timezone');

Backbone.$ = $;
/*========================================*
 *      Driver Model Class 
 *========================================*/
var Driver = Backbone.Model.extend({
    idAttribute: 'objectId',
    assignDriver: function(orders,options){
        var self = this;
        var apiName;  
        options = options || {};
        var data = options.data || {};
        var user = Session.get('user'); 
        _.extend(data,user);

        apiName  = 'assignDriver';
        var params  = {objectIds: orders, driverId: self.id};
        _.extend(data,params);

        Parse.Cloud.run(apiName,data,{
            success: function(result){
                if ( typeof(options.success) === 'function' )
                    options.success.call(orders,result);
                else
                    return;
            }, error: function(result){
                if ( typeof(options.error) === 'function' )
                    options.error.call(orders,result);
                else
                    return;
            }
        });
    }
    
});


window.Driver = Driver; //Todo: Remove this line
module.exports = Driver;
