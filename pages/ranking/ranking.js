// pages/ranking/ranking.js
Page({
  data: {
    currentTime: '',
    sortIndex: 0,
    sortOptions: ['按点击量', '按时间', '按点赞量'],
    originalList: [
      {
        id: 1,
        title: '液体火箭发动机原理',
        clickCount: 2345,
        likeCount: 45,
        date: '2025-06-02',
        heat: 98
      },
      {
        id: 2,
        title: '近地轨道卫星入门',
        clickCount: 1890,
        likeCount: 32,
        date: '2025-05-20',
        heat: 90
      },
      {
        id: 3,
        title: '智慧农业无人机技术',
        clickCount: 1450,
        likeCount: 28,
        date: '2025-05-15',
        heat: 84
      },
      {
        id: 4,
        title: '齿轮制造工艺',
        clickCount: 1203,
        likeCount: 25,
        date: '2025-06-05',
        heat: 76
      },
      {
        id: 5,
        title: '载人飞船生命保障系统',
        clickCount: 987,
        likeCount: 20,
        date: '2025-07-01',
        heat: 72
      },
      {
        id: 6,
        title: '精准灌溉系统',
        clickCount: 654,
        likeCount: 15,
        date: '2025-06-10',
        heat: 68
      }
    ],
    rankedList: []
  },

  onLoad() {
    this.updateTime();
    this.startTimeInterval();
    this.sortList();
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

  // 排序改变
  onSortChange(e) {
    this.setData({ sortIndex: e.detail.value });
    this.sortList();
  },

  // 排序列表
  sortList() {
    let sortedList = [...this.data.originalList];
    
    switch (this.data.sortIndex) {
      case 0: // 按点击量排序
        sortedList.sort((a, b) => b.clickCount - a.clickCount);
        break;
      case 1: // 按时间排序
        sortedList.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 2: // 按点赞量排序
        sortedList.sort((a, b) => b.likeCount - a.likeCount);
        break;
    }

    // 添加排名和样式
    const rankedList = sortedList.map((item, index) => {
      const rank = index + 1;
      let medalClass = '';
      if (rank === 1) medalClass = 'gold';
      else if (rank === 2) medalClass = 'silver';
      else if (rank === 3) medalClass = 'bronze';

      // 计算百分比（相对于最高值）
      const maxValue = this.getMaxValue(sortedList);
      const percentage = (item[this.getSortField()] / maxValue) * 100;

      return {
        ...item,
        rank,
        medalClass,
        percentage: Math.round(percentage)
      };
    });

    this.setData({ rankedList });
  },

  // 获取排序字段
  getSortField() {
    switch (this.data.sortIndex) {
      case 0: return 'clickCount';
      case 1: return 'date';
      case 2: return 'likeCount';
      default: return 'clickCount';
    }
  },

  // 获取最大值
  getMaxValue(list) {
    const field = this.getSortField();
    if (field === 'date') {
      return Math.max(...list.map(item => new Date(item[field]).getTime()));
    }
    return Math.max(...list.map(item => item[field]));
  }
});
