// pages/category/category.js
Page({
  data: {
    currentTime: '',
    categoryCounts: {
      space: 12,
      agriculture: 9,
      industry: 15
    }
  },

  onLoad(options) {
    this.updateTime();
    this.startTimeInterval();
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

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 导航到内容列表页
  navigateToList(e) {
    const category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: `/pages/list/list?category=${category}`
    });
  }
});
