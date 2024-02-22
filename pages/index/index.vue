<template>
	<view class="home-page">
		<!-- 标题栏和状态栏占位符 -->
		<!-- #ifndef H5 -->
		<statusBar></statusBar>
		<!-- #endif -->
		<!-- <view class="titleNview-placing">贝贝听书</view> -->
		<view class="home-header pd5_15">
			<view class="home-mendian flex alcenter space plr15 cl-w9" @click="search()" v-if="!isAudit">
				<view style="width: calc(100% - 80rpx);">
					<view class="flex alcenter" style="width: calc(100% - 80rpx);">
						<img src="http://yzwpic.weimayi.cn/miniapp/class/location.png" class="icon1" alt="" />
						<text class="text-over ft14" style="width: calc(100% - 60rpx);">{{ searchKey }}</text>
					</view>
				</view>
				<img src="http://yzwpic.weimayi.cn/miniapp/class/search.png" class="icon2" alt="" />
			</view>
			<view class="mt15" v-if="banners.length > 0"><home-banner :banners="banners"></home-banner></view>
		</view>
		<view class="integral-mall-main plr15" style="margin-top: 20upx;">
			<view class="integal-mall-menu flex pt15 pb15 mb15" v-if="!isAudit">
				<view class="col2 text-center" @click="linkTo" data-link="/pages/media-list/media-list?order=0">
					<view><image style="width: 90rpx; height: 90rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/explore_lesson.21cb4b42.png"></image></view>
					<view class="ft14 ftw600 mt6">排行榜</view>
				</view>
				<view class="col2 text-center" @click="linkTo" data-link="/pages/media-log/media-log">
					<view><image style="width: 90rpx; height: 90rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/explore_special.be53e9e8.png"></image></view>
					<view class="ft14 ftw600 mt6">最新收听</view>
				</view>
				<!-- /pages/client/integral/role -->
				<view class="col2 text-center" @click="linkTo" data-link="/pages/media-list/media-list?order=1">
					<view><image style="width: 90rpx; height: 90rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/explore_note.61eeae33.png"></image></view>
					<view class="ft14 ftw600 mt6">最近更新</view>
				</view>
			</view>
			
			<!-- <view class="mb15" v-if="!isAudit"><home-new></home-new></view> -->
			
			<view class="mb15" v-if="!isAudit"><home-product></home-product></view>

			<div class="grid-list">
				<div class="grid-box" v-for="(cate, i) in cateList" :key="i" v-if="cate.children.length > 0">
					<div class="head" v-if="isAudit">
						<div class="title">
							<!-- <image class="icon" style="width: 40rpx;height: 40rpx;" :src="statics.integralMallMenus[0]"></image> -->
							{{ cate.name }}
						</div>
					</div>
					<div class="head" @tap="goToList(i)" v-else>
						<div class="title">
							<!-- <image class="icon" style="width: 40rpx;height: 40rpx;" :src="statics.integralMallMenus[0]"></image> -->
							{{ cate.name }}
						</div>
						<div class="more">更多</div>
					</div>
					<div class="grid">
						<div class="grid-item" v-for="(item, j) in cate.children" :key="j" @tap="goToDetail(item)">
							<div class="top" v-if="isAudit"><img class="img" mode="aspectFill" :src="item.imgSrc" alt="" /></div>
							<div class="top" v-else><img class="img" mode="aspectFill" :src="(item.banner[0] && item.banner[0].url) || item.source[0].icon[0].url" alt="" /></div>
							<div class="info">{{ item.name }}</div>
						</div>
					</div>
				</div>
			</div>
		</view>
		<!-- <view class="plr15" v-if="!isAudit"><home-default></home-default></view> -->
		<block v-if="showLog && !isAudit"><home-log :log="log" @hideLog="hideLog"></home-log></block>
		<!-- <com-footer model="index"></com-footer> -->
	</view>
</template>
<script>
import statusBar from '@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar';
const db = uniCloud.database();
import {
	mapGetters
} from 'vuex';
export default {
	components: {
		statusBar
	},
	data() {
		return {
			showLog: false,
			navLock: false,
			searchKey: '',
			datasa: [],
			dataconfig: [],
			banners: [],
			datainfo: [],
			dataindex: [],
			mbgColor: '',
			cateList: [],
			hotList: [],
			isAudit: true,
			vipKey: '',
			log: {
				// id: '',
				// radio_index: '',
				// radio_title: '',
				// title: '',
			},
		};
	},
	onShareAppMessage() {
		return {
			title: `欢迎来到贝贝听书`,
			path: '/pages/index/index'
		};
	},
	onShareTimeline(e) {},
	async onLoad(e) {
		console.log('e', e)
		await this.getConfig();
		if (e.k) {
			console.log('hasLogin', this.hasLogin)
			if (this.hasLogin) {
				// 说明是从公众号跳转过来的，则赠送会员
				if (e.k === this.vipKey || e.k === 'vip') {
					let userId = wx.getStorageSync('uni-id-pages-userInfo')._id;
					uniCloud
						.callFunction({
							name: 'setVip',
							data: {
								id: userId
							}
						})
						.then(res => {
							console.log('res*', res)
							if (res.result.isVip) {
								wx.showModal({
									// 新的版本下载失败
									title: ` 领取成功`,
									content: res.result.successText,
									confirmText: '确定',
									showCancel: false,
									success (res) {
									}
								});
							} else {
								// 返回isVip= false,代表领取过了,不能再领取，这个暂不实现
								wx.showModal({
									title: `领取失败`,
									content: res.result.successText,
									confirmText: '确定',
									showCancel: false,
									success (res) {
									}
								});
							}
						})
				} else {
					wx.showModal({
						title: ` 领取失败`,
						content: '口令失效，请关注微信公众号「喜柚XIYOU」重新领取',
						confirmText: '确定',
						showCancel: false,
						success (res) {
						}
					});
				}
			} else {
				wx.navigateTo({url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'})
			}
		}

		// uni.setNavigationBarTitle({
		// 	title: '贝贝听书'
		// });
		// this.mbgColor = '#FFB62E';
		uni.setNavigationBarColor({
			frontColor: '#000000',
			backgroundColor: '#ffffff'
		});
	},
	onShow() {
		if (wx.getStorageSync('log')) {
			this.showLog = true;
			this.log = wx.getStorageSync('log')
		}
	},
	computed: {
		...mapGetters({
			hasLogin: 'user/hasLogin',
		}),
	},
	methods: {
		hideLog() {
			// console.log('*********隐藏')
			this.showLog = false;
		},
		getBanner() {
			return db
				.collection('opendb-banner')
				.where({
					status: true
				})
				.orderBy('sort', 'asc')
				.get()
				.then(res => {
					// console.log('banner', res);
					this.banners = res.result.data || [];
				});
		},
		getConfig() {
			return db
				.collection('config')
				.get()
				.then(res => {
					// console.log('返回结果', res);
					// audit
					let data = (res.result.data && res.result.data[0] && res.result.data[0]) || {};
					this.isAudit = data.isAudit;
					this.searchKey = data.searchKey;
					this.vipKey = data.vipKey
					if (this.isAudit) {
						this.getCategoryList2();
					} else {
						this.getCategoryList();
						this.getBanner();
					}
				});
		},
		async getCategoryList() {
			return uniCloud
				.callFunction({
					name: 'getCategoryList'
				})
				.then(res => {
					// console.log('返回结果', res);
					res.result.data.forEach(item => {
						item.children = [];
					});
					this.cateList = res.result.data || [];
					this.cateList.forEach(async item => {
						item.children = await this.fetchList(item);
					});
					// console.log('this.cateList', this.cateList);
				});
		},
		async getCategoryList2() {
			// console.log('getCategoryList2');
			let obj = {
				_id: '00',
				code: '00',
				name: '个人博客',
				children: []
			};
			this.cateList.push(obj);
			this.cateList.forEach(async item => {
				item.children = await this.fetchList2();
			});
			// console.log('this.cateList', this.cateList);
		},
		fetchList(category) {
			// console.log('category', category);
			const goods = db.collection('media').getTemp() // 注意结尾的方法是getTemp，对goods表过滤得到临时表
			const source = db.collection('media-category').field('code,icon').getTemp() 
			
			return db.collection(goods, source)
			.where({
				tag_id: category.code,
				is_on_sale: true
			})
			.limit(9)
			.get()
			.then(res => {
				// console.log('res**', res)
				return res.result.data || [];
			})
			// return db
			// 	.collection('media')
			// 	.where({
			// 		tag_id: category.code,
			// 		is_on_sale: true
			// 	})
			// 	.get()
			// 	.then(res => {
			// 		console.log('fetchList res', res);
			// 		return res.result.data || [];
			// 	});
		},
		// 获取文章
		fetchList2() {
			return db
				.collection('opendb-news-articles')
				.get()
				.then(res => {
					return res.result.data || [];
				});
		},
		goToList(index) {
			wx.navigateTo({
				url: `/pages/media-list/media-list?category=${index + 1}`
			});
		},
		goToDetail(item) {
			if (item.tag_id == '00') {
				wx.navigateTo({
					url: `/pages/list/detail?id=${item._id}&title=${item.name}`
				});
			} else {
				wx.navigateTo({
					url: `/pages/media-detail/media-detail?id=${item._id}`
				});
			}
		},
		search() {
			uni.navigateTo({
				url: `/pages/media-list/search?searchKey=${this.searchKey}`
			});
		},
		linkTo(e) {
			if (this.isLogin == false) {
				this.showLogin = true;
			} else {
				let link = e.currentTarget.dataset.link;
				uni.navigateTo({
					url: link
				});
			}
		},
		linkTo2(e) {
			if (this.isLogin == false) {
				this.showLogin = true;
			} else {
				let link = e.currentTarget.dataset.link;
				uni.switchTab({
					url: link
				});
			}
		}
	}
};
</script>

<style lang="scss">
.home-page {
	min-height: 100vh;
	background: url('http://yzwpic.weimayi.cn/miniapp/class/bg_homepage_top.png') $page-color-base center top no-repeat;
	background-size: 750rpx 326rpx;
	box-sizing: border-box;
	padding-bottom: 100rpx;
}
.grid-list {
	box-sizing: border-box;
	.grid-box {
		background: #fff;
		border-radius: 16rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
	}
	.head {
		display: flex;
		padding: 30rpx 0;
		align-items: center;
		justify-content: space-between;
	}
	.more {
		font-size: 28rpx;
		color: #999;
	}
	.title {
		font-size: 32rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		.icon {
			margin-right: 20rpx;
		}
	}
	.grid {
		display: flex;
		flex-wrap: wrap;
	}
	.grid-item {
		display: flex;
		flex-direction: column;
		width: 150rpx;
		margin-right: 90rpx;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		&:nth-child(3n) {
			margin-right: 0;
		}
	}
	.img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
		// box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
	}
	.info {
		font-size: 24rpx;
	}
}
.home-header {
	width: 100%;
	position: relative;
	border-radius: 0rpx 0rpx 48rpx 48rpx;
}
.home-main {
	width: 100%;
	position: relative;
	margin-top: -156rpx;
	padding: 0 30rpx;
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
.integral-mall-header {
	position: relative;
	height: 320rpx;
}
.integral-mall-header .bg {
	width: 100%;
	height: 320rpx;
}
.integral-mall-header .main {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 320rpx;
}
.swiper-integral {
	height: 32rpx;
	width: 100%;
}
.integral-mall-main {
	position: relative;
	margin-top: -104rpx;
}
.integal-mall-menu {
	width: 100%;
	background: #ffffff;
	border-radius: 16rpx;
	box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
}
.integral-tuan-l {
	width: 240rpx;
	height: 180rpx;
	background: #f2f2f2;
	border-radius: 16rpx;
}

.integral-mall-coupon {
	height: 408rpx;
	width: 330rpx;
	background: #ffffff;
	position: relative;
	border-radius: 16rpx;
	overflow: hidden;
}
.integral-mall-coupon .top {
	padding: 32rpx 40rpx 24rpx 40rpx;
	border-bottom: 2rpx dashed #fec675;
}
.integral-mall-coupon .y-l,
.integral-mall-coupon .y-r {
	width: 20rpx;
	height: 20rpx;
	border-radius: 10rpx;
	background: #f5f6fa;
	position: absolute;
	z-index: 2;
	top: 284rpx;
}
.integral-mall-coupon .y-l {
	left: -10rpx;
}
.integral-mall-coupon .y-r {
	right: -10rpx;
}
.integral-mall-coupon .coupon-value {
	width: 100%;
	height: 180rpx;
	position: relative;
}
.integral-mall-coupon .coupon-value image {
	width: 100%;
	height: 180rpx;
}
.integral-mall-coupon .coupon-value .num {
	width: 100%;
	height: 64rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
}
.integral-mall-goods {
	width: 100%;
	height: 200rpx;
	background: #f2f2f2;
	border-radius: 16upx;
}
.titleNview-placing {
	height: var(--status-bar-height);
	line-height: var(--status-bar-height);
	box-sizing: content-box;
}
</style>
