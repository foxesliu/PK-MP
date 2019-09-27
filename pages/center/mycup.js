// pages/center/mycup.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [

    ],
    ruserId: '',
    totalCup: '',
    totalPages: '',
    time: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      ruserId: wx.getStorageSync('ruserId')
    })
    this.getMyCups(10)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(this.data.time)
    this.getMyCups(this.data.time * 10)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getMyCups(size) {
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/apps/mp/phRuserLessonAnswer/totalTrophy/' + this.data.ruserId,
      method: 'get',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        page: 1,
        size: size
      },
      success(res) {
        console.log(res)
        setTimeout(function() {
          wx.hideLoading()
        })
        _this.setData({
          list: res.data.data.content.content,
          totalPages: res.data.data.content.totalPages || 0,
          time: _this.data.time + 1
        })
        if (res.data.data.totalTrophy) {
          _this.setData({
            totalCup: res.data.data.totalTrophy,
          })
        } else {
          _this.setData({
            totalCup: 0,
          })
        }
      }
    })
  },
  goToRules() {
    wx.navigateTo({
      url: 'rules',
    })
  }
})