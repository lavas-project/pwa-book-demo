/**
 * @file app.js 服务入口文件
 * express 搭建一个简单的 node 服务，便于调试
 */

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 8088

// 设定静态文件目录，比如本地文件
// 目录为 pwa-book-demo/public/images，访问
// 网址则显示为 http://localhost:8088/images
app.use(express.static(path.join(__dirname, '../public')))

app.use(bodyParser.json())

app.get('/mockData/:id', function (req, res) {
  res.json(getMockData('/mockData/' + req.params.id))
})

// 启动服务器
app.listen(port, function () {
  console.log(`Server start on: http://127.0.0.1:${port}`)
})

/**
 * 读取 JSON 数据
 *
 * @param {string} dataPath 对应 JSON 数据文件在 mockup 下的路径
 * @returns {Object|string} JSON 对象或 JSON 字符串
 */
function getMockData (dataPath) {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, dataPath), { encoding: 'utf-8' }))
  } catch (e) {
    console.error(e.stack)
    return {}
  }
}
