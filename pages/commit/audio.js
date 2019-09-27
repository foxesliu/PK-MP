const app = getApp();
import {
  phRuserLessonQaReplayQa
} from '../../model.js';

Page({
  data: {
    committedActive: false,
    list: [],
    from: '',
    replyObj: {
      datatime: 11, //消息创建时间
      filesType: 11, //文件类型
      info: 11, //说明信息
      lessonName: 11, //课节名称
      pageNum: 11, //第几页
      ruserId: wx.getStorageSync('ruserId'), //学生ID
      ruserLessonQaId: 11, //QaId
      snum: 11, //
      sourceJson: 11, //消息来源, 头像、昵称
      sourceType: 11, //消息来源类型 0学生发起 1老师发起
      stat: 11, //状态0未处理 1已处理
      type: 11, //0提问 1批注
      userId: 11, //中教ID
      value: 11,
    },
    options: {}
  },

  onLoad: function(options) {
    console.log(options);
    this.setData({
      options: options
    });
    this.setData({
      // ['replyObj.datatime']: 11, //消息创建时间
      ['replyObj.filesType']: 10, //文件类型
      ['replyObj.info']: '说明信息', //说明信息
      ['replyObj.lessonName']: wx.getStorageSync('lessonName'), //课节名称
      ['replyObj.pageNum']: options.pageNum, //第几页--------------
      ['replyObj.ruserId']: wx.getStorageSync('ruserId'), //学生ID
      ['replyObj.ruserLessonQaId']: options.ruserLessonQaId, //QaId---------
      // ['replyObj.snum']: options.snum, //-------
      ['replyObj.snum']: wx.getStorageSync('commitIndex'),
      ['replyObj.sourceJson']: JSON.stringify({
        "nickName": wx.getStorageSync("name"),
        "avatarUrl": wx.getStorageSync("pic") || 'https://files.proudkids.cn/default/avate.png',
        "info": "学生给出了回复"
      }), //消息来源, 头像、昵称
      ['replyObj.sourceType']: 0, //消息来源类型 0学生发起 1老师发起
      ['replyObj.stat']: 0, //状态0未处理 1已处理
      ['replyObj.type']: options.type == 1 ? 1 : 0, //0提问 1批注
      ['replyObj.userId']: wx.getStorageSync('teachId'), //中教ID
      // ['replyObj.value']: 11,
    });
    console.log(this.data.replyObj);
    this.setData({
      from: options.from == 'postil' ? 'postil' : (options.from == 'question' ? 'question' : 'ask')
    })
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('questionOrPostil') == 'postil' ? '老师批注' : '发起提问'
    });
  },

  recordCallback(a) {
    let list = this.data.list;
    list.push(a.detail.ossurl);
    console.log(list);
    this.setData({
      list: list,
      committedActive: true
    });
    this.setData({
      ['replyObj.value']: a.detail.ossurl,
      ['replyObj.datatime']: new Date().getTime()
    });
    console.log(this.data.replyObj);
    phRuserLessonQaReplayQa(this.data.replyObj, (res) => {
      console.log(res);
      wx.navigateBack();
    })
  },

  submit() {
    console.log('submit');
    let list = this.data.list;
    console.log(list);
    for (let i = 0; i < list.length; i++) {
      if (this.data.from !== 'ask') {
        app.globalData.byReplyQuestions.push({
          value: list[i],
          fileType: "3"
        })
      } else {
        app.globalData.byAskingQuestions.push({
          value: list[i],
          fileType: "3"
        })
      }
    }
    console.log(app.globalData.byReplyQuestions);
    console.log(app.globalData.byAskingQuestions);
    if (this.data.from !== 'ask') {
      wx.navigateTo({
        url: '/pages/myquestion/index?from=' + this.data.from
      });
    } else {
      wx.navigateTo({
        url: '/pages/ask/ask'
      });
    }

  },

  del(e) {
    let list = this.data.list;
    list.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      list: list
    });
    if (list.length < 1) {
      this.setData({
        committedActive: false
      });
    }
  }
});



// const app = getApp();
// import {
//   phRuserLessonQaSubmitQa
// } from '../../model.js';
// import {
//   parseParam
// } from '../../public/js/util.js';

// Page({
//   data: {
//     committedActive: false,
//     list: [],
//     from: '',
//     selectedArray: [],
//     submitObj: {
//       lessonName: 11, //课节名称
//       pageNum: 11, //第几页
//       prlId: 11, //ph_ruser_lesson主键
//       ruserId: 11, //学生ID
//       secCidAndTypeCollection: 11, //作答类型内容Id以及文件类型的集合（多选）
//       secId: 11, //sectionId
//       sourceJson: 11, //消息来源,头像、昵称
//       sourceType: 11, //消息来源类型 0学生发起 1老师发起
//       teachId: 11, //当前Lesson对应的中教ID
//       type: 11, //类型 0提问 1批注
//       qaContent: [{
//         contentfilesType: 10,
//         contentValue: 11
//       }]
//     },
//   },

//   onLoad: function(options) {
//     console.log(options);
//     console.log(parseParam(options));
//     this.setData({
//       from: options.from == 'postil' ? 'postil' : (options.from == 'question' ? 'question' : 'ask')
//     });
//     this.setData({
//       submitObj: {
//         // filesType: 10, //文件类型
//         // value: 11, //内容
//         lessonName: 11, //课节名称
//         pageNum: options.snum, //第几页
//         prlId: options.prlId, //ph_ruser_lesson主键
//         ruserId: wx.getStorageSync('ruserId'), //学生ID
//         secCidAndTypeCollection: JSON.parse(options.selectedArray), //作答类型内容Id以及文件类型的集合（多选）
//         secId: options.secId, //sectionId
//         sourceJson: JSON.stringify({
//           "nickName": wx.getStorageSync("name"),
//           "avatarUrl": wx.getStorageSync("pic")
//         }), //消息来源,头像、昵称
//         sourceType: 0, //消息来源类型 0学生发起 1老师发起
//         teachId: options.teachId, //当前Lesson对应的中教ID
//         type: 0, //类型 0提问 1批注
//         qaContent: [{
//           contentfilesType: 10,
//           contentValue: 11
//         }]
//       },
//       selectedArray: JSON.parse(options.selectedArray)
//     })
//     console.log(this.data.submitObj);
//     wx.setNavigationBarTitle({
//       title: options.from == 'postil' ? '老师批注' : (options.from == 'question' ? '我的提问' : '发起提问')
//     });
//   },

//   recordCallback(s) {
//     let _this = this;
//     console.log(s.detail);
//     let list = _this.data.list;
//     list.push(s.detail.ossurl);
//     console.log(list);
//     _this.setData({
//       list: list,
//       committedActive: true
//     });
//   },

//   submit() {
//     let _this=this;
//     console.log('submit');
//     let list = this.data.list;
//     for (let i = 0; i < list.length; i++) {
//       app.globalData.byAskingQuestions.push({
//         value: list[i],
//         fileType: "1"
//       });
//       this.setData({
//         ['submitObj.qaContent[' + i + ']']: {
//           contentfilesType: 10,
//           contentValue: list[i]
//         }
//       })
//     }
//     console.log(app.globalData.byAskingQuestions);
//     console.log(this.data.submitObj);
//     // return;
//     // _this.setData({
//     //   ['submitObj.qaContent[0].contentValue']: s.detail.ossurl
//     // })
//     console.log(_this.data.submitObj)
//     // return;
//     // _this.selectComponent("#answerAudioAskComponent").recordComplete();
//     phRuserLessonQaSubmitQa(_this.data.submitObj, (res) => {
//       console.log(res);
//       console.log(new Date().getTime())
//       wx.navigateBack();
//       return;
//       if (this.data.from !== 'ask') {
//         wx.navigateTo({
//           url: '/pages/myquestion/index?from=' + this.data.from
//         });
//       } else {
//         wx.navigateTo({
//           url: '/pages/ask/ask'
//         });
//       }
//     })
//   },


//   del(e) {
//     let list = this.data.list;
//     list.splice(e.currentTarget.dataset.index, 1);
//     this.setData({
//       list: list
//     });
//     if (list.length < 1) {
//       this.setData({
//         committedActive: false
//       });
//     }
//   },

//   onUnload: function() {
//     app.globalData.cando = true;
//   },
// })