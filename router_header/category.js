// 为具体的路由服务的函数

// 导入数据库操作模块
const db = require('../db/index.js')

// 导入静态资源，就是那个很复杂的数据JSON对象
const { data } = require('../static/category.js')

const sql = 'SELECT * from category'

// 下面的函数负责向数据库指定的表查询参数并将返回的结果发送给客户端
/* 
const getCategory = (req, res) => {
  db.query(sql, (err, result) => {
    if (err) {
      res.cc(err)
    }
    res.send(result)
  })
}
 */

// 将简单的静态JSON资源发送给客户端
const getCategory = (req, res) => {
  res.send({
    code: 200,
    message: '成功',
    data: data
  })
}

module.exports = {
  getCategory: getCategory
}
