import {mapMutations} from 'vuex';
import loginSuccess from './loginSuccess.js';
let mixin = {
	methods:{
		...mapMutations({
			setUserInfo: 'user/login'
		}),
		loginSuccess(result){
			console.log('登录成功',result);
			loginSuccess(result)
			delete result.userInfo.token
			this.setUserInfo(result.userInfo)
		}
	}
}
export default mixin