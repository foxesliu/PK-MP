const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
let playTimerFunc;

Component({
  properties: {
    item: Object,
    index: Number,
    isAsk: Boolean
  },

  data: {
    isPlaying: false,
    duration: 0,
    playingSecond: 0,
    playingShowSecond: 0
  },

  ready() {
    innerAudioContext.onEnded(() => {
      if (app.globalData.audioWorkingId == this.properties.index) {
        this.endAudioFun();
      }
    });
  },

  methods: {
    stopAudio() {
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

    playAudio() {
      // console.log(app.globalData.cando)
      // this.triggerEvent('playingIndex', this.properties.index);
      if (app.globalData.cando === false) {
        this.selectComponent('#modalRedoComponent').open();
        return;
      }
      // if (this.properties.isAsk) {
      //   return;
      // }
      app.globalData.audioWorkingId = Number(this.properties.index);
      app.globalData.cando = false;
      innerAudioContext.src = this.properties.item['url'];
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
    }
  },

})