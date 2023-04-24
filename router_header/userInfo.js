const db = require('../db/index')

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

module.exports = {
  getUserArticalList
}