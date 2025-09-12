// pages/admin/admin.js
Page({
  data: {
    questionForm: {
      question: '',
      options: ['', '', '', ''],
      answer: 0,
      explanation: '',
      category: 'space',
      categoryIndex: 0,
      difficulty: 'easy',
      difficultyIndex: 0
    },
    status: ''
  },

  onLoad() {
    this.checkQuestions()
  },

  // 题目内容输入
  onQuestionInput(e) {
    this.setData({
      'questionForm.question': e.detail.value
    })
  },

  // 选项输入
  onOptionInput(e) {
    const index = e.currentTarget.dataset.index
    const options = this.data.questionForm.options
    options[index] = e.detail.value
    this.setData({
      'questionForm.options': options
    })
  },

  // 答案选择
  onAnswerChange(e) {
    this.setData({
      'questionForm.answer': parseInt(e.detail.value)
    })
  },

  // 解析输入
  onExplanationInput(e) {
    this.setData({
      'questionForm.explanation': e.detail.value
    })
  },

  // 分类选择
  onCategoryChange(e) {
    const categories = ['space', 'agriculture', 'industry', 'science']
    this.setData({
      'questionForm.categoryIndex': parseInt(e.detail.value),
      'questionForm.category': categories[parseInt(e.detail.value)]
    })
  },

  // 难度选择
  onDifficultyChange(e) {
    const difficulties = ['easy', 'medium', 'hard']
    this.setData({
      'questionForm.difficultyIndex': parseInt(e.detail.value),
      'questionForm.difficulty': difficulties[parseInt(e.detail.value)]
    })
  },

  // 添加题目
  async addQuestion() {
    const form = this.data.questionForm
    
    if (!form.question || form.options.some(opt => !opt)) {
      this.setData({ status: '请填写完整的题目信息' })
      return
    }

    try {
      wx.showLoading({ title: '添加中...' })
      
      const result = await wx.cloud.callFunction({
        name: 'add-question',
        data: {
          question: form.question,
          options: form.options,
          answer: form.answer,
          explanation: form.explanation,
          category: form.category,
          difficulty: form.difficulty
        }
      })

      if (result.result.success) {
        this.setData({ 
          status: '题目添加成功！',
          questionForm: {
            question: '',
            options: ['', '', '', ''],
            answer: 0,
            explanation: '',
            category: 'space',
            categoryIndex: 0,
            difficulty: 'easy',
            difficultyIndex: 0
          }
        })
        this.checkQuestions()
      } else {
        this.setData({ status: '添加失败：' + result.result.message })
      }
    } catch (error) {
      console.error('添加题目失败:', error)
      this.setData({ status: '添加失败：' + error.message })
    } finally {
      wx.hideLoading()
    }
  },

  // 初始化简单题目
  async initSimpleQuestions() {
    try {
      wx.showLoading({ title: '初始化中...' })
      
      const result = await wx.cloud.callFunction({
        name: 'simple-init-questions'
      })

      this.setData({ 
        status: result.result.message 
      })
      this.checkQuestions()
    } catch (error) {
      console.error('初始化失败:', error)
      this.setData({ status: '初始化失败：' + error.message })
    } finally {
      wx.hideLoading()
    }
  },

  // 检查题目数量
  async checkQuestions() {
    try {
      const result = await wx.cloud.callFunction({
        name: 'get-questions',
        data: { count: 1 }
      })

      if (result.result.success) {
        this.setData({ 
          status: `当前数据库中有题目，共 ${result.result.data.length} 道` 
        })
      } else {
        this.setData({ 
          status: '数据库中没有题目，请先初始化' 
        })
      }
    } catch (error) {
      console.error('检查题目失败:', error)
      this.setData({ 
        status: '检查失败：' + error.message 
      })
    }
  }
})
