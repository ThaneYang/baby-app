<template>
	<view>
		<view v-if="hasLogin" class="box">
			 <navigator url="/pages/vipcard/index">	
				 <view class="home-vip-tag-box">
					 <image class="bg" v-if="userInfo.group_id == 1" :src="statics.vipbg"></image>
					 <image  class="bg" v-else :src="statics.vipBgHas"></image>
					 <view v-if="userInfo.group_id == 1" class="main plr15 flex alcenter space">
						 <view class="tag-no-vip">普通用户</view>
						 <view class="flex alcenter">
							 <text class="ft12 cl-default mr15 ftw500">升级VIP，省更多钱</text>
							 <image class="right-icon" :src="statics.rightIcon"></image>
						 </view>
					 </view>
					 
					 <view v-else class="main plr15 flex alcenter space">
						 <view class="tag-has-vip flex alcenter center">
							 <image class="vip-level-icon" :src="statics.vipLevelImg[0]"></image>
							 <text class="vip-level-means">VIP会员</text>
						 </view>
					 </view>
				 </view>
			 </navigator>
		</view>
		<view v-else class="box pd24_15">
			<view class="text-center ft14 cl-info2">您还没登录，登录后即可享受更多服务</view>
			<view class="flex center mt24">
				<button class="btn-mid" @click="loginAct" :style="getBtnStyle">立即登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default{
		data(){
			return {
				vipLevel:0,//普通用户
			}
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin(){
				return store.hasLogin
			},
		},
		methods:{
			loginAct(){
				this.$emit('loginAct');
			},
			showQrcodeAct(){
				this.$emit('qrcode');
			}
		}
	}
</script>

<style>
	.home-vip-tag-box{
		height: 100rpx;
		width: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 8rpx;
	}
	.home-vip-tag-box .main{
		width: 100%;
		height: 100rpx;
		position: absolute;
		z-index: 2;
		left: 0;
		top: 0;
	}
	.home-vip-tag-box .bg{
		width: 100%;
		height: 100rpx;
	}
	.tag-no-vip{
		width: 128rpx;
		height: 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 600;
		color:#8A8D99;
		text-align: center;
		line-height: 40rpx;
	}
	.tag-has-vip{
		width: 200rpx;
		height: 40rpx;
		background: linear-gradient(180deg, #333333 0%, #000000 100%);
		border-radius: 20rpx;
	}
	.tag-has-vip .vip-level-icon{
		width: 36rpx;
		height: 36rpx;
	}
	.tag-has-vip .vip-level-means{
		font-size: 24rpx;
		margin-left: 8rpx;
		font-weight: 500;
		background: linear-gradient(180deg, #F2DCA9 0%, #C79556 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.home-vip-tag-box .main .right-icon{
		width: 40rpx;
		height: 40rpx;
	}
	.vip-qrcode-tag{
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.btn-vip-money,.btn-vip-adviser{
		width: 208rpx;
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-weight: 600;
		color:#FFFFFF;
	}
</style>
