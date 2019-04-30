/**
 * @file app.js 服务入口文件
 * express 搭建一个简单的 node 服务，便于调试
 */

const express = require('express')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const path = require('path')
const config = require('./config')
const app = express()
const port = 8088
const VAPIDkeys = config.VAPIDKeys
const GCMAPIkey = config.GCMAPIkey

// 配置 web push
webpush.setVapidDetails(
  'mailto:your-email@provider.com',
  VAPIDkeys.publicKey,
  VAPIDkeys.privateKey
)
webpush.setGCMAPIKey(GCMAPIkey)

// 存储 pushSubscription 对象
let pushSubscriptionSet = new Set()

// 定时任务，每隔 10 分钟向推送服务器发送消息
setInterval(function () {
  if (pushSubscriptionSet.size > 0) {
    pushSubscriptionSet.forEach(function (pushSubscription) {
      webpush.sendNotification(pushSubscription, JSON.stringify({
        title: '你好',
        body: '我叫李雷，很高兴认识你',
        icon: 'https://path/to/icon',
        url: 'http://localhost'
      }))
    })
  }
}, 100 * 60)

// 设定静态文件目录，比如本地文件
// 目录为 pwa-book-demo/public/images，访问
// 网址则显示为 http://localhost:8088/images
app.use(express.static(path.join(__dirname, '../public')))

app.use(bodyParser.json())

// 服务端提供接口接收并存储 pushSubscription
app.post('/api/push/subscribe', function (req, res) {
  if (req.body) {
    try {
      pushSubscriptionSet.add(req.body)
      res.sendStatus(200)
    } catch (e) {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(403)
  }
})

// 启动服务器
app.listen(port, function () {
  console.log(`Server start on: http://127.0.0.1:${port}`)
})
