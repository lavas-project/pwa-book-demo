/**
 * index.js 主页面js，事件绑定和处理
 */

'use strict'

let app = {
  sidebarShow: false,
  loadingShow: true
}

const url = '/main'

/*******************
 * 页面方法
 *******************/

/**
 * [getData description]
 * @param  {[type]} url 数据地址
 * @return {[type]}     [description]
 */
app.getData = function (url) {
  // 请求最新数据
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let response = JSON.parse(xhr.response)
      let results = response.data
      // app.updateTemplate(results)

      setTimeout(function delay () {
        app.updateTemplate(results)
      }, 500)
    }
  }
  xhr.open('GET', url)
  xhr.send()
}

/**
 * [updateTemplate 更新页面
 * @param  {[type]} data         获取的数据
 * @return {[type]}              [description]
 */
app.updateTemplate = function (data) {
  let container = document.querySelector('.main')
  // 这里可以一些复杂的DOM结构来，这里仅给出简单的示例
  container.textContent = data.data

  if (data.isLogin) {
    document.querySelector('.logout').classList.remove('hide')
    document.querySelector('.login').classList.add('hide')

    const tips = document.createElement('p')
    tips.className = 'login-tips'
    tips.textContent = '已登录'
    container.appendChild(tips)
  }
}

app.refresh = function () {
  app.getData(url)
}

/**********************************
 * 事件监听 大部分属于App Shell 部分
 ***********************************/

// sidebar btn
document.querySelector('.sidebar').addEventListener('click', function () {
  app.closeSidebar()
})

document.querySelector('.icon-category').addEventListener('click', function () {
  app.openSidebar()
})

document.querySelector('.mask').addEventListener('click', function () {
  app.closeSidebar()
})

document.querySelector('.icon-refresh').addEventListener('click', function () {
  app.refresh()
})

document.querySelector('.login').addEventListener('click', function (event) {
  event.preventDefault()
  app.autoLogin()
})

app.openSidebar = function () {
  if (app.sidebarShow) return
  document.querySelector('.mask').classList.remove('hide')
  document.querySelector('.sidebar').classList.remove('hide')
  app.sidebarShow = true
}

app.closeSidebar = function () {
  if (!app.sidebarShow) return
  document.querySelector('.mask').classList.add('hide')
  document.querySelector('.sidebar').classList.add('hide')
  app.sidebarShow = false
}

app.getData(url)

app.autoLogin = function () {
  autoLogin().then(function () {
    window.location.href = '/'
  }, function () {
    window.location.href = '/login.html'
  })
}

function autoLogin () {
  if (window.PasswordCredential || window.FederatedCredential) {
    return navigator.credentials.get({
      password: true,
      federated: {
        providers: ['https://github.com']
      },
      medition: 'silent'
    }).then(function (cred) {
      if (cred) {
        switch (cred.type) {
          case 'password':
            return loginWithPassword(cred)
          case 'federated':
            switch (cred.provider) {
              case 'https://github.com':
                return loginWithGithubAccount(cred)
            }
        }
      } else {
        return Promise.reject()
      }
    }).then(function (res) {
      if (res.status === 200) {
        return Promise.resolve()
      } else {
        return Promise.reject('login error')
      }
    })
  } else {
    return Promise.resolve()
  }
}

function loginWithPassword (cred) {
  var form = new FormData()
  form.append('email', cred.id)
  form.append('password', cred.password)
  return fetch('/auth/password', {
    method: 'POST',
    credentials: 'include',
    body: form
  })
}

function loginWithGithubAccount (cred) {
  var form = new FormData()
  return fetch('/auth/github', {
    method: 'POST',
    credentials: 'include',
    body: form
  })
}
