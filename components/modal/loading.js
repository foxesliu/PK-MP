// components/modal/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    txt: String,
    kd:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open() {
      this.setData({
        show: true
      })
    },
    close() {
      this.setData({
        show: false
      })
    }
  }
})