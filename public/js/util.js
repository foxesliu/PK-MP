const app = getApp();

export const parseParam = function(a) {
  let b = '';
  for (let i in a) {
    b += '&' + i + '=' + a[i];
  }
  return b.replace('&', '');
};

export const gotoLessonPage = function(data) {
  console.log(data)
  if (typeof data == 'object') {
    if (data.stat == -1) {
      wx.showModal({
        title: "提示",
        showCancel: false,
        content: '不可操作',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/lesson/index?' + parseParam(data)
    })
  }
};

// filePath fileText fileType callback
export const uploadFile = function(obj) {
  console.log(obj);
  obj.beforeCallback && obj.beforeCallback();
  // return;
  wx.uploadFile({
    url: app.globalData.apiPrefix + '/apps/mp/lessonSectionContent/upload',
    filePath: obj.filePath,
    name: 'proFile',
    formData: {
      fileType: obj.fileType,
      fileText: obj['fileText']
    },
    header: {
      "token": wx.getStorageSync('token'),
      'Authorization': 'Bearer ' + wx.getStorageSync('token')
    },
    success: function(o) {
      console.log(o);
      obj.callback && obj.callback(o);
    },
    fail: function() {
      obj.errorCallback && obj.errorCallback();
    }
  })
};

export const pageShowNum = function(o) {
  console.log('util.pageShowNum')
  // thisShowNum: options.snum < 10 ? '0' + options.snum : options.snum,
  let a = wx.getStorageSync('show_serialNum');
  o.setData({
    thisShowNum: Number(a) < 10 ? '0' + a : a
  });
  switch (wx.getStorageSync('show_type')) {
    case '0':
      console.log('画图题');
      // return '画图题';
      o.setData({
        thisShowType: '画图题'
      })
      break;
    case '1':
      console.log('语音题');
      o.setData({
        thisShowType: '语音题'
      })
      // return '语音题';
      break;
    case '2':
      console.log('拍照题');
      o.setData({
        thisShowType: '拍照题'
      })
      // return '拍照题';
      break;
    case '3':
      console.log('视频题');
      o.setData({
        thisShowType: '视频题'
      })
      // return '视频题';
      break;
  }
};