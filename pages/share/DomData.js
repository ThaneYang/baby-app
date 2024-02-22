
/**
 *
 *
 * @param {*} photo  用户头像
 * @param {*} name  用户名称
 * @param {*} pic 图片
 * @param {*} qr 二维码图片
 * @param {*} bg 背景图片
 * @param {*} c1 章节标题1
 */
const wxml = (photo, userName, name, pic, qr, bg, c1) =>`
<view class="container">
	<image src="`+bg+`" class="bg"/>
	<view class="head">
		<image src="`+photo+`" class="userPic"/>
		<text class="userName">`+ userName +` 推荐</text>
	</view>
	<image src="`+pic+`" class="pic"/>
	<text class="name">`+ name +`</text>
	<text class="content">`+ c1 +`</text>
	<view class="bottom">
		<image src="`+qr+`"  class="qr"/>
		<text class="qrtext">长按小程序码，前往贝贝听书收听</text>
	</view>
</view>
`

/**
 *
 *
 * @param {*} canvasWidth  画布宽度
 * @param {*} canvasHeight  画布高度
 * @param {*} numberWidth  数字宽度，动态设置
 * @return {*} 
 */
const style = (canvasWidth, canvasHeight) => {
  return {
    "container": {
      width: canvasWidth,
      height: canvasHeight,
      position: 'relative',
      overflow: 'hidden',
			backgroundColor: '#ffffff',
			borderRadius: canvasWidth * 0.05,
    },
		"head":{
		  width: canvasWidth * 0.84,
		  height: canvasWidth * 0.2,
		  flexDirection: 'row',
		  justifyContent: 'self-start',
		  alignItems: 'center',
			marginLeft: canvasWidth * 0.08,
			position: 'relative'
		},
		"userPic": {
		  width: canvasWidth * 0.1,
		  height: canvasWidth * 0.1,
			marginRight: canvasWidth * 0.03,
			borderRadius: canvasWidth * 0.05,
		},
		"userName": {
		  fontSize: 12,
		  color: '#000',
		  width: canvasWidth * 0.5,
			height: 14,
			textAlign: 'left'
		},
    "name":{
      fontSize: 16,
      color: '#000',
      marginLeft: canvasWidth * 0.08,
      width: canvasWidth * 0.84,
      height: 30,
			textAlign: 'center',
			marginBottom: canvasWidth * 0.02,
			position: 'relative',
    },
    "content": {
			fontSize: 12,
			color: '#666',
      width: canvasWidth * 0.84,
      height: 45,
			marginLeft: canvasWidth * 0.08,
    },
    "pic": {
      width: canvasWidth * 0.3,
			height: canvasWidth * 0.3,
			marginLeft: canvasWidth * 0.35,
      marginTop: canvasWidth * 0.03,
			marginBottom: canvasWidth * 0.05,
			overflow: 'hidden',
			position: 'relative',
			display: 'flex',
			justifyContent: 'center'
    },
		"bg": {
			width: canvasWidth,
			height: canvasWidth,
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 0
		},
    "bottom":{
      width: canvasWidth,
      height: canvasWidth * 0.32,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
			backgroundColor: '#fff',
      position: 'absolute',
      bottom: 0,
      left: 0,
			borderRadius: canvasWidth * 0.05,
    },
		"qr": {
		  width: canvasWidth * 0.2,
		  height: canvasWidth * 0.2,
			borderRadius: canvasWidth * 0.1,
			marginBottom: canvasWidth * 0.01,
		},
    "qrtext": {
      fontSize: 12,
      color: '#666',
      width: canvasWidth,
			height: 14,
			textAlign: 'center'
    },
  }
}

module.exports = {
  wxml,
  style
}
