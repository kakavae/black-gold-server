const express = require('express')

// 导入请求的处理函数
const { getArticalDetail } = require('../router_header/getArticalDetail.js')

const router = express()

router.get('/:articalId', getArticalDetail)

/* 文章点赞 */
router.post('/likeartical', likeArtical)

/* 文章评论 */
router.post('/commentartical', commentArtical)

module.exports = router
