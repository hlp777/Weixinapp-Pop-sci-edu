// 云函数：简单初始化题目数据
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g5ff36n3f39ffad'
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 检查是否已存在题目数据
    const existingQuestions = await db.collection('questions').count()
    
    if (existingQuestions.total > 0) {
      return {
        success: true,
        message: `数据库中已存在 ${existingQuestions.total} 道题目`,
        count: existingQuestions.total
      }
    }
    
    // 添加第一道题目作为测试
    const testQuestion = {
      id: 1,
      question: '第一个进入太空的人是？',
      options: ['尼尔·阿姆斯特朗', '尤里·加加林', '杨利伟', '巴兹·奥尔德林'],
      answer: 1,
      explanation: '1961年，苏联宇航员尤里·加加林成为首位进入太空的人。',
      category: 'space',
      difficulty: 'easy'
    }

    const result = await db.collection('questions').add({
      data: testQuestion
    })

    return {
      success: true,
      message: '成功添加测试题目',
      count: 1,
      id: result._id
    }
  } catch (error) {
    console.error('初始化题目失败:', error)
    return {
      success: false,
      message: error.message,
      error: error.toString()
    }
  }
}
