// pages/quiz/quiz.js
const util = require('../../utils/util.js')

Page({
  data: {
    currentTime: '',
    questions: [],
    currentIndex: 0,
    selectedIndex: -1,
    userAnswers: [],
    correctCount: 0,
    wrongCount: 0,
    score: 0,
    showResult: false,
    showFeedback: false,
    feedbackText: '',
    loading: true,
    userId: '',
    startTime: 0,
    duration: 0
  },

  onLoad(options) {
    this.updateTime();
    this.startTimeInterval();
    this.initUser();
    this.loadQuestions();
  },

  // 初始化用户
  initUser() {
    // 获取用户ID，如果没有则生成一个临时ID
    let userId = wx.getStorageSync('userId');
    if (!userId) {
      userId = util.generateId();
      wx.setStorageSync('userId', userId);
    }
    this.setData({ userId });
  },

  // 加载题目
  async loadQuestions() {
    try {
      util.showLoading('加载题目中...');
      
      // 先尝试使用本地题目，确保基本功能可用
      this.loadLocalQuestions();
      
      // 然后尝试从云数据库加载（可选）
      try {
        const result = await wx.cloud.callFunction({
          name: 'get-questions',
          data: {
            category: 'all',
            count: 5,
            difficulty: 'mixed'
          }
        });

        console.log('云函数调用结果:', result);
        if (result.result && result.result.success && result.result.data && result.result.data.length > 0) {
          console.log('从云数据库加载题目成功:', result.result.data);
          this.setData({
            questions: result.result.data,
            loading: false
          });
          this.initQuiz();
        } else {
          console.log('云函数返回数据为空或失败:', result);
        }
      } catch (cloudError) {
        console.log('云函数调用失败，继续使用本地题目:', cloudError);
      }
    } catch (error) {
      console.error('加载题目失败:', error);
      this.loadLocalQuestions();
    } finally {
      util.hideLoading();
    }
  },

  // 加载本地备用题目
  loadLocalQuestions() {
    const localQuestions = [
      {
        id: 1,
        question: '第一个进入太空的人是？',
        options: ['尼尔·阿姆斯特朗', '尤里·加加林', '杨利伟', '巴兹·奥尔德林'],
        answer: 1,
        explanation: '1961年，苏联宇航员尤里·加加林成为首位进入太空的人。',
        category: 'space',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: '光合作用主要发生在植物的？',
        options: ['根', '茎', '叶', '花'],
        answer: 2,
        explanation: '叶片含有大量叶绿体，是光合作用主要场所。',
        category: 'agriculture',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: '工业机器人常见的自由度数为？',
        options: ['1-2', '3', '6', '10+'],
        answer: 2,
        explanation: '典型工业机械臂为6自由度。',
        category: 'industry',
        difficulty: 'medium'
      },
      {
        id: 4,
        question: '地球绕太阳一周约为？',
        options: ['24小时', '30天', '365天', '12年'],
        answer: 2,
        explanation: '地球公转周期约365天。',
        category: 'space',
        difficulty: 'easy'
      },
      {
        id: 5,
        question: '下列不属于粮食作物的是？',
        options: ['小麦', '玉米', '水稻', '向日葵'],
        answer: 3,
        explanation: '向日葵主要用于制油，不作为主粮。',
        category: 'agriculture',
        difficulty: 'easy'
      }
    ];

    console.log('使用本地备用题目:', localQuestions);
    this.setData({
      questions: localQuestions,
      loading: false
    });
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
      showFeedback: false,
      startTime: Date.now()
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
    if (currentQuestion) {
      const isCorrect = index === currentQuestion.answer;
      this.setData({
        showFeedback: true,
        feedbackText: isCorrect ? '回答正确 ✅' : '回答错误 ❌'
      });
    }
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
  async submitQuiz() {
    if (this.data.selectedIndex === -1) {
      util.showError('请选择答案');
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
    const duration = Math.round((Date.now() - this.data.startTime) / 1000); // 答题时长（秒）

    this.setData({
      userAnswers: userAnswers,
      correctCount: correctCount,
      wrongCount: wrongCount,
      score: score,
      showResult: true,
      duration: duration
    });

    // 保存答题记录到云数据库
    await this.saveQuizRecordToCloud(score, correctCount, wrongCount, userAnswers, duration);
    
    // 同时保存到本地存储
    this.saveQuizRecordToLocal(score, correctCount, wrongCount);
  },

  // 保存答题记录到云数据库
  async saveQuizRecordToCloud(score, correctCount, wrongCount, userAnswers, duration) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'save-quiz-record',
        data: {
          userId: this.data.userId,
          score: score,
          correctCount: correctCount,
          wrongCount: wrongCount,
          totalQuestions: this.data.questions.length,
          userAnswers: userAnswers,
          questions: this.data.questions.map(q => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
            category: q.category,
            difficulty: q.difficulty
          })),
          duration: duration
        }
      });

      if (result.result.success) {
        console.log('答题记录已保存到云数据库');
        util.showSuccess('答题完成！');
      } else {
        console.error('保存答题记录失败:', result.result.message);
      }
    } catch (error) {
      console.error('保存答题记录到云数据库失败:', error);
    }
  },

  // 保存答题记录到本地存储
  saveQuizRecordToLocal(score, correctCount, wrongCount) {
    const records = wx.getStorageSync('quizRecords') || [];
    const record = {
      id: Date.now(),
      score: score,
      correctCount: correctCount,
      wrongCount: wrongCount,
      date: new Date().toISOString(),
      questions: this.data.questions.length,
      duration: this.data.duration
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
    this.setData({
      loading: true,
      showResult: false
    });
    this.loadQuestions();
  },

});
