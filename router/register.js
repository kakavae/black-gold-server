const express = require('express')
const { getRegisterCode, getRegister, getLogout } = require('../router_header/register.js')

const router = express()

// 获取验证码
router.post('/code', getRegisterCode)

/* 如果验证码正确的话就直接返回token了，不用再输入密码 */

// 注册用户--并且登录
router.post('/register', getRegister)

// 退出登录接口
router.get('/logout/:userid', getLogout)

module.exports = router
