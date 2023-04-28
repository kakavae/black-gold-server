/* 获取数据库里面文章的detail*/

// 导入数据库操作模块
const db = require('../db/index.js')

// 下面的函数负责向数据库指定的表查询参数并将返回的结果发送给客户端

const getArticalDetail = (req, res) => {
  const sql = `SELECT id, title, author, time, reading, classification, content, authorHeaderImg from artical_content where id = '${req.params.articalId}'`
  db.query(sql, (err, result) => {
    if (err) {
      res.cc({
        msg: '查询文章失败',
        err
      })
    }
    res.send(result)
  })
}

const likeArtical = (req, res) => {
  res.send({
    code: 200,
  })
}

const commentArtical = (req, res) => {
  res.send({
    code: 200
  })
}

module.exports = {
  getArticalDetail: getArticalDetail,
  likeArtical,
  commentArtical
}
