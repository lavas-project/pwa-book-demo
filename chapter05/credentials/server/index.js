/**
 * @file app.js 服务入口文件
 * express 搭建一个简单的 node 服务，便于调试
 */

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const app = express()
const session = require('express-session')
const port = 8088
const multer = require('multer')
const upload = multer()

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())

app.use(session({
  secret: 'chapter05 example',
  resave: false,
  saveUninitialized: true
}))

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/login.html'))
})

app.get('/main', function (req, res) {
  let data = getMockData('../public/assets/mockData/index.json')
  if (req.session && req.session.authenticated) {
    data.data.isLogin = true
  }
  res.json(data)
})

app.get('/mockData/:id', function (req, res) {
  res.json(getMockData('/mockData/' + req.params.id))
})

// 启动服务器
app.listen(port, function () {
  console.log(`Server start on: http://127.0.0.1:${port}`)
})

// 登陆接口
app.post('/auth/password', upload.array(), function (req, res) {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(401).send('Authentication failed')
  }

  // mock select database stored data
  const store = getMockData('../public/assets/mockData/users.json')
  if (password === store.password) {
    req.session.authenticated = true
    res.status(200).send('Login success')
  } else {
    res.status(401).send('Authentication failed')
  }
})

app.post('/auth/github', function (req, res) {
  req.session.authenticated = true
  res.status(200).send('Login success')
})

app.get('/logout', function (req, res) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        res.status(401).send('Authentication failed')
      } else {
        res.redirect('/')
      }
    })
  }
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
