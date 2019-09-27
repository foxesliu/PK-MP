const app = getApp();
let videoContext = null;

Component({
  properties: {
    resourceUrl: String
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
      this.triggerEvent('playVideo', this.properties.resourceUrl);
    }
  }
})