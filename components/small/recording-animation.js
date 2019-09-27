Component({
  properties: {},

  data: {
    list: []
  },

  ready() {
    let list = [];
    list.length = 26;
    this.setData({
      list: list
    });
  },

  methods: {}
})