<template>
	<view class="audio-page">
		<zaudio theme="theme1" @show="handleShow"></zaudio>
		<view class="tuan-detail-content">
			<view class="tuan-detail-content-tab bd-bottom"><sub-tab :tabs="tabs" :selectIndex="selectIndex"
					@change="changeIndex"></sub-tab></view>
			<view v-if="selectIndex == 0" class="pd16_15">
				<view class="play-list">
					<view :class="value.src === playinfo.src ? 'item itema' : 'item'" v-for="(value, key) in info.radios"
						:key="key" @click="handlePlay(value, key)">
						<div class="left">
							<view class="title">{{ value.name }}<text class="sc"
									v-if="key === logInfoData.radio_index">{{ key === logInfoData.radio_index ? '上次听到' : '' }}</text>
							</view>
							<div class="bottom">
								<img class="play-icon" src="http://yzwpic.weimayi.cn/miniapp/class/24gl-play.png" alt="" />
								<div class="play-text">
									<text class="text">{{ value.view_count | filterNum }} 次播放</text>
								</div>
							</div>
						</div>
						<div class="right">
							<img class="icon2" v-if="value.isLock && !isVip" src="http://yzwpic.weimayi.cn/miniapp/class/lock2.png"
								alt="" />
							<block v-else>
								<img class="icon3" src="http://yzwpic.weimayi.cn/miniapp/class/live-play1.png"
									v-if="value.src === playinfo.src" alt="" />
								<img class="icon" v-else src="http://yzwpic.weimayi.cn/miniapp/class/play3.png" alt="" />
							</block>
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
				<view class="play-list">
					<view class="item" v-for="(value, key) in info.files" :key="key" @click="openFile(value, key)">
						<div class="left">
							<view class="title">{{ value.name }}</view>
							<div class="bottom">
								<img class="play-icon2" src="http://yzwpic.weimayi.cn/miniapp/class/file.png" alt="" />
								<div class="play-text">
									<text class="text">{{ value.size | filterSize }} MB</text>
								</div>
							</div>
						</div>
					</view>
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
						<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/%E9%A6%96%E9%A1%B5.png"
							alt="" />
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
		<!-- <view class="demo" v-if="id==-10000">
			<button @click="seek" size="mini">跳转到200</button>
			<button @click="asyncSetAudio" size="mini">异步设置音频</button>
			<button @click="reset" size="mini">覆盖音频</button>
			<button @click="add" size="mini">添加音频</button>
			<button @click="setRender" size="mini">渲染第2首</button>
			<button @click="willStop(10)" size="mini">注册5秒后暂停事件</button>
			<button @click="removeStop" size="mini">卸载5秒后暂停事件</button>
			<button @click="logPlaying('log')" size="mini">注册播放时打印事件</button>
			<button @click="offPlaying('log')" size="mini">卸载播放时打印事件</button>
			<button @click="stepPlay(20)" size="mini">快进20s</button>
			<button @click="stepPlay(-20)" size="mini">快退20s</button>
		</view> -->
	</view>
</template>

<script>
	const db = uniCloud.database();
	import zaudio from '@/components/uniapp-zaudio/zaudio';
	import subTab from '@/components/sub/tab.vue';
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		components: {
			zaudio: zaudio,
			subTab
		},
		data() {
			return {
				showShare: false,
				//audiolist: this.$zaudio.audiolist, //当前音频列表
				playIndex: this.$zaudio.playIndex, //当前播放的索引
				paused: this.$zaudio.paused, //当前是否暂停
				playinfo: this.$zaudio.playinfo, //当前播放的信息
				logInfo: {}, // 播放器的播放记录信息
				logInfoData: {}, // 播放记录信息存在数据库
				audiolist: [],
				freeHours: 6, // 免费小时
				id: '',
				mid: 0,
				info: {},
				isLogin: false,
				showLogin: false,
				autoplay: false,
				playbtn: true,
				selectIndex: 0,
				tabs: ['目录'],
				nextStep: '',
				datasa: [],
				dataconfig: [],
				dda: '',
				price: '',
				banners: [],
				isplaytext: '已经购买',
				needJumpTime: false, // 是否需要跳到指定位置
				count: 0, // 计数器
				isVip: false, // 临时解锁
				isUserVip: false, // 是否是会员
			};
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

		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin() {
				return store.hasLogin
			},
		},

		async onLoad(option) {
			console.log('onLoad', option);
			// this.$zaudio.stop();
			//注意: 不同的回调方法, 相同的业务函数方法名, 不会相互影响;

			// 这段不能隐藏，否则小程序音频浮窗关闭，会出bug
			this.$zaudio.on('stop', 'aaa', () => {
				console.log('我是强制暂停或关闭小程序音频浮窗触发的');
				// 这里不能直接赋值给{}，需要是响应式的
				this.$zaudio.playinfo = Object.assign(this.playinfo, {
					current: '',
					current_value: 0,
					duration: '',
					duration_value: 0,
					singer: '',
					title: '',
					src: '',
				})
			});

			this.$zaudio.on('seek', 'aaa', (time) => {
				console.log('进度拖动A', time);
			});
			//注意: 相同的回调方法, 且相同的业务函数方法名, 只作用于第一次注册的业务
			// this.$zaudio.on('seek', 'aaa', function(time){
			// 	console.log('进度拖动B', time)
			// })
			if (option.id) {
				this.id = option.id;
			}
			if (option.mid) {
				// mid章节id
				// 刚进页面的mid，不代表当前播放的就是mid，因为在这个页面也可以切换下一章
				this.mid = option.mid;
			}
			await this.getConfig();

			// 解锁之后会存到缓存里的shortfreeList，通过缓存来判断
			let arr = uni.getStorageSync('shortfreeList') || []
			arr.forEach((item, index) => {
				if (item.id == this.id) {
					// 小于24小时都算未超时
					if ((new Date().getTime() - item.time) < this.freeHours * 60 * 60 * 1000) {
						console.log('未超时')
						// isVip不仅代表会员，还代表临时解锁的
						this.isVip = true
					} else {
						console.log('超时删除')
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
			// 			this.isVip = true
			// 		}
			// 	})
			// }
			// if (this.userInfo.isVip) {
			// 	this.isVip = true
			// }
			// console.log('是否免费播放', this.isVip)
			// console.log('当前是否暂停', this.$zaudio.paused)
			if (this.hasLogin) {
				this.isUserVip = this.userInfo.isVip || false
				// await this.getUserInfo() // 如果是会员，则这个接口也会返回isVip=true
			}
			await this.getDetail() // 通过isVip=true来判断是否要解锁
			// 前提条件用户已登录,并且点击播放的音频是有播放记录的
			// 则查询播放记录，跳转到上一次播放节点
			await this.getLog()
			await this.handlerUpdate()
			console.log('是否能免费收听', this.isVip || this.isUserVip)
		},
		async onShow() {
			console.log('onShow当前播放的索引', this.playIndex);
			// console.log('this.$zaudio', this.$zaudio);
		},
		onHide() {
			console.log('onHide');
			//卸载不需要的业务和获取播放状态的业务,提高页面性能
			// this.$zaudio.syncStateOff('page-index-get-state');
			// this.$zaudio.off('seek', 'aaa');
			// this.$zaudio.off('stop', 'aaa');
			// this.$zaudio.off('playing');
		},
		onUnload() {
			console.log('onUnload');
			// 退出页面也正常播放
			// this.$zaudio.stop();
			this.$zaudio.syncStateOff('page-index-get-state');
			this.$zaudio.loading = false;
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			// 临时解锁
			this.unlock2()
			return {
				title: `「贝贝听书」${this.info.name}`,
				path: `/pages/media-detail/media-detail?id=${this.id}`,
				imageUrl: `${this.info.coverImgUrl}`
			}
		},
		methods: {
			openFile(val) {
				let extname = val.extname.toLowerCase()
				if (extname === 'jpg' || extname === 'png' || extname === 'jpeg') {
					let urls = []
					urls.push(val.fileID)
					wx.previewImage({
						current: val.fileID, // 当前显示图片的http链接
						urls // 需要预览的图片http链接列表
					})
				} else {
					wx.downloadFile({
						// 示例 url，并非真实存在
						url: val.path,
						success: (res) => {
							const filePath = res.tempFilePath
							wx.openDocument({
								filePath: filePath,
								success: (res) => {
									console.log('打开文档成功')
								}
							})
						}
					})
				}
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
			getUserInfo() {
				const userId = wx.getStorageSync('uni-id-pages-userInfo')._id;
				return uniCloud.callFunction({
					name: 'getUserInfo',
					data: {
						id: userId,
					}
				}).then(res => {
					console.log(res)
					// 查询已读章节
					let user = res.result
					// 未来如果加入vip，判断是否是vip，如果是则为true
					// 这里的isVip代表是会员
					this.isUserVip = user.isVip || false
					console.log('用户接口返回isVip', this.isUserVip)
				}).catch((err) => {
					console.log('getUserInfo请求失败')
				})
			},
			handleShow(data) {
				// console.log('data', data)
				if (data) {

				}
				this.showShare = data
			},
			handlerUpdate() {
				//实时渲染当前的播放状态
				// this.$zaudio.syncRender();
				//实时获取当前播放状态 audiolist,
				this.$zaudio.syncStateOn('page-index-get-state', ({
					playIndex,
					paused,
					playinfo,
					renderinfo
				}) => {
					// this.audiolist = audiolist;
					this.playIndex = playIndex;
					this.paused = paused;
					// console.log('*renderinfo', renderinfo);
					// console.log('*renderinfo.isLock', renderinfo.isLock);
					// if (renderinfo.isLock) {
					// 	this.showShare = true
					// }
					// 获取缓存里需要跳转的进度，当用户点击播放的时候，则进行跳转
					if (wx.getStorageSync('seekStorage')) {
						this.$zaudio.seek(wx.getStorageSync('seekStorage'))
						wx.removeStorageSync('seekStorage')
					}
					// console.log('*playinfo', playinfo);
					// console.log('*playinfo singer', playinfo.singer);
					// console.log('*paused', paused);
					// 当A音频正在播放，这时候打开另一个B音频播放页面，点击播放，因为onload已经执行过了，还是A的id，导致更新音频日志的时候传的参数还是A的id
					if (playinfo.singer) {
						this.id = playinfo.singer
					}
					this.playinfo = playinfo;
					// this.logInfo = playinfo; // 记录播放信息
					this.count = this.count + 1
					// 每隔15秒，记录一次播放日志
					if (this.count >= 10 && !this.paused) {
						console.log('执行一次更新播放记录')
						// 更新播放记录
						this.updatePlayingLog()
						this.count = 0
					}
					// 非必须
					// let next = this.audiolist[this.playIndex]
					// // console.log('playinfo', playinfo)
					// // console.log('this.isVip', this.isVip)
					// // 自动播放到下一首的时候，如果不是免费，则需要在这里拦截
					// if (next && next.isLock && !this.isVip) {
					// 	console.log('音频锁定暂停播放！！！')
					// 	this.showLock = true
					// 	this.showShare = true
					// 	this.$zaudio.stop();
					// }
				});
			},
			getConfig() {
				return db
					.collection('config')
					.get()
					.then(res => {
						// console.log('返回结果', res);
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
			seek() {
				console.log(this.$zaudio);
				this.$zaudio.stepPlay(70);
			},
			getLog() {
				// 如果用户已登录，则查询播放记录
				return new Promise((resolve, reject) => {
					db.collection('media-log')
						.where({
							user_id: db.env.uid,
							goods_id: this.id
						})
						.get()
						.then(res => {
							let logData = res.result.data;
							console.log('播放记录', logData)
								
							if (logData && logData.length > 0) {
								// 一个人一个课程只有一条记录
								console.log('找到这个人在这个课程的播放记录');
								console.log('*播放记录里的索引', logData[0].radio_index)
								console.log('*当前要播放的索引', this.mid)
								this.logInfoData = logData[0];
								if (logData[0].radio_index === Number(this.mid)) {
									console.log('播放记录里的索引=当前要播放的索引，则跳转', logData[0].current_value)
									this.current_value = logData[0].current_value
									console.log('快进到', this.current_value)
									wx.setStorageSync('seekStorage', this.current_value)
									// this.$zaudio.seek(this.current_value)
								}
								// H5网页不能自动播放，浏览器的限制
								// #ifndef H5
								this.handlePlay(this.audiolist[this.mid], this.mid);
								// #endif
							} else {
								console.log('没有找到这个人在这个课程的播放记录')
								console.log('新增播放记录')
								// #ifndef H5
								this.handlePlay(this.audiolist[this.mid], this.mid);
								// #endif
								this.addPlayingLog()
							}
							resolve()
								
						});
				})
			},
			// 这个只在第一次刚进页面的时候执行
			async getDetail() {
				console.log('getDetail');
				uni.showLoading({
					title: '加载中'
				});
				return new Promise((resolve, reject) => {
					uniCloud.callFunction({
						name: 'getDetail',
						data: {
							"id": this.id
						},
						success: async (res) => {
							console.log('getDetail执行成功', res)
							// // #ifdef H5
							// res.result.radios.forEach((item) => {
							// 	item.isLock = false
							// })
							// // #endif
							uni.hideLoading();
							this.info = res.result
							this.audiolist = this.info.radios;
							// console.log('this.$zaudio.playinfo.src', this.$zaudio.playinfo.src)

							if (this.info.files && this.info.files.length > 0) {
								this.tabs.push('文稿')
							}

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
							// 实时渲染当前的播放状态
							this.$zaudio.syncRender();
							console.log('当前播放的索引', this.playIndex)
							console.log('进入的索引', this.mid)
							console.log('this.audiolist', this.audiolist)

							// 如果背景播放的音频和当前要播放的音频是同一个，则不快进，stepPlay是快进，不是跳转
							// if (this.$zaudio.playinfo.src === this.audiolist[this.mid].src) {
							// 	console.log('背景播放的音频和当前要播放的音频是同一个，则不快进')
							// } else {
							// 	console.log('快进')
							// 	// this.stepPlay(this.current_value);
							// }

							// 设置音频数据
							this.$zaudio.setAudio(this.audiolist);
							//渲染第几首音频
							this.$zaudio.setRender(this.mid);

							//this.removeStop();
							this.$zaudio.off('playing', 'recharge');

							uni.setNavigationBarTitle({
								title: this.info.name
							});
							resolve()
						},
						fail: () => {
							uni.hideLoading();
							console.log('getDetail失败')
							reject()
						}
					})
				})
			},
			// 点击列表音频播放
			handlePlay(item, index) {
				//播放或暂停
				// console.log('handlePlay index', index)
				// console.log('handlePlay item', item)
				// console.log('handlePlay this.paused', this.paused)
				// 如果音频在播放中，并且当前播放的，和想要播放的是同一个音频，则不暂停
				if (!this.paused && (this.playinfo.src === item.src)) {
					console.log('播放的和想要播放的是同一个音频')
					return false
				}
				this.updateViewNum(index)
				if (item && item.isLock && !(this.isVip || this.isUserVip)) {
					// console.log('this.showShare=true')
					this.showShare = true
				} else {
					console.log('页面的播放或暂停', this.$zaudio, '索引', index)
					this.$zaudio.operate(index);
				}
			},

			// 临时解锁
			unlock2() {
				console.log('unlock2', this.playIndex, this.mid)
				// 已经是vip了不用再解锁
				if (this.isVip || this.isUserVip) {
					return false
				}
				this.showShare = false
				this.audiolist.forEach((item) => {
					item.isLock = false
				})

				//实时渲染当前的播放状态
				// this.$zaudio.syncRender();
				// 设置音频数据
				// this.$zaudio.setAudio(this.audiolist);
				console.log('this.playIndex', this.playIndex)
				//渲染第几首音频
				this.$zaudio.setRender(this.playIndex);
				// 设置当前播放信息
				// this.$zaudio.setPlayinfo(this.audiolist[this.playIndex])
				// this.$zaudio.playinfo = Object.assign(this.playinfo, this.audiolist[this.playIndex]) 

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
				setTimeout(() => {
					wx.showModal({
						title: `恭喜您，成功解锁该课程`,
						content: `获得${this.freeHours}小时免费收听权限，快去收听吧`,
						confirmText: '确定',
						showCancel: false,
						success: (res) => {}
					});
				}, 2000)
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
						// console.log('savePage返回结果', res);
					});
			},
			reset() {
				let data = [{
					src: 'https://96.f.1ting.com/local_to_cube_202004121813/96kmp3/2020/08/21/21a_zj/01.mp3',
					title: '二人转',
					singer: '作者333',
					coverImgUrl: 'https://img.1ting.com/images/special/374/s300_2f06b17427718e01e54be1cfe462f3e0.jpg'
				}];
				this.$zaudio.setAudio(data);
			},
			add() {
				let data = [{
					src: 'https://96.f.1ting.com/local_to_cube_202004121813/96kmp3/jn/12.jlhg/8.zhg/2.mp3',
					title: '天边',
					singer: '作者222',
					coverImgUrl: 'https://img.1ting.com/images/special/377/s300_4631dc844ab6429b6bc6fe4ccdc6ed6f.jpg'
				}];
				this.$zaudio.updateAudio(data);
			},
			//异步加载音频并渲染
			asyncSetAudio() {
				let data = [{
					src: 'https://96.f.1ting.com/local_to_cube_202004121813/96kmp3/zzzzzmp3/2014iSep/15F/15xwsk/21.mp3',
					title: '蓝莲花',
					singer: '许巍',
					coverImgUrl: 'https://img.1ting.com/images/special/358/s100_6d9c9a3f9f67fa76b041561ff0042ae4.jpg'
				}];

				uni.showLoading();
				setTimeout(() => {
					this.$zaudio.setAudio(data);
					this.$zaudio.setRender(0); //setRender: 用于渲染zaudio, 具体查看文档
					uni.hideLoading();
				}, 1500);
			},
			setRender() {
				this.$zaudio.setRender(1);
			},
			willStop(mrseek) {
				console.log(this.info.isplay);
				if (this.info.isplay == 0) {
					this.$zaudio.on('playing', 'recharge', info => {
						if (info.current_value > mrseek) {
							this.$zaudio.stop();
							let this_ = this;
							uni.showModal({
								title: '温馨提示',
								content: '没权限听当前音频',
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
					});
				}
			},

			removeStop() {
				this.$zaudio.off('playing', 'recharge');
				this.$zaudio.operate();
			},

			//新增播放记录
			addPlayingLog() {
				let info = this.$zaudio.playinfo
				return db
					.collection('media-log')
					.add({
						user_id: db.env.uid,
						goods_id: this.id,
						source: this.info.source && this.info.source[0].code,
						radio_index: Number(this.mid),
						radio_title: info.title,
						current_value: Number(info.current_value.toFixed(0)),
						duration_value: Number(info.duration_value.toFixed(0)),
						update_date: db.env.now
					})
					.then(res => {
						// console.log('添加成功');
					});
			},
			// 已经存在播放记录，则更新播放记录
			updatePlayingLog() {
				let info = this.$zaudio.playinfo
				// console.log('info', info)
				// console.log('this.id', this.id)
				// console.log('this.info', this.info)
				return db
					.collection('media-log')
					.where({
						user_id: db.env.uid,
						goods_id: this.id
					})
					.update({
						source: this.info.source && this.info.source[0].code,
						radio_index: Number(this.playIndex),
						radio_title: info.title,
						current_value: Number(info.current_value.toFixed(0)),
						duration_value: Number(info.duration_value.toFixed(0)),
						update_date: db.env.now
					})
					.then(res => {
						// console.log('更新成功');
						let log = wx.getStorageSync('log')

						// 将播放记录存到缓存，为了下次进入首页可以直接播放
						if (log && (log.id === this.id) && (log.radio_index === Number(this.playIndex))) {
							// 不用缓存
							// console.log('不用缓存')
						} else {
							// console.log('缓存')
							wx.setStorageSync('log', {
								radio_index: Number(this.playIndex),
								radio_title: info.title,
								title: this.info.name,
								id: this.id
							})
						}
					});
			},
			// 尝试过把播放记录存到用户表里，弃用了
			// 更新播放记录，包括新增和更新
			// updatePlayingLog() {
			// 	let info = this.$zaudio.playinfo;
			// 	console.log('info.singer', info.singer);
			// 	uniCloud
			// 		.callFunction({
			// 			name: 'updatePlayingLog',
			// 			data: {
			// 				goods_id: info.singer,
			// 				radio_index: Number(this.playIndex),
			// 				radio_title: info.title,
			// 				current_value: Number(info.current_value.toFixed(0)),
			// 				duration_value: Number(info.duration_value.toFixed(0))
			// 			}
			// 		})
			// 		.then(res => {
			// 			// console.log('updatePlayingLog返回结果', res);
			// 			let log = wx.getStorageSync('log');

			// 			// 将播放记录存到localstorage缓存，为了下次进入首页可以直接点击播放
			// 			if (!log) {
			// 				// console.log('存到缓存里1')
			// 				wx.setStorageSync('log', {
			// 					radio_index: Number(this.playIndex),
			// 					radio_title: info.title,
			// 					title: this.info.name,
			// 					id: this.id
			// 				});
			// 			} else {
			// 				if (log.id != this.id || log.radio_index != this.playIndex) {
			// 					// console.log('存到缓存里2', this.id)
			// 					wx.setStorageSync('log', {
			// 						radio_index: Number(this.playIndex),
			// 						radio_title: info.title,
			// 						title: this.info.name,
			// 						id: this.id
			// 					});
			// 				}
			// 			}
			// 		});
			// },
			// 播放过程中循环执行
			// logPlaying(action) {
			// 	// 一个回调事件可以注册多次业务, action用于区分相同回调事件的不同业务
			// 	//例: playing回调时注册 打印事件
			// 	this.$zaudio.on('playing', action, info => {
			// 		console.log('播放中----' + action, info);
			// 		this.logInfo = info;
			// 	});
			// },
			offPlaying(action) {
				//注意解除事件action必须与注册事件的action相同
				this.$zaudio.off('playing', action);
			},
			vipcard() {
				uni.navigateTo({
					url: '/pages/vipcard/index'
				});
			},
			contactAct() {
				uni.navigateTo({
					url: '/pages/vipcard/adviser'
				});
				// if (this.isLogin == false) {
				// 	this.showLogin = true;
				// 	this.nextStep = 'contact';
				// } else {
				// 	uni.navigateTo({
				// 		url: '/pages/vipcard/adviser'
				// 	});
				// }
			},
			stepPlay(val) {
				this.$zaudio.stepPlay(val);
			},
			// buyAct() {
			// 	if (this.price * 1 == 0) {
			// 		uni.showToast({ title: '免费视频不需要购买', icon: 'none' });
			// 		return false;
			// 	}
			// 	if (this.isLogin == false) {
			// 		this.showLogin = true;
			// 		this.nextStep = 'buy';
			// 	} else {
			// 		uni.setStorage({
			// 			//缓存配置信息
			// 			key: 'buydata',
			// 			data: this.info
			// 		});
			// 		uni.navigateTo({
			// 			url: '/pages/client/tuan/buy?id=' + this.id
			// 		});
			// 	}
			// }
			changeIndex(index) {
				this.selectIndex = index;
			},
		}
	};
</script>

<style lang="scss">
	.audio-page {
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
				from {
					transform: rotate(0deg);
				}

				to {
					transform: rotate(360deg);
				}
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
		z-index: 98;
		background: rgba(0, 0, 0, .4);
	}

	.van-popup {
		background: none;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0rpx -4rpx 16rpx 0rpx rgba(0, 0, 0, 0.04);
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