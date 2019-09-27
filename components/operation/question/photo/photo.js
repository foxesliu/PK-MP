Component({
  properties: {
    resourceUrl: String
  },

  data: {},

  methods: {
    showPic(a) {
      let url = a.currentTarget.dataset.src;
      wx.previewImage({
        urls: [url]
      })
    }
  }
})