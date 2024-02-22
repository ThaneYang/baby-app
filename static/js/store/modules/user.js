// 上次启动时的用户信息
// 如果是拒绝授权，成为匿名用户，清空缓存，下次再登录的时候，userInfo.openid是空的，userInfo.wx_openid['mp-weixin']这里是有值的
// 已经改为不管是否授权，userInfo.openid都会有值
let userInfoHistory = uni.getStorageSync('userInfo') || {};
console.log('userInfoHistory', userInfoHistory)
let state = {
		//是否已经登录
		// hasLogin: Boolean(Object.keys(userInfoHistory).length),
		// 获取到用户nickname才算登录，用户点击取消授权，获取的nickname为“匿名用户”也算登录成功
		hasLogin: !!(userInfoHistory.nickname || userInfoHistory.username),
		//用户信息
		info: userInfoHistory
	},
	getters = {
		info(state) {
			return state.info;
		},
		hasLogin(state){
			console.log('hasLogin**', state)
			return state.hasLogin;
		}
	},
	mutations = {
		updateUserInfo(state, info) {
			console.log('state.info***',state.info);
			//原有的结合传来的参数
			let _info = state.info;
			state.info = Object.assign({}, _info, info);
			//存储最新的用户数据到本地持久化存储
			uni.setStorageSync('userInfo', state.info);
		},
		getUserInfo(state) {
			console.log('state.info***',state.info);
		},
		login(state, info) { //登录成功后的操作
			//原有的结合传来的参数
			// console.log('info#', info)
			let _info = state.info;
			state.info = Object.assign({}, _info, info);
			console.log('登录成功后的操作', state.info)
			if (state.info && (state.info.nickname || state.info.username)) {
				console.log('设置为已登录')
				state.hasLogin = true;
			}
			// console.log('state.info',state.info);
			//存储最新的用户数据到本地持久化存储
			uni.setStorageSync('userInfo', state.info);
			uni.setStorageSync('uni_id_token', state.info.token)
			uni.setStorageSync('uni_id_token_expired', state.info.tokenExpired)
			
		},
		logout(state) {
			state.info = {};
			state.hasLogin = false;
			uni.setStorageSync('userInfo', {});
			uni.setStorageSync('uni_id_token', '');
			uni.setStorageSync('uni_id_token_expired', 0)
		}
	},
	actions = {

	}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}