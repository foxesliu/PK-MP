Component({
  properties: {
    modal: String,
    test: String,
    type: String,
    value: String,
    score100: String,
    secCid: String,
    open:Boolean
  },

  data: {
    active: false
  },

  ready() {
    if (this.properties.modal == 'true') {
      this.setData({
        active: true
      });
    }
  },

  methods: {
    click() {
      if (!this.properties.modal) {
        this.setData({
          active: !this.data.active
        });
        this.triggerEvent('toggle', {
          active: this.data.active,
          test: this.properties.test,
          type: this.properties.type,
          value: this.properties.value,
          score100: this.properties.score100,
          secCid: this.properties.secCid,
          open: this.properties.open
        });
      }
    }
  }
})