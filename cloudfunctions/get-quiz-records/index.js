// 云函数：获取用户答题记录
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g5ff36n3f39ffad'
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { userId, page = 1, limit = 10 } = event
  
  if (!userId) {
    return { success: false, message: '缺少用户ID' }
  }
  
  try {
    const skip = (page - 1) * limit
    
    const result = await db.collection('quiz_records')
      .where({
        userId: userId
      })
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(limit)
      .get()
    
    // 获取总数
    const countResult = await db.collection('quiz_records')
      .where({
        //userId: userId
      })
      .count()
    
    return {
      success: true,
      data: result.data,
      total: countResult.total,
      page: page,
      limit: limit
    }
  } catch (error) {
    console.error('获取答题记录失败:', error)
    return { 
      success: false, 
      message: error.message 
    }
  }
}
