// 云函数：获取文章列表
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { category, page = 1, limit = 10, sortBy = 'clickCount' } = event
  
  try {
    let query = db.collection('articles')
    
    // 按分类筛选
    if (category && category !== 'all') {
      query = query.where({
        category: category
      })
    }
    
    // 排序
    const orderBy = {}
    orderBy[sortBy] = 'desc'
    query = query.orderBy(sortBy, 'desc')
    
    // 分页
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    
    const result = await query.get()
    
    return {
      success: true,
      data: result.data,
      total: result.data.length,
      page: page,
      limit: limit
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    return { success: false, message: error.message }
  }
}
