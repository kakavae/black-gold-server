const db = require('../db/index.js')

const getSearchArticalList = async (req, res) => {
  console.log(req.query)
  const { keyword } = req.query
  try {
    /* 去数据库查参数 */
    const queryDataList = await new Promise((resolve, reject) => {
      db.query(`select * from artical_content where classification like '%${keyword}%'`, (err, result) => {
        if (err) {
          reject('数据库检索出错')
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      code: 200,
      msg: '查询成功',
      data: queryDataList
    })
  } catch (e) {
    console.log(e)
  }
}
module.exports = {
  getSearchArticalList
}