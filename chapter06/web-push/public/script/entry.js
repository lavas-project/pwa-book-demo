/**
 * @file entry.js
 * @description web push client
 */
const VAPIDPublicKey = '<Your Public Key>'
// 注册 service worker 并缓存 registration
let registration
function registerServiceWorker () {
  if (!navigator.serviceWorker) {
    return Promise.reject('系统不支持 service worker')
  }

  return navigator.serviceWorker.register('/sw.js').then(function (reg) {
    registration = reg
  })
}

// 申请桌面通知权限
function requestNotificationPermission () {
  // 系统不支持桌面通知
  if (!window.Notification) {
    return Promise.reject('系统不支持桌面通知')
  }
  return Notification.requestPermission()
    .then(function (permission) {
      if (permission === 'granted') {
        return Promise.resolve()
      }
      return Promise.reject('用户已禁止桌面通知权限')
    })
}

// 订阅推送并将订阅结果发送给后端
function subscribeAndDistribute (registration) {
  if (!window.PushManager) {
    return Promise.reject('系统不支持消息推送')
  }
  // 检查是否已经订阅过
  return registration.pushManager.getSubscription().then(function (subscription) {
    // 如果已经订阅过，就不重新订阅了
    if (subscription) {
      return
    }
    // 如果尚未订阅则发起推送订阅
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(VAPIDPublicKey)
    }).then(function (subscription) {
      // 订阅推送成功之后，将订阅信息传给后端服务器
      distributePushResource(subscription)
    })
  })
}

function distributePushResource (subscription) {
  return fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: uint8ArrayToBase64(subscription.getKey('p256dh')),
        auth: uint8ArrayToBase64(subscription.getKey('auth'))
      }
    })
  })
}

function uint8ArrayToBase64 (arr) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)))
}

function base64ToUint8Array (base64String) {
  let padding = '='.repeat((4 - base64String.length % 4) % 4)
  let base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  let rawData = atob(base64)
  let outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// 注册 service worker
registerServiceWorker()
  // 申请桌面通知权限
  .then(function () {
    requestNotificationPermission()
  })
  // 订阅推送
  .then(function () {
    subscribeAndDistribute(registration)
  })
  .catch(function (err) {
    console.log(err)
  })
