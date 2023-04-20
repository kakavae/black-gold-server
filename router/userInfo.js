const express = require('express')
// 导入操作数据库的模块
const db = require('../db/index.js')

const router = express()

/* 拿着token获取用户的个人信息 */
router.get('/userinfo', (req, res) => {
  // 解析用户发送的token，根据结果返回成功或者失败的结果
  // console.log(req.get('Authorization'))
  // 这里需要拿着token中解析出来的结果去服务器查数据
  if (req.get('Authorization').length > 0) {
    res.send({
      code: 200,
      message: 'ok',
      data: req.auth,
      ok: true
    })
  } else {
    res.send({
      code: 208,
      message: '用户未登录',
      ok: false
    })
  }
})

module.exports = router
