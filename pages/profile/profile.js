// pages/profile/profile.js
Page({
  data: {
    currentTime: '',
    userInfo: {
      name: '科普爱好者',
      class: '计科X班',
      avatar: '👤'
    },
    stats: {
      quizCount: 0,
      bestScore: 0,
      favoriteCount: 0
    },
    favorites: [],
    quizRecords: []
  },

  onLoad() {
    this.updateTime();
    this.startTimeInterval();
    this.loadUserData();
  },

  onShow() {
    this.loadUserData();
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

  // 加载用户数据
  loadUserData() {
    this.loadStats();
    this.loadFavorites();
    this.loadQuizRecords();
  },

  // 加载统计数据
  loadStats() {
    const quizRecords = wx.getStorageSync('quizRecords') || [];
    const favorites = wx.getStorageSync('favorites') || [];
    
    let quizCount = quizRecords.length;
    let bestScore = 0;
    
    if (quizRecords.length > 0) {
      bestScore = Math.max(...quizRecords.map(record => record.score));
    }
    
    this.setData({
      stats: {
        quizCount: quizCount,
        bestScore: bestScore,
        favoriteCount: favorites.length
      }
    });
  },

  // 加载收藏列表
  loadFavorites() {
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({ favorites });
  },

  // 加载答题记录
  loadQuizRecords() {
    const records = wx.getStorageSync('quizRecords') || [];
    // 只显示最近5条记录
    const recentRecords = records.slice(0, 5).map(record => ({
      ...record,
      date: this.formatDate(record.date)
    }));
    this.setData({ quizRecords: recentRecords });
  },

  // 格式化日期
  formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  },

  // 导航到详情页
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 显示关于我们
  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '科普知识小天地\n版本：1.0.0\n开发者：计科X班\n\n用科技点亮知识之光',
      showCancel: false
    });
  },

  // 清除数据
  clearData() {
    wx.showModal({
      title: '清除数据',
      content: '确定要清除所有本地数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.loadUserData();
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          });
        }
      }
    });
  }
});
