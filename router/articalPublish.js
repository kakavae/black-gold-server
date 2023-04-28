const express = require('express')
// 发表文章
const { publishArtical, likeArtical, commentArtical } = require('../router_header/articalPublish')

const router = express()

/* 获取文章列表信息 */
router.post('/publish', publishArtical)

/* 
  点赞评论文章
*/
/* 文章点赞 */
router.get('/likeartical/:articalid', likeArtical)

/* 文章评论 */
router.post('/commentartical', commentArtical)

module.exports = router
