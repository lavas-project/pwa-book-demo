
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

    /**
     * 获取数据库所有记录
     * @return {Promise<Array>}
     */
    getAll () {
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
})(this)
