/**
 *  index.js 主页面js，事件绑定和处理
 */

'use strict'

let app = {
  sidebarShow: false,
  loadingShow: true
}

const idb = window.idb

/**
 *
 * @param {HTMLElement} element dom 元素
 * @param {string} selector 选择器字符串
 * @param {Event} event 事件对象实例
 * @param {Function} handler 事件处理函数
 * @param {Object} capture 绑定事件参数项
 */
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

  idb.getAllTodos().then((data) => {
    // 过滤删除的记录
    data = data.filter(item => !item.delete)
    container.innerHTML = `
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

    let todos = container.querySelector('.todos')
    let input = container.querySelector('input')
    let ul = container.querySelector('ul')

    delegate(todos, '.add-btn', 'click', e => {
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

    delegate(todos, 'li', 'click', function (e) {
      let id = +this.dataset.id

      // 删除 item
      if (e.target.classList.contains('delete')) {
        idb.updateItem(id, { delete: 1 }).then(() => {
          this.parentNode.removeChild(this)
        })
        return
      }

      // 更新 item 状态
      let checkbox = this.querySelector('input[type=checkbox]')
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked
      }

      idb.updateItem(+this.dataset.id, {
        done: checkbox.checked
      }).then(() => {
        this.classList.toggle('done')
      }).catch(error => {
        checkbox.checked = !checkbox.checked
        console.log(error)
      })
    })
  })
}

app.refresh = function () {
  app.updateTemplate()
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

app.updateTemplate()
