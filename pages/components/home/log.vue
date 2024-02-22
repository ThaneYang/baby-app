<template>
	<view class="log">
		<div class="left" @click="detail(log.id, log.radio_index)">继续播放：</div>
		<div class="info" @click="detail(log.id, log.radio_index)">
			<div class="title">{{log.title}}</div>
			<div class="sub-title">{{log.radio_title}}</div>
		</div>
		<img class="play" @click="detail(log.id, log.radio_index)" src="http://yzwpic.weimayi.cn/miniapp/class/play-log.png" alt="" />
		<div class="close" @click.stop="close">
			<img src="http://yzwpic.weimayi.cn/miniapp/class/close-log.png" alt="" />
		</div>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		props: ['log'],
		computed: {
			...mapGetters({
				hasLogin: 'user/hasLogin'
			})
		},
		data() {
			return {
				// log: {
				// 	id: '',
				// 	radio_index: '',
				// 	radio_title: '',
				// 	title: '',
				// }
			}
		},
		// created() {
		// 	this.log = wx.getStorageSync('log') || {}
		// },
		methods: {
			detail(id, mid) {
				// this.$emit('hideLog')
				// 如果用户已登录，则查询播放记录
				// console.log('this.hasLogin', this.hasLogin)
				wx.navigateTo({
					url: `/pages/tuan/audio?id=${id}&mid=${mid}`
				});
			},
			close() {
				wx.removeStorageSync('log')
				this.$emit('hideLog')
			}
		}
	}
</script>

<style lang="scss">
.log {
	display: flex;
	height: 100rpx;
	border-radius: 10rpx;
	background: rgba(0, 0, 0, .6);
	color: #fff;
	position: fixed;
	bottom: 10rpx;
	left: 30rpx;
	width: 690rpx;
	box-sizing: border-box;
	padding: 10rpx 0 10rpx 20rpx;
	align-items: center;
	.left {
		font-size: 28rpx;
		width: 140rpx;
	}
	.info {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.title {
		font-size: 28rpx;
		width: 380rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.sub-title {
		font-size: 24rpx;
		color: #e7e7e7;
		width: 380rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.play {
		width: 50rpx;
		height: 50rpx;
	}
	.close {
		width: 80rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		img {
			width: 30rpx;
			height: 30rpx;
		}
	}
}
</style>
