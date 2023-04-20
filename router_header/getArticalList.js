/* 获取数据库里面文章的简介列表 */

// 为具体的路由服务的函数

// 导入数据库操作模块
const db = require('../db/index.js')

// 导入静态资源，就是那个很复杂的数据JSON对象
// const { data } = require('../static/category.js')

const sql = 'SELECT id, title, author, time, reading, classification, lesscontent, imgurl, imgalt  from artical_content'

// 下面的函数负责向数据库指定的表查询参数并将返回的结果发送给客户端

const getArticalList = (req, res) => {
  db.query(sql, (err, result) => {
    if (err) {
      res.cc(err)
    }
    res.send({
      code: 200,
      msg: '获取文章列表成功',
      data: result
    })
  })
}

module.exports = {
  getArticalList: getArticalList
}
