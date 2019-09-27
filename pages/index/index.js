const app = getApp();
import {
  getCourseByUserId,
  getFinshedCourse
} from '../../model.js';

Page({
  data: {
    cardCur: 0,
    tower: [],
    towerList: [],
    isComplete: false,
    isIPad:false
  },

  onLoad(options) {
    var _this=this
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPad') > -1) {
          _this.setData({
            isIPad: true
          })
          console.log(res.model)
        }
      }
    })
    this.setData({
      isComplete: options.complete == 'true' ? true : false
    });
    if (options.complete == 'true') {
      getFinshedCourse(wx.getStorageSync('ruserId'),1, (res) => {
        let list = res.data;
        console.log(list);
        for (let i = 0; i < list.length; i++) {
          // list[i].name1 = list[i]['name'].split('-')[0];
          // list[i].name2 = list[i]['name'].split('-')[1];
          list[i]['value11'] = JSON.parse(list[i]['value'])
          list[i]['name1'] = (JSON.parse(list[i]['value'])['courseName']).split('-')[0]
          list[i]['name2'] = (JSON.parse(list[i]['value'])['courseName']).split('-')[1]
        }
        console.log(list)
        this.setData({
          tower: list
        })
        setTimeout(() => {
          if (list.length) {
            this.towerSwiper('tower');
          }
        }, 10);
      })
    } else {
      this._getCourseByUserId();
    }

  },

  gotoUrl(){
    wx.navigateTo({
      url: `/pages/url/url?url=http://www.baidu.com`,
    })
  },

  _getCourseByUserId() {
    let _this = this;
    getFinshedCourse(wx.getStorageSync('ruserId'), 0,(res) => {
      let list = res.data;
      // console.log(list);
      for (let i = 0; i < list.length; i++) {
        // list[i].name1 = list[i]['name'].split('-')[0];
        // list[i].name2 = list[i]['name'].split('-')[1];
        list[i]['value11'] = JSON.parse(list[i]['value'])
        list[i]['name1'] = (JSON.parse(list[i]['value'])['courseName']).split('-')[0]
        list[i]['name2'] = (JSON.parse(list[i]['value'])['courseName']).split('-')[1]
      }
      // console.log(list)
      this.setData({
        tower: list
      })
      setTimeout(() => {
        if (list.length) {
          this.towerSwiper('tower');
        }
      }, 10);
    })
  },

  gotoCourse(e) {
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    console.log(name, id);
    // return;
    wx.navigateTo({
      url: `/pages/course/index?courseId=${id}&name=${name}`,
    })
  },

  towerSwiper(name) {
    let list = this.data[name];
    list[0].zIndex = 2;
    if(this.data.isIPad){
      list[0]['mLeft'] = -200;
      if (list.length > 1) {
        list[1].zIndex = 1;
        list[1]['mLeft'] = -200 + 400;
      }
      if (list.length > 2) {
        for (let i = 2; i < list.length; i++) {
          list[i].zIndex = 0;
          list[i].mLeft = 0;
        }
      }
    }else{
      list[0]['mLeft'] = -256;
      if (list.length > 1) {
        list[1].zIndex = 1;
        list[1]['mLeft'] = -256 + 500;
      }
      if (list.length > 2) {
        for (let i = 2; i < list.length; i++) {
          list[i].zIndex = 0;
          list[i].mLeft = 0;
        }
      }
    }
    
    this.setData({
      towerList: list
    })
  },

  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },

  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },

  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.towerList;
    if (direction == 'right') {
      let index = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i]['zIndex'] == 2) {
          index = i;
          break;
        }
      }
      index = index - 1;
      if (index < 0) {
        return;
      }
      list = this.mLeftFun(list, index);
      this.setData({
        towerList: list
      })
    } else {
      let index = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i]['zIndex'] == 2) {
          index = i;
          break;
        }
      }
      index = index + 1;
      if (index >= list.length) {
        return;
      }
      list = this.mLeftFun(list, index);
      this.setData({
        towerList: list
      })
    }
  },

  mLeftFun: function(list, index) {
    if (index > list.length) {
      return list;
    } else {
      for (let i = 0; i < list.length; i++) {
        list[i]['zIndex'] = 0;
        list[i]['mLeft'] = 0;
      }
      list[index]['zIndex'] = 2;
      list[index]['mLeft'] = -200;
      if (index - 1 >= 0) {
        list[index - 1]['zIndex'] = 1;
        list[index - 1]['mLeft'] = -200 - 400;
      }
      if (index + 1 != list.length) {
        list[index + 1]['zIndex'] = 1;
        list[index + 1]['mLeft'] = -200 + 400;
      }
      return list;
    }
  },



});