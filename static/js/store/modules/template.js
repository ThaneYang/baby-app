const state = {
	title: '官方',
	name: 'rf',
  tempColor: '#fa436a',
  tempColorRbg:{r:255,g:172,b:30},
	tabList: [
		'/static/tab-home-rf.png',
		'/static/tab-my-rf.png'
	]
};

// const getters = {
// 	// 全局配置
// 	themeColor: state => {
// 		let theme = state.themeColor;
// 		if (!theme) {
// 			// theme = $mConstDataConfig.themeList.filter((item) => item.name === ($mSettingConfig.styleType || 'rf'))[0];
// 			// 在这里进行默认全局主题色配置，颜色来自constData.config.js
// 			theme = $mConstDataConfig.themeList.filter((item) => item.name === 'rf')[0];
// 		}
// 		console.log('theme', theme)
// 		return theme;
// 	},
// }
const mutations = {
	setTemp(state,param){
		state.tempColor = param;
	}
};
export default {
    state,
    mutations
}