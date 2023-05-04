const db = require('../db/index')
const { dbQuery } = require('../functions/queryPromise/index')
const formidable = require('formidable')
// 引入实现文件上传的模块
const { IncomingForm } = require('formidable')
const path = require('path')
const fs = require('fs')
const { SERVER_NAME } = require('../global_variable/index')

const getUserinfo = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(`select * from register_user where id = '${req.auth.id}'`, (err, result) => {
        if (err) {
          reject()
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      code: 200,
      message: 'ok',
      data: data[0],
      ok: true
    })
  } catch (e) {
    console.log('查询数据库出错', e)
    res.cc(e)
  }
}

const getUserArticalList = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(`select * from artical_content where authorId = '${req.params.userid}'`, (err, result) => {
        if (err) {
          reject('数据库查询语句错误')
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      id: req.params.userid,
      code: 200,
      data: result
    })
  } catch (e) {
    res.cc(e)
  }
}

const editUserinfo = async (req, res) => {
  // console.log(req.body, req.auth)
  const { id } = req.auth
  const { userName, position, company, userHomepage, userIntroduce } = req.body
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(`update register_user set userName = '${userName}', position = '${position}', company='${company}', userHomepage='${userHomepage}', userIntroduce='${userIntroduce}' where id = '${id}'`, (err, result) => {
        if (err) {
          reject('修改用户信息数据库操作失败')
        } else {
          resolve(result)
        }
      })
    })
    res.send({
      code: 200,
      msg: 'ok',
      data
    })
  } catch (e) {
    console.log(e)
    res.cc({
      code: 503,
      err: e
    })
  }
}

/* 修改文件名的函数，如果有重名的文件，就删除那个文件，将现在的命名继续 */
const changeFileName = (oldPath, id, end) => {
  const newPath = path.join(__dirname, '/images/', id + '.' + end)
  const imgUrl = SERVER_NAME + '/api/images/' + id + '.' + end
  return new Promise(async (resolve, reject) => {
    /* 1.如果重名就删除之前的文件 */
    let unLinkRes = null
    try {
      if (fs.existsSync(newPath)) {
        unLinkRes = await new Promise((resolve, reject) => {
          fs.unlink(newPath, (err, result) => {
            if (err) {
              reject({
                msg: '文件重名且删除失败'
              })
            } else {
              resolve('删除成功')
            }
          })
        })
      }
    } catch (e) {
      console.log(e)
    }

    /* 2.如果删除成功了 */
    /* 或者根本没有重名的情况就返回读取图片的url */
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject({
          msg: '改名失败',
          err
        })
      } else {
        resolve(imgUrl)
      }
    })

  })
}

const editUserHeader = async (req, res) => {
  const { id } = req.auth
  // 1.创建文件上传对象
  let form = new IncomingForm()
  // 2.添加必要的配置
  // 2.1 设置编码,formidable也可 接收普通键值对，这个时候就有需要设置编码，如果只是上传文件，则不用设置
  // form.encoding = 'utf-8'
  // // 2.2 设置上传文件的存放路径，一定给一个全路径，否则报错
  form.uploadDir = path.join(__dirname, '/images')

  // // 2.3 设置是否保留文件的扩展名，默认不保留
  form.keepExtensions = true

  // 3.调用上传方法,实现文件上传
  // form.parse(请求报文，回调函数)
  // err:文件上传失败时的错误信息
  // fields：接收到普通键值对--对象
  // files：文件的相关信息,特别是上传成功后在服务器端的信息
  const imgUrl = await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err)
        reject({
          code: 204,
          msg: '文件上传失败',
          err
        })
      } else {
        /* 源文件名后缀 */
        const end = files.headerImg.originalFilename.split('.')[1]

        /* 根据files里面的信息修改文件名，旧文件名，user的id，后缀.jpg */
        /* 为什么要改名：因为上面的步骤会默认生成一个二进制文件，而我们想要的是类似.jpg这样的文件，改名之后
        才是能正确被托管资源拿到的文件 */
        const imgUrl = await changeFileName(files.headerImg.filepath, id, end)
        resolve(imgUrl)
      }
    })
  })


  // 4.将上传后得到的头像的url存储在数据库中的用户信息表当中
  const resData = await dbQuery(`update register_user set imgUrl = '${imgUrl}'`)
  res.send({
    code: 200,
    msg: '更换头像成功',
    img: imgUrl,
    data: resData
  })
}

module.exports = {
  getUserinfo,
  getUserArticalList,
  editUserinfo,
  editUserHeader
}