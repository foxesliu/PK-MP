import {
  newContent
} from '../../model.js';
let videoContext = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touchS: [0, 0],
    touchE: [0, 0],
    videoUrl: '',
    isPlaying: false,
    shadowShowed2: 2,
    mainContainerShowIndex: 0,
    sections: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.getStorageSync('shadowShowed2') != 0) {
      this.setData({
        shadowShowed2: 0
      });
    } else {
      this.setData({
        shadowShowed2: 1
      });
    }
    newContent(wx.getStorageSync('newPageRuserId'), wx.getStorageSync('newPagePrlId'), (res) => {
      let r = res.data.lessonSectionContentObjVos;
      for (let i = 0; i < r.length; i++) {
        let a = r[i]['rightOrWrong'];
        if (a != 'null') {
          let s = JSON.parse(JSON.parse(a));
          r[i].rOw = s.type;
          r[i].rOwText = s.content;
        } else {
          r[i].rOw = -1;
          r[i].rOwText = '';
        }
      }
      this.setData({
        sections: res.data.lessonSectionContentObjVos
      });
    })
    this.showMainIndex();
  },

  showMainIndex() {
    setTimeout(() => {
      console.log(this.data.mainContainerShowIndex);
    }, 10)
  },

  bindscrolltoupper: function() {
    console.log('顶部没有了');
    setTimeout(() => {
      if (this.data.mainContainerShowIndex > 0) {
        this.setData({
          mainContainerShowIndex: this.data.mainContainerShowIndex - 1
        });
      }
      this.showMainIndex();
    }, 200);
  },

  bindscrolltolower: function() {
    console.log('底部没有了')
    setTimeout(() => {
      if (this.data.mainContainerShowIndex < this.data.sections.length - 1) {
        this.setData({
          mainContainerShowIndex: this.data.mainContainerShowIndex + 1
        });
      }
      this.showMainIndex();
    }, 200);

  },

  hideShadow() {
    this.setData({
      shadowShowed2: this.data.shadowShowed2 === 1 ? 2 : 0
    });
    wx.setStorageSync('shadowShowed2', 1);
  },

  playVideo(s) {
    this.setData({
      isPlaying: true,
      videoUrl: s.detail
    });
    setTimeout(() => {
      console.log(this.data);
      videoContext = wx.createVideoContext('video');
      videoContext.requestFullScreen();
      videoContext.play();
    }, 10);
  },

  bindfullscreenchange(e) {
    if (e.detail.fullScreen === false) {
      videoContext.stop();
      this.setData({
        isPlaying: false,
      });
    }
  },

  onReady: function() {},

  onShow: function() {},

  onShareAppMessage: function() {}
})