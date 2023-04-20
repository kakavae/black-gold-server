const express = require('express')
// 导入解决跨域的cors模块，第三方包
const cors = require('cors')
// 导入验证规则模块的包
const joi = require('joi')

/* 文章相关模块 */
const articalRouter = require('./router/artical')

// 导入路由模块---产品条目
const productRouter = require('./router/category.js')
// 导入路由模块---请求静态图片
const imagesRouter = require('./router/images.js')
// 导入路由模块---处理搜索功能
const searchRouter = require('./router/searchList.js')
// 导入路由处理模块---处理商品的详情
const goodsDetail = require('./router/goodsDetail.js')
// 导入路由处理模块---处理添加购物车
const addGoodsCart = require('./router/goodsCart')
// 导入路由处理模块---注册模块
const register = require('./router/register.js')
// 导入路由处理模块---获取用户的个人信息
const userinfo = require('./router/userInfo.js')
// 导入路由处理模块---获取订单交易信息，提交支付信息，获得支付订单号
const tradeInfo = require('./router/tradeInfo.js')
// 导入路由处理模块---获取订单信息的路由
const paymentInfo = require('./router/paymentInfo.js')
/* 导入路由处理模块---发表文章 */
const articalPublishRouter = require('./router/articalPublish')

// 导入解析token的模块
const { expressjwt } = require('express-jwt')
// 导入解析token需要传入的密钥
const config = require('./config.js')

const app = express()

// （1）解决跨域问题
app.use(cors())

// （2）响应数据的中间件，为res对象挂载一个res.cc()函数
app.use(function (req, res, next) {
  // status=0为成功,status=1为失败；默认将status的值设置为1，方便处理失败的情况
  res.cc = function (err, status = 1, code = 201) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
      code
    })
  }
  next()
})

// （3）解析前端post传过来的appplication/json格式的数据
app.use(express.json())

// (4)解析前端传递过来的token，这个token在请求头中的Authorization字段中，从token中解析出来的信息会保存在req.user当中
// 以/api开头的请求不需要token认证
app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

/* 
  处理文章相关模块----黑金项目
*/
app.use('/api/artical', articalRouter)

/* 
  注册--登录一条龙
*/
app.use('/api/user/passport', register)

/* 
  测试token的解析,获取用户的个人信息 
*/
app.use('/my', userinfo)

/*
  发表文章
*/
app.use('/artical', articalPublishRouter)

/* 
  搜索文章---根据分类标签的字段
*/
app.use('/api/list', searchRouter)

/*
// 1. 注册路由中间件，拿到请求就会先交给路由处理，处理三级联动数据的请求
app.use('/api', productRouter)

// 2. 处理轮播图等静态资源的请求
app.use('/api/images', imagesRouter)

// 3. 处理搜索模块的POST请求
app.use('/api/list', searchRouter)

// 4. 处理商品详情信息的GET请求
app.use('/api/item', goodsDetail)

// 5. 添加商品到购物车,对已有的商品数量进行改动,获取购物车列表
app.use('/api/cart', addGoodsCart)

// 6. 注册接口，获取注册验证码，提交注册，登录
app.use('/api/user/passport', register)

// 7. 测试token的解析,获取用户的个人信息
app.use('/my', userinfo)

// 8. 交易信息相关的路由
app.use('/my/order', tradeInfo)

// 9. 支付相关的路由
app.use('/my/payment', paymentInfo)
*/


// 注册全局可用的错误级别的中间件
app.use((err, req, res, next) => {
  // 验证规则出错
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }
  // token认证失败后的错误
  if ((err.name = 'UnauthorizedError')) {
    return res.send({
      code: 208,
      message: '身份认证失败',
      data: {},
      ok: false
    })
  }
  // 未知错误
  res.cc(err)
  next()
})

app.listen(8090, () => {
  console.log('visit web server at http://127.0.0.1:8090')
})
