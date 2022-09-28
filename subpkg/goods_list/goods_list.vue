<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//请求参数对象
				queryObj:{
					query:'',
					cid:'',
					pagenum:1,
					pagesize:10
				},
				goodsList:[],
				total:0,
				isloading:false

			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// console.log(this.queryObj)
			
			this.getGoodsList()
			
		},
		methods:{
			//获取商品列表数据的方法
			async getGoodsList(cb){
				// 打开节流阀
				this.isloading = true
				const {data:res } = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				
				// 关闭节流阀
				this.isloading = false
				
				//只要数据请求完毕 就立即按需调用cb
				cb&&cb()
				if(res.meta.status !== 200) return uni.$showMsg()
				this.goodsList = [...this.goodsList,...res.message.goods]
				this.total = res.message.total
				// console.log(this.goodsList)
			},
			gotoDetail(item){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		onReachBottom() {
			//判断是否有下一页数据
			if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total) return uni.$showMsg('数据加载完毕')
			
			if(this.isloading) return 
			  
			//让页面自增+1
			this.queryObj.pagenum++
			this.getGoodsList()
		},
		onPullDownRefresh(){
			//1.重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			
			//2.重新发起请求
			this.getGoodsList(()=>uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
