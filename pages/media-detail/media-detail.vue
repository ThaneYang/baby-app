<template>
	<view class="media-detail" v-if="!noData">
		<view class="tuan-detail-tit pd10_15">
			<div class="head-left"><img class="img" mode="aspectFill" :src="info.coverImgUrl" alt="" /></div>
			<div class="head-right">
				<view class="ft18 cl-main ftw600">
					{{ info.name }}
				</view>
				<view class="flex alend mt10">
					<div class="goods-info" style="margin-right: 20rpx;">
						<div style="display: flex;align-items:baseline;">
							<text class="text">{{ info.short_view_count }}</text>次播放
						</div>
					</div>
					<div class="goods-info">
						<div>共<text class="text">{{ info.radios.length }}</text>集</div>
					</div>
				</view>
			</div>
		</view>
		<view class="tuan-detail-content">
			<view class="tuan-detail-content-tab bd-bottom"><sub-tab :tabs="tabs" :selectIndex="selectIndex" @change="changeIndex"></sub-tab></view>
			<view v-if="selectIndex == 0" class="pd16_15">
				<view class="play-list">
					<view :class="key === logInfoData.radio_index ? 'item itema' : 'item'" v-for="(value, key) in info.radios" :key="key" @click="handleop(value, key)">
						<div class="left">
							<view class="title">{{ value.name }}<text class="sc" v-if="key === logInfoData.radio_index">{{ key === logInfoData.radio_index ? '上次听到' : '' }}</text></view>
							<div class="bottom">
								<img class="play-icon" src="http://yzwpic.weimayi.cn/miniapp/class/24gl-play.png" alt="" />
								<div class="play-text">
									<text class="text">{{ value.view_count | filterNum }} 次播放</text>
								</div>
							</div>
						</div>
						<div class="right">
							<img class="icon2" v-if="value.isLock && !isVip" src="http://yzwpic.weimayi.cn/miniapp/class/lock2.png" alt="" />
							<img class="icon" v-else src="http://yzwpic.weimayi.cn/miniapp/class/play3.png" alt="" />
						</div>
					</view>
				</view>
				<div style="padding: 20rpx 20rpx 0;">
					<!-- <div class="btn-big" :style="getBtnStyle" @click="goDownload">下载全部课程</div> -->
					<!-- <div class="btn-big" :style="getBtnStyle" @click="this.showShare = true">免费解锁本小说全部章节</div> -->
					<!-- <div :class="'btn-big bg-' + tempName" @click="goToProdct">购买整套课程</div> -->
					<div :class="'btn-big bg-' + tempName" @click="goToHelp">免费领取畅听卡</div>
				</div>
			</view>
			<view v-if="selectIndex == 1" class="pd16_15">
				<view class="ft14 cl-main lh20">
					<!-- <rich-text :nodes="info.media_desc"></rich-text> -->
					<view style="text-align: center;padding: 30rpx;" v-if="!info.media_desc">暂无内容</view>
					<u-parse v-else :content="info.media_desc" />
					<!-- <jyf-parser :html="info.media_desc"></jyf-parser> -->
				</view>
			</view>
		</view>
		<!-- <view class="mt24" style="margin:30upx 30upx 0 30upx;box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.04);">
			<home-banner :banners="banners"></home-banner>
		</view> -->
		<home-new></home-new>
		<view class="form-footer-h form-footer">
			<view class="form-footer-main pd10_15 flex alcenter space">
				<view class="flex alcenter space" style="margin-right: 30rpx;">
					<button open-type="share" class="form-footer-item mr15 text-center bbn">
						<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/share.png" alt="" />
						<view class="ft12 mt3" style="color:#333;">分享好友</view>
					</button>
					<button @tap="goShare" class="form-footer-item mr15 text-center bbn">
						<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/pic.png" alt="" />
						<view class="ft12 mt3" style="color:#333;">生成海报</view>
					</button>
					<button @tap="goHome" class="form-footer-item text-center bbn">
						<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/%E9%A6%96%E9%A1%B5.png" alt="" />
						<view class="ft12 mt3" style="color:#333;">更多课程</view>
					</button>
					<!-- <button class="form-footer-item text-center bbn" @click="goDownload">
						<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/downloadbtn.png" alt="" />
						<view class="ft12 mt3" style="color:#333;">下载课程</view>
					</button> -->
				</view>
				<view style="flex: 1">
					<button @click="goToProdct" v-if="info.goods_id" :class="'btn-big bg-' + tempName">购买完整课程</button>
					<button @click="goHome" v-else :class="'btn-big bg-' + tempName">收听更多精彩内容</button>
					<!-- <button v-if="info.isplay == 0" @click="buyAct" class="btn-big" style="width: 288rpx;" :style="getBtnStyle">¥{{ info.realPrice }}购买</button>
					<button v-if="info.isplay == 1" class="btn-big" style="width: 288rpx; color: #ffffff; background: #C0C0C0!important;">{{ isplaytext }}</button> -->
				</view>
			</view>
		</view>
		<div class="mask" v-if="showShare" @click="onClose"></div>
		<!-- <div class="van-popup" v-if="showShare">
			<div class="popup-content">
				<div class="title">解锁课程</div>
				<div class="content">
					<div class="val">生成海报，立即解锁该课程</div>
				</div>
				<button type="primary" class="btn2" @tap="goShare">生成海报</button>
			</div>
		</div> -->
		<div class="van-popup" v-if="showShare">
			<div class="van-close" @click="showShare = false"></div>
			<div class="popup-content">
				<div class="title">转发即可解锁该课程</div>
				<div class="content">
					<div class="val">可获得{{freeHours}}小时免费收听权限</div>
				</div>
				<div class="footer">
					<button open-type="share" :class="'btn-big bg-' + tempName">转发好友</button>
				</div>
			</div>
		</div>
	</view>
	<view class="media-detail" v-else>
		<rfNoData :isShow="true" :custom="true"></rfNoData>
	</view>
</template>

<script>
import subTab from '@/components/sub/tab.vue';
import rfNoData from '@/components/rf-no-data/index.vue';
// import jyfParser from '@/components/jyf-parser'
import uParse from '@/components/gaoyia-parse/parse.vue';
const db = uniCloud.database();
import {
	store,
	mutations
} from '@/uni_modules/uni-id-pages/common/store.js'

export default {
	data() {
		return {
			showShare: false,
			info: {
				short_view_count: '',
				unit: '',
				name: '',
				radios: []
			},
			freeHours: 24, // 免费小时
			selectIndex: 0,
			tabs: ['目录', '简介'],
			id: '',
			isplaytext: '已经购买',
			playIndex: this.$zaudio.playIndex, //当前播放的索引
			paused: this.$zaudio.paused, //当前是否暂停
			playinfo: this.$zaudio.playinfo, //当前播放的信息
			logInfoData: {}, // 播放记录信息存在数据库
			isVip: false, // 临时解锁
			isUserVip: false, // 是否是会员
			noData: false, // 没有找到这个ID的数据
		};
	},
	components: {
		subTab,
		uParse,
		rfNoData,
		// jyfParser
	},
	computed: {
		hasLogin() {
			return store.hasLogin
		},
		userInfo() {
			return store.userInfo
		},
	},
	async onLoad(options) {
		this.id = options.id;
		console.log('this.id', this.id);
		await this.getConfig();
		
		// 解锁之后，虽然数据库里user已经解锁，但是vuex里拿的是缓存的user信息，还是未解锁状态
		// 所以解锁之后先存到缓存里的shortfreeList，通过缓存来判断
		let arr = uni.getStorageSync('shortfreeList') || []
		arr.forEach((item, index) => {
			if (item.id == this.id) {
				// 小于24小时都算未超时
				// console.log('this.freeHours', this.freeHours)
				if ((new Date().getTime() - item.time) < this.freeHours * 60 * 60 * 1000) {
					// console.log('未超时')
					// isVip代表临时解锁的
					this.isVip = true
				} else {
					// console.log('超时删除')
					this.isVip = false
					arr.splice(index, 1)
					wx.setStorageSync('shortfreeList', arr)
				}
			}
		})
		
		// 去掉了永久解锁，所以这块不需要了
		// userInfo里没有freeList，这里的userInfo拿的是前端缓存里的userInfo
		// if (this.userInfo.freeList && this.userInfo.freeList.length > 0) {
		// 	this.userInfo.freeList.forEach((item) => {
		// 		if (item == this.id) {
		// 			// 为true代表可以免费收听
		// 			this.isVip = true
		// 		}
		// 	})
		// }
		console.log('hasLogin', this.hasLogin)
		if (this.hasLogin) {
			console.log('isUserVip', this.userInfo.isVip)
			this.isUserVip = this.userInfo.isVip || false
			// await this.getUserInfo() // 如果是会员，则这个接口也会返回isVip=true
		}
		console.log('是否能免费收听', this.isVip, this.isUserVip)
		await this.getDetail() // 通过isVip isUserVip = true来判断是否要解锁
	},
	async onShow() {
		console.log('onShow')
		// console.log('userInfo', this.userInfo)
		await this.getLog();
	},
	filters: {
		filterNum(val) {
			if (val > 10000) {
				return (val / 10000).toFixed(1) + '万';
			} else {
				return val;
			}
		},
		filterSize(val) {
			return (val / 1024 / 1024).toFixed(2);
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {
		// this.unlock()
		// console.log('分享解锁')
		// 临时解锁
		this.unlock2()
		return {
			title: `「贝贝听书」${this.info.name}`,
			path: `/pages/media-detail/media-detail?id=${this.id}`
		};
	},
	methods: {
		getUserInfo() {
			const userId = wx.getStorageSync('uni-id-pages-userInfo')._id;
			console.log('userId', userId)
			return uniCloud.callFunction({
					name: 'getUserInfo',
					data: {
						id: userId,
					}
				}).then(res => {
				console.log(res)
				let user = res.result
				// 未来如果加入vip，判断是否是vip，如果是则为true
				// 这里的isVip代表是会员
				this.isUserVip = user.isVip || false
				console.log('用户接口返回isVip', this.isUserVip)
			}).catch((err) => {
				console.log('getUserInfo请求失败')
			})
		},
		goToProdct() {
			wx.navigateTo({
				url: `/pages/product/product?id=${this.info.goods_id}`
			})
		},
		goToHelp() {
			wx.navigateTo({
				url: `/pages/member/help`
			})
		},
		getConfig() {
			return db
				.collection('config')
				.get()
				.then(res => {
					console.log('返回结果', res);
					// audit
					let data = res.result.data && res.result.data[0] && res.result.data[0] || {}
					this.freeHours = data.freeHours
				});
		},
		onClose() {
			console.log('close');
			this.showShare = false;
		},
		goDownload() {
			uni.navigateTo({
				url: '/pages/download/download'
			})
		},
		goShare() {
			this.showShare = false;
			let c1 = ''
			if (this.info.media_desc) {
				c1 = this.info.media_desc
			} else {
			  c1 = this.info.radios[0].name
			}
			let p = ''
			if (this.userInfo.avatar_file && this.userInfo.avatar_file.url) {
				p = this.userInfo.avatar_file.url
			}
			// c1 = '我是很长很长的一段文字，我是很长很长的一段文字，我是很长很长的一段文字，我是很长很长的一段文字，我是很长很长的一段文字，我是很长很长的一段文字，我是很长很长的一段文字'
			let n = this.info.name
			// n = '我是很长的标题，我是很长的标题，我是很长的标题，我是很长的标题，我是很长的标题'
			let l = this.info.coverImgUrl
			let u = this.userInfo.nickname || '贝贝听书'
			uni.navigateTo({
				url: `/pages/share/share?id=${this.id}&u=${u}&n=${n}&p=${p}&l=${l}&c1=${c1}`
			})
		},
		goHome() {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		},
		goList() {
			uni.navigateTo({
				url: '/pages/media-list/media-list'
			});
		},
		// 永久解锁
		unlock() {
			uniCloud.callFunction({
				name: 'unlock',
				data: {
					"id": this.id
				},
				success: (res) => {
					console.log('执行成功', res)
					uni.showToast({
						title: '解锁成功，赶快收听吧',
						icon: 'none',
						duration: 2500
					});
				},
				fail: () => {
					console.log('执行失败')
					uni.showToast({
						title: '解锁失败',
						icon: 'none'
					});
				}
			})
		},
		// 临时解锁
		unlock2() {
			// 已经是vip了不用再解锁
			if (this.isVip || this.isUserVip) {
				return false
			}
			this.showShare = false
			this.info.radios.forEach((item) => {
				item.isLock = false
			})
			
			let arr = wx.getStorageSync('shortfreeList') || []
			// let arr = [
			// 	{
			// 		id: 1,
			// 		time: new Date()
			// 	}
			// ]
			
			let obj = {
				id: this.id,
				time: new Date().getTime()
			}
			arr.push(obj)
			wx.setStorageSync('shortfreeList', arr)
			this.isVip = true
		},
		// 访问量存入数据库
		updateViewNum(index) {
			// 调用函数更新radios
			uniCloud
				.callFunction({
					name: 'updateViewNum',
					data: {
						index, // 更新数组中的第几项
						id: this.id
					}
				})
				.then(res => {
					console.log('savePage返回结果', res);
				});
		},
		getLog() {
			// 如果用户已登录，则查询播放记录
			if (this.hasLogin) {
				db.collection('media-log')
					.where({
						user_id: db.env.uid,
						goods_id: this.id
					})
					.get()
					.then(res => {
						console.log('log', res);
						let data = res.result.data;
						if (data && data.length > 0) {
							// 说明有播放记录，高亮显示上次播放的
							this.logInfoData = data[0];
						}
					});
			}
		},
		async handleop(item, mid) {
			console.log('真实在数据库中的数组序号', item.index);
			this.updateViewNum(item.index);
			if (this.hasLogin) {
				if (item.isLock && !(this.isVip || this.isUserVip)) {
					this.showShare = true
				} else {
					// #ifdef MP-WEIXIN
					await this.newSub()
					uni.navigateTo({
						url: `/pages/tuan/audio?id=${this.id}&mid=${mid}`
					});
					// #endif
					// #ifndef MP-WEIXIN
					uni.navigateTo({
						url: `/pages/tuan/audio?id=${this.id}&mid=${mid}`
					});
					// #endif
				}
			} else {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
				});
			}
		},
		// 订阅更新，用户同意或取消订阅，都进行下一步
		async newSub() {
			return new Promise(async (resolve, reject) => {
				// console.log(this.userInfo)
				// console.log('this.userInfo.subTime', this.userInfo.subTime)
				if(this.userInfo.subTime && (new Date(this.userInfo.subTime).getTime() > (new Date().getTime() - 15 * 24 * 60 * 60 * 1000))) {
					// 如果存在subTime并且小于15天，则不用重新订阅
					console.log('已订阅', new Date(this.userInfo.subTime))
					resolve('已订阅')
				} else {
					// 否则都需要订阅
					wx.requestSubscribeMessage({
					  tmplIds: ['ZiWhRy-NuctK4fZ7MPs4QoouerEMqd0o7hVm6p886-I', 'yIKi198v1J8EG3Qke4OiXEcOXm44ZMNkpyvo353nS-k', 'pVJ-iEVSivWDZLW0-JRjrzgcIEV0GbIgvzzp7coz8sU'],
					  success: async (res) => {
							console.log('res', res)
							if (res['ZiWhRy-NuctK4fZ7MPs4QoouerEMqd0o7hVm6p886-I'] === 'accept') {
								console.log('用户同意订阅')
								let res2 = await uniCloud.callFunction({
									name: 'updateUserSubTime'
								})
								// 更新到前端缓存
								mutations.setUserInfo({
								  ...res2.result
								})
								console.log('res2', res2)
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
		// 订阅之后再跳转
		sub(mid) {
			let openid = ''
			let userInfo = wx.getStorageSync('uni-id-pages-userInfo');
			console.log('userInfo', userInfo)
			if (userInfo) {
				openid = userInfo.wx_openid['mp-weixin']
			}
			db.collection('sendUser').where({
				openid
			}).get()
			.then((user) => {
				console.log('user', user)
				
				if (user.result.data.length === 0) {
					console.log('没有在数据库里')
					
					wx.requestSubscribeMessage({
					  tmplIds: ['ixIHYMljVgx4WdZUZ9B6q9alfyCSLwpD6eklXc0E2zI'],
					  success: (res) => {
							console.log('res', res)
							
							db.collection('sendUser')
								.add({
									openid
								})
								.then(res => {
									// res 为数据库查询结果
									console.log('数据返回结果', res);
									// wx.showToast({
									// 	title: '订阅成功'
									// })
									uni.navigateTo({
										url: `/pages/tuan/audio?id=${this.id}&mid=${mid}`
									});
								})
								.catch(err => {
									uni.navigateTo({
										url: `/pages/tuan/audio?id=${this.id}&mid=${mid}`
									});
									console.log(err.code); // 打印错误码
									console.log(err.message); // 打印错误内容
								});
						}
					})
				} else {
					// wx.showToast({
					// 	title: '您已订阅',
					// 	icon: 'none'
					// })
					uni.navigateTo({
						url: `/pages/tuan/audio?id=${this.id}&mid=${mid}`
					});
				}
			}).catch((err)=>{
				uni.navigateTo({
					url: `/pages/tuan/audio?id=${this.id}&mid=${mid}`
				});
			  console.log(err.code); // 打印错误码
			  console.log(err.message); // 打印错误内容
			})
		},
		getDetail() {
			uni.showLoading({
				title: '加载中'
			});
			uniCloud.callFunction({
				name: 'getDetail',
				data: {
					"id": this.id
				},
				success: (res) => {
					console.log('执行成功', res)
					uni.hideLoading();
					if (res.result) {
						this.noData = false
						this.info = res.result
						this.audiolist = this.info.radios;
						console.log('this.info', this.info)
						
						// 加锁是在云函数getDetail里加的
						// 如果是isVip则解锁
						if (this.isVip || this.isUserVip) {
							// 解锁列表每个章节
							this.audiolist.forEach((item) => {
								item.isLock = false
							})
						}
						// 如果是H5的则不要加锁
						// #ifdef H5
						this.audiolist.forEach((item) => {
							item.isLock = false
						})
						// #endif
						
						uni.setNavigationBarTitle({
							title: this.info.name
						});
					} else {
						this.noData = true
					}
				},
				fail: () => {
					console.log('失败')
					this.noData = true
					uni.hideLoading();
				}
			})
		},
		contactAct() {
			if (this.isLogin == false) {
				this.showLogin = true;
				this.nextStep = 'contact';
			} else {
				uni.navigateTo({
					url: '/pages/client/vipcard/adviser'
				});
			}
		},
		vipcard() {
			uni.navigateTo({
				url: '/pages/client/vipcard/index'
			});
		},
		buyAct() {
			if (this.info.price * 1 == 0) {
				uni.showToast({ title: '免费视频不需要购买', icon: 'none' });
				return false;
			}
			if (this.isLogin == false) {
				this.showLogin = true;
				this.nextStep = 'buy';
			} else {
				uni.setStorage({
					//缓存配置信息
					key: 'buydata',
					data: this.info
				});
				uni.navigateTo({
					url: '/pages/client/tuan/buy?id=' + this.id
				});
			}
		},
		changeIndex(index) {
			this.selectIndex = index;
		},
	}
};
</script>

<style lang="scss">
.media-detail {
	background: $page-color-base;
	box-sizing: border-box;
	padding-bottom: 160rpx;
}
.goods-info {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #777;
	line-height: 1em;
	.play-icon0 {
		width: 20rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}
	.text {
		font-weight: 700;
		font-size: 36rpx;
		margin: 0 5rpx;
		color: #333;
	}
}
.download-btn {
	height: 100rpx;
	line-height: 100rpx;
	color: $color-rf;
	text-align: center;
	font-size: 24rpx;
}
.play-list {
	.item {
		display: flex;
		border-bottom: 1px solid #e6e6e6;
		padding: 20rpx 0;
		justify-content: space-between;
		.title {
			font-size: 28rpx;
			line-height: 1.6;
			flex: 1;
		}
		.left {
			display: flex;
			flex-direction: column;
			flex: 1;
		}
		.play-icon {
			width: 20rpx;
			height: 20rpx;
			margin-right: 10rpx;
		}
		.play-icon2 {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}
		.bottom {
			font-size: 24rpx;
			color: #777;
			display: flex;
			align-items: center;
			margin-top: 15rpx;
		}
		.play-text {
			line-height: 1em;
			font-size: 24rpx;
		}
		.text {
			margin-right: 5rpx;
		}
		.right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			width: 100rpx;
		}
		.icon {
			width: 40rpx;
			height: 40rpx;
		}
		.icon2 {
			width: 45rpx;
			height: 45rpx;
		}
		@keyframes rotateicon {
		  from {transform: rotate(0deg);}
		  to {transform: rotate(360deg);}
		}
		.icon3 {
			width: 45rpx;
			height: 45rpx;
			animation-name: rotateicon;
			animation-duration: 2s;
			animation-iteration-count: infinite;
			animation-timing-function: linear;
		}
	}
	.itema {
		color: $color-rf;
	}
	.sc {
		font-size: 22rpx;
		margin-left: 10rpx;
		color: $color-rf;
		background: #FFF2F7;
		border-radius: 6rpx;
		padding: 2rpx 10rpx;
		white-space: nowrap;
	}
}
.tuan-detail-tit {
	width: 100%;
	background: #ffffff;
	position: relative;
	display: flex;
	.img {
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}
	.head-left {
		font-size: 0;
	}
	.head-right {
		flex: 1;
	}
}
.tuan-detail-content-tab {
	height: 82rpx;
}
.tuan-detail-content {
	/* min-height: calc(100vh - 600rpx); */
	background: #ffffff;
	margin-bottom: 20rpx;
}

.mask {
	position: fixed;
	width: 100%;
	height: 100vh;
	left: 0;
	top: 0;
	z-index:98;
	background: rgba(0, 0, 0, .4);
}
.van-popup {
	background: none;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 0rpx -4rpx 16rpx 0rpx rgba(0,0,0,0.04);
	z-index: 99;
}

.van-close {
	width: 100rpx;
	height: 100rpx;
	background: url('http://yzwpic.weimayi.cn/miniapp/class/close2.png') center no-repeat;
	background-size: 50rpx 50rpx;
	position: absolute;
	right: 0rpx;
	top: 0rpx;
}

.popup-content {
	width: 600rpx;
	background: #fff;
	border-radius: 32rpx;
	overflow: hidden;
	.title {
		font-size: 32rpx;
		padding: 80rpx 40rpx 30rpx;
		font-weight: 600;
		text-align: center;
	}
	.content {
		display: flex;
		padding: 0 40rpx;
		font-size: 32rpx;
		margin-bottom: 40rpx;
		line-height: 1.8;
	}
	.key {
		font-weight: 600;
		flex: 1;
		margin-right: 10rpx;
		white-space: nowrap;
	}
	.val {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
	}
	.footer {
		display: flex;
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.btn1 {
		font-size: 28rpx;
		flex: 1;
		border-radius: 32rpx;
		&::after {
			display: none;
		}
	}
	.btn2 {
		font-size: 32rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex: 1;
		border-radius: 80rpx;
		background: $color-rf;
		margin: 0 40rpx 40rpx;
		&::after {
			display: none;
		}
	}
}
</style>
