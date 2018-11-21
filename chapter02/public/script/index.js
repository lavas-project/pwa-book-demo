/**
 *  index.js 主页面js，事件绑定和处理
 */

/* global XMLHttpRequest */

'use strict'

let app = {
  sidebarShow: false,
  loadingShow: true
}

const idb = window.idb

const url = './assets/mockData/index.json'

function delegate (element, selector, event, handler, capture) {
  capture = !!capture
  function eventHandler (event) {
    let target = event.target

    if (target === element) {
      return
    }

    while (target) {
      if (target.matches(selector)) {
        break
      }
      if (target.parentNode === element) {
        target = null
        break
      }
      target = target.parentNode
    }

    if (target) {
      handler.call(target, event)
    }
  }
  element.addEventListener(event, eventHandler, capture)
  return () => {
    element.removeEventListener(event, eventHandler)
    element = handler = null
  }
}
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
      let results = response.data.data
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

  let renderItem = item => `
    <li data-id="${item.id}" class="${item.done ? 'done' : ''}">
      <input type="checkbox" ${item.done ? 'checked' : ''}/>
      ${item.content}
      <a class="delete" href="#">删除</a>
    </li>`

  idb.getAll().then((data) => {
    let todos = `
      <div class="todos">
        <div class="input-bar">
          <input type="text" placeholder="输入待办内容" required></input>
          <span class="add-btn">添加</span>
        </div>
        <ul>
          ${data.map(renderItem).join('')}
        </ul>
      </div>
    `
    container.innerHTML = todos

    let input = container.querySelector('input')
    let ul = container.querySelector('ul')

    delegate(container, '.add-btn', 'click', e => {
      let content = input.value.trim()
      if (!content) {
        window.alert('请输入待办事件内容')
        return
      }

      idb.addItem({
        content
      }).then(id => {
        let div = document.createElement('div')
        div.innerHTML = renderItem({
          id,
          content
        })
        ul.appendChild(div.firstElementChild)
        input.value = ''
      })
    })

    delegate(container, 'li', 'click', function (e) {
      let id = +this.dataset.id

      // 删除 item
      if (e.target.classList.contains('delete')) {
        idb.deleteItem(id).then(() => {
          this.parentNode.removeChild(this)
        })
        return
      }

      // 更新 item 状态
      let checkbox = this.querySelector('input[type=checkbox]')
      idb.updateItem(+this.dataset.id, {
        done: !checkbox.checked
      }).then(() => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked
        }
        this.classList.toggle('done')
      })
    })
  })
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

// 请求数据并更新
app.getData(url)
