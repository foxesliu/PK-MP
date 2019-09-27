Component({
  properties: {
    labelShow: Boolean,
    labelList: String,
    secId: String,
    from: String
  },

  data: {
    // labelIsShow: true,
    list: [],
    xOffset: 50, //15
    yOffset: 45, //24
  },

  ready() {
    let _this = this;
    console.log(this.properties);
    console.log(this.properties.labelShow);
    setTimeout(() => {
      //console.log(this.properties.secId);
    }, 100);
    let list2 = JSON.parse(this.properties.labelList);
    console.log(list2);
    for (let i = 0; i < list2.length; i++) {
      list2[i]['location'] = list2[i]['serialNum'];
    }
    let sourceList = list2;
    for (let i = 0; i < sourceList.length; i++) {
      sourceList[i]['y'] = Math.floor(sourceList[i]['location'] / 15);
      sourceList[i]['x'] = sourceList[i]['location'] % 15;
    }
    console.log(sourceList);
    this.setData({
      list: sourceList
    });
    console.log(this.data.list);
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPad') > -1) {
          _this.setData({
            xOffset: wx.getSystemInfoSync().windowHeight * 0.694 / 15, //15
            yOffset: wx.getSystemInfoSync().windowHeight / 24, //24
          })
        }
        // console.log(_this.data.canvasWidth);
      }
    })
  },

  methods: {
    gotoDetail(e) {
      let a = e.currentTarget.dataset.item;
      let b = a.mongodbqaId;
      let c = a.qaId;
      let d = a.secCid;
      console.log(a, b, c, d);
      let sourceType = a['sourceType'];
      let annotationStat = a['annotationStat'];
      console.log(sourceType, annotationStat);
      let ccc = '1';
      if (sourceType == 1 && annotationStat == 0) {
        ccc = '0';
      }
      wx.setStorageSync('statSourceTypeAnnotationStat', ccc)
      // return;
      if (this.properties.from == 'share') {
        wx.navigateTo({
          url: `/pages/share/tip-detail?mongoDBqaId=${b}&qaId=${c}&secId=${this.properties.secId}&from=share`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/lesson/postil-detail?mongoDBqaId=${b}&qaId=${c}&secId=${this.properties.secId}`,
        })
      }
    }
  }
})