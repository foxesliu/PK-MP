// const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
let recordTimerFunc;
let playTimerFunc;

Component({
  properties: {
    readTxt: String,
    did: String,
    isAsk: Boolean,
    resourceUrl: String,
    isCommit: Boolean
  },

  data: {
    timer: 0,
    timerFormat: "00' 00'",
    recordStep: 3,
    duration: 0,
    playingSecond: 0,
    playingShowSecond: 0,
    playingLeft: 100,
    loadingIsShow: false,
    url: ''
  },

  ready() {
    if (this.properties.resourceUrl) {
      this.setData({
        url: this.properties.resourceUrl,
        recordStep: 3
      });
    }
    let _this = this;
    innerAudioContext.onEnded(() => {
      if (app.globalData.audioWorkingId == this.properties.did) {
        console.log('播放完成');
        this.playEnd();
      }
    });
    // console.log(this.properties.did)
  },

  methods: {
    record() {
      if (this.properties.isAsk) {
        return;
      }
      switch (this.data.recordStep) {
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
          if (this.properties.resourceUrl) {
            innerAudioContext.src = this.properties.resourceUrl;
          }
          innerAudioContext.src = this.data.url;
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
                console.log(this.data.playingSecond)
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