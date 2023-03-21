// 导入拼接好的floor组件对应的数据
const floorMsg = require('../static/floor.js')

const db = require('../db/index.js')

const sql = 'select * from imagesurl'
const sqlFloor = 'select * from '

// 直接发送数据
// const getImages = (req, res) => {
//   // 这些发送的url应该存储在服务器当中，通过sql语句选择出来
//   res.send([
//     {
//       id: '1',
//       imgUrl: 'http://127.0.0.1:8091/imagesSwiper/banner1.jpg'
//     },
//     {
//       id: '2',
//       imgUrl: 'http://127.0.0.1:8091/imagesSwiper/banner2.jpg'
//     },
//     {
//       id: '3',
//       imgUrl: 'http://127.0.0.1:8091/imagesSwiper/banner3.jpg'
//     },
//     {
//       id: '4',
//       imgUrl: 'http://127.0.0.1:8091/imagesSwiper/banner4.jpg'
//     }
//   ])
// }

// 读取服务器的资源发送的home主页的轮播图数据
// 这个服务器可以存储所有图片资源的URL，但是需要注意，图片的静态资源一般放在不同的服务器，因为一个window向同一个服务器请求的资源数目常常是有限制的
const getImages = (req, res) => {
  db.query(sql, (err, result) => {
    if (err) {
      res.cc(err)
    }
    res.send({
      status: 200,
      msg: '请求数据成功',
      data: result
    })
  })
}

// 直接发送一个拼接好的数据给客户端，不要从服务器读取数据了，从服务器读取数据的只有上面的那一个获取home的url
const getFloorMsg = (req, res) => {
  res.send({
    status: 200,
    msg: '获取floor渲染数据成功',
    data: floorMsg
  })
}

module.exports = {
  getImages,
  getFloorMsg
}
