var _        = require('underscore');
var Backbone = require('backbone');
var DriverCollection = require('../../models/driverCollection');
var Session  = require('../../services/session');

//var StatesHash = require('./states_hash.json');

//window.jQuery = $;
//var Datepicker = require('jquery-datetimepicker');
//var Schema = require('schema');
//var validate = require('jquery-validation');

var template = require('./assignModal.hbs');
var swal   = require('sweetalert');

var assignModal = Backbone.View.extend({
    el: '#assign_Modal',
    template: template,
    initialize: function(){
        this.page = 1;
    },
    ui:{
      
    },
    events:{
        "click #driver-btn-submit":  "onSubmit",
        "click #driver-btn-cancel":  "onCancel",
        "click .prev-driver":  "onPrev",
        "click .next-driver":  "onNext"
    },
    
    render: function(){
        var self = this;
        var drivers = App.driverCollection.toJSON();
        var orderID = this.model.get('assignedDriverId');
        var pageLength = 2; 
        var pageCount = [];

        var from = (self.page - 1) * pageLength;
        var to   =  self.page * pageLength;

        drivers = drivers.slice(from,to);

        drivers = _.map(drivers,function(v){
            if(v.objectId===orderID){
                v.isChecked=true;                
            }
            return v;
        });



        this.pageNumber = Math.ceil(App.driverCollection.toJSON().length / pageLength);
        for(var i = 1; i <= this.pageNumber; i++){
            pageCount.push(i);
        }

        this.el.innerHTML = template({drivers: drivers, pageCount: pageCount,currentPage: self.page});
        if (self.page == 1)
            $('.pagination .prev-driver').addClass('disabled');
        else 
            $('.pagination .prev-driver').removeClass('disabled');

        if (self.page == self.pageNumber)
            $('.pagination .next-driver').addClass('disabled');
        else 
            $('.pagination .next-driver').removeClass('disabled');

        $('#assign_Modal').modal('show'); 
    },
    onPrev:function(e){
        //注意顺序，先改页数，再渲染
        if(this.page>1) this.page --;
        this.render(); 
    },
    onNext:function(e){
        //判断是不是最后一页，不是则加一
        if(this.pageNumber !== this.page) this.page ++;
        this.render();
        
    },
    onSubmit:function(e){
        var order = this.model;
        var self = this;
        //var assignDriver = $(e.currentTarget).data('id');
        var driver_objID = $('.modal-dialog input:checked').data('id');
        
        var orderCollection = new OrderCollection(order);

        orderCollection.assignToDriver(driver_objID,{
            success: function(){
                console.log('Assign Driver Success!');
                swal("成功!", "您的订单已经成功保存", "success");
                
                $('#assign_Modal').modal('hide'); 
                self.model.set('assignedDriverId', driver_objID);
                
                window.setTimeout(function(){
                    window.location.reload(true);
                }, 1500);
            },
            error: function(){
                console.log('Assign Driver Failed!');
            }
        });


        
    },
    onCancel:function(e){
        $('#assign_Modal').modal('hide'); 
    }
    /*onShow: function(){
        $('#assign_Modal').modal('show');
    },*/

    /*onRender: function(){
      $('#assign_Modal').modal('show'); 
    }*/

});

window.$ = $;
module.exports = assignModal;
