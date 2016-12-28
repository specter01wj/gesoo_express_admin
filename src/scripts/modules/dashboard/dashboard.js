var Marionette = require('backbone.marionette');
var template   = require('./dashboard.hbs');

var Dashboard = Marionette.ItemView.extend({
    initialize: function(){
        this.template = template;
    }
});

module.exports = Dashboard;
