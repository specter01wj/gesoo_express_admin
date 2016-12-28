var _  = require('underscore');
var Session  = {
	get: function(key){
		var value = localStorage.getItem(key);
		try{
			var json = JSON.parse(value);
			return json;
		}catch(e){
			return value;
		}
	},
	set: function(key,value){
		if(typeof value==='object'){
			value = JSON.stringify(value);	
		}
		localStorage.setItem(key,value);
	},
};
module.exports = Session;
