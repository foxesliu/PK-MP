// const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
let playTimerFunc;
let a;

Component({
  properties: {
    index: Number,
    url: String,
    nickName: String,
    date: String,
    avatarUrl: String
  },

  ready() {
    // console.log(this.properties.index);
    // innerAudioContext.onEnded(() => {
    //   if (app.globalData.audioWorkingId == this.properties.index) {
    //     this.endAudioFun();
    //   }
    // });
  },

  data: {
    isPlaying: false,
    duration: 0,
    durationShow: 0,
    playingSecond: 0,
    playingShowSecond: '点击右侧'
  },

  methods: {
    play() {
      if (app.globalData.cando === false) {
        this.selectComponent('#modalRedoComponent').open();
        return;
      }
      let _this = this;
      console.log(this.properties);
      this.setData({
        isPlaying: true
      });
      console.log(this.properties.index);
      app.startAudio({
        url: _this.properties.url,
        audioWorkingId: 'aaa' + _this.properties.index,
        cannotCallback: function() {
          _this.selectComponent('#modalRedoComponent').open();
        },
        playStartCallback: function() {
          a = setInterval(() => {
            console.log(app.globalData.innerAudioContext.duration)
            if (app.globalData.innerAudioContext.duration) {
              console.log(app.globalData.innerAudioContext.duration)
              clearInterval(a);
              _this.setData({
                duration: app.globalData.innerAudioContext.duration,
                durationShow: Math.ceil(app.globalData.innerAudioContext.duration, 2)
              });
              playTimerFunc = setInterval(() => {
                _this.setData({
                  playingSecond: _this.data.playingSecond + 1,
                  playingShowSecond: Math.ceil(_this.data.duration - _this.data.playingSecond - 1) + "''"
                })
                // console.log(this.data.playingSecond)
              }, 1000);
            }
          }, 10);
        },
        playEndCallback: function() {
          console.log(app.globalData.audioWorkingId)
          console.log('aaa' + _this.properties.index)
          clearInterval(playTimerFunc);
          if (app.globalData.audioWorkingId == 'aaa' + _this.properties.index) {
            console.log('播放完成');
            _this.endAudioFun();
          }
        }
      })
    },
    stop() {
      app.globalData.innerAudioContext.stop();
      this.endAudioFun();
    },

    endAudioFun() {
      console.log('endAudioFun');
      clearInterval(playTimerFunc);
      clearInterval(a);
      this.setData({
        isPlaying: false,
        // duration: 0,
        durationShow: 0,
        playingSecond: 0,
        playingShowSecond: this.data.duration ? Math.ceil(this.data.duration) + "''" : "点击右侧"
      });
      app.globalData.cando = true;
    },
  },

  detached() {
    console.log('--------detached----------')
    this.stop();
  },

  pageLifetimes: {
    hide() {
      console.log('--------hidden----------')
      this.stop();
    },
  }
})