'use strict'

const request = require('request')

const ajax = {
	result: function(err, res, data, cb) {
		if (!err) {
			// console.log('============= data =============')
			// console.log(data)
			if (res.statusCode === 200) {
				cb && cb(null, data, res)
			} else {
				cb && cb(data, res)
			}
		} else {
			// console.log('============= error =============')
			// console.log(err)
			cb && cb(err, res)
		}
	},
	get: function(url, cb) {
		var me = this
		var opts = {
			url: url,
			json: true
		}
		request.get(opts, function (err, res, data) {
			// console.log('===================== API =====================')
			// console.log(url)
			me.result(err, res, data, cb)
		})
	},
	post: function(url, reqData, cb) {
		var me = this
		var opts = {
			url: url,
			json: true,
			form: reqData
		}
		request.post(opts, function (err, res, data) {
			// console.log('===================== API =====================')
			// console.log(url)
			// console.log('===================== DATA =====================')
			// if (reqData.imageBase64) {
			// 	console.log({ imageBase64: 'Base64' })
			// } else {
			// 	console.log(reqData)
			// }
			me.result(err, res, data, cb)
		})
	},
}

module.exports = ajax