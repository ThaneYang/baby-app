<template>
	<view class="help">
		<div class="title">畅听卡有什么用？</div>
		<div class="ctx">领取「贝贝听书」畅听卡，即可全场免费收听</div>
		<div class="title" v-if="vipOneMonth">活动说明</div>
		<div class="ctx" v-if="vipOneMonth">每月限领一次，快来领取吧</div>
		<div class="title">领取方式</div>
		<div class="ctx"><text class="b">1、</text>点击下方【查看二维码】，长按二维码图片，关注微信公众号<text class="b">【喜柚XIYOU】</text></div>
		<!-- <img class="img" mode="aspectFit" src="http://yzwpic.weimayi.cn/miniapp/logo/%E5%85%B3%E6%B3%A8%E5%96%9C%E6%9F%9A1.jpeg" alt=""> -->
		<div class="ctx"><text class="b">2、</text>在公众号【聊天窗口】回复<text class="b">“贝贝”</text>即可免费领取<text class="b">「贝贝听书」畅听卡</text>。</div>
		<button :class="'btn2 bg-' + tempName" @tap="handleImg">查看二维码</button>
	</view>
</template>

<script>
	const db = uniCloud.database(); //代码块为cdb
	export default {
		data() {
			return {
				qrUrl: '',
				vipOneMonth: false, //每月限领一次
			}
		},
		onShow() {
			this.getConfig()
		},
		methods: {
			handleImg() {
				let urls = [];
				urls.push(this.qrUrl);
				wx.previewImage({
					current: this.qrUrl, // 当前显示图片的http链接
					urls // 需要预览的图片http链接列表
				});
			},
			getConfig() {
				return db
					.collection('config')
					.get()
					.then(res => {
						let data = (res.result.data && res.result.data[0] && res.result.data[0]) || {};
						this.qrUrl = data.qrUrl
						this.vipOneMonth = data.vipOneMonth
						console.log(this.qrUrl)
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
.help {
	background: #fff;
	padding: 0 50rpx 50rpx;
	box-sizing: border-box;
	min-height: 100vh;
	overflow: auto;
	.img {
		width: 100%;
	}
	.title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		margin-top: 60rpx;
	}
	.b {
		font-weight: bold;
	}
	.ctx {
		font-size: 32rpx;
		line-height: 1.8;
		margin-bottom: 20rpx;
	}
	.btn2 {
		font-size: 32rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex: 1;
		border-radius: 80rpx;
		margin: 30rpx 40rpx;
		&::after {
			display: none;
		}
	}
}
</style>
