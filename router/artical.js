// 商品条目信息
const express = require('express')
// 获取文章简单信息的模块
const { getArticalList } = require('../router_header/getArticalList')
/* 导入处理详细信息的模块 */
const { getArticalDetail } = require('../router_header/getArticalDetail.js')

const router = express()

/* 获取文章列表信息 */
router.get('/getBaseCategoryList', getArticalList)
/* 获取文章的详细信息 */
router.get('/:articalId', getArticalDetail)

module.exports = router
