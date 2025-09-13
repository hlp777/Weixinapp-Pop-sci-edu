// 云函数：获取用户答题记录
// 业务场景：统计所有用户答题次数总和
// 数据使用目的：在profile页面展示总答题次数
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g5ff36n3f39ffad'
})

const db = cloud.database()

exports.main = async (event, context) => {
  // 注意：此接口不依赖用户ID，用于统计所有用户的答题记录总数
  const { page = 1, limit = 10 } = event
  
  try {
    const skip = (page - 1) * limit
    
    const result = await db.collection('quiz_records')
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(limit)
      .get()
    
    // 获取总数
    const countResult = await db.collection('quiz_records')
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