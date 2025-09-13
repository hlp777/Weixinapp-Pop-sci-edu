// pages/home/home.js
Page({
  data: {
    userInfo: {
      class: '计科X班',
      name: '张三'
    },
    musicEnabled: false,
    currentTime: '',
    carouselImages: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop'
    ],
    visitCount: 0,
    // 新增科普知识列表
    scienceFacts: [
      {
        id: 1,
        title: "黑洞的秘密",
        content: "黑洞的引力强大到连光都无法逃脱，是宇宙中最神秘的天体之一。"
      },
      {
        id: 2,
        title: "植物的智慧",
        content: "植物虽然没有大脑，但它们能感知环境变化并做出相应的生理反应。"
      },
      {
        id: 3,
        title: "人体的奇迹",
        content: "人体的血管如果连接起来，可以绕地球两圈半。"
      }
    ]
  },

  onLoad() {
    this.updateTime();
    this.loadVisitCount();
    this.startTimeInterval();
    this.checkLoginStatus();
  },

  onShow() {
    this.incrementVisitCount();
  },

  // 更新时间
  updateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    this.setData({
      currentTime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    });
  },

  // 开始时间更新定时器
  startTimeInterval() {
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },

  // 检查登录状态
  checkLoginStatus() {
    const userName = wx.getStorageSync('userName');
    const userClass = wx.getStorageSync('userClass');
    
    if (userName && userClass) {
      // 已登录，设置用户信息
      this.setData({
        isLogin: true,
        'userInfo.name': userName,
        'userInfo.class': userClass
      });
    }
  },

  // 导航到分类页面
  navigateToCategory(e) {
    wx.switchTab({
      url: '/pages/category/category'
    });
  },

  // 导航到答题页面
  navigateToQuiz() {
    wx.switchTab({
      url: '/pages/quiz/quiz'
    });
  },

  // 导航到排行榜页面
  navigateToRanking() {
    wx.navigateTo({
      url: '/pages/ranking/ranking'
    });
  },

  // 导航到关于我们
  navigateToAbout() {
    wx.showModal({
      title: '关于我们',
      content: '科普知识小天地\n版本：1.0.0\n开发者：hlp',
      showCancel: false
    });
  },

  // 加载访问量
  loadVisitCount() {
    const visitCount = wx.getStorageSync('visitCount') || 0;
    this.setData({ visitCount });
  },

  // 增加访问量
  incrementVisitCount() {
    let visitCount = wx.getStorageSync('visitCount') || 0;
    visitCount++;
    wx.setStorageSync('visitCount', visitCount);
    this.setData({ visitCount });
  },
  
  // 查看科普知识详情
  viewScienceFact(e) {
    const fact = e.currentTarget.dataset.fact;
    wx.showModal({
      title: fact.title,
      content: fact.content,
      showCancel: false,
      confirmText: '知道了'
    });
  },
  
  // 查看公告详情
  viewAnnouncement(e) {
    const announcement = e.currentTarget.dataset.announcement;
    wx.showModal({
      title: announcement.title,
      content: announcement.content + '\n\n发布日期: ' + announcement.date,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});