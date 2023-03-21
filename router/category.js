// 商品条目信息
const express = require('express')
// 导入路由处理函数
const { getCategory } = require('../router_header/category.js')

const router = express()

// 发送三级联动组件的所有数据
router.get('/product/getBaseCategoryList', getCategory)
// 发送静态图片资源的url以及id

module.exports = router
