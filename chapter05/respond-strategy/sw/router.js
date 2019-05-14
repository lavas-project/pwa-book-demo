importScripts('/sw/match.js')
importScripts('/sw/respond.js')

class Router {
  constructor () {
    // 存放路由规则
    this.routes = []
    // 注册 fetch 事件拦截
    this.initProxy()
  }

  initProxy () {
    self.addEventListener('fetch', event => {
      // 当拦截到资源请求时，会遍历已注册的路由规则，并执行相应规则所对应的策略
      for (let route of this.routes) {
        // 使用前面封装好的 match 函数进行路由规则匹配
        if (match(route.rule, event.request)) {
          // 使用前面封装好的 respond 方法执行回调操作
          respond(event, route.handler)
          break
        }
      }
    })
  }

  registerRoute (rule, handler) {
    this.routes.push({rule, handler})
  }
}
