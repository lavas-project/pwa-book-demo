self.addEventListener('install', function (e) {
  e.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', function (e) {

})
