let videoContext = '';
import {
  phRuserLessonQaInformation
} from '../../model.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    touchS: [0, 0],
    touchE: [0, 0],
    allList: [],
    info: {},
    videoUrl: '',
    isPlaying: false,
    getDataObj: {
      type: 0, //0问题，1批注
      mongoDBqaId: '', //mongodbqacontent 主键
      qaId: '', //当前问题 批注主键 
      secId: '', //ph_lesson_section ID 
      ruserId: '', //学生ID
      page: 1, //当前页索引值
      size: 10000, //显示大小
      // stat:options.stat //未读传0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let res = this.getData();
    console.log(res);
    let list = res.data.contentVos.content;
    for (let i = 0; i < list.length; i++) {
      if (typeof list[i]['sourceType'] == 'undefined') {
        list[i]['sourceType'] = 999
      }
    }
    // console.log(list)
    this.setData({
      allList: list,
      info: res.data,
      replyBoxIsShow: false
    });
    console.log(this.data.allList);
  },

  playVideo(s) {
    this.setData({
      isPlaying: true,
      videoUrl: s.detail
    });
    setTimeout(() => {
      console.log(this.data);
      videoContext = wx.createVideoContext('video');
      videoContext.requestFullScreen();
      videoContext.play();
    }, 10);
  },

  bindfullscreenchange(e) {
    if (e.detail.fullScreen === false) {
      videoContext.stop();
      this.setData({
        isPlaying: false,
      });
    }
  },

  bindscrolltoupper: function() {
    console.log('已到顶部')
  },

  bindscrolltolower: function() {
    console.log('已到底部')
  },

  getData() {
    let res = {
      "msg": "query success",
      "code": 200,
      "data": {
        "qaId": 717,
        "type": 0,
        "snum": 1,
        "pageNum": 1,
        "ruserId": 295476,
        "prlId": 427,
        "secId": 1425,
        "contentVos": {
          "number": 0,
          "last": true,
          "numberOfElements": 2,
          "size": 10000,
          "totalPages": 1,
          "sort": [{
            "nullHandling": "NATIVE",
            "ignoreCase": false,
            "property": "datatime",
            "ascending": false,
            "descending": true,
            "direction": "DESC"
          }],
          "content": [{
              "stat": 0,
              "sourceType": 0,
              "datatime": "2019-06-04 15:40:52",
              "filesType": "8",
              "ruserId": 295476,
              "id": "5cf693009d62c222939cea2d",
              "ruserLessonQaId": 717,
              "type": "0",
              "value": "121212",
              "info": "小强04,small04,lesson 100课节中，Page1,提问1,发起了提问",
              "sourceJson": "{\"nickName\":\"小强04\",\"avatarUrl\":\"https://files.proudkids.cn/proudkids-ems/20190422/718edd171e8546c580b7a10f9fae3363.png\",\"info\":\"学生发起了提问\"}"
            },
            {
              "stat": 0,
              "sourceType": 0,
              "datatime": "2019-06-04 15:40:52",
              "filesType": "9",
              "ruserId": 295476,
              "id": "5cf693009d62c222939cea2d",
              "ruserLessonQaId": 717,
              "type": "0",
              "value": "/subpackages/images/temp3.jpg",
              "info": "小强04,small04,lesson 100课节中，Page1,提问1,发起了提问",
              "sourceJson": "{\"nickName\":\"小强04\",\"avatarUrl\":\"https://files.proudkids.cn/proudkids-ems/20190422/718edd171e8546c580b7a10f9fae3363.png\",\"info\":\"学生发起了提问\"}"
            },
            {
              "stat": 0,
              "sourceType": 0,
              "datatime": "2019-06-04 15:40:52",
              "filesType": "10",
              "ruserId": 295476,
              "id": "5cf693009d62c222939cea2d",
              "ruserLessonQaId": 717,
              "type": "0",
              "value": "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46",
              "info": "小强04,small04,lesson 100课节中，Page1,提问1,发起了提问",
              "sourceJson": "{\"nickName\":\"小强04\",\"avatarUrl\":\"https://files.proudkids.cn/proudkids-ems/20190422/718edd171e8546c580b7a10f9fae3363.png\",\"info\":\"学生发起了提问\"}"
            },
            {
              "stat": 0,
              "sourceType": 0,
              "datatime": "2019-06-04 15:40:52",
              "filesType": "11",
              "ruserId": 295476,
              "id": "5cf693009d62c222939cea2d",
              "ruserLessonQaId": 717,
              "type": "0",
              "value": "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400",
              "info": "小强04,small04,lesson 100课节中，Page1,提问1,发起了提问",
              "sourceJson": "{\"nickName\":\"小强04\",\"avatarUrl\":\"https://files.proudkids.cn/proudkids-ems/20190422/718edd171e8546c580b7a10f9fae3363.png\",\"info\":\"学生发起了提问\"}"
            },
            {
              "stat": 0,
              "sourceType": 1,
              "datatime": "2019-06-04 15:40:52",
              "filesType": "8",
              "ruserId": 295476,
              "id": "5cf693009d62c222939cea2d",
              "ruserLessonQaId": 717,
              "type": "0",
              "value": "121212",
              "info": "小强04,small04,lesson 100课节中，Page1,提问1,发起了提问",
              "sourceJson": "{\"nickName\":\"小强04\",\"avatarUrl\":\"https://files.proudkids.cn/proudkids-ems/20190422/718edd171e8546c580b7a10f9fae3363.png\",\"info\":\"学生发起了提问\"}"
            },
            {
              "stat": 0,
              "sourceType": 1,
              "datatime": "2019-06-04 15:40:52",
              "filesType": "9",
              "ruserId": 295476,
              "id": "5cf693009d62c222939cea2d",
              "ruserLessonQaId": 717,
              "type": "0",
              "value": "/subpackages/images/temp3.jpg",
              "info": "小强04,small04,lesson 100课节中，Page1,提问1,发起了提问",
              "sourceJson": "{\"nickName\":\"小强04\",\"avatarUrl\":\"https://files.proudkids.cn/proudkids-ems/20190422/718edd171e8546c580b7a10f9fae3363.png\",\"info\":\"学生发起了提问\"}"
            },
            {
              "stat": 0,
              "sourceType": 1,
              "datatime": "2019-06-04 15:40:52",
              "filesType": "10",
              "ruserId": 295476,
              "id": "5cf693009d62c222939cea2d",
              "ruserLessonQaId": 717,
              "type": "0",
              "value": "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46",
              "info": "小强04,small04,lesson 100课节中，Page1,提问1,发起了提问",
              "sourceJson": "{\"nickName\":\"小强04\",\"avatarUrl\":\"https://files.proudkids.cn/proudkids-ems/20190422/718edd171e8546c580b7a10f9fae3363.png\",\"info\":\"学生发起了提问\"}"
            },
            {
              "stat": 0,
              "sourceType": null,
              "datatime": "2019-06-04 15:40:52",
              "filesType": "1",
              "ruserId": 295476,
              "id": "5cf693009d62c222939cea2c",
              "ruserLessonQaId": 717,
              "type": "0",
              "value": "{\"score100\":\"0\",\"secCid\":1549,\"text\":\"https://files.proudkids.cn/proudkids-ems/20190527/8cede680894b4e0f94c01e7d9a407505.png\",\"value\":\"https://files.proudkids.cn/proudkids-ems/20190527/8cede680894b4e0f94c01e7d9a407505.png\",\"open\":false}",
              "info": null,
              "sourceJson": null
            }
          ],
          "first": true,
          "totalElements": 2
        },
        "index": 1
      }
    };
    return res;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})