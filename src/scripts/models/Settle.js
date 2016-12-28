"strict";
var _        = require('underscore');
var Backbone = require('backbone');
var Session  = require('../services/session');
var Parse    = require('parse');
var moment   = require('moment-timezone');

Backbone.$ = $;
/*========================================*
 *      Settle Model Class 
 *========================================*/
var Settle = Backbone.Model.extend({
    idAttribute: 'objectId',
    getSettle: function(options){
        var self = this;
        var apiName = 'getSettle';   
        options = options || {};
        var data = options.data || {};
        var user = Session.get('user'); 
        _.extend(data,user);

        var params  = {page: options.page || 0};
        _.extend(data,params);

        Parse.Cloud.run(apiName,data,{
            success: function(settles){
                
                if ( typeof(options.success) === 'function' )
                    options.success.call(model,settles);
                else
                    return;
            }, error: function(settles){
                if ( typeof(options.error) === 'function' )
                    options.error.call(model,settles);
                else
                    return;
            }
        });
    },
    finishSettle: function(settles, options){
        var self = this;
        var apiName = 'finishSettle';   
        options = options || {};
        var data = options.data || {};
        var user = Session.get('user'); 
        _.extend(data,user);

        var params  = {settleIds: settles};
        _.extend(data,params);

        Parse.Cloud.run(apiName,data,{
            success: function(settles){
                
                if ( typeof(options.success) === 'function' )
                    options.success.call(model,settles);
                else
                    return;
            }, error: function(settles){
                if ( typeof(options.error) === 'function' )
                    options.error.call(model,settles);
                else
                    return;
            }
        });
    }
});


window.Settle = Settle; //Todo: Remove this line
module.exports = Settle;
