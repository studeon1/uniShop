//导入Vue和Vuex
// import Vue from 'vue'
// import Vuex from 'vuex'
import { createStore } from 'vuex'
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

//将Vuex安装为Vue插件
// #ifndef VUE3
	Vue.use(Vuex)
// #endif


//创建Store实例对象
const store = createStore({
	modules:{
		'm_cart':moduleCart,
		'm_user':moduleUser
	}
})



// 向外共享 Store的实例对象
export default store