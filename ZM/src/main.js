import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'amfe-flexible'

import ConstStr from './common/js/ConstStr.js'
import HttpCli from './common/js/HttpCli.js'
import MethodsUtil from './common/js/MethodsUtil.js'
Vue.prototype.ConstStr = ConstStr;
Vue.prototype.HttpCli = HttpCli;
Vue.prototype.MethodsUtil = MethodsUtil;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
