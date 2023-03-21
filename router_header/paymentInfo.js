const getPayInfo = (req, res) => {
  console.log(req.params) // 拿到订单的ID然后去数据库操作，选择指定的商品，返回不同的价格
  res.send({
    code: 200,
    message: '成功',
    data: {
      codeUrl: 'weixin://wxpay/bizpayurl?pr=P0aPBJK',
      orderId: 71,
      totalFee: 23996,
      resultCode: 'SUCCESS'
    },
    ok: true
  })
}

const queryPayStatus = (req, res) => {
  console.log(req.params)
  res.send({
    code: 205,
    message: '支付中',
    data: null,
    ok: false
  })
}

module.exports = {
  getPayInfo,
  queryPayStatus
}
