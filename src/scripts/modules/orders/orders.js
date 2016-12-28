var Marionette = require('backbone.marionette');
//var AssignModal = require('./assignModal');
var template   = require('./orders.hbs');
var OrderCollection = require('../../models/orderCollection');
var DriverCollection = require('../../models/driverCollection');
var CollectionView  =  require('./ordersItems');

var orderList = Marionette.View.extend({
    
    template: template,
    initialize: function(){
        //this.driverCollection = new DriverCollection();
        App.driverCollection.fetch();
    	//this.collection = new OrderCollection();
    	//App.orderCollection.fetch();
        //App.driverCollection = this.driverCollection;
        var drivers = new DriverCollection();
        drivers.fetch();
        this.collection = drivers;
        this.listenTo(this.collection,'sync',this.onSync);
    },
    ui:{
      
    },
    events:{
      
    },

    render: function(){
    	this.el.innerHTML = template();

    	this.childView = new CollectionView({el: this.$el.find('#order-items'),
    	 collection: App.orderCollection, driverColl: App.driverCollection});
    	
    	this.childView.render();
        
    },

    onSync: function(){
        var driverJSON = this.collection.toJSON();
        window.activeDrivers = driverJSON;
        App.orderCollection.fetch();
    },

    onRender: function(){
       
    }

});


module.exports = orderList;
