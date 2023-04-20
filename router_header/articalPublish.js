// 导入数据库操作模块
const db = require('../db/index.js')
const { v4: uuidv4 } = require('uuid')

const publishArtical = async (req, res) => {
  const { title, author, time, reading, content, classification, lesscontent, imgUrl, imgalt, authorHeaderImg, userId } = req.body
  const articalId = uuidv4()
  /* 将req.body里面的数据以合适的格式存进artical_content表里 */
  try {
    const publishResult = await new Promise((resolve, reject) => {
      db.query(`insert into artical_content (id, title, author, time, reading, content, classification, lesscontent, imgurl, imgalt, authorHeaderImg, authorId) values ('${articalId}', '${title}', '${author}', '${time}', '${reading}', '${content}', '${classification}', '${lesscontent}', '${imgUrl}', '${imgalt}', '${authorHeaderImg}', '${userId}')`, (err, result) => {
        if (err) {
          reject({
            msg: '数据库插入文章失败',
            err
          })
        }
        resolve(result)
      })
    })
    res.send({
      code: 200,
      msg: '发表文章成功',
      data: {
        publishResult
      }
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  publishArtical
}