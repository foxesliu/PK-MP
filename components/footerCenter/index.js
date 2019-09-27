Component({
  properties: {
    active: String
  },

  data: {
    current: 0
  },

  ready() {
    this.setData({
      current: this.properties.active ? Number(this.properties.active) : 0
    });
    console.log(this.data.current);
  },

  methods: {
    goToHuiben(){
      wx.redirectTo({
        url: '/pages/huiben/huiben',
      })
    },
    goToindex(){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    },
    goToCenter() {
      wx.redirectTo({
        url: '/pages/center/index',
      })
    }
  }
})