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
    quizRecords: [],
    // 添加登录状态标识
    isLogin: false,
    // 添加用户ID
    userId: ''
  },

  onLoad() {
    this.updateTime();
    this.startTimeInterval();
    
    // 检查登录状态
    this.checkLoginStatus();
  },

  onShow() {
    // 只有登录后才加载数据
    if (this.data.isLogin) {
      this.loadUserData();
    }
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
      
      // 获取用户ID
      //this.getUserId();
    } else {
      // 未登录，显示登录弹窗
      this.showLoginDialog();
    }
  },

  // 获取用户ID
  // getUserId() {
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     success: res => {
  //       this.setData({
  //         userId: res.result.openid
  //       });
  //       this.loadUserData();
  //     },
  //     fail: err => {
  //       console.error('获取用户ID失败', err);
  //       wx.showToast({
  //         title: '获取用户信息失败',
  //         icon: 'none'
  //       });
  //     }
  //   });
  // },

  // 显示登录弹窗
  showLoginDialog() {
    this.showNameInput();
  },

  // 显示姓名输入
  showNameInput() {
    const that = this;
    wx.showModal({
      title: '用户登录',
      content: '请输入您的姓名',
      editable: true,
      placeholderText: '姓名',
      success(res) {
        if (res.confirm) {
          if (res.content) {
            // 保存姓名并继续输入班级
            that.setData({
              'tempUserInfo.name': res.content
            });
            that.showClassInput(res.content);
          } else {
            // 未输入内容，重新显示输入框
            wx.showToast({
              title: '请输入姓名',
              icon: 'none'
            });
            that.showNameInput();
          }
        } else if (res.cancel) {
          // 用户点击取消，可以再次询问是否需要登录
          that.askIfLogin();
        }
      },
      fail() {
        that.askIfLogin();
      }
    });
  },

  // 显示班级输入
  showClassInput(name) {
    const that = this;
    wx.showModal({
      title: '用户登录',
      content: '请输入您的班级',
      editable: true,
      placeholderText: '班级',
      success(res) {
        if (res.confirm) {
          if (res.content) {
            // 保存用户信息
            wx.setStorageSync('userName', name);
            wx.setStorageSync('userClass', res.content);
            
            // 更新页面数据
            that.setData({
              isLogin: true,
              'userInfo.name': name,
              'userInfo.class': res.content
            });
            
            // 获取用户ID
            //that.getUserId();
            
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
          } else {
            // 未输入内容，重新显示输入框
            wx.showToast({
              title: '请输入班级',
              icon: 'none'
            });
            that.showClassInput(name);
          }
        } else if (res.cancel) {
          // 用户点击取消，重新输入姓名
          that.showNameInput();
        }
      }
    });
  },

  // 询问是否需要登录
  askIfLogin() {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '需要登录才能使用个人中心功能，是否现在登录？',
      success(res) {
        if (res.confirm) {
          that.showNameInput();
        } else if (res.cancel) {
          // 用户取消登录，可以继续询问
          setTimeout(() => {
            that.askIfLogin();
          }, 1000);
        }
      }
    });
  },

  // 退出登录
  logout() {
    const that = this;
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success(res) {
        if (res.confirm) {
          // 清除本地存储的用户信息
          wx.removeStorageSync('userName');
          wx.removeStorageSync('userClass');
          
          // 重置页面数据
          that.setData({
            isLogin: false,
            userId: '',
            'userInfo.name': '科普爱好者',
            'userInfo.class': '计科X班',
            stats: {
              quizCount: 0,
              bestScore: 0,
              favoriteCount: 0
            },
            favorites: [],
            quizRecords: []
          });
          
          // 重新显示登录弹窗
          that.showLoginDialog();
        }
      }
    });
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
    // 只有登录后才加载数据
    if (this.data.isLogin) {
      this.loadStats();
      this.loadFavorites();
      this.loadQuizRecords();
    }
  },

  // 加载统计数据
  loadStats() {
    // 从云数据库获取统计数据
    wx.cloud.callFunction({
      name: 'get-quiz-records',
      data: {
        // 不传递userId，获取所有记录
      },
      success: res => {
        if (res.result.success) {
          // 获取所有记录的总数
          const quizCount = res.result.total;
          
          this.setData({
            'stats.quizCount': quizCount
          });
        } else {
          console.error('获取答题记录失败:', res.result.message);
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
    
    // 收藏数仍然使用本地存储
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({
      'stats.favoriteCount': favorites.length
    });
  },

  // 加载收藏列表
  loadFavorites() {
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({ favorites });
  },

  // 加载答题记录
  loadQuizRecords() {
    // 从云数据库获取答题记录
    if (this.data.userId) {
      wx.cloud.callFunction({
        name: 'get-quiz-records',
        data: {
          userId: this.data.userId,
          limit: 5
        },
        success: res => {
          if (res.result.success) {
            const recentRecords = res.result.data.map(record => ({
              ...record,
              date: this.formatDate(record.createTime)
            }));
            this.setData({ quizRecords: recentRecords });
          } else {
            console.error('获取答题记录失败:', res.result.message);
            wx.showToast({
              title: '获取记录失败',
              icon: 'none'
            });
          }
        },
        fail: err => {
          console.error('调用云函数失败:', err);
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
        }
      });
    }
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
      content: '科普知识小天地\n版本：1.0.0\n开发者：hlp\n\n用科技点亮知识之光',
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