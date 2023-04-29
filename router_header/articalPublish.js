// 导入数据库操作模块
const db = require('../db/index.js')
const { v4: uuidv4 } = require('uuid')

/* 发表文章的逻辑 */
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
      articalId,
      data: {
        publishResult
      }
    })
  } catch (e) {
    console.log(e)
  }
}

/* 点赞文章 */
const likeArtical = async (req, res) => {
  // console.log(req.params, req.auth)
  /* 从token里面获取到了用户相关的所有信息，将这个用户名添加到文章的点赞表值里面 */
  const articalid = req.params.articalid
  const { userName } = req.auth
  /* 让前端把之前拿到的所有的点赞的人的列表和最新的点赞也就是自己的userName一起传上来，在这里只需要更新，否则又要查一次数据库 */
  try {
    /* 1.去数据库查找所有已经点赞的人 */
    let likes = await new Promise((resolve, reject) => {
      db.query(`select likes from artical_content where id = '${articalid}'`, (err, result) => {
        if (err) {
          reject('点赞插入数据库失败')
        } else {
          resolve(result)
        }
      })
    })

    /* 2.如果已经点赞的和传过来的人用户名一致，就拒绝点赞，返回点赞失败，已经点过了 */
    // console.log(likes)
    if (likes[0] && likes[0].likes && likes[0].likes.length > 0) {
      const likesList = JSON.parse(likes[0].likes)
      for (let item of likesList) {
        if (item === userName) {
          return res.send({
            code: 201,
            msg: '您已经点赞了，不能再点赞了'
          })
        }
      }
    }

    let likeList = []
    if (likes[0].likes) {
      likeList = [...JSON.parse(likes[0].likes), userName]
    } else {
      likeList = [userName]
    }

    const resultData = await new Promise((resolve, reject) => {
      db.query(`update artical_content set likes = '${JSON.stringify(likeList)}' where id = '${articalid}'`, (err, result) => {
        if (err) {
          reject('点赞插入数据库失败')
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      code: 200,
      msg: '点赞成功',
      data: resultData
    })
  } catch (e) {
    console.log(e)
  }
}

/* 评论文章 */
const commentArtical = async (req, res) => {
  // console.log(req.body)
  const { id: articalid, comment } = req.body
  const { userName } = req.auth
  /* 直接在数据库中存JSON化的数据，得到的返回值直接返回给前端 */
  try {
    /* 1.获取数据库中评论的值 */
    const commentsData = await new Promise((resolve, reject) => {
      db.query(`select comments from artical_content where id = '${articalid}'`, (err, result) => {
        if (err) {
          reject('点赞插入数据库失败')
        } else {
          resolve(result)
        }
      })
    })

    // console.log(commentsData)
    /* 2.将新的值添加到旧的值中 */
    let newCommentsList = commentsData[0].comments
    if (newCommentsList) {
      newCommentsList = JSON.stringify([
        ...JSON.parse(newCommentsList),
        { [userName]: comment }
      ])
    } else {
      newCommentsList = JSON.stringify([
        { [userName]: comment }
      ])
    }

    /* 3.新的评论数据update到数据库中 */
    const resultData = await new Promise((resolve, reject) => {
      db.query(`update artical_content set comments = '${newCommentsList}' where id = '${articalid}'`, (err, result) => {
        if (err) {
          reject('评论插入数据库失败')
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      code: 200,
      msg: '评论成功',
      data: resultData
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  publishArtical,
  likeArtical,
  commentArtical
}