const db = require('../db/index.js')

// 导入需要发送给前端的数据
const searchObj = require('../static/searchObj.js')

// 向数据库操作数据的函数
function selectByKeywordsAndThreeLever({ categoryFirstId, categorySecondId, categoryThirdId, keyword, pageNo, pageSize }, req, res) {
  // 根据不同情况拼接sql语句的函数
  function getSql() {
    let sqlThreeLeverKeywords = ''
    // 三级id优先选择，如果选到了并且发送数据以后就直接return,让一个变量保存三个id的优先的一个，然后拿着这个去查找，
    const idObj = {}
    if (categoryThirdId !== '') {
      idObj.categoryThirdId = categoryThirdId
    } else {
      if (categorySecondId !== '') {
        idObj.categorySecondId = categorySecondId
      } else if (categoryFirstId !== '') {
        idObj.categoryFirstId = categoryFirstId
      }
    }

    // 三级分类结合关键字一起决定sql语句
    if (Object.keys(idObj).length !== 0 && keyword) {
      sqlThreeLeverKeywords = `select * from goodlist_detail where ${Object.keys(idObj)[0]} = ${Object.values(idObj)[0]} and title like '%${keyword}%'`
      return sqlThreeLeverKeywords
    }
    if (Object.keys(idObj).length !== 0) {
      sqlThreeLeverKeywords = `select * from goodlist_detail where ${Object.keys(idObj)[0]} = ${Object.values(idObj)[0]}`
      return sqlThreeLeverKeywords
    }
    if (keyword) {
      sqlThreeLeverKeywords = `select * from goodlist_detail where title like '%${keyword}%'`
      return sqlThreeLeverKeywords
    }
    return `select * from goodlist_detail`
  }

  // 处理传送给客户端的对象的函数
  function procSearchObj(searchObj, goodsList) {
    // 根据客户端传上来的数据决定给客户端哪些数据，比如说第几页，这个设计主要是配合分页器功能
    searchObj.goodsList = goodsList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
    searchObj.total = goodsList.length
    searchObj.pageNo = pageNo
    searchObj.pageSize = pageSize
    searchObj.totalPages = Math.ceil(goodsList.length / pageSize)
    return searchObj
  }

  db.query(getSql(), (err, result) => {
    // 读取数据库失败，返回全部数据
    if (err) {
      res.send({
        code: 200,
        message: '成功',
        data: searchObj
      })
      return
    }

    // 读取服务器数据成功
    res.send({
      code: 200,
      message: '成功',
      data: procSearchObj(searchObj, result)
    })
  })
}

const getSearchList = (req, res) => {
  // 一. 如果传过来的数据并不是application/json，就返回错误信息
  if (!req.get('content-type')) {
    res.send({
      code: 200,
      data: null,
      message: '失败',
      ok: false
    })
    return
  }

  // console.log(req.body)

  // 二. 解析前端传过来的application/json格式的数据存在了req.body中，req.body就是一个对象
  // 1. 如果req.body中的数据不为空，就根据里面的数据查询服务器中存储的相关信息，将这个信息发送给客户端
  if (Object.keys(req.body).length !== 0) {
    // 1.1检索关键字和三级分类的处理
    selectByKeywordsAndThreeLever(req.body, req, res)
    return
  }
  // 2. 如果req.body中的数据是一个空对象，就直接返回所有数据，如果没有三级分类和关键字搜索，也是返回全部数据
  res.send({
    code: 200,
    message: '成功',
    data: searchObj
  })
}

module.exports = {
  getSearchList
}
