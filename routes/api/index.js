// const config = require('../../config')
const router = require('koa-router')()

const screen = require('./screen')

router.prefix('/api')

router.use(screen.routes(), screen.allowedMethods())

module.exports = router