Component({
  properties: {
    item: Object,
    secId: String,
    it: {
      type: Object,
      value: '',
      observer: function(newVal, oldVal) {
        console.log(newVal, oldVal);
      }
    },
  },

  data: {
    pic:'',
    name:''
  },

  ready() {
    setTimeout(() => {
      //console.log(this.properties.item.annotationStat); //1是已读，灰色
      // console.log(this.properties.secId)
      let a = this.properties.it['originator'];
      let b;
      console.log(a);
      if(a){
        b = JSON.parse(a);
      }
      console.log(b);
      this.setData({
        pic: b.avatarUrl,
        name: b.nickName
      })
    }, 100)
  },

  methods: {
    gotoPage() {
      // console.log(this.properties.item);
      return;
      wx.navigateTo({
        url: '/pages/lesson/index',
      })
    }
  }
})