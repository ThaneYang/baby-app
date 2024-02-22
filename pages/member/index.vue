<template>
	<view class="user-page">
		<!--头部-->
		<view class="user-section" :class="'bg-' + tempName">
			<image class="bg" :src="'/static/user-bg.png'"></image>
			<!--用户信息-->
			<view class="user-info-box" v-if="hasLogin" @tap="navTo('/pages/ucenter/userinfo/userinfo')">
				<view
					class="portrait-box"
				>
					<image
						class="portrait"
						:src="userInfo.avatar_file && userInfo.avatar_file.url || '/static/missing-face.png'"
					></image>
					<div class="user-info">
						<text class="username">
							{{
								userInfo.nickName ||
								userInfo.nickname ||
								userInfo.username ||
									'微信用户'
							}}
						</text>
						<view class="integral" v-if="userId">ID: {{ userId.substring(0, 8) }}</view>
					</div>
					<view class="setting-btn">设置</view>
				</view>
			</view>
			<view class="user-info-box" v-else @tap="navTo('/pages/ucenter/userinfo/userinfo')">
				<view
					class="portrait-box"
				>
					<image
						class="portrait"
						:src="userInfo.avatar_file && userInfo.avatar_file.url || '/static/missing-face.png'"
					></image>
					<div class="user-info">
						<text class="username">
							点击登录
						</text>
					</div>
				</view>
			</view>
			<!--vip信息-->
			<!--  #ifdef MP-WEIXIN -->
			<view class="vip-card-box" @tap="navTo('/pages/member/help')" v-if="!isAudit">
				<view class="b-btn">
					{{ userInfo.isVip | filterMemberLevel }}
				</view>
				<view class="tit" v-if="userInfo.isVip">
					<img class="iconhuiyuan" src="http://yzwpic.weimayi.cn/miniapp/class/vip.png" />
					 免费畅听至：{{ userInfo.vipEndTimeText }}
				</view>
				<view class="tit" v-else>
					<img class="iconhuiyuan" src="http://yzwpic.weimayi.cn/miniapp/class/vip.png" />
					 点击免费获取畅听卡
				</view>
				<text class="e-m">{{appName}} 版权所有</text>
			</view>
			<!--  #endif -->
			<!--  #ifndef MP-WEIXIN -->
			<view class="vip-card-box" @tap="handleImg" v-if="!isAudit">
				<view class="b-btn">
					{{ userInfo.isVip | filterMemberLevel }}
				</view>
				<view class="tit">
					<img class="iconhuiyuan" src="http://yzwpic.weimayi.cn/miniapp/class/vip.png" />
					 点击关注公众号“喜柚XIYOU”
				</view>
				<text class="e-m">{{appName}}</text>
			</view>
			<!--  #endif -->
		</view>
		<!-- 个人中心 内容区-->
		<view
			class="cover-container"
			:style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" :src="'/static/arc.png'"></image>
			<view class="list">
				<button class="li" @tap="goToOrder" v-if="!isAudit && payType === 1">
					<view class="text">订单列表</view>
					<image class="to" src="/static/to.png"></image>
				</button>
				<button class="li" @tap="navTo('/pages/media-log/media-log')" v-if="!isAudit">
					<view class="text">最近收听</view>
					<image class="to" src="/static/to.png"></image>
				</button>
				<!-- <button class="li" @tap="scanAd">
					<view class="text">看完整视频，享24小时全场免费阅读</view>
					<image class="to" src="/static/to.png"></image>
				</button> -->
				<!--  #ifdef MP-WEIXIN -->
				<button class="li" @tap="sub" v-if="!isAudit">
					<view class="text">有新课提醒我</view>
					<image class="to" src="/static/to.png"></image>
				</button>
				<!--  #endif -->
				<button class="li" @tap="navTo('/pages/member/help')" v-if="!isAudit">
					<view class="text">免费领取畅听卡</view>
					<image class="to" src="/static/to.png"></image>
				</button>
				<!--  #ifdef MP-WEIXIN -->
				<button class="li" open-type="contact">
					<view class="text">联系客服</view>
					<image class="to" src="/static/to.png"></image>
				</button>
				<!--  #endif -->
			</view>
			<div class="tishi" v-if="!isAudit && showCopyRight">
				<div class="popup-content" @tap="handleImg">
					<!-- <div class="title">温馨提示</div> -->
					<div class="content">
						<div>因内容有版权风险，为防止失联，请关注微信公众号“喜柚XIYOU”</div>
					</div>
					<button :class="'btn2 bg-' + tempName">显示二维码</button>
					<div style="text-align: center;font-size: 28rpx;color: #999;margin-bottom: 20rpx;">长按二维码关注公众号</div>
				</div>
			</div>
			<view class="recommend" v-if="showRecommend">
				<view class="recommend-head">
					<view class="bd-line"></view>
					<view class="title">热门应用</view>
					<view class="bd-line"></view>
				</view>
				<view class="goods-list">
					<view v-for="(value,key) in miniappList" class="item" :key="value._id" v-if="!!value.isOpen" @click="handleminiapp(value)">
						<img mode="aspectFit" class="img" :src="value.imgUrl" />
						<!-- <image mode="aspectFit"></image> -->
						<div class="info">
							<div class="title">{{value.name}}</div>
							<div class="bottom">
								<div class="play-num">{{value.content}}</div>
							</div>
						</div>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
/**
 * @des 个人中心
 *
 * @author thane 269392251@qq.com
 * @date 2023-06-14 11:41
 * @copyright 2019
 */
const db = uniCloud.database(); //代码块为cdb
const app = getApp();
let startY = 0, moveY = 0, pageAtTop = true;
// import {
// 	mapGetters,
// 	mapMutations
// } from 'vuex';
export default {
	data() {
		return {
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			// userInfo: {},
			loading: true,
			appName: '贝贝听书',
			userId: '',
			openid: '',
			// hasAuth: false, // 不需要处理是否授权的逻辑
			isAudit: true,
			showCopyRight: false,
			payType: '',
			miniappList: [],
			qrUrl: '',
			showRecommend: false
		};
	},
	filters: {
		filterMemberLevel(val) {
      if (!val) return '普通用户';
			return '免费续期';
		},
	},
	// 小程序分享
	onShareAppMessage() {
		return {
			title: `欢迎来到${this.appName}`,
			path: '/pages/index/index'
		};
	},
	async onShow() {
		console.log('hasLogin', this.hasLogin)
		// console.log(this.$store.getters.themeColor)
		// if (wx.getStorageSync('uni-id-pages-userInfo')) {
		if (this.hasLogin) {
			// #ifdef H5
			// let openid = wx.getStorageSync('uni-id-pages-userInfo').wx_openid['mp-weixin'];
			let userId = wx.getStorageSync('uni-id-pages-userInfo')._id;
			// #endif
			// #ifndef H5
			// let openid = wx.getStorageSync('uni-id-pages-userInfo').wx_openid['mp-weixin'];
			let userId = wx.getStorageSync('uni-id-pages-userInfo')._id;
			// #endif
			
			if (userId) {
				this.userId = userId
			}
			// if (openid) {
			// 	this.openid = openid
			// }
			// 初始化数据
			await this.initData();
		}
	},
	computed: {
		userInfo() {
			console.log('store.userInfo', store.userInfo)
			return store.userInfo
		},
		hasLogin(){
			return store.hasLogin
		},
		// ...mapGetters({
		// 	hasLogin: 'user/hasLogin',
		// }),
	},
	methods: {
		// 数据初始化
		async initData() {
			// this.hasAuth = this.$mStore.getters.hasAuth;
			// 设置底部导航栏
			// uni.setTabBarStyle({
			// 	selectedColor: this.tempColor,
			// 	borderStyle: 'white'
			// });
			// 设置底部导航栏
			// this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
			// 	uni.setTabBarItem({
			// 		index,
			// 		selectedIconPath
			// 	});
			// });
			// await this.getUserInfo()
			await this.getConfig()
			await this.getMiniapp()
		},
		getUserInfo() {
			// let openid = this.openid;
			return uniCloud.callFunction({
				name: 'getUserInfo',
				data: {
					id: this.userId,
				}
			}).then(res => {
				console.log(res)
				this.userInfo = res.result
			})
		},
		getMiniapp() {
			return db.collection('miniapp')
				.get()
				.then(res => {
					// res 为数据库查询结果
					console.log('miniapp数据返回结果', res);
					this.miniappList = res.result.data || [];
					this.miniappList.forEach((item) => {
						if (item.isOpen) {
							this.showRecommend = true
						}
					})
				})
				.catch(err => {
					console.log(err.code); // 打印错误码
					console.log(err.message); // 打印错误内容
				});
		},
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
					console.log('config返回结果', res);
					// audit
					let data = (res.result.data && res.result.data[0] && res.result.data[0]) || {};
					this.isAudit = data.isAudit;
					this.qrUrl = data.qrUrl
					this.payType = data.payType
					this.showCopyRight = data.showCopyRight
				});
		},
		scanAd() {
			// 在合适的位置打开广告
			console.log('this.rewardedVideoAd', this.rewardedVideoAd)
			if (this.rewardedVideoAd) {
				this.rewardedVideoAd.show().catch(err => {
					// 失败重试
					this.rewardedVideoAd
						.load()
						.then(() => this.rewardedVideoAd.show())
						.catch(err => {
							console.log('激励视频 广告显示失败');
							wx.showToast({
								title: '暂无广告，请稍候再试',
								icon: 'none',
								duration: 2000
							});
						});
				});
			} else {
				wx.showToast({
					title: '暂无广告，请稍候再试',
					icon: 'none',
					duration: 2000
				});
			}
		},
		// saveTicket() {
		// 	let openid = this.openid;
		// 	uniCloud
		// 		.callFunction({
		// 			name: 'saveTicket',
		// 			data: {
		// 				openid,
		// 				num: 1
		// 			}
		// 		})
		// 		.then(res => {
		// 			console.log('返回结果', res);
		// 			// this.ticket = res.result.ticket || 0
		// 			this.getTicket()
		// 		});
		// },
		// getTicket() {
		// 	let openid = this.openid;
		// 	uniCloud
		// 		.callFunction({
		// 			name: 'getTicket',
		// 			data: {
		// 				openid
		// 			}
		// 		})
		// 		.then(res => {
		// 			console.log('返回结果', res);
		// 			this.ticket = res.result.ticket || 0
		// 		});
		// },
		// 订阅更新，用户同意或取消订阅，都进行下一步
		async newSub() {
			return new Promise(async (resolve, reject) => {
				// let userInfo = {}
				// userInfo.openid = this.openid;
				let res1 = await db.collection('uni-id-users').where({
					_id: this.userId
				}).get()
				// console.log('res1', res1)
				let user = res1.result.data[0]
				
				if(user.subTime && (new Date(user.subTime).getTime() > new Date().getTime() - 30 * 24 * 60 * 60 * 1000)) {
					// 如果存在subTime并且小于一个月，则不用重新订阅
					console.log('已订阅', new Date(user.subTime))
					resolve('已订阅')
				} else {
					// 否则都需要订阅
					wx.requestSubscribeMessage({
					  tmplIds: ['F0ekZmSNB02adZ_--lRYssF60WGBNPeou18pHIeq7FI', 'AA63g3laJefeDC2FCT9MNNnsJWzhSpk-n7kz_YxsvWY', 'oUf9k3_Cyd2Z4XV81NgGmSlnoQUwoYKDbgCmYWZ5gxc'],
					  success: async (res) => {
							console.log('res', res)
							if (res['F0ekZmSNB02adZ_--lRYssF60WGBNPeou18pHIeq7FI'] === 'accept') {
								// console.log('用户同意订阅')
								userInfo.subTime = new Date().getTime()
								let res2 = await uniCloud.callFunction({
									name: 'updateUserSubTime',
									data: userInfo
								})
								// console.log('res2', res2)
								resolve('订阅成功')
							} else {
								// 用户取消订阅，也让他可以收藏
								resolve('取消订阅')
							}
						},
						fail: (err) => {
							// 订阅报错
							reject(err)
						}
					})
				}
			})
		},
		// 订阅更新
		async sub() {
			let res = await this.newSub()
			wx.showToast({
				title: res
			})
		},
		handleminiapp(item) {
			console.log(item);
			if (item.type === 'img') {
				let urls = [];
				console.log(item.url);
				urls.push(item.url);
				wx.previewImage({
					current: item.url, // 当前显示图片的http链接
					urls // 需要预览的图片http链接列表
				});
			} else if (item.type === 'sub')  {
				this.sub()
			} else if (item.h5) {
				let url = item.h5;
				url = encodeURIComponent(url);
				wx.navigateTo({
					url: `/pages/wm/wm?url=${url}`
				});
			} else if (item.appid) {
				wx.navigateToMiniProgram({
					appId: item.appid,
					//小程序appid
					path: item.path,
					//跳转关联小程序app.json配置里面的地址
					//**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）
					envVersion: 'release'
				});
			}
		},
		// 统一跳转接口,拦截未登录路由
		navTo(route) {
			if (!route) return;
			console.log('this.hasLogin', this.hasLogin)
			console.log(Boolean(Object.keys(uni.getStorageSync('userInfo')).length))
			if (!this.hasLogin) {
				wx.navigateTo({url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'})
			} else {
				wx.navigateTo({url: route})
			}
		},
		goToOrder() {
			let url = "http://xymall.weimayi.cn/pages/member/index"
			uni.navigateTo({
				url: `/pages/common/webview/webview?url=${url}`
			})
		},
		/**
		 *  会员卡下拉和回弹
		 *  1.关闭bounce避免ios端下拉冲突
		 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
		 *    transition设置0.1秒延迟，让css来过渡这段空窗期
		 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
		 */
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}
			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		},
	}
};
</script>
<style lang="scss" scoped>
.user-page {
	min-height: 100vh;
	box-sizing: border-box;
	background-color: $page-color-base;
	.user-section {
		height: 520upx;
		padding: 50upx 30upx 0;
		box-sizing: border-box;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
			opacity: 0.84;
		}
		.user-info-box {
			height: 200upx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 1;
			justify-content: space-between;

			.portrait-box {
				display: flex;
				align-items: center;

				.portrait {
					width: 130upx;
					height: 130upx;
					border: 5upx solid #fff;
					border-radius: 50%;
				}
				
				.user-info {
					display: flex;
					flex-direction: column;
					margin-left: 20upx;
					
					.username {
						font-size: $font-lg;
						color: $color-white;
						margin-bottom: 10upx;
					}
					.integral {
						flex: 1;
						padding: 0 20upx;
						line-height: 35rpx;
						color: #fff;
						background-color: rgba(255, 255, 255, .3);
						border-radius: 20upx;
						font-size: 24upx;
					}
				}

				button {
					background-color: transparent;
					font-size: $font-lg + 6upx;
					color: $font-color-dark;
					border: none;
				}

				button::after {
					border: none;
				}
			}
		}
		.setting-btn {
			position: absolute;
			top: 70rpx;
			right: 0rpx;
			padding: 0 40upx;
			line-height: 50rpx;
			color: #fff;
			background-color: rgba(255, 255, 255, .3);
			border-radius: 50upx;
			font-size: 24upx;
		}

		.vip-card-box {
			display: flex;
			flex-direction: column;
			color: #f7d680;
			height: 250upx;
			background: url('/static/vip-card.png');
			background-size: 100% 100%;
			border-radius: 16upx 16upx 0 0;
			overflow: hidden;
			position: relative;
			padding: 20upx 24upx;
			.b-btn{
				position: absolute;
				right: 24upx;
				top: 24upx;
				width: 132upx;
				height: 40upx;
				text-align: center;
				line-height: 40upx;
				font-size: 22upx;
				color: #36343c;
				border-radius: 20px;
				background: linear-gradient(to left, #f9e6af, #ffd465);
				z-index: 1;
			}
			.tit {
				font-size: $font-base + 2upx;
				color: #f7d680;
				margin-bottom: 28upx;
				display: flex;
				align-items: center;
				.iconhuiyuan {
					width: 32rpx;
					height: 32rpx;
					margin-right: 5upx;
				}
				.iconfont {
					color: #f6e5a3;
					font-size: $font-base + 2upx;
				}
			}
		}
	}

	.cover-container {
		// margin-top: -150upx;
		// padding: 0 30upx 100upx;
		margin-top: -170upx;
		padding: 0 30upx 160upx;
		position: relative;
		background-color: $page-color-base;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}

		.promotion-center {
			background: #fff;
			margin-bottom: 20upx;
			/*分类列表*/
			.category-list {
				width: 100%;
				padding: 0 0 30upx 0;
				border-bottom: solid 2upx #f6f6f6;
				display: flex;
				flex-wrap: wrap;
				.category {
					width: 33.3%;
					margin-top: 50upx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					.img {
						width: 100%;
						display: flex;
						justify-content: center;

						.iconfont {
							font-size: $font-lg + 24upx;
						}
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 24upx;
						color: #3c3c3c;
					}
					.share-btn {
						height: 142upx;
						text-align: left;
						background: none;
						padding: 0;
						margin: 0;
					}

					.share-btn:after {
						border: none;
						border-radius: none;
					}
				}
			}
		}

		.tj-sction {
			@extend %section;
			display: flex;

			.tj-item {
				@extend %flex-center;
				flex: 1;
				flex-direction: column;
				margin: 30upx 0;
				font-size: $font-sm;
				color: #75787d;
				/*border-right: 2upx solid rgba(0, 0, 0, 0.2);*/
			}

			/*.tj-item:last-child {*/
			/*border-right: none;*/
			/*}*/
			.num {
				font-size: $font-base;
			}

			.red {
				color: $base-color;
			}
		}

		.order-section {
			@extend %section;
			padding: 28upx 0;

			.order-item {
				@extend %flex-center;
				width: 120upx;
				height: 120upx;
				border-radius: 10upx;
				font-size: $font-sm;
				color: $font-color-dark;
				position: relative;
			}

			.badge {
				position: absolute;
				top: 0;
				right: 4upx;
			}

			.iconfont {
				font-size: 48upx;
			}

			.icon-shouhoutuikuan {
				font-size: 44upx;
			}
		}

		.history-section {
			background: #fff;
			margin-bottom: $spacing-sm;
			.h-list-history {
				margin: 0;
				border-radius: 10upx;
				white-space: nowrap;
				background-color: $page-color-base;
				.h-item-history {
					background-color: $color-white;
					display: inline-block;
					font-size: $font-sm;
					color: $font-color-base;
					width: 180upx;
					margin: $spacing-sm $spacing-sm 0 0;
					border-radius: 10upx;
					position: relative;
					top: 0;
					overflow: hidden;
					.h-item-img {
						width: 180%;
						height: 200upx;
						border-top-left-radius: 12upx;
						border-top-right-radius: 12upx;
						border-bottom: 1upx solid rgba(0, 0, 0, 0.01);
					}
					.tag {
						position: absolute;
						border-top-left-radius: 12upx;
						left: 0;
						right: 0;
						width: 60upx;
						height: 60upx;
					}
					.h-item-text {
						font-size: $font-sm;
						margin: $spacing-sm 4upx;
					}
				}
			}
			.no-foot-print {
				text-align: center;
				padding: 48upx 0;

				.no-foot-print-icon {
					font-size: $font-lg + 2upx;
					margin-right: 10upx;
				}
			}
			.share-btn {
				height: 102upx;
				text-align: left;
				background: none;
				padding: 0;
				margin: 0;
			}

			.share-btn:after {
				border: none;
				border-radius: none;
			}
		}
	}
	.list {
		// border-bottom: solid 26upx #f1f1f1;
		background: #fff;
		border-radius: 32rpx;
		margin: 0 0 30rpx;
		box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0,0,0,0.04);
		.li {
			width: 100%;
			height: 100upx;
			margin: 0 auto;
			padding: 0 30rpx;
			border-bottom: solid 1upx #f1f1f1;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-sizing: border-box;
			background: none;
			&:last-child {
				border-bottom: none;
			}
			&::after {
				display: none;
			}
			&.noborder {
				border-bottom: 0;
			}
			.icon {
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;
				image {
					width: 50upx;
					height: 50upx;
					display: block;
				}
			}
			.text {
				width: 100%;
				color: #666;
				text-align: left;
				font-size: 28rpx;
			}
			.to {
				flex-shrink: 0;
				width: 24upx;
				height: 24upx;
			}
		}
	}
	.recommend {
		border-radius: 32rpx;
		background: #fff;
		padding: 30rpx;
		margin: 0 0 30rpx;
		box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0,0,0,0.04);
		.recommend-head {
			margin: 20rpx 0 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.bd-line {
				width: 120rpx;
				height: 2rpx;
				background: #E4E6ED;
			}
			.title {
				margin: 0 30rpx;
				font-size: 28rpx;
				color:#2E2F33;
			}
		}
		
		.goods-list {
			.item {
				width: 100%;
				display: flex;
				background: #fff;
				padding: 20rpx 0;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				border-bottom: solid 1upx #f1f1f1;
				&:last-child {
					border-bottom: none;
				}
			}
			.img {
				width: 120rpx;
				height: 120rpx;
				margin-right: 30rpx;
				border-radius: 120rpx;
			}
			.info {
				flex: 1
			}
			.title {
				color: #000;
				font-size: 28rpx;
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
			}
		}
	}
	.tishi {
		border-radius: 32rpx;
		background: #fff;
		padding: 30rpx;
		margin: 0 0 30rpx;
		box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0,0,0,0.04);
		.popup-content {
			background: #fff;
			border-radius: 32rpx;
			overflow: hidden;
			.title {
				font-size: 32rpx;
				padding: 30rpx 40rpx 20rpx;
				font-weight: 600;
				text-align: center;
			}
			.content {
				display: flex;
				padding: 0 40rpx;
				font-size: 28rpx;
				margin-bottom: 20rpx;
				line-height: 1.8;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
			.img {
				width: 300rpx;
				height: 300rpx;
			}
			.btn2 {
				font-size: 32rpx;
				height: 80rpx;
				line-height: 80rpx;
				flex: 1;
				border-radius: 80rpx;
				margin: 0 40rpx 20rpx;
				&::after {
					display: none;
				}
			}
		}
	}
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	justify-content: space-around;
	display: flex;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}
</style>
