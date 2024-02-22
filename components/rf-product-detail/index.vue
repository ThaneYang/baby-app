<template>
  <view class="rf-product-detail">
		<!--header-->
		<view class="detail" v-if="product.name">
			<!--顶部商品轮播图-->
			<view class="carousel">
				<swiper indicator-dots circular="true" duration="400" controls touchable>
					<swiper-item
						class="swiper-item"
						v-for="(item, index) in product.banner"
						:key="index"
					>
						<view class="image-wrapper">
							<image :src="item.url" class="loaded" mode="aspectFit"></image>
						</view>
						<uni-tag class="content" circle size="small" :text="`${index + 1}  / ${product.banner.length}`"></uni-tag>
					</swiper-item>
				</swiper>
			</view>
			<!--商品信息-->
			<view class="introduce-section">
				<view class="introduce-first-line">
					<view
						class="price-box point-box"
						v-if="product.point_exchange_type == 4"
					>
						该商品仅需
						<text class="price">{{ product.point_exchange }} 积分</text>
					</view>
					<view class="price-box" v-else>
						<view class="price-first-line" :class="'text-' + tempName">
							￥<text class="price">{{ currentProductPrice }}</text>
						</view>
					</view>
					<view class="data">
						<text class="item">已售{{ product.total_sell_count }}件</text>
					</view>
				</view>
				<view class="introduce-second-line">
					<view class="title">
						<text>{{ product.name }}</text>
					</view>
				</view>
			</view>
			<!--底部商品详情-->
			<view class="detail-desc">
				<view class="d-header">
					<text>商品详情</text>
				</view>
				<div>
					<!-- <img class="img" mode="widthFix" src="http://yzwpic.weimayi.cn/miniapp/class/p6.jpeg" alt=""> -->
					<u-parse :content="product.intro" />
					<!-- <img class="img" mode="widthFix" src="http://yzwpic.weimayi.cn/miniapp/class/p1.jpeg" alt=""> -->
					<!-- <img class="img" mode="widthFix" src="http://yzwpic.weimayi.cn/miniapp/class/p2.jpeg" alt=""> -->
				</div>
				<!-- <rf-parser :html="product.intro" lazy-load></rf-parser> -->
			</view>
			<!-- 底部操作菜单 -->
			<view class="form-footer-h form-footer">
				<view class="form-footer-main pd10_15 flex alcenter space">
					<view class="flex alcenter space" style="margin-right: 30rpx;">
						<!-- <button open-type="share" class="form-footer-item mr15 text-center bbn">
							<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/share.png" alt="" />
							<view class="ft12 mt3" style="color:#333;">分享好友</view>
						</button> -->
						<!-- <button @tap="goShare" class="form-footer-item mr15 text-center bbn">
							<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/pic.png" alt="" />
							<view class="ft12 mt3" style="color:#333;">生成海报</view>
						</button> -->
						<!-- <button class="p-b-btn kefu-btn" open-type="contact">
							<i class="iconfont iconkefu2"></i>
							<text>客服</text>
						</button> -->
						<button @tap="goList" class="form-footer-item text-center bbn">
							<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/%E9%A6%96%E9%A1%B5.png" alt="" />
							<view class="ft12 mt3" style="color:#333;">更多商品</view>
						</button>
					</view>
					<view style="flex: 1">
						<button v-if="config.payType === 1" @click="goToPay" :class="'btn-big bg-' + tempName">￥{{ currentProductPrice }} 立即购买</button>
						<button v-if="config.payType === 2" open-type="contact" :class="'btn-big bg-' + tempName">￥{{ currentProductPrice }} 联系客服购买</button>
						<button v-if="config.payType === 3" @click="handleImg" :class="'btn-big bg-' + tempName">￥{{ currentProductPrice }} 联系客服购买</button>
					</view>
				</view>
			</view>
			<!-- <view class="page-bottom">
				<view class="page-bottom-bth-wrapper">
					<button open-type="share" class="form-footer-item mr15 text-center bbn">
						<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/share.png" alt="" />
						<view class="ft12 mt3" style="color:#333;">分享好友</view>
					</button>
					<button @tap="goList" class="form-footer-item text-center bbn">
						<img style="width: 50rpx;height: 50rpx;" src="http://yzwpic.weimayi.cn/miniapp/class/%E9%A6%96%E9%A1%B5.png" alt="" />
						<view class="ft12 mt3" style="color:#333;">更多商品</view>
					</button>
				</view>
				<view class="action-btn">
					<button
					@tap="goToPay"
						:class="'action-btn-submit bg-' + tempName"
					>
						￥{{ currentProductPrice }}立即购买
					</button>
				</view>
			</view> -->
		</view>
	</view>
</template>
<script>
	/**
	 *@des 封装商品详情
	 *@author stav stavyan@qq.com
	 *@blog https://stavtop.club
	 *@date 2020/05/15 16:22:24
	 */
	// import rfItemPopup from '@/components/rf-item-popup';
	// import moment from '@/common/moment';
	// import rfAttrContent from '@/components/rf-attr-content';
	// import rfRate from '@/components/rf-rate/rf-rate';
	// import rfBadge from '@/components/rf-badge/rf-badge';
	import uniTag from '@/components/uni-tag/uni-tag';
	// import rfNav from '@/components/rf-nav';
	// import rfLive from '@/components/rf-live';
	// import { cartItemCount, cartItemCreate } from '@/api/product';
	// import { collectCreate, collectDel, pickupPointIndex, transmitCreate } from '@/api/basic';
 //  import { couponReceive, addressList } from '@/api/userInfo';
	import uParse from '@/components/gaoyia-parse/parse.vue';
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
  export default {
    name: 'rfProductDetail',
    props: {
			config: {
				type: Object,
				default() {
					return {
					};
				}
			},
			product: {
				type: Object,
				default() {
					return {
					};
				}
			},
			// userInfo: {
			// 	type: Object,
			// 	default() {
			// 		return {};
			// 	}
			// },
			// url: {
			// 	type: String,
			// 	default: ''
			// },
			marketType: {
				type: String,
				default: 'buy_now'
			}
    },
		components: {
			// rfNav,
			// rfItemPopup,
			// rfBadge,
			// rfLive,
			// rfRate,
			uniTag,
			uParse
			// rfAttrContent
		},
		data() {
			return {
				kefuShow: false,
				addressClass: 'none',
				canvasShow: true,
				posterShow: false,
				serviceClass: 'none', // 服务弹窗
				ladderPreferentialClass: 'none', // 阶梯优惠弹窗
				attributeValueClass: 'none', // 商品参数弹窗
				specClass: 'none', // 商品参数弹窗
				couponClass: 'none', // 优惠券弹窗
				shareClass: 'none', // 分享引导弹窗
				fullGiveClass: 'none', // 满减送弹窗
				cartType: null, // 下单类型
				couponList: [], // 优惠券列表
				currentStock: null,
				currentSkuPrice: null,
				currentSkuName: null,
				currentCartCount: 1,
				evaluateList: [],
				cartNum: uni.getStorageSync('cartNum'),
				tabCurrentIndex: 0,
				// loading: true,
				errorInfo: '',
				isPointExchange: false,
				appName: '123',
				shareFrom: '',
				poster: {},
				promoCode: '',
				addressList: [],
				state: 1,
				thirdPartyQrCodeImg: ''
			};
		},
		// async onShareAppMessage () {
  //     await this.$http.post(`${transmitCreate}`, {
  //       topic_type: 'product',
  //       topic_id: this.productId
  //     }).then(() => {
  //       return {
  //         title: this.productDetail.name,
  //         path: `/pages/product/product?id=${this.productId}`
  //       };
  //     });
		// },
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin(){
				return store.hasLogin
			},
      type() {
				return 'buy_now';
      },
			// 购买按钮禁用
			buyBtnDisabled() {
				return parseInt(this.currentStock || this.product.stock, 10) === 0;
			},
			// 添加购物车按钮禁用
			addCartBtnDisabled() {
				return (
					this.product.point_exchange_type === '2' ||
					this.product.point_exchange_type === '4' ||
					parseInt(this.currentStock || this.product.stock, 10) === 0 ||
					this.product.is_virtual === '1'
				);
			},
			// 最小购买数量
			minNum() {
				return 1;
			},
			// 最小购买数量
			maxNum() {
				let maxNum = 0;
				return maxNum;
			},
			favorite () {
				return !!this.product.myCollect;
			},
			// 计算倒计时时间
			second() {
				return function(val) {
					return Math.floor(val - new Date() / 1000);
				};
			},
			currentProductPrice () {
        let price;
				price = (this.product.price / 100).toFixed(2);
        return price
			}
		},
    methods: {
			handleImg() {
				let urls = [];
				urls.push(this.config.wxqrUrl);
				wx.previewImage({
					current: this.config.wxqrUrl, // 当前显示图片的http链接
					urls // 需要预览的图片http链接列表
				});
			},
			goList() {
				wx.navigateTo({
					url: '/pages/product/product-list'
				})
			},
			async goToPay() {
				if (this.hasLogin) {
					uni.showLoading({
						title: '生成订单'
					});
					let user = wx.getStorageSync('user')
					await uniCloud.callFunction({
						name: 'createOrder',
						data: {
							"product_id": this.product._id,
							"product_count": 1,
							"user_id": this.userInfo._id
						},
						success: (res) => {
							uni.hideLoading();
							if (res.result.order_no) {
								wx.navigateTo({
									url: `/pages/pay/pay?order_no=${res.result.order_no}`
								})
							} else {
								wx.showToast({
									icon: 'none',
									duration: 3000,
									title: res.result
								})
							}
						},
						fail: () => {
							uni.hideLoading();
							console.log('失败')
						}
					})
				} else {
					wx.navigateTo({url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'})
				}
			},
			// 返回上一页
			navBack() {
				this.$mRouter.back();
			},
      hide() {
        this.kefuShow = false;
      },
			// 弹窗显示
			showPopupService(type, list) {
				if (list.length === 0) return;
				this[type] = 'show';
			},
			// 关闭服务弹窗
			hideService() {
				this.specClass = 'none';
				this.couponClass = 'none';
				this.serviceClass = 'none';
				this.ladderPreferentialClass = 'none';
				this.attributeValueClass = 'none';
				this.fullGiveClass = 'none';
			},
			// 获取优惠券
			async getCoupon(item) {
				if (!this.hasLogin) {
					await wx.navigateTo({url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'})
					return;
				}
				await this.$http
					.post(`${couponReceive}`, {
						id: item.id
					})
					.then(() => {
						wx.showToast({
							title: '领取成功',
							icon: 'none',
							duration: 3000
						});
					});
			},
			// 跳转至评价列表
			toEvaluateList() {
				if (!this.product.evaluateStat || parseInt(this.product.comment_num, 10) === 0) return;
				this.$mRouter.push({
					route: `/pages/order/evaluation/list?comment_num=${
						this.product.comment_num
					}&evaluateStat=${JSON.stringify(this.product.evaluateStat)}`
				});
			},
			// 顶部tab点击
			tabClick(index, state) {
				this.page = 1;
				this.addressList.length = 0;
				this.tabCurrentIndex = index;
				this.state = state;
				const api = (this.state === 1 ? addressList : pickupPointIndex);
				this.getAddressList(api);
			},	// 获取收货地址列表
			async getAddressList(api) {
				await this.$http
					.get(api, {
					})
					.then(r => {
						this.addressList = r.data;
					});
			},
			// 规格弹窗开关
			toggleSpec(row) {
				if (!this.product.id) return;
				if (this.specClass === 'show') {
					this.currentStock = row.stock;
					this.currentSkuPrice = row.price;
					this.currentSkuName = row.skuName;
					this.currentCartCount = row.cartCount;
					const skuId = row.skuId;
					if (parseInt(this.currentStock, 10) === 0) {
						wx.showToast({
							title: '库存不足',
							icon: 'none',
							duration: 3000
						});
						return;
					}
					if (this.cartType === 'cart') {
						this.handleCartItemCreate(skuId);
					} else if (this.cartType === 'buy') {
						this.buy(skuId);
					}
					this.cartType = null;
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			// 海报弹窗开关
			// async openPoster() {
			// 	this.$mHelper.toast('该版本不支持生成海报');
			// },
			// hideSpec() {
			// 	this.specClass = 'hide';
			// 	setTimeout(() => {
			// 		this.specClass = 'none';
			// 	}, 250);
			// },
			// hideShareSpec() {
			// 	this.shareClass = 'hide';
			// 	setTimeout(() => {
			// 		this.shareClass = 'none';
			// 	}, 250);
			// },
			async buy(skuId) {
        const params = {};
        params.data = JSON.stringify({ sku_id: skuId, num: this.currentCartCount });
				if (
					this.product.point_exchange_type === '2' ||
					this.product.point_exchange_type === '4' ||
					(this.product.point_exchange_type === '3' &&
						this.isPointExchange)
				) {
					params.type = 'point_exchange';
				} else {
					params.type = this.type;
				}
				this.$mRouter.push({
					route: `/pages/order/create/order?data=${JSON.stringify(params)}&promo_code=${this.promoCode}`
				});
			},
			addCart(type, isPointExchange) {
				if (!this.product.id) return;
				if (!this.hasLogin) {
					wx.navigateTo({url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'})
					return;
				}
				this.specClass = 'show';
				this.cartType = type;
				this.isPointExchange = isPointExchange;
			},
			stopPrevent() {}
    }
  };
</script>
<style lang="scss">
.rf-product-detail {
	.img {
		width: 100%;
	}
	.introduce-section .introduce-first-line .price-box .price-first-line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		font-size: 28rpx;
	}
	.introduce-first-line {
		padding-bottom: 0;
	}
	.introduce-second-line {
		padding-top: 10rpx;
		padding-bottom: 30rpx;
	}
	.introduce-section .data {
		padding: 0;
	}
	.page-bottom-price {
		height: 100rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		.price {
			font-size: 42rpx;
		}
	}
	.kefu-btn {
		background: none;
		border: none;
		&::after {
			display: none;
		}
	}
	.back-btn {
		position: fixed;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.carousel {
		height: 722upx;
		position: relative;
		swiper {
			height: 100%;
		}
		.image-wrapper {
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.01);
			image {
				width: 100%;
				height: 100%;
			}
			.content {
				position: absolute;
				right: $spacing-base;
				bottom: $spacing-base;
			}
		}
	}
	.detail {
		padding-bottom: 160upx;
	}
	.service {
		padding: $spacing-base $spacing-lg 0;
		.row {
			font-size: $font-lg;
			margin-bottom: $spacing-sm;
		}
	}
	.selected-text {
		margin-right: 4upx;
	}
	.sub-list {
		margin: 40upx 0 80upx;
		.row {
			width: 100%;
			margin-bottom: $spacing-lg;
		}
	}
	.share-bg {
		image {
			position: fixed;
			z-index: 100;
			width: 70vw;
			height: 45vw;
			right: $spacing-base;
			top: $spacing-base;
		}
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;
		.rf-list {
			max-height: 60vh;
			padding-bottom: 0;
			margin-bottom: $spacing-sm;
		}
	}
	// 拼团公告
	.rf-swiper-slide {
		margin-top: 20upx;
		.label {
			margin-left: 10upx;
		}
	}
	// 玩法介绍
	.play-way {
		background-color: $color-white;
		padding: 0 20upx;
		margin: 20upx 0;
		font-size: $font-base;
		.title {
			border-bottom: 1px solid #eee;
			padding: $spacing-base 0;
			display: flex;
			justify-content: space-between;
			.iconfont {
				margin-left: 0.13rem;
				font-size: 0.28rem;
				color: #717171;
			}
		}
		.way {
			font-size: $font-base - 2upx;
			padding: 20upx 0;
			display: flex;
			.item {
				flex: 1;
				text-align: center;
				.tip {
					font-size: 0.22rem;
					color: #a5a5a5;
				}
			}
			.arrow {
				width: 40upx;
				.iconfont {
					color: $font-color-light;
					font-weight: 100;
				}
			}
		}
	}
	.assemble {
		background-color: #fff;
		.assemble-item {
			height: 120upx;
			border-bottom: 1px solid #f0f0f0;
			.pictxt {
				display: flex;
				justify-content: space-between;
				.picture {
					display: flex;
					image {
						width: 80upx;
						height: 80upx;
						margin: 20upx 0;
						border-radius: 50%;
					}
					.text {
						line-height: 120upx;
						margin-left: 20upx;
					}
				}
				.right {
					display: flex;
					align-items: center;
					.time-wrapper {
						text-align: right;
						margin-right: 20upx;
						.lack {
							font-size: $font-sm;
							.font-color-red {
								margin: 0 4upx;
							}
						}
						.time {
							font-size: $font-sm;
							color: $font-color-light;
						}
					}
					.spellBnt {
						font-size: $font-sm;
						width: 120upx;
						height: 48upx;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 48upx;
					}
				}
			}
		}
	}
	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}
		.tit {
			width: 140upx;
		}
		.con {
			flex: 1;
			color: $font-color-dark;
			.selected-text {
				margin-right: 10upx;
			}
		}
		.bz-list {
			height: 40upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
			.buy-now {
				color: $uni-color-primary;
			}
		}
		.red {
			color: $uni-color-primary;
		}
	}
	.kefu-bg {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 98;
		image {
			width: 60vw;
			height: 60vw;
			border-radius: 12upx;
			z-index: 98;
		}
	}
}
</style>
