function respond (event, handler) {
  try {
    // 执行响应处理方法，根据返回结果进行兜底
    let res = handler(event.request)
    // 异步的响应结果兜底
    if (res instanceof Promise) {
      let promise = res.then(response => {
          // 如果返回结果非 Response 对象，抛出错误
          if (!(response instanceof Response)) {
            throw Error('返回结果异常')
          }
          return response
        })
        // 异步响应错误处理，即直接返回状态码为 500 Response 对象
        .catch((e) => {
          return new Response('Service Worker 出错', {status: 500})
        })

      event.respondWith(promise)
      return
    }

    // 同步响应如果出现任何错误
    // 可以选择不调用 event.respondWith(r)
    // 让资源请求继续走浏览器默认的请求流程

    if (res instanceof Response) {
      event.respondWith(res)
    }
  } catch (e) {}
}
