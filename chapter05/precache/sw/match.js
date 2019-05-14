function match (rule, request) {
  switch (Object.prototype.toString.call(rule)) {
    // url 文本匹配
    case '[object String]':
      // 使用 URL() 将匹配规则传入的路径补全
      return request.url === new URL(rule, location).href

    // url 正则匹配
    case '[object RegExp]':
      return request.url.match(rule)

    // 支持自定义匹配
    case '[object Function]':
      return rule(request)
  }
}
