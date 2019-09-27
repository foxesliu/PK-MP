const app = getApp();
Component({
  properties: {},

  data: {
    showing: true
  },

  ready() {
    // this.open();
  },

  methods: {
    open() {
      if (app.globalData.modalShow === false) {
        this.setData({
          show: true
        });
        app.globalData.modalShow = true;
        let a = setTimeout(() => {
          // clearTimeout(a);
          this.setData({
            show: false
          });
          app.globalData.modalShow = false;
        }, 1000);
      }

    }
  },
})