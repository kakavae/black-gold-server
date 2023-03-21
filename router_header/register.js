// 导入发送邮件的模块
const nodemailer = require('nodemailer')
// 导入操作数据库的模块
const db = require('../db/index.js')
// 导入生成token字符串的包
const jwt = require('jsonwebtoken')
// 导入生成token的密钥和有效期配置
const config = require('../config.js')

// 获取验证码
const getRegisterCode = async (req, res) => {
  // 创建 nodemailer 配置
  const transporter = nodemailer.createTransport({
    //支持列表： https://nodemailer.com/smtp/well-known/
    service: 'QQ', //
    port: 465, // SMTP 端口
    secureConnection: true,
    auth: {
      user: '3263196640@qq.com',
      pass: 'zdbxwdsfodbkdaig'
    }
  })

  const email = req.body.email

  console.log(email)

  // 随机生成一个四位数数字
  const code = Math.floor((Math.random() + 1) * 1000)

  let timer = null

  const mailOptions = {
    from: '3263196640@qq.com',
    to: email,
    subject: '请查收您的注册验证码',
    text: `'${code}'`
    // html:'这里也可以写html'
  }

  try {
    // 需要将本次收到的邮箱和验证码存储在一个服务器里面以便提交注册的时候验证
    // 1.1 先去数据库看有没有这个结果
    const emailResult = await new Promise((resolve, reject) => {
      db.query(`select * from my_db_02.register_code_email where email = '${email}'`, (err, result) => {
        if (err) {
          reject('验证验证码出错')
        }
        resolve(result)
      })
    })

    if (emailResult.length < 1) {
      await new Promise((resolve, reject) => {
        db.query(`INSERT INTO my_db_02.register_code_email (email, code) VALUES ('${email}', '${code}')`, (err, result) => {
          if (err) {
            reject(['获取验证码失败'])
          }
          resolve(result)
        })
      })
    } else {
      new Promise((resolve, reject) => {
        db.query(`update register_code_email set code = '${code}' where id = '${emailResult[0].id}'`, (err, result) => {
          if (err) {
            reject(['更新验证码失败'])
          }
          resolve(result)
        })
      })
    }

    // 1.发送验证码之后计时60秒，时间到就删除存储的验证码
    // 2.在时间60s之内重复请求，同一个邮件地址就覆盖上一次的验证码，同时清除定时器再开一个定时器
    clearTimeout(timer)
    timer = setTimeout(async () => {
      try {
        const resultSel = await new Promise((resolve, reject) => {
          db.query(`select * from my_db_02.register_code_email where email = '${email}'`, (err, result) => {
            if (err) {
              reject('验证验证码出错')
            }
            resolve(result)
          })
        })
        console.log(resultSel)
        if (resultSel.length > 0) {
          await new Promise((resolve, reject) => {
            db.query(`delete from register_code_email where id = '${resultSel[0].id}'`, (err, result) => {
              if (err) {
                reject('验证验证码出错')
              }
              resolve(result)
            })
          })
        }
      } catch (e) {
        console.log(e)
      }
    }, 240000)

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        res.cc(error)
        return
      }
      // console.log('邮件发送成功 ID：', info.messageId)
      res.send({
        code: 200,
        message: info.messageId,
        ok: true
      })
    })
  } catch (e) {
    res.cc(e)
  }

  console.log('res.send后面执行的代码')
}

// 注册成功的接口
const getRegister = async (req, res) => {
  // 拿着发送过来的数据去数据库查找邮箱，如果验证码正确了，就注册成功
  const { email, password, code } = req.body

  try {
    // 1. 从已经注册的表里面查看是否有数据，
    const userInfo = await new Promise((resolve, reject) => {
      db.query(`select * from my_db_02.register_user where email = '${email}'`, (err, result) => {
        if (err) {
          reject('验证验证码出错')
        }
        resolve(result)
      })
    })

    // 1.1有数据就不用再注册了
    if (userInfo.length > 0) {
      res.send({
        code: 200,
        message: '您已经注册过了，请选择登录或者修改密码',
        ok: true,
        register: true
      })
      return
    }

    // 1.2没有数据就去查验证码是否正确，如果正确就成功注册
    const emailInfo = await new Promise((resolve, reject) => {
      db.query(`select * from my_db_02.register_code_email where email = '${email}'`, (err, result) => {
        if (err) {
          reject('验证验证码出错')
        }
        resolve(result)
      })
    })

    // 注册成功以后将邮箱和密码保存在已注册用户的表中
    if (emailInfo.length > 0 && emailInfo[0].code === code) {
      const registerResult = await new Promise((resolve, reject) => {
        db.query(`insert into my_db_02.register_user (email, password) values ('${email}', '${password}')`, (err, result) => {
          if (err) {
            reject('注册用户失败，请重试')
          }
          resolve(result)
        })
      })
      res.send({
        code: 200,
        message: registerResult,
        ok: true,
        data: null
      })
    } else {
      res.cc('验证码失效')
    }
  } catch (e) {
    res.cc(e)
  }
}

// 用户登录的接口
const getLogin = async (req, res) => {
  const { email, password } = req.body
  const result = await new Promise((resolve, reject) => {
    db.query(`select * from my_db_02.register_user where email = '${email}'`, (err, result) => {
      if (err) {
        reject('获取用户信息失败，登录失败')
      } else {
        resolve(result)
      }
    })
  })

  if (result[0].password === password) {
    // 1. 密码正确，生成token，存储到服务器中，同时存储name和nickname
    const user = { ...result[0], password: '' }
    // 1.1 利用用户个人的一些信息生成token
    const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    // 2. 将所有的信息发送给客户端
    res.send({
      code: 200,
      message: '成功',
      data: {
        nickname: '',
        name: '',
        token: `Bearer ${token}`,
        ok: true,
        result: result
      }
    })
  } else {
    res.send({
      code: 201,
      message: '失败',
      data: null,
      ok: false
    })
  }
}

// 退出登录的接口
const getLogout = (req, res) => {
  res.send({
    code: 200,
    message: '退出登录成功',
    data: null,
    ok: true
  })
}

module.exports = {
  getRegisterCode,
  getRegister,
  getLogin,
  getLogout
}
