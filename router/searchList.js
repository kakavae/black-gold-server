const express = require('express')
const { getSearchList } = require('../router_header/searchList.js')

const router = express()

router.post('/', getSearchList)

module.exports = router
