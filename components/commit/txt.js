Component({
  properties: {
    txt: String
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
      if (this.data.value) {
        this.triggerEvent('inputComplete', this.data.value);
        this.setData({
          value: ''
        });
      }
    }
  }
})