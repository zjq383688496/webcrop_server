const config      = require('../config')
const fs          = require('fs')
const path        = require('path')
const execFile    = require('child_process').execFile
const phantomPath = require('phantomjs-prebuilt').path
const hashFile    = require('../utils/hashfile')
const execPath    = config.capture

const formatMap = {
	jpg: 1,
	png: 1,
}

const screenCapture = {
	// 注册phantomjs进程
	regChildProgess(cb) {
		return async (ctx, next) => {
			let me       = this,
				params   = ctx.params
				query    = ctx.query
				url      = query.url,
				format   = params.format || 'jpeg'
			if (!formatMap[format] || !url) return next()

			let type     = query.t || '0',
				fileName = `file_${Date.now()}`,
				quality  = query.q  || 80,
				width    = query.w  || 0,
				height   = query.h  || 0,
				scale    = query.s  || 1,
				timeout  = query.to || 0,
				loadTime = query.lt || 0,
				filePath = path.resolve(__dirname, `../public/img/${fileName}.${format.replace('jpeg', 'jpg')}`),
				sTime    = Date.now(), screenTime, hashTime,
				process  = await (new Promise((resolve, reject) => {
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
						timeout,
						loadTime,
					], (err, stdout, stderr) => {
						if (err || stderr) reject(err || stderr)
						console.log('phantomjs - 子进程已退出')
						screenTime = Date.now() - sTime
						sTime      = Date.now()
						console.log(`截图耗时 ${screenTime}ms`)
						cb && cb(filePath, reject, resolve, screenTime, sTime)
					})
				}))
			ctx.type = 'jpg'
			ctx.body = process
		}
	},
	create() {
		return this.regChildProgess((filePath, reject, resolve, screenTime, sTime) => {
			hashFile(filePath, (err, npath) => {
				if (err) reject(err)
				var hashTime = Date.now() - sTime
				resolve({
					url: npath,
					screenTime: screenTime,
					hashTime: hashTime,
					fullTime: screenTime + hashTime
				})
			})
		})
	},
	preview() {
		return this.regChildProgess((filePath, reject, resolve) => {
			fs.readFile(filePath, (err, data) => {
				if (err) reject(err)
				else {
					fs.unlinkSync(filePath)
					resolve(data)
				}
			})
		})
	}
}

module.exports = screenCapture