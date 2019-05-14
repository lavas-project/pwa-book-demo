const fs = require('fs')
const path = require('path')
const http = require('http')


/**
 * 根据 url 自动查找对应文件
 * **注意** 该方法存在严重安全漏洞，请勿在生产环境中使用。在这里仅作功能展示
 *
 * @param {string} url 资源请求 URL
 * @return {string|undefined} 资源返回结果
 */
function getFileByUrl (url) {
  try {
    let pathname = path.resolve(__dirname, '.' + url)
    console.log('查找文件：' + pathname)
    return fs.readFileSync(pathname, 'utf-8')
  } catch (e) {}
}

/**
 * 根据 url 后缀返回资源 Content-Type
 * @param {string} url 资源 URL
 * @return {string} Content-Type
 */
function getContentType (url) {
  const contentType = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.html': 'text/html;charset=utf-8'
  }
  let extname = path.extname(url)
  let type = contentType[extname]
  return type || 'text/plain'
}

const server = http.createServer((request, response) => {
  console.log(new Date() + '接收到请求:' + request.url)

  let file = getFileByUrl(request.url)

  if (file) {
    response.setHeader('Content-Type', getContentType(request.url))
    response.statusCode = 200
    response.write(file)
  } else {
    response.statusCode = 404
  }
  response.end()
})

server.listen(8080, '127.0.0.1', () => {
  console.log('服务器启动完成')
})
