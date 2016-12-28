var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');
var Session  = require('../services/session');
var Parse    = require('parse');
var moment   = require('moment-timezone');

Backbone.$ = $;

Parse.initialize("6v1jI8w7bLgriykRgMmeHhsO2J6zO3Ryimgm2MST", "xlStRQOjsDHDuzbPZBnKXvcSnRrZunYrS55nzTCP");
   

var Order = {

  items: {},
  currentpage: 0,

  toJSON: function () {
    var self = this;

    if (self.items[currentpage].length === 0)
          throw new Error("current page has no message!");
    
    console.log(self.items[currentpage]);
    return self.items[currentpage];
  },

  fetch: function(page){
    var self = this;

    Parse.Cloud.run('getAllOrder',{username:'gesoo',password: '123456', page:page || 0},{
      success: function(orders){

        if (orders.length === 0){
          self.trigger('order:data-end');
          return;
        } else {
          currentpage =  page;
        }

        self.items[currentpage]  = orders;
        self.trigger('order:data-loaded');
      },
      error: function(result){
        self.trigger('order:load-failed');
      }
    });
  },

  cancelOrder: function(){
    var self = this;
    Parse.Cloud.run('cancelOrder',{username:'gesoo',password:'123456',objectId:'IMwyYo0Voa'},{
      success: function(message){
          console.log(message);
          self.trigger('cancelOrder:message-success');
      },
      error: function(){
        console.log('cancelOrder error!');
        self.trigger('cancelOrder:message-failed');
      }
    });
  }
  
};

_.extend(Order, Backbone.Events);

Order.on("order:data-loaded", function(){
  console.log("order: data-loaded -> success!!");
});
Order.on("cancelOrder:message-success", function(){
  console.log("cancelOrder:message-success -> success!!");
});


var Driver = {

  items: {},
  currentpage: 0,

  toJSON: function () {
    var self = this;

    if (self.items[currentpage].length === 0)
          throw new Error("current page has no message!");
    
    console.log(self.items[currentpage]);
    return self.items[currentpage];
  },

  assignDriver: function(callback){
    var self = this;
    Parse.Cloud.run('assignDriver',{username:'gesoo',password: '123456',objectIds:['IMwyYo0Voa'],driverId:'fLEugdas9R'},{
      success: function(message){
        console.log(message);
        self.trigger('assignDriver:assign-success');
      },
      error: function(){
        console.log('assignDriver error!');
        self.trigger('assignDriver:assign-failed');
      }
    });
  },

  getActiveDriverList: function(){
    var self = this;
    Parse.Cloud.run('getActiveDriverList',{username:'gesoo',password:'123456'},{
      success: function(drivers){

        if (drivers.length === 0){
          self.trigger('drivers:data-end');
          return;
        }

        self.items  = drivers;
        self.trigger('getActiveDriverList:get-success');
      },
      error: function(){
        console.log('getActiveDriverList error!');
        self.trigger('getActiveDriverList:get-failed');
      }
    });
  }

};

_.extend(Driver, Backbone.Events);

Driver.on("assignDriver:assign-success", function(){
  console.log("assignDriver: assign-success -> success!!");
});
Driver.on("getActiveDriverList:get-success", function(){
  console.log("getActiveDriverList: get-success -> success!!");
});


var Settle = {

  items: {},
  currentpage: 0,

  toJSON: function () {
    var self = this;

    if (self.items[currentpage].length === 0)
          throw new Error("current page has no message!");
    
    console.log(self.items[currentpage]);
    return self.items[currentpage];
  },

  fetch: function(page,isCurrent,callback){
    var self = this;
    Parse.Cloud.run('getSettle',{username:'gesoo',password: '123456',page: page || 0},{
      success: function(settles){

        if (settles.length === 0){
          self.trigger('getSettle:data-end');
          return;
        } else {
          currentpage =  page;
        }

        self.items[currentpage]  = settles;
        self.trigger('getSettle:get-success');

      },
      error: function(){
        console.log('getSettle error!');
        self.trigger('getSettle:get-failed');
      }
    });
  },

  finishSettle: function(){
    var self = this;
    Parse.Cloud.run('finishSettle',{username:'gesoo',password:'123456',settleIds:['ApvijA5RXx']},{
      success: function(message){
          console.log(message);
          self.trigger('finishSettle:get-success');
      },
      error: function(){
        console.log('finishSettle error!');
        self.trigger('finishSettle:get-failed');
      }
    });
  }

};

_.extend(Settle, Backbone.Events);

Settle.on("getSettle:get-success", function(){
  console.log("getSettle: get-success -> success!!");
});
Settle.on("finishSettle:get-success", function(){
  console.log("finishSettle: get-success -> success!!");
});


//window.OrderCollection = OrderCollection;
module.exports =  {
    Order: Order,
    Driver: Driver,
    Settle: Settle
} ;

