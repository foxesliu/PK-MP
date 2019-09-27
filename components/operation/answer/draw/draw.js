const app = getApp();
import {
  uploadFile
} from '../../../../public/js/util.js';

Component({
  properties: {
    value: String,
    answerValue: String,
    cannotDo: String,
    replyIcon: String,
    audioWorkingId: String,
    isCommit: String
  },

  ready() {
    this.initialize();
    console.log('------------ready--------');
  },

  data: {
    url: ''
  },

  pageLifetimes: {
    show: function() {
      this.initialize();
      console.log('-------pageLifetimes-show-----------');
    },
  },

  methods: {
    initialize() {
      console.log(this.properties);
      this.setData({
        url: this.properties.answerValue ? this.properties.answerValue : ''
      });
    },

    showPic(a) {
      let url = a.currentTarget.dataset.src;
      wx.previewImage({
        urls: [url]
      })
    },

    toDraw() {
      if (this.properties.cannotDo == 'true') {
        wx.showModal({
          content: '已批改，您不能再次作答了',
        })
        return;
      }
      this.selectComponent('#toDrawComponent').open();
    },

    gotoDrawPage() {
      wx.setStorageSync('dataDrawOverSecCid', this.properties.audioWorkingId);
      let img = this.properties.answerValue || this.properties.value;
      if (this.properties.cannotDo == 'true') {
        return;
      }
      wx.navigateTo({
        url: `/pages/dowork/draw-fordata?image=${img}`,
      });
    },

    clickUploadAgain() {
      this.setData({
        url: ''
      })
    }
  }
})