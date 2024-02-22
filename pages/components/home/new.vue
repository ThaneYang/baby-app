<template>
	<view class="home-new">
		<view class="pd16_15">
			<view class="flex alcenter space" style="margin-bottom: 20upx;">
				<text class="ft16 ftw600 cl-main">最近更新</text>
				<div class="ft14 cl-notice pd10" @tap="more">换一批</div>
			</view>
			<view class="media-list">
				<view v-for="(value,key) in list" class="item" :key="key" @click="goToDetail(value._id)">
					<image mode="aspectFill" class="img" :src="(value.banner[0] && value.banner[0].url) || value.source[0].icon[0].url"></image>
					<div class="info">
						<div class="title">{{value.name}}</div>
						<div class="bottom">
							<div class="play-num">{{value.total_view_count | filterNum}}次播放</div>
							<div class="count">共{{value.radios.length}}集</div>
						</div>
					</div>
				</view>
			</view>
			<!-- 横向 -->
			<!-- <view class="media-list">
				<view v-for="(value,key) in list" class="item" :key="key" @click="goToDetail(value)">
					<img mode="aspectFill" class="img" :src="value.imgSrc" />
					<div class="info">
						<div class="title">{{value.name}}</div>
						<div class="bottom">
							<div class="play-num">{{value.score | filterNum}}</div>
							<div class="count">共{{value.bookChapter.length}}集</div>
						</div>
					</div>
				</view>
			</view> -->
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
			if (val > 10000) {
				return (val / 10000).toFixed(1) + '万'
			} else {
				return val
			}
		}
	},
	methods: {
		more() {
			this.list = []
			this.getHotList()
		},
		getHotList() {
			// 改为随机读取10条
			db.collection('media,media-category')
				.aggregate()
				.match({
				  is_on_sale: true
				})
				.sample({
					size: 5
				})
				.end()
				.then((res) => {
					// console.log('res**', res)
					this.list = res.result.data || []
				})
		},
		goToDetail(id) {
			wx.navigateTo({
				url: `/pages/media-detail/media-detail?id=${id}`
			})
		}
	}
};
</script>

<style lang="scss">
.home-new {
	background: #fff;
	border-radius: 16rpx;
	box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
}
.media-list {
	// min-height: 700rpx;
	.item {
		width: 100%;
		display: flex;
		background: #fff;
		padding: 20rpx 0;
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
		-webkit-line-clamp:2;
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
</style>
