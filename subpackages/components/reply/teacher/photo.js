// components/reply/student/photo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url: String,
    nickName: String,
    date: String,
    avatarUrl: String
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
    showPic(a) {
      let url = a.currentTarget.dataset.src;
      wx.previewImage({
        urls: [url]
      })
    },
  }
})