// 匹配获取图片相关请求的路由
const express = require('express')

// 导入路由的回调函数
const { getImages, getFloorMsg } = require('../router_header/images.js')

const router = express()

// 1. 如果请求的是主页的swiper资源 http://127.0.0.1:8090/api/images/swiper
router.get('/swiper', getImages)
// 2. 如果请求的是floor组件的资源 http://127.0.0.1:8090/api/images/floorMsg
router.get('/floorMsg', getFloorMsg)

// 默认导出
module.exports = router
