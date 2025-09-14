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
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
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
        gallery: [
          'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1541543359073-a925b4db263a?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1541185933-c0f95367996b?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      3: {
        id: 3,
        title: '载人飞船生命保障系统',
        author: '科普君',
        date: '2025-07-01',
        clickCount: 763,
        image: 'https://images.unsplash.com/photo-1447433819943-74a20887a81e?q=80&w=1200&auto=format&fit=crop',
        content: '载人飞船生命保障系统是保障航天员在太空飞行期间生存的关键系统，主要功能包括空气再生、水循环、温度控制和废物处理等。\n\n生命保障系统的主要组成：\n1. 大气控制与供应系统：提供氧气、去除二氧化碳、控制气压\n2. 水循环与供应系统：饮用水供应、废水处理与回收\n3. 食物供应系统：航天食品储存与制备\n4. 温度与湿度控制系统：维持舱内适宜温湿度\n5. 废物收集与处理系统：人体排泄物处理\n\n现代载人飞船生命保障系统趋向于再生式设计，通过循环利用资源来减少地面补给需求，提高任务持续时间。',
        likeCount: 32,
        liked: false,
        favorited: false,
        video: '',
        videoPoster: '',
        gallery: [
          'https://images.unsplash.com/photo-1447433819943-74a20887a81e?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1498068400885-4bb3ea10d615?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1504681869696-949505f12302?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      4: {
        id: 4,
        title: '智慧农业无人机技术',
        author: '科技农夫',
        date: '2025-05-15',
        clickCount: 892,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
        content: '智慧农业无人机技术是现代农业发展的重要方向，通过无人机实现农田监测、植保喷洒、播种施肥等功能，大幅提高农业生产效率。\n\n无人机在农业中的主要应用：\n1. 农田监测：通过多光谱相机监测作物生长状况\n2. 植保喷洒：精准施药，减少农药使用量\n3. 播种施肥：实现精准播种和变量施肥\n4. 灌溉管理：结合热成像技术检测作物水分状况\n\n无人机技术的优势：\n- 作业效率高，可覆盖大面积农田\n- 减少人工成本和劳动强度\n- 实现精准作业，提高资源利用率\n- 适应复杂地形作业需求',
        likeCount: 28,
        liked: false,
        favorited: false,
        video: '',
        videoPoster: '',
        gallery: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1597586123302-0163d00775b4?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1587177499912-7a9206f43e84?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      5: {
        id: 5,
        title: '精准灌溉系统',
        author: '水利专家',
        date: '2025-06-10',
        clickCount: 654,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop',
        content: '精准灌溉系统基于传感器技术、物联网和人工智能，实现对农田水分状况的实时监测和精确控制，是现代节水农业的核心技术。\n\n系统主要组成：\n1. 土壤湿度传感器：实时监测土壤水分状况\n2. 气象监测站：收集温度、湿度、降雨等气象数据\n3. 控制中心：分析数据并制定灌溉策略\n4. 执行系统：自动控制水泵、阀门等设备\n\n技术优势：\n- 节约水资源，提高灌溉效率\n- 根据作物需求精准供水\n- 降低人工管理成本\n- 提高作物产量和品质',
        likeCount: 21,
        liked: false,
        favorited: false,
        video: '',
        videoPoster: '',
        gallery: [
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1587177499912-7a9206f43e84?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1597586123302-0163d00775b4?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      6: {
        id: 6,
        title: '工业机器人技术',
        author: '制造先锋',
        date: '2025-05-25',
        clickCount: 1123,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
        content: '工业机器人是现代智能制造的核心装备，广泛应用于汽车制造、电子产品装配、物流搬运等领域，显著提高生产效率和产品质量。\n\n工业机器人的主要类型：\n1. 多关节机器人：灵活性高，适用于复杂作业\n2. SCARA机器人：擅长水平面内快速精确作业\n3. 直角坐标机器人：结构简单，适用于直线运动\n4. 并联机器人：速度快，适用于分拣包装\n\n关键技术特点：\n- 高精度伺服控制系统\n- 多种传感器融合技术\n- 人工智能算法集成\n- 人机协作安全保障',
        likeCount: 42,
        liked: false,
        favorited: false,
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        videoPoster: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1555459930-eb0351f0b580?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop'
        ]
      },
      7: {
        id: 7,
        title: '齿轮制造工艺',
        author: '精密工匠',
        date: '2025-06-05',
        clickCount: 789,
        image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=1200&auto=format&fit=crop',
        content: '齿轮制造工艺是机械工业的重要基础技术，涉及材料选择、热处理、精密加工等多个环节，直接影响传动系统的性能和寿命。\n\n主要制造工艺流程：\n1. 材料准备：选用优质合金钢或特殊材料\n2. 锻造毛坯：形成齿轮基本形状\n3. 粗加工：车削、铣削等初步加工\n4. 热处理：提高硬度和耐磨性\n5. 精密加工：滚齿、插齿、剃齿等工艺\n6. 精密加工：磨齿、珩齿等最终加工\n\n质量控制要点：\n- 齿形精度控制\n- 表面粗糙度要求\n- 热处理质量检测\n- 噪声和振动测试',
        likeCount: 18,
        liked: false,
        favorited: false,
        video: '',
        videoPoster: '',
        gallery: [
          'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1591696205633-3035fa006b54?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1564631071840-74c9dac29024?q=80&w=1200&auto=format&fit=crop'
        ]
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
