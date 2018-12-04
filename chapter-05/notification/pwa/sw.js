// 首先监听 notificationclick 事件：
self.addEventListener('notificationclick', function (e) {
  // 关闭通知
  e.notification.close()
  // 打开网页
  e.waitUntil(clients.openWindow(e.notification.data.url))
})

self.addEventListener('message', function (e) {
  // 接着触发显示通知
  self.registration.showNotification(e.data.title, {
    body: e.data.body,
    icon: e.data.icon,
    data: {
      url: e.data.url
    }
  })
})
