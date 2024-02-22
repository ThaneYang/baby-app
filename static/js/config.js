
const  dev = 'weixin';
const  appId = 0;

const  apiUrl 	 = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:81/' :'http://127.0.0.1:81/';

const  staticUrl = 'http://www.hongcd.com/img/';


export default {
	appId,
	dev,
	apiUrl,
	staticUrl,
}