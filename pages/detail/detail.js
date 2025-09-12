// pages/detail/detail.js
Page({
  data: {
    currentTime: '',
    article: {},
    prevArticle: null,
    nextArticle: null
  },

  onLoad(options) {
    this.setData({
      articleId: options.id
    });
    this.updateTime();
    this.startTimeInterval();
    this.loadArticleData();
  },

  // 加载文章数据
  loadArticleData() {
    const articles = {
      1: {
        id: 1,
        title: '近地轨道卫星入门',
        author: '科普君',
        date: '2025-05-20',
        clickCount: 1234,
        image: 'https://images.unsplash.com/photo-1581092334631-1cd828e3c6d5?q=80&w=1200&auto=format&fit=crop',
        content: '近地轨道（LEO）卫星是指轨道高度在2000公里以下的卫星。这些卫星具有轨道周期短、覆盖范围广、信号延迟低等优点，广泛应用于通信、导航、遥感等领域。\n\nLEO卫星的主要特点包括：\n1. 轨道高度低，信号传输延迟小\n2. 覆盖范围广，可提供全球服务\n3. 发射成本相对较低\n4. 技术成熟，应用广泛\n\n随着商业航天的快速发展，LEO卫星星座已成为未来通信和互联网服务的重要基础设施。',
        likeCount: 23,
        liked: false,
        favorited: false,
        video: '',
        videoPoster: '',
        gallery: [
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      2: {
        id: 2,
        title: '液体火箭发动机原理',
        author: '科普君',
        date: '2025-06-02',
        clickCount: 987,
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
        content: '液体火箭发动机通过燃烧液体燃料与液体氧化剂产生高温高压气体，并经喷管膨胀形成高速喷流获得推力。典型结构包括燃烧室、涡轮泵、推力室与喷管等。\n\n液体火箭发动机的工作原理：\n1. 燃料和氧化剂通过涡轮泵增压\n2. 在燃烧室中混合燃烧\n3. 产生高温高压燃气\n4. 通过喷管膨胀加速\n5. 产生反作用推力\n\n液体火箭发动机具有推力可调、可重复启动、比冲高等优点，是现代航天器的主要推进系统。',
        likeCount: 45,
        liked: false,
        favorited: false,
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        videoPoster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
        gallery: []
      }
    };

    const article = articles[this.data.articleId];
    if (article) {
      this.setData({ article });
      this.incrementClickCount();
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

  // 增加点击量
  incrementClickCount() {
    const article = this.data.article;
    article.clickCount++;
    this.setData({ article });
  },

  // 切换点赞
  toggleLike() {
    const article = this.data.article;
    if (article.liked) {
      article.liked = false;
      article.likeCount--;
    } else {
      article.liked = true;
      article.likeCount++;
    }
    this.setData({ article });
    
    wx.showToast({
      title: article.liked ? '已点赞' : '取消点赞',
      icon: 'success'
    });
  },

  // 切换收藏
  toggleFavorite() {
    const article = this.data.article;
    article.favorited = !article.favorited;
    this.setData({ article });
    
    wx.showToast({
      title: article.favorited ? '已收藏' : '取消收藏',
      icon: 'success'
    });
  },

  // 分享文章
  shareArticle() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    const urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: url,
      urls: urls
    });
  },

  // 上一篇
  navigateToPrev() {
    if (this.data.prevArticle) {
      wx.redirectTo({
        url: `/pages/detail/detail?id=${this.data.prevArticle.id}`
      });
    }
  },

  // 下一篇
  navigateToNext() {
    if (this.data.nextArticle) {
      wx.redirectTo({
        url: `/pages/detail/detail?id=${this.data.nextArticle.id}`
      });
    }
  }
});
