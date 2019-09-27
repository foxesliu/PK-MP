// pages/login/login.js
const app = getApp()
Page({
  data: {
    dat: '123',
    phone: '',
    isPhone: true,
    isFocus: 0,
    passWord: '',
    isPw: true,
    isGetCodde: false,
    currentTime: 60,
    time: '获取验证码',
    cNameEr: false,
    gradeEr: false,
    eNameEr: false,
    isGrade: false,
    cName: '',
    grade: '',
    eName: '',
    gradeList: [
      'K级别 （没有学过英语）',
      'Level 1 （学过 1 年英语）',
      'Level 2 （学过 2 年英语）',
      'Level 3 （学过 3 年英语）',
      'Level 4 （学过 4 年英语）',
      'Level 5 （学过 5 年英语）',
      'Level 6 （学过 6 年英语）',
    ],
    ruserId: '',

  },

  onLoad: function(e) {
    wx.hideShareMenu()
    console.log(e)
    this.setData({
      ruserId: e.ruserId
    })
    wx.login({
      success: function(res) {
        console.log(res);
      }
    })
  },

  bindgetuserinfo(res) {
    console.log(res);
    var _this = this;
    let rawData = JSON.parse(res.detail.rawData);
    wx.login({
      success: ress => {
        console.log(ress);
        wx.request({
          url: `https://api.vdouw.com/index.php/api/qq/getMiniOpenidByCode/${ress.code}`,
          success(r) {
            console.log(r)
            // console.log(r.data.data);
            wx.setStorageSync('openid', r.data.data.openid);
            wx.setStorageSync('session_key', r.data.data.session_key);
            let dat = {
              username: rawData.nickName,
              type: 5,
              mini_openid: r.data.data.openid,
              head_img: rawData.avatarUrl
            };
            _this.setData({
              dat: JSON.stringify(dat)
            })
            console.log(dat);
          }
        })
      }
    })
  },
  bindcNameInput(e) {
    var _this = this;
    this.setData({
      cName: e.detail.value
    })
    if (/[^\u4E00-\u9FA5]/g.test(_this.data.cName)){
      this.setData({
        cNameEr: true
      })
    }else{
      this.setData({
        cNameEr: false
      })
    }
  },
  bindeNameInput(e) {
    var _this = this;
    this.setData({
      eName: e.detail.value
    })
    if (/^[a-zA-Z]+$/.test(_this.data.eName)){
      this.setData({
        eNameEr: false
      })
    }else{
      this.setData({
        eNameEr: true
      })
    }
    if (_this.data.eName.length == 0){
      this.setData({
        eNameEr: false
      })
    }
  },
  passWord(e) {
    var _this = this;
    this.setData({
      passWord: e.detail.value
    })
    console.log(_this.data.passWord)
  },
  focus(e) {
    var _this = this;
    // this.setData({
    //   isFocus: e.currentTarget.dataset.index
    // })
  },
  no_focus(e) {
    // var _this = this;
    // this.setData({
    //   cName: e.detail.value
    // })
    // if (/[^\u4E00-\u9FA5]/g.test(_this.data.cName)) {
    //   console.log('中文')
    // }
  },
  complete(e) {
    var _this = this;
    if (_this.data.cName.length == 0) {
      this.setData({
        cNameEr: true
      })
    }
    if (!_this.data.grade){
      this.setData({
        gradeEr: true
      })
    }
    if (this.data.cNameEr == false && this.data.gradeEr == false){
      wx.request({
        url: app.globalData.apiPrefix + '/ruser/v1/ruser/v3/edit-ruser',
        method:'put',
        header: { 'Authorization': 'Bearer ' + wx.getStorageSync('token')},
        data: JSON.stringify({
          // 'openId': openId,
          'name': _this.data.cName,
          'enName': _this.data.eName,
          // 'pic': headimgurl,
          'grade': _this.data.grade,
          'ruserId': _this.data.ruserId,
          'channelId': wx.getStorageSync('cid'),
          'prlId': wx.getStorageSync('prlId'),
          'inviteRuserId': wx.getStorageSync('inviteRuserId'),
        }),
        success(res){
          console.log(res)
          wx.navigateTo({
            url: 'complete',
          })
        }
      })
    }
    // wx.navigateTo({
    //    url: 'step2'
    // })
  },

  bindPickerChange(e) {
    var _this = this;
    this.setData({
      isGrade:true,
      grade: e.detail.value,
      gradeEr:false
    });
    console.log(_this.data.grade)
  }
})