<template>
	<view class="my-settle-container">
		<!-- 全选 -->
		<label for="" class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amount-box">
			合计: <text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">
			结算({{checkedCount}})
		</view>
	</view>
</template>

<script>
	import { mapGetters , mapMutations , mapState} from 'vuex'
	export default {
		name:"my-settle",
		data() {
			return {
				//倒计时秒数
				seconds:3
			};
		},
		computed:{
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			...mapGetters('m_user',['addstr']),
			...mapState('m_user',['token']),
			...mapState('m_cart',['cart']),
			// 是否全选
			isFullCheck(){
				return this.total === this.checkedCount
			},
			// ...mapGetters('m_cart',)
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			...mapMutations('m_user',['updateRedirectInfo']),
			
			changeAllState(){
				this.updateAllGoodsState(!this.isFullCheck)
			},
			settlement(){
				if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
				if(!this.addstr) return uni.$showMsg('请选择收货地址')
				// 判断是否登录了
				// if(!this.token) return uni.$showMsg('请先登录')
				if(!this.token) return this.delayNavigate()
				
				//微信支付
				this.payOrder()
			},
			async payOrder(){
				// 创建订单
				const orderInfo = {
					//order_price:this.checkedGoodsAmount,
					order_price:0.01,
					consignee_addr:this.addstr,
					//获取已勾选商品 处理信息格式和服务器保持一致
					goods:this.cart.fliter(x=>x.goods_state).map(x=>({
						goods_id:x.goods_id,
						goods_num:x.goods_count,
						goods_price:x.goods_price
						}))
				}
				//发起订单请求
				const { data:res } = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
				if(res.meta.status !== 200) return uni.showMsg('创建订单失败')
				// 得到服务器响应的订单编号
				const orderNumber = res.message.order_number
				
				// 订单预支付
				const {data:res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder',{order_number:orderNumber})
				if(res2.meta.status !== 200) return uni.showMsg('预支付订单生成失败！')
				const payInfo = res2.message.pay
				
				
				// 发起微信支付
				cosnt [err,succ] = await uni.requestPayment(payInfo)
				if(err) return uni.$showMsg('请支付订单')
				const {data:res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder',{orde_number:orderNumber})
				if(res3.meta.status !== 200) return uni.$showMsg('订单未支付')
				uni.showToast({
					title:'支付完成',
					icon:'success'
				})
				
			},
			showTips(n){
				uni.showToast({
					icon:'none',
					title:'请登录后结算' + n 
+ '秒后自动跳转到登录页',
					//添加遮罩 防止点击穿透
					mask:true,
					duration:1500
				})
			},
			delayNavigate(){
				this.seconds=3
				this.showTips(this.seconds)
				this.timer = setInterval(()=>{
					this.seconds--
					if(this.seconds<=0){
						clearInterval(this.timer)
						uni.switchTab({
							url:'/pages/my/my',
							//页面跳转成功后的回调函数
							success:()=>{
								//将跳转信息存储到store
								this.updateRedirectInfo({
									openType:'switchTab',
									//从哪个页面跳转过去
									from:'/page/cart/cart'
								})
							}
						})
						
						return
					}
					this.showTips(this.seconds)
				},1000)
			},
			
			
		}
	}
</script>

<style lang="scss">
.my-settle-container{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background-color: white;
	z-index: 999;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;
	.radio{
		display: flex;
		align-items: center;
	}
	.amount-box{
		.amount{
			color: #C00000;
			font-weight: bold;
		}
	}
	.btn-settle{
		background-color: #C00000;
		height: 50px;
		line-height: 50px;
		padding: 0 10px;
		min-width: 100px;
		text-align: center;
		color: white;
	}
}
</style>