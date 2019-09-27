const app = getApp();
import {
  uploadFile
} from '../../../public/js/util.js';

Component({
  properties: {
    answerValue: String
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
    }
  }
})