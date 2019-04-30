/**
 * @file notification.js
 * @description notification 页面事件绑定
 * @author clark-t (clarktanglei@163.com)
 */
function main () {
  var $state = document.getElementById('notification-state')
  if (typeof Notification === 'undefined') {
    $state.innerText = '浏览器不支持 Notification API'
    $state.classList.add('disabled')
    return
  }

  if (Notification.permission === 'denied') {
    $state.innerText = 'Notification 权限已被禁用'
    return
  }

  if (Notification.permission === 'granted') {
    $state.innerText = 'Notification 可用'
    register()
  } else {
    Notification.requestPermission().then(function (permission) {
      switch (permission) {
        case 'granted':
          $state.innerText = 'Notification 可用'
          register()
          break
        case 'denied':
          $state.innerText = 'Notification 权限已被禁用'
          break
        default:
          $state.innerText = 'Notification 权限尚未授权'
      }
    })
  }
}

function register () {
  // 标题&内容
  document.getElementById('btn-title-body').addEventListener('click', notifyTitleAndBody)
  document.getElementById('btn-long-title-body').addEventListener('click', notifyLongTitleAndBody)
  // 文字方向
  document.getElementById('btn-dir-ltr').addEventListener('click', notifyDirLtr)
  document.getElementById('btn-dir-rtl').addEventListener('click', notifyDirRtl)
  // icon
  document.getElementById('btn-icon').addEventListener('click', notifyIcon)
  // badge
  document.getElementById('btn-badge').addEventListener('click', notifyBadge)
  // image
  document.getElementById('btn-image').addEventListener('click', notifyImage)
  // tags
  document.getElementById('btn-tag-error-first').addEventListener('click', notifyTagErrorFirst)
  document.getElementById('btn-tag-warning-first').addEventListener('click', notifyTagWarning)
  document.getElementById('btn-tag-error-second').addEventListener('click', notifyTagErrorSecond)
  document.getElementById('btn-vibrate').addEventListener('click', notifyVibrate)

  // renotify
  document.getElementById('btn-renotify-true-first').addEventListener('click', notifyRenotifyTrueFirst)
  document.getElementById('btn-renotify-true-second').addEventListener('click', notifyRenotifyTrueSecond)
  document.getElementById('btn-renotify-true-third').addEventListener('click', notifyRenotifyTrueThird)
  document.getElementById('btn-renotify-false-first').addEventListener('click', notifyRenotifyFalseFirst)
  document.getElementById('btn-renotify-false-second').addEventListener('click', notifyRenotifyFalseSecond)
  document.getElementById('btn-renotify-false-third').addEventListener('click', notifyRenotifyFalseThird)

  document.getElementById('btn-data').addEventListener('click', notifyData)
  document.getElementById('btn-actions').addEventListener('click', notifyActions)
  document.getElementById('btn-require-interaction').addEventListener('click', notifyRequireInteraction)

  // 事件
  document.getElementById('btn-notificationclick').addEventListener('click', notifyOpenWindow)
}

function displayNotification (title, options) {
  navigator.serviceWorker.getRegistration().then(function (registration) {
    registration.showNotification(title, options)
  })
}

function notifyTitleAndBody () {
  displayNotification('PWA-Book-Demo Notification 测试标题内容', {
    body: 'Simple piece of body text.\nSecond line of body text :)'
  })
}

function notifyLongTitleAndBody () {
  displayNotification('PWA-Book-Demo Notification 测试长标题长内容', {
    body: 'Simple piece of body text.\nSecond line of long long long long long long long long body text :) '
  })
}

function notifyIcon () {
  displayNotification('PWA-Book-Demo Notification Title', {
    body: 'Simple piece of body text.\nSecond line of body text :)',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png'
  })
}

function notifyImage () {
  displayNotification('PWA-Book-Demo Notification Title', {
    body: 'Simple piece of body text.\nSecond line of body text :)',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png',
    image: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-image.png'
  })
}

function notifyBadge () {
  displayNotification('PWA-Book-Demo Notification Title', {
    body: 'Simple piece of body text.\nSecond line of body text :)',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png',
    badge: '/assets/images/badge-icon.png'
  })
}

function notifyDirLtr () {
  displayNotification('عنوان الاختبار...', {
    body: 'اختبار محتوى الإخطار...',
    dir: 'ltr'
  })
}

function notifyDirRtl () {
  displayNotification('عنوان الاختبار...', {
    body: 'اختبار محتوى الإخطار...',
    dir: 'rtl'
  })
}

function notifyVibrate () {
  displayNotification('PWA-Book-Demo 测试振动通知', {
    body: '测试振动通知内容',
    vibrate: [200, 100]
  })
}

function notifyTagWarning () {
  displayNotification('PWA-Book-Demo 测试 tag: warning', {
    body: '第一条 tag: warning 通知',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png',
    tag: 'warning'
  })
}

function notifyTagErrorFirst () {
  displayNotification('PWA-Book-Demo 测试 tag: error', {
    body: '第一条 tag: error 通知',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png',
    tag: 'error'
  })
}

function notifyTagErrorSecond () {
  displayNotification('PWA-Book-Demo 测试 tag: error', {
    body: '第二条 tag: error 通知',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png',
    tag: 'error'
  })
}

function notifyRenotifyFalseFirst () {
  displayNotification('PWA-Book-Demo 测试 renotify：false', {
    body: '第一条 tag: error 通知',
    tag: 'error',
    renotify: false
  })
}
function notifyRenotifyFalseSecond () {
  displayNotification('PWA-Book-Demo 测试 renotify：false', {
    body: '第一条 tag: warning 通知',
    tag: 'warning',
    renotify: false
  })
}
function notifyRenotifyFalseThird () {
  displayNotification('PWA-Book-Demo 测试 renotify：false', {
    body: '第二条 tag: error 通知',
    tag: 'error',
    renotify: false
  })
}

function notifyRenotifyTrueFirst () {
  displayNotification('PWA-Book-Demo 测试 renotify：false', {
    body: '第一条 tag: error 通知',
    tag: 'error',
    renotify: true
  })
}

function notifyRenotifyTrueSecond () {
  displayNotification('PWA-Book-Demo 测试 renotify：false', {
    body: '第一条 tag: warning 通知',
    tag: 'warning',
    renotify: true
  })
}

function notifyRenotifyTrueThird () {
  displayNotification('PWA-Book-Demo 测试 renotify：false', {
    body: '第二条 tag: error 通知',
    tag: 'error',
    renotify: true
  })
}

// 测试 data, 在 sw.js 中监听点击通知
function notifyData () {
  displayNotification('PWA-Book-Demo 测试 data', {
    body: '测试通知内容',
    data: new Date(Date.now()).toString()
  })
}

// 测试 actions, 在 sw.js 中监听 action 点击
function notifyActions () {
  displayNotification('PWA-Book-Demo 测试 actions', {
    body: '点赞按钮可点击',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png',
    data: {
      time: new Date(Date.now()).toString()
    },
    actions: [
      {
        action: 'like',
        title: '点赞',
        icon: '/assets/images/like-icon.png'
      }
    ]
  })
}
// 测试点击事件，点击打开新页面
function notifyOpenWindow () {
  displayNotification('你好', {
    body: '我叫李雷，交个朋友吧',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png',
    data: {
      time: new Date(Date.now()).toString(),
      url: 'https://www.baidu.com'
    }
  })
}

function notifyRequireInteraction () {
  displayNotification('PWA-Book-Demo 测试 requireInteraction', {
    body: '测试通知内容',
    requireInteraction: true
  })
}

main()
