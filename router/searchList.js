const express = require('express')
// const { getSearchList } = require('../router_header/searchList.js')
const { getSearchArticalList } = require('../router_header/getSearchArticalList')

const router = express()

console.log(getSearchArticalList)

// router.post('/', getSearchList)
router.get('/artical', getSearchArticalList)

module.exports = router
