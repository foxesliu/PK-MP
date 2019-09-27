//app.js
App({
  onLaunch: function() {
    if (wx.getSystemInfoSync().windowHeight < wx.getSystemInfoSync().windowWidth) {
      wx.showModal({
        title: '友情提醒',
        content: '请竖屏操作',
      })
    }
  },

  globalData: {
    // apiPrefix: 'https://ce.proudkids.cn', //正式
    apiPrefix: 'https://test.proudkids.cn',
    // videoSize: 370000,
    videoSize: 1024 * 1024 * 200, //200M
    videoTime: 60, //60
    audioTime: 600, //600
    audioRecordTime: 60, //60
    appID: 'wx2d17f5ef6a69a2ff',
    appSecret: '2a90355c5b4f03f883f9374f31dee995',
    Authorization: wx.getStorageSync('Authorization'),
    videoPoster: 'https://files.proudkids.cn/video/default.gif',
    cando: true,
    candoTxt: "",
    modalShow: false,
    audioWorkingId: 0,
    tempAudio: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46",
    tempAudio2: "https://files.proudkids.cn/default/aud080.mp3",
    tempVideo: "https://files.proudkids.cn/video/poster_winter.mp4",
    tempVideo2: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400",
    byAskingQuestions: [],
    byReplyQuestions: [],
    recorderManager: wx.getRecorderManager(),
    innerAudioContext: null,
    test: '张三丰'
  },
  // callback, cannotCallback
  startRecord(_this, obj) {
    if (this.globalData.cando === true) {
      this.globalData.recorderManager = null;
      this.globalData.recorderManager = wx.getRecorderManager();
      this.globalData.cando = false;
      _this.data.recorderManager.start({
        format: 'mp3',
        duration: 2000
      });
      obj.callback && obj.callback();
    } else {
      obj.cannotCallback && obj.cannotCallback();
    }
  },

  stopRecord(callback) {
    this.globalData.recorderManager.stop();
    this.globalData.cando = true;
    setTimeout(() => {
      this.globalData.recorderManager.onStop((filePath) => {
        callback && callback(filePath.tempFilePath);
      })
    }, 10);
  },

  // url, audioWorkingId, cannotCallback, playStartCallback, playEndCallback
  startAudio(obj) {
    if (this.globalData.cando === false) {
      obj.cannotCallback && obj.cannotCallback();
      return;
    } else {
      this.globalData.innerAudioContext = null;
      this.globalData.innerAudioContext = wx.createInnerAudioContext();
      this.globalData.innerAudioContext.src = obj.url;
      this.globalData.innerAudioContext.play();
      setTimeout(() => {
        this.globalData.audioWorkingId = obj.audioWorkingId;
        this.globalData.cando = false;
        console.log(this.globalData.innerAudioContext.duration)
        obj.playStartCallback && obj.playStartCallback();
        setTimeout(() => {
          this.globalData.innerAudioContext.onEnded(() => {
            obj.playEndCallback && obj.playEndCallback();
          });
        })
      }, 10);
    }
  },

  endAudio(callback) {
    this.globalData.innerAudioContext && this.globalData.innerAudioContext.stop();
    this.globalData.cando = true;
    this.globalData.innerAudioContext = null;
    callback && callback(filePath.tempFilePath)
  },

});