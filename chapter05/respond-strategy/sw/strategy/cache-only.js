function cacheOnly ({
  cacheName,
  matchOptions
} = {}) {
  return async request => {
    let cache = await caches.open(cacheName)
    return cache.match(request, matchOptions)
  }
}
