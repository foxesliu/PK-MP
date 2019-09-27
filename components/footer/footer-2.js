Component({
  properties: {
    active: String,
    complete: Boolean
  },

  data: {
    current: 0,
    isComplete: false
  },

  ready() {
    this.setData({
      current: this.properties.active ? Number(this.properties.active) : 0,
      isComplete: this.properties.complete
    });
    // console.log(this.data.current);
  },

  methods: {
    gotoHuiben() {
      wx.redirectTo({
        url: '/pages/huiben/huiben',
      })
    },
    gotoCenter() {
      wx.redirectTo({
        url: '/pages/center/index',
      })
    },
    gotoHome(){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
  }
})