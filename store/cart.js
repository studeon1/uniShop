export default{
	namespaced:true,
	//模块的state数据
	state:()=>({
		//购物车数组用来存储购物车中每个商品信息对象
		//每个商品信息对象都包含一下六个属性：
		//{goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state}
		cart:JSON.parse(uni.getStorageSync('cart')||'[]'),
		
	}),
	mutations:{
		addToCart(state,goods){
			//根据商品id查询购物车中是否存在这件商品
			//如果不存在，则findResult 为undefined;否者，为查到的商品信息对象
			const findResult = state.cart.find((x)=>x.goods_id===goods.goods_id)
			// console.log(findResult)
			if(!findResult){
				//如果购物车中没有这件商品则直接push
				state.cart.push(goods)
			}else{
				//如果购物车中有这件商品则只更新数量
				findResult.goods_count++
			}
			// console.log(state.cart)
			this.commit('m_cart/saveToStorage')
		},
		//将购物车中的数据持久化存储到本地
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		//更新购物车中商品的勾选状态
		updateGoodsState(state,goods){
			//根据goods_id查询 对应购物车中商品的信息对象
			const findResult = state.cart.find(x=>x.goods_id === goods.goods_id)
			if(findResult){
				findResult.goods_state = goods.goods_state
				this.commit('m_cart/saveToStorage')
			}
		},
		//更新购物车商品数量
		updateGoodsCount(state,goods){
			const findResult = state.cart.find(x=>x.goods_id === goods.goods_id)
			if(findResult){
				findResult.goods_count =goods.goods_count
				this.commit('m_cart/saveToStorage')
			}
		},
		//根据Id从购物车中删除对应的商品信息
		removeGoodsById(state,goods_id){
			state.cart = state.cart.filter(x=>x.goods_id!==goods_id)
			this.commit('m_cart/saveToStorage')
		},
		//更新所有商品的勾选状态
		updateAllGoodsState(state,newState){
			state.cart.forEach(x=>x.goods_state = newState)
			this.commit('m_cart/saveToStorage')
		}
	},
	
	getters:{
		total(state){
			// let c = 0
			// state.cart.forEach(goods=>c+=goods.goods_count)
			// return c
			
			return state.cart.reduce((total,item)=>total += item.goods_count,0)
		},
		//勾选商品的总数
		checkedCount(state){
			//filter过滤已勾选的商品
			//reduce将已勾选的商品累加
			//reduce()的返回值就是已勾选的商品总量
			return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total+=item.goods_count,0)
		},
		//已勾选的商品的总价
		checkedGoodsAmount(state){
			// filter过滤已勾选商品
			//reduce将已勾选商品*单价后累加
			return state.cart.filter(x=>x.goods_state)
							 .reduce((total,item)=>total += item.goods_count * item.goods_price,0)
							 .toFixed(2)
		}
	}
}