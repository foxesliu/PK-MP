let videoContext = ''; //三丰
const app = getApp();
Page({
  data: {
    code: '',
    openId: '',
    ruserId: '',
    prlId: '',
    hour: '',
    min: '',
    second: '',
    percent: '',
    trophies: '',
    likeNum: '',
    avatarUrl: '',
    userAvatarUrls: [],
    teacherName: '',
    teacherHead: '',
    evaluate: '',
    lessonName: '',
    mode: '',
    isLiked: false,
    isShowTips: false,
    isShowTips2: true,
    current:0,
    videoUrl: '', //三丰
    isPlaying: false, //三丰
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      ruserId: options.ruserId,
      prlId: options.prlId,
      // ruserId: 293773,
      // prlId:9,
      //extra: options.isExtra,
    });
    wx.setStorageSync('newPageRuserId', options.ruserId);
    wx.setStorageSync('newPagePrlId', options.prlId)
    wx.login({
      success(res) {
        _this.setData({
          code: res.code
        })
        _this.getOpenId()
        console.log(res)
      }
    })
  },

  playVideo(s) { //三丰
    this.setData({
      isPlaying: true,
      videoUrl: s.detail
    });
    setTimeout(() => {
      console.log(this.data);
      videoContext = wx.createVideoContext('video');
      videoContext.requestFullScreen();
      videoContext.play();
    }, 10);
  },

  bindfullscreenchange(e) { //三丰
    if (e.detail.fullScreen === false) {
      videoContext.stop();
      this.setData({
        isPlaying: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getTeacherInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('shangla')
    wx.navigateTo({
      url: '/subpackages/pages/data',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('shangla')
    // wx.navigateTo({
    //   url: '/subpackages/pages/data',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  showTip() {
    console.log(111)
    if (!this.data.isLiked) {
      this.setData({
        isShowTips: true
      })
    }
  },
  cloesTip() {
    this.setData({
      isShowTips2: false
    })
  },
  swiperChange(e) {
    // wx.navigateTo({
    //   url: '/subpackages/pages/data',
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    let current = e.detail.current;
    let source = e.detail.source
    console.log(source);
    console.log(current, this.data.index)
    wx.setStorageSync('leftActiveNewPage', e.detail.current); //三丰
    setTimeout(() => {
      this.selectComponent('#leftComponent').changeActive(); //三丰
    }, 10);

  },
  changecurrent(e){
    this.setData({
      current:e.detail
    })
  },
  onGotUserInfo(e) {
    console.log(e.detail.userInfo)
    this.setData({
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
    })
    this.haveLike()
  },
  isHaveLiked() { //查询当前微信用户是否点赞
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLessonAnswer/query/wechatUser/haveLiked/' + this.data.prlId + '/' + this.data.ruserId + '/' + this.data.openId,
      method: 'get',
      success(res) {
        console.log(res)
        if (res.data.code == 200) {
          _this.setData({
            isLiked: res.data.data
          })
          wx.hideLoading()
        }
      }
    })
  },
  addZero(s) {
    return s < 10 ? '0' + s : s;
  },
  //获取成绩单详情
  getReportDetail() { //获取openId
    var _this = this
    //补零函数
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLesson/repordcard/' + this.data.ruserId + '/' + this.data.prlId + '/' + this.data.openId,
      method: 'get',
      success(res) {
        console.log(res.data.data);
        let repordCard = JSON.parse(res.data.data.repordCard)
        console.log(repordCard)
        _this.setData({
          hour: _this.addZero(repordCard.hour),
          min: _this.addZero(repordCard.min),
          second: _this.addZero(repordCard.second),
          percent: repordCard.percent,
          trophies: _this.addZero(repordCard.trophies),
          likeNum: res.data.data.liked,
          userAvatarUrls: res.data.data.userAvatarUrls,
          lessonName: res.data.data.lessonName,
          mode: res.data.data.mode
        })
        _this.isHaveLiked()
      }
    })
  },
  getOpenId() { //获取openId
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLesson/getMiniProInfo/' + this.data.code,
      method: 'get',
      success(res) {
        console.log(res.data.data)
        _this.setData({
          openId: res.data.data.openid,
        })
        _this.getReportDetail()
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
          isShowTips2: false
        })
      }),
      success(res) {
        console.log(res)
        _this.setData({
          isLiked: true,
        })
        _this.getReportDetail()
      }
    })
  },
  getTeacherInfo() {
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLesson/query/evaluate/' + this.data.prlId,
      method: 'get',
      success(res) {
        console.log(res.data.data)
        _this.setData({
          teacherHead: JSON.parse(res.data.data.creator).avatarUrl,
          teacherName: JSON.parse(res.data.data.creator).nickName,
          evaluate: res.data.data.evaluate
        })

      }
    })
  },
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/step',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})