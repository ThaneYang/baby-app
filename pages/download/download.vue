<template>
	<view class="download">
		<image class="bg" :style="'height:' + imgHeight + 'rpx'" :src="imgUrl"></image>
		<view class="share-page-btn" v-if="btnText">
			<button @tap="goTo" :class="'btn-big bg-' + tempName">{{btnText}}</button>
			<button open-type="contact" :class="'btn-big bg-' + tempName">点击咨询客服</button>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				imgUrl: '',
				btnType: '',
				btnText: '',
				url: '',
				appId: '',
				imgHeight: '',
			}
		},
		onLoad() {
			this.getConfig();
		},
		methods: {
			goTo() {
				if (this.url && this.url.indexOf('http') >= 0) {
					uni.navigateTo({
						url: `/pages/common/webview/webview?url=${this.url}`
					})
				} else if (this.appId) {
					wx.navigateToMiniProgram({
						appId: this.appId,
						path: this.url,
						envVersion: "release",
						success(res) {
							// 打开成功
							console.log("打开成功");
						},
						fail(err) {
							console.log("打开失败", err);
						},
					});
				} else {
					uni.navigateTo({
						url: this.url
					})
				}
			},
			getConfig() {
				return db
					.collection('config')
					.get()
					.then(res => {
						console.log('返回结果', res);
						// audit
						let data = res.result.data && res.result.data[0] && res.result.data[0] || {}
						this.btnType = data.download.btnType
						this.btnText = data.download.btnText
						this.imgUrl = data.download.imgUrl
						this.appId = data.download.appId
						this.url = data.download.url
						this.imgHeight = data.download.imgHeight
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
.download {
	width: 100%;
	min-height: 100vh;
	padding-bottom: 120rpx;
	box-sizing: border-box;
	background: #F5F7FF;
	.bg {
		width: 100%;
		font-size: 0;
	}
	.share-page-btn {
	  padding: 0 40rpx;
		position: fixed;
		bottom: 40rpx;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		display: flex;
	}
	.btn-big {
		margin-right: 20rpx;
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>
