// components/reply/student/video.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url: String,
    index: Number,
    nickName: String,
    date: String,
    avatarUrl: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPlaying: false,
    videoPoster: getApp().globalData.videoPoster,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    playVideo(e) {
      this.triggerEvent('playVideo', this.properties.url);
      console.log('teacher.comment', this.properties.url);
    }
  }
})