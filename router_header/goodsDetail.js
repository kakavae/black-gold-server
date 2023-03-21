// 导入数据库处理模块
const db = require('../db/index.js')

const getGoodsDetail = (req, res) => {
  // console.log(req.params.skuId)  根据这个id去数据库查数据
  db.query(`select * from my_db_02.goodlist_detail where id = ${req.params.skuId}`, (err, result) => {
    if (err) {
      res.cc('获取商品详情错误')
    }
    // console.log(result)
    const { id, title, price, defaultImg } = result[0] // result return Array, just a data
    // 将查询结果中的图片，Name，id，价格拼接到一个对象当中给返回
    const data = {
      valuesSkuJson: '{"3|5|7":6,"3|4|7":2,"2|4|7":3,"1|5|7":5,"1|4|7":1,"2|5|7":4}',
      price: price,
      categoryView: {
        id: id,
        category1Id: 2,
        category1Name: '手机',
        category2Id: 13,
        category2Name: '手机通讯',
        category3Id: 61,
        category3Name: '手机'
      },
      spuSaleAttrList: [
        {
          id: 1,
          spuId: 1,
          baseSaleAttrId: 1,
          saleAttrName: '选择颜色',
          spuSaleAttrValueList: [
            {
              id: 1,
              spuId: 1,
              baseSaleAttrId: 1,
              saleAttrValueName: '黑色',
              saleAttrName: '选择颜色',
              isChecked: '0'
            },
            {
              id: 2,
              spuId: 2,
              baseSaleAttrId: 2,
              saleAttrValueName: '红色',
              saleAttrName: '选择颜色',
              isChecked: '1'
            }
          ]
        },
        {
          id: 2,
          spuId: 1,
          baseSaleAttrId: 2,
          saleAttrName: '选择版本',
          spuSaleAttrValueList: [
            {
              id: 4,
              spuId: 1,
              baseSaleAttrId: 2,
              saleAttrValueName: '64GB',
              saleAttrName: '选择版本',
              isChecked: '1'
            },
            {
              id: 5,
              spuId: 1,
              baseSaleAttrId: 2,
              saleAttrValueName: '128GB',
              saleAttrName: '选择版本',
              isChecked: '0'
            }
          ]
        },
        {
          id: 3,
          spuId: 1,
          baseSaleAttrId: 3,
          saleAttrName: '选择套装',
          spuSaleAttrValueList: [
            {
              id: 7,
              spuId: 1,
              baseSaleAttrId: 3,
              saleAttrValueName: ' 官方标配',
              saleAttrName: '选择套装',
              isChecked: '1'
            },
            {
              id: 8,
              spuId: 1,
              baseSaleAttrId: 3,
              saleAttrValueName: ' 中国移动合作',
              saleAttrName: '选择套装',
              isChecked: '0'
            }
          ]
        }
      ],
      skuInfo: {
        id: id,
        spuId: 1,
        price: price,
        skuName: title,
        skuDesc:
          '主体\n \n入网型号\nA2223\n品牌\nApple\n产品名称\niPhone 11\n上市年份\n2019年\n上市月份\n9月\n基本信息\n \n机身颜色\n红色\n机身长度（mm）\n150.9\n机身重量（g）\n194\n机身材质工艺\n以官网信息为准\n机身宽度（mm）\n75.7\n机身材质分类\n玻璃后盖\n机身厚度（mm）\n8.3\n运营商标志或内容\n无',
        weight: '0.47',
        tmId: 1,
        category3Id: 61,
        skuDefaultImg: defaultImg,
        isSale: 1,
        skuImageList: [
          {
            id: 6,
            skuId: 2,
            imgName: '63e862164165f483.jpg',
            imgUrl: defaultImg,
            spuImgId: 2,
            isDefault: '0'
          },
          {
            id: 5,
            skuId: 2,
            imgName: '63e862164165f483.jpg',
            imgUrl: 'http://127.0.0.1:8091/detailImages/s2.png',
            spuImgId: 2,
            isDefault: '0'
          },
          {
            id: 4,
            skuId: 2,
            imgName: '63e862164165f483.jpg',
            imgUrl: 'http://127.0.0.1:8091/detailImages/s3.png',
            spuImgId: 2,
            isDefault: '0'
          },
          {
            id: 3,
            skuId: 2,
            imgName: '63e862164165f483.jpg',
            imgUrl: 'http://127.0.0.1:8091/detailImages/s1.png',
            spuImgId: 2,
            isDefault: '0'
          },
          {
            id: 2,
            skuId: 2,
            imgName: '63e862164165f483.jpg',
            imgUrl: 'http://127.0.0.1:8091/detailImages/s2.png',
            spuImgId: 2,
            isDefault: '0'
          },
          {
            id: 1,
            skuId: 2,
            imgName: '63e862164165f483.jpg',
            imgUrl: 'http://127.0.0.1:8091/detailImages/s3.png',
            spuImgId: 2,
            isDefault: '0'
          }
        ],
        skuAttrValueList: [
          {
            id: 6,
            attrId: 1,
            valueId: 6,
            skuId: 2
          }
        ],
        skuSaleAttrValueList: null
      }
    }
    res.send({
      code: 200,
      message: '成功',
      data: data
    })
  })
}

module.exports = {
  getGoodsDetail
}
