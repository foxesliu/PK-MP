Component({
  properties: {
    txt: String,
    audioWorkingId: String,
    cannotDo: String
  },

  data: {
    value: ''
  },

  ready() {
    // console.log(this.properties.txt)
  },

  methods: {
    input(e) {
      this.setData({
        value: e.detail.value
      });
    },
    submit() {
      if (this.properties.cannotDo) {
        return;
      }
      if (this.data.value) {
        this.triggerEvent('inputComplete', {
          extra: this.properties.audioWorkingId,
          txt: this.data.value
        });
        this.setData({
          value: ''
        });
      }
    }
  }
})