import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios";
import '@/components/fonts/font.css'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(axios)

new Vue({
  axios,
  router,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
