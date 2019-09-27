const app = getApp();
import {
  phRuserLessonQaSubmitAnswer,
  lessonSectionContentQuery
} from '../../model.js';

Component({
  properties: {
    vid: String,
    isAsk: Boolean,
    resourceUrl: String,
    item: Object,
    options: Object,
  },

  data: {
    url: '',
    isPlaying: false,
    videoPoster: app.globalData.videoPoster,
    answerObj: {
      answerId: 11, //答题ID，修改的时候才有
      isExtra: 11, // 是否是额外
      prlId: 11, //ph_ruser_lesson 的主键
      ruserId: wx.getStorageSync('ruserId'), //学生ID
      secCid: 11, //作答类型内容Id
      secId: 11, //sectionId
      snum: 11, //作答类型内容序号
      type: 11, //作答类型
      value: 11, //作答内容
    }
  },

  ready() {
    console.log(this.properties.item);
    console.log(this.properties.options);
    this.setData({
      answerObj: {
        answerId: this.properties.item.answerId, //答题ID，修改的时候才有
        isExtra: this.properties.options.isExtra, // 是否是额外
        prlId: this.properties.options.prlId, //ph_ruser_lesson 的主键
        ruserId: wx.getStorageSync('ruserId'), //学生ID
        secCid: this.properties.item.secCid, //作答类型内容Id
        secId: this.properties.options.secId, //sectionId
        snum: this.properties.options.snum, //作答类型内容序号
        type: 6, //作答类型
        // value: ossurl, //作答内容
      }
    })
    console.log(this.data.answerObj);
    if (this.properties.item.answerValue) {
      this.setData({
        url: this.properties.item.answerValue
      })
    }
    // console.log(this.properties.resourceUrl)
    if (this.properties.resourceUrl) {
      this.setData({
        url: this.properties.resourceUrl
      });
    }
  },

  methods: {
    upload() {
      if (this.properties.isAsk) {
        return;
      }
      let _this = this;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success(res) {
          console.log(res.tempFilePath);
          // console.log('调上传接口');
          wx.uploadFile({
            url: app.globalData.apiPrefix + '/apps/mp/lessonSectionContent/upload',
            filePath: res.tempFilePath,
            name: 'proFile',
            formData: {
              fileType: 6,
              fileText: 'proFile'
            },
            header: {
              // "token": wx.getStorageSync('token')
            },
            success: function(ress) {
              console.log(ress);
              let ossurl = (JSON.parse(ress.data)).data.OSSUrl;
              _this.setData({
                ['answerObj.value']: ossurl,
                url: ossurl
              });
              phRuserLessonQaSubmitAnswer(_this.data.answerObj, (ttt) => {
                console.log(_this.data.answerObj);
              })
            }
          })
          // _this.setData({
          //   url: app.globalData.tempVideo
          // });
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

    clickUploadAgain() {
      this.setData({
        url: ''
      })
    }
  }
})