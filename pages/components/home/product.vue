<template>
	<view class="home-product" v-if="list && list.length > 0">
		<view class="pd16_15">
			<view class="flex alcenter space" style="margin-bottom: 20upx;">
				<text class="ft16 ftw600 cl-main">热销课程</text>
				<!-- <div class="ft14 cl-notice pd10" @tap="more">换一批</div> -->
				<navigator url="/pages/product/product-list"><view class="ft14 cl-notice">更多</view></navigator>
			</view>
			<div class="grid">
				<div class="grid-item" v-for="(item, j) in list" :key="j" @tap="detail(item)">
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
		</view>
	</view>
</template>

<script>
const db = uniCloud.database()
export default {
	data() {
		return {
			// defalutImg: require('@/static/default-img.jpeg'),
			list: []
		};
	},

	created() {
		this.getHotList()
	},
	filters: {
		filterNum(val) {
			return (val / 100).toFixed(2)
		}
	},
	methods: {
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
		getHotList() {
			db.collection('opendb-mall-goods')
				.where({
					is_on_sale: true
				})
				.orderBy("total_sell_count", "desc")
				.get()
				.then((res) => {
					console.log('res', res)
					this.list = res.result.data || []
				})
		},
	}
};
</script>

<style lang="scss" scoped>
.home-product {
	background: #fff;
	border-radius: 16rpx;
	box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
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
</style>
