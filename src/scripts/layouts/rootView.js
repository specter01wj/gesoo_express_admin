var Marionette = require('backbone.marionette');

var Navbar  = require('./nav/navView');
var Sidebar = require('./sidebar/sidebar');

var RootView = Marionette.LayoutView.extend({
    //el: 'body',
    el: '#main-view',
    regions: {
        navbar : '.main-header',
        sidebar: '.main-sidebar',
        main:    'section.content'
        //main:    '#main-view'
    },
    render:function(){
        this.getRegion('navbar').show(new Navbar());
        this.getRegion('sidebar').show(new Sidebar());
    }
});

module.exports = RootView;
