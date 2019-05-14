function staleWhileRevalidate ({
  fetchOptions,
  cacheName = 'runtime-cache',
  matchOptions
} = {}) {
  // 首先读取本地缓存
  return async request => {
    let cache
    let response

    try {
      cache = await caches.open(cacheName)
      response = await cache.match(request, matchOptions)
    } catch (e) {}

    const fetchAndCatch = async () => {
      let requestClone = request.clone()
      let response = await fetch(request, fetchOptions)
      // 将请求响应结果存入本地缓存
      if (cache && response.status === 200) {
        cache.put(requestClone, response.clone())
      }
      return response
    }
    // 发起网络请求并更新缓存
    let promise = fetchAndCatch()
    // 如果本地缓存读取成功，则直接将本地缓存结果返回
    if (response) {
      // 不阻塞静默更新缓存
      promise.catch(e => {})
      return response
    }
    // 反之，则返回网络请求的响应结果
    return promise
  }
}
