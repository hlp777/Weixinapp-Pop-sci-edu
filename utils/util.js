const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 格式化日期为 YYYY-MM-DD HH:mm:ss
const formatDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${year}-${formatNumber(month)}-${formatNumber(day)} ${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}`
}

// 格式化日期为 MM-DD HH:mm
const formatShortDateTime = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${formatNumber(month)}-${formatNumber(day)} ${formatNumber(hour)}:${formatNumber(minute)}`
}

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 存储数据到本地
const setStorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
    return true
  } catch (e) {
    console.error('存储数据失败:', e)
    return false
  }
}

// 从本地获取数据
const getStorage = (key, defaultValue = null) => {
  try {
    return wx.getStorageSync(key) || defaultValue
  } catch (e) {
    console.error('获取数据失败:', e)
    return defaultValue
  }
}

// 显示加载提示
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title: title,
    mask: true
  })
}

// 隐藏加载提示
const hideLoading = () => {
  wx.hideLoading()
}

// 显示成功提示
const showSuccess = (title = '操作成功') => {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000
  })
}

// 显示错误提示
const showError = (title = '操作失败') => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

// 显示确认对话框
const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

// 页面跳转
const navigateTo = (url) => {
  wx.navigateTo({
    url: url
  })
}

// 页面重定向
const redirectTo = (url) => {
  wx.redirectTo({
    url: url
  })
}

// 返回上一页
const navigateBack = (delta = 1) => {
  wx.navigateBack({
    delta: delta
  })
}

// 切换Tab页面
const switchTab = (url) => {
  wx.switchTab({
    url: url
  })
}

module.exports = {
  formatTime,
  formatDateTime,
  formatShortDateTime,
  formatNumber,
  debounce,
  throttle,
  generateId,
  setStorage,
  getStorage,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm,
  navigateTo,
  redirectTo,
  navigateBack,
  switchTab
}
