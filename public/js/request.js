const app = getApp();

export const request = (params) => {
  wx.showLoading({
    title: '加载中',
  })
  var _this = this;
  var url = app.globalData.apiPrefix + params.url;
  params.type = !!params.type ? params.type : 'GET'
  wx.request({
    url: url,
    data: params.data,
    method: params.type,
    header: {
      'content-type': 'application/json',
      'Authorization': !params["notToken"] ? 'Bearer ' + wx.getStorageSync('token') : '',
    },
    success: function(res) {
      // console.log(res);
      if (res.statusCode == 200) {
        // if (res.code == 500) {
        //   wx.showModal({
        //     title: "提示",
        //     showCancel: false,
        //     content: res.msg
        //   });
        //   return;
        // }
        params.sCallback && params.sCallback(res.data);
      } else if (res.statusCode == 401) {
        console.log(11111111111);
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: "请重新登录",
          success: function() {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        });
      }

    },
    fail: function(err) {
      console.log(err);
      // wx.showModal({
      //   title: "提示",
      //   showCancel: false,
      //   content: '请重新登录',
      //   success: function() {
      //     wx.navigateTo({
      //       url: '/pages/login/login'
      //     });
      //   }
      // })
    },
    complete: function() {
      wx.hideLoading();
    }
  })
}