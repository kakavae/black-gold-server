const express = require('express')
// 发表沸点
const { pinsPublish, getPinsList } = require('../router_header/pinsPublish')

const router = express()

/* 发表沸点 */
router.post('/publish', pinsPublish)

/* 获取沸点列表信息 */
router.get('/pinslist', getPinsList)

module.exports = router
