"strict";
var _      = require('underscore');
var Driver  = require('./driver');
var Session = require('../services/session');
var Parse    = require('parse');
var moment   = require('moment-timezone');

var DriverCollection = Backbone.Collection.extend({

    model: Driver,

    sync: function(method,collection,options){
        var user = Session.get('user');
        switch(method){
            case 'read':
                options = options || {};
                options.data = options.data || {};
                _.extend(options.data,user);
                var self = collection;
                var page = options.data && options.data.page || 0;

                Parse.Cloud.run('getActiveDriverList',options.data,{
                    success: function(result){
                        options.success.call(collection,result);
                        self.trigger('load:success');
                    },
                    error: function(result){
                        options.error.call(collection,result);
                        self.trigger('load:failed');
                    }
                });
                break;
        }
    },
    parse: function(parseObjects){
        return _.map(parseObjects,function(v){
            var temp = v.toJSON();
            var result = _.omit(temp,'type','className','createdAt','totalIncome','totalOrders','updatedAt');

            return result;
        });
    }
   
});

window.DriverCollection = DriverCollection;
module.exports = DriverCollection;
