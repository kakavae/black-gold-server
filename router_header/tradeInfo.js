const db = require('../db/index.js')

// 结算
const getTradeInfo = async (req, res) => {
  // 去服务器查询这个人购买的所有商品以及这个人填写的地址，地址的表还没创建，这个人购买的商品和商品数量直接在数据库里面找就可以，拿到需要购买的商品的skuId和当前游客的id，用户的id暂时不用，tradeNo在获取订单交易页信息的时候就有了
  // 1. 在数据库里面根据游客的id以及商品是否勾选，选出用户实际需要购买的商品
  // 2. 根据选出来的数据计算出商品的总数量和商品的总价格
  // 3. 生成一个totalNo用于标时此次交易
  // 4. 这个totalNo在提交订单的时候需要附加
  // 5. 提交订单之后拿到一个data，里面的id就是orderId，在获取订单支付信息和查询订单支付状态的时候使用
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(`select * from tourist_goods_cart where tourist_goods_cart.tourist_id = '${req.get('UUIDTOKEN')}' and tourist_goods_cart.isChecked = '1'`, (err, result) => {
        if (result.length > 0) {
          resolve(result)
        } else {
          reject('获取已勾选的商品数据时出错，数据库错误')
        }
      })
    })
    // 获取到的所有的商品将商品的价格计算出来
    const totalAmount = result.reduce((a, b) => {
      return a + Number(b.skuPrice) * Number(b.skuNum)
    }, 0)
    const totalNum = result.reduce((a, b) => {
      return a + Number(b.skuNum)
    }, 0)
    res.send({
      code: 200,
      message: '成功',
      data: {
        totalAmount: totalAmount,
        userAddressList: [
          {
            id: 2,
            userAddress: '北京市昌平区2',
            userId: 2,
            consignee: 'admin',
            phoneNum: '15011111111',
            isDefault: '1'
          },
          {
            id: 3,
            userAddress: '山东省菏泽市',
            userId: 2,
            consignee: 'admin',
            phoneNum: '15011111111',
            isDefault: '0'
          }
        ],
        tradeNo: '1b23c1efc8144bfc83e51807f4e71d3a',
        totalNum: totalNum,
        detailArrayList: result
      },
      ok: true
    })
  } catch (e) {
    res.cc(e)
  }
}

const updateUserAddress = (req, res) => {
  console.log(req.params)
  res.send('修改了地址')
}

// 获取订单编号---提交订单
const getOrderId = (req, res) => {
  console.log(req.query, req.params)
  console.log(req.body) // 这里拿到用户需要购买的商品信息，然后将这个信息存储在数据库当中
  res.send({
    code: 200,
    message: '成功',
    data: 71, // orderId 订单号
    ok: true
  })
}

module.exports = {
  getTradeInfo,
  updateUserAddress,
  getOrderId
}
