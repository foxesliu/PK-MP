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
    pixel: [2, 4, 6, 8],
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
    shadowIsShow: false,
    isEdit: false,
    footerhasAudio: true,
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

  onLoad: function(options) {
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
    console.log(parseParam(options));
    console.log(options);
    this.setData({
      options: options
    });

    innerAudioContext.onEnded(() => {
      clearInterval(_this.data.audioPlayTimer)
      _this.setData({
        footerAudioIsHigh: false,
        audioShowSecond: Math.ceil(_this.data.audioDuration),
        audioPlayTime: 0
      });
    })
  },

  onShow: function() {
    if (this.data.options.comefrom != 'commit') {
      let stat = Number(this.data.options.stat);
      this._lessonSectionContentQuery();
      this.setData({
        stat: stat,
        canvasIsShow: stat < 2 ? true : false,
        labelShow: stat < 2 ? false : true
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
    console.log(this.data);
  },

  _lessonSectionContentQuery() {
    let _this = this;
    this.setData({
      obj: {
        secId: this.data.options.secId,
        ruserId: wx.getStorageSync('ruserId'),
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
            tempImageSrc: aaa.tempFilePath
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

  upload: function() {
    if (!this.data.isEdit || this.data.stat > 1) {
      wx.navigateBack();
      return;
    }
    // if (this.data.stat > 2) {
    //   wx.showToast({
    //     title: '老师已批改'
    //   });
    //   return false;
    // }
    let _this = this;
    this._saveCanvasToImage(() => {
      wx.showLoading({
        title: '图片上传中',
      })
      if (_this.data.tempImageSrc) {
        console.log(_this.data.imageSrc)
        ctx.drawImage(_this.data.imageSrc, 0, 0, _this.data.canvasWidth, _this.data.canvasWidth * 1.44);
        ctx.drawImage(_this.data.tempImageSrc, 0, 0, _this.data.canvasWidth, _this.data.canvasWidth * 1.44);
        ctx.draw(false, function(e) {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: _this.data.canvasWidth,
            height: _this.data.canvasWidth * 1.44,
            canvasId: 'canvas',
            success: function(res) {
              wx.uploadFile({
                url: app.globalData.apiPrefix + '/apps/mp/lessonSectionContent/upload',
                filePath: res.tempFilePath,
                name: 'proFile',
                formData: {
                  fileType: _this.data.comefrom == 'commit' ? 9 : 5,
                  fileText: '画图上传'
                },
                header: {
                  "token": wx.getStorageSync('token'),
                  'Authorization': 'Bearer ' + wx.getStorageSync('token')
                },
                fail: function() {
                  wx.showModal({
                    title: "提示",
                    showCancel: false,
                    content: '请重新上传',
                  });
                },
                success: function(ress) {
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
                  console.log(ossurl);
                  if (_this.data.comefrom == 'commit') {
                    console.log('11111111111')
                    // console.log(`/pages/commit/draw?url=${ossurl}&from11=draw&${parseParam(_this.data.commitOptions)}`)
                    wx.redirectTo({
                      url: `/pages/commit/draw?url=${ossurl}&from11=draw&type=1&${parseParam(_this.data.commitOptions)}`,
                    })
                    // wx.navigateBack()
                  } else {
                    let answerObj = {
                      answerId: _this.data.answerId, //答题ID，修改的时候才有
                      isExtra: _this.data.options.isExtra, // 是否是额外
                      prlId: _this.data.options.prlId, //ph_ruser_lesson 的主键
                      ruserId: wx.getStorageSync('ruserId'), //学生ID
                      secCid: _this.data.secCid, //作答类型内容Id
                      secId: _this.data.options.secId, //sectionId
                      snum: _this.data.options.snum, //作答类型内容序号
                      type: 5, //作答类型
                      value: ossurl, //作答内容
                    }
                    console.log(answerObj);
                    phRuserLessonQaSubmitAnswer(answerObj, (ttt) => {
                      console.log(ttt);
                      wx.setStorageSync('autoDoworkSecId', _this.data.options.secId);
                      // wx.redirectTo({
                      //   url: '/pages/lesson/index?' + parseParam(JSON.parse(_this.data.options.lessonObj)),
                      // })
                      wx.navigateBack()
                      // wx.navigateBack({ delta: 1});
                    })
                  }
                }
              })
            }
          })
        })
      }
    });
  },

  quit() {
    // this._saveCanvasToImage();
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
    // if (!this.data.isEdit || this.data.stat > 1) {
    //   // wx.navigateBack();
    //   wx.redirectTo({
    //     url: '/pages/lesson/index?' + parseParam(JSON.parse(wx.getStorageSync('lessonIndexParams'))),
    //   })
    // }
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
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasWidth * 1.44);
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
      height: this.data.canvasWidth * 1.44,
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

  doodleStart: function(e) {
    this.setData({
      startX: e.touches[0].x,
      startY: e.touches[0].y
    })
  },

  doodleMove: function(e) {
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
    if (this.data.stat > 1) {
      wx.showToast({
        title: '老师已批改中'
      });
      return false;
    }
    this._saveCanvasToImage();
    console.log(this.data.canvasIsShow);
    if (!this.data.footerIsHigh) {
      this.setData({
        canvasIsShow: false,
        drawTypeIsShow: true,
        footerIsHigh: true,
        sizeBoxIsShow: false,
        drawColorIsShow: false,
        shadowIsShow: true
      });
    } else {
      this.setData({
        canvasIsShow: true,
        drawTypeIsShow: false,
        footerIsHigh: false,
        sizeBoxIsShow: false,
        drawColorIsShow: false,
        shadowIsShow: false
      });
    }
  },

  clickPen() {
    this.setData({
      drawOrEraser: true,
      drawTypeIsShow: false,
      canvasIsShow: true,
      footerIsHigh: false,
      sizeBoxIsShow: false,
      shadowIsShow: false
    });
  },

  clickEraser() {
    this._saveCanvasToImage();
    this.setData({
      drawOrEraser: false,
      drawTypeIsShow: false,
      canvasIsShow: true,
      footerIsHigh: false,
      sizeBoxIsShow: false,
      shadowIsShow: false
    });
  },

  clickPensize() {
    this.setData({
      footerIsHigh: false,
      drawTypeIsShow: false
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
      canvasIsShow: true,
      shadowIsShow: false
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
        drawColorIsShow: true,
        shadowIsShow: true
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
      drawColorIsShow: false,
      shadowIsShow: false
    });
  },

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

function draw(_this) {
  console.log('draw');
  ctx.drawImage(_this.data.imageSrc, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight)
  ctx.draw();
}