function cacheFirst ({
  fetchOptions,
  cacheName = 'runtime-cache',
  matchOptions
} = {}) {
  return async request => {
    let cache
    let response
    let requestClone = request.clone()

    try {
      // 优先匹配本地缓存
      cache = await caches.open(cacheName)
      response = await cache.match(request, matchOptions)
    } catch (e) {}
    // 匹配不到缓存或者缓存读取出现异常时，再去发起网络请求
    if (response == null) {
      response = await fetch(request, fetchOptions)
      // 将请求响应结果存入本地缓存
      if (cache && response.status === 200) {
        cache.put(requestClone, response.clone())
      }
    }

    return response
  }
}
