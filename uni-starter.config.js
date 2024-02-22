//这是应用的配置页面，App.vue挂载到getApp().globalData.config
export default {
	"h5": {
		"url": "https://uni-starter.dcloud.net.cn", //	前端网页托管的域名	
		// 在h5端全局悬浮引导用户下载app的功能 更多自定义要求在/common/openApp.js中修改	
		// "openApp": { //如不需要本功能直接移除本节点即可	
		// 	//点击悬浮下载栏后打开的网页链接
		// 	"openUrl": '/#/pages/ucenter/invite/invite',
		// 	//左侧显示的应用名称	
		// 	"appname": 'uni-starter',
		// 	//应用的图标	
		// 	"logo": './static/logo.png',
		// }
	},
	"mp": {
		"weixin": {
			//微信小程序原始id，微信小程序分享时 wx36a1471331a351a5 原始id也要改
			"id": "gh_1396e03ed3d9" // 贝贝听书小程序原始id要修改
		}
	},
	"router": {
		/*
			名词解释：“强制登陆页”
				在打开定义的需强制登陆的页面之前会自动检查（前端校验）uni_id_token的值是否有效,
				如果无效会自动跳转到登陆页面
			两种模式：
				1.needLogin：黑名单模式。枚举游客不可访问的页面。
				2.visitor：白名单模式。枚举游客可访问的页面。
			* 注意：黑名单与白名单模式二选一
		*/
		// "needLogin" : [
		// 	"/pages/ucenter/ucenter",
		// 	"pages/ucenter/userinfo/userinfo",
		// 	"/pages/ucenter/userinfo/userinfo"
		//  	// {pattern:/^\/pages\/list.*/},	//支持正则表达式
		// 	// "/uni_modules/uni-news-favorite/pages/uni-news-favorite/list",
		// 	// "/uni_modules/uni-feedback/pages/uni-feedback/add"
		// ],
		// 修改这里，需要重新部署小程序
		"visitor": [
			"/", //注意入口页必须直接写 "/"
			{
				"pattern": /^\/pages\/list.*/
			}, //支持正则表达式
			{
				"pattern": /^\/pages\/ucenter\/login-page.*/
			},
			"/pages/common/webview/webview",
			"/pages/ucenter/ucenter",
			"/pages/member/index",
			"/pages/media-detail/media-detail",
			"/pages/media-list/media-list",
			"/pages/media-list/search",
			"/pages/media-list/search-result",
			"/uni_modules/uni-id-pages/pages/login/login-withoutpwd",
			"/uni_modules/uni-id-pages/pages/login/login-withpwd",
			"/uni_modules/uni-id-pages/pages/login/login-smscode",
			"/uni_modules/uni-id-pages/pages/register/register",
			"/uni_modules/uni-id-pages/pages/register/register-by-email",
			"/uni_modules/uni-id-pages/pages/register/register-admin",
			"/uni_modules/uni-id-pages/pages/retrieve/retrieve",
			"/uni_modules/uni-id-pages/pages/common/webview/webview"
		],
		/*
		login:配置登陆类型与优先级
			未列举到的，或设备环境不支持的选项，将被隐藏。如果你需要在不同平台有不同的配置，直接用条件编译即可
			根据数组的第0项，决定登录方式的第一优先级。
		*/
		// "login": ["username","univerify","weixin", "smsCode", "apple"]
		"login": [
			// #ifdef MP
			"weixin",
			// #endif
			// "smsCode",
			// #ifndef MP
			"username", "smsCode"
			// #endif
		]
	},
	//关于应用
	"about": {
		//应用名称
		"appName": "贝贝听书",
		//应用logo
		"logo": "/static/logo.png",
		//公司名称
		"company": "杭州余杭鲸禧贸易商行",
		//口号
		"slogan": "免费提供儿歌故事，睡前故事，童话故事，儿童睡前故事，早教科普，同步教材等有声读物，随时随地让小朋友进入声音世界，开拓眼界和见识",
		//应用的链接，用于分享到第三方平台和生成关于我们页的二维码
		"download": "",
		//version
		"version": "1.0.0" //用于非app端显示，app端自动获取
	},
	"download": { //用于生成二合一下载页面
		"ios": "https://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8",
		"android": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-97fca9f2-41f6-449f-a35e-3f135d4c3875/6d754387-a6c3-48ed-8ad2-e8f39b40fc01.apk"
	},
	//用于打开应用市场评分界面
	"marketId": {
		"ios": "id1417078253",
		"android": "123456"
	},
	//配置多语言国际化。i18n为英文单词 internationalization的首末字符i和n，18为中间的字符数 是“国际化”的简称
	"i18n": {
		"enable": false //默认启用，国际化。如果你不想使用国际化相关功能，请改为false
	}
}