var ctx = wx.createCanvasContext('canvas');
const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
import {
  phRuserLessonQaSubmitAnswer,
  lessonSectionContentQuery
} from '../../model.js';
import {
  parseParam
} from '../../public/js/util.js';

Page({
  data: {
    // imageSrc: '/public/images/temp.jpg',
    imageSrc: '',
    tempImageSrc: '',
    newImageSrc: '',
    pixel: [1, 3, 5, 7],
    pixelIndex: 0,
    colors: ['#ff6e6e', '#fd8f34', '#ffd200', '#9af125', '#34cbfd', '#ba73ff', '#ffa3c2', '#7b4935', '#7a7a7a', '#ffffff'],
    colorIndex: 8,
    startX: 0,
    startY: 0,
    windowWidth: 0,
    windowHeight: 0,
    footerHeight: 0,
    canvasIsShow: true,
    drawOrEraser: true,
    footerIsHigh: false,
    drawTypeIsShow: false,
    drawColorIsShow: false,
    sizeBoxIsShow: false,
    isEdit: false,
    footerhasAudio: true,
    footerAudioIsHigh: false,
    tempAudioPath: app.globalData.tempAudio,
    // tempAudioPath: app.globalData.tempAudio2,
    audioDuration: 0,
    audioPlayTimer: '',
    audioPlayTime: 0,
    audioShowSecond: 0,
    rightOrWrong: '', //null老师未批改 0错误 1正确 2半对半错
    stat: 0,
    labelShow: false,
    options: {},
    secCid: 0,
    answerId: 0,
    obj: {},
    comefrom: null,
    commitOptions: {},
    info: {},
    labelList: '',
    labelShow11: false,
    from: ''
  },

  onLoad: function(options) {
    console.log(parseParam(options));
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPad') > -1) {
          wx.redirectTo({
            url: '/pages/dowork/draw-notdo-ipad?' + parseParam(options),
          })
        }
      }
    })
    console.log(options);
    this.setData({
      options: options
    });

    let _this = this;
    this.setData({
      windowWidth: wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })

    innerAudioContext.onEnded(() => {
      clearInterval(_this.data.audioPlayTimer)
      _this.setData({
        footerAudioIsHigh: false,
        audioShowSecond: Math.ceil(_this.data.audioDuration),
        audioPlayTime: 0
      });
    })

    if (options.from == 'share') {
      this.setData({
        from: 'share'
      })
    }
  },

  onShow: function() {
    if (this.data.options.comefrom != 'commit') {
      let stat = Number(this.data.options.stat);
      this._lessonSectionContentQuery();
      this.setData({
        stat: stat,
        canvasIsShow: false,
        labelShow: true
      });
    } else {
      wx.setNavigationBarTitle({
        title: '画张图'
      });
      this.setData({
        comefrom: 'commit',
        imageSrc: '/public/images/wdraw/draw-bg.png',
        commitOptions: {
          pageNum: this.data.options.pageNum,
          ruserLessonQaId: this.data.options.ruserLessonQaId,
          snum: this.data.options.snum
        },
        footerhasAudio: false
      });
    }
  },

  _lessonSectionContentQuery() {
    let _this = this;
    this.setData({
      obj: {
        secId: this.data.options.secId,
        ruserId: this.data.options.ruserId ? this.data.options.ruserId : wx.getStorageSync('ruserId'),
        mode: this.data.options.mode,
        isExtra: this.data.options.isExtra,
        stat: this.data.options.stat,
        prlId: this.data.options.prlId
      }
    })
    console.log(this.data.obj);
    lessonSectionContentQuery(_this.data.obj, (res) => {
      console.log(res);
      _this.setData({
        secCid: res.data.contentVos[0]['secCid'],
        answerId: res.data.contentVos[0]['answerId'] ? res.data.contentVos[0]['answerId'] : 0,
        // imageSrc: sres.tempFilePath,
        footerhasAudio: res.data.contentVos.length > 1 ? true : false,
        // tempAudioPath: res.data.contentVos.length > 1 ? res.data.contentVos[1].value : '',
        info: res.data,
        rightOrWrong: res.data.rightOrWrong,
        labelList: JSON.stringify(res.data.contentVos[0]['pzVoList']),
        labelShow11: true
      });
      console.log(_this.data.labelList);
      let imgSRC = '';
      // console.error(res.data.contentVos[0].type)
      if (res.data.contentVos.length > 1) {
        _this.setData({
          tempAudioPath: res.data.contentVos[1].type == 2 ? res.data.contentVos[1].value : res.data.contentVos[0].value
        });
        if (res.data.contentVos[0].type != 2) {
          imgSRC = res.data.contentVos[0].answerValue || res.data.contentVos[0].value
        } else {
          imgSRC = res.data.contentVos[1].answerValue || res.data.contentVos[1].value
        }
      } else {
        imgSRC = res.data.contentVos[0].answerValue || res.data.contentVos[0].value
      }
      console.log(_this.data.tempAudioPath)
      console.log(imgSRC)
      wx.downloadFile({
        url: imgSRC,
        success: function(aaa) {
          _this.setData({
            imageSrc: aaa.tempFilePath,
          })
        }
      })
      innerAudioContext.src = _this.data.tempAudioPath;
    })
  },
  changeLabelShow() {
    this.setData({
      labelShow: !this.data.labelShow
    });
    console.log(this.data.labelShow)
  },

  upload: function() {},

  quit() {
    this.setData({
      canvasIsShow: false
    });
    if (this.data.isEdit) {
      this.selectComponent("#giveupModifyComponent").open();
    } else {
      wx.navigateBack();
    }
  },

  cancel() {
    if (!this.data.isEdit || this.data.stat > 1) {
      wx.navigateBack();
      return;
    }
    this.setData({
      canvasIsShow: false
    });
    this.selectComponent("#giveupComponent").open();
  },

  giveupEsc() {
    this.setData({
      canvasIsShow: true
    });
    console.log('giveupEsc');
  },

  giveupcallback() {
    console.log(111)
    this.selectComponent("#giveupComponent").close();
    ctx.clearRect(0, 0, this.data.windowWidth, this.data.windowWidth * 1.44);
    ctx.draw(true);
    this.setData({
      canvasIsShow: true,
      isEdit: false
    });
    this._saveCanvasToImage();
    setTimeout(() => {
      this.selectComponent("#toastComponent").open();
    }, 100);
  },

  _saveCanvasToImage(callback) {},

  doodleStart: function(e) {},

  doodleMove: function(e) {},

  showPenBox() {
      wx.showToast({
        title: '老师已批改'
      });
      return false;
  },

  clickPen() {},

  clickEraser() {},

  clickPensize() {},

  selectPenSize(e) {},

  clickColor() {},

  selectColor(e) {},

  saveImgToPhone: function() {
    wx.previewImage({
      urls: [this.data.imageSrc]
    })
  },

  showAudioBox() {
    let _this = this;
    this.setData({
      footerAudioIsHigh: !this.data.footerAudioIsHigh,
    });
    if (this.data.footerAudioIsHigh) {
      innerAudioContext.play();
      this.setData({
        audioDuration: innerAudioContext.duration
      });
      clearInterval(_this.data.audioPlayTimer)
      this.data.audioPlayTimer = setInterval(function() {
        setTimeout(() => {
          if (_this.data.audioDuration) {
            _this.setData({
              audioPlayTime: _this.data.audioPlayTime + 0.1,
              audioShowSecond: Math.ceil(_this.data.audioDuration - _this.data.audioPlayTime - 0.1)
            })
          }
        }, 100)
      }, 100);
    } else {
      innerAudioContext.pause();
      clearInterval(_this.data.audioPlayTimer)
    }
  },

  onUnload: function() {
    innerAudioContext.stop();
  },

})

function draw(_this) {}