// pages/list/list.js
Page({
  data: {
    currentTime: '',
    category: '',
    categoryTitle: '',
    searchKeyword: '',
    sortIndex: 0,
    sortOptions: ['按点击量', '按时间'],
    list: [],
    filteredList: []
  },

  onLoad(options) {
    this.setData({
      category: options.category || 'space'
    });
    this.updateTime();
    this.startTimeInterval();
    this.loadCategoryData();
  },

  // 加载分类数据
  loadCategoryData() {
    const categoryMap = {
      space: {
        title: '航天探索',
        data: [
          {
            id: 1,
            title: '近地轨道卫星入门',
            description: '了解LEO卫星的轨道、应用与发展趋势。',
            image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
            clickCount: 1234,
            date: '2025-05-20'
          },
          {
            id: 2,
            title: '液体火箭发动机原理',
            description: '推力产生机制、结构构成与关键技术概览。',
            image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
            clickCount: 987,
            date: '2025-06-02'
          },
          {
            id: 3,
            title: '载人飞船生命保障系统',
            description: '空气、水、温度与压力的闭环控制与冗余设计。',
            image: 'https://images.unsplash.com/photo-1447433819943-74a20887a81e?q=80&w=1200&auto=format&fit=crop',
            clickCount: 763,
            date: '2025-07-01'
          }
        ]
      },
      agriculture: {
        title: '现代农业',
        data: [
          {
            id: 4,
            title: '智慧农业无人机技术',
            description: '无人机在农业监测、植保、播种中的应用。',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
            clickCount: 892,
            date: '2025-05-15'
          },
          {
            id: 5,
            title: '精准灌溉系统',
            description: '基于传感器和AI的智能灌溉解决方案。',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop',
            clickCount: 654,
            date: '2025-06-10'
          }
        ]
      },
      industry: {
        title: '工业技术',
        data: [
          {
            id: 6,
            title: '工业机器人技术',
            description: '六轴机械臂的工作原理与应用场景。',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
            clickCount: 1123,
            date: '2025-05-25'
          },
          {
            id: 7,
            title: '齿轮制造工艺',
            description: '精密齿轮加工技术与质量控制。',
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=1200&auto=format&fit=crop',
            clickCount: 789,
            date: '2025-06-05'
          }
        ]
      }
    };

    const categoryData = categoryMap[this.data.category];
    if (categoryData) {
      this.setData({
        categoryTitle: categoryData.title,
        list: categoryData.data,
        filteredList: categoryData.data
      });
    }
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

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.filterList();
  },

  // 排序改变
  onSortChange(e) {
    this.setData({ sortIndex: e.detail.value });
    this.filterList();
  },

  // 过滤和排序列表
  filterList() {
    let filteredList = [...this.data.list];
    
    // 搜索过滤
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filteredList = filteredList.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.description.toLowerCase().includes(keyword)
      );
    }
    
    // 排序
    if (this.data.sortIndex == 0) {
      // 按点击量排序
      filteredList.sort((a, b) => b.clickCount - a.clickCount);
    } else {
      // 按时间排序
      filteredList.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    this.setData({ filteredList });
  },

  // 导航到详情页
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
});
