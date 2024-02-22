<template>
	<!--
	 本页面模板教程：https://ext.dcloud.net.cn/plugin?id=2717
	 uni-list 文档：https://ext.dcloud.net.cn/plugin?id=24
	 uniCloud 文档：https://uniapp.dcloud.io/uniCloud/README
	 unicloud-db 组件文档：https://uniapp.dcloud.net.cn/uniCloud/unicloud-db-component
	 DB Schema 规范：https://uniapp.dcloud.net.cn/uniCloud/schema
	 -->
	<view class="article">
		<view class="article-title">{{ title }}</view>
		<unicloud-db v-slot:default="{data, loading, error, options}" :options="formData" collection="opendb-news-articles"
			:field="field" :getone="true" :where="sWhere" :manual="true" ref="detail" @load="loadData">
			<template v-if="!loading && data">
				<view class="banner">
					<!-- 文章开头，缩略图 -->
					<image class="banner-img" :src="data.imgSrc" mode="widthFix"></image>
					<!-- 文章摘要 -->
					<view class="banner-title">
						<text class="uni-ellipsis">{{data.name}}</text>
					</view>
				</view>
				<view class="article-content">
					<rich-text :nodes="data.content"></rich-text>
				</view>
			</template>
		</unicloud-db>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				// 当前显示 _id
				id: "",
				title: 'title',
				// 数据表名
				// 查询字段，多个字段用 , 分割
				sWhere: '',
				field: '_id,name,imgSrc,title,content',
				formData: {
					noData: '<p style="text-align:center;color:#666">详情加载中...</p>'
				},
			}
		},
		onLoad(event) {
			console.log(event);
			// event = {"id":"60783c5cb781700001375672","title":"阿里小程序IDE官方内嵌uni-app，为开发者提供多端开发服务","excerpt":"阿里小程序IDE官方内嵌uni-app，为开发者提供多端开发服务","avatar":"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-gacrhzeynhss7c6d04/249516a0-3941-11eb-899d-733ae62bed2f.jpg"}
			//获取真实新闻id，通常 id 来自上一个页面
			if (event.id) {
				this.id = event.id
			}
			//若上一页传递了标题过来，则设置导航栏标题
			if (event.title) {
				this.title = event.title
				uni.setNavigationBarTitle({
					title: event.title
				})
			}
		},
		onReady() {
			// 开始加载数据，修改 where 条件后才开始去加载 clinetDB 的数据 ，需要等组件渲染完毕后才开始执行 loadData，所以不能再 onLoad 中执行
			if (this.id) { // ID 不为空，则发起查询
				this.sWhere = "_id=='" + this.id + "'"
				console.log('this.sWhere', this.sWhere)
				// this.$nextTick(() => {
				// 	this.$refs.detail.loadData()
				// })
			} else {
				uni.showToast({
					icon: 'none',
					title: this.$t('listDetail').newsErr
				})
			}
		},
		methods: {
			loadData(data) {
				//如果上一页未传递标题过来（如搜索直达详情），则从新闻详情中读取标题
				if (this.title == '' && data[0].title) {
					this.title = data[0].title
					uni.setNavigationBarTitle({
						title: data[0].title
					});

				}
			},
		}
	}
</script>

<style lang="scss">
	.header-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 14px;
	}

	/* 标题 */
	.uni-title {
		display: flex;
		margin-bottom: 5px;
		font-size: 14px;
		font-weight: bold;
		color: #3b4144;
	}

	/* 描述 额外文本 */
	.uni-note {
		color: #999;
		font-size: 12px;

		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.footer {
		display: flex;
		align-items: center;
	}

	.footer-button {
		display: flex;
		align-items: center;
		font-size: 12px;
		height: 30px;
		color: #fff;
		background-color: #ff5a5f;
	}

	.banner {
		position: relative;
		margin: 0 15px;
		height: 180px;
		overflow: hidden;
	}

	.banner-img {
		position: absolute;
		width: 100%;
	}

	.banner-title {
		display: flex;
		align-items: center;
		position: absolute;
		padding: 0 15px;
		width: 100%;
		bottom: 0;
		height: 30px;
		font-size: 14px;
		color: #fff;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		box-sizing: border-box;
	}

	.uni-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.article-title {
		padding: 20px 15px;
		padding-bottom: 0;
	}

	.article-content {
		padding: 15px;
		font-size: 15px;
		overflow: hidden;
		img {
			width: 100%;
		}
	}
</style>
