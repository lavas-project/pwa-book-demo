class Precacher {
  constructor ({
    cacheName = 'precache',
    searchKey = 'precache_url_revision'
  } = {}) {
    this.cacheName = cacheName
    this.searchKey = searchKey
    // 存储资源信息的列表
    this.resources = []
    // 初始化事件监听
    this.initEventListener()
  }

  initEventListener () {
    // 在 `install` 事件回调执行预缓存资源加载
    self.addEventListener('install', event => {
      event.waitUntil(
        // 缓存新增/变化的资源
        cacheResources(this.cacheName, this.resources)
      )
    })
    // 添加 activate 事件监听清理旧资源
    self.addEventListener('activate', event => {
      event.waitUntil(
        // 清理旧缓存
        clearOldResources(this.cacheName, this.resources)
      )
    })
  }

  precache (resources) {
    for (let resource of resources) {
      // 格式化资源信息
      let res = formatReource(this.searchKey, resource)
      this.resources.push(res)
    }
  }

  addRoute () {
    // addRoute() 方法只需执行一次
    if (this.hasAdded) {
      return
    }
    this.hasAdded = true

    const cacheFirstHandler = cacheFirst({
      cacheName: this.cacheName
    })

    const router = new Router()
    router.registerRoute(
      request => {
        return this.resources.some(
          resource => resource.url === request.url
        )
      },
      request => {
        for (let resource of this.resources) {
          if (resource.url === request.url) {
            return cacheFirstHandler(new Request(resource.cacheKey))
          }
        }
      }
    )
  }
  // 将 precache() 和 addRoute() 合成一个方法
  precacheAndRoute (resources) {
    this.precache(resources)
    this.addRoute()
  }
}

async function cacheResources (cacheName, resources) {
  let urls = resources.map(resource => resource.cacheKey)
  // 首先打开并缓存 CacheStorage 对象
  let cache = await caches.open(cacheName)
  // 获取已存储的所有资源键值信息
  let requests = await cache.keys()
  // 获取已存储的资源 URL
  let cachedURLs = requests.map(request => request.url)
  // 找出新增资源里面未存储过的资源 URL
  let updateURLs = urls.filter(url => !cachedURLs.includes(url))
  // 最后调用 cache.addAll() 缓存新增资源
  await cache.addAll(updateURLs)
}

function formatReource (searchKey, resource) {
  let originURL
  let cacheKeyURL
  // 当资源信息为字符串时，说明资源 URL 已经具有唯一性
  // 因此可以直接拿 URL 作为资源的存储键值
  if (typeof resource === 'string') {
    originURL = new URL(resource, location)
    cacheKeyURL = new URL(resource, location)
  }
  // 当资源信息为对象时，需要使用 revision 来生成资源存储键值
  else {
    originURL = new URL(resource.url, location)
    cacheKeyURL = new URL(resource.url, location)
    cacheKeyURL.searchParams.set(searchKey, resource.revision)
  }

  return {
    url: originURL.href,
    cacheKey: cacheKeyURL.href
  }
}

async function clearOldResources (cacheName, resources) {
  let urls = resources.map(resource => resource.cacheKey)
  // 首先打开并缓存 CacheStorage 对象
  let cache = await caches.open(cacheName)
  // 获取已存储的所有资源键值信息
  let requests = await cache.keys()
  // 找出新增的 URL
  // 获取已存储的资源 URL
  let cachedURLs = requests.map(request => request.url)
  // 找出不在资源列表信息当中的 URL
  let oldURLs = cachedURLs.filter(url => !urls.includes(url))
  // 最后调用 cache.delete() 删除旧资源
  await Promise.all(oldURLs.map(url => cache.delete(url)))
}
