// pages/login/login.js
const app = getApp()
Page({
  data: {
    dat: '123',
    phone: '',
    isPhone: true,
    isFocus: 0,
    smsCode: '',
    isGetCodde: false,
    currentTime: 60,
    time: '获取验证码',
    phoneEr:false,
    verifyEr:false,
    passWordEr: false,
    newPassWord:'',
    isIPad: false,
  },

  onLoad: function (options) {
    var _this=this
    wx.hideShareMenu()
    wx.login({
      success: function (res) {
        console.log(res);
      }
    })
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
  bindKeyInput(e) {
    var _this = this;
    this.setData({
      phone: e.detail.value
    })
    if (_this.data.phone.length == 11) {
      if (!(/^(((1[0-9]{1}))+\d{9})$/.test(_this.data.phone))) {
        this.setData({
          isPhone: false,
          phoneEr: true
        })
        console.log('请填写正确手机号码！')
      } else {
        this.setData({
          isPhone: true,
          isGetCodde: true,
          phoneEr: false
        })
      };
    }
    if (_this.data.phone.length == 0) {
      this.setData({
        isPhone: true,
        phoneEr: false,
      })
    }
    if (_this.data.phone.length < 11) {
      this.setData({
        isGetCodde: false
      })
    }

  },
  passWordNew(e) {
    var _this = this;
    this.setData({
      newPassWord: e.detail.value
    })
    if (_this.data.newPassWord.length <6){
      this.setData({
        passWordEr: true
      })
      }else{
        this.setData({
        passWordEr: false
      })
    }
    
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
  getCode(e) { //获取短信验证码
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
    }, 1000);
    wx.request({
      url: app.globalData.apiPrefix + '/admin//smsCode/' + _this.data.phone,
      method: 'get',
      success(res) {
        // console.log(res.data)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  smsCode(e){ //输入验证码
    var _this = this;
    this.setData({
      smsCode: e.detail.value
    })
    // if (this.smsCode.length == 0) {
    //   this.setData({
    //     verifyEr: true
    //   })
    // }
  },
  getBackPw() { //找回密码
    var _this = this;
    wx.request({
      url: app.globalData.apiPrefix + '/ruser/ruser/v1/getback/password',
      method: 'post',
      data: JSON.stringify({
        "code": _this.data.smsCode,
        "newpassword": _this.data.newPassWord,
        "phone": _this.data.phone   
      }),
      success(res) {
        // console.log(res)
        if (res.data.code==500){
          _this.setData({
            verifyEr:true
          })
        }
        if (res.data.code == 0) {
          _this.selectComponent("#toastComponent22").open();
          setTimeout(() => {
            wx.navigateTo({
              url: 'login',
            })
          }, 1500);
        }
      },
      fail(res) {
        console.log(res)
        _this.selectComponent("#toastComponent33").open();
      }
    })
  },
  nextStep(e) {
    var _this = this;
    if (_this.data.phone.length < 11) {
      this.setData({
        isPhone: false,
        isFocus: 1
      })
    }
    wx.navigateTo({
      url: 'step2'
    })
  }
})