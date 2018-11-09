/**
 * @file app.js 服务入口文件
 * express 搭建一个简单的 node 服务，便于调试
 */

let express = require('express');
let path = require('path');
let fs = require('fs');

let app = express();
let port = 8088;


// 设定静态文件目录，比如本地文件
// 目录为pwa-book-demo/public/images，访问
// 网址则显示为http://localhost:8088/images
app.use(express.static(path.join(__dirname, './public')));

// 首页 html 响应
app.get('/', function (req, res) {
    res.sendFile('index.html', {root: 'public'});
});
app.get('/index.html', function (req, res) {
    res.sendFile('index.html', {root: 'public'});
});

app.get('/detail.html*', function (req, res) {
    res.sendFile('detail.html', {root: 'public'});
});

app.get('/api/:id', function(req, res) {
	res.json(getMockData('/api/' + req.params.id));
});

// 启动服务器
app.listen(port, function () {
    console.log(`Server start on: http://127.0.0.1:${port}`);
});

/**
 * 读取json数据
 *
 * @param  {string} dataPath  对应json数据文件在mockup下的路径
 * @return {Object | string}  JSON对象或JSON字符串
 */
function getMockData(dataPath) {
    try {
        return JSON.parse(
        	fs.readFileSync(path.join(__dirname, dataPath), {encoding: 'utf-8'}));
    }
    catch (e) {
        console.error(e.stack);
        return {};
    }
}