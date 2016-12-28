var _ = require('underscore');
var swal   = require('sweetalert');
var Driver = require('../../models/Driver');
var popoverTemplate     = require('./popover.hbs');

var PopoverView = Backbone.View.extend({
    template: popoverTemplate,
    events:{
        'change #sel-all': 'selectAll', 
        'click #assign-btn': 'assignDriver',
        'click #un-assign-btn': 'unAssign'
    },
    initialize: function (options){
        this.map = options.map;
        this.collection = options.collection;
        this.position = options.position;
        this.marker = options.marker;

        var self = this;
        var data    =   this.collection.toJSON ();
        var outputHtml = this.template({orders:data});
        App.infowindow = new google.maps.InfoWindow({
            content: outputHtml,
            position: self.position,
            maxWidth: 350
        });


        google.maps.event.addListener(App.infowindow, 'domready', function() {
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();
            // Remove InfoWindow background
            iwBackground.children(':nth-child(2)').css({'display' : 'none'});
            iwBackground.children(':nth-child(4)').css({'display' : 'none'});
            iwOuter.parent().parent().css({left: '0'});

            // Reference to the div that groups the close button elements.
            var iwCloseBtn = iwOuter.next();

            // Apply the desired effect to the close button
            iwCloseBtn.css({opacity: '1', width:'15px',height:'15px',right: '65px', top: '25px', color:'#222',border:'1px solid #333',padding:'3px'});

            self.$el = $('#iw-container');
            self.delegateEvents(self.events);
        });

        App.infowindow.open(this.map,this.marker);

    },
    render:function (){
    },
    unAssign: function (){
        var $orders = this.$el.find('input[data-id]:checked');
        var orderIDs = $orders
            .toArray()
            .map(function(v){
                return $(v).data('id');
            });

        if(!orderIDs || orderIDs.length ===0){
            swal("失败!", "请选择订单", "error"); 
            return false;
        }

        var selectOrderCollection = this.collection.selectByIds(orderIDs); 

        selectOrderCollection.assignToDriver(undefined,{
            success: function(){
                $orders.parent().siblings().remove();
                selectOrderCollection.invoke('set',{"assignDriverId":undefined});
                swal("成功!", "订单取消分配", "success"); 
            },
            error: function (){
                alert('error');
            }
        });
    },
    assignDriver: function (){
        var self = this;
        var driverID = App.global.selectDriverID;
        var $ordersInputElements = this.$el.find('input[data-id]:checked');
            var orderIDs = $ordersInputElements
            .toArray()
            .map(function(v){
                return $(v).data('id');
            });

        if(!driverID) 
        {
            swal("失败!", "请选择司机", "error"); 
            return false;
        }

        if(!orderIDs || orderIDs.length ===0){
            swal("失败!", "请选择订单", "error"); 
            return false;
        }

        
        var selectOrderCollection = this.collection.selectByIds(orderIDs); 

        selectOrderCollection.assignToDriver(driverID,{
            success: function (){
                //insert label right after order list item
                $labelHTML =  $('<span class="label label-danger">'+ driverID + '</span>');
                $labelHTML.insertAfter($ordersInputElements.parent());
                swal("成功!", "订单分配成功", "success"); 
            },
            error: function (result){
                swal("失败!", "错误信息："+result.error, "error"); 
            }
        });


    },
    selectAll: function (e){
        $this = $(e.currentTarget);
        if($this.prop('checked')){
            this.$el.find('input[type=checkbox]').prop('checked',true);
        }else{
            this.$el.find('input[type=checkbox]').prop('checked',false);
        }
    }
});

module.exports = PopoverView;
