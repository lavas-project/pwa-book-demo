function networkFirst ({
  fetchOptions,
  cacheName = 'runtime-cache',
  matchOptions
} = {}) {
  return async request => {
    let requestClone = request.clone()
    try {
      // 优先发起网络请求
      let response = await fetch(request, fetchOptions)
      if (response.status === 200) {
        // 网络请求成功后，将请求响应结果复制一份存入缓存中
        const cacheResponse = async () => {
          let cache = await caches.open(cacheName)
          cache.put(requestClone, response.clone())
        }
        // 存储行为无需阻塞相应的返回
        cacheResponse()
        // 返回响应结果
        return response
      }
    } catch (e) {
      // 网络资源请求失败时，从本地缓存中读取缓存
      let cache = await caches.open(cacheName)
      return cache.match(requestClone, matchOptions)
    }
  }
}
