/* 获取数据库里面文章的简介列表 */
// 为具体的路由服务的函数
// 导入数据库操作模块
const db = require('../db/index.js')
const { dbQuery } = require('../functions/queryPromise/index')

/* 1.拿到数据库里面数据的条数 */
const getArticalList = async (req, res) => {
  try {
    const count = await dbQuery(`select count(*) as num from artical_content`)

    let startNum = 0
    if (count[0] && count[0].num > 10) {
      startNum = parseInt((count[0].num - 10) * Math.random())
    }

    const result = await dbQuery(`select id, title, author, time, reading, classification, lesscontent, imgurl, imgalt  from artical_content limit ${startNum}, 10`)
    res.send({
      code: 200,
      msg: '获取文章列表成功',
      data: result
    })
  } catch (e) {
    console.log(e)
    res.cc(e)
  }
}

module.exports = {
  getArticalList: getArticalList
}
