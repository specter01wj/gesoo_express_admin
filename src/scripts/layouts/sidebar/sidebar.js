
var $        = require('twbs');
var Marionette = require('backbone.marionette');
var template  = require('./sidebar.hbs');

SideView = Marionette.ItemView.extend({
    tagName: 'section',
    className: 'sidebar',
    initialize: function(){
        this.template = template;
    },
});

module.exports = SideView;
