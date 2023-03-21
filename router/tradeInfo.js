const express = require('express')

const { getTradeInfo, updateUserAddress, getOrderId } = require('../router_header/tradeInfo.js')

const router = express()

// 获取全部的购买页面信息
router.get('/auth/trade', getTradeInfo)

// 修改个人信息的默认地址
router.get('/auth/addressMsg/:id/:userId', updateUserAddress)

// 提交订单信息，地址等信息，获取支付的订单号
router.post('/auth/submitOrder', getOrderId)

module.exports = router
