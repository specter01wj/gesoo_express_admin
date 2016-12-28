var template = require('./nav.hbs');
var Marionette = require('backbone.marionette');

NavView = Marionette.ItemView.extend({
    initialize: function(){
        this.template = template;
    },
});

module.exports = NavView;
