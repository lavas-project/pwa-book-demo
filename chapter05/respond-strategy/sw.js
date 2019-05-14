importScripts('/sw/router.js')
importScripts('/sw/strategy.js')

var router = new Router()
router.registerRoute(/\/index\.(html|css|js)$/, cacheFirst())
router.registerRoute(/\/article\.json$/, staleWhileRevalidate())
router.registerRoute(/\/statistics\.json$/, networkOnly())
