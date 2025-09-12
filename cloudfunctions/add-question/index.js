// 云函数：添加单道题目
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g5ff36n3f39ffad'
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { question, options, answer, explanation, category, difficulty } = event
  
  if (!question || !options || answer === undefined) {
    return {
      success: false,
      message: '缺少必要参数：question, options, answer'
    }
  }
  
  try {
    const questionData = {
      question: question,
      options: options,
      answer: parseInt(answer),
      explanation: explanation || '',
      category: category || 'science',
      difficulty: difficulty || 'easy',
      createTime: db.serverDate()
    }

    const result = await db.collection('questions').add({
      data: questionData
    })

    return {
      success: true,
      message: '题目添加成功',
      id: result._id
    }
  } catch (error) {
    console.error('添加题目失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}
