const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

const defaults = {
  todos: [
    {
      id: 1,
      content: '去超市买鸡蛋',
      done: false
    },
    {
      id: 2,
      content: '写周报',
      done: false
    }
  ]
}

// Set some defaults (required if your JSON file is empty)
db.defaults(defaults)
  .write()

module.exports = db
