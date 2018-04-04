const config      = require('../config')
const path        = require('path')
const execFile    = require('child_process').execFile
const phantomPath = require('phantomjs-prebuilt').path
const execPath    = config.capture

const formatMap = {
	jpg: 1,
	png: 1,
}

const screenCapture = {
	// 注册phantomjs进程
	regChildProgess() {
		return async (ctx, next) => {
			let me       = this,
				params   = ctx.params
				query    = ctx.query
				url      = query.url,
				format   = params.format || 'jpeg'
			if (!formatMap[format] || !url) return next()

			let type     = query.t || '0',
				fileName = `file_${Date.now()}`,
				quality  = query.q || 80,
				width    = query.w || 0,
				height   = query.h || 0,
				scale    = query.s || 1,
				loadTime = query.l || 0,
				filePath = path.resolve(__dirname, `../public/img/${fileName}.${format.replace('jpeg', 'jpg')}`),

				process = await (new Promise((resolve, reject) => {
					execFile(phantomPath, [
						execPath,
						url,
						format,
						type,
						fileName,
						quality,
						width,
						height,
						scale,
						loadTime,
					], (err, stdout, stderr) => {
						console.log(stdout)
						if (err || stderr) reject(err || stderr)
						// var code = stdout.replace(/[\r\n]/g, '')
						console.log('phantomjs - 子进程已退出')
						resolve({ url: filePath })
					})
				}))
			ctx.type = 'jpg'
			ctx.body = process
			// process.on('exit', code => {
			// 	console.log('phantomjs - 子进程已退出')
			// })
		}
	}
}

module.exports = screenCapture