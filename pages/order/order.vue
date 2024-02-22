<template>
	<view class="order">
		<!--搜索导航栏-->
		<!-- <view class="order-search" @tap="navTo(`/pages/index/search/search?keyword=搜索我的订单&type=order`)">
			<view class="order-search-input">请输入订单关键字</view>
			<view class="iconfont iconsousuo2"></view>
		</view> -->
		<!--导航栏-->
		<view class="navbar">
			<view
				v-for="(item, index) in navList"
				:key="index"
				class="nav-item"
				:class="tabCurrentIndex === index ? `text-${tempName} current` : ''"
				@tap="tabClick(index)"
			>
				{{ item.text }}
			</view>
		</view>
			
		<!--订单列表-->
		<swiper
			class="swiper-box"
			duration="300"
			@change="changeTab"
		>
			<swiper-item
				class="tab-content"
				v-for="(tabItem, tabIndex) in navList"
				:key="tabIndex"
			>
				<scroll-view
					class="list-scroll-content"
					scroll-y
					@scrolltolower="getMoreOrderList"
					@refresherrefresh="refresherrefreshFun"
					@refresherpulling="refresherpullingFun"
					:refresher-triggered="isRefresher"
					refresher-enabled="true"
				>
					<!-- 订单列表 -->
					<unicloud-db
						:ref="`udb${tabIndex}`"
						v-slot:default="{ data, loading, error, options }"
						:options="formData"
						@error="onqueryerror"
						:where="where"
						:collection="collection"
						:foreign-key="foreignKey"
						:field="field"
						:orderby="orderby"
						@load="load"
						loadtime="onready"
					>
						<view
							v-for="(item, index) in data"
							:key="index"
							class="rf-order-item"
						>
							<view class="i-top b-b">
								<text class="time in1line">订单号：{{ item.order_no }}</text>
								<text class="time">{{item.create_date | time}}</text>
								<text
									class="state"
									:class="'text-' + tempName"
									>{{ item.status | orderStatusFilter }}</text
								>
								<!-- <view class="example-body" v-else>
									<rf-count-down
										:show-day="false"
										:second="second(item.close_time)"
										@timeup="timeUp(item)"
										color="#FFFFFF"
										:background-color="themeColor.color"
										:border-color="themeColor.color"
									/>
								</view> -->
							</view>
							<view
								class="goods-box-single"
								@tap.stop="
									navTo(`/pages/product/product?id=${item.custom.product_id}`)
								"
							>
								<!-- <image
									class="goods-img"
									:src="goodsItem.product_picture"
									mode="aspectFill"
								></image> -->
								<view class="right">
									<text class="title in2line">{{ item.custom.product_name }}</text>
									<!-- <text class="attr-box">{{ item.product_price }}</text> -->
								</view>
							</view>
							<view class="price-box">
								共
								<text class="num">{{ item.custom.product_count }}</text>
								件商品 实付款
								<text class="price" :class="'text-'+tempName">{{ moneySymbol }}{{ item.total_fee / 100 }}</text>
							</view>
							<view class="action-box b-t">
								<button
									class="action-btn"
									:class="'text-' + tempName"
									v-if="item.status == 0"
									@tap="handleOrderOperation(item, 'close')"
								>
									取消订单
								</button>
								<!--              <button class="action-btn recom" v-if="item.status == 2 && item.is_customer == 0" @tap="handleOrderOperation(item, 'delivery')">确认收货</button>-->
								<!-- <button
									class="action-btn"
									:class="'text-' + tempName"
									v-if="item.status == -4"
									@tap="handleOrderOperation(item, 'delete')"
								>
									删除订单
								</button> -->
								<button
									class="action-btn"
									:class="'bg-' + tempName"
									@tap="handleOrderOperation(item, 'detail')"
								>
									订单详情
								</button>
								<button
									class="action-btn"
									:class="'bg-' + tempName"
									v-if="item.status == 0"
									@tap="navTo(`/pages/pay/pay?order_no=${item.order_no}`)"
								>
									立即支付
								</button>
								<!-- <button
									class="action-btn"
									:class="'bg-' + tempName"
									v-if="item.status == 2"
									@tap="handleOrderOperation(item, 'delivery')"
								>
									确认收货
								</button> -->
							</view>
						</view>
						<!-- 
						<rf-empty
							:list="guessYouLikeList"
							info="暂无订单"
							v-if="orderList.length === 0 && !loading"
						></rf-empty> -->
						<!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
						<uni-load-more v-if="loading || options.status === 'noMore'" :status="options.status" />
					</unicloud-db>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 统一支付组件 -->
		<uni-pay ref="uniPay" height="70vh" return-url="/pages/order-detail/order-detail" logo="/static/logo.png"></uni-pay>
	</view>
</template>
<script>
/**
 * @des 订单管理
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-15 11:54
 * @copyright 2019
 */
// import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';
// import { orderDelete, orderList, orderTakeDelivery } from '@/api/userInfo';
// import rfCountDown from '@/components/rf-count-down';
// import { orderClose, guessYouLikeList } from '@/api/product';
import mConstData from '@/config/constData.config';
export default {
	components: {
		// rfLoadMore,
		// rfCountDown
	},
	data() {
		return {
			tabCurrentIndex: 0,
			loadingType: 'more',
			navList: this.$mConstDataConfig.orderNavList,
			moneySymbol: '￥',
			// orderList: [],
			// page: 1,
			loading: true,
			isRefreshing: true,
			guessYouLikeList: [],
			where: '',
			keyword: '',
			// 数据表名
			collection: 'uni-pay-orders',
			// 查询字段，多个字段用 , 分割
			field: '_id,order_no,status,custom,total_fee,create_date,user_id',
			foreignKey: '',
			formData: {
				status: 'loading' // 加载状态
			},
			orderby: '',
			// categorys: {
			// 	index: 0,
			// 	titles: ['全部分类'],
			// 	name: ['00']
			// },
			inputPlaceholder: '请输入搜索内容',
			tipShow: false ,// 是否显示顶部提示框
			isRefresher: false,
		};
	},
	computed: {
		// 计算倒计时时间
		second() {
			return function(val) {
				return Math.floor(val - new Date() / 1000);
			};
		}
	},
	filters: {
		// 时间格式化
		time(val) {
			return moment(val).format('YYYY-MM-DD HH:mm:ss');
		},
		// 状态显示格式化
		orderStatusFilter(orderStatus) {
			let state;
			mConstData.orderStatus.forEach(orderItem => {
				if (orderItem.key === parseInt(orderStatus, 10)) {
					state = orderItem.value;
				}
			});
			return state;
		}
	},
	onLoad(options) {
		/**
		 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
		 * 替换onLoad下代码即可
		 */
		// this.tabCurrentIndex = parseInt(options.state, 10) + 1;
		
		this.where = `user_id==$env.uid`;
		this.orderby = 'create_date desc';
	},
	onShow() {
		console.log('onshow')
	},
	/**
	 * 下拉刷新回调函数
	 */
	// onPullDownRefresh() {
	// 	this.formData.status = 'more';
	// 	this.$refs.udb.loadData(
	// 		{
	// 			clear: true
	// 		},
	// 		() => {
	// 			this.tipShow = true;
	// 			clearTimeout(this.timer);
	// 			this.timer = setTimeout(() => {
	// 				this.tipShow = false;
	// 			}, 1000);
	// 			uni.stopPullDownRefresh();
	// 		}
	// 	);
	// },
	/**
	 * 上拉加载回调函数
	 */
	// onReachBottom() {
	// 	this.$refs.udb.loadMore();
	// },
	methods: {
		// 下拉刷新触发
		refresherpullingFun() {
			this.isRefresher= true
		},
		// 下拉刷新被触发
		refresherrefreshFun() {
			this.formData.status = 'more';
			this.$refs[`udb${this.tabCurrentIndex}`][0].loadData(
				{
					clear: true
				},
				() => {
					console.log('数据返回')
					//数据请求返回后从设刷新状态值
					this.isRefresher = false
				}
			);
		},
		onqueryerror(e) {
			console.error(e);
		},
		load(data, ended) {
			// console.log('load data', data);
			// console.log('load ended', ended);
			if (ended) {
				this.formData.status = 'noMore';
			}
		},
		// 倒计时关闭订单
		// timeUp(item) {
		// 	if (this.isRefreshing) {
		// 		this.isRefreshing = false;
		// 		this.handleOrderClose(item.id);
		// 	}
		// },
		// 订单操作
		handleOrderOperation(item, type) {
			// console.log(item)
			switch (type) {
				case 'detail': // 订单详情
					this.navTo(`/pages/order-detail/order-detail?order_no=${item.order_no}`);
					break;
				// case 'evaluation': // 我要评价
				// 	this.navTo(`/pages/order/evaluation/evaluation?order_id=${item.id}`);
				// 	break;
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
		// 跳转页面
		navTo(route) {
			wx.navigateTo({
				url: route
			})
			// this.$mRouter.push({ route });
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
				setTimeout(() => {
					this.$refs[`udb${this.tabCurrentIndex}`][0].loadData(
						{
							clear: true
						}
					);
				})
			}
		},
		// 删除已关闭订单
		async handleOrderDelete(id) {
			await this.$http.delete(`${orderDelete}?id=${id}`, {}).then(() => {
				wx.showToast({
					title: '订单删除成功',
					icon: 'none',
					duration: 3000
				});
				setTimeout(() => {
					this.page = 1;
					this.orderList.length = 0;
					this.getOrderList();
				}, 500);
			});
		},
		// 确认收货
		async handleOrderTakeDelivery(id) {
			await this.$http
				.get(`${orderTakeDelivery}`, {
					id
				})
				.then(() => {
					this.page = 1;
					this.orderList.length = 0;
					this.getOrderList();
				});
		},
		// 数据初始化
		// async initData() {
		// 	this.page = 1;
		// 	this.orderList.length = 0;
		// 	// await this.getOrderList();
		// },
		// 获取订单列表
		async getOrderList() {
			this.$refs[`udb${this.tabCurrentIndex}`][0].loadMore();
		},
		// 监听swiper切换
		changeTab(e) {
			this.tabCurrentIndex = e.target.current;
			this.formData.status = 'loading';
			let status = ''
			if (this.tabCurrentIndex === 0) {
				// 全部
				status = ''
			} else if (this.tabCurrentIndex === 1) {
				// 待付款
				status = '&&status==0'
			} else if (this.tabCurrentIndex === 2) {
				// 已完成
				status = '&&status==1'
			} else if (this.tabCurrentIndex === 3) {
				// 已取消
				status = '&&status==-1'
			}
			this.where = `user_id==$env.uid${status}`
			console.log('this.where', this.where)
			setTimeout(() => {
				this.$refs[`udb${this.tabCurrentIndex}`][0].loadData(
					{
						clear: true
					}
				);
			})
		},
		// 顶部tab点击
		tabClick(index) {
			console.log('index', index)
			this.tabCurrentIndex = index;
			this.formData.status = 'loading';
			let status = ''
			if (this.tabCurrentIndex === 0) {
				// 全部
				status = ''
			} else if (this.tabCurrentIndex === 1) {
				// 待付款
				status = '&&status==0'
			} else if (this.tabCurrentIndex === 2) {
				// 已完成
				status = '&&status==1'
			} else if (this.tabCurrentIndex === 3) {
				// 已取消
				status = '&&status==-1'
			}
			this.where = `user_id==$env.uid${status}`
			console.log('this.where', this.where)
			setTimeout(() => {
				this.$refs[`udb${this.tabCurrentIndex}`][0].loadData(
					{
						clear: true
					}
				);
			})
		},
		// 滚动到底部
		getMoreOrderList() {
			// console.log('getMoreOrderList', this.$refs.udb)
			// console.log(this.$refs.udb0)
			// this.$refs.udb.loadMore();
      // if (this.loadingType === 'nomore' || this.orderList.length === 0) return;
			// this.page++;
			this.getOrderList();
		}
	}
};
</script>
<style lang="scss">
page,
.order {
	background: $page-color-base;
	height: 100%;
	.order-search {
		padding: $spacing-sm $spacing-base;
		position: relative;
		.order-search-input {
			width: 100%;
			background-color: $color-white;
			border-radius: 40upx;
			padding: $spacing-sm 0 $spacing-sm $spacing-lg;
			color: $font-color-light;
		}
		.iconfont {
			position: absolute;
			right: 48upx;
			top: 22upx;
		}
	}
	.swiper-box {
		height: calc(100% - 80upx);
	}
	.list-scroll-content {
		height: 100%;
	}
	.uni-swiper-item {
		height: auto;
	}
}
</style>
