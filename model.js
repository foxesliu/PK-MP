import {
  request
} from './public/js/request.js';

// 根据学生ID获取当前学生所在班级的所有的课程包
export const getCourseByUserId = (data, callback) => {
  request({
    url: `/aom/course/queryCourseList/Ruser/Date/${data.id}?pages=1&pageSize=10000`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 已完结的课程
export const getFinshedCourse = (ruserId, stat, callback) => {
  request({
    url: '/apps/mp/phRuserLesson/have/finshed/course/' + ruserId + '/' + stat,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}


// 根据学生ID ruserId ,课程ID courseId, 是否已上课 type 查询课程列表
export const getPhRuserLesson = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLesson/${data.ruserId}/${data.courseId}/${data.type}`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 根据学生ID查询额外布置练习
export const getPhRuserLessonExtra = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLesson/extra/${data.ruserId}/${data.courseId}/${data.isExtra}`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// // 查询课程列表 根据学生ID ruserId, 课程ID courseId, 是否已上课 type
// // 详情页查询、发起提问、查看孩子的学习成果
// export const getPhRuserLessonContent = (data, callback) => {
//   request({
//     url: '/apps/mp/phRuserLesson/content/293773/986/0/86/0',
//     data: data,
//     sCallback: function(res) {
//       callback && callback(res);
//     }
//   })
// }



// 开始答题、发起提问第二页中的发起提问 ? 接口
export const lessonSectionContentQuery = (data, callback) => {
  request({
    url: `/apps/mp/lessonSectionContent/query/${data.secId}/${data.ruserId}/${data.mode}/${data.isExtra}/${data.stat}/${data.prlId}`,
    data: data,
    notToken: true,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// MP文件上传接口
export const lessonSectionContentUpload = (data, callback) => {
  request({
    url: `/apps/mp/lessonSectionContent/upload`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 详情页查询、发起提问、查看孩子的学习成果
export const phRuserLessonContent = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLesson/content/${data.ruserId}/${data.lessonId}/${data.mode}/${data.courseId}/${data.isExtra}`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 根据学生ID查询额外布置练习
export const phRuserLessonExtra = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLesson/extra/${data.ruserId}/${data.isExtra}`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 已完结的课程
export const phRuserLessonHaveFinshedCourse = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLesson/have/finshed/course/${data.ruserId}`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 提交本节内容
export const phRuserLessonSubmit = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLesson/submit/lesson`,
    data: data,
    type: 'POST',
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 根据学生ID ruserId, 课程ID courseId, 是否已上课 type 查询课程列表
export const getPhRuserLessonContent = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLesson/content/${data.ruserId}/${data.lessonId}/${data.mode}/${data.courseId}/${data.isExtra}`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 查询当前微信用户是否赞过该节课
export const phRuserLessonAnswerQueryWechatUserHaveLiked = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLessonAnswer/query/wechatUser/haveLiked/${data.prlId}/${data.ruserId}/${data.openId}`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 我的提问 / 老师批注----> 查看
export const phRuserLessonQaInformation = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLessonQa/qa/information`,
    data: data,
    notToken: true,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 回复老师
export const phRuserLessonQaReplayQa = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLessonQa/replay/qa`,
    data: data,
    type: 'PUT',
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 单题作答
export const phRuserLessonQaSubmitAnswer = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLessonQa/submit/answer`,
    data: data,
    type: 'PUT',
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 发起提问
export const phRuserLessonQaSubmitQa = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLessonQa/submit/qa`,
    data: data,
    type: 'PUT',
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 我的提问，老师批注
export const phRuserLessonQa = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLessonQa/${data.ruserId}/${data.stat}/${data.type}/${data.prlId}`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

export const phRuserLessonQaQuizInformation = (data, callback) => {
  request({
    url: `/apps/mp/phRuserLessonQa/quiz/information`,
    data: data,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 新版预习作业与分享_内容返回
export const newContent = (ruserId, prlId, callback) => {
  request({
    url: `/apps/mp/phRuserLesson/new/content/${ruserId}/${prlId} `,
    // data: data,
    notToken: true,
    sCallback: function(res) {
      callback && callback(res);
    }
  })
}

// 294096 7756 









// // 我的提问，老师批注
// export const getPhRuserLessonQa = (data, callback) => {
//   request({
//     url: `/apps/mp/phRuserLessonQa/${data.ruserId}/${data.stat}/${data.type}/${data.prlId} `,
//     data: data,
//     sCallback: function(res) {
//       callback && callback(res);
//     }
//   })
// }




// 张三丰:
// http://test.proudkids.cn/aom/course/queryCourseList/Ruser/Date/294214?pages=1&pageSize=10000

// 张三丰:
// http://test.proudkids.cn/apps/mp/phRuserLesson/294214/79/0

// 张三丰:
// http://test.proudkids.cn/apps/mp/phRuserLesson/content/294214/966/0/79/0