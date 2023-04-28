const express = require('express')
// 导入操作数据库的模块
const db = require('../db/index.js')
const { getUserinfo, getUserArticalList, editUserinfo } = require('../router_header/userInfo')

const router = express()

/* 拿着token获取用户的个人信息 */
router.get('/userinfo', getUserinfo)

/* 拿着用户的id获取用户的文章列表还有用户的id，email等等 */
/* id，email已经在之前通过token拿到了，这里就只返回文章列表 */
router.get('/user/artical/:userid', getUserArticalList)

/* 拿到用户的id，以及用户需要修改的个人信息，修改用户的个人信息 */
router.post('/user/edituserinfo', editUserinfo)

module.exports = router
