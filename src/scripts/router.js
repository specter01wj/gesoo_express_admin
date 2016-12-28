Marionette = require('backbone.marionette');

var OrderView = require('./modules/orders/orders');
var Account  = require('./services/account');
var RootView = require('./layouts/rootview');
var LoginView = require('./layouts/login/login');
var Dashboard = require('./modules/dashboard/dashboard');
var Navbar  = require('./layouts/nav/navView');
var Sidebar = require('./layouts/sidebar/sidebar');

var Assignment = require('./modules/assignment/assignment');
var app = new Marionette.Application();

var Router = Marionette.AppRouter.extend({
    execute: function(callback,args,name){
        if(Account.check() || name==='login'){
            /*app.rootView = new RootView();
            app.rootView.render();*/
            if(callback) 
                callback.apply(this,args);
        }else{
            /*app.loginView = new LoginView();
            app.loginView.render();*/
            this.navigate('login',{trigger:true});
        }
    },
    routes:{
        ''          :  'dashboard',
        'orders'    :  'orders', 
        'drivers'   :  'drivers',
        'assignment':  'assignment',
        'login' : 'login'
    },
    login: function(){
        var loginView = new LoginView();
        loginView.render();
    },
    dashboard: function(){
        /*var contentView = window.App.rootView.getRegion('main');
        contentView.show(new Dashboard());*/
        window.App.rootView.getRegion('main').show(new Dashboard());
        window.App.rootView.getRegion('navbar').show(new Navbar());
        window.App.rootView.getRegion('sidebar').show(new Sidebar());
        
    },
    orders: function(){
        var contentView = window.App.rootView.getRegion('main');
        contentView.show(new OrderView());
        window.App.rootView.getRegion('navbar').show(new Navbar());
        window.App.rootView.getRegion('sidebar').show(new Sidebar());
    },
    drivers: function(){
    },
    assignment: function(){
        var contentView = window.App.rootView.getRegion('main');
        contentView.show(new Assignment());
    }
});

module.exports = Router;
