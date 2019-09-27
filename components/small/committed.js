Component({
  properties: {
    active: Boolean,
    txt: String
  },

  data: {
    text: ''
  },

  ready() {
    this.setData({
      text: this.properties.txt ? this.properties.txt : '确定提交'
    })
  },

  methods: {
    committed() {
      if (this.properties.active) {
        this.triggerEvent('committed');
      }
    }
  }
})