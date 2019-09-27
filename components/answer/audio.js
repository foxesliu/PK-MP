const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
import {
  phRuserLessonQaSubmitAnswer,
  lessonSectionContentQuery
} from '../../model.js';

let recordTimerFunc;
let playTimerFunc;

Component({
  properties: {
    readTxt: String,
    did: String,
    isAsk: Boolean,
    resourceUrl: String,
    isCommit: Boolean,
    item: Object,
    options: Object,
    isExtra: String
  },

  data: {
    timer: 0,
    timerFormat: "00' 00'",
    recordStep: 1,
    duration: 0,
    playingSecond: 0,
    playingShowSecond: 0,
    playingLeft: 100,
    loadingIsShow: false,
    url: '',
    score: 0,
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
    // console.log(this.properties.item.answerValue);
    console.log(this.properties.options);
    // console.log(typeof this.properties.item.answerValue)
    if (typeof this.properties.item.answerValue) {
      this.setData({
        url: this.properties.item.answerValue,
        recordStep: 3
      })
    }
    if (this.properties.resourceUrl) {
      this.setData({
        url: this.properties.resourceUrl,
        recordStep: 3
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
        type: 7, //作答类型
        // value: ossurl, //作答内容
      }
    })
    console.log(this.data.answerObj);
    let _this = this;
    innerAudioContext.onEnded(() => {
      if (app.globalData.audioWorkingId == this.properties.did) {
        console.log('播放完成');
        this.playEnd();
      }
    });
  },

  methods: {
    record() {
      let _this = this;
      if (this.properties.isAsk) {
        return;
      }
      switch (this.data.recordStep) {
        case 1:
          app.startRecord(() => {
            if (app.globalData.cando === false) {
              this.selectComponent('#modalRedoComponent').open();
              return;
            }
            app.globalData.cando = false;
            this.setData({
              recordStep: 2
            })
            this._recordTimerFunc();
          })
          break;
        case 2:
          app.stopRecord((res) => {
            console.log(res);
            wx.uploadFile({
              url: app.globalData.apiPrefix + '/apps/mp/lessonSectionContent/upload',
              filePath: res,
              name: 'proFile',
              formData: {
                fileType: 7,
                fileText: _this.properties.readTxt
              },
              header: {
                // "token": wx.getStorageSync('token')
              },
              success: function(ress) {
                console.log(ress);
                let ossurl = (JSON.parse(ress.data)).data.OSSUrl;
                let score = (JSON.parse(ress.data)).data.socres
                _this.setData({
                  ['answerObj.value']: ossurl,
                  ['answerObj.score']: _this.data.score
                })
                console.log(_this.data.answerObj)
                phRuserLessonQaSubmitAnswer(_this.data.answerObj, (ttt) => {
                  if (ttt.code == 200) {
                    console.log('上传完毕');
                    app.globalData.cando = true;
                    _this.setData({
                      loadingIsShow: false,
                      url: ossurl,
                      recordStep: _this.properties.isCommit ? 1 : 3,
                      timer: 0,
                      timerFormat: "00' 00'",
                      score: (JSON.parse(ress.data)).data.socres
                    });
                    if (_this.properties.isCommit) {
                      _this.triggerEvent('recorderEndCallback', app.globalData.tempAudio);
                    }
                  }
                })
              }
            })
            clearInterval(recordTimerFunc);
            this.setData({
              timer: 0,
              timerFormat: "00' 00'",
              loadingIsShow: true
            })
          })
          break;
        case 3:
          if (app.globalData.cando === false) {
            this.selectComponent('#modalRedoComponent').open();
            return;
          }
          app.globalData.audioWorkingId = Number(this.properties.did);
          app.globalData.cando = false;
          this.setData({
            recordStep: 4
          });
          // innerAudioContext.src = this.data.url;
          innerAudioContext.src = this.data.url;
          if (this.properties.resourceUrl) {
            console.log('this.properties.resourceUrl')
            innerAudioContext.src = this.properties.resourceUrl;
          }
          // console.log(innerAudioContext.src)
          // console.log(this.data)
          innerAudioContext.play();
          let a = setInterval(() => {
            if (innerAudioContext.duration) {
              clearInterval(a);
              this.setData({
                duration: innerAudioContext.duration,
                durationShow: Math.round(innerAudioContext.duration, 2)
              });
              playTimerFunc = setInterval(() => {
                this.setData({
                  playingSecond: this.data.playingSecond + 0.1,
                  playingShowSecond: Math.ceil(this.data.duration - this.data.playingSecond - 0.1),
                  playingLeft: 100 - Math.round((this.data.playingSecond + 1) / this.data.duration * 100)
                })
                // console.log(this.data.playingSecond)
              }, 100);
            }
          }, 10);
          break;
        case 4:
          innerAudioContext.stop();
          this.playEnd();
          break;
      }
    },

    playEnd() {
      console.log('playEnd')
      this.setData({
        recordStep: 3,
        playingSecond: 0,
        playingLeft: 100
      });
      app.globalData.cando = true;
      clearInterval(playTimerFunc);
    },

    clickRecordAgain() {
      this.setData({
        recordStep: 1
      });
    },

    _recordTimerFunc() {
      let _this = this;
      recordTimerFunc = setInterval(() => {
        _this.setData({
          timer: _this.data.timer + 1
        });
        let a = Math.floor(_this.data.timer / 60);
        let b = Math.floor(_this.data.timer % 60);
        _this.setData({
          timerFormat: (a < 10 ? ("0" + a) : a) + "' " + (b < 10 ? ("0" + b) : b) + "'"
        })
      }, 1000);
    }

  }
})