const app = getApp();

Component({
  properties: {
    isAsk: Boolean,
    resourceUrl: String
  },

  data: {
    url: ''
  },

  ready() {
    if (this.properties.resourceUrl) {
      this.setData({
        url: this.properties.resourceUrl
      });
    }
  },

  methods: {
    upload() {
      if (this.properties.isAsk) {
        return;
      }
      let _this = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths[0]);
          _this.triggerEvent('uploadComplete', tempFilePaths[0]);
        }
      })
    }

  }
})