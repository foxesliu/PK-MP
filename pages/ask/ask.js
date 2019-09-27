const app = getApp();
import {
  lessonSectionContentQuery
} from '../../model.js';
import {
  parseParam
} from '../../public/js/util.js';

Page({
  data: {
    questionsList: [],
    committedActive: false,
    isPlaying: false,
    list: [],
    videoIsPlaying: false,
    videoPlayingIndex: 0,
    videoList: [],
    videoPoster: app.globalData.videoPoster,
    options: {
      courseId: "91",
      extraTime: "2019-02-21 09:53:25.0",
      isExtra: "1",
      lessonId: "985",
      lessonName: "1",
      mode: "0",
      prlId: "null",
      ruserId: "293773",
      stat: "2",
      teachId: "389",
      thisExtraLessonCount: "0"
    },
    selectedArray: [],
    avatarUrl: wx.getStorageSync('pic'),
    nickName: wx.getStorageSync('name')
  },

  onLoad: function(options) {
    console.log(options);
    console.log(parseParam(options));
    this.setData({
      options: options,
      selectedArray: JSON.parse(options.selectedArray)
    });
    console.log(this.data);
  },

  onShow: function() {
    console.log('onShow');
    this.getAudioList();
    this.getVideoList();
    // console.log(app.globalData.byAskingQuestions);
    if (app.globalData.byAskingQuestions.length) {
      this.setData({
        questionsList: app.globalData.byAskingQuestions,
        committedActive: true
      });
    }
    setTimeout(() => {
      this.setData({
        obj: {
          ruserId: wx.getStorageSync('ruserId'),
          lessonId: this.data.options.lessonId,
          isExtra: this.data.options.isExtra,
          courseId: this.data.options.courseId,
          mode: this.data.options.mode,
          prlId: this.data.options.prlId
        }
      });
      console.log(this.data.obj);
      this._lessonSectionContentQuery();
    }, 100);
  },

  _lessonSectionContentQuery() {
    this.setData({
      defaultObj: {
        secId: this.data.options.secId,
        ruserId: wx.getStorageSync('ruserId'),
        mode: this.data.options.mode,
        isExtra: this.data.options.isExtra,
        stat: this.data.options.stat,
        prlId: this.data.options.prlId
      }
    })
    console.log(this.data.defaultObj);
    lessonSectionContentQuery(this.data.defaultObj, (res) => {
      console.log(res);
      let list = res.data.contentVos;
      let list2 = [];
      for (let i = 0; i < list.length; i++) {
        if (this.data.selectedArray.indexOf(i) > -1) {
          list2.push(list[i]);
        }
      }
      this.setData({
        committedActive: false,
        list: list2,
        // secCid: res.data.contentVos[0]['secCid'],
        // answerId: res.data.contentVos[0]['answerId'] ? res.data.contentVos[0]['answerId'] : 0,
        // imageSrc: res.data.contentVos[0].answerValue || res.data.contentVos[0].value,
        // footerhasAudio: res.data.contentVos.length > 1 ? true : false,
        // tempAudioPath: res.data.contentVos.length > 1 ? res.data.contentVos[1].value : '',
      });
      console.log(this.data);
      // innerAudioContext.src = this.data.tempAudioPath;
    })
  },

  submit() {
    console.log('提交');
    app.globalData.byAskingQuestions = [];
    console.log(app.globalData.byAskingQuestions);
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  gotoCommitAudioPage() {
    wx.showToast({
      title: '点了发语音',
    })
    wx.redirectTo({
      url: '/pages/ask/ask-audio?' + parseParam(this.data.options),
    })
  },

  gotoCommitTxtPage() {
    wx.showToast({
      title: '点了发文字',
    })
    wx.redirectTo({
      url: '/pages/ask/ask-txt?' + parseParam(this.data.options)
    })
  },

  getAudioList() {
    this.setData({
      list: [{
        id: 1,
        url: app.globalData.tempAudio,
        playing: false
      }, {
        id: 2,
        url: app.globalData.tempAudio2,
        playing: false
      }, {
        id: 3,
        url: app.globalData.tempAudio,
        playing: false
      }]
    })
  },

  getVideoList() {
    this.setData({
      videoList: [{
          id: 11,
          url: app.globalData.tempVideo,
          playing: false
        },
        {
          id: 12,
          url: app.globalData.tempVideo2,
          playing: false
        }
      ]
    })
  },

  // onShareAppMessage: function() {}
})