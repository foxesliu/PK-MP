const app = getApp();
let recordTimerFunc;
let playTimerFunc;
import {
  uploadFile
} from '../../../../public/js/util.js';

Component({
  properties: {
    audioWorkingId: String,
    readtxt: String,
    resourceUrl: String,
    replyIcon: String,
    cannotDo: String,
    score100: String,
    scoreHidden: String,
    isCommit: String,
    open: Boolean
  },

  data: {
    timer: 0,
    timerFormat: "00' 00'",
    step: 1,
    duration: 0,
    durationShow: '点击右侧',
    playingSecond: 0,
    playingShowSecond: 0,
    playingLeft: 100,
    loadingIsShow: false,
    url: '',
    score: 0,
    recorderManager: null
  },

  ready() {
    console.log(this.properties);
    console.log(typeof this.properties.open)
    this.setData({
      score: this.properties.score100 ? this.properties.score100 : 0,
      url: this.properties.resourceUrl ? this.properties.resourceUrl : '',
      step: this.properties.resourceUrl ? 3 : 1
    });
    // if (app.globalData.recorderManager) {
    //   this.stopRecord11();
    // }
  },

  methods: {
    stopRecord() {
      // 
    },

    record() {
      let _this = this;
      switch (this.data.step) {
        case 1:
          if (this.properties.cannotDo) {
            wx.showModal({
              content: '已批改，您不能再次作答了',
            })
            return;
          }
          if (app.globalData.cando == false) {
            _this.selectComponent('#modalRedoComponent').open();
            return;
          }
          app.globalData.cando = false;
          _this.setData({
            recorderManager: wx.getRecorderManager(),
            step: 2
          })
          this._recordTimerFunc();
          _this.data.recorderManager.start({
            format: 'mp3',
            duration: app.globalData.audioTime * 1000
          });
          // setTimeout(() => {
          //   _this.stopRecord();
          // }, 10);
          break;
        case 2:
          console.log('step=2')
          _this.data.recorderManager.stop();
          this.data.recorderManager.onStop((aaa) => {
            console.log(aaa);
            // wx.showToast({
            //   title: '已停止',
            // });
            // console.error('已停止');
            let res = aaa.tempFilePath;
            setTimeout(() => {
              console.log('setTimeout');
              uploadFile({
                filePath: res,
                fileText: _this.properties.readtxt,
                fileType: _this.properties.isCommit ? 10 : 7,
                beforeCallback: function() {
                  console.log('---------beforeCallback111-----------');
                  _this.selectComponent('#modalLoadingComponent').open();
                  clearInterval(recordTimerFunc);
                  _this.setData({
                    timer: 0,
                    timerFormat: "00' 00'",
                    step: 3
                  })
                  if (_this.properties.isCommit) {
                    _this.setData({
                      step: 1
                    })
                  }
                  console.log('---------beforeCallback222-----------');
                  console.log(_this.data);
                  console.log('---------beforeCallback333-----------');
                },
                errorCallback: function() {
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
                  _this.setData({
                    score: score,
                    url: ossurl
                  });
                  app.globalData.cando = true;
                  _this.selectComponent('#modalLoadingComponent').close();
                  if (!ossurl) {
                    wx.showModal({
                      title: "提示",
                      showCancel: false,
                      content: '请重新录音',
                    });
                  } else {
                    _this.triggerEvent('recordend', {
                      ossurl: ossurl,
                      score: score,
                      extra: _this.properties.audioWorkingId
                    });
                  }
                }
              })
            }, 10);
          })
          break;
        case 3:
          console.log(this.data.url);
          app.startAudio({
            url: this.data.url,
            audioWorkingId: this.properties.audioWorkingId,
            cannotCallback: function() {
              _this.selectComponent('#modalRedoComponent').open();
            },
            playStartCallback: function() {
              _this.setData({
                step: 4
              });
              let a = setInterval(() => {
                if (app.globalData.innerAudioContext.duration) {
                  clearInterval(a);
                  _this.setData({
                    duration: app.globalData.innerAudioContext.duration,
                    durationShow: Math.round(app.globalData.innerAudioContext.duration, 2)
                  });
                  playTimerFunc = setInterval(() => {
                    _this.setData({
                      playingSecond: _this.data.playingSecond + 0.1,
                      playingShowSecond: Math.ceil(_this.data.duration - _this.data.playingSecond - 0.1),
                      playingLeft: 100 - Math.round((_this.data.playingSecond + 1) / _this.data.duration * 100)
                    })
                  }, 100);
                }
              }, 10);
            },
            playEndCallback: function() {
              if (app.globalData.audioWorkingId == _this.properties.audioWorkingId) {
                console.log('播放完成');
                _this.playEnd();
              }
            }
          })
          break;
        case 4:
          app.endAudio(_this.playEnd())
          break;
      }
    },

    playEnd() {
      console.log('playEnd')
      this.setData({
        step: 3,
        playingSecond: 0,
        playingLeft: 100
      });
      app.globalData.cando = true;
      clearInterval(playTimerFunc);
    },

    clickRecordAgain() {
      this.setData({
        step: 1
      });
    },

    _recordTimerFunc() {
      let _this = this;
      recordTimerFunc = setInterval(() => {
        _this.setData({
          timer: _this.data.timer + 1
        });
        if (this.data.timer > app.globalData.audioRecordTime) {
          this.record();
        }
        let a = Math.floor(_this.data.timer / 60);
        let b = Math.floor(_this.data.timer % 60);
        _this.setData({
          timerFormat: (a < 10 ? ("0" + a) : a) + "' " + (b < 10 ? ("0" + b) : b) + "'"
        })
      }, 1000);
    }

  },

  detached() {
    app.globalData.cando = true
    if (this.data.recorderManager) {
      this.data.recorderManager.stop();
    }
    app.endAudio();
  },

})