// import user from './modules/user.js'
// 改为uni_modules/uni-id-pages里的store来获取用户信息和是否登录
import member from './modules/member.js';
import location from './modules/location.js';
import template from './modules/template.js';

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		// user,
		member,
		location,
		template
	},
	state: {
		themeColor: ''
	},
	getters: {
		// 全局配置
		// themeColor: state => {
			// let theme = state.themeColor;
			// if (!theme) {
			// 	theme = $mConstDataConfig.themeList.filter((item) => item.name === ($mSettingConfig.styleType || 'rf'))[0];
			// }
			// return theme;
		// },
		// 判断用户是否登录
		// hasLogin: state => {
		// 	return !!state.accessToken;
		// }
	},
	mutations: {
		setThemeColor(state, val) {
			state.themeColor = val;
			uni.setStorageSync('themeColor', val);
		},
	},
	strict: true
})
// #endif

// 小程序会报重复定义vuex
// // #ifdef VUE3
// import {createStore} from 'vuex'
// const store = createStore({
// 	modules: {
// 		user,
// 		member,
// 		location,
// 		template,
// 	}
// })
// // #endif

export default store