const app = getApp();
let recordTimerFunc;
let playTimerFunc;
import {
  uploadFile
} from '../../../public/js/util.js';

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
    step: 3,
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
    this.setData({
      score: this.properties.score100 ? this.properties.score100 : 1,
      url: this.properties.resourceUrl ? this.properties.resourceUrl : '',
      //step: this.properties.resourceUrl ? 3 : 1
    });
  },

  methods: {
    record() {
      let _this = this;
      switch (this.data.step) {
        case 3:
          console.log(this.data.url);
          app.startAudio({
            url: this.data.url,
            audioWorkingId: this.properties.audioWorkingId,
            cannotCallback: function () {
              _this.selectComponent('#modalRedoComponent').open();
            },
            playStartCallback: function () {
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
            playEndCallback: function () {
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
    app.endAudio();
  },

})