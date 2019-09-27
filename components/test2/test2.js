// components/test2/test2.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:Number
    },
    isRead:{
      type:Number   //0未读 1已读
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    isRead(){
      var _this=this
      if (this.data.isRead == 1){
        _this.setData({
          isRead:0,
          type:2,
        })
      }else{
        _this.setData({
          isRead: 1,
          type: 1,
        })
      }
    }
  }
})
