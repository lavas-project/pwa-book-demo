import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('@/pages/Home')
const NextPage = () => import('@/pages/NextPage')

export default new Router({
  // history 模式，需要服务器后端配合做路由代理，将所有的前端路由同步代理到 /
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/next',
      name: 'NextPage',
      component: NextPage
    }
  ]
})
