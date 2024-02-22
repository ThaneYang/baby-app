<template>
	<view class="product">
		<rf-product-detail @product="getProductDetail" :product="productDetail" :config="config"></rf-product-detail>
		<!-- 404页面 -->
		<view v-if="!productDetail.name && !loading">
			暂无数据
		</view>
	</view>
</template>
<script>
/**
 * @des 商品详情
 *
 * @author stav stavyan@qq.com
 * @date 2020-03-23 15:04
 * @copyright 2019
 */
// import { productDetail } from '@/api/product';
import rfProductDetail from '@/components/rf-product-detail';
import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
const db = uniCloud.database(); //代码块为cdb
export default {
	components: {
		rfProductDetail
	},
	data() {
		return {
			productDetail: {},
			loading: true,
			errorInfo: '',
			scrollTop: 0,
			// currentUrl: '',
			config: {}
		};
	},
	computed: {
		userInfo() {
			return store.userInfo
		},
		hasLogin(){
			return store.hasLogin
		},
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	async onLoad(options) {
		this.productId = options.id;
		await this.initData();
		await this.getConfig()
	},
	methods: {
		getConfig() {
			return db
				.collection('config')
				.get()
				.then(res => {
					console.log('config返回结果', res);
					// audit
					this.config = (res.result.data && res.result.data[0] && res.result.data[0]) || {};
					// this.isAudit = data.isAudit;
					// this.qrUrl = data.qrUrl
					// this.payType = data.payType
				});
		},
		// 数据初始化
		async initData() {
      // this.currentUrl = `${this.$mConfig.hostUrl}/pages/product/product?id=${this.productId}`;
			// this.hasLogin = this.$mStore.getters.hasLogin;
			await this.getProductDetail();
		},
		// 获取产品详情
		async getProductDetail() {
			await uniCloud.callFunction({
				name: 'getProductDetail',
				data: {
					"id": this.productId
				},
				success: (res) => {
					console.log('执行成功', res)
					this.loading = false;
					this.productDetail = res.result
					console.log('this.productDetail', this.productDetail)
					uni.setNavigationBarTitle({
						title: this.productDetail.name
					});
				},
				fail: () => {
					console.log('失败')
				}
			})
		},
	}
};
</script>
<style scoped lang="scss">
page {
	background: $page-color-base;
}
</style>
