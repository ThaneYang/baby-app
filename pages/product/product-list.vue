<template>
	<!--
	本页面模板教程：https://ext.dcloud.net.cn/plugin?id=2672
	uni-list 文档：https://ext.dcloud.net.cn/plugin?id=24
	uniCloud 文档：https://uniapp.dcloud.io/uniCloud/README
	unicloud-db 组件文档：https://uniapp.dcloud.io/uniCloud/unicloud-db
	DB Schema 规范：https://uniapp.dcloud.net.cn/uniCloud/schema
	 -->
	<view class="product-list">
		<view v-if="isAudit">
			<div class="grid">
				<div class="grid-item" v-for="(item, j) in alist" :key="j" @tap="goToDetail(item)">
					<div class="top"><img class="img" mode="aspectFill" :src="item.banner[0].url" alt="" /></div>
					<div class="info">{{ item.name }}</div>
				</div>
			</div>
		</view>
		<block v-else>
			<!-- <view class="selector">
				<view class="selector-sub">
					<picker @change="pickerOrders" :range="orders.titles" :value="orders.index">
						<text class="text">{{ orders.titles[orders.index] }}</text>
						<img src="http://yzwpic.weimayi.cn/miniapp/class/open.png" class="icon" alt="" />
					</picker>
				</view>
				<view class="selector-sub">
					<picker @change="pickerCategorys" :range="categorys.titles" :value="categorys.index">
						<text class="text">{{ categorys.titles[categorys.index] }}</text>
						<img src="http://yzwpic.weimayi.cn/miniapp/class/open.png" class="icon" alt="" />
					</picker>
				</view>
			</view> -->
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
				loadtime="onready"
			>
				<!-- <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="formData" :collection="collection"
			 :where="where" :field="field" @load="load"> -->
			  <div class="grid">
					<div class="grid-item" v-for="(item, j) in data" :key="j" @tap="detail(item)">
						<div class="top"><img class="img" mode="aspectFill" :src="item.banner[0].url" alt="" /></div>
						<div class="bottom">
							<div class="name">{{ item.name }}</div>
							<div class="price">￥<text class="price-num">{{ item.price | filterNum }}</text></div>
							<!-- <div class="info">
								<div class="count">已售{{ item.total_sell_count }}件</div>
							</div> -->
						</div>
					</div>
			  </div>
				<!-- <view class="media-list">
					<view v-for="(value, key) in data" class="item" :key="key" @click="detail(value._id)">
						<image mode="aspectFill" class="img" :src="value.banner[0].url || value.source[0].icon[0].url"></image>
						<div class="info">
							<div class="title">{{ value.name }}</div>
							<div class="bottom">
								<div class="play-num">￥<text class="price">{{ value.price | filterNum }}</text></div>
								<div class="count">已售 {{ value.total_sell_count }} 件</div>
							</div>
						</div>
					</view>
				</view> -->
				<!-- 基于 uni-list 的页面布局 -->
			
				<!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
				<uni-load-more v-if="loading || options.status === 'noMore'" :status="options.status" />
			</unicloud-db>
		</block>
	</view>
</template>

<script>
import statusBar from '@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar';

const db = uniCloud.database();

export default {
	components: {
		statusBar
	},
	data() {
		return {
			isAudit: true,
			alist: [],
			pageCurrent: 1,
			where: '',
			keyword: '',
			// 数据表名
			collection: 'opendb-mall-goods',
			// 查询字段，多个字段用 , 分割
			field: 'name,banner,total_sell_count,is_on_sale,price,goods_url',
			foreignKey: '',
			formData: {
				status: 'loading' // 加载状态
			},
			orderby: '',
			orders: {
				index: 0,
				titles: ['播放最多', '最近更新'],
				name: ['most', 'news']
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
	onReady() {},
	async onLoad(options) {
		console.log('options', options);
		
		await this.getConfig();
		// await this.getCategoryList();
		
		if (options.order) {
			this.where = 'is_on_sale == true'; // 只显示上架的
			this.pickerOrders({
				detail: {
					value: options.order
				}
			});
		} else {
			this.where = 'is_on_sale == true'; // 只显示上架的
			this.orderby = 'total_sell_count desc'; // 默认播放最多
		}
		
		if (options.category) {
			console.log('options.category', options.category);
			this.pickerCategorys({
				detail: {
					value: options.category
				}
			});
		}
		console.log('this.where', this.where);
		// setTimeout(() => {
		// 	this.$refs.udb.loadData();
		// })
	},
	filters: {
		filterNum(val) {
			return (val / 100).toFixed(2)
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	methods: {
		goToDetail(item) {
			wx.navigateTo({
				url: `/pages/list/detail?id=${item._id}&title=${item.name}`
			});
		},
		// 获取文章
		fetchList2() {
			return db
				.collection('opendb-news-articles')
				.get()
				.then(res => {
					this.alist = res.result.data || [];
				});
		},
		getConfig() {
			return db
				.collection('config')
				.get()
				.then(res => {
					console.log('返回结果', res);
					// audit
					let data = (res.result.data && res.result.data[0] && res.result.data[0]) || {};
					this.isAudit = data.isAudit;
					if (this.isAudit) {
						this.fetchList2()
					}
				});
		},
		async getCategoryList() {
			return db
				.collection('media-tags')
				.where({})
				.orderBy('code', 'asc')
				.get()
				.then(res => {
					console.log('返回结果', res);
					res.result.data.forEach(item => {
						this.categorys.titles.push(item.name);
						this.categorys.name.push(item.code);
					});
					console.log('this.category.titles', this.categorys.titles);
				});
		},
		pickerOrders(e) {
			console.log(e);
			this.orders.index = e.detail.value;
			if (this.orders.index === '0') {
				// 最多收听
				console.log('最多收听');
				this.orderby = 'total_view_count desc';
			} else if (this.orders.index === '1') {
				// 最近更新
				console.log('最近更新');
				this.orderby = 'add_date desc';
			}
			// this.$refs.udb.loadData({clear: true});
		},
		pickerCategorys(e) {
			console.log(e);
			this.categorys.index = e.detail.value;
			if (this.categorys.index === '0') {
				// this.where = `is_on_sale==true`;
				this.where = 'is_on_sale == true';
			} else {
				// 这行不知道为什么不行
				// this.where = `is_on_sale==true && tag_id==${this.categorys.name[this.categorys.index]}`;
				this.where = "tag_id == '" + this.categorys.name[this.categorys.index] + "' && is_on_sale == true";
			}
			console.log('this.where', this.where);
			// this.$refs.udb.clear()
			// this.$refs.udb.reset()
			// this.$refs.udb.loadData()
		},
		searchClick(e) {
			//点击搜索框
			uni.navigateTo({
				url: '/pages/media-list/search'
			});
		},
		onqueryerror(e) {
			console.error(e);
		},
		detail(item) {
			// #ifdef H5
			window.location.href = item.goods_url
			// #endif
			// #ifndef H5
			// uni.navigateTo({
			// 	url: `/pages/common/webview/webview?url=${item.goods_url}`
			// })
			wx.navigateTo({
				url: `/pages/product/product?id=${item._id}`
			});
			// #endif
		},
		load(data, ended) {
			// console.log('load data', data);
			// console.log('load ended', ended);
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

<style lang="scss" scoped>
.product-list {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background-color: #fff;
	min-height: 100vh;
	padding: 20rpx;
	box-sizing: border-box;
	.grid {
		display: flex;
		flex-wrap: wrap;
		.grid-item {
			display: flex;
			flex-direction: column;
			width: 48.5%;
			margin-right: 3%;
			margin-bottom: 3%;
			box-sizing: border-box;
			border-radius: 20rpx;
			background: #fff;
			&:nth-child(2n) {
				margin-right: 0;
			}
		}
		.top {
			font-size: 0;
		}
		.bottom {
			padding: 10rpx 0 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
		}
		.img {
			width: 100%;
			height: 320rpx;
			border-radius: 20rpx 20rpx 0 0;
		}
		.name {
			font-size: 28rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			flex: 1;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.info {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.price {
			color: red;
			font-size: 28rpx;
			.price-num {
				font-size: 28rpx;
			}
		}
		.count {
			color: #999;
			font-size: 28rpx;
		}
	}
}

.noData {
	text-align: center;
	padding: 50rpx;
}

.home-mendian {
	width: 500rpx;
	height: 64rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 42rpx;
	color: #bfbfbf;
	.icon1 {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	.icon2 {
		width: 30rpx;
		height: 30rpx;
	}
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
	.icon {
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
		align-items: center;
	}
	.play-num {
		color: red;
		font-size: 28rpx;
		margin-right: 30rpx;
		.price {
			font-size: 32rpx;;
		}
	}
	.count {
		color: #999;
		font-size: 28rpx;
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
