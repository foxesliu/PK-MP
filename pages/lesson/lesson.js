const app = getApp();
import {
  phRuserLessonContent,
  phRuserLessonSubmit
} from '../../model.js';
import {
  parseParam
} from '../../public/js/util.js';

Page({
  data: {
    id: 0,
    pzLength: 0,
    twLength: 0,
    thisLessonStat: 0,
    isAsk: false, //默认是false
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
    obj: {
      ruserId: 11,
      lessonId: 11,
      isExtra: 11, //是否是额外布置 0否 1是 
      courseId: 11,
      mode: 11, //课程类型 0预习 1作业
      prlId: 11 //本节作业、预习的主键 当isExtra = 1 的时候需要传 ?prlId=xx
    },
  },

  onLoad: function(options) {
    // var query = decodeURIComponent(options.scene).split(",") 
    console.log(decodeURIComponent(options.scene));
    let getOptions = decodeURIComponent(options.scene).split(',');
    console.log(getOptions);
    // getOptions = ["ruserId|||295476", "lessonId|||1064"];
    let optionss = {};
    for (let i = 0; i < getOptions.length; i++) {
      let a = getOptions[i].split('|||');
      console.log(a)
      optionss[a[0]] = a[1];
    }
    console.log(optionss);
    // return;
    // let a = JSON.stringify(options);
    // console.log(a.replace(/amp;/img, ''));
    // let optionss = JSON.parse(a.replace(/amp;/img, ''));
    // console.log(optionss);
    // // optionss.isExtra=0;
    this.setData({
      options: optionss
    });
    console.log(parseParam(this.data.options));
    wx.setNavigationBarTitle({
      title: this.data.options.lessonName
    });
    this.setData({
      obj: {
        ruserId: this.data.options.ruserId,
        lessonId: this.data.options.lessonId,
        isExtra: this.data.options.isExtra,
        courseId: this.data.options.courseId,
        mode: this.data.options.mode,
        prlId: this.data.options.prlId
      }
    });
    console.log(this.data);
  },

  onShow: function() {
    this._phRuserLessonContent();
  },

  gotoWork: function(e) {
    let item = e.currentTarget.dataset.item;
    wx.setStorageSync('show_serialNum', Number(e.currentTarget.dataset.index) + 1);
    wx.setStorageSync('show_type', item.type);
    console.log(item);
    // console.log(JSON.stringify(this.data.options));
    wx.setStorageSync('lessonIndexParams', JSON.stringify(this.data.options))
    item.isExtra = this.data.options.isExtra;
    // item.prlId = this.data.options.prlId;
    // item.prlId = 888888888888;
    item.mode = this.data.options.mode;
    console.log(item);
    // return;
    // rightOrWrong:null,score:-1,secId:1012,snum:1,stat:"0",type:"0",
    let t = Number(e.currentTarget.dataset.type);
    let s = e.currentTarget.dataset.stat;
    let statt = e.currentTarget.dataset.stat;
    console.log(statt);
    console.log(t);
    // return;
    if (this.data.isAsk) {
      console.log(parseParam(item))
      console.log(parseParam(this.data.options));
      console.log(parseParam(item) + parseParam(this.data.options))
      // return;
      wx.redirectTo({
        url: `/pages/ask/select?` + parseParam(item) + '&' + parseParam(this.data.options)
      });
    } else {
      if (t == 0) {
        console.log(this.data.options);
        console.log(item.stat);
        if (statt > 1) {
          wx.navigateTo({
            url: '/pages/dowork/draw-notdo?' + parseParam(this.data.options) + '&' + parseParam(item) + '&isAsk=true&lessonObj=' + JSON.stringify(this.data.options) + '&stat=' + statt
          });
        } else {
          wx.navigateTo({
            url: '/pages/dowork/draw?' + parseParam(this.data.options) + '&' + parseParam(item) + '&isAsk=true&lessonObj=' + JSON.stringify(this.data.options) + '&stat=' + statt
          });
        }
        return;
        wx.navigateTo({
          url: '/pages/dowork/draw?' + parseParam(item) + '&isAsk=true&lessonObj=' + JSON.stringify(this.data.options) + '&stat=' + statt
        });
      } else {
        console.log(`/pages/dowork/data?` + parseParam(this.data.options) + '&' + parseParam(item) + '&isAsk=' + this.data.isAsk + '&stat=' + statt);
        // return;
        wx.navigateTo({
          url: `/pages/dowork/data?` + parseParam(this.data.options) + '&' + parseParam(item) + '&isAsk=' + this.data.isAsk + '&stat=' + statt
        });
      }
    }
  },

  _phRuserLessonContent() {
    if (!this.data.obj.prlId) {
      this.setData({
        ['obj.prlId']: 0
      })
    }
    phRuserLessonContent(this.data.obj, (res) => {
      console.log(res.data);
      this.setData({
        pzLength: res.data.thisLessonContetnPZMessageTotal,
        twLength: res.data.thisLessonContetnZYMessageTotal,
        list: res.data.sectionContentVos,
        thisLessonStat: res.data.thisLessonStat,
        // ['options.prlId']: 999999999999,
        ['options.prlId']: res.data.prlId
      });
      console.log(this.data);
    })
  },

  gotoPostil: function() {
    wx.setStorageSync('questionOrPostil', 'postil')
    wx.navigateTo({
      url: `/pages/lesson/postil?prlId=${this.data.options.prlId}&type=1`
    })
  },

  gotoQuestion: function() {
    wx.setStorageSync('questionOrPostil', 'question')
    wx.navigateTo({
      url: `/pages/lesson/question?prlId=${this.data.options.prlId}&type=0`
    })
  },

  clickAsk() {
    this.setData({
      isAsk: !this.data.isAsk
    });
    app.globalData.byAskingQuestions = [];
  },

  submit() {
    // console.log(this.data.thisLessonStat);
    console.error(11111111111)
    wx.showToast({
      title: '提交本节',
    })
    let obj = {
      prlId: this.data.options.prlId,
      stat: 2,
      ruserId: wx.getStorageSync('ruserId'),
      lessonId: this.data.options.lessonId,
      courseId: this.data.options.courseId,
      isExtra: this.data.options.isExtra == 1 ? true : false,
      mode: this.data.options.mode,
      sourceJson: JSON.stringify({
        "nickName": wx.getStorageSync('name'),
        "avatarUrl": wx.getStorageSync('pic')
      })
    };
    console.log(obj);
    phRuserLessonSubmit(obj, (res) => {
      console.log(res);
      wx.navigateTo({
        // url: '/pages/course/index?' + parseParam(JSON.parse(wx.getStorageSync('courseParams')))
        url: '/pages/course/index?courseId=' + obj.courseId
      })
    })
  },

  // onShareAppMessage: function() {}
})