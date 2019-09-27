// pages/share/share.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    userOpenId: '',
    nickName: '',
    avatarUrl: '',
    openId: '',
    ruserId: '',
    prlId: '',
    isLiked: false,
    courseId: '',
    lessonId: '',
    inviteRuserId: '',
    cid: '',
    mode: '',
    userAvatarUrls: [],
    likedNum: '',
    evaluate: '',
    isExtra: '',
    list: [],
    ruserPic:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    //var query = options.scene.split(",") 
    var query = decodeURIComponent(options.scene).split(",") 
    console.log(query)
    this.setData({
      ruserId: query[0],
      prlId: query[1],
      cid: query[2]
      // ruserId: 293773,
      // prlId:9,
      //extra: options.isExtra,
    })
    wx.setStorageSync('prlId', this.data.prlId);
    wx.setStorageSync('cid', this.data.cid);
    wx.setStorageSync('inviteRuserId', this.data.ruserId)
    wx.showLoading({
      title: '加载中',
    })
    var _this = this
    wx.login({
        success(res) {
          _this.setData({
            code: res.code
          })
          _this.getOpenId()
          console.log(res)
        }
      })

      // this.getShareDetail()

  },

  onGotUserInfo(e) {
    console.log(e.detail.userInfo)
    this.setData({
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
    })
    this.haveLike()
  },


  getOpenId() { //获取openId
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLesson/getMiniProInfo/' + this.data.code,
      method: 'get',
      success(res) {
        console.log(res)
        _this.setData({
          openId: res.data.data.openid,
        })
        console.log(_this.data.openId)
        _this.isHaveLiked()
        _this.getShareDetail()
      }
    })
  },
  gotoResult() { //to结果页
    wx.navigateTo({
      url: 'result?courseId=' + this.data.courseId + '&lessonId=' + this.data.lessonId + '&mode=' + this.data.mode + '&isExtra=' + this.data.isExtra + '&ruserId=' + this.data.ruserId + '&prlId=' + this.data.prlId
    })
  },
  getShareDetail() { //查询分享也详情
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLessonAnswer/share/page/query/' + this.data.ruserId + '/' + this.data.prlId+'?openId='+this.data.openId,
      method: 'get',
      success(res) {
        console.log(res)
        _this.setData({
          courseId: res.data.data.courseId,
          lessonId: res.data.data.lessonId,
          mode: res.data.data.mode,
          userAvatarUrls: res.data.data.userAvatarUrls,
          likedNum: res.data.data.liked,
          evaluate: res.data.data.evaluate,

        })
        if (res.data.data.extra) {
          _this.setData({
            isExtra: 1
          })
        } else {
          _this.setData({
            isExtra: 0
          })
        }
        _this.getResult()
      }
    })
  },
  isHaveLiked() { //查询当前微信用户是否点赞
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLessonAnswer/query/wechatUser/haveLiked/' + this.data.prlId + '/' + this.data.ruserId + '/' + this.data.openId,
      method: 'get',
      success(res) {
        console.log(res)
        if (res.data.code==200){
          _this.setData({
            isLiked: res.data.data
          })
          wx.hideLoading()
        }
      }
    })
  },
  haveLike() { //点赞
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLessonAnswer/liked',
      method: 'put',
      data: JSON.stringify({
        openId: this.data.openId,
        prlId: this.data.prlId,
        ruserId: this.data.ruserId,
        sourceJson: JSON.stringify({
          nickName: this.data.nickName,
          avatarUrl: this.data.avatarUrl,
          isLiked: true,
        })
      }),
      success(res) {
        console.log(res)
        _this.setData({
          isLiked: true,
        })
        _this.getShareDetail()
      }
    })
  },
  getResult() { //获取详情
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLesson/content/' + this.data.ruserId + '/' + this.data.lessonId + '/' + this.data.mode + '/' + this.data.courseId + '/' + this.data.isExtra + '?prlId=' + this.data.prlId,
      method: 'get',
      success(res) {
        console.log(res.data.data)

        _this.setData({
          ruserPic: res.data.data.ruserPic,
          ruserName: res.data.data.ruserName,
          des: JSON.parse(res.data.data.des),
          list: res.data.data.sectionContentVos
        })
        console.log(_this.data.des)
      }

    })
  },
})