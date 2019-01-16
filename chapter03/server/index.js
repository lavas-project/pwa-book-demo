/**
 * @file app.js 服务入口文件
 * express 搭建一个简单的 node 服务，便于调试
 */

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const db = require('./db')
const app = express()
const port = 8088

// 设定静态文件目录，比如本地文件
// 目录为pwa-book-demo/public/images，访问
// 网址则显示为http://localhost:8088/images
app.use(express.static(path.join(__dirname, '../public')))

app.use(bodyParser.json())

app.get('/mockData/:id', function (req, res) {
  res.json(getMockData('/mockData/' + req.params.id))
})

app.get('/todos', function (req, res) {
  res.json(db.get('todos').value())
})

app.post('/update/todos', function (req, res) {
  let records = req.body
  let todosCollection = db.get('todos')
  let ids = records.map(record => {
    record.sync = 1

    let todo = todosCollection.find({
      id: record.id
    })

    if (todo.value()) {
      todo.assign(record).write()
    } else {
      todosCollection.push(record).write()
    }
    return record.id
  })

  // 删除已被删除的记录
  todosCollection.remove({ delete: 1 }).write()
  res.json(ids)
})

// 启动服务器
app.listen(port, function () {
  console.log(`Server start on: http://127.0.0.1:${port}`)
})

/**
 * 读取json数据
 *
 * @param  {string} dataPath  对应json数据文件在mockup下的路径
 * @return {Object | string}  JSON对象或JSON字符串
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
