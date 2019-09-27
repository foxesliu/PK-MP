Component({
  properties: {
    txt: String,
    stat: String
  },

  data: {
    show: false
  },

  methods: {
    open() {
      this.setData({
        show: true
      })
      setTimeout(() => {
        this.setData({
          show: false
        });
      }, 1500);
    }
  }
})