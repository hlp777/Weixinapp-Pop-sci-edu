// pages/quiz/test.js
Page({
  data: {
    questions: []
  },

  onLoad() {
    this.loadTestQuestions();
  },

  loadTestQuestions() {
    const testQuestions = [
      {
        id: 1,
        question: '第一个进入太空的人是？',
        options: ['尼尔·阿姆斯特朗', '尤里·加加林', '杨利伟', '巴兹·奥尔德林'],
        answer: 1,
        explanation: '1961年，苏联宇航员尤里·加加林成为首位进入太空的人。'
      },
      {
        id: 2,
        question: '光合作用主要发生在植物的？',
        options: ['根', '茎', '叶', '花'],
        answer: 2,
        explanation: '叶片含有大量叶绿体，是光合作用主要场所。'
      }
    ];

    this.setData({
      questions: testQuestions
    });
  }
});
