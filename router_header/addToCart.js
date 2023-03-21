const db = require('../db/index.js')

// 一 用async await修改代码逻辑不然维护不方便
const addToCart = async (req, res) => {
  // 在请求头中拿到一个请求头字段 UUIDTOKEN
  const UUIDTOKEN = req.get('UUIDTOKEN')
  if (!UUIDTOKEN) {
    console.log('游客信息认证失败')
    res.cc('游客信息认证失败')
    return
  }

  try {
    // 1. 拿着这个字段去服务器里面查找看是否有这个人
    // 这里注意sql语句要严格，本身返回的是字符串，但是查询条件位置的参数要用''包裹起来
    const touristInfo = await new Promise((resolve, reject) => {
      db.query(`select * from tourist where touristno = '${UUIDTOKEN}'`, (err, result) => {
        if (err) {
          reject(['查询身份失败', 1, 201])
        } else {
          resolve(result)
        }
      })
    })

    if (touristInfo.length < 1) {
      const addTouristResult = await new Promise((resolve, reject) => {
        db.query(`insert into tourist values('${UUIDTOKEN}', '')`, (err, result) => {
          if (err) {
            reject(['添加游客身份失败', 1, 201])
          } else {
            resolve(result)
          }
        })
      })
    }

    // 1.1 如果没有这个人，将这个人的信息添加到游客身份表之后，操作和有这个人完全相同，代码复用
    // 2.1 有这个人了，将商品的信息添加到这个人的购物车表里面
    // 2.1.1 注意，商品的信息需要在商品的那个表里面查找，查到了之后再添加到购物车表--尝试使用promise不然代码太难读了

    const goodsInfo = await new Promise((resolve, reject) => {
      db.query(`select * from goodlist_detail where id = ${req.params.skuId}`, (err, result) => {
        if (err) {
          reject(['没有您想要购买的商品', 1, 202])
        }
        resolve(result) // 注意db.query是异步任务，只有在回调里面才能拿到操作数据库的结果
      })
    })

    const { id: skuId, price: cartPrice, defaultImg: imgUrl, title: skuName } = goodsInfo[0]

    // 2.1.2 拿到商品信息之后根据商品的id和游客的id在游客的表里面查一下有没有这个商品
    const touristGoodsInfo = await new Promise((resolve, reject) => {
      db.query(`select tourist_goods_cart_no, skuNum from tourist,tourist_goods_cart where tourist.touristno = tourist_goods_cart.tourist_id and tourist.touristno = '${UUIDTOKEN}' and tourist_goods_cart.skuId = '${skuId}'`, (err, result) => {
        if (err) {
          reject(['获取商品详细信息失败', 1, 201])
        } else {
          resolve(result)
        }
      })
    })

    // 2.1.3 如果查询的结果为空就直接添加商品，如果查询结果不为空就更新原有的商品
    if (touristGoodsInfo.length < 1) {
      const addCartResult = await new Promise((resolve, reject) => {
        db.query(`INSERT INTO tourist_goods_cart (skuId, cartPrice, skuNum, imgUrl, skuName, isChecked, skuPrice, tourist_id) VALUES ('${skuId}', '${cartPrice}', '${req.params.skuNum}', '${imgUrl}', '${skuName}', '0', '${cartPrice}', '${UUIDTOKEN}');`, (err, result) => {
          if (err) {
            reject('加入购物车失败')
          }
          resolve(['加入购物车成功', result])
        })
      })
      res.send({
        code: 200,
        message: '添加商品成功',
        data: null,
        ok: true,
        result: addCartResult
      })
    } else {
      const updateResult = await new Promise((resolve, reject) => {
        db.query(`update tourist_goods_cart set skuNum = '${Number(touristGoodsInfo[0].skuNum) + Number(req.params.skuNum)}' where tourist_goods_cart.tourist_goods_cart_no = '${touristGoodsInfo[0].tourist_goods_cart_no}'`, (err, result) => {
          if (err) {
            reject(['更新商品数量失败', 1, 201])
          } else {
            resolve(result)
          }
        })
      })
      res.send({
        code: 200,
        message: '添加商品成功',
        data: null,
        ok: true,
        result: updateResult
      })
    }
  } catch (e) {
    console.log(e)
    res.cc(e)
  }
  //  查询是否有这个游客的sql语句的回调
  const selTourist = (err, result) => {
    if (err) {
      res.cc('操作数据库出错', err)
      return
    }
    // 查询到的参数为空
    // 2.2 没有这个人，先将这个人加到表里面，加入成功以后再将这个人的信息添加到这个人的购物车表里面
    if (result.length < 1) {
      db.query(`insert into tourist values('${UUIDTOKEN}', '')`, addTourist)
    } else {
      // 2.1 有这个人了，将商品的信息添加到这个人的购物车表里面
      // 2.1.1 注意，商品的信息需要在商品的那个表里面查找，查到了之后再添加到购物车表--尝试使用promise不然代码太难读了

      new Promise((resolve, reject) => {
        db.query(`select * from goodlist_detail where id = ${req.params.skuId}`, (err, result) => {
          if (err) {
            reject(['没有您想要购买的商品', 1, 202])
          }
          resolve(result) // 注意db.query是异步任务，只有在回调里面才能拿到操作数据库的结果
        })
      })
        .then((goodsInfo) => {
          const { id: skuId, price: cartPrice, defaultImg: imgUrl, title: skuName } = goodsInfo[0]
          // 将这个商品里面的信息添加到这个人对应的表里面，拿着商品的id和人的id去数据库里面查一下返回的结果
          // 不能重复添加，如果这个商品已经在这个人的购物车里面了，就变化skuNum就行
          return new Promise()

          /*
          return new Promise((resolve, reject) => {

            db.query(`INSERT INTO tourist_goods_cart (skuId, cartPrice, skuNum, imgUrl, skuName, isChecked, skuPrice, tourist_id) VALUES ('${skuId}', '${cartPrice}', '${req.params.skuNum}', '${imgUrl}', '${skuName}', '0', '${cartPrice}', '${UUIDTOKEN}');`, (err, result) => {
              // res.send([result, err])
              if (err) {
                return reject('加入购物车失败')
              }
              // console.log(result)
              return resolve(['加入购物车成功', result])
            })
          })
          */
        })
        .then((msg) => {
          if (msg) {
            res.send({
              code: 200,
              message: '添加商品成功',
              data: null,
              ok: true
            })
          }
        })
        .catch((msg) => {
          res.cc(msg)
        })

      // 2.1.2 在数据表中获取到信息之后再执行添加操作
      // if (goodsInfo.length < 1) {
      //   res.cc('没有您想要购买的商品了', 1, 202)
      //   return
      // }
      // res.send([goodsInfo, '前面是id=2的货物'])
      // db.query(``, addTouristGoods)
    }
  }

  // 2. 没有这个游客，将这个游客添加到数据库的sql语句的回调
  const addTourist = (err, result) => {
    if (err) {
      res.cc('添加游客身份失败', err)
      return
    }
    res.send('添加游客成功')
  }

  // 3. 向数据库中添加指定用户携带的商品的回调
  const addTouristGoods = (err, result) => {
    if (err) {
      res.cc(err, '添加购物车失败')
      return
    } else {
      res.send({
        code: 200,
        message: '添加商品成功',
        data: null,
        ok: true
      })
    }
  }

  // 这里拿到需要添加到购物车的商品的id和数量，存储到服务器中，然后返回成功的结果
  // console.log(req.params) // { skuId: '1', skuNum: '2' }
}

// 二 获取某人的表中的数据
const getCartList = async (req, res) => {
  // 游客是带着UUIDTOKEN请求头来请求资源的，根据这个请求头在表里面查资源，将资源返回给客户端
  const touristGoods = await new Promise((resolve, reject) => {
    db.query(`select * from tourist_goods_cart where tourist_id = '${req.get('UUIDTOKEN')}'`, (err, result) => {
      if (err) {
        reject(['获取购物车信息失败', 1, 201])
      }
      resolve(result)
    })
  })
  res.send({
    code: 200,
    message: '获取购物车信息成功',
    data: touristGoods
  })
}

// 三 修改某人购物车中商品的状态
const checkGoodsState = async (req, res) => {
  const UUIDTOKEN = req.get('UUIDTOKEN')
  if (!UUIDTOKEN) {
    console.log('游客信息认证失败')
    res.cc('游客信息认证失败')
    return
  }

  // 拿着游客的UUID以及商品id和商品的勾选状态去服务器修改勾选的状态
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(`update tourist_goods_cart set isChecked = ${req.params.isChecked} where tourist_goods_cart.tourist_id = '${UUIDTOKEN}' and skuId = ${req.params.skuId}`, (err, result) => {
        if (err) {
          reject(['更新购物车状态失败', 1, 201])
        }
        resolve(result)
      })
    })

    if (result) {
      res.send({
        code: 200,
        message: '成功',
        data: null,
        ok: true
      })
    }
  } catch (e) {
    console.log(e)
    res.cc(e)
  }
}

// 四 删除商品
const removeGoods = async (req, res) => {
  const UUIDTOKEN = req.get('UUIDTOKEN')
  if (!UUIDTOKEN) {
    console.log('游客信息认证失败')
    res.cc('游客信息认证失败')
    return
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(`delete from tourist_goods_cart where tourist_goods_cart.tourist_id = '${UUIDTOKEN}' and skuId = ${req.params.skuId}`, (err, result) => {
        if (err) {
          reject(['删除商品失败', 1, 201])
        }
        resolve(result)
      })
    })
    if (result) {
      res.send({
        code: 200,
        message: '成功',
        data: result,
        ok: true
      })
    }
  } catch (e) {
    console.log(e)
    res.cc(e)
  }
}

module.exports = {
  addToCart,
  getCartList,
  checkGoodsState,
  removeGoods
}
