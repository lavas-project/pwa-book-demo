/**
 * @file app.js 服务入口文件
 * express 搭建一个简单的 node 服务，便于调试
 */

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 8088

// 设定静态文件目录，比如本地文件
// 目录为 pwa-book-demo/public/images，访问
// 网址则显示为 http://localhost:8088/images
app.use(express.static(path.join(__dirname, '../public')))

app.use(bodyParser.json())

// 启动服务器
app.listen(port, function () {
  console.log(`Server start on: http://127.0.0.1:${port}`)
})
