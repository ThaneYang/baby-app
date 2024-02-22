const word = {

};

const sentence = {
	50403: '权限错误',
	51001: '支付单号（out_trade_no）不能为空',
	51002: 'code不能为空',
	51003: '订单号（order_no）不能为空',
	51004: '回调类型（type）不能为空，如设置为goods代表商品订单',
	51005: '支付金额（total_fee）必须为正整数（>0的整数）（注意：100=1元）',
	51006: '支付描述（description）不能为空',
	51007: '支付供应商（provider）不能为空',
	51008: 'clientInfo不能为空',
	51009: 'cloudInfo不能为空',
	51010: '支付单号或第三方交易单号不能同时为空',
	52001: '支付订单不存在',
	52002: '请先配置正确的异步回调URL',
	53001: '获取支付信息失败，请稍后再试',
	53002: '退款失败',
	53003: '查询退款信息失败，请稍后再试',
	53004: '关闭订单失败，请稍后再试',
	53005: '证书错误，请检查支付证书',
	54001: 'ios内购凭据校验不通过',
	54002: '订单未支付'
};

module.exports = {
	...word,
	...sentence
}
