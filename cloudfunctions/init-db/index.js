// 云函数：初始化数据库
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { action } = event
  
  try {
    switch (action) {
      case 'initCollections':
        return await initCollections()
      case 'addSampleData':
        return await addSampleData()
      default:
        return { success: false, message: '未知操作' }
    }
  } catch (error) {
    console.error('云函数执行失败:', error)
    return { success: false, message: error.message }
  }
}

// 初始化集合
async function initCollections() {
  try {
    // 创建文章集合
    await db.createCollection('articles')
    
    // 创建题目集合
    await db.createCollection('questions')
    
    // 创建用户答题记录集合
    await db.createCollection('quiz_records')
    
    // 创建用户收藏集合
    await db.createCollection('user_favorites')
    
    return { success: true, message: '数据库初始化成功' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// 添加示例数据
async function addSampleData() {
  try {
    // 添加文章数据
    const articles = [
      {
        id: 1,
        title: '近地轨道卫星入门',
        category: 'space',
        author: '科普君',
        content: '近地轨道（LEO）卫星是指轨道高度在2000公里以下的卫星...',
        image: 'https://images.unsplash.com/photo-1581092334631-1cd828e3c6d5?q=80&w=1200&auto=format&fit=crop',
        clickCount: 1234,
        likeCount: 23,
        date: '2025-05-20',
        tags: ['卫星', '轨道', '通信']
      },
      {
        id: 2,
        title: '液体火箭发动机原理',
        category: 'space',
        author: '科普君',
        content: '液体火箭发动机通过燃烧液体燃料与液体氧化剂产生高温高压气体...',
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
        clickCount: 987,
        likeCount: 45,
        date: '2025-06-02',
        tags: ['火箭', '发动机', '推进']
      }
    ]

    for (const article of articles) {
      await db.collection('articles').add({
        data: article
      })
    }

    // 添加题目数据
    const questions = [
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
      }
    ]

    for (const question of questions) {
      await db.collection('questions').add({
        data: question
      })
    }

    return { success: true, message: '示例数据添加成功' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}
