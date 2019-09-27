const app = getApp();
let recordTimerFunc;
let playTimerFunc;

Component({
  properties: {},

  data: {
    timer: 0,
    timerFormat: "00' 00'",
    recordStep: 1,
    duration: 0,
    playingSecond: 0,
    playingShowSecond: 0,
    playingLeft: 100,
    loadingIsShow: false,
    url: '',
  },

  ready() {},

  methods: {
    record() {
      let _this = this;
      switch (this.data.recordStep) {
        case 1:
          app.startRecord(() => {
            if (app.globalData.cando === false) {
              this.selectComponent('#modalRedoComponent').open();
              return;
            }
            app.globalData.cando = false;
            this.setData({
              recordStep: 2
            })
            this._recordTimerFunc();
          })
          break;
        case 2:
          app.stopRecord((res) => {
            console.log(res);
            clearInterval(recordTimerFunc);
            this.setData({
              timer: 0,
              timerFormat: "00' 00'",
              recordStep: 1,
              loadingIsShow: true
            });
            app.globalData.cando = true;
            this.triggerEvent('recorderEndCallback', res);
          })
          break;
      }
    },

    recordComplete() {
      this.setData({
        loadingIsShow: false
      })
    },

    _recordTimerFunc() {
      let _this = this;
      recordTimerFunc = setInterval(() => {
        _this.setData({
          timer: _this.data.timer + 1
        });
        let a = Math.floor(_this.data.timer / 60);
        let b = Math.floor(_this.data.timer % 60);
        _this.setData({
          timerFormat: (a < 10 ? ("0" + a) : a) + "' " + (b < 10 ? ("0" + b) : b) + "'"
        })
      }, 1000);
    }

  }
})