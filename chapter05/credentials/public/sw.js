/**
 * service worker 安装激活
 */

let dataCacheName = 'new-data-v1'
let cacheName = 'first-pwa-app-1'
let filesToCache = [
  '/',
  '/index.html',
  '/detail.html',
  '/script/index.js',
  '/script/detail.js',
  '/style/index.css',
  '/style/fonts/iconfont.css',
  '/style/fonts/iconfont.eot',
  '/style/fonts/iconfont.js',
  '/style/fonts/iconfont.svg',
  '/style/fonts/iconfont.ttf',
  '/style/fonts/iconfont.woff',
  '/assets/images/icons/icon_144x144.png',
  '/assets/images/icons/icon_152x152.png',
  '/assets/images/icons/icon_192x192.png',
  '/assets/images/icons/icon_512x512.png'
]

self.addEventListener('install', function (e) {
  console.log('SW Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('SW precaching')
      return cache.addAll(filesToCache)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', function (e) {
  console.log('SW Activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('SW Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function (e) {
  console.log('SW Fetch', e.request.url)
  // 如果数据相关的请求，需要请求更新缓存
  let dataUrl = '/mockData/'
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response){
          cache.put(e.request.url, response.clone())
          return response
        }).catch(function () {
          return caches.match(e.request)
        })
      })
    )
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request)
      })
    )
  }
})
