const express = require('express')
// 发表文章
const { publishArtical } = require('../router_header/articalPublish')

const router = express()

/* 获取文章列表信息 */
router.post('/publish', publishArtical)


module.exports = router
