const { dbQuery } = require('../functions/queryPromise/index')
const { v4: uuidv4 } = require('uuid')

const pinsPublish = async (req, res) => {
  const id = uuidv4()
  const { content } = req.body
  let {
    id: userId,
    userName,
    userIntroduce: occupation,
    imgUrl
  } = req.auth

  // console.log(req.auth)

  try {
    /* 存一个时间戳以便于按顺序加载数据 */
    await dbQuery(`insert into pins_content (id, content, userId, userName, occupation, headerImgUrl, likes, commentImg, time) values ('${id}', '${content ? content : null}', '${userId}', '${userName}', '${occupation ? occupation : null}', '${imgUrl ? imgUrl : null}', '0', 'null', '${Date.now()}')`)

    const selData = await dbQuery(`select * from pins_content where id = '${id}'`)
    res.send({
      code: 200,
      msg: '发表成功',
      data: {
        selData
      }
    })
  } catch (e) {
    console.log(e)
  }

}

const getPinsList = async (req, res) => {
  const pinsListData = await dbQuery(`select * from pins_content order by time desc`)
  res.send({
    code: 200,
    msg: '获取pins列表成功',
    data: {
      selData: pinsListData
    }
  })
}

module.exports = {
  pinsPublish,
  getPinsList
}