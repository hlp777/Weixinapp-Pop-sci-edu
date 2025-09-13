// pages/home/home.js
Page({
  data: {
    userInfo: {
      class: '计科X班',
      name: '张三',
      project: '科普天地'
    },
    musicEnabled: false,
    currentTime: '',
    carouselImages: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop'
    ],
    visitCount: 0
  },

  onLoad() {
    this.updateTime();
    this.loadVisitCount();
    this.startTimeInterval();
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

  // 切换音乐
  toggleMusic() {
    const musicEnabled = !this.data.musicEnabled;
    this.setData({ musicEnabled });
    
    if (musicEnabled) {
      wx.showToast({
        title: '音乐已开启',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '音乐已关闭',
        icon: 'none'
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
      content: '科普知识小天地\n版本：1.0.0\n开发者：计科X班',
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
  }
});
