<template>
	<view>
		<view class="pd16_15">
			<view class="flex alcenter space" style="margin-bottom: 20upx;">
				<view class="flex alcenter">
					<!-- <image style="width: 40rpx;height: 40rpx;" :src="statics.integralMallCat[0]"></image> -->
					<!-- <text class="ft16 ftw600 cl-main ml15">热门推荐</text> -->
					<text class="ft16 ftw600 cl-main">热门推荐</text>
				</view>
				<!-- <navigator url="/pages/media-list/media-list"><view class="ft14 cl-notice">更多</view></navigator> -->
			</view>
			<view class="media-list">
				<view v-for="(value,key) in list" class="item" :key="key" @click="goToDetail(value._id)">
					<image mode="aspectFill" class="img" :src="value.banner[0] && value.banner[0].url"></image>
					<div class="info">
						<div class="title">{{value.name}}</div>
						<div class="bottom">
							<div class="play-num">{{value.total_view_count | filterNum}}次播放</div>
							<div class="count">共{{value.radios.length}}集</div>
						</div>
					</div>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const db = uniCloud.database()
export default {
	data() {
		return {
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
		getHotList() {
			db.collection('media')
				.where({
					is_on_sale: true
				})
				.orderBy("add_date", "desc")
				.get()
				.then((res) => {
					// console.log('res', res)
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
.media-list {
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
