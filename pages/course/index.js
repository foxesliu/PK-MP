const app = getApp();
let videoContext = null;
import {
  getPhRuserLesson,
  getPhRuserLessonExtra
} from '../../model.js';
import {
  gotoLessonPage
} from '../../public/js/util.js';

Page({
  data: {
    list: [],
    tabActive: 0,
    list1: [],
    length1: 0,
    list2: [],
    length2: 0,
    list3: [],
    length3: 0,
    courseName: '',
    courseId: 0,
    videoIsPlaying: false,
    isPad: false
  },

  onLoad: function(options) {
    this.setData({
      courseId: options.courseId || 91,
      // courseName: options.name || 'course name'
    });
    wx.setStorageSync('courseParams', JSON.stringify(options));
    console.log(this.data);
  },

  onShow: function() {
    // console.log('onShow');
    this.getWillList();
    this.getEdList();
    this.getOtherList();
  },

  closeVideo() {
    videoContext.stop();
    this.setData({
      videoIsPlaying: false,
    });
  },

  gotoLive(e) {
    let _this = this;
    let liveAddr = e.currentTarget.dataset.liveaddr;
    if (liveAddr) {
      let url = JSON.parse(liveAddr)[0]['VUrl'];
      this.setData({
        videoIsPlaying: true,
        videoUrl: url
      });
      videoContext = wx.createVideoContext('video');
      videoContext.play();
      wx.getSystemInfo({
        success(res) {
          if (res.model.indexOf('iPad') <= -1) {
            videoContext.requestFullScreen();
          } else {
            _this.setData({
              isPad: true
            })
          }
        }
      })
    }
  },

  bindfullscreenchange(e) {
    if (e.detail.fullScreen === false) {
      videoContext.stop();
      this.setData({
        videoIsPlaying: false,
      });
    }
    // wx.showModal({
    //   title: '111',
    //   content: JSON.stringify(e.detail.fullScreen),
    // })
  },

  clickTab: function(e) {
    this.setData({
      tabActive: Number(e.currentTarget.dataset.index)
    });
    setTimeout(() => {
      switch (this.data.tabActive) {
        case 0:
          this.setData({
            list: this.data.list1
          });
          break;
        case 1:
          this.setData({
            list: this.data.list2
          });
          console.log(this.data)
          break;
        case 2:
          this.getOtherList();
          break;
      }
    }, 30);
  },

  gotoLesson: function(e) {
    // console.log(e);return;
    let data = e.currentTarget.dataset.data;
    console.log(data);
    wx.setStorageSync('teachId', data.teachId);
    wx.setStorageSync('lessonName', data.lessonName);
    let mode = e.currentTarget.dataset.mode;
    let prlId = e.currentTarget.dataset.prlid;
    let stat = e.currentTarget.dataset.stat;
    if (typeof stat != 'undefined') {
      data.stat = stat;
      data.mode = mode;
      data.prlId = prlId
    }
    data.courseId = this.data.courseId;
    data.isExtra = e.currentTarget.dataset.isextra;
    data.liveAddr = null;
    console.log(data);
    gotoLessonPage(data);
  },

  getWillList: function() {
    getPhRuserLesson({
      type: 0,
      ruserId: wx.getStorageSync('ruserId'),
      courseId: this.data.courseId
    }, (res) => {
      console.log(res);
      this.setData({
        list1: res.data.lessonPackageObjVos,
        // list: res.data.lessonPackageObjVos,
        length1: res.data.qaMessageTotalCount,
        courseName: res.data.courseName
      });
      if (this.data.tabActive == 0) {
        this.setData({
          list: res.data.lessonPackageObjVos,
        })
      }
      console.log(this.data.list);
    })
  },

  getEdList: function() {
    getPhRuserLesson({
      type: 1,
      ruserId: wx.getStorageSync('ruserId'),
      courseId: this.data.courseId
    }, (res2) => {
      this.setData({
        list2: res2.data.lessonPackageObjVos,
        // list: res2.data.lessonPackageObjVos,
        length2: res2.data.qaMessageTotalCount
      })
      if (this.data.tabActive == 1) {
        this.setData({
          list: res2.data.lessonPackageObjVos,
        })
      }
    })
  },

  getOtherList: function() {
    getPhRuserLessonExtra({
      ruserId: wx.getStorageSync('ruserId'),
      courseId: this.data.courseId,
      isExtra: 1,
    }, (res3) => {
      console.log(res3);
      this.setData({
        length3: res3.data.extraQaMessageCount,
        list3: res3.data.extraLessonPackageObjVo
      })
    });
  }

});