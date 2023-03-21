const express = require('express')
const { getRegisterCode, getRegister, getLogin, getLogout } = require('../router_header/register.js')

const router = express()

// 获取验证码
router.post('/code', getRegisterCode)

// 注册用户
router.post('/register', getRegister)

// 登录接口
router.post('/login', getLogin)

// 退出登录接口
router.get('/logout', getLogout)

module.exports = router
