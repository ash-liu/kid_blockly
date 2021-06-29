import Vue from 'vue'
import App from './App.vue'

// 弹窗库
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);

Vue.config.productionTip = false
//Add unimported components to ignore list to prevent warnings.
Vue.config.ignoredElements = ['field','block','category','xml','mutation','value','sep']

new Vue({
  render: h => h(App),
}).$mount('#app')
