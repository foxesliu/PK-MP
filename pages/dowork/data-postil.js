const app = getApp();
import {
  phRuserLessonQaSubmitAnswer,
  lessonSectionContentQuery,
  phRuserLessonQaQuizInformation,
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
    options: {},
    pageList: [],
    info: {},
    defaultObj: {},
    selectedArray: [],
    thisShowType: 11,
    thisShowNum: 11
  },

  onLoad: function(options) {
    // pageShowNum(this);
    console.log(options);
    console.log(parseParam(options));
    this.setData({
      options: options
    });
    this._lessonSectionContentQuery();
    this.setData({
      stat: Number(options.stat),
      isAsk: options.isAsk == "true" ? true : false
    });
    console.log(this.data);
    if (this.data.isAsk) {
      this.selectComponent('#checkQuesionComponent').open(); //一定要开启
    }
  },

  completeBtn() {
    wx.navigateBack();
  },

  _lessonSectionContentQuery() {
    console.log(this.data.options);
    var obj11 = {
      type: 1,
      mongoDBqaId: this.data.options.mongodbqaId,
      qaId: this.data.options.qaId,
      secId: this.data.options.secId,
      ruserId: this.data.options.ruserId,
      page: 1,
      size: 9999,
      stat: this.data.options.stat
    }
    console.log(obj11);
    phRuserLessonQaQuizInformation(obj11, (res) => {
      console.log(res.data.type);
      let aaa = '';
      switch (res.data.type) {
        case 1:
          aaa = '图片题';
          break;
        case 2:
          aaa = '音频题';
          break;
        case 3:
          aaa = '视频题';
          break;
        case 0:
          aaa = '文字题';
          break;
      }
      this.setData({
        pageList: res.data.contentVos,
        info: res.data,
        rightOrWrong: res.data.rightOrWrong,
        thisShowNum: res.data.snum < 10 ? '0' + res.data.snum : res.data.snum,
        thisShowType: aaa
        // answerId: res.data.contentVos[0]['answerId'] ? res.data.contentVos[0]['answerId'] : 0,
        // imageSrc: res.data.contentVos[0].answerValue || res.data.contentVos[0].value,
        // footerhasAudio: res.data.contentVos.length > 1 ? true : false,
        // tempAudioPath: res.data.contentVos.length > 1 ? res.data.contentVos[1].value : '',
      });
      console.log(this.data);
      // innerAudioContext.src = this.data.tempAudioPath;
    })
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
    let sourceType = aa.pzVoList[0]['sourceType'];
    let annotationStat = aa.pzVoList[0]['annotationStat'];
    console.log(sourceType, annotationStat);
    let ccc = '1';
    if (sourceType == 1 && annotationStat == 0) {
      ccc = '0';
    }
    wx.setStorageSync('statSourceTypeAnnotationStat', ccc)
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