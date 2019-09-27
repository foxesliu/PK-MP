const app = getApp();
import {
  phRuserLessonQaSubmitQa
} from '../../model.js';
import {
  parseParam
} from '../../public/js/util.js';

Page({
  data: {
    list: [],
    committedActive: false,
    from: '',
    submitObj: {
      lessonName: 11, //课节名称
      pageNum: 11, //第几页
      prlId: 11, //ph_ruser_lesson主键
      ruserId: 11, //学生ID
      secCidAndTypeCollection: 11, //作答类型内容Id以及文件类型的集合（多选）
      secId: 11, //sectionId
      sourceJson: 11, //消息来源,头像、昵称
      sourceType: 11, //消息来源类型 0学生发起 1老师发起
      teachId: 11, //当前Lesson对应的中教ID
      type: 11, //类型 0提问 1批注
      qaContent: [{
        contentfilesType: 10,
        contentValue: 11
      }]
    },
  },

  onLoad: function (options) {
    console.log(parseParam(options));
    this.setData({
      submitObj: {
        // filesType: 10, //文件类型
        // value: 11, //内容
        lessonName: wx.getStorageSync('lessonName'), //课节名称
        pageNum: options.snum, //第几页
        prlId: options.prlId, //ph_ruser_lesson主键
        ruserId: wx.getStorageSync('ruserId'), //学生ID
        secCidAndTypeCollection: JSON.parse(options.selectedArray), //作答类型内容Id以及文件类型的集合（多选）
        secId: options.secId, //sectionId
        sourceJson: JSON.stringify({
          "nickName": wx.getStorageSync("name"),
          "avatarUrl": wx.getStorageSync("pic"),
          "info":"学生发起了提问"
        }), //消息来源,头像、昵称
        sourceType: 0, //消息来源类型 0学生发起 1老师发起
        teachId: options.teachId, //当前Lesson对应的中教ID
        type: 0, //类型 0提问 1批注
        qaContent: [{
          contentfilesType: 8,
          contentValue: 11
        }]
      }
    })
    this.setData({
      from: options.from == 'postil' ? 'postil' : (options.from == 'question' ? 'question' : 'ask')
    })
    wx.setNavigationBarTitle({
      title: options.from == 'postil' ? '老师批注' : (options.from == 'question' ? '我的提问' : '发起提问')
    });
  },

  submit() {
    let _this = this;
    console.log('submit');
    let list = this.data.list;
    for (let i = 0; i < list.length; i++) {
      app.globalData.byAskingQuestions.push({
        value: list[i],
        fileType: "0"
      });
      this.setData({
        ['submitObj.qaContent[' + i + ']']: {
          contentfilesType: 8,
          contentValue: list[i]
        }
      })
    }
    console.log(app.globalData.byAskingQuestions);
    console.log(this.data.submitObj);
    // return;
    // _this.setData({
    //   ['submitObj.qaContent[0].contentValue']: s.detail.ossurl
    // })
    console.log(_this.data.submitObj)
    // return;
    // _this.selectComponent("#answerAudioAskComponent").recordComplete();
    phRuserLessonQaSubmitQa(_this.data.submitObj, (res) => {
      console.log(res);
      console.log(new Date().getTime());
      wx.redirectTo({
        url: '/pages/lesson/index?' + parseParam(JSON.parse(wx.getStorageSync('lessonIndexParams'))),
      })
      return;
      wx.navigateBack();
      if (this.data.from !== 'ask') {
        wx.navigateTo({
          url: '/pages/myquestion/index?from=' + this.data.from
        });
      } else {
        wx.navigateTo({
          url: '/pages/ask/ask'
        });
      }
    })


    // let array = [
    //   { "value": "这是文字", "fileType": "0" },
    //   { "value": "http://baidu.com/logo.png", "fileType": "1" },
    //   { "value": "http://baidu.com/audio.mp3", "fileType": "2" },
    //   { "value": "http://baidu.com/video.mp4", "fileType": "3" }
    // ];

    // TEXT(0, "文本题"),
    // IMAGE(1, "图片题"),
    // AUDIO(2, "音频题"),
    // VIDEO(3, "视频题"),
    // EVALUATION(4, "评测内容"),
    // ANSWER_IMAGE(5, "图片作答"),
    // ANSWER_VIDEO(6, "视频作答"),
    // ANSWER_AUDIO(7, "音频作答"),

    // NULL(-1, "未生成"),
    // DRAWING(0, "画图题"),
    // AUDIO(1, "语音提"),
    // PHOTOGRAPH(2, "拍照题"),
    // VIDEO(3, "视频题");

    // CONTENT_TEXT(8, "文本"),
    // CONTENT_IMAGE(9, "图片"),
    // CONTENT_AUDIO(10, "音频"),
    // CONTENT_VIDEO(11, "视频");

  },

  // submit() {
  //   console.log(this.data.list);
  //   let list = this.data.list;
  //   for (let i = 0; i < list.length; i++) {
  //     app.globalData.byAskingQuestions.push({
  //       value: list[i],
  //       fileType: "0"
  //     })
  //   }
  //   console.log(app.globalData.byAskingQuestions);
  //   if (this.data.from !== 'ask') {
  //     wx.navigateTo({
  //       url: '/pages/myquestion/index?from=' + this.data.from
  //     });
  //   } else {
  //     wx.navigateTo({
  //       url: '/pages/ask/ask'
  //     });
  //   }
  // },

  txtInputComplete(a) {
    console.log(a.detail);
    let list = this.data.list;
    list.push(a.detail.txt);
    this.setData({
      list: list,
      committedActive: true
    });
    console.log(this.data);
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

})