import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "assets/css/base.css"
import "./plugins/element.js"
import 'assets/css/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
	NProgress.start()
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
axios.interceptors.response.use(config => {
	NProgress.done()
	return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

Vue.filter('dataFormat', function(originVal) {
	const dt = new Date(originVal)
	
	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2, '0')
	const d= (dt.getDate() + '').padStart(2, '0')
	
	const hh = (dt.getHours() + '').padStart(2, '0')
	const mm = (dt.getMinutes() + '').padStart(2, '0')
	const ss = (dt.getSeconds() + '').padStart(2, '0')
	
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

//http://127.0.0.1:8888/api/private/v1/