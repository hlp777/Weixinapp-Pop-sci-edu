// 云函数：更新点击量
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { articleId } = event
  
  if (!articleId) {
    return { success: false, message: '缺少文章ID' }
  }
  
  try {
    // 更新文章点击量
    const result = await db.collection('articles').doc(articleId).update({
      data: {
        clickCount: db.command.inc(1)
      }
    })
    
    return {
      success: true,
      message: '点击量更新成功'
    }
  } catch (error) {
    console.error('更新点击量失败:', error)
    return { success: false, message: error.message }
  }
}
