/**
 *  login.js 登录页js，事件绑定和处理
 */

var form = document.querySelector('#login')
var githubLogin = document.querySelector('.github-login-button')

form.addEventListener('submit', function (event) {
  event.preventDefault()
  fetch('/auth/password', {
    method: 'POST',
    credentials: 'include',
    body: new FormData(event.target)
  }).then(function (res) {
    // 验证用户邮箱密码
    if (res.status === 200) {
      return Promise.resolve()
    } else {
      return Promise.reject('login error')
    }
  }).then(function () {
    // 判断是否支持 Credential API
    if (window.PasswordCredential) {
      // 保存用户凭证
      var cred = new PasswordCredential(event.target)
      return navigator.credentials.store(cred)
    } else {
      return Promise.resolve()
    }
  }).then(function () {
    // 登录成功跳转至首页
    window.location.href = '/'
  }).catch(function (error) {
    // 登录出错展示错误信息
    showErrorToast()
  })
})

githubLogin.addEventListener('click', function (event) {
  event.preventDefault()
  OAuth.initialize('vPfp-Q8TkI0aimFN_Qyt2AbL8gw')
  OAuth.popup('github').then(function (result) {
    return result.me()
  }).then(function (me) {
    fetch('/auth/github', {
      method: 'POST',
      credentials: 'include',
      body: new FormData()
    }).then(function (res) {
      if (res.status === 200) {
        return Promise.resolve(me)
      } else {
        return Promise.reject()
      }
    }).then(function (me) {
      if (window.FederatedCredential) {
        var cred = new FederatedCredential({
          id: me.raw.user.email,
          name: me.name,
          iconURL: me.avatar,
          provider: 'https://github.com'
        })
        return navigator.credentials.store(cred)
      } else {
        return Promise.resolve()
      }
    }).then(function () {
      window.location.href = '/'
    }).catch(function (error) {
      // show error toast
      console.log(error)
    })
  })
})
