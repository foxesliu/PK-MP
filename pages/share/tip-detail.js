const app = getApp();
import {
  phRuserLessonQaInformation
} from '../../model.js';
import {
  parseParam
} from '../../public/js/util.js';

Page({
  data: {
    allList: [],
    info: {},
    replyBoxIsShow: false,
    isPlaying: false,
    list: [],
    videoIsPlaying: false,
    videoPlayingIndex: 0,
    videoList: [],
    videoPoster: app.globalData.videoPoster,
    tempAudio: app.globalData.tempAudio,
    tempAudio2: app.globalData.tempAudio2,
    tempVideo: app.globalData.tempVideo,
    tempVideo2: app.globalData.tempVideo2,
    from: 'postil',
    committedActive: false,
    replyList: [],
    getDataObj: {
      type: 11, //0问题，1批注
      mongoDBqaId: 11, //mongodbqacontent 主键
      qaId: 11, //当前问题 批注主键 
      secId: 11, //ph_lesson_section ID 
      ruserId: 11, //学生ID
      page: 1, //当前页索引值
      size: 10000, //显示大小
    },
    i: 0,
    indexaaa: 0
  },

  onLoad: function (options) {
    // sourceType 0学生 1老师 没有的话就是题和答
    console.log(options);
    this.setData({
      getDataObj: {
        type: 1, //0问题，1批注
        mongoDBqaId: options.mongodbqaId, //mongodbqacontent 主键
        qaId: options.qaId, //当前问题 批注主键 
        secId: options.secId, //ph_lesson_section ID 
        ruserId: wx.getStorageSync('inviteRuserId'), //学生ID
        page: 1, //当前页索引值
        size: 10000, //显示大小
        // stat: options.stat
      }
    })
  },

  onShow() {
    console.log(this.data.i);
    console.log(this.options.stat);
    this.setData({
      ['getDataObj.stat']: this.data.i > 0 ? 1 : (this.options.stat > 0 ? this.options.stat : 0),
      i: this.data.i + 1,
    });
    phRuserLessonQaInformation(this.data.getDataObj, (res) => {
      let list = res.data.contentVos.content;
      for (let i = 0; i < list.length; i++) {
        if (typeof list[i]['sourceType'] == 'undefined') {
          list[i]['sourceType'] = 999
        }
      }
      // console.log(list)
      this.setData({
        allList: list,
        info: res.data,
        replyBoxIsShow: false
      });
      console.log(this.data.allList);
    })
    // this.setData({
    //   from: this.data.options.from == 'postil' ? 'postil' : 'question'
    // })
    // wx.setNavigationBarTitle({
    //   title: this.data.options.from == 'postil' ? '老师批注' : '我的提问'
    // });
    if (app.globalData.byReplyQuestions.length > 0) {
      this.setData({
        committedActive: true,
        replyList: app.globalData.byReplyQuestions
      });
    }
    this.getAudioList();
    this.getVideoList();
  },

  submit() {
    console.log('提交');
    app.globalData.byReplyQuestions = [];
    // console.log(app.globalData.byReplyQuestions);
    wx.navigateTo({
      url: '/pages/lesson/index',
    })
  },

  gotoVideo() {
    let obj = {
      pageNum: this.data.info.pageNum,
      snum: this.data.info.snum,
      ruserLessonQaId: this.data.getDataObj.qaId, //QaId
      from: 'question',
      type: 1
    };
    console.log(obj);
    // return;
    wx.navigateTo({
      url: '/pages/commit/video?' + parseParam(obj)
    })
  },

  gotoPhoto() {
    let obj = {
      pageNum: this.data.info.pageNum,
      snum: this.data.info.snum,
      ruserLessonQaId: this.data.getDataObj.qaId, //QaId
      type: 1,
      from: 'question'
    };
    console.log(obj);
    wx.navigateTo({
      url: '/pages/commit/photo?' + parseParam(obj)
    })
  },

  gotoDraw() {
    let obj = {
      pageNum: this.data.info.pageNum,
      snum: this.data.info.snum,
      ruserLessonQaId: this.data.getDataObj.qaId, //QaId
      from: 'postil'
    };
    console.log(obj);
    wx.navigateTo({
      url: '/pages/commit/draw?' + parseParam(obj)
    })
    // wx.navigateTo({
    //   url: '/pages/dowork/draw?from=' + this.data.from
    // })
  },

  gotoAudio() {
    let obj = {
      pageNum: this.data.info.pageNum,
      snum: this.data.info.snum,
      ruserLessonQaId: this.data.getDataObj.qaId, //QaId
      from: 'question',
      type: 1
    };
    console.log(obj);
    wx.navigateTo({
      url: '/pages/commit/audio?' + parseParam(obj)
    })
  },

  gotoTxt() {
    let obj = {
      pageNum: this.data.info.pageNum,
      snum: this.data.info.snum,
      ruserLessonQaId: this.data.getDataObj.qaId, //QaId
      from: 'question',
      type: 1
    };
    console.log(obj);
    wx.navigateTo({
      url: '/pages/commit/txt?' + parseParam(obj)
    })
  },

  toggle() {
    this.setData({
      replyBoxIsShow: !this.data.replyBoxIsShow
    });
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