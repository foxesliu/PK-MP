const app = getApp();

Component({
  properties: {
    item: Object,
    index: Number
  },

  data: {
    isPlaying: false,
    videoPoster: getApp().globalData.videoPoster,
    isAsk: Boolean
  },

  ready() {
    // console.log(this.properties.item);
  },

  methods: {
    playVideo(e) {
      if (this.properties.isAsk === true) {
        return;
      }
      this.setData({
        isPlaying: true
      });
    }
  }
})

// Component({
//   properties: {
//     item: Object,
//     index: Number
//   },

//   data: {
//     isPlaying: false
//   },

//   ready() {

//   },

//   methods: {
//     play(e) {
//       this.setData({
//         isPlaying: true
//       });
//       setTimeout(() => {
//         var videoContext = wx.createVideoContext('aa' + this.properties.index);
//         videoContext.requestFullScreen();
//         // videoContext.seek(0);
//         videoContext.play();
//         console.log(videoContext);
//         console.log(e)
//       }, 100)

//       // this.triggerEvent('playingVideoIndex', this.properties.index);
//     }
//   }
// })