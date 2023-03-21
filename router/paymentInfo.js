const express = require('express')

const { getPayInfo, queryPayStatus } = require('../router_header/paymentInfo')

const router = express()

// 获取订单支付信息
router.get('/weixin/createNative/:orderId', getPayInfo)

// 查询订单支付状态
router.get('/weixin/queryPayStatus/:orderId', queryPayStatus)

module.exports = router
