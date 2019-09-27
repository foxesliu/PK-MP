// subPackages/pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    abc:false,
    abc1: false,
    ruserId: null,
    prlId: '',
    cid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
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
    });
    console.log(this.data.ruserId);
    
    wx.setStorageSync('prlId', this.data.prlId);
    wx.setStorageSync('cid', this.data.cid);
    wx.setStorageSync('inviteRuserId',this.data.ruserId)
    console.log(wx.getStorageSync('inviteRuserId'))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(
      () => {
        this.setData({
          abc: true
        })
      }, 1500
    );
    setTimeout(
      () => {
        this.setData({
          abc1: true
        })
      }, 2000
    )
  },

  goToPage(){
    wx.redirectTo({
      url: './report?ruserId=' + this.data.ruserId +'&prlId='+this.data.prlId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})