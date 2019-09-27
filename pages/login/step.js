// pages/login/login.js
const app = getApp()
//app.globalData.apiPrefix
Page({
  data: {
    dat: '123',
    phone: '',
    isPhone: true,
    isFocus: 0,
    smsCode: '',
    isPw: true,
    isGetCodde:false,
    currentTime:60,
    time:'获取验证码',
    ruserId:'',
    cid:'',
    inviteRuserId:''
  },

  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      // courseId: options.courseId,
      // lessonId: options.lessonId,
      // mode: options.mode,
      inviteRuserId: wx.getStorageSync('inviteRuserId'),
      // prlId: options.prlId,
      cid: wx.getStorageSync('cid')
    })
    wx.login({
      success: function (res) {
        // console.log(res);
      }
    })
  },

  bindgetuserinfo(res) {
    // console.log(res);
    var _this = this;
    let rawData = JSON.parse(res.detail.rawData);
    wx.login({
      success: ress => {
        // console.log(ress);
        wx.request({
          url: `https://api.vdouw.com/index.php/api/qq/getMiniOpenidByCode/${ress.code}`,
          success(r) {
            // console.log(r)
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
            // console.log(dat);
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
    if (_this.data.phone.length == 11) {
      if (!(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(_this.data.phone))) {
        this.setData({
          isPhone: false,
          isFocus: 1
        })
        console.log('请填写正确手机号码！')
      } else {
        this.setData({
          isPhone: true,
          isGetCodde: true,
          isFocus: 0
        })
      };
    }
    if (_this.data.phone.length == 0) {
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

  },
  smsCode(e) {
    var _this = this;
    this.setData({
      smsCode: e.detail.value
    })
    if(this.smsCode.length == 0){
      this.setData({
        isPw:true
      })
    }
    console.log(_this.data.smsCode)
  },
  focus(e) {
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
  getCode(e){ //获取短信验证码
    var _this = this;
    var currentTime = _this.data.currentTime;
    this.setData({
      time: currentTime + '秒后可重发',
      isGetCodde: false
    })
    var interval = setInterval(function () {
      _this.setData({
        time: (currentTime - 1) + '秒后可重发'
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        _this.setData({
          time: '重新获取',
          currentTime: 60,
          isGetCodde: true
        })
      }
    }, 1000)
    wx.request({
      url: app.globalData.apiPrefix +'/admin//smsCode/' + _this.data.phone,
      method:'get',
      success(res) {
        console.log(res.data)
      },
      fail(res){
        console.log(res)
      }
    })
  },
  checkSms(){
    var _this = this;
    wx.request({
      url: app.globalData.apiPrefix + '/auth/ruser/mobile/token?mobile=' + _this.data.phone + '&code=' + _this.data.smsCode + '&cid=' + _this.data.cid + '&inviteRuserId='+_this.data.inviteRuserId + '&grant_type=mobile&scope=server',
      method:'post',
      success(res){
        console.log(res)
        if (res.statusCode==200){
          _this.setData({
            ruserId: res.data.ruserId,
          })
          wx.setStorageSync('token', res.data.oauth2.value)
          wx.setStorageSync('refreshToken', res.data.oauth2.refreshToken.value)
          if (res.data.isComplete){
            wx.showToast({
              title: '您已报名成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack({
                delta:1
              })
            },2000
            )
            // wx.hideToast({
            //   success(){
            //     wx.navigateBack({
            //       delta: 1
            //     })
            //   }
            // })
          }else{
            wx.navigateTo({
            url: 'step2?ruserId=' + res.data.ruserId
          }) 
          }
           
        }else{
          _this.setData({
            isPw:false
          })
          // wx.navigateTo({
          //   url: 'step2?ruserId=' + res.data.ruserId
          // })
        }
      },
      fail(res){
        console.log(res)
      }
    })
  },
  nextStep(e){
    var _this = this;
    if (_this.data.phone.length < 11) {
      this.setData({
        isPhone: false,
        isFocus: 1
      })
    }else{
      this.checkSms()
    }
    
  }
})