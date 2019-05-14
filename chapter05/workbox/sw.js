// 引入 workbox 核心
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js')
// 预缓存
workbox.precaching.precacheAndRoute([
  {
    url: '/index.html',
    revision: '5ed70e0c237b4c66'
  },
  '/index.f8666b443c7a0e84.js',
  '/index.1236d1250f7ffbdc.css'
])
// 动态缓存
workbox.routing.registerRoute(
  /\/article\.json$/,
  new workbox.strategies.StaleWhileRevalidate()
)
workbox.routing.registerRoute(
  /\/statistics\.json$/,
  new workbox.strategies.NetworkOnly()
)
