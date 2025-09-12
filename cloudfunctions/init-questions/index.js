// 云函数：初始化题目数据
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
        message: `数据库中已存在 ${existingQuestions.total} 道题目，跳过初始化`,
        count: existingQuestions.total
      }
    }
    
    // 添加题目数据
    const questions = [
      // 航天探索类题目
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
        question: '国际空间站的主要功能是？',
        options: ['军事侦察', '科学实验', '旅游观光', '通信中继'],
        answer: 1,
        explanation: '国际空间站主要用于进行微重力环境下的科学实验。',
        category: 'space',
        difficulty: 'medium'
      },
      {
        id: 3,
        question: '月球距离地球大约多远？',
        options: ['38万公里', '150万公里', '300万公里', '1000万公里'],
        answer: 0,
        explanation: '月球距离地球平均约38.4万公里。',
        category: 'space',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: '火星的一天比地球的一天？',
        options: ['长', '短', '一样长', '无法确定'],
        answer: 0,
        explanation: '火星的一天（火星日）约为24小时37分钟，比地球的一天稍长。',
        category: 'space',
        difficulty: 'hard'
      },
      
      // 现代农业类题目
      {
        id: 5,
        question: '光合作用主要发生在植物的？',
        options: ['根', '茎', '叶', '花'],
        answer: 2,
        explanation: '叶片含有大量叶绿体，是光合作用主要场所。',
        category: 'agriculture',
        difficulty: 'easy'
      },
      {
        id: 6,
        question: '下列不属于粮食作物的是？',
        options: ['小麦', '玉米', '水稻', '向日葵'],
        answer: 3,
        explanation: '向日葵主要用于制油，不作为主粮。',
        category: 'agriculture',
        difficulty: 'easy'
      },
      {
        id: 7,
        question: '现代农业中，无人机主要用于？',
        options: ['运输货物', '喷洒农药', '收割庄稼', '播种种子'],
        answer: 1,
        explanation: '农业无人机主要用于精准喷洒农药、施肥和监测作物生长。',
        category: 'agriculture',
        difficulty: 'medium'
      },
      {
        id: 8,
        question: '温室效应主要与哪种气体有关？',
        options: ['氧气', '氮气', '二氧化碳', '氢气'],
        answer: 2,
        explanation: '二氧化碳是主要的温室气体，能吸收和重新辐射地球表面的热量。',
        category: 'agriculture',
        difficulty: 'medium'
      },
      
      // 工业技术类题目
      {
        id: 9,
        question: '工业机器人常见的自由度数为？',
        options: ['1-2', '3', '6', '10+'],
        answer: 2,
        explanation: '典型工业机械臂为6自由度，可以完成复杂的空间运动。',
        category: 'industry',
        difficulty: 'medium'
      },
      {
        id: 10,
        question: '3D打印技术属于哪种制造方式？',
        options: ['减材制造', '等材制造', '增材制造', '传统制造'],
        answer: 2,
        explanation: '3D打印是增材制造技术，通过逐层堆积材料来制造物体。',
        category: 'industry',
        difficulty: 'medium'
      },
      {
        id: 11,
        question: '人工智能的核心技术包括？',
        options: ['机器学习', '深度学习', '神经网络', '以上都是'],
        answer: 3,
        explanation: '人工智能的核心技术包括机器学习、深度学习和神经网络等。',
        category: 'industry',
        difficulty: 'hard'
      },
      {
        id: 12,
        question: '工业4.0的主要特征是什么？',
        options: ['机械化', '电气化', '自动化', '智能化'],
        answer: 3,
        explanation: '工业4.0以智能化为主要特征，强调物联网、大数据和人工智能的应用。',
        category: 'industry',
        difficulty: 'hard'
      },
      
      // 基础科学类题目
      {
        id: 13,
        question: '地球绕太阳一周约为？',
        options: ['24小时', '30天', '365天', '12年'],
        answer: 2,
        explanation: '地球公转周期约365天。',
        category: 'science',
        difficulty: 'easy'
      },
      {
        id: 14,
        question: '水的沸点在标准大气压下是？',
        options: ['90°C', '100°C', '110°C', '120°C'],
        answer: 1,
        explanation: '在标准大气压下，水的沸点是100°C。',
        category: 'science',
        difficulty: 'easy'
      },
      {
        id: 15,
        question: 'DNA的全称是？',
        options: ['脱氧核糖核酸', '核糖核酸', '蛋白质', '糖类'],
        answer: 0,
        explanation: 'DNA是脱氧核糖核酸的缩写，是遗传物质的主要载体。',
        category: 'science',
        difficulty: 'medium'
      }
    ];

    // 批量插入题目
    const batch = db.batch()
    questions.forEach(question => {
      const questionRef = db.collection('questions').doc()
      batch.set(questionRef, question)
    })
    await batch.commit()

    return {
      success: true,
      message: `成功添加 ${questions.length} 道题目`,
      count: questions.length
    };
  } catch (error) {
    console.error('初始化题目失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
};
