let app = getApp();
import {
  phRuserLessonQa
} from '../../model.js';
import {
  parseParam
} from '../../public/js/util.js';

Page({
  data: {
    tabActive: 0,
    newList: [],
    list: [],
    options: {}
  },

  onLoad: function(options) {
    console.log(options);
    console.log(parseParam(options));
    this.setData({
      options: options
    });
  },

  onShow: function() {

    phRuserLessonQa({
      ruserId: wx.getStorageSync('ruserId'),
      stat: 0, //消息状态 0未读 1已读
      type: this.data.options.type,
      prlId: this.data.options.prlId
    }, (res) => {
      this.setData({
        newList: res.data.qaContentArray
      })
      // console.log(JSON.parse(this.data.newList[0].originator).nickName)
      // console.log(JSON.parse(this.data.newList[0].originator).avatarUrl)
    });
    phRuserLessonQa({
      ruserId: wx.getStorageSync('ruserId'),
      stat: 1,
      type: this.data.options.type,
      prlId: this.data.options.prlId
    }, (res) => {
      this.setData({
        list: res.data.qaContentArray
      })
    })
  },

  gotoPage(a) {
    let type = a.currentTarget.dataset.item.type;
    console.log(type);
    let item = a.currentTarget.dataset.item;
    item.stat = this.data.tabActive == 0 ? 0 : 1;
    // return;
    if (type == 0) {
      wx.navigateTo({
        url: '/pages/dowork/draw-postil?' + parseParam(a.currentTarget.dataset.item)
      })
    } else {
      wx.navigateTo({
        url: '/pages/dowork/data-postil?' + parseParam(a.currentTarget.dataset.item)
      })
    }
    return;
  },

  clickTab: function(e) {
    this.setData({
      tabActive: Number(e.currentTarget.dataset.id)
    })
  },


})