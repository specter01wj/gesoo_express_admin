
var DriverCollection        = require('../../models/driverCollection');
var template                = require('./driver-view.hbs');

var DriverView  = Backbone.View.extend({
    template: template,
    events:{
        'click a':'selectDriver',
    },
    initialize: function(){
        this.collection = new DriverCollection();
        this.listenTo(this.collection,'load:success',this.onShow);
    },

    render: function (){
        this.collection.fetch();
    },

    onShow: function (){
        var html = this.template(this.collection.toJSON());
        this.el.innerHTML = html;
    },

    selectDriver: function (e){
        var $this  = $(e.currentTarget);
        e.preventDefault();
        this.$el.find('a').removeClass('active');
        $this.addClass('active');
        var driverId = $this.data('driver-id');
        //App.session.set('selectDriverID',driverId);
        App.global.selectDriverID = driverId;
    }
});

module.exports = DriverView;

