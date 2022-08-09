import Vue from 'vue'

import App from './App'
import router from './router'
import { store } from './store'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import GlobalMixins from './mixin/global'
import VueScreen from 'vue-screen'

Vue.use(VueScreen, 'bulma')
Vue.use(GlobalMixins)
Vue.use(Buefy, { store })
/* vue based event bus */
export const bus = new Vue()
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
