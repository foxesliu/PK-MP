Component({
  properties: {
    rightOrWrong: String,
    isHide11: Boolean
  },

  data: {
    isShow: false,
    rightOrWrongIsShow: false,
    labelIsShow: false,
    score: 1,
    txt: '非常好！比上次有进步！',
    left: '',
    top: '',
    left2: '',
    top2: ''
  },

  ready() {
    setTimeout(() => {
      console.log(this.properties);
      let o = this.properties.rightOrWrong;
      console.log(o)
      let t;
      if (o == 'null' || !o) {
        console.log('数据错误');
        // wx.showModal({
        //   title: "提示",
        //   showCancel: false,
        //   content: '数据错误'
        // });
      } else {
        t = JSON.parse(JSON.parse(o));
        console.log(t);
        this.setData({
          score: t.type,
          txt: t.content,
          isShow: true,
          rightOrWrongIsShow: true,
          labelIsShow: true,
        })
      }
      if (this.properties.isHide11) {
        this.setData({
          rightOrWrongIsShow: false
        })
      }
    }, 1000);
  },

  methods: {
    changeRightOrWrongIsShow() {
      this.setData({
        rightOrWrongIsShow: !this.data.rightOrWrongIsShow,
        isShow: true,
      });
    },

    bindtouchmove(e) {
      this.setData({
        left: e.touches[0].clientX - 64,
        top: e.touches[0].clientY - 20
      })
    },

    bindtouchmove2(e) {
      this.setData({
        left2: e.touches[0].clientX - 64,
        top2: e.touches[0].clientY - 20
      })
    },

    changeLabelShow() {
      this.setData({
        labelIsShow: !this.data.labelIsShow
      });
      setTimeout(() => {
        this.triggerEvent('changeLabelShow', this.data.labelIsShow);
      }, 10);
    }
  }
})