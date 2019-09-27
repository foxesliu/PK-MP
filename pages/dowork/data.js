const app = getApp();
import {
  phRuserLessonQaSubmitAnswer,
  lessonSectionContentQuery,
  phRuserLessonSubmit
} from '../../model.js';
import {
  parseParam,
  pageShowNum
} from '../../public/js/util.js';

Page({
  data: {
    isAsk: false,
    committedActive: false,
    committedObj: {},
    isPlaying: false,
    list: [],
    videoIsPlaying: false,
    videoPlayingIndex: 0,
    videoList: [],
    videoPoster: app.globalData.videoPoster,
    rightOrWrong: '2', //null老师未批改 0错误 1正确 2半对半错
    stat: 0,
    labelIsShow: true,
    tempVideo: app.globalData.tempVideo,
    tempAudio: app.globalData.tempAudio2,
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
    pageList: [],
    info: {},
    defaultObj: {},
    selectedArray: [],
    answerObj: {
      answerId: 11, //答题ID，修改的时候才有
      isExtra: 11, // 是否是额外
      prlId: 11, //ph_ruser_lesson 的主键
      ruserId: wx.getStorageSync('ruserId'), //学生ID
      secCid: 11, //作答类型内容Id
      secId: 11, //sectionId
      snum: 11, //作答类型内容序号
      type: 11, //作答类型
      value: 11, //作答内容
    },
    thisShowType: 11,
    thisShowNum: 11
  },

  onLoad: function(options) {
    pageShowNum(this);
    console.log(options);
    console.log(parseParam(options));
    this.setData({
      options: options
    });
    this.setData({
      answerObj: {
        // answerId: this.properties.item.answerId, //答题ID，修改的时候才有
        isExtra: options.isExtra, // 是否是额外
        prlId: options.prlId, //ph_ruser_lesson 的主键
        ruserId: wx.getStorageSync('ruserId'), //学生ID
        // secCid: this.properties.item.secCid, //作答类型内容Id
        secId: options.secId, //sectionId
        snum: options.snum, //作答类型内容序号
        // type: 7, //作答类型
        // value: ossurl, //作答内容
      },
      // thisShowNum: options.snum < 10 ? '0' + options.snum : options.snum,
    });
    if (options.ruserId && options.from) {
      this.setData({
        ['answerObj.ruserId']: options.ruserId
      })
    }
    console.log(this.data.answerObj);
    console.log(this.data.options);
    this._lessonSectionContentQuery();
    this.setData({
      stat: Number(options.stat),
      isAsk: options.isAsk == "true" ? true : false
    });
    console.log(this.data);
    if (this.data.isAsk) {
      this.selectComponent('#checkQuesionComponent').open(); //一定要开启
    }
    this.getAudioList();
    this.getVideoList();
  },

  onShow: function() {
    if (wx.getStorageSync('dataDrawOver')) {
      this.drawCallback();
    }
  },

  drawCallback() {
    for (let i = 0; i < this.data.pageList.length; i++) {
      if (this.data.pageList[i]['secCid'] == wx.getStorageSync('dataDrawOverSecCid')) {
        this.setData({
          ['answerObj.answerId']: this.data.pageList[i]['answerId']
        });
        break;
      }
    }
    this.setData({
      ['answerObj.secCid']: wx.getStorageSync('dataDrawOverSecCid'),
      ['answerObj.score']: 100,
      ['answerObj.value']: wx.getStorageSync('dataDrawOver'),
      ['answerObj.type']: 12
    });
    console.log(this.data.answerObj);
    phRuserLessonQaSubmitAnswer(this.data.answerObj, (ttt) => {
      console.log(ttt);
      this._lessonSectionContentQuery();
      wx.setStorageSync('dataDrawOver', '');
    })
  },

  _lessonSectionContentQuery() {
    this.setData({
      defaultObj: {
        secId: this.data.options.secId,
        ruserId: this.data.options.ruserId ? this.data.options.ruserId : wx.getStorageSync('ruserId'),
        mode: this.data.options.mode,
        isExtra: this.data.options.isExtra,
        stat: this.data.options.stat,
        prlId: this.data.options.prlId
      },
    })
    console.log(this.data.defaultObj);
    lessonSectionContentQuery(this.data.defaultObj, (res) => {
      console.log(res.data);
      this.setData({
        ['answerObj.prlId']: res.data.prlId,
        pageList: res.data.contentVos,
        info: res.data,
        rightOrWrong: res.data.rightOrWrong,
        secCid: res.data.contentVos[0]['secCid'],
        // answerId: res.data.contentVos[0]['answerId'] ? res.data.contentVos[0]['answerId'] : 0,
        // imageSrc: res.data.contentVos[0].answerValue || res.data.contentVos[0].value,
        // footerhasAudio: res.data.contentVos.length > 1 ? true : false,
        // tempAudioPath: res.data.contentVos.length > 1 ? res.data.contentVos[1].value : '',
      });
      console.log(this.data.pageList);
      console.log(this.data.info.rightOrWrong);
      // innerAudioContext.src = this.data.tempAudioPath;
    })
  },


  recordCallback(s) {
    let _this = this;
    console.log(s.detail);
    for (let i = 0; i < this.data.pageList.length; i++) {
      if (this.data.pageList[i]['secCid'] == s.detail.extra) {
        this.setData({
          ['answerObj.answerId']: this.data.pageList[i]['answerId']
        });
        break;
      }
    }
    this.setData({
      ['answerObj.secCid']: s.detail.extra,
      ['answerObj.score']: s.detail.score,
      ['answerObj.value']: s.detail.ossurl,
      ['answerObj.type']: 7
    });
    console.log(this.data.answerObj);
    phRuserLessonQaSubmitAnswer(this.data.answerObj, (ttt) => {
      console.log(ttt);
      if (ttt.code == 200) {
        console.log('上传完毕');
        _this._lessonSectionContentQuery();
      }
    })
  },

  uploadImageCallback(s) {
    console.log(s.detail);
    for (let i = 0; i < this.data.pageList.length; i++) {
      if (this.data.pageList[i]['secCid'] == s.detail.extra) {
        this.setData({
          ['answerObj.answerId']: this.data.pageList[i]['answerId']
        });
        break;
      }
    }
    this.setData({
      ['answerObj.secCid']: s.detail.extra,
      ['answerObj.value']: s.detail.ossurl,
      ['answerObj.type']: 5
    });
    console.log(this.data.answerObj);
    phRuserLessonQaSubmitAnswer(this.data.answerObj, (ttt) => {
      console.log(ttt);
      if (ttt.code == 200) {
        console.log('上传完毕');
        this._lessonSectionContentQuery();
      }
    })
  },

  uploadVideoCallback(s) {
    console.log(s.detail);
    for (let i = 0; i < this.data.pageList.length; i++) {
      if (this.data.pageList[i]['secCid'] == s.detail.extra) {
        this.setData({
          ['answerObj.answerId']: this.data.pageList[i]['answerId']
        });
        break;
      }
    }
    this.setData({
      ['answerObj.secCid']: s.detail.extra,
      ['answerObj.value']: s.detail.ossurl,
      ['answerObj.type']: 6
    });
    console.log(this.data.answerObj);
    phRuserLessonQaSubmitAnswer(this.data.answerObj, (ttt) => {
      console.log(ttt);
      if (ttt.code == 200) {
        console.log('上传完毕');
        this._lessonSectionContentQuery();
      }
    })
  },

  completeBtn() {
    wx.navigateBack();
    wx.setStorageSync('autoDoworkSecId', this.data.answerObj.secId);
  },

  questionToggle(a) {
    let obj = {
      index: a.detail.test,
      value: a.detail.value,
      fileType: a.detail.type
    };
    console.log(obj);
    console.log(typeof a.detail.active);
    console.log(a.detail.test);
    let list = this.data.selectedArray;
    if (a.detail.active) {
      list.push(obj);
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list[i]['index'] == obj.index) {
          list.splice(a.detail.test, 1);
          break;
        }
      }
    }
    this.setData({
      selectedArray: list
    });
    if (list.length == 0) {
      this.setData({
        committedActive: false
      });
    } else {
      this.setData({
        committedActive: true
      });
    }
    console.log(this.data.selectedArray);
  },

  committed() {
    console.log('questionToggle的结果');
    wx.navigateTo({
      url: '/pages/ask/ask?' + parseParam(this.data.options) + '&selectedArray=' + JSON.stringify(this.data.selectedArray)
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

  changeLabelShow(aa) {
    // console.log(aa.detail);
    this.setData({
      labelIsShow: aa.detail
    });
  },

  onUnload: function() {
    app.globalData.cando = true;
  },

  gotoDetail: function(e) {
    let aa = e.currentTarget.dataset.item;
    console.log(e.currentTarget.dataset.item);
    // return;
    let mongoDBqaId = aa['pzVoList'][0].mongodbqaId;
    let qaId = aa['pzVoList'][0].qaId;
    // let secId = aa.secCid;
    let secId = this.data.options.secId;
    console.log(aa);
    console.log(mongoDBqaId, qaId, secId);
    // return;
    if (this.properties.from == 'share') {
      wx.navigateTo({
        url: `/pages/lesson/postil-detail?from=share&mongoDBqaId=${mongoDBqaId}&qaId=${qaId}&secId=${secId}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/lesson/postil-detail?mongoDBqaId=${mongoDBqaId}&qaId=${qaId}&secId=${secId}`,
      })
    }
  }
})