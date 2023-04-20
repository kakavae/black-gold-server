const express = require('express')

// 导入请求的处理函数
const getArticalDetail = require('../router_header/getArticalDetail.js')

const router = express()

router.get('/:articalId', getArticalDetail)

module.exports = router
