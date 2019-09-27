// pages/center/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    enName:null,
    isEnName:true,
    headImg:'',
    phone:'',
    src: '',
    width: 250,//宽度
    height: 250,//高度
    isCropper:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(this.name)
    wx.hideShareMenu()
    this.setData({
      name: wx.getStorageSync('name')||'',
      headImg: wx.getStorageSync('pic') ||'https://files.proudkids.cn/default/avate.png',
      phone: wx.getStorageSync('phone'),
    });
    if (wx.getStorageSync('enName')){
      this.setData({
        enName: wx.getStorageSync('enName'),
      });
    }else{
      this.setData({
        isEnName: false
      });
    }
    this.cropper = this.selectComponent("#image-cropper");
    console.log(this.cropper)
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeCropper(e) {
    this.setData({
      isCropper: e.detail
    })
    console.log(e.detail)
  },
  changeHead(e) {
    this.setData({
      headImg: e.detail
    })
    console.log(e.detail)
  },
  goToMyCup(){
    wx.navigateTo({
      url: 'mycup',
    })
  },
  changeHdImg(){
    var _this = this
    // wx.request({
    //   url: app.globalData.apiPrefix + '/ruser/ruser/v1/upload/pic?phone='+this.data.phone,
    //   method: 'post',
    //   data: {
    //     pic:''
    //   },
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    wx.chooseImage({
      
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          src: res.tempFilePaths,
          isCropper: false
        });
        // upload(that, tempFilePaths);
      }
    })
    
  },
  upLoadFiles(){
    wx.uploadFile({
      url: app.globalData.apiPrefix + '/ruser/ruser/v1/upload/pic?phone=' + this.data.phone,
    })
  },
  cropperload(e) {
    console.log("cropper初始化完成");
  },
  loadimage(e) {
    console.log("图片加载完成", e.detail);
    wx.hideLoading();
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //点击裁剪框阅览图片
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  quit() {
    var _this = this
    wx.request({
      url: app.globalData.apiPrefix + '/auth/removeToken?accesstoken=' + wx.getStorageSync('token') + '&refreshToken=' + wx.getStorageSync('refreshToken'),
      method:'post',
      header: { 'Authorization': 'Bearer ' + wx.getStorageSync('token')},
      success(){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
  },
  goToUnPage(){
    wx.navigateTo({
      url: 'unPage',
    })
  },
  goToLessonEnd(){
    wx.navigateTo({
      url: '/pages/index/index?complete=true',
    })
  }
})