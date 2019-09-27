const app = getApp();
import {
  uploadFile
} from '../../../public/js/util.js';

Component({
  properties: {
    resourceUrl: String,
    cannotDo: String,
    replyIcon: String,
    audioWorkingId: String,
    isCommit: String
  },

  data: {
    url: '',
    isPlaying: false,
    videoPoster: app.globalData.videoPoster
  },

  ready() {
    this.setData({
      url: this.properties.resourceUrl ? this.properties.resourceUrl : ''
    });
  },

  methods: {
    playVideo(e) {
      this.triggerEvent('playVideo', this.properties.resourceUrl);
    }
  }
})