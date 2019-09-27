const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
let playTimerFunc;

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
    innerAudioContext.onEnded(() => {
      if (app.globalData.audioWorkingId == this.properties.index) {
        this.endAudioFun();
      }
    });
  },

  data: {
    isPlaying: false,
    duration: 0,
    playingSecond: 0,
    playingShowSecond: ''
  },

  methods: {
    play() {
      if (app.globalData.cando === false) {
        this.selectComponent('#modalRedoComponent').open();
        return;
      }
      app.globalData.audioWorkingId = Number(this.properties.index);
      app.globalData.cando = false;
      innerAudioContext.src = this.properties.url;
      innerAudioContext.play();
      this.setData({
        isPlaying: true
      });
      let a = setInterval(() => {
        if (innerAudioContext.duration) {
          clearInterval(a);
          this.setData({
            duration: innerAudioContext.duration,
            durationShow: Math.round(innerAudioContext.duration, 2)
          });
          playTimerFunc = setInterval(() => {
            this.setData({
              playingSecond: this.data.playingSecond + 1,
              playingShowSecond: Math.ceil(this.data.duration - this.data.playingSecond - 1)
            })
            console.log(this.data.playingSecond)
          }, 1000);
        }
      }, 10);
    },
    stop() {
      innerAudioContext.stop();
      this.endAudioFun();
    },

    endAudioFun() {
      this.setData({
        isPlaying: false,
        playingSecond: 0,
        playingShowSecond: Math.ceil(this.data.duration)
      });
      app.globalData.cando = true;
      clearInterval(playTimerFunc);
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