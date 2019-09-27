// subpackages/components/label.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index1: Number,
    index2: Number,
    index3: Number
  },

  ready() {
    console.log(this.properties.index1);
    console.log(this.properties.index2);
    console.log(this.properties.index3);
    // return;
    setTimeout(() => {
      let bcie = wx.getStorageSync('newPageDatas')[this.properties.index1]['contentVos'][this.properties.index2]['pzVoList'][this.properties.index3];
      console.log(bcie);
      let c = (bcie['originator']);
      if (c) {
        this.setData({
          a: JSON.parse(c)['avatarUrl'],
        })
        setTimeout(() => {
          console.log(this.data.a);
        }, 10)
      }
    }, 100);
  },

  data: {
    a: ''
  },

  methods: {

  }
})