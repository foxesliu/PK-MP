Component({

  properties: {
    leftActive: Number
  },

  data: {
    sShow: true,
    hasComment: true,
    active: 0,
    touch2S: [0, 0],
    touch2E: [0, 0]
  },

  ready() {
    //this.getActive();
  },

  methods: {

    changeActive() {
      console.log(this.properties.leftActive)
      this.setData({
        active: wx.getStorageSync('leftActiveNewPage'),
        // sShow: true
      });
    },
    changeShow(){
      if (this.data.sShow) {
        this.setData({
          sShow: false
        });
      } else {
        this.setData({
          sShow: true
        });
      }
    },
    gotoPage: function(e) {
      console.log(e.currentTarget.dataset.id);
      this.triggerEvent('changecurrent', e.currentTarget.dataset.id);
      
      // let start = this.data.touch2S
      // let end = this.data.touch2E
      // if (start[0] > end[0] + 20) {
      //   this.setData({
      //     sShow: true
      //   });
      // } else if (start[0] < end[0] - 20) {
      //   this.setData({
      //     sShow: false
      //   });
      // }
    },

    // getActive: function() {
    //   setTimeout(() => {
    //     this.setData({
    //       active: wx.getStorageSync('leftActive') || 1
    //     });
    //   }, 10);
    // },

    touchStart2: function(e) {
      let sx = e.touches[0].pageX
      let sy = e.touches[0].pageY
      this.data.touch2S = [sx, sy]
    },
    touchMove2: function(e) {
      let sx = e.touches[0].pageX;
      let sy = e.touches[0].pageY;
      this.data.touch2E = [sx, sy]
    },
    touchEnd2: function(e) {
      let start = this.data.touch2S
      let end = this.data.touch2E
      if (start[0] > end[0] + 20) {
        this.setData({
          sShow: true
        });
      } else if (start[0] < end[0] - 20) {
        this.setData({
          sShow: false
        });
      }
    },
  }
})