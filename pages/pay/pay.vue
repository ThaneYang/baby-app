<template>
	<view class="pay" v-if="!loading">
		<view class="pay-section" :class="'bg-' + tempName">
			<image class="bg" :src="moneyBg"></image>
			<view class="tips-wrapper">
				<text class="title">支付金额</text>
				<view class="tip">{{ moneySymbol }}{{ money }}</view>
			</view>
		</view>
		<view class="pay-type-list">
			<view
				class="type-item"
				:class="payType === 1 ? 'type-item-active text-' + tempName : ''"
				@tap="changePayType(1)"
				v-if="parseInt(payTypeList.order_wechat_pay, 10) === 1"
			>
				<i class="iconfont iconweixinzhifu" :style="{color: payType === 1 ? '#36cb59' : ''}"></i>
				<view class="con">
					<text class="tit" :class="payType === 1 ? 'text-' + tempName : ''">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio size="12" value="" :color="tempColor" :checked="payType == 1" />
				</label>
			</view>
			<!-- #ifndef MP-WEIXIN -->
			<view
				class="type-item"
				:class="payType === 2 ? 'type-item-active text-' + tempName : ''"
				@tap="changePayType(2)"
				v-if="parseInt(payTypeList.order_ali_pay, 10) === 1"
			>
				<i class="iconfont iconalipay" :style="{color: payType === 2 ? '#01aaef' : ''}"></i>
				<view class="con">
					<text class="tit" :class="payType === 2 ? 'text-' + tempName : ''">支付宝支付</text>
					<text>推荐使用支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" :color="tempColor" :checked="payType == 2" />
				</label>
			</view>
			<!-- #endif-->
		</view>
		<button
			class="confirm-btn"
			:class="'bg-' + tempName"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="confirm"
		>
			确认支付
		</button>
		<!-- 统一支付组件 -->
		<uni-pay ref="uniPay" height="70vh" return-url="/pages/order-detail/order-detail" logo="/static/logo.png" @success="onSuccess" @cancel="onCancel" @fail="onFail" @create="onCreate"></uni-pay>
	</view>
</template>

<script>
// import { orderDetail, memberInfo } from '@/api/userInfo';
// import { configList } from '@/api/basic';
const db = uniCloud.database();
import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
export default {
	data() {
		return {
			isWechat: true,
			payType: 1,
			payTypeList: {},
			money: 0,
			moneySymbol: '￥',
			btnLoading: false,
			// loading: true,
			loading: false,
			moneyBg: this.$mAssetsPath.moneyBg,
			
			total_fee: 0, // 支付金额，单位分 100 = 1元
			order_no: "", // 业务系统订单号（即你自己业务系统的订单表的订单号）
			out_trade_no: "", // 插件支付单号
			description: "", // 支付描述
			type: "goods", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
			qr_code: false, // 是否强制使用扫码支付
			openid:"", // 微信公众号需要
			userOpenid:"", // 用户open，小程序订阅需要
			sub_id: "", // 订阅id
			custom:{
				// a: "a",
				// b: 1
			},
			adpid: "1000000001", // uni-ad的广告位id
			
			transaction_id:"", // 查询订单接口的查询条件
			getOrderRes:{}, // 查询订单支付成功后的返回值
		};
	},
	computed: {
		userInfo() {
			return store.userInfo
		},
		h5Env(){
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger' && (ua.match(/miniprogram/i) == 'miniprogram')) {
				// 微信小程序
				return "mp-weixin";
			}
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// 微信公众号
				return "h5-weixin";
			}
			if (ua.match(/alipay/i) == 'alipay' && ua.match(/miniprogram/i) == 'miniprogram') {
				return "mp-alipay";
			}
			if (ua.match(/alipay/i) == 'alipay') {
				return "h5-alipay";
			}
			// 外部 H5
			return "h5";
			// #endif
		},
		// 计算当前是否是ios app
		isIosAppCom(){
			let info = uni.getSystemInfoSync();
			return info.uniPlatform === 'app' && info.osName === 'ios' ? true : false;
		},
		// 计算当前是否是PC环境
		isPcCom(){
			// #ifdef H5
			let info = uni.getSystemInfoSync();
			return info.deviceType === 'pc' ? true : false;
			// #endif
			return false;
		}
	},
	onLoad(options) {
		this.getOrderDetail(options.order_no);
		if (options.sub_id) {
			// 说明是从订单详情页跳过来的，可能已经带了订阅id了
			this.sub_id = options.sub_id
		}
		// #ifdef H5
		// 微信公众号特殊逻辑开始-----------------------------------------------------------
		// 以下代码仅为获取openid，正常你自己项目应该是登录后才能支付，登录后已经拿到openid，无需编写下面的代码
		if (this.h5Env === 'h5-weixin') {
			let openid = uni.getStorageSync("uni-pay-weixin-h5-openid");
			let code = uni.getStorageSync("uni-pay-weixin-h5-code");
			if (openid) {
				this.openid = openid;
			}
			// 如果code和state有值，且此code没有被使用过，则执行获取微信公众号的openid
			if (options.code && options.state && code !== options.code) {
				// 获取微信公众号的openid
				setTimeout(() => {
					this.getOpenid({
						provider: "wxpay",
						code: options.code
					});
				}, 300);
			} else if (!openid){
				// 如果openid为空，则执行微信公众号的网页授权登录逻辑
				setTimeout(() => {
					this.getWeiXinJsCode('snsapi_base');
				}, 300);
			}
		}
		// 微信公众号特殊逻辑结束-----------------------------------------------------------
		// #endif
		
		// #ifdef MP-WEIXIN
		if (wx.getStorageSync('uni-id-pages-userInfo')) {
			this.userOpenid = wx.getStorageSync('uni-id-pages-userInfo').wx_openid['mp']
		}
		// #endif
		console.log('this.userOpenid', this.userOpenid)
	},
	methods: {
		// 订阅更新，用户同意或取消订阅，都进行下一步
		async newSub() {
			// #ifdef H5
			return Promise.resolve()
			// #endif
			return new Promise(async (resolve, reject) => {
				wx.requestSubscribeMessage({
					tmplIds: ['BGDtqTK8U_x3AkW9ARx6aiyHF4hjEWWsntZz4KyTCyA'],
					success: async (res) => {
						console.log('res', res)
						if (res['BGDtqTK8U_x3AkW9ARx6aiyHF4hjEWWsntZz4KyTCyA'] === 'accept') {
							console.log('用户同意订阅')
							let res2 = await uniCloud.callFunction({
								name: 'updatePaySub',
								data: {
									user_id: this.userInfo._id,
									openid: this.userOpenid,
									product_id: this.product_id,
									product_name: this.product_name,
									template_id: 'BGDtqTK8U_x3AkW9ARx6aiyHF4hjEWWsntZz4KyTCyA', // 订阅模版id
									order_no: this.order_no,
									total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
								}
							})
							this.sub_id = res2.result.sub_id
							console.log('res2', res2)
							resolve('订阅成功')
						} else {
							// 用户取消订阅，也让他可以收藏
							let res3 = await uniCloud.callFunction({
								name: 'updatePaySub',
								data: {
									user_id: this.userInfo._id,
									openid: this.userOpenid,
									product_id: this.product_id,
									product_name: this.product_name,
									template_id: '', // 订阅模版id
									order_no: this.order_no,
									total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
								}
							})
							this.sub_id = res3.result.sub_id
							console.log('res3', res3)
							resolve('取消订阅')
						}
					},
					fail: (err) => {
						// 订阅报错
						reject(err)
					}
				})
			})
		},
		// 支付接口错误
		onFail() {
			console.log('支付接口错误')
		},
		// 用户取消支付或支付失败
		onCancel() {
			console.log('用户取消支付或支付失败', this.order_no)
			wx.showModal({
			  content: '是否已完成支付？',
				confirmText: '已支付',
				cancelText: '取消',
			  success: (res) => {
			    if (res.confirm) {
			      console.log('用户点击确定')
						this.getPayOrder()
			    } else if (res.cancel) {
			      console.log('用户点击取消')
						this.getPayOrder()
			    }
			  }
			})
		},
		// 查询支付状态
		async getPayOrder() {
			uniCloud.callFunction({
				name: 'getPayOrder',
				data: {
					"order_no": this.order_no
				},
				success: (res) => {
					console.log('getPayOrder res', res)
					if (!res.result) {
						console.log('未查询到支付订单')
						return false
					}
					if (res.result.status === 1) {
						wx.redirectTo({
							url: `/uni_modules/uni-pay/pages/success/success?out_trade_no=${res.result.out_trade_no}&order_no=${res.result.order_no}&pay_date=${res.result.pay_date}&total_fee=${res.result.total_fee}&adpid=&return_url=/pages/order-detail/order-detail&main_color=`
						})
					} else {
						wx.redirectTo({
							url: `/pages/order-detail/order-detail?order_no=${this.order_no}`
						})
					}
				}
			})
			// let res = await this.$refs.uniPay.getOrder({
			// 	out_trade_no: this.out_trade_no, // 插件支付单号
			// 	await_notify: false
			// });
			// if (res) {
			// 	console.log('res', res)
			// 	let obj = {
			// 		"-1": "已关闭",
			// 		"1": "已支付",
			// 		"0": "未支付",
			// 		"2": "已部分退款",
			// 		"3": "已全额退款"
			// 	};
			// 	uni.showToast({
			// 		title: obj[res.status] || res.errMsg,
			// 		icon: "none"
			// 	});
			// }
		},
		// 获取订单费用
		async getOrderDetail(order_no) {
			await uniCloud.callFunction({
				name: 'getOrder',
				data: {
					"order_no": order_no
				},
				success: (res) => {
					console.log('执行成功', res.result)
					this.getPayTypeList();
					this.order_no = res.result.order_no
					this.out_trade_no = `${this.order_no}-1`
					this.total_fee = res.result.total_fee
					this.money = res.result.total_fee / 100
					this.product_id = res.result.product_id
					this.product_name = res.result.product_name
					this.product_count = res.result.product_count
				},
				fail: () => {
					console.log('失败')
					this.loading = false;
				}
			})
		},
		/**
		 * 发起支付（不唤起收银台，手动指定支付方式）
		 * 在调用此api前，你应该先创建自己的业务系统订单，并获得订单号 order_no，把order_no当参数传给此api，而示例中为了简化跟支付插件无关的代码，这里直接已时间戳生成了order_no
		 */
		createOrder(provider){
			console.log('this.sub_id', this.sub_id)
			this.custom = {
				product_id: this.product_id,
				product_name: this.product_name,
				product_count: this.product_count,
				sub_id: this.sub_id,
			}
			this.description = this.product_name + '支付订单'
			// 发起支付
			this.$refs.uniPay.createOrder({
				provider: provider, // 支付供应商
				total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
				order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: this.out_trade_no, // 插件支付单号
				description: this.description, // 支付描述
				type: this.type, // 支付回调类型
				openid: this.openid, // 微信公众号需要
				custom: this.custom, // 自定义数据
				sub_id: this.sub_id,
			});
		},
		// 获取公众号code
		async getWeiXinJsCode(scope="snsapi_base") {
			let res = await this.$refs.uniPay.getProviderAppId({
				provider: "wxpay",
				provider_pay_type: "jsapi"
			});
			if (res.appid) {
				let appid = res.appid;
				let redirect_uri = window.location.href.split("?")[0];
				let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
				window.location.href = url;
			}
		},
		// 获取公众号openid
		async getOpenid(data={}) {
			let res = await this.$refs.uniPay.getOpenid(data);
			if (res) {
				this.openid = res.openid;
				// 将openid缓存到本地
				uni.setStorageSync("uni-pay-weixin-h5-openid", this.openid);
				uni.setStorageSync("uni-pay-weixin-h5-code", data.code);
				uni.showToast({
					title: "已获取到openid，可以开始支付",
					icon: "none"
				});
			}
		},
		// 监听事件 - 支付订单创建成功（此时用户还未支付）
		onCreate(res){
			console.log('create: ', res);
			// 如果只是想生成支付二维码，不需要组件自带的弹窗，则在这里可以获取到支付二维码 qr_code_image
		},
		// 监听事件 - 支付成功
		onSuccess(res){
			console.log('success: ', res);
			if (res.user_order_success) {
				// 代表用户已付款，且你自己写的回调成功并正确执行了
				console.log('代表用户已付款，且你自己写的回调成功并正确执行了')
				// 这里增加逻辑，调用云函数，销量+1
				uniCloud.callFunction({
					name: 'updateSellCount',
					data: {
						"id": this.product_id
					},
					success: (res) => {
						console.log('执行成功+1', res.result)
					}
				})
				// 订阅表的支付状态改为支付成功
				db.collection('sub')
				.where({
					_id: this.sub_id
				})
				.update({
					user_order_success: true
				})
			} else {
				// 代表用户已付款，但你自己写的回调执行失败（通常是因为你的回调代码有问题）
				console.log('代表用户已付款，但你自己写的回调执行失败（通常是因为你的回调代码有问题）')
			}
		},
		// 选择支付方式
		changePayType(type) {
			this.payType = type;
		},
		// 获取支付类型列表
		async getPayTypeList() {
			this.payTypeList = {
				order_ali_pay: "1",
				order_balance_pay: "0",
				order_wechat_pay: "1"
			}
			// await this.$http
			// 	.get(`${configList}`, {
			// 		field: 'order_balance_pay,order_wechat_pay,order_ali_pay'
			// 	})
			// 	.then(r => {
			// 		this.payTypeList = r.data;
			// 	});
		},
		// 确认支付
		async confirm() {
			if (!this.sub_id) {
				// 如果从订单详情跳转过来，并且已经订阅过的，则不需要再订阅
				await this.newSub()
			}
			this.btnLoading = true;
			setTimeout(() => {
				this.btnLoading = false;
			}, 0.5 * 1000);
			switch (parseInt(this.payType, 10)) {
				case 1:
					await this.createOrder('wxpay')
					break;
				case 2:
					await this.createOrder('alipay')
					break;
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $color-white;
}

.pay {
	width: 100%;
	.pay-section {
		height: 400upx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
		}
		.tips-wrapper {
			text-align: center;
			.title {
				font-size: $font-lg;
				margin-bottom: $spacing-base;
			}
			.tip {
				font-size: $font-lg + 42upx;
			}
		}
	}
}

.price-box {
	background-color: #fff;
	height: 265upx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 28upx;
	color: #909399;

	.price {
		font-size: 50upx;
		color: #303133;
		margin-top: 12upx;
	}
}
.pay-type-list {
	margin: 60upx 0;
	background-color: #fff;
	padding: 0 40upx;
	.type-item {
		padding: 0 $spacing-lg;
		height: 100upx;
		border-radius: 100upx;
		margin-bottom: $spacing-lg;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		position: relative;
		border: 2upx solid rgba(0, 0, 0, 0.12);
	}

	.type-item-active {
		border: 2upx solid;
	}

	.iconfont {
		font-size: 45upx;
		margin: 0 $spacing-base;
		color: $font-color-light;
	}

	.tit {
		font-size: $font-base;
		margin-bottom: 4upx;
	}
	.tit-active {
		color: $font-color-dark;
	}

	.con {
		flex: 1;
		font-size: $font-sm;
		color: $font-color-light;
		.tit {
			margin-right: $spacing-base;
		}
	}
	.radio {
		radio {
			transform:scale(0.7)
		}
	}
}
.confirm-btn {
	height: 86upx;
	line-height: 86upx;
	width: 70%;
	margin-top: 144upx;
}
</style>
