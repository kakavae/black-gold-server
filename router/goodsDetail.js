const express = require('express')

const goodsDetailObj = require('../static/goodsDetail.js')
// 导入请求的处理函数
const { getGoodsDetail } = require('../router_header/goodsDetail')

const router = express()

router.get('/:skuId', getGoodsDetail)

module.exports = router
