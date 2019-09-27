// pages/login/login.js
const app = getApp()
Page({
  data: {
    courseId: '',
    lessonId: '',
    prlId:'',
    mode: '',
    ruserName: '',
    des: [],
    extra:'',
    teacherHeadUrl:'https://files.proudkids.cn/default/avate.png',
    list: [],
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(options)
    wx.hideShareMenu()
    var _this = this
    _this.setData({
      courseId: options.courseId,
      lessonId: options.lessonId,
      mode: options.mode,
      ruserId: options.ruserId,
      //ruserId: 293773,
      extra: options.isExtra,
      prlId: options.prlId
    })
    
    console.log(this.data.courseId)
  },
  onShow:function(){
    this.getResult()
  },
  // POST /ruser/v1 / previews / login
  goApply() {
    wx.navigateTo({
      url: '../login/step?'
    })
  },
  getResult() { //获取详情
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLesson/content/' + this.data.ruserId + '/' + this.data.lessonId + '/' + this.data.mode + '/' + this.data.courseId + '/' + this.data.extra+'?prlId=' + this.data.prlId,
      method: 'get',
      success(res) {
        console.log(res)
        setTimeout(function () {
          wx.hideLoading()
        })
        _this.setData({
          prlId: res.data.data.prlId,
          ruserName: res.data.data.ruserName,
          des: JSON.parse(res.data.data.des),
          list: res.data.data.sectionContentVos,
        })
        if (res.data.data.creator){
          _this.setData({
            teacherHeadUrl: JSON.parse(res.data.data.creator).avatarUrl
          })
        }else{
          _this.setData({
            teacherHeadUrl: 'https://files.proudkids.cn/default/avate.png'
          })
        }
        console.log(_this.data.des)
      }
      
    })
  },
  goBack(){
    wx.navigateBack({
      delta:1
    })
  },
  toDetail(e){
    console.log(e)
    if (e.currentTarget.dataset.type == 0){
      wx.navigateTo({
        url: '/pages/share/draw?secId=' + e.currentTarget.dataset.stat.secId + '&stat=' + e.currentTarget.dataset.stat.stat + '&type=' + e.currentTarget.dataset.stat.type + '&snum=' + e.currentTarget.dataset.stat.type + '&rightOrWrong=' + e.currentTarget.dataset.stat.rightOrWrong + '&score=' + e.currentTarget.dataset.stat.score + '&isExtra=' + this.data.extra + '&prlId=' + this.data.prlId + '&mode=' + this.data.mode + '&lessonName=lesson 3&lessonId=' + this.data.lessonId + '&courseId=' + this.data.courseId + '&ruserId=' + this.data.ruserId + '&teachId=' + this.data.lessonId +'&from=share',
    })
    }else{
      wx.navigateTo({
        url: './dataQ?secId=' + e.currentTarget.dataset.stat.secId + '&stat=' + e.currentTarget.dataset.stat.stat + '&type=' + e.currentTarget.dataset.stat.type + '&snum=' + e.currentTarget.dataset.stat.type + '&id=' + e.currentTarget.dataset.id +'&rightOrWrong=' + e.currentTarget.dataset.stat.rightOrWrong + '&score=' + e.currentTarget.dataset.stat.score + '&isExtra=' + this.data.extra + '&prlId=' + this.data.prlId + '&mode=' + this.data.mode + '&lessonName=lesson 3&lessonId=' + this.data.lessonId + '&courseId=' + this.data.courseId + '&ruserId=' + this.data.ruserId + '&teachId=' + this.data.lessonId + '&from=share',
    })

    }
   
  }
})