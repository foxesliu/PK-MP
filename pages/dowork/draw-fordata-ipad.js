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
    imageSrc: '',
    tempImageSrc: '',
    newImageSrc: '',
    pixel: [1, 3, 5, 7],
    pixelIndex: 0,
    colors: ['#ff6e6e', '#fd8f34', '#ffd200', '#9af125', '#34cbfd', '#ba73ff', '#ffa3c2', '#7b4935', '#7a7a7a', '#000000', '#ffffff'],
    colorIndex: 8,
    startX: 0,
    startY: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    footerHeight: 0,
    canvasIsShow: true,
    drawOrEraser: true,
    footerIsHigh: false,
    drawTypeIsShow: false,
    drawColorIsShow: false,
    sizeBoxIsShow: false,
    isEdit: false,
    footerhasAudio: false,
    footerAudioIsHigh: false,
    tempAudioPath: app.globalData.tempAudio,
    // tempAudioPath: app.globalData.tempAudio2,
    audioDuration: 0,
    audioPlayTimer: '',
    audioPlayTime: 0,
    audioShowSecond: 0,
    rightOrWrong: '2', //null老师未批改 0错误 1正确 2半对半错
    stat: 0,
    labelShow: false,
    options: {},
    secCid: 0,
    answerId: 0,
    obj: {},
    comefrom: null,
    commitOptions: {},
    info: {},
    labelList: [],
    labelShow11: false
  },

  onLoad: function (options) {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPad') > -1) {
          _this.setData({
            canvasWidth: wx.getSystemInfoSync().windowHeight * 0.694,
            canvasHeight: wx.getSystemInfoSync().windowHeight
          })
        }
        console.log(_this.data.canvasWidth);
      }
    })
    if (options.image) {
      wx.downloadFile({
        url: options.image,
        success: function (aaa) {
          _this.setData({
            imageSrc: aaa.tempFilePath,
          })
        }
      })
    } else {
      this.setData({
        imageSrc: '/public/images/wdraw/draw-bg.png'
      })
    }
  },

  upload: function () {
    let _this = this;
    this._saveCanvasToImage(() => {
      wx.showLoading({
        title: '图片上传中',
      })
      if (_this.data.tempImageSrc) {
        console.log(_this.data.imageSrc)
        ctx.drawImage(_this.data.imageSrc, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight);
        ctx.drawImage(_this.data.tempImageSrc, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight);
        ctx.draw(false, function (e) {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: _this.data.canvasWidth,
            height: _this.data.canvasHeight,
            canvasId: 'canvas',
            success: function (res) {
              wx.uploadFile({
                url: app.globalData.apiPrefix + '/apps/mp/lessonSectionContent/upload',
                filePath: res.tempFilePath,
                name: 'proFile',
                formData: {
                  fileType: 12,
                  fileText: '画图上传'
                },
                header: {
                  "token": wx.getStorageSync('token'),
                  'Authorization': 'Bearer ' + wx.getStorageSync('token')
                },
                fail: function () {
                  wx.showModal({
                    title: "提示",
                    showCancel: false,
                    content: '请重新上传',
                  });
                },
                success: function (ress) {
                  wx.hideLoading();
                  let ossurl = (JSON.parse(ress.data)).data.OSSUrl;
                  if (!ossurl) {
                    wx.showModal({
                      title: "提示",
                      showCancel: false,
                      content: '请重新上传',
                    });
                    return;
                  }
                  wx.hideLoading();
                  wx.setStorageSync('dataDrawOver', ossurl);
                  wx.navigateBack();
                }
              })
            }
          })
        })
      }
    });
  },

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
    if (!this.data.isEdit) {
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
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
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

  _saveCanvasToImage(callback) {
    let _this = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      destWidth: 0,
      destHeight: 0,
      fileType: 'png',
      canvasId: 'canvas',
      success(res) {
        _this.setData({
          tempImageSrc: res.tempFilePath
        });
        setTimeout(() => {
          callback && callback();
        }, 10)
        console.log(_this.data.tempImageSrc);
      }
    })
  },

  doodleStart: function (e) {
    this.setData({
      startX: e.touches[0].x,
      startY: e.touches[0].y
    })
  },

  doodleMove: function (e) {
    this.setData({
      isEdit: true
    });
    let x = e.touches[0].x;
    let y = e.touches[0].y;
    if (this.data.drawOrEraser) {
      // console.log(x, y)
      ctx.setStrokeStyle(this.data.colors[this.data.colorIndex]);
      ctx.setLineWidth(this.data.pixel[this.data.pixelIndex]);
      ctx.setLineCap('round');
      ctx.setLineJoin('round');
      ctx.moveTo(this.data.startX, this.data.startY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.draw(true);
      // saveCanvasToImage(this);
      this.setData({
        startX: x,
        startY: y
      });
    } else {
      ctx.clearRect(x, y, 30, 30)
      ctx.draw(true);
    }
  },

  showPenBox() {
    this._saveCanvasToImage();
    console.log(this.data.canvasIsShow);
    if (!this.data.footerIsHigh) {
      this.setData({
        canvasIsShow: false,
        drawTypeIsShow: true,
        footerIsHigh: true,
        sizeBoxIsShow: false,
        drawColorIsShow: false
      });
    } else {
      this.setData({
        canvasIsShow: true,
        drawTypeIsShow: false,
        footerIsHigh: false,
        sizeBoxIsShow: false,
        drawColorIsShow: false
      });
    }
  },

  clickPen() {
    this.setData({
      drawOrEraser: true,
      drawTypeIsShow: false,
      canvasIsShow: true,
      footerIsHigh: false,
      sizeBoxIsShow: false
    });
  },

  clickEraser() {
    this._saveCanvasToImage();
    this.setData({
      drawOrEraser: false,
      drawTypeIsShow: false,
      canvasIsShow: true,
      footerIsHigh: false,
      sizeBoxIsShow: false
    });
  },

  clickPensize() {
    this.setData({
      footerIsHigh: false,
      drawTypeIsShow: false,
    });
    setTimeout(() => {
      this.setData({
        drawOrEraser: true,
        canvasIsShow: false,
        footerIsHigh: true,
        sizeBoxIsShow: true
      });
    }, 300);
  },

  selectPenSize(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      pixelIndex: index,
      footerIsHigh: false,
      sizeBoxIsShow: false,
      canvasIsShow: true
    });
  },

  clickColor() {
    this.setData({
      footerIsHigh: false,
      drawTypeIsShow: false,
    });
    setTimeout(() => {
      this.setData({
        drawOrEraser: true,
        canvasIsShow: false,
        footerIsHigh: true,
        sizeBoxIsShow: false,
        drawColorIsShow: true
      });
    }, 300);
  },

  selectColor(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      colorIndex: index,
      footerIsHigh: false,
      sizeBoxIsShow: false,
      canvasIsShow: true,
      drawColorIsShow: false
    });
  },

  saveImgToPhone: function () {
    wx.previewImage({
      urls: [this.data.imageSrc]
    })
  },

})

function draw(_this) {
  console.log('draw');
  ctx.drawImage(_this.data.imageSrc, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight)
  ctx.draw();
}