const express = require('express')

const { addToCart, getCartList, checkGoodsState, removeGoods } = require('../router_header/addToCart.js')

const router = express()

// 下面的四个路由都要验证有没有请求头UUIDTOKEN，要不要用插件app.use来解决？

// 1. 添加商品到数据库中处理这个路径的请求,将携带在params中的参数解析出来
router.post('/addToCart/:skuId/:skuNum', addToCart)

// 2. 从数据库中获取数据
router.get('/cartList', getCartList)

// 3. 修改商品的勾选状态
router.get('/checkCart/:skuId/:isChecked', checkGoodsState)

// 4. 删除购物车的信息
router.get('/deleteCart/:skuId', removeGoods)

module.exports = router
