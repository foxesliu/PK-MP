const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    aaa: 'aaa'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    start() {
      app.startRecord(() => {
        console.log('开始录音');
      })
    },
    end() {
      app.stopRecord((res) => {
        console.log(res);
        this.setData({
          aaa: 'bbb'
        })
      })
    }
  }
})