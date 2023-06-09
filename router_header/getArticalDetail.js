/* 获取数据库里面文章的detail*/

// 导入数据库操作模块
const db = require('../db/index.js')

// 下面的函数负责向数据库指定的表查询参数并将返回的结果发送给客户端

const getArticalDetail = (req, res) => {
  const sql = `SELECT id, title, author, time, reading, classification, content, authorHeaderImg, likes, comments, imgUrl from artical_content where id = '${req.params.articalId}'`
  db.query(sql, (err, result) => {
    if (err) {
      res.cc({
        msg: '查询文章失败',
        err
      })
    }

    if (!result[0]) {
      return res.send({
        code: 201,
        msg: {
          data: '查无此人'
        }
      })
    }

    const articalInfo = result[0]

    if (!articalInfo.comments) {
      articalInfo.comments = []
    }

    if (!articalInfo.likes) {
      articalInfo.likes = []
    }

    res.send({
      code: 200,
      data: articalInfo
    })
  })
}

module.exports = {
  getArticalDetail: getArticalDetail
}
