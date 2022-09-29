
import {createSSRApp} from 'vue'
import App from './App'
import store from '@/store/store.js'
// 导入网络请求包
import { $http } from '@escook/request-miniprogram'


uni.$http = $http

//请求的根路径a 'https://api-ugo-web.itheima.net'
$http.baseUrl= 'https://api-hmugo-web.itheima.net'
// console.log(uni.$http)
// 请求拦截器
$http.beforeRequest = function(options){
	uni.showLoading({
		title:'数据加载中...'
	})
	console.log(store)
	//判断是否为有权限的API接口
	if(options.url.indexOf('/my/') !== -1){
		options.header = {
			Authorization:store.state.m_user.token
		}
	}
}

// 响应拦截器
$http.afterRequest = function(){
	uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title='数据请求失败！',duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
		
	})
}

// // #ifndef VUE3
// import Vue from 'vue'
// import App from './App'

// Vue.config.productionTip = false

// App.mpType = 'app'

// const app = new Vue({
//     ...App
// })
// app.$mount()
// // #endif

// // #ifdef VUE3
// import { createSSRApp } from 'vue'
// import App from './App.vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   return {
//     app
//   }
// }
// // #endif


// 非Vue3部分
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$http = $http
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif


// Vue3部分
// #ifdef VUE3

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.config.globalProperties.$http = $http
  return {
    app
  }
}
// #endif

