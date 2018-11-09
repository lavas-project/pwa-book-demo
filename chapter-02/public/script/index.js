/**
 *  index.js 主页面js，事件绑定和处理
 */

'use strict'

var app = {
	sidebarShow: false,
	loadingShow: true
};

var url = './assets/mockData/index.json';

/*******************
* 页面方法
*******************/

/**
 * [getData description]
 * @param  {[type]} url 数据地址
 * @return {[type]}     [description]
 */
app.getData = function(url) {
  app.showLoading();

  // 先查下缓存中是否有，有了及时返回，等新数据来了再替换
  if ('caches' in window) {
    caches.match(url).then(function(response) {
      if (response) {
        response.json().then(function updateFromCache(json) {
          var results = json.data.data;
          app.hideLoading();
          app.updateTemplate(results);
        });
      }
    });
  }
  // 请求最新数据
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.response);
      var results = response.data.data;
      app.updateTemplate(results);

      // setTimeout(function delay() {
      // 	app.updateTemplate(results);
      // }, 3000)
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

/**
 * [updateTemplate 更新页面
 * @param  {[type]} data         获取的数据
 * @return {[type]}              [description]
 */
app.updateTemplate = function (data) {
  app.hideLoading();
  var container = document.querySelector('.main');
  // 这里可以一些复杂的DOM结构来，这里仅给出简单的示例
  container.textContent = data;
}

app.refresh = function () {
	app.getData(url);
}


/**********************************
* 事件监听 大部分属于App Shell 部分
***********************************/

// sidebar btn
document.querySelector('.sidebar').addEventListener('click', function () {
	app.closeSidebar();
})

document.querySelector('.icon-category').addEventListener('click', function () {
	app.openSidebar();
})

document.querySelector('.mask').addEventListener('click', function () {
	app.closeSidebar();
})


document.querySelector('.icon-refresh').addEventListener('click', function () {
	app.refresh();
})


app.openSidebar = function () {
	if (app.sidebarShow) return;
	document.querySelector('.mask').classList.remove('hide');
	document.querySelector('.sidebar').classList.remove('hide');
	app.sidebarShow = true;
}

app.closeSidebar = function () {
	if (!app.sidebarShow) return;
	document.querySelector('.mask').classList.add('hide');
	document.querySelector('.sidebar').classList.add('hide');
	app.sidebarShow = false;
}

app.showLoading = function () {
	if (app.loadingShow) return;
	document.querySelector('.loading').classList.remove('hide');
	app.loadingShow = true;
}

app.hideLoading = function () {
	if (!app.loadingShow) return;
	document.querySelector('.loading').classList.add('hide');
	app.loadingShow = false;
}


// 请求数据并更新
app.getData(url);
	
