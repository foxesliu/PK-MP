Component({
  properties: {},

  data: {
    show: false
  },

  ready() {
    // this.open();
  },

  methods: {
    open() {
      this.setData({
        show: true
      });
    },
    close() {
      this.setData({
        show: false
      });
      this.triggerEvent('clickEsc');
    },
    sure() {
      this.setData({
        show: false
      });
      this.triggerEvent('delCallback');
    }
  }
})