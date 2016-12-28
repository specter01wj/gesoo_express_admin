var Marionette = require('backbone.marionette');
var AssignModal = require('./assignModal');
var template   = require('./ordersItems.hbs');
var OrderCollection = require('../../models/orderCollection');
var swal   = require('sweetalert');

var ItemView = Marionette.ItemView.extend({
   tagName: 'div',
   className: 'list',
   template : template,

   ui: {
      assign: '.assign',
      cancel: '.cancel'
   },

   events:{
        "click @ui.assign" : "onAssign",
        "click @ui.cancel"   : "onCancel"
    },

   initialize: function(){
      this.listenTo(this.model,'sync',this.onSync);
      console.log('init subviews')
    },
    /*render: function(){
      this.el.innerHTML = template();

      this.childView = new AssignModal({el: this.$el.find('#assign_Modal'),
       collection: this.collection});
      
      this.childView.render();
    },*/
    onSync: function(){
        //this.render();
    },
    onAssign: function(event){
        var assignModal = new AssignModal({model:this.model});    
        assignModal.render();
        //$('#assign_Modal').modal('show');
    },
    onCancel: function(event){
        event.preventDefault();
        var self = this;
        swal({ 
            title: "确定删除?",  
            text: "删除的订单无法还原",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定删除",
            closeOnConfirm: false 
            }, function(){   
                self.model.save(
                  null,
                  //{status : 10},
                {
                    wait:true,
                    success: function(model,response,options){
                        //self.destroy();
                        swal("成功!", "您的订单已经成功删除", "success");
                        //window.location.reload(true);
                        self.$('.orderItems').css("pointer-events", "none");
                        self.$('.orderItems .panel-footer').css("background-color", "#FC8C8C");
                        self.$('.panel-footer.panel-info').text('订单状态: 已取消');
                    },
                    error: function(model,response,options){
                        swal("错误!", "订单未能删除", "error");
                    }
                }); 
            });
    }

});


var OrderCollectionView = Marionette.CollectionView.extend({

    childView: ItemView,
    initialize: function(){

    },
    
    onRender: function(){
    console.log('collection view rendered')
    }

});

module.exports = OrderCollectionView;
