const app = getApp();
import {
  phRuserLessonQaSubmitAnswer
} from '../../model.js'

Component({
  properties: {
    isAsk: Boolean,
    resourceUrl: String,
    item: Object,
    options: Object,
    isExtra: String
  },

  data: {
    url: '',
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
    console.log(this.properties.options);
    if (this.properties.resourceUrl) {
      this.setData({
        url: this.properties.resourceUrl
      });
    }
    this.setData({
      answerObj: {
        answerId: this.properties.item.answerId, //答题ID，修改的时候才有
        isExtra: this.properties.options.isExtra, // 是否是额外
        prlId: this.properties.options.prlId, //ph_ruser_lesson 的主键
        ruserId: wx.getStorageSync('ruserId'), //学生ID
        secCid: this.properties.item.secCid, //作答类型内容Id
        secId: this.properties.options.secId, //sectionId
        snum: this.properties.options.snum, //作答类型内容序号
        type: 5, //作答类型
        // value: ossurl, //作答内容
      }
    })
    console.log(this.data.answerObj);
  },

  methods: {
    upload() {
      if (this.properties.isAsk) {
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
          wx.uploadFile({
            url: app.globalData.apiPrefix + '/apps/mp/lessonSectionContent/upload',
            filePath: tempFilePaths[0],
            name: 'proFile',
            formData: {
              fileType: 5
            },
            header: {
              // "token": wx.getStorageSync('token')
            },
            success: function(ress) {
              console.log(ress);
              let ossurl = (JSON.parse(ress.data)).data.OSSUrl;
              console.log(ossurl)
              _this.setData({
                url: ossurl
              })
              console.log(_this.data.url);
              _this.setData({
                ['answerObj.value']: ossurl
              })
              // console.log(_this.data.answerObj)
              phRuserLessonQaSubmitAnswer(_this.data.answerObj, (ttt) => {
                if (ttt.code == 200) {
                  console.log(ttt);
                  console.log('上传完毕');
                  app.globalData.cando = true;
                  _this.setData({
                    loadingIsShow: false,
                  });
                  if (_this.properties.isCommit) {
                    _this.triggerEvent('recorderEndCallback', app.globalData.tempAudio);
                  }
                }
              })
            }
          })

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