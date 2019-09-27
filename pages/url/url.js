Page({
  data: {
    url: ''
  },

  onLoad: function(options) {
    this.setData({
      url: decodeURIComponent(options.url)
    });
    console.log(this.data)
  },

})