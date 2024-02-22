<template>
	<view>
		<swiper class="home-swiper-banner" indicator-color="rgba(255, 255, 255, 0.3)" indicator-active-color="#FFFFFF" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
			<swiper-item v-for="(item,index) in banners" :key="index">
				<view @tap="goTo(item)">
				<image :src="item.bannerfile.path" style="border-radius: 16rpx"></image>
				</view>
			</swiper-item>
			
		</swiper>
	</view>
</template>

<script>
	export default{
		props: ['banners'],
		data(){
			return {
				banners1:[],
			}
		},
		methods: {
			goTo(item) {
				if (item.appid) {
					wx.navigateToMiniProgram({
						appId: item.appid,
						//小程序appid
						path: item.open_url,
						//跳转关联小程序app.json配置里面的地址
						//**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）
						envVersion: "release",
					});
				} else if (item.open_url && item.open_url.indexOf('http') >= 0) {
					uni.navigateTo({
						url: `/pages/common/webview/webview?url=${item.open_url}`
					})
				} else if (item.open_url) {
					uni.navigateTo({
						url: item.open_url
					});
				} else {
					// 预览图片
					let urls = [];
					urls.push(item.qrUrl);
					wx.previewImage({
						current: item.qrUrl, // 当前显示图片的http链接
						urls // 需要预览的图片http链接列表
					});
				}
			}
		}
	}
</script>

<style>
	.home-swiper-banner{
		height: 290rpx;
		box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
		border-radius: 16rpx;
		overflow: hidden;
	}
	.home-swiper-banner image{
		width: 100%;
		height: 290rpx;
	}
</style>
