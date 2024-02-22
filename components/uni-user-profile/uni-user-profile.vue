<template>
	<uni-popup ref="popup" type="bottom">
		<view class="popup-box">
			<text class="headBox">申请获得以下权限</text>
			<text class="tip">获得你的公开信息（昵称、头像）</text>
			<view class="btnBox">
				<text @click="closeMe" class="close">取消</text>
				<button class="agree" type="warn" @click="getUserProfile">确定</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import {
			store,
			mutations
		} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database();
	const usersTable = db.collection('uni-id-users')
	// let userId = ''
	export default {
		emits:['next'],
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin(){
				return store.hasLogin
			},
		},
		data() {
			return {
				userId: '',
				openid: ''
			}
		},
		methods: {
			async open(uid, openid){
				// console.log('openid**', openid)
				this.userId = uid
				this.openid = openid
				this.$refs.popup.open()
			},
			async getUserProfile(){
				uni.showLoading();
				let res = await new Promise((callBack) => {
					uni.getUserProfile({
						desc: "用于设置账户昵称和头像",
						complete: (e) => {
							console.log("getUserProfile:", e);
							callBack(e)
						}
					})
				})
				console.log("res**", res);
				if(res.errMsg != "getUserProfile:ok"){
					return this.closeMe()
				}
				let {avatarUrl,nickName} = res.userInfo,				
					cloudPath = this.userId+'/'+Date.now()+'avatarUrl.jpg';
				
				let tempFilePath = await new Promise((callBack)=>{
					uni.downloadFile({
					    url: avatarUrl,
					    success: (res) => {
					        if (res.statusCode === 200) {
					            console.log('下载成功', res.tempFilePath);
								callBack(res.tempFilePath)
					        }
							callBack()
					    },
						fail: (err) => {
							console.error(err)
						},
						complete: (e) => {
							// console.log("downloadFile",e);
						}
					});
				})
				// console.log(tempFilePath);
				const result = await uniCloud.uploadFile({
					filePath: tempFilePath,
					cloudPath,
					fileType:'image'
				});
				// console.log("上传成功",{result});
				// console.log('userId', this.userId)
				// console.log('openid', this.openid)
				let userInfo = {
					"nickname":nickName,
					// 加在这里会加入到user表里，因为权限问题会报错
					// "wx_openid": {
					// 	"mp-weixin": openid
					// },
					// "isVip": false,
					"avatar_file":{
						name:cloudPath,
						extname:"jpg",
						url:result.fileID
					}
				}
				this.doUpdate(userInfo,()=>{
					this.$refs.popup.close()
				})
			},
			closeMe(e){
				uni.showLoading();
				this.doUpdate({nickname:"微信匿名用户"},()=>{
					uni.hideLoading()
					this.$refs.popup.close()
				})
			},
			doUpdate(data,callback){
				// console.log('dododo',data);
				// 使用 clientDB 提交数据
				usersTable.where('_id==$env.uid').update(data).then((res) => {
					// console.log(res);
					// 返回前端openid和userId
					data = Object.assign(data, {
						"wx_openid": {
							"mp-weixin": this.openid
						},
						"openid": this.openid,
						"_id": this.userId
					})
					mutations.setUserInfo({
					  ...data
					})
					callback(res)
				}).catch((err) => {
					uni.showModal({
						content: err.message ||
							'请求服务失败',
						showCancel: false
					})
					callback(err)
				}).finally(() => {
					this.$emit('next')
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
view{
	display: flex;
}
.popup-box{
	background-color: #FFFFFF;
	height:200px;
	width: 750rpx;
	flex-direction: column;
	border-radius: 15px 15px 0 0;
}
.headBox{
	padding:20rpx;
	height:80rpx;
	line-height:80rpx;
	text-align: left;
	font-size:32upx;
	color:#333333;
	margin-left: 15rpx;
}
.tip{
	color:#666666;
	text-align: left;
	justify-content: center;
	margin:10rpx 30rpx;
	font-size:36rpx;
}
.btnBox{
	margin-top:45rpx;
	justify-content: center;
	flex-direction: row;
}
.close,.agree{
	text-align: center;
	width:200rpx;
	height:80upx;
	line-height:80upx;
	border-radius:50px;
	margin:0 20rpx;
	font-size:36rpx;
}
.close{
	color:#999999;
	border-color: #EEEEEE;
	border-style: solid;
	border-width: 1px;
	background-color:#FFFFFF;
}
.close:active{
	color:#989898;
	background-color:#E2E2E2;
}
.agree{
	background-color:#09BB07;
	color:#FFFFFF;
}
/* #ifdef MP */
.agree::after {
   border: none;
}
.agree{
	background-color:#09BB07;
}
/* #endif */
.agree:active{
	background-color:#F5F5F6;
}
</style>
