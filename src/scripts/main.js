
Backbone = require('backbone');
$            = require('twbs'); 
Backbone.$   =  $;
Marionette = require('backbone.marionette');

var Parse    = require('parse');

var Session  = require('./services/session');

var Router   = require('./router');

var RootView = require('./layouts/rootview');
var LoginView = require('./layouts/login/login');

var OrderCollection = require('./models/orderCollection');
var DriverCollection = require('./models/driverCollection');

var app = new Marionette.Application();


app.session = Session;
app.global  = {};

window.App = app;

var Handlebars = require('hbsfy/runtime');
Handlebars.registerHelper('equal', function(v1, v2, options) {

  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a === b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});

app.on('start',function(){
    var self = this;
    
    this.orderCollection = new OrderCollection();
    this.driverCollection = new DriverCollection();

    Parse.initialize("6v1jI8w7bLgriykRgMmeHhsO2J6zO3Ryimgm2MST", "xlStRQOjsDHDuzbPZBnKXvcSnRrZunYrS55nzTCP");

    navigator.geolocation.getCurrentPosition(function(result){
       self.session.set('myLatLng',{
           lat: result.coords.latitude,
           lng: result.coords.longitude
        });
    });
    Backbone.history.start();
});

/*app.rootView = new RootView();
app.router = new Router();
app.loginView = new LoginView();

//app.loginView.render();
app.rootView.render();*/
app.rootView = new RootView();
app.router = new Router();

app.start();
