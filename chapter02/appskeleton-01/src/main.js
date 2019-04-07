// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
  router,
  components: { App },
  template: '<App/>'
})

router.onReady(() => {
  // 将 mount 时间延后 2s，便于查看效果
  setTimeout(() => app.$mount('#app'), 2000)
})
