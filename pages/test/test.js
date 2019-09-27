const app = getApp();
let recorder = wx.getRecorderManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  test: function () {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 1,
      duration:1,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
        console.log(res.size)
        console.log(res.duration)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.toast33();
    recorder.onStop((res) => {
      wx.showModal({
        title: "提示",
        showCancel: false,
        content: JSON.stringify(res)
      });
    })
  },

  start() {
    console.log('start');
    recorder.start({
      duration: 5000
    })
  },

  end() {
    console.log('end');
    recorder.stop();
  },

  startVideo(){
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 5,
      duration:10,
      camera: 'back',
      success(res) {
        
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: JSON.stringify(res)
        });
      }
    })
  },

  recordCallback(s) {
    console.log(s.detail);
  },

  uploadImageCallback(s) {
    console.log(s.detail);
  },

  uploadVideoCallback(s) {
    console.log(s.detail);
  },

  txtInputComplete(s) {
    console.log(s.detail);
  },

  del() {
    this.selectComponent("#delComponent").open();
  },

  delCallback() {
    console.log(111)
  },

  quit() {
    this.selectComponent("#quitComponent").open();
  },

  quitcallback() {
    console.log('这里写退出后的逻辑');
  },

  giveup() {
    this.selectComponent("#giveupComponent").open();
  },

  giveupcallback() {
    console.log('这里写放弃本次修改后的逻辑');
  },

  toast11() {
    this.selectComponent("#toastComponent").open();
  },

  toast22() {
    this.selectComponent("#toastComponent22").open();
  },

  toast33() {
    this.selectComponent("#toastComponent33").open();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.selectComponent("#delComponent").open();
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
    return false;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    return false;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: (res) => {
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    } else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '妹子图片',
      //path: '/pages/share/share?ruserId=' + wx.getStorageSync('ruserId') +'&prlId='+9,
      path: '/pages/share/share?ruserId=293773&prlId=9',
      imageUrl: "/public/images/temp.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }

})