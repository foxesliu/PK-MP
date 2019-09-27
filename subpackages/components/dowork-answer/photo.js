const app = getApp();
import {
  uploadFile
} from '../../../public/js/util.js';

Component({
  properties: {
    resourceUrl: String,
    cannotDo: String,
    replyIcon: String,
    audioWorkingId: String,
    isCommit: String
  },

  data: {
    url: ''
  },

  ready() {
    console.log(this.properties);
    if (this.properties.resourceUrl) {
      this.setData({
        url: this.properties.resourceUrl
      });
    }
  },

  methods: {

    showPic(a) {
      let url = a.currentTarget.dataset.src;
      wx.previewImage({
        urls: [url]
      })
    },

    upload() {
      if (this.properties.cannotDo) {
        wx.showModal({
          content: '已批改，您不能再次作答了',
        })
        return;
      }
      let _this = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths[0]);
          // _this.selectComponent('#modalLoadingComponent').open();
          wx.showLoading({
            title: '图片上传中',
          })
          setTimeout(() => {
            uploadFile({
              filePath: tempFilePaths[0],
              fileText: '上传图片',
              fileType: _this.properties.isCommit ? 9 : 5,
              errorCallback: function () {
                wx.hideLoading();
                wx.showModal({
                  title: "提示",
                  showCancel: false,
                  content: '请重新上传',
                });
                _this.selectComponent('#modalLoadingComponent').close();
              },
              callback: function (oo) {
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

    clickUploadAgain() {
      this.setData({
        url: ''
      })
    }
  }
})