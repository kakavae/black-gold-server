const db = require('../../db/index')

/* 此函数接受一个sql语句，返回一个promise，promise成功的结果就是sql执行成功的返回值，失败代表sql语句操作失败 */
const dbQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject({
          msg: 'sql语句可能错误，数据库操作失败'
        })
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = {
  dbQuery
}