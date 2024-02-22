<template>
	<view class="imt-audio" :class="[`${theme}`]" v-if="audiolist.length > 0">
		<!-- <view class="audio-lock" v-if="isShow">
			<button @click="handleShow" class="audio-lock-btn">
				<view class="txt1">转发一次即可解锁全部章节</view>
				<view class="txt2">可获得{{freeHours}}小时免费收听权限</view>
			</button>
		</view> -->
		<template v-if="theme == 'theme3'">
			<slider
				class="audio-slider"
				:activeColor="themeColor"
				block-size="0"
				:value="renderData('current_value')"
				:max="renderData('duration_value')"
				@change="change"
				:disabled="!renderIsPlay"
			></slider>

			<view class="top">
				<view class="audio-control-wrapper">
					<image :src="renderData('coverImgUrl')" mode="aspectFill" class="cover" :class="{ on: !renderData('paused') }"></image>
					
					<image :src="require('./static/loading.png')" v-if="loading" class="play loading"></image>
					<template v-else>
						<image :src="require('./static/playbtn.png')" alt="" @click="operate" class="play" v-if="renderData('paused')"></image>
						<image :src="require('./static/pausebtn.png')" alt="" @click="operate" class="play" v-else></image>
					</template>
				</view>
			</view>
			<view class="audio-wrapper">
				<view class="titlebox">
					<view class="title">{{ renderData('title') }}</view>
					<view class="singer">{{ renderData('singer') }}</view>
				</view>

				<view class="slidebox">
					<view>{{ renderData('current') }}/ {{ renderData('duration') }}</view>
					<view>
						<text @click="changeplay(-1)">上一首</text>
						<text @click="changeplay(1)">下一首</text>
					</view>
				</view>
			</view>
		</template>

		<template v-if="theme == 'theme2'">
			<view class="top">
				<view class="audio-control-wrapper" :style="{backgroundImage: `url(${renderData('coverImgUrl')})`}">
					<image :src="require('./static/loading.png')" v-if="loading" class="play loading"></image>
					<template v-else>
						<image :src="require('./static/playbtn.png')" alt="" @click="operate" class="play" v-if="renderData('paused')"></image>
						<image :src="require('./static/pausebtn.png')" alt="" @click="operate" class="play" v-else></image>
					</template>
				</view>

				<view>
					<view class="title">
						<text>{{ renderData('title') }}</text>
						<view class="audio-number">{{ renderData('current') }}/{{ renderData('duration') }}</view>
					</view>
					<view class="singer">{{ renderData('singer') }}</view>
				</view>
			</view>
		</template>

		<template v-if="theme == 'theme1'">
			<view class="top">
				<view class="audio-control-wrapper">
					<image :src="renderData('coverImgUrl')" mode="aspectFill" class="cover" :class="{ on: !renderData('paused') }"></image>
				</view>
				<view>
					<view class="title">{{ renderData('title') }}</view>
					<!-- <view class="singer">{{ renderData('singer') }}</view> -->
				</view>
			</view>
			<view class="audio-wrapper">
				<view class="audio-number">{{ renderData('current') }}</view>
				<slider
					class="audio-slider"
					:activeColor="themeColor"
					block-size="16"
					:value="renderData('current_value')"
					:max="renderData('duration_value')"
					@change="change"
					:disabled="!renderIsPlay"
				></slider>
				<view class="audio-number">{{ renderData('duration') }}</view>
			</view>

			<view class="audio-button-box">
				<!-- 块退15s -->
				<image :src="require('./static/prev.png')" class="prevbtn" @click="stepPlay(-15)" mode="widthFix"></image>
				<!-- 上一首 -->
				<image :src="require('./static/go.png')" class="prevplay" @click="changeplay(-1)" mode="widthFix"></image>
				<div class="playbox">
					<image :src="require('./static/loading2.png')" v-if="loading" class="play loading"></image>
					<template v-else>
						<!-- 播放 -->
						<image :src="require('./static/playbtn2.png')" alt="" @click="operate" class="play" v-if="renderData('paused')"></image>
						<!-- 暂停 -->
						<image :src="require('./static/pausebtn2.png')" alt="" @click="operate" class="pause" v-else></image>
					</template>
				</div>
				<!-- 下一首 -->
				<image :src="require('./static/go.png')" class="nextplay" @click="changeplay(1)" mode="widthFix"></image>
				<!-- 快进15s -->
				<image :src="require('./static/next.png')" class="nextbtn" @click="stepPlay(15)" mode="widthFix"></image>
			</view>
		</template>
	</view>
</template>

<script>
export default {
	props: {
		theme: {
			type: String, // 主题 'theme1' or 'theme2'
			default: 'theme1'
		},
		themeColor: {
			type: String,
			default: '#42b983'
		},
		// freeHours: {
		// 	type: Number,
		// 	default: 24
		// },
		// isVip: {
		// 	type: Boolean,
		// 	default: false
		// },
		// isShow: {
		// 	type: Boolean,
		// 	default: false
		// }
	},
	data() {
		return {
			playinfo: this.$zaudio.playinfo,
			audiolist: this.$zaudio.audiolist,
			paused: this.$zaudio.paused,
			renderIsPlay: this.$zaudio.renderIsPlay,
			audio: this.$zaudio.renderinfo,
			loading: this.$zaudio.loading,
			action: Symbol('zaudio')
		};
	},
	computed: {
		renderData() {
			return name => {
				if (!this.renderIsPlay) {
					if (name == 'paused') {
						return true;
					}
					
					return this.audio[name];
				} else {
					if (name == 'paused') {
						return this.paused;
					}
					
					return this.playinfo[name];
				}
			};
		}
	},

	mounted() {
		this.$nextTick(() => {			
			let action = this.action;
			this.$zaudio.syncStateOn(action, ({ audiolist, paused, playinfo, renderIsPlay, renderinfo, loading }) => {
				this.audiolist = audiolist;
				this.paused = paused;
				this.playinfo = playinfo;
				this.renderIsPlay = renderIsPlay;
				this.audio = renderinfo;
				this.loading = loading;
				// console.log('**renderinfo.isLock', this.audio.isLock)
				// if (this.audio.isLock) {
				// 	// console.log('触发show')
				// 	this.$emit('show', true)
				// }
			}); 
			 
 		});
	},
	methods: {
		// handleShow() {
		// 	this.$emit('show', true)
		// },
		//播放or暂停
		operate() {
			console.log('播放or暂停', this.$zaudio)
			console.log('this.audio.isLock', this.audio.isLock)
			if (this.audio.isLock) {
				this.$emit('show', true)
			} else {
				this.$zaudio.operate();
			}
		},
		//进度拖到
		change(event) {
			console.log('进度拖到', event)
			if (this.renderIsPlay) {
				this.$zaudio.seek(event.detail.value);
			}
		},
		//快进
		stepPlay(value) {
			this.$zaudio.stepPlay(value);
		},
		//切歌
		changeplay(count) {
			console.log('切歌', count)
			// this.$zaudio.changeplay(count);
			// 在页面播放时，已经控制了，所以这里其实不控制也没关系
			// console.log('audio', this.audio)
			// console.log('audiolist', this.audiolist)
			let i = 0
			this.audiolist.forEach((item, index) => {
				if (item.title == this.audio.title) {
					i = index
				}
			})
			this.$zaudio.changeplay(count);
			// console.log('this.isVip', this.isVip)
			// console.log('切到第', i + count, '首')
			// 下一首是i + 1
			// let next = this.audiolist[i + count]
			// // console.log('next', next)
			// if (next && next.isLock) {
			// 	this.$emit('show')
			// } else {
			// 	this.$zaudio.changeplay(count);
			// }
		}
	},
	beforeDestroy() {
		console.log('播放组件销毁')
		//组件卸载时卸载业务逻辑
		let action = this.action;
		this.$zaudio.syncStateOff(action)
	}
};
</script>

<style scoped lang="scss">
@import './index.scss';
//  #ifdef MP-WEIXIN
.theme3 .audio-slider {
	margin-top: -8px !important;
}
.audio-control-wrapper{
	margin-top: 0px;
}
.audio-lock {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	background: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	z-index: 9;
	height: 390rpx;
	.audio-lock-btn {
		display: flex;
		flex-direction: column;
		background: $color-rf;
		box-shadow: 0px 4px 16px -4px rgba(255, 172, 30, 0.3);
		color: #fff;
		border-radius: 50rpx;
		line-height: 1.2em;
		padding: 10rpx 80rpx;
		border: none;
	}
	.txt1 {
		font-size: 32rpx;
	}
	.txt2 {
		font-size: 28rpx;
	}
}
// #endif
</style>
