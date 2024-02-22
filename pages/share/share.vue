<template>
  <view class="share-page">
    <view class="share-page-box" id="box" v-if="show" :style="{width: canvasWidth + 'px', height: canvasHeight + 'px' }">
      <wxml-to-canvas id="widget" class="widget" :width="canvasWidth" :height="canvasHeight"></wxml-to-canvas>
    </view>
    <view class="share-page-box msg-box" v-else :style="{width: canvasWidth + 'px', height: canvasHeight + 'px' }">
      {{msg}}
    </view>
    <view class="share-page-btn" @tap="extraImage">
			<button :class="'btn-big bg-' + tempName">保存图片</button>
    </view>
  </view>
</template>
<script>
const { wxml, style } = require('./DomData.js')
export default {
  name: '',
  data () {
    return {
      uuid: '', // 名片uuid
      userUuid: '', // 名片用户uuid
      src: '', // 头像
      show: false, // 是否显示canvas
      qrCodeUrl: '', // 小程序码
      userName: '', // 名片名称
      canvasWidth: 320, // 默认canvas宽高
      canvasHeight: 380,
      number: "", // 勋章数
      medal: "", // 勋章数
      yj: "", // 已捐步数
      screenWidth: null, // 设备宽度
			userName: '',
			name: '',
			id: '',
			pic: '',
			chapter1: '',
			chapter2: '',
			freeList: [],
			photo: '',
			qr: 'http://yzwpic.weimayi.cn/miniapp/logo/%E8%B4%9D%E8%B4%9D%E5%90%AC%E4%B9%A6%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%A0%81.jpg',
			bg: 'http://yzwpic.weimayi.cn/miniapp/class/bg3.png', // bg3 bg9 bg12比较合适
      msg: '加载中，请稍等...', // 提示语
    }
  },
  onLoad (options) {
    console.log('options', options);
		console.log(decodeURIComponent(options.n))
		this.userName = decodeURIComponent(options.u) || ''
    this.name = decodeURIComponent(options.n) || ''
    this.id = options.id || ''
    this.pic = decodeURIComponent(options.l) || ''
    this.photo = decodeURIComponent(options.p) || ''
    this.chapter1 = decodeURIComponent(options.c1) || ''
    // this.chapter2 = options.c2 || ''
		
		this.freeList = uni.getStorageSync('freeList') || []
    
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) =>{
        this.screenWidth = res.screenWidth

        // this.canvasWidth = this.screenWidth * 0.9
        // this.canvasHeight = this.screenWidth * 1.1
				console.log('this.canvasWidth', this.canvasWidth)
        // 调用接口 获取相关信息
        // this.getMedal()
        console.log('screenWidth', this.screenWidth)

        this.show = true
        // 数字容器宽度 动态设置 
        setTimeout(() => {
          wx.showLoading({title: '海报生成中...'})
					console.log('海报生成中...')
					// #ifdef H5
					// this.widget = document.getElementById('widget')
					this.widget = this.selectComponent('.widget')
					// #endif
					// #ifndef H5
					this.widget = this.selectComponent('.widget')
					// #endif
          this.renderToCanvas()
        }, 1000)
      }
    });
  },
  methods: {
		// 永久解锁
		unlock() {
			return uniCloud.callFunction({
				name: 'unlock',
				data: {
					"id": this.id
				},
				success: (res) => {
					console.log('执行成功', res)
					// uni.showToast({
					// 	title: '解锁成功，赶快收听吧',
					// 	icon: 'none',
					// 	duration: 2500
					// });
				},
				fail: () => {
					console.log('执行失败')
					// uni.showToast({
					// 	title: '解锁失败',
					// 	icon: 'none'
					// });
				}
			})
		},
    // wxml 转 canvas
    renderToCanvas () {
      console.log('this.widget', this.widget)
			console.log('this.photo', this.photo)
			console.log('this.userName', this.userName)
      const _wxml = wxml(this.photo, this.userName, this.name, this.pic, this.qr, this.bg, this.chapter1)
      const _style = style(this.canvasWidth, this.canvasHeight)
      const p1 = this.widget.renderToCanvas({ wxml: _wxml, style: _style })
      p1.then((res) => {
        console.log('海报生成成功');
        wx.hideLoading()
        // this.container = res
      }).catch((err) => {
				wx.hideLoading()
				wx.showToast({title: '海报生成失败', icon: 'none'})
        console.log('生成失败')
      })
    },
   // 保存到朋友圈
  extraImage() {
    if (!this.show) {
      wx.showToast({title: '海报生成失败', icon: 'none'})
      return
    }
    const p2 = this.widget.canvasToTempFilePath()
    let that = this
    p2.then(result => {
      let path = result.tempFilePath
      wx.getSetting({
        success: res => {
          // 非初始化且未授权的情况，需要再次弹窗提示授权
          if (res.authSetting['scope.writePhotosAlbum'] != undefined && res.authSetting['scope.writePhotosAlbum'] != true) {
            wx.showModal({
              title: '是否授权相册权限',
              content: '需要获取相册权限，请确认授权，否则无法使用相关功能',
              success: res => {
                if (res.confirm) {
                  wx.openSetting({
                    success: dataAu => {
                      if (dataAu.authSetting["scope.writePhotosAlbum"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'none',
                          duration: 1000
                        });
                        that.saveIMg(path);
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'success',
                          duration: 1000
                        });
                      }
                    }
                  });
                }
              }
            });
          } else {
            // 初始化且未授权，系统默认会弹窗提示授权
            // 非初始化且已授权，也会进入这里
            that.saveIMg(path);
          }
        }
      });
    })
  },
   // 保存到相册
  async saveIMg (tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: async (res) => {
				// 解锁之后存到缓存里
				// this.freeList.push(this.id)
				// this.freeList = Array.from(new Set(this.freeList))
				// uni.setStorageSync('freeList', this.freeList)
				// await this.unlock();
        wx.showModal({
          content: '图片已保存，分享给好友吧！',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            wx.navigateBack({
              //返回
              delta: 1
            });
          },
          fail: function (res) {
            console.log('res', res);  
          }
        });
      },
  
      fail: function (res) {
        wx.showToast({
          title: '您取消了授权',
          icon: 'none',
          duration: 2000
        })
      }
    });
   }
  }
}
</script>
<style lang="scss" scoped>
.share-page {
  background: #fff;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
	// .widget {
	// 	border-radius: 20rpx;
	// 	overflow: hidden;
	// }
  .msg-box {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  .share-page-box {
    margin: 40rpx auto;
    position: relative;
    overflow: hidden;
		box-shadow: 0rpx 6rpx 20rpx 6rpx rgba(0, 0, 0, 0.2);
  }
  .share-page-btn {
    margin: 0 40rpx 50rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>