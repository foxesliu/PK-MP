import {
  phRuserLessonQaInformation
} from '../../../model.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    secId: String,
    ruserId: String,
    // mongoDBqaId: String,
    // qaId: String,
    item: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    touchS: [0, 0],
    touchE: [0, 0],
    allList: [],
    info: {},
    videoUrl: '',
    isPlaying: false,
    getDataObj: {
      type: 1, //0问题，1批注
      mongoDBqaId: '', //mongodbqacontent 主键
      qaId: '', //当前问题 批注主键 
      secId: '', //ph_lesson_section ID 
      ruserId: '', //学生ID
      page: 1, //当前页索引值
      size: 10000, //显示大小
      stat: 0 //未读传0
    }
  },

  ready() {},

  methods: {
    getDatas() {
      console.log('-------------------');
      // console.log(this.properties.item);
      // console.log(this.properties.secId);
      // let ccc = this.properties.item.contentVos;
      // console.log(ccc);
      console.log(wx.getStorageSync('nePaIndex1'));
      console.log(wx.getStorageSync('nePaIndex2'));
      console.log(wx.getStorageSync('nePaIndex3'));
      let bcie = wx.getStorageSync('newPageDatas')[wx.getStorageSync('nePaIndex1')]['contentVos'][wx.getStorageSync('nePaIndex2')]['pzVoList'][wx.getStorageSync('nePaIndex3')];
      console.log(bcie);
      // return;
      // return;
      // var pzVoLists = [];
      // for (var i = 0; i < ccc.length; i++) {
      //   console.log(ccc[i]['pzVoList'])
      //   for (var j = 0; j < ccc[i]['pzVoList'].length; j++) {
      //     console.log(ccc[i]['pzVoList'][j])
      //     pzVoLists.push(ccc[i]['pzVoList'][j]);
      //   }
      // }
      // console.log(pzVoLists);
      // let bcie = this.properties.item.contentVos[wx.getStorageSync('newPIdx')]['pzVoList'][0];
      // let bcie = wx.getStorageSync('newPageDatas')[]
      // for (let i = 0; i < pzVoLists.length; i++) {
      //   console.log(pzVoLists[i])
      //   // if (pzVoLists[i]['qaId'] == qaId) {
      //   //   bcie = pzVoLists[i];
      //   //   console.log(pzVoLists[i])
      //   //   break;
      //   // }
      // }
      console.log(bcie);
      // return;
      setTimeout(() => {
        console.log(this.properties.item);
        // 在组件实例进入页面节点树时执行
        let obj = this.data.getDataObj;
        obj['secId'] = this.properties.secId;
        obj['ruserId'] = this.properties.ruserId;
        obj['mongoDBqaId'] = bcie['mongodbqaId'];
        obj['qaId'] = bcie['qaId'] ? bcie['qaId'] : 0;
        // console.log(obj);
        // ?type = 1 & mongoDBqaId=5d2c9dbe9d62c218a42170f6 & qaId=737 & secId=1440 & ruserId=295476 & page=1 & size=9999 & stat=1
        // obj['secId'] =1440;
        // obj['ruserId'] = 295476;
        // obj['mongoDBqaId'] = '5d2c9dbe9d62c218a42170f6';
        // obj['qaId'] = 737;
        console.log(obj);
        // return;
        phRuserLessonQaInformation(obj, (res) => {
          if (!(res['data'])) {
            return;
          }
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

        })
      }, 100);
      // let res = this.getData();
      // console.log(res);
      // let list = res.data.contentVos.content;
      // for (let i = 0; i < list.length; i++) {
      //   if (typeof list[i]['sourceType'] == 'undefined') {
      //     list[i]['sourceType'] = 999
      //   }
      // }
      // // console.log(list)
      // this.setData({
      //   allList: list,
      //   info: res.data,
      //   replyBoxIsShow: false
      // });
      // console.log(this.data.allList);
    },

    back() {
      this.triggerEvent('back');
      console.log('comment->back')
    },
    playVideo(s) {
      this.triggerEvent('playVideo', s.detail);
      console.log('comment.component', s.detail)
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
  }
})