<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		<!-- 商品列表的标题 -->
		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 右侧文本 -->
			<view class="cart-title-text">购物车</view>
		</view>
		<!-- 商品列表区域 -->
		<!-- uni-swipe-action是最外层包裹性质的容器 -->
		<uni-swipe-action>
			<block v-for="(goods,i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>			
		</uni-swipe-action>
		
		<!-- 使用自定义结算组件 -->
		<my-settle></my-settle>
	</view>
	
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也</text>
	</view>
</template>

<script>
	import { mapGetters , mapState , mapMutations} from 'vuex'
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		//导入mixin模块
		mixins:[badgeMix],
		computed:{
			//将m_cart中的cart数组映射到当前页面使用
			...mapState('m_cart',['cart'])
		},
		data() {
			return {
				options:[{
					text:'删除',
					style:{
						backgroundColor:'#C00000'
					}
				}]
			};
		},
		methods:{
			...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
			//商品勾选状态发生变化
			radioChangeHandler(e){
				// console.log(e)
				this.updateGoodsState(e)
			},
			numberChangeHandler(e){
				// console.log(e)
				this.updateGoodsCount(e)
			},
			swipeItemClickHandler(goods){
				// console.log(goods)
				this.removeGoodsById(goods.goods_id)
			}
		}
		

	}
</script>

<style lang="scss">
.cart-container{
	padding-bottom: 50px;
}
.cart-title{
	height: 40px;
	display: flex;
	align-items: center;
	padding-left: 5px;
	border-bottom: 1px solid #EFEFEF;
	.cart-title-text{
		font-size: 14px;
		margin-left: 10px;
	}
}
.empty-cart{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 150px;
	.empty-img{
		width: 90px;
		height: 90px;
		
	}
	.tip-text{
		font-size: 12px;
		margin-top: 15px;
		color: gray;
	}
}
</style>
