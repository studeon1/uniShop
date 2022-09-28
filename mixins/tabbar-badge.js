import { mapGetters } from 'vuex'

//导出一个mixin对象

export default{
	computed:{
		//将m_cart模块中的total映射为当前页面的计算属性
		...mapGetters('m_cart',['total'])
	},
	watch:{
		//监听total数值的变化
		total(){
			this.setBadge()
		}
	},
	onShow() {
		//在页面展示的时候 设置数字徽标
		this.setBadge()
	},
	methods:{
		setBadge(){
			//调用uni.setTabBarBadge()方法，为购物车设置右上角徽标
			uni.setTabBarBadge({
				index:2,//索引
				text:this.total + ''//text的值必须是字符串
			})
		}
	}
}