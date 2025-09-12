// pages/quiz/quiz.js
Page({
  data: {
    currentTime: '',
    questions: [
      {
        question: '第一个进入太空的人是？',
        options: ['尼尔·阿姆斯特朗', '尤里·加加林', '杨利伟', '巴兹·奥尔德林'],
        answer: 1,
        explanation: '1961年，苏联宇航员尤里·加加林成为首位进入太空的人。'
      },
      {
        question: '光合作用主要发生在植物的？',
        options: ['根', '茎', '叶', '花'],
        answer: 2,
        explanation: '叶片含有大量叶绿体，是光合作用主要场所。'
      },
      {
        question: '工业机器人常见的自由度数为？',
        options: ['1-2', '3', '6', '10+'],
        answer: 2,
        explanation: '典型工业机械臂为6自由度。'
      },
      {
        question: '地球绕太阳一周约为？',
        options: ['24小时', '30天', '365天', '12年'],
        answer: 2,
        explanation: '地球公转周期约365天。'
      },
      {
        question: '下列不属于粮食作物的是？',
        options: ['小麦', '玉米', '水稻', '向日葵'],
        answer: 3,
        explanation: '向日葵主要用于制油，不作为主粮。'
      }
    ],
    currentIndex: 0,
    selectedIndex: -1,
    userAnswers: [],
    correctCount: 0,
    wrongCount: 0,
    score: 0,
    showResult: false,
    showFeedback: false,
    feedbackText: ''
  },

  onLoad() {
    this.updateTime();
    this.startTimeInterval();
    this.initQuiz();
  },

  // 初始化答题
  initQuiz() {
    this.setData({
      currentIndex: 0,
      selectedIndex: -1,
      userAnswers: new Array(this.data.questions.length).fill(-1),
      correctCount: 0,
      wrongCount: 0,
      score: 0,
      showResult: false,
      showFeedback: false
    });
  },

  // 更新时间
  updateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    this.setData({
      currentTime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    });
  },

  // 开始时间更新定时器
  startTimeInterval() {
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },

  // 选择选项
  selectOption(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedIndex: index });
    
    // 显示即时反馈
    const currentQuestion = this.data.questions[this.data.currentIndex];
    const isCorrect = index === currentQuestion.answer;
    this.setData({
      showFeedback: true,
      feedbackText: isCorrect ? '回答正确 ✅' : '回答错误 ❌'
    });
  },

  // 上一题
  prevQuestion() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1,
        selectedIndex: this.data.userAnswers[this.data.currentIndex - 1],
        showFeedback: false
      });
    }
  },

  // 下一题
  nextQuestion() {
    if (this.data.selectedIndex !== -1) {
      // 保存当前答案
      const userAnswers = this.data.userAnswers;
      userAnswers[this.data.currentIndex] = this.data.selectedIndex;
      
      if (this.data.currentIndex < this.data.questions.length - 1) {
        this.setData({
          currentIndex: this.data.currentIndex + 1,
          selectedIndex: userAnswers[this.data.currentIndex + 1],
          userAnswers: userAnswers,
          showFeedback: false
        });
      }
    }
  },

  // 提交答题
  submitQuiz() {
    if (this.data.selectedIndex === -1) {
      wx.showToast({
        title: '请选择答案',
        icon: 'none'
      });
      return;
    }

    // 保存最后一题答案
    const userAnswers = this.data.userAnswers;
    userAnswers[this.data.currentIndex] = this.data.selectedIndex;

    // 计算成绩
    let correctCount = 0;
    let wrongCount = 0;
    
    this.data.questions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctCount++;
      } else if (userAnswers[index] !== -1) {
        wrongCount++;
      }
    });

    const score = Math.round((correctCount / this.data.questions.length) * 100);

    this.setData({
      userAnswers: userAnswers,
      correctCount: correctCount,
      wrongCount: wrongCount,
      score: score,
      showResult: true
    });

    // 保存答题记录
    this.saveQuizRecord(score, correctCount, wrongCount);
  },

  // 保存答题记录
  saveQuizRecord(score, correctCount, wrongCount) {
    const records = wx.getStorageSync('quizRecords') || [];
    const record = {
      id: Date.now(),
      score: score,
      correctCount: correctCount,
      wrongCount: wrongCount,
      date: new Date().toISOString(),
      questions: this.data.questions.length
    };
    records.unshift(record);
    
    // 只保留最近10次记录
    if (records.length > 10) {
      records.splice(10);
    }
    
    wx.setStorageSync('quizRecords', records);
  },

  // 再试一次
  retryQuiz() {
    this.initQuiz();
  },

  // 获取当前题目
  get currentQuestion() {
    return this.data.questions[this.data.currentIndex];
  },

  // 获取进度百分比
  get progress() {
    return (this.data.currentIndex / this.data.questions.length) * 100;
  }
});
