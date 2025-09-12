// 云函数：保存答题记录
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g5ff36n3f39ffad'
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { 
    userId, 
    score, 
    correctCount, 
    wrongCount, 
    totalQuestions, 
    userAnswers, 
    questions, 
    duration 
  } = event
  
  if (!userId) {
    return { success: false, message: '缺少用户ID' }
  }
  
  try {
    const record = {
      userId: userId,
      score: score,
      correctCount: correctCount,
      wrongCount: wrongCount,
      totalQuestions: totalQuestions,
      userAnswers: userAnswers,
      questions: questions,
      duration: duration || 0,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
    
    const result = await db.collection('quiz_records').add({
      data: record
    })
    
    return {
      success: true,
      data: {
        recordId: result._id,
        score: score,
        correctCount: correctCount,
        wrongCount: wrongCount
      }
    }
  } catch (error) {
    console.error('保存答题记录失败:', error)
    return { 
      success: false, 
      message: error.message 
    }
  }
}
