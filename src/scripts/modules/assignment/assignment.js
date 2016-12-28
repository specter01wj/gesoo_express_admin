var _                   = require('underscore');
var Marionette          = require('backbone.marionette');
var template            = require('./assignment.hbs');
var PopoverView         = require('./popover-view');
var Marker              = require('./marker');
var DriverView          = require('./driver-view');
var OrderCollection     = require('../../models/orderCollection');
/*------------------------------
 *    MarkupView is use for google map markups
 *------------------------------*/
var MarkupView = Backbone.View.extend({
    initialize: function(args){
        var options = args || {};
        this.collection = new OrderCollection(options.models);
        this.map   = options.map || null;
        this.position = options.position || null;

        var count = this.collection.length;

        // add location markers to map 
        this.marker = new Marker(this.position,count,this.map);

        var self = this;
        this.marker.addListener('click',function(){
            self.onClick.call(self);
        });
    },
    onClick: function (){
        if (typeof App.infowindow!=='undefined') App.infowindow.close();

        var popover = new PopoverView({
            marker : this.marker,
            map: this.map,
            collection: this.collection,
            position: this.position
        }); //initialize popover window
    }
});

var MarkupCollectionView = Backbone.View.extend({
    template: false,
    initialize: function (){
        this.listenTo(this.collection,'reset',this.render);
        this.collection.fetch({reset:true});
    },
    render: function(){
        if (this.collection.length===0) return;
        var groups = this.collection.groupByAddress();
        var bounds = new google.maps.LatLngBounds();
        var center = this.collection.getCenter();
        self.Gmap = new google.maps.Map(document.getElementById('world-map'),{center:center, zoom: 10, scrollwheel: false });


        _.each(groups,function(models){
            var loc = models[0].getLocation();
            var latlng =new  google.maps.LatLng(loc.lat,loc.lng);
            bounds.extend(latlng);
            new MarkupView({
                models: models,
                position: latlng,
                map: self.Gmap
            });
        });

        self.Gmap.fitBounds(bounds);
    },
});


var AssignmentView = Marionette.ItemView.extend({
    ui:{
        map: '#world-map',
        cpanel: '#driver-list'
    },
    events:{
    },
    initialize: function(){
        this.template = template;
    },

    onShow: function (){
        var collection = window.App.orderCollection;
        this.mapView = new MarkupCollectionView({
            el: '#world-map',short:false,
            collection: collection,
        });
        this.mapView.render();
        this.driverView = new DriverView({el:this.ui.cpanel});
        this.driverView.render();
    }

});

module.exports = AssignmentView;

