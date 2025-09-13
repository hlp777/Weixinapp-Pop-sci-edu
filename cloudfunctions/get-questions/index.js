// 云函数：获取题目列表
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g5ff36n3f39ffad'
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { category, count = 5, difficulty } = event
  
  try {
    let query = db.collection('questions')
    
    // 按分类筛选
    if (category && category !== 'all') {
      query = query.where({
        category: category
      })
    }
    
    // 按难度筛选
    if (difficulty && difficulty !== 'mixed') {
      query = query.where({
        difficulty: difficulty
      })
    }
    
    // 获取题目
    const result = await query.get()
    
    if (result.data.length === 0) {
      return {
        success: false,
        message: '暂无题目数据'
      }
    }
    
    // 随机选择指定数量的题目
    const shuffled = result.data.sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffled.slice(0, Math.min(count, result.data.length))
    
    return {
      success: true,
      data: selectedQuestions,
      total: selectedQuestions.length
    }
  } catch (error) {
    console.error('获取题目失败:', error)
    return { 
      success: false, 
      message: error.message 
    }
  }
}