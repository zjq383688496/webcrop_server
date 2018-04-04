const config      = require('../config')
const path        = require('path')
const execFile    = require('child_process').execFile
const phantomPath = require('phantomjs-prebuilt').path
const execPath    = path.resolve(__dirname, './capture.js')


function childArgs(ctx, url, format = 'jpeg', type = '0', name = `file_${Date.now()}`, q = 80) {
	var path = 'img/'
	return {
		path: `${path}${name}.${format.replace('jpeg', 'jpg')}`,
		args: [ `${ctx.cfg.root}/crop.js`, url, format, type, name, q ],
	}
}

const screenCapture {
	// 注册phantomjs进程
	regChildProgess(params) {
		return async () => {
			let me = this,
				url = `${params.url}`,
				height = params.height || 1000,
				format = params.format || 1,
				fileName = `${key}.jpg`,
				filePath = path.resolve(__dirname, `../public/img/${fileName}`),

				process = await (new Promise((resolve, reject) => {
					execPath(phantomPath, [execPath, url, filePath, height], (err, stdout, stderr) => {
						if (err || stderr) reject(err || stderr)
						var code = stdout.replace(/[\r\n]/g, '')
						if (code === 'success') resolve(code)
					})
				}))
			process.on('exit', code => {
				console.log('phantomjs - 子进程已退出')
			})
		}
	}
}

module.exports = screenCapture