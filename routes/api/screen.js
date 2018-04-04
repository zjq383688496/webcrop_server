const fs        = require('fs')
const child     = require('child_process')
const phantomjs = require('phantomjs-prebuilt')
const model     = require('../../model')
const screen    = model.screen
const router    = require('koa-router')()


// debugger

router.prefix('/screen')

const format = {
	jpg: 1,
	png: 1,
}

router.get('/create.:format',  screen.create())

router.get('/preview.:format', screen.preview())

module.exports = router