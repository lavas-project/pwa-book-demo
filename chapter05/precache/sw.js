importScripts(
  '/sw/router.js',
  '/sw/strategy.js',
  '/sw/precacher.js'
)

let resources = [
  {
    url: '/index.html',
    revision: '5ed70e0c237b4c66'
  },
  '/index.f8666b443c7a0e84.js',
  '/index.1236d1250f7ffbdc.css'
]

let precacher = new Precacher()
precacher.precacheAndRoute(resources)

let router = new Router()
// router.registerRoute(/\/index\.(html|css|js)$/, cacheFirst())
router.registerRoute(/\/article\.json$/, staleWhileRevalidate())
router.registerRoute(/\/statistics\.json$/, networkOnly())
