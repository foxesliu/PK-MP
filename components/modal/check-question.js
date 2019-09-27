Component({
  properties: {},

  data: {
    show: false
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
    }
  }
})