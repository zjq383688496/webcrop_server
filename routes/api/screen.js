const fs        = require('fs')
const child     = require('child_process')
const phantomjs = require('phantomjs-prebuilt')
const model = require('phantomjs-prebuilt')
const router = require('koa-router')()

router.prefix('/screen')

const format = {
	jpg: 1,
	png: 1,
}

// 'https://www.baidu.com'

function result() {
	const bin = phantomjs.path
	return async (ctx, next) => {
		const params = ctx.params
		const query  = ctx.query
		if (!format[params.format] || !query.url) return next()
		const args     = childArgsFn(ctx, query.url, params.format, query.type, query.q)
		const htmlFile = await (new Promise((resolve, reject) => {
			return child.execFile(bin, args.args, (err, stdout, stderr) => {
				if (err || stderr) {
					reject('err || stderr')
				}
				// fs.readFile(args.path, (err, data) => {
				// 	if (err) reject(err)
				// 	else {
				// 		fs.unlinkSync(args.path)
				// 		resolve(data)
				// 	}
				// })
				resolve({ url: `${ctx.origin}/${args.path}` })
			})
		}))
		ctx.type = 'jpg'
		ctx.body = htmlFile
	}
}

router.get('/crop.:format', result())



function childArgsFn(ctx, url, format = 'jpeg', type = '0', name = `file_${Date.now()}`, q = 80) {
	var path = 'img/'
	return {
		path: `${path}${name}.${format.replace('jpeg', 'jpg')}`,
		args: [ `${ctx.cfg.root}/crop.js`, url, format, type, name, q ],
	}
}

module.exports = router