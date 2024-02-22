import App from './App'
import store from '@/static/js/store/store.js'
import i18n from './lang/i18n'
import $mAssetsPath from '@/config/assets.config.js';
import $mConstDataConfig from '@/config/constData.config.js';
import $mSettingConfig from '@/config/setting.config.js';

// // #ifdef H5
// import wxmlToCanvas from 'wxml-to-canvas'
// console.log('wxmlToCanvas', wxmlToCanvas)
// // #endif

// #ifndef VUE3
import Vue from 'vue'

//权限相关的判断
import {common} from './static/js/mixin/common.js';
Vue.mixin(common);

// 挂载全局方法
import configs from "./common/config.js"
Vue.prototype.configs=configs

import ZAudio from '@/components/uniapp-zaudio/index.js'
// import ZAudio from 'uniapp-zaudio' // npm引用方式

console.log(`ZAudio当前版本`,ZAudio.version)
let zaudio = new ZAudio({
	continuePlay: true, //续播
	autoPlay: true, //自动播放 部分浏览器不支持
})
Vue.prototype.$zaudio = zaudio
Vue.prototype.$mbgColor='#ffffff'
//this.$mbgColor
//模拟初始数据
// var data = [];
// 设置音频数据
//zaudio.setAudio(data)
//渲染第一首音频
// zaudio.setRender(0)

import rfEmpty from '@/components/rf-empty';
import rfLoading from '@/components/rf-loading';

Vue.config.productionTip = false
Vue.prototype.$store = store
// 挂载全局自定义方法
Vue.prototype.$mAssetsPath = $mAssetsPath;
Vue.prototype.$mConstDataConfig = $mConstDataConfig;
Vue.prototype.$mSettingConfig = $mSettingConfig;

Vue.component('rfEmpty', rfEmpty);
Vue.component('rfLoading', rfLoading);
// // #ifdef H5
// Vue.component("wxml-to-canvas", wxmlToCanvas);
// // #endif

App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
// #endif


// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	return {app}
}
// #endif
