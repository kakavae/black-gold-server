// 商品条目信息
const express = require('express')
// 发表沸点
const { getPinsList } = require('../router_header/pinsPublish')

const router = express()

/* 获取沸点列表信息 */
router.get('/', getPinsList)

module.exports = router
