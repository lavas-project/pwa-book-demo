
/* globals fetch */

(function (global) {
  const VERSION = 2

  global.idb = {
    /**
     * 连接 indexedDB 数据库
     * @return {Promise<IDBDatabase>}
     */
    openDB () {
      if (this.request) {
        return Promise.resolve(this.request.result)
      }

      return new Promise((resolve, reject) => {
        let request = global.indexedDB.open('todos', VERSION)

        request.onupgradeneeded = (e) => {
          let target = e.target

          // 发生错误直接 reject 错误事件
          target.transaction.onerror = reject

          let db = target.result

          if (e.oldVersion < 1) {
            let store = db.createObjectStore('todo', {
              keyPath: 'id',
              autoIncrement: true
            })
            store.createIndex('id', 'id')
            store.createIndex('content', 'content')
          }

          if (e.oldVersion < 2) {
            let store = request.transaction.objectStore('todo')
            store.createIndex('done', 'done')
          }
        }

        request.onsuccess = () => {
          this.request = request
          // 连接成功
          resolve(request.result)
        }
      })
    },

    syncDataToServer () {
      this.getByFilter(record => !record.sync)
        .then(records => fetch('/update/todos', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(records)
        }))
        .then(res => res.json())
        .then(ids => {
          let updateItem = id => this.updateItem(id, {
            sync: 1
          })
          return Promise.all(ids.map(updateItem))
        }).then(() => {
          return this.getByFilter(record => record.delete)
            .then(records => {
              return Promise.all(records.map(record => this.deleteItem(record.id)))
            })
        })
    },

    /**
     * 获取全部待办数据，如果本地数据为空，则从服务器获取初始化数据，并存到indexeddb中
     * @return <Promise<Array>>
     */
    getAllTodos () {
      return this.getAllFromIndexedDB().then(todos => {
        // 如果 indexeddb 里有数据直接返回
        if (todos.length) {
          return todos
        }

        // 如果没有数据，从服务获取初始化数据
        return fetch('/todos')
          .then(res => res.json())
          .then(todos => {
            // 将返回的数据保存到 indexeddb
            todos.forEach(todo => this.addItem(todo))
            return todos
          })
      })
    },

    /**
     * 获取数据库所有记录
     * @return {Promise<Array>}
     */
    getAllFromIndexedDB () {
      return this.openDB().then(db => {
        let store = db.transaction('todo', 'readonly').objectStore('todo')

        return new Promise(resolve => {
          store.getAll().onsuccess = e => resolve(e.target.result)
        })
      })
    },

    /**
     * 通过筛选函数获取结果
     * @param {Function<record>} match 筛选函数
     * @return {Promise<Array>}
     */
    getByFilter (match) {
      return this.openDB().then(db => {
        let store = db.transaction('todo', 'readonly').objectStore('todo')

        let index = store.index('id')

        let request = index.openCursor()
        let records = []

        return new Promise((resolve, reject) => {
          request.onsuccess = () => {
            let cursor = request.result
            if (cursor) {
              if (match(cursor.value)) {
                records.push(cursor.value)
              }
              cursor.continue()
            } else {
              resolve(records)
            }
          }
        })
      })
    },

    /**
     * 添加一条记录
     * @param {Object} record 记录
     * @return {Promise<number>} resolve id
     */
    addItem (record) {
      if (typeof record.sync === 'undefined') {
        record.sync = 0
      }

      return this.openDB().then(db => {
        let store = db.transaction('todo', 'readwrite').objectStore('todo')
        return new Promise(resolve => {
          store.add(record).onsuccess = e => resolve(e.target.result)
        })
      })
    },

    /**
     * 更新记录内容
     * @param {number} id 记录id
     * @param {Object} record 记录
     * @return {Promise}
     */
    updateItem (id, record) {
      if (typeof record.sync === 'undefined') {
        record.sync = 0
      }

      return this.openDB().then(db => {
        this.getItem(id).then(oldRecord => {
          let store = db.transaction('todo', 'readwrite').objectStore('todo')
          record = Object.assign(oldRecord, record)
          return new Promise(resolve => {
            store.put(record).onsuccess = e => resolve(e.target.result)
          })
        })
      })
    },

    /**
     * 通过id删除记录
     * @param {number} id 记录id
     * @return {Promise}
     */
    deleteItem (id) {
      return this.openDB().then(db => {
        let store = db.transaction('todo', 'readwrite').objectStore('todo')

        return new Promise(resolve => {
          store.delete(id).onsuccess = e => resolve(e.target.result)
        })
      })
    },

    /**
     * 通过id删除记录
     * @param {number} id 记录id
     * @return {Promise<Object>} 记录
     */
    getItem (id) {
      return this.openDB().then(db => {
        let store = db.transaction('todo', 'readonly').objectStore('todo')

        return new Promise(resolve => {
          store.get(id).onsuccess = e => resolve(e.target.result)
        })
      })
    }
  }

  setInterval(() => {
    global.idb.syncDataToServer()
  }, 1000)
})(this)
