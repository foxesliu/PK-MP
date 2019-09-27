const app = getApp();
Component({
  properties: {
    vid: String,
    isAsk: Boolean,
    resourceUrl: String
  },

  data: {
    url: '',
    isPlaying: false,
    videoPoster: app.globalData.videoPoster
  },

  ready() {
    // console.log(this.properties.resourceUrl)
    if (this.properties.resourceUrl) {
      this.setData({
        url: this.properties.resourceUrl
      });
    }
  },

  methods: {
    upload() {
      let _this = this;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success(res) {
          console.log(res.tempFilePath);
          // console.log('调上传接口');
          _this.triggerEvent('uploadComplete', app.globalData.tempVideo);
        }
      })
    },

    playVideo(e) {
      this.setData({
        isPlaying: true
      });
      console.log(888)
      var videoContext = wx.createVideoContext('video');
      videoContext.play();
      videoContext.requestFullScreen();
      videoContext.onExitFullScreen = function() {
        console.log(111111111666)
      }
    },
  }
})
