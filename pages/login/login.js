// pages/login/login.js
const app = getApp()
Page({
  data: {
    dat: '123',
    phone:'',
    isPhone:true,
    isFocus:0,
    passWord:'',
    isPw: true,
    openId:'',
    isIPad:false,
    // baseUrl:'http://test.proudkids.cn',
    //baseUrl: 'https://ce.proudkids.cn',

  },

  onLoad: function(options) {
    var _this=this
    // wx.login({
    //   success: function(res) {
    //     console.log(res);
    //   }
    // })
    wx.getSystemInfo({
      success(res) {
        if(res.model.indexOf('iPad')>-1){
          _this.setData({
            isIPad:true
          })
          console.log(res.model)
        }
      }
    })
    this.setData({
      phone: wx.getStorageSync('phone')
    })
    if(wx.getStorageSync('token')){
      console.log('have token')
      this.getInfoByPhone()
    }
  },
  // POST /ruser/v1 / previews / login
  bindgetuserinfo(res) {
    console.log(res);
    var _this = this;
    let rawData = JSON.parse(res.detail.rawData);
    wx.login({
      success: ress => {
        // console.log(ress.code);
        wx.request({
          url: `${app.globalData.apiPrefix}/apps/mp/phRuserLesson/getMiniProInfo/${ress.code}`,
          success(r) {
            console.log(r)
            // console.log(r.data.data);
            _this.setData({
              openId: r.data.data.openid
            })
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
            _this.login()
          }
        })
      }
    })
  },
  
  bindKeyInput(e) {
    var _this = this;
    this.setData({
      phone: e.detail.value
    })
    if (_this.data.phone.length == 11){
      if (!(/^(((1[0-9]{1}))+\d{9})$/.test(_this.data.phone))) {
        this.setData({
          isPhone: false,
          isFocus: 1
        })
        console.log('请填写正确手机号码！')
      } else {
        this.setData({
          isPhone: true,
          isFocus: 0
        })
      }
      console.log(_this.data.phone.length)
    }
    if (_this.data.phone.length == 0){
      this.setData({
        isPhone: true,
        isFocus: 0
      })
    }
    if (_this.data.phone.length < 11) {
      this.setData({
        isGetCodde: false
      })
    }
    wx.setStorageSync('phone', this.data.phone)
  },
  passWord(e){
    var _this = this;
    this.setData({
      passWord: e.detail.value
    })
    if(this.data.passWord.length == 0){
      this.setData({
        isPw: true
      })
    }
  },
  focus(e){
    var _this = this;
    // this.setData({
    //   isFocus: e.currentTarget.dataset.index
    // })
  },
  no_focus(e) {
    // this.setData({
    //   isFocus: 0
    // })
  },
  login(){
    var _this = this;
    console.log('登录')
    wx.showLoading({
      title: '登录中',
    })
    if(this.data.passWord){
      wx.request({
        url: app.globalData.apiPrefix + '/auth/ruser/mobile/token?mobile=' + this.data.phone + '&password=' + this.data.passWord + '&cid=122922' + '&grant_type=mobile&scope=server',
        method: 'POST',
        success(r) {
          wx.hideLoading()
          console.log(r)
          if (r.statusCode == 200) {
            wx.setStorageSync('token', r.data.oauth2.value)
            wx.setStorageSync('enName', r.data.enName)
            wx.setStorageSync('name', r.data.nickname)
            wx.setStorageSync('pic', r.data.avatar)
            //wx.setStorageSync('phone', r.data.phone)
            wx.setStorageSync('ruserId', r.data.ruserId)
            wx.setStorageSync('refreshToken', r.data.oauth2.refreshToken.value)
            wx.redirectTo({
              url: '../index/index',
            })
          }
          if (r.data.status == 401) {
            _this.setData({
              isPw: false
            })
          }
        }
      })
    }else{
      wx.hideLoading()
      _this.setData({
        isPw: false
      })
    }
    
  },
  goReset(e){
    var _this = this;
    wx.navigateTo({
      url: 'reset'
    })
  },
  getInfoByPhone(){
    wx.request({
      url: app.globalData.apiPrefix + '/ruser/v1/ruser/findRuserByPhone/' + this.data.phone,
      method:'get',
      header: { 'Authorization': 'Bearer ' + wx.getStorageSync('token') },
      success(res){
        console.log(res)
        if (res.statusCode==200){
          wx.setStorageSync('enName', res.data.enName)
          wx.setStorageSync('name', res.data.name)
          wx.setStorageSync('pic', res.data.pic)
            wx.redirectTo({
            url: '../index/index',
          })
        }
      }
    })
  }
})