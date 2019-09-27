import {
  gotoLessonPage
} from '../../public/js/util.js';

Component({
  properties: {
    mode: Number,
    stat: Number
  },

  data: {},

  ready() {
    // console.log(this.properties);
  },

  methods: {
    // gotoLesson: function(e) {
    //   let mode = this.properties.mode;
    //   let stat = this.properties.stat;
    //   gotoLessonPage(mode, stat);
    // }
  }
})

// mode          stat
// 0            - 1 不可预习
// 0              0  未预习
// 0              1  预习中
// 0              2	已预习
// 0              3	预习 老师批改中
// 0              4	预习 老师已批改

// 1            - 1  不可作答
// 1              0   未作答
// 1              1   作答中
// 1              2   已作答
// 1              3	 作业 老师批改中
// 1              4   作业 老师已批改