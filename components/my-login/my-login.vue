<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tip-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex'
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		computed:{
			...mapState('m_user',['redirectInfo']),
			
		},
		methods:{
			...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
			//获取微信用户的基本信息
			getUserInfo(e){
				if(e.detail.errMsg === 'getUserInfo:fail user deny') return uni.$showMsg('您取消了登录授权')
				
			//获取用户信息成功
			console.log(e.detail.userInfo)
			this.updateUserInfo(e.detail.userInfo)
			
			//获取登录成功后的字符串
			this.getToken(e.detail)
			},
			async getToken(info){
				const res = await uni.login().catch(err=>err)
				// 判断wx.login()是否调用失败
				// console.log(res)
				//判断条件 err || res.errMsg != 'login:ok'
				if(res.errMsg != 'login:ok') return uni.$showMsg('登录失败')
				
				//准备参数对象
				const query = {
					code:res.code,
					encryptedData:info.encryptedData,
					iv:info.iv,
					rawData:info.rawData,
					signature:info.signature
				}
				
				
// 				const query = {
// code: "013pZWCt0GniKb1ftkBt0AxfDt0pZWCf",
// 				    encryptedData: "FGMaNbO4ytTFTUzK3wmtfHWoFeQJYkyMajQ5tVbQglwmnJ46SMi43Thq0OZjSSa5Msmnpdfx7yigYkdvUbsiQFyF9xMGEQLpUFcpNjnYoCQOl2Ka5zEeqpMY91ywYAsPISeu1rwvFCU2Ucenxf7gdcDPQ/jNJdORGb86DR+2gVJeg8TZiXWJ66enpynj35DiaE1jNWUSzpgbOvO40dZrWnHVwDEJN+upeSHRR/IW7t3cgtV63/GeZzNhFbUYqNHO6M1KHetwY1u8mFXuZoXwVV7DrEwEzY1btqcfW93q4ekn2uwAUeJM4U+3roBsIT5ZpEM8YtQZVsAwjaWHBe8id1H4lurEFC5/GwLnRONrIiR7KDF7MPxnMO9flWFQEfay5dt9rBELzk1Efjf2H6UnzYfh+o4MbPxtc0cUiHEnNCVcXjDtulXSRUy7RZQPmjF/tYBHHrXEFubxnK4oRBZz/A==",
// 				    iv: "y/ESFBaesbEzIbB1th5Knw==",
// 				    rawData: "{\"nickName\":\"优购\",\"gender\":0,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/icWlxE4rARHaIlib1PRmBtRa2tQicUSEHYu8UIGZ0LLic9C0PticibED6brRFCuQYeLGtwTcBYFgMtcF11N31pVhMF8g/132\"}",
// 				    signature: "d06cd3a54e89e6014e43694844706eaccad109bb"
// 				}
				
				//换取token
				const data = await uni.$http.post('/api/public/v1/users/wxlogin',query)
				// console.log(data)
				if(data.statusCode !== 200) return uni.$showMsg('登录失败！')
				// uni.$showMsg('登录成功')
				//将token保存到vuex中
					this.updateToken(data.message.token)
					this.navigateBack()
				
			},
			navigateBack(){
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
					uni.switchTab({
						url:this.redirectInfo.form,
						complete:() => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.login-container{
	// 登录盒子的样式
	height: 750rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	position: relative;
	overflow: hidden;
	
	&::after{
		content: '';
		display: block;
		width: 100%;
		height: 40px;
		background-color: white;
		position: absolute;
		bottom: 0;
		left: 0;
		border-radius: 100%;
		transform: translateY(50%);
	}
	
	// 绘制登录盒子的半椭圆造型
	.btn-login{
		width: 90%;
		border-radius: 100px;
		margin: 15px 0;
		background-color: #C00000;
	}
	
	.tips-text{
		font-size: 12px;
		color: gray;
	}
}
</style>