// components/lesson/lesson.js
Component({
  properties: {
    item: Object,
    index: Number,
    isAsk: Boolean
  },

  data: {
    thisIndex: 0,
    btnClass: '',
    rightOrWrong: -1
  },

  ready() {
    // console.log(this.properties.item)
    let a = this.properties.index + 1;
    this.setData({
      thisIndex: a < 10 ? '0' + a : a
    });
    // console.log(this.properties.item);
    // console.log(this.properties.index);
    // console.log(JSON.parse(this.properties.item.rightOrWrong));
    let s = JSON.parse(this.properties.item.rightOrWrong);
    if (!s) {
      this.setData({
        rightOrWrong: -1
      });
    } else {
      this.setData({
        rightOrWrong: s.type
      });
    }
  },

  methods: {

  }
})