Component({
  properties: {
    txt: String
  },

  data: {
    show: false,
    text: ''
  },

  ready() {
    // this.open();
    this.setData({
      text: this.properties.txt || '本次修改'
    })
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
      this.triggerEvent('giveupEsc');
    },
    yes() {
      this.setData({
        show: false
      });
      this.triggerEvent('giveupcallback');
    }
  }
})