<template>
	<!--
	本页面模板教程：https://ext.dcloud.net.cn/plugin?id=2672
	uni-list 文档：https://ext.dcloud.net.cn/plugin?id=24
	uniCloud 文档：https://uniapp.dcloud.io/uniCloud/README
	unicloud-db 组件文档：https://uniapp.dcloud.io/uniCloud/unicloud-db
	DB Schema 规范：https://uniapp.dcloud.net.cn/uniCloud/schema
	 -->
	<view class="list">
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
			:distinct="true"
			loadtime="onready"
		>
			<!-- <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="formData" :collection="collection"
		 :where="where" :field="field" @load="load"> -->
			<view class="media-list">
				<view v-for="(value, key) in data" class="item" :key="key" v-if="value.goods_id && value.goods_id.length > 0">
					<image mode="aspectFill" class="img" :src="value.goods_id[0].banner[0].url || value.source[0].icon[0].url"  @click="detail(value.goods_id[0]._id, value.radio_index)"></image>
					<div class="info" @click="detail(value.goods_id[0]._id, value.radio_index)">
						<div class="title">{{ value.goods_id[0].name }}</div>
						<div class="bottom" style="margin-bottom: 5rpx;">
							<div class="radio-title">上次听到 {{ value.radio_title }}</div>
						</div>
						<div class="bottom">
							<div class="play-num">
								<img src="http://yzwpic.weimayi.cn/miniapp/class/time.png" alt="" />
								{{ value.current_value | filterTime }}
							</div>
							<div class="count" v-if="!value.duration_value">已播放0%</div>
							<div class="count" v-else>已播放{{ ((value.current_value / value.duration_value) * 100).toFixed(0) + '%' }}</div>
						</div>
					</div>
					<view @click="confirmDelete(value._id)" class="del-btn">删除</view>
				</view>
			</view>
			<!-- 基于 uni-list 的页面布局 -->

			<!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
			<uni-load-more v-if="loading || options.status === 'noMore'" :status="options.status" />
		</unicloud-db>
	</view>
</template>

<script>
import { vShow } from "vue";
const db = uniCloud.database();
export default {
	components: {},
	data() {
		return {
			where: '',
			keyword: '',
			// 数据表名
			collection: 'media-log, media, media-category',
			// 查询字段，多个字段用 , 分割
			field: '_id,goods_id{_id,name,banner},source{code,icon},user_id,radio_title,radio_index,current_value,duration_value,update_date',
			foreignKey: 'media-log.goods_id, media-log.source',
			formData: {
				status: 'loading' // 加载状态
			},
			orderby: 'update_date desc',
			inputPlaceholder: '请输入搜索内容',
			tipShow: false // 是否显示顶部提示框
		};
	},
	async onShow() {
		console.log('onShow')
		this.keyword = getApp().globalData.searchText;
		getApp().globalData.searchText = '';
		setTimeout(() => {
			this.$refs.udb.loadData(
				{
					clear: true
				}
			);
		})
	},
	onLoad() {
		console.log('onLoad')
		
		this.where = `user_id==$env.uid`;
	},
	filters: {
		filterTime(t) {
			if (!t) return 0;
			if (t < 60) return "00:" + ((i = t) < 10 ? "0" + i : i);
			if (t < 3600) return "" + ((a = parseInt(t / 60)) < 10 ? "0" + a : a) + ":" + ((i = t % 60) < 10 ? "0" + i : i);
			if (3600 <= t) {
				var a, i, e = parseInt(t / 3600);
				return (e < 10 ? "0" + e : e) + ":" + ((a = parseInt(t % 3600 / 60)) < 10 ? "0" + a : a) + ":" + ((i = t % 60) < 10 ? "0" + i : i);
			}
		}
	},
	methods: {
		confirmDelete(id) {
			console.log('id', id)
			this.$refs.udb.remove(id)
		},
		searchClick(e) {
			//点击搜索框
			uni.hideKeyboard();
			uni.navigateTo({
				url: '/pages/media-list/search',
				animationType: 'fade-in'
			});
		},
		onqueryerror(e) {
			console.error(e);
		},
		detail(id, mid) {
			wx.navigateTo({
				url: `/pages/tuan/audio?id=${id}&mid=${mid}`
			});
		},

		load(data, ended) {
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
	background-color: #f4f5f7;
	min-height: 100%;
	height: auto;
}

.media-list {
	.item {
		width: 100%;
		display: flex;
		align-items: center;
		background: #fff;
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 8rpx;
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
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-bottom: 10rpx;
		width: 460rpx;
		line-height: 1em;
	}
	.bottom {
		display: flex;
		color: #666;
		font-size: 24rpx;
	}
	.radio-title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 460rpx;
	}
	.play-num {
		margin-right: 30rpx;
		display: flex;
		align-items: center;
		img {
			width: 24rpx;
			height: 24rpx;
			margin-right: 5rpx;
		}
	}
	.del-btn {
		font-size: 24rpx;
		margin-left: 10rpx;
		color: $color-rf;
		background: #FFF2F7;
		border-radius: 10rpx;
		text-align: center;
		padding: 10rpx 0;
		flex: 1;
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
