// subpackages/pages/topic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touchS: [0, 0],
    touchE: [0, 0],
    shadowShowed: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.getStorageSync('shadowShowed') != 0) {
      this.setData({
        shadowShowed: 0
      });
    } else {
      this.setData({
        shadowShowed: 1
      });
    }
  },

  hideShadow() {
    this.setData({
      shadowShowed: this.data.shadowShowed === 1 ? 2 : 0
    });
    wx.setStorageSync('shadowShowed', 1);
  },

  bindscrolltoupper: function() {
    console.log('已到顶部')
  },

  bindscrolltolower: function() {
    console.log('已到底部')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})