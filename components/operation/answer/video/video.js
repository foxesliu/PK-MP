const app = getApp();
import {
  uploadFile
} from '../../../../public/js/util.js';

Component({
  properties: {
    resourceUrl: String,
    cannotDo: String,
    replyIcon: String,
    audioWorkingId: String,
    isCommit: String
  },

  data: {
    url: '',
    isPlaying: false,
    videoPoster: app.globalData.videoPoster
  },

  ready() {
    this.setData({
      url: this.properties.resourceUrl ? this.properties.resourceUrl : ''
    });
  },

  methods: {
    upload() {
      if (this.properties.cannotDo) {
        wx.showModal({
          content: '已批改，您不能再次作答了',
        })
        return;
      }
      let _this = this;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        duration: 60,
        compressed: true,
        camera: 'back',
        success(res) {
          console.log(res);
          if (res.duration > app.globalData.videoTime) {
            wx.showModal({
              title: "提示",
              showCancel: false,
              content: '视频不能超过60秒',
            });
            return;
          }
          if (res.size > app.globalData.videoSize) {
            wx.showModal({
              title: "提示",
              showCancel: false,
              content: '视频不能超过200M',
            });
            return;
          }
          // return;
          console.log(res.tempFilePath);
          // console.log('调上传接口');
          wx.showLoading({
            title: '上传中',
          })
          setTimeout(() => {
            uploadFile({
              filePath: res.tempFilePath,
              fileText: '上传视频',
              fileType: _this.properties.isCommit ? 6 : 11,
              errorCallback: function () {
                wx.hideLoading();
                wx.showModal({
                  title: "提示",
                  showCancel: false,
                  content: '请重新上传',
                });
                _this.selectComponent('#modalLoadingComponent').close();
              },
              callback: function(oo) {
                console.log(oo);
                let ossurl = (JSON.parse(oo.data)).data.OSSUrl;
                let score = (JSON.parse(oo.data)).data.socres;
                // _this.selectComponent('#modalLoadingComponent').close();
                wx.hideLoading();
                if (!ossurl) {
                  wx.showModal({
                    title: "提示",
                    showCancel: false,
                    content: '请重新上传',
                  });
                } else {
                  _this.setData({
                    url: _this.properties.isCommit ? '' : ossurl
                  });
                  _this.triggerEvent('uploadcomplete', {
                    ossurl: ossurl,
                    score: score,
                    extra: _this.properties.audioWorkingId
                  });
                }
              }
            })
          }, 10);
        }
      })
    },

    playVideo(e) {
      this.setData({
        isPlaying: true
      });
      var videoContext = wx.createVideoContext('video');
      videoContext.play();
      videoContext.requestFullScreen();
      videoContext.onExitFullScreen = function() {
        console.log(111111111666)
      }
    },

    clickUploadAgain() {
      this.setData({
        url: ''
      })
    }
  }
})