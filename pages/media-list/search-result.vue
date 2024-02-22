<template>
	<!--
	本页面模板教程：https://ext.dcloud.net.cn/plugin?id=2672
	uni-list 文档：https://ext.dcloud.net.cn/plugin?id=24
	uniCloud 文档：https://uniapp.dcloud.io/uniCloud/README
	unicloud-db 组件文档：https://uniapp.dcloud.io/uniCloud/unicloud-db
	DB Schema 规范：https://uniapp.dcloud.net.cn/uniCloud/schema
	 -->
	<view class="list">
		<uni-search-bar @click="searchClick" class="uni-search-box" v-model="keyword" ref="searchBar" radius="100" cancelButton="none" disabled :placeholder="inputPlaceholder" />
		<view class="cover-search-bar" @click="searchClick"></view>
		<!-- 刷新页面后的顶部提示框 -->
		<!-- 当前弹出内容没有实际逻辑 ，可根据当前业务修改弹出提示 -->
		<view class="tips" :class="{ 'tips-ani': tipShow }">为您更新了最新10条</view>
		<unicloud-db
			ref="udb"
			v-slot:default="{ data, loading, error, options }"
			:options="formData"
			@error="onqueryerror"
			:where="where"
			:collection="collection"
			:foreign-key="foreignKey"
			:field="field"
			:orderby="orderby"
			@load="load"
			loadtime="manual"
			:manual="true"
		>
			<!-- <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="formData" :collection="collection"
		 :where="where" :field="field" @load="load"> -->
			<view class="media-list">
				<view v-for="(value, key) in data" class="item" :key="key" @click="detail(value)">
					<image mode="aspectFill" class="img" v-if="value && value.banner[0]" :src="value.banner[0].url"></image>
					<image mode="aspectFill" class="img" v-else-if="value.source && value.source[0] && value.source[0].icon[0]" :src="value.source[0].icon[0].url"></image>
					<div class="info">
						<div class="title">{{ value.name }}</div>
						<div class="bottom">
							<div class="play-num">{{ value.total_view_count | filterNum }}次播放</div>
							<div class="count">共{{ value.radios.length }}集</div>
						</div>
					</div>
					<!-- <view class="box pd16_15 flex alcenter mb16" style="position: relative;" @click="detail(value._id)">
						<image mode="aspectFill" class="tuan-product-l" :src="value.banner && value.banner[0].path"></image>
						<view class="tuan-product-r pl15">
							<view class="ft14 ftw600 cl-main text-over2">{{value.name}}</view>
							<view class="mt16">
								<view class="ft16 cl-orange ftw600 mb5">会员免费</view>
								<view class="ft12 cl-notice">普通价：¥{{value.price}}</view>
							</view>
							<view class="mt16 flex space alcenter">
								<view class="ft12 cl-notice">{{value.updatetime}}</view>
							</view>
						</view>
					</view> -->
				</view>
			</view>
			<!-- 基于 uni-list 的页面布局 -->

			<!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
			<uni-load-more v-if="loading || options.status === 'noMore'" :status="options.status" />
		</unicloud-db>
	</view>
</template>

<script>
const db = uniCloud.database();
	
export default {
	components: {},
	data() {
		return {
			where: '',
			keyword: '',
			// 数据表名
			collection: 'media,media-category',
			// 查询字段，多个字段用 , 分割
			field: 'name,source{code,icon},radios,total_view_count,banner,is_on_sale',
			foreignKey: 'media.source',
			formData: {
				status: 'loading' // 加载状态
			},
			orderby: 'total_view_count desc', // 默认最近更新
			orders: {
				index: 0,
				titles: ['播放最多', '最近更新', '热门推荐'],
				name: ['most', 'news', 'hot']
			},
			categorys: {
				index: 0,
				titles: ['全部分类'],
				name: ['00']
			},
			inputPlaceholder: '请输入搜索内容',
			tipShow: false // 是否显示顶部提示框
		};
	},
	watch: {
		keyword(keyword, oldValue) {
			console.log('keyword', keyword);
			if (keyword) {
				this.where = `is_on_sale==true && /${keyword}/.test(name)`;
				// this.where = `is_on_sale==true && ${new RegExp(keyword)}.test(name)`;
			} else {
				this.where = `is_on_sale==true`;
			}
			console.log('this.where', this.where)
			setTimeout(() => {
				this.$refs.udb.loadData();
			})
		}
	},
	onReady() {
		console.log('onReady')
		// this.where = `is_on_sale==true`;
		// this.$refs.udb.loadData();
	},
	async onShow() {
		this.keyword = getApp().globalData.searchText;
		getApp().globalData.searchText = '';
	},
	onLoad() {},
	filters: {
		filterNum(val) {
			if (val > 10000) {
				return (val / 10000).toFixed(1) + '万';
			} else {
				return val;
			}
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	methods: {
		// async getCategoryList() {
		// 	return db
		// 		.collection('media-tags')
		// 		.where({})
		// 		.orderBy('code', 'asc')
		// 		.get()
		// 		.then(res => {
		// 			console.log('返回结果', res);
		// 			res.result.data.forEach((item) => {
		// 				this.categorys.titles.push(item.name)
		// 				this.categorys.name.push(item.code)
		// 			})
		// 			console.log('this.category.titles', this.categorys.titles)
		// 		});
		// },
		// pickerOrders(e) {
		// 	console.log(e);
		// 	this.orders.index = e.detail.value;
		// 	this.keyword = ''
		// 	if (this.orders.index === '0') {
		// 		// 最多收听
		// 		console.log('最多收听')
		// 		this.where = `is_on_sale==true&&/${this.keyword}/.test(name)`;
		// 		this.orderby = 'total_view_count desc'
		// 	} else if (this.orders.index === '1') {
		// 		// 最近更新
		// 		console.log('最近更新', this.keyword)
		// 		this.where = `is_on_sale==true&&/${this.keyword}/.test(name)`; 
		// 		this.orderby = 'add_date asc'
		// 	} else {
		// 		// 热门推荐
		// 		console.log('热门推荐')
		// 		this.where = `is_on_sale==true&&is_hot==true`
		// 		this.orderby = 'total_view_count desc'
		// 	}
		// },
		// pickerCategorys(e) {
		// 	console.log(e);
		// 	this.categorys.index = e.detail.value;
		// 	// this.loadLesson(1);
		// },
		searchClick(e) {
			//点击搜索框
			if (this.keyword) {
				uni.navigateBack();
			} else {
				uni.hideKeyboard();
				uni.navigateTo({
					url: '/pages/media-list/search',
					animationType: 'fade-in'
				});
			}
		},
		onqueryerror(e) {
			console.error(e);
		},
		detail(item) {
			wx.navigateTo({
				url: `/pages/media-detail/media-detail?id=${item._id}`
			});
		},

		load(data, ended) {
			console.log('load data', data)
			// console.log('load ended', ended)
			if (ended) {
				this.formData.status = 'noMore';
			}
		}
	},
	/**
	 * 下拉刷新回调函数
	 */
	onPullDownRefresh() {
		this.formData.status = 'more';
		this.$refs.udb.loadData(
			{
				clear: true
			},
			() => {
				this.tipShow = true;
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.tipShow = false;
				}, 1000);
				uni.stopPullDownRefresh();
			}
		);
	},
	/**
	 * 上拉加载回调函数
	 */
	onReachBottom() {
		this.$refs.udb.loadMore();
	}
};
</script>

<style lang="scss">
page {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background-color: #fff;
	min-height: 100%;
	height: auto;
}

.selector {
	display: flex;
	
	.selector-sub {
		flex: 1;
		padding: 30rpx;
	}
	
	.text {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
	}
	.icon{
		width: 20rpx;
		height: 20rpx;
		margin-left: 10rpx;
	}
}

.media-list {
	.item {
		width: 100%;
		display: flex;
		background: #fff;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.img {
		width: 100rpx;
		height: 100rpx;
		margin-right: 30rpx;
		border-radius: 8rpx;
	}
	.title {
		color: #000;
		font-size: 32rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-bottom: 10rpx;
	}
	.bottom {
		display: flex;
	}
	.play-num {
		color: #666;
		font-size: 24rpx;
		margin-right: 30rpx;
	}
	.count {
		color: #666;
		font-size: 24rpx;
	}
}

.tips {
	color: #67c23a;
	font-size: 14px;
	line-height: 40px;
	text-align: center;
	background-color: #f0f9eb;
	height: 0;
	opacity: 0;
	transform: translateY(-100%);
	transition: all 0.3s;
}

.tips-ani {
	transform: translateY(0);
	height: 40px;
	opacity: 1;
}

.shop {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.shop-picture {
	width: 110px;
	height: 110px;
}

.shop-picture-column {
	width: 100%;
	height: 170px;
	margin-bottom: 10px;
}

.shop-price {
	margin-top: 5px;
	font-size: 12px;
	color: #ff5a5f;
}

.shop-price-text {
	font-size: 16px;
}

.hot-tag {
	background: #ff5a5f;
	border: none;
	color: #fff;
}

.button-box {
	height: 30px;
	line-height: 30px;
	font-size: 12px;
	background: #007aff;
	color: #fff;
}

.uni-link {
	flex-shrink: 0;
}

.ellipsis {
	display: flex;
	overflow: hidden;
}

.uni-ellipsis-1 {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.uni-ellipsis-2 {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

// 默认加入 scoped ，所以外面加一层提升权重
.list {
	.uni-list--waterfall {
		/* #ifndef H5 || APP-VUE */
		// 小程序 编译后会多一层标签，而其他平台没有，所以需要特殊处理一下
		/deep/ .uni-list {
			/* #endif */
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 5px;
			box-sizing: border-box;

			/* #ifdef H5 || APP-VUE */
			// h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
			/deep/
				/* #endif */
				.uni-list-item--waterfall {
				width: 50%;
				box-sizing: border-box;

				.uni-list-item__container {
					padding: 5px;
					flex-direction: column;
				}
			}

			/* #ifndef H5 || APP-VUE */
		}

		/* #endif */
	}
}

.user-not-vip {
	width: 100%;
	height: 80rpx;
	background: #fdf6ec;
	border-radius: 40rpx;
	border: 2rpx solid #efc381;
	text-align: center;
	line-height: 76rpx;
	font-size: 24rpx;
	color: #000000;
	font-weight: bold;
}

.tuan-product-l {
	width: 320rpx;
	height: 240rpx;
	border-radius: 16rpx;
	background: #f2f2f2;
}
.tuan-product-r {
	width: calc(100% - 320rpx);
}
.cover-search-bar {
	height: 50px;
	position: relative;
	top: -50px;
	margin-bottom: -50px;
	/* #ifndef APP-NVUE */
	z-index: 999;
	/* #endif */
}
</style>
