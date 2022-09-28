<template>
	<view>
		<!-- 选择收货地址 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		<!-- 渲染收货信息的盒子 -->
		<view class="address-info-box" @click="chooseAddress" v-else>
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人：{{address.userName}}</view>
				</view>
				<view class="row1-right">
					<view class="phone">电话：<text>{{address.telNumber}}</text></view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">收货地址：</view>
				<view class="row2-right">{{addstr}}</view>
			</view>
		</view>
		<!-- 底部边框线 -->
		<image src="@/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import { mapState ,mapMutations , mapGetters } from 'vuex'
	export default {
		name:"my-address",
		data() {
			return {
				//收货地址
				// address:{}
			};
		},
		methods:{
			...mapMutations('m_user',['updateAddress']),
			//选择收货地址1
			//待修改 err 判断[succ,err]
			async chooseAddress(){
				const res = await uni.chooseAddress().catch(err=>err)
				
				if(res.errMsg === 'chooseAddress:ok'){
					// this.address = res
					this.updateAddress(res)
				}
				
				//用户没有授权
				// if(err&&err.errMsg === 'chooseAddress:fail auth deny'){
					// if(err&&(err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')){
				// 	this.reAuth()//向用户重新发起授权请求
					// }
				// }
				// console.log(this.address,res.err)
				
			},
			//用户重新授权
			async reAuth(){
				const [err2,confirmResult] = await uni.showModal({
					content:'未打开地址权限，是否去设置打开',
					confirmText:'确认',
					cancelText:'取消',
				})
				//如果弹窗异常 则直接退出
				if(err2) return
				
				//如果用户点击了取消 则提示
				if(confirmResult.cancel) return uni.$showMsg('您取消了授权')
				// 如果点击了确认 则用uni.openSetting()方法进入授权页面 让用户重新进行授权
				if(confirmResult.confirm) return uni.openSetting({
					success:(settingResult)=>{
						if(settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
						if(!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了授权地址')
					}
				})
			}
			
		},
		computed:{
			//映射m_user中的address对象
			...mapState('m_user',['address']),
			...mapGetters('m_user',['addstr'])
		}
	}
</script>

<style lang="scss">
	.address-border{
		display: block;
		width: 100%;
		height: 5px;
	}
	
	.address-choose-box{
		height: 90px;
		display: flex;
		justify-content: center;
		align-items:center;
		.btnChooseAddress{
			
		}
	}
	
	.address-info-box{
		font-size: 12px;
		height: 90px;
		display:flex;
		justify-content: center;
		flex-direction: column;
		padding: 0 5px;
		.row1{
			display: flex;
			justify-content: space-between;
			.row1-right{
				display: flex;
				justify-content: space-between;
			}
		}
		.row2{
			display: flex;
			// justify-content: space-between;
			align-items: center;
			margin-top: 10px;
			.row2-left{
				white-space: nowrap;
				
			}
		}
	}
</style>