import {
  newContent
} from '../../../model.js';
let videoContext = '';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    prlId: String,
    ruserId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    touchS: [0, 0],
    touchE: [0, 0],
    videoUrl: '',
    isPlaying: false,
    shadowShowed2: 2,
    mainContainerShowIndex: 0,
    sections: [],
    commentIsShow: false,
    commentItem: {},
    swiperActive: 0,
    drawLabelsShow: false,
    drawLabels: [],
    drawLabeles: [],
    xOffset: 50, //15
    yOffset: 45, //24
  },

  ready() {

    // for (let i = 0; i < list2.length; i++) {
    //   list2[i]['location'] = list2[i]['serialNum'];
    // }
    // let sourceList = list2;
    // for (let i = 0; i < sourceList.length; i++) {
    //   sourceList[i]['y'] = Math.floor(sourceList[i]['location'] / 15);
    //   sourceList[i]['x'] = sourceList[i]['location'] % 15;
    // }
    // console.log(sourceList);


    if (wx.getStorageSync('shadowShowed2') != 0) {
      this.setData({
        shadowShowed2: 0
      });
    } else {
      this.setData({
        shadowShowed2: 1
      });
    }
    setTimeout(() => {
      newContent(this.properties.ruserId, this.properties.prlId, (res) => {
        let r = res.data.lessonSectionContentObjVos;
        for (let i = 0; i < r.length; i++) {
          let a = r[i]['rightOrWrong'];
          if (a != 'null') {
            let s = JSON.parse(JSON.parse(a));
            r[i].rOw = s.type;
            r[i].rOwText = s.content;
          } else {
            r[i].rOw = -1;
            r[i].rOwText = '';
          }
        }
        this.setData({
          sections: res.data.lessonSectionContentObjVos
        });
        wx.setStorageSync('newPageDatas', res.data.lessonSectionContentObjVos);
        this.getDrawLabels();
      })
      this.showMainIndex();
    }, 100)

  },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange(e) {
      this.setData({
        swiperActive: e.detail.current
      });
      this.getDrawLabels();
    },

    getDrawLabels() {
      setTimeout(() => {
        console.log(this.data.sections[this.data.swiperActive]['type']);
        if (this.data.sections[this.data.swiperActive]['type'] == 0) {
          console.log(222);
          this.setData({
            drawLabelsShow: true
          })
          let list = this.data.sections[this.data.swiperActive]['contentVos'][0]['pzVoList'];
          console.log(list)
          for (let i = 0; i < list.length; i++) {
            list[i]['y'] = Math.floor(list[i]['serialNum'] / 15);
            list[i]['x'] = list[i]['serialNum'] % 15;
          };
          console.log(list)
          setTimeout(() => {
            let s = wx.getSystemInfoSync().windowWidth;
            let w = s / 750 * 605;
            let h = w * 1.44;
            this.setData({
              xOffset: w / 15, //15
              yOffset: h / 24, //24
            });
            console.log(w, h);
            this.setData({
              drawLabels: list,
              drawLabeles: this.data.sections[this.data.swiperActive]
            })
            setTimeout(() => {
              console.log(this.data.drawLabeles);
            }, 10)
          }, 10);
        } else {
          this.setData({
            drawLabelsShow: false
          })
        }
      }, 10)
    },

    showMainIndex() {
      setTimeout(() => {
        console.log(this.data.mainContainerShowIndex);
      }, 10)
    },

    goToLabel(e) {
      console.log(e.currentTarget.dataset.index1);
      console.log(e.currentTarget.dataset.index2);
      console.log(e.currentTarget.dataset.index3);
      wx.setStorageSync('nePaIndex1', Number(e.currentTarget.dataset.index1));
      wx.setStorageSync('nePaIndex2', Number(e.currentTarget.dataset.index2));
      wx.setStorageSync('nePaIndex3', Number(e.currentTarget.dataset.index3));
      // return;
      console.log(e.currentTarget.dataset.item);
      console.log(e.currentTarget.dataset.index);
      console.log(e.currentTarget.dataset.idx);
      // return;
      wx.setStorageSync('newPIndex', e.currentTarget.dataset.index);
      wx.setStorageSync('newPIdx', e.currentTarget.dataset.idx);
      // return;
      this.setData({
        commentIsShow: true,
        commentItem: e.currentTarget.dataset.item
      });
      setTimeout(() => {
        this.selectComponent('#commentComponent').getDatas(); //三丰
      }, 100);
    },

    hideComment() {
      console.log('data->hideComment')
      this.setData({
        commentIsShow: false,
        // swiperActive: 0
      });
      this.getDrawLabels();
    },

    bindscrolltoupper: function() {
      console.log('顶部没有了');
      setTimeout(() => {
        if (this.data.mainContainerShowIndex > 0) {
          this.setData({
            mainContainerShowIndex: this.data.mainContainerShowIndex - 1
          });
        }
        this.showMainIndex();
      }, 200);
    },

    bindscrolltolower: function() {
      console.log('底部没有了')
      setTimeout(() => {
        if (this.data.mainContainerShowIndex < this.data.sections.length - 1) {
          this.setData({
            mainContainerShowIndex: this.data.mainContainerShowIndex + 1
          });
        }
        this.showMainIndex();
      }, 200);

    },

    hideShadow() {
      this.setData({
        shadowShowed2: this.data.shadowShowed2 === 1 ? 2 : 0
      });
      wx.setStorageSync('shadowShowed2', 1);
    },

    playVideo(s) {
      this.triggerEvent('playVideo', s.detail);
    },
  }
})