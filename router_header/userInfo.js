const db = require('../db/index')

const getUserinfo = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(`select * from register_user where id = '${req.auth.id}'`, (err, result) => {
        if (err) {
          reject()
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      code: 200,
      message: 'ok',
      data: data[0],
      ok: true
    })
  } catch (e) {
    console.log('查询数据库出错', e)
    res.cc(e)
  }
}

const getUserArticalList = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(`select * from artical_content where authorId = '${req.params.userid}'`, (err, result) => {
        if (err) {
          reject('数据库查询语句错误')
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      id: req.params.userid,
      code: 200,
      data: result
    })
  } catch (e) {
    res.cc(e)
  }
}

const editUserinfo = async (req, res) => {
  // console.log(req.body, req.auth)
  const { id } = req.auth
  const { userName, position, company, userHomepage, userIntroduce } = req.body
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(`update register_user set userName = '${userName}', position = '${position}', company='${company}', userHomepage='${userHomepage}', userIntroduce='${userIntroduce}' where id = '${id}'`, (err, result) => {
        if (err) {
          reject('修改用户信息数据库操作失败')
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      code: 200,
      msg: 'ok',
      data
    })
  } catch (e) {
    console.log(e)
    res.cc({
      code: 503,
      err: e
    })
  }
}

module.exports = {
  getUserinfo,
  getUserArticalList,
  editUserinfo
}