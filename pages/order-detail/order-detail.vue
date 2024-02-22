<template>
	<view class="rf-order-detail">
		<view class="order-detail">
			<view class="rf-goods-section">
				<view class="g-header b-b">
					<view class="title">
						<image class="cover" :src="orderDetail.merchant && orderDetail.merchant.cover || logo"></image>
						{{ orderDetail.merchant && orderDetail.merchant.title || appName }}</view>
					<text class="name" :class="'text-' + tempName">{{
						orderDetail.status | orderStatusFilter
					}}</text>
				</view>
				<!-- 商品列表 -->
				<view
					class="g-item"
					@tap="navTo(`/pages/product/product?id=${orderDetail.custom.product_id}`)"
				>
					<view class="right">
						<text class="title clamp in2line">
							{{ orderDetail.custom.product_name }}
						</text>
						<!-- <view class="price-box">
							<text class="price-wrapper">
								<text>
									实付<text :class="'text-' + tempName">{{ moneySymbol }}{{ orderDetail.money }}</text><text class="original-price" v-if="item.product_original_money > item.product_money">{{ moneySymbol }}{{ item.product_original_money }}</text>
								</text>
							</text>
						</view> -->
						<!-- <view class="btn-box" v-if="item.gift_flag !== '1'">
							<button
								class="action-btn"
								v-if="
									(item.status == 3 || item.status == 4) &&
										item.is_evaluate == 0 &&
										(item.refund_status == 0 ||
											item.refund_status == -2 ||
											item.refund_status == -3)
								"
								@tap.stop="navToEvaluation(item)"
							>
								我要评价
							</button>
						</view> -->
					</view>
				</view>
			</view>
			<!-- 订单号 -->
			<view class="yt-list">
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">订单号</text>
					<text class="cell-tip">
						{{ orderDetail.order_no }}
					</text>
					<text class="cell-tip copy" :class="'text-' + tempName" @tap.stop="copy(orderDetail.order_no)">复制</text>
				</view>
			</view>
			<!-- 金额明细 -->
			<view class="yt-list">
				<!-- <view class="yt-list-cell b-b">
					<text class="cell-tit clamp">商品总价</text>
					<text class="cell-tip" :class="'text-' + tempName">{{ moneySymbol }}{{ orderDetail.money }}</text>
				</view> -->
				<!--营销金额优惠-->
				<!-- <view v-for="(item, index) in orderDetail.marketingDetail" :key="index">
					<view v-if="item.discount_money > 0 || item.give_point > 0" class="yt-list-cell b-b">
						<text class="cell-tit clamp">{{ item.marketing_name }}</text>
						<text class="cell-tip">
							<text v-if="item.marketing_type === 'give_point'">{{ item.discount_money }} 积分</text>
							<text v-else :class="'text-' + tempName">-{{ moneySymbol }}{{item.discount_money }}</text>
						</text>
					</view>
				</view> -->
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">实付金额</text>
					<text class="cell-tip" :class="'text-' + tempName">{{ moneySymbol }}{{ orderDetail.money }}</text>
				</view>
			</view>
			<!-- 底部 -->
			<view class="footer" v-if="orderDetail.status >= 0">
				<!-- <button
					class="action-btn"
					:class="'bg-' + tempName"
					v-if="orderDetail.status == -4"
					@tap="handleOrderOperation(orderDetail, 'delete')"
				>
					删除订单
				</button> -->
				<button
					class="action-btn"
					:class="'text-' + tempName"
					v-if="orderDetail.status == 0"
					@tap="handleOrderOperation(orderDetail, 'close')"
				>
					取消订单
				</button>
				<button
					class="action-btn"
					:class="'bg-' + tempName"
					v-if="orderDetail.status == 0"
					@tap="navTo(`/pages/pay/pay?order_no=${orderDetail.order_no}`)"
				>
					立即支付
				</button>
				<button
					class="action-btn"
					:class="'text-' + tempName"
					v-if="orderDetail.status == 1"
					open-type="contact"
				>
					联系客服
				</button>
				<button
					class="action-btn"
					:class="'bg-' + tempName"
					v-if="orderDetail.status == 1"
					@tap="handleOrderOperation(orderDetail, 'webDisk')"
				>
					查看网盘地址
				</button>
				<!-- <button
					class="action-btn"
					:class="'bg-' + tempName"
					v-if="orderDetail.status == 2"
					@tap="handleOrderOperation(orderDetail, 'delivery')"
				>
					确认收货
				</button> -->
			</view>
		</view>
		<!-- 404页面 -->
		<view v-if="!orderDetail.order_no && !loading">
			<rf-no-data class="rf-no-data" :custom="true">
				<view class="title" @tap="getOrderDetail">
					{{ errInfo || '订单不存在' }}
				</view>
				<view @tap="getOrderDetail" slot="refresh" class="spec-color"
					>重新加载</view
				>
			</rf-no-data>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<view
			class="mask"
			:class="maskState === 1 ? 'show' : 'none'"
			@tap="toggleMask"
		>
			<view class="mask-content" @tap.stop.prevent="stopPrevent">
				<div class="wp-title">获取方式一：</div>
				<text class="wp-txt">{{web_disk}}</text>
				<button @tap.stop="copyWebDisk" class="confirm-btn" :class="'bg-' + tempName">复制网盘链接</button>
				<view class="tishi">复制网盘链接后打开百度网盘手机APP</view>
				<div class="wp-title">获取方式二：</div>
				<button @tap.stop="handleImg" class="confirm-btn" :class="'bg-' + tempName">显示二维码</button>
				<view class="tishi">长按二维码即可获取文件</view>
				<view class="tishi">若网盘地址失效请联系客服</view>
			</view>
		</view>
		<!-- <rf-kefu></rf-kefu> -->
		<!-- 统一支付组件 -->
		<uni-pay ref="uniPay" height="70vh" return-url="/pages/order-detail/order-detail" logo="/static/logo.png"></uni-pay>
	</view>
</template>
<script>
import moment from '@/common/moment';
import mConstData from '@/config/constData.config';
import rfNoData from '@/components/rf-no-data';
// import { orderClose } from '@/api/product';
// import uniTag from '@/components/uni-tag/uni-tag';
// import rfKefu from '@/components/rf-kefu';
// import {
// 	orderDetail,
// 	closeOrderRefundApply,
// 	orderCustomerRefundClose,
// 	orderDelete,
// 	orderTakeDelivery,
// 	orderInvoiceCreate
// } from '@/api/userInfo';
// import { configList } from '@/api/basic';
export default {
	components: {
		// uniTag,
		// rfKefu,
		rfNoData
	},
	data() {
		return {
			maskState: 0, // 百度网盘面板显示状态
			orderDetail: {
        pickup: {},
				order_no: '',
				total_fee: '',
				money: '',
				product_id: '',
				product_name: '',
				product_count: '',
			},
			web_disk: '',
			web_disk_qr: '',
			logo: this.$mSettingConfig.appLogo,
			appName: '贝贝听书',
			loading: true,
			errInfo: null,
			order_id: null,
			moneySymbol: '￥',
			singleSkuText: this.singleSkuText,
		};
	},
	computed: {
		orderTimeLine() {
			const timeLine = [];
			if (this.orderDetail.created_at !== '0') {
				timeLine.push({ time: this.orderDetail.created_at, value: '订单创建' });
			}
			if (
				this.orderDetail.close_time <
				(new Date().getTime() / 1000 && this.orderDetail.pay_time !== '0')
			) {
				timeLine.push({
					time: this.orderDetail.close_time,
					value: '未付款订单关闭时间'
				});
			}
			if (this.orderDetail.pay_time !== '0') {
				timeLine.push({ time: this.orderDetail.pay_time, value: '订单支付' });
			}
			if (this.orderDetail.shipping_time !== '0') {
				timeLine.push({
					time: this.orderDetail.shipping_time,
					value: '买家要求发货'
				});
			}
			if (this.orderDetail.consign_time !== '0') {
				timeLine.push({
					time: this.orderDetail.consign_time,
					value: '卖家发货'
				});
			}
			if (this.orderDetail.sign_time !== '0') {
				timeLine.push({
					time: this.orderDetail.sign_time,
					value: '买家确认收货'
				});
			}
			if (this.orderDetail.finish_time !== '0') {
				timeLine.push({
					time: this.orderDetail.finish_time,
					value: '订单完成'
				});
			}
			return timeLine.reverse();
		}
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
		orderStatusFilter(orderStatus) {
			let state = null;
			mConstData.orderStatus.forEach(orderItem => {
				if (orderItem.key === parseInt(orderStatus, 10)) {
					state = orderItem.value;
				}
			});
			return state;
		},
		filterShippingType(value) {
			const data = ['', '物流配送', '买家自提', '本地配送'];
			return data[parseInt(value, 10)];
		}
	},
	onLoad(options) {
		this.order_no = options.order_no;
		// console.log('order_id', this.order_id)
	},
	onShow() {
		this.initData();
	},
	methods: {
		// 显示百度网盘面板
		toggleMask(type) {
			let timer = type === 'show' ? 10 : 300;
			let state = type === 'show' ? 1 : 0;
			this.maskState = 2;
			setTimeout(() => {
				this.maskState = state;
			}, timer);
		},
    stopPrevent() {
    },
		/**
		 * H5复制
		 */
		// h5Copy(content) {
		// 	let textarea = document.createElement('textarea');
		// 	textarea.value = content;
		// 	textarea.readOnly = 'readOnly';
		// 	document.body.appendChild(textarea);
		// 	textarea.select(); // 选择对象
		// 	textarea.setSelectionRange(0, content.length); //核心
		// 	let result = document.execCommand('Copy'); // 执行浏览器复制命令
		// 	textarea.remove();
		// 	const msg = result ? '复制成功' : '复制失败';
		// 	uni.showToast({
		// 		title: msg,
		// 		duration: 3000,
		// 		icon: 'none'
		// 	});
		// },
		// 订单号复制
		copy(content) {
			/* #ifdef H5 */
			this.h5Copy(content);
			/* #endif */
			/* #ifndef H5 */
			uni.setClipboardData({
				data: content,
				success: () => {
					wx.showToast({
						title: '复制成功',
						icon: 'none',
						duration: 3000
					});
				}
			});
			/* #endif */
		},
		navTo(route) {
			wx.navigateTo({
				url: route
			})
		},
		// navToEvaluation(item, type) {
		// 	this.$mRouter.push({
		// 		route: `/pages/order/evaluation/evaluation?data=${JSON.stringify(
		// 			item
		// 		)}&type=${type}`
		// 	});
		// },
		// navToRefund(item, type) {
		// 	this.$mRouter.push({
		// 		route: `/pages/order/refund/refund?data=${JSON.stringify(
		// 			item
		// 		)}&refundType=${type}`
		// 	});
		// },
		// navToShippingReturn(item) {
		// 	this.$mRouter.push({
		// 		route: `/pages/order/shipping/return?data=${JSON.stringify(item)}`
		// 	});
		// },
		// 订单操作
		handleOrderOperation(item, type) {
			switch (type) {
				case 'detail': // 订单详情
					this.navTo(`/pages/order-detail/order-detail?order_no=${item.order_no}`);
					break;
				case 'webDisk': // 查看百度网盘地址
					this.handleWebDisk()
					break;
				case 'close': // 取消订单
					this.handleOrderClose(item.order_no);
					break;
				// case 'delete': // 删除订单
				// 	this.handleOrderDelete(item.id);
				// 	break;
				// case 'shipping': // 查看物流
				// 	this.navTo(`/pages/order/shipping/shipping?id=${item.id}`);
				// 	break;
				// case 'delivery': // 确认收货
				// 	this.handleOrderTakeDelivery(item.id);
				// 	break;
			}
		},
		handleImg() {
			let urls = [];
			urls.push(this.web_disk_qr);
			wx.previewImage({
				current: this.web_disk_qr, // 当前显示图片的http链接
				urls // 需要预览的图片http链接列表
			});
		},
		copyWebDisk() {
			this.copy(this.web_disk)
		},
		async handleWebDisk() {
			uni.showLoading({
				title: '加载中'
			});
			await uniCloud.callFunction({
				name: 'getWebDisk',
				data: {
					"id": this.orderDetail.custom.product_id
				},
				success: (res) => {
					uni.hideLoading();
					console.log('执行成功', res.result)
					this.web_disk = res.result.web_disk
					this.web_disk_qr = res.result.web_disk_qr
					this.toggleMask('show')
				},
				fail: () => {
					uni.hideLoading();
					console.log('失败')
					this.loading = false;
				}
			})
		},
		// 初始化数据
		initData() {
			this.getOrderDetail();
		},
		// 获取订单详情
		async getOrderDetail() {
			await uniCloud.callFunction({
				name: 'getPayOrder',
				data: {
					"order_no": this.order_no
				},
				success: (res) => {
					console.log('执行成功', res.result)
					this.loading = false;
					res.result.money = res.result.total_fee / 100
					this.orderDetail = res.result
				},
				fail: () => {
					console.log('失败')
					this.loading = false;
				}
			})
		},
		// 取消订单
		async handleOrderClose(order_no) {
			// console.log('order_no', order_no)
			// console.log(`${order_no}-1`)
			const res = await this.$refs.uniPay.closeOrder({
				out_trade_no: `${order_no}-1`, // 插件支付单号
			})
			// console.log('res', res)
			if (res.result.resultCode === 'SUCCESS') {
				wx.showToast({
					title: '取消订单成功',
					icon: 'none',
					duration: 3000
				})
				this.getOrderDetail();
			}
		},
		// 删除已关闭订单
		// async handleOrderDelete(id) {
		// 	await this.$http.delete(`${orderDelete}?id=${id}`, {}).then(() => {
		// 		wx.showToast({
		// 			title: '订单删除成功',
		// 			icon: 'none',
		// 			duration: 3000
		// 		});
		// 		this.$mRouter.back();
		// 	});
		// },
		// 确认收货
		// async handleOrderTakeDelivery(id) {
		// 	await this.$http
		// 		.get(`${orderTakeDelivery}`, {
		// 			id
		// 		})
		// 		.then(() => {
		// 			this.$mHelper.toast('确认收货成功');
					
		// 			this.getOrderDetail();
		// 		});
		// },
		// 产品退款/退货关闭申请
		// async handleCloseOrderRefundApply(status, id) {
  //     uni.showModal({
		// 		content: '取消退款后将无法再次提交申请，是否继续取消退款?',
		// 		success: async e => {
		// 			if (e.confirm) {
  //           let closeOrderApi = closeOrderRefundApply;
		// 				if (parseInt(status, 10) === 4) {
		// 					closeOrderApi = orderCustomerRefundClose;
		// 				}
		// 				await this.$http
		// 					.post(`${closeOrderApi}`, {
		// 						id
		// 					})
		// 					.then(r => {
		// 						this.$mHelper.toast('取消成功');
		// 						this.getOrderDetail();
		// 					});
		// 			}
		// 		}
		// 	});
		// }
	}
};
</script>
<style lang="scss" scoped>
page {
	background: $page-color-base;
}
.order-detail {
	padding-bottom: 100upx;
}
.rf-goods-section {
	.g-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.cover {
				width: 48upx;
				height: 48upx;
				border-radius: 50%;
				margin-right: 10upx;
			}
		}
	}
	.g-item {
		border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
	}
	.g-item:last-child {
		border-bottom: none;
	}
	.right {
		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: $font-color-dark;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.05);

			.price-wrapper {
				margin-bottom: 10upx;
				flex: 1;

				.price {
					font-size: $font-sm;
					margin-bottom: 4upx;
				}

				.number {
					font-size: $font-sm;
					color: $font-color-base;
					margin-left: $font-sm;
				}
				.original-price {
					font-size: $font-sm;
					color: $font-color-light;
					margin-left: $spacing-sm;
					text-decoration: line-through;
				}
			}

			.status {
				font-size: 24upx;
				margin-left: $spacing-sm;
			}

			.spec-color {
				color: $font-color-spec;
			}
		}
		.btn-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin: $spacing-sm 0;
			.action-btn {
				font-size: $font-sm;
				margin: 0 0 0 15upx;
				padding: 0 28upx;
				color: $font-color-base;
				text-align: center;
				height: 50upx;
				border-radius: 32upx;
				line-height: 50upx;
				border: 1upx solid rgba(0, 0, 0, 0.15);
			}
		}
	}
}
.yt-list {
	margin-top: 16upx;
	background: #fff;

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			text-align: center;
			line-height: 32upx;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}
		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			&.disabled {
				color: $font-color-light;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}

		.copy {
			margin-left: $spacing-sm;
		}
	}
}
.uni-timeline {
	padding: $spacing-lg;
	background-color: $color-white;
}
.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 98;
	width: 100%;
	background-color: $color-white;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 15upx $spacing-base;
	.action-btn {
		font-size: $font-sm;
		margin: 0 0 0 15upx;
		padding: 0 $spacing-lg;
		text-align: center;
		height: 60upx;
		line-height: 60upx;
	}
}
.rf-no-data {
	height: calc(100vh - 90upx);
}
.pickup-tag {
	margin-right: $spacing-sm;
}
/* 优惠券面板 */
.mask {
	display: flex;
	align-items: flex-end;
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0);
	z-index: 99;
	transition: 0.3s;
	.mask-content {
		width: 100%;
		max-height: 70vh;
		min-height: 16vh;
		background: #f3f3f3;
		transform: translateY(100%);
		transition: 0.3s;
		overflow-y: scroll;
		padding: $spacing-lg;
		box-sizing: border-box;
		.wp-title {
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		.tishi {
			text-align: center;
			margin-bottom: 40rpx;
			color: #999;
		}
		.confirm-btn {
			margin: $spacing-base auto $spacing-lg;
		}
	}
	&.none {
		display: none;
	}
	&.show {
		background: rgba(0, 0, 0, 0.4);

		.mask-content {
			transform: translateY(0);
		}
	}
}
</style>
