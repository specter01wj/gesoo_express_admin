var       $  = require('jquery');
var       _  = require('underscore');
var Backbone = require('backbone');
var Session  = require('./session');
var Parse    = require('parse');

Account = {
  check: function(){
    var user = Session.get('user');
    if(user && user.username && user.password){
      return true;
    }else{
      return false;
    }
  },
  login: function(username,password)
  {
      var user = {
          username: username.toLowerCase(),
          password:password
      };

      Parse.Cloud.run('checkAdmin',user,{
          success: function(result){
              Session.set('user',user);
              Account.trigger('success');
          }, error: function(result){
              Account.trigger('failed');
          }
      });

  },
  logout: function(){
      Account.trigger('logout');
  },
};

_.extend(Account,Backbone.Events);

Parse.initialize("6v1jI8w7bLgriykRgMmeHhsO2J6zO3Ryimgm2MST", "xlStRQOjsDHDuzbPZBnKXvcSnRrZunYrS55nzTCP");

window.Account = Account;
module.exports = Account;

