<template>
	<view class="goods-item">
		<!-- 左侧盒子 -->
		<view class="goods-item-left">
			<!-- 存储在购物车中的商品 包含goods_state属性 表示商品的勾选状态 -->
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo||defaultPic" class="goods-pic"></image>
		</view>
		<!-- 右侧盒子 -->
		<view class="goods-item-right">
			<!-- 商品的名字 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<!-- 商品信息 -->
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{tofixed(goods.goods_price)}}</view>
				<!-- 商品信息 -->
				<uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler" v-if="showNum"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			//商品信息对象
			goods:{
				type:Object,
				default:{}
			},
			//是否展示图片左侧的goods
			showRadio:{
				type:Boolean,
				//如果外界没有设定show-radio属性的值，则默认不展示radio组件
				default:false
			},
			//控制展示价格右侧的NumberBox组件
			showNum:{
				type:Boolean,
				default:false
			}
		},
		name:"my-goods",
		data() {
			return {
				//默认图片
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		methods:{
			tofixed(num){
				// console.log(11111111111111111,11)
				return Number(num).toFixed(2)
			},
			//radio组件的点击事件处理函数
			radioClickHandler(){
				this.$emit('radio-change',{
					// 商品的Id
					goods_id:this.goods.goods_id,
					// 商品最新的勾选状态
					goods_state:!this.goods.goods_state
				})
			},
			//NumberBox组件中的change事件处理函数
			numChangeHandler(val){
				this.$emit('num-change',{
					goods_id:this.goods.goods_id,
					goods_count:+val
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item{
		width: 750rpx;
		box-sizing: border-box;
		display: flex;
		margin-right: 5px;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		.goods-item-left{
			margin-right: 5px;
			display: flex;
			justify-content: center;
			align-items: center;
			.goods-pic{
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		.goods-item-right{
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;
			.goods-name{
				font-size: 13px;
			}
			.goods-info-box{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.goods-price{
					color: #C00000;
					font-size: 16px;
				}
			}
		}
	}
</style>