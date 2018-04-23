const env = process.env.NODE_ENV || 'localhost'
const config = {
	localhost: {
		imgUpload: 'http://192.168.1.52:9888',
	},
	v4: {
		imgUpload: 'http://mp-dev.rongyi.com',
	},
	v8: {
		imgUpload: 'http://mp-dev.rongyi.com',
	},
}

var curConfig       = config[env]
curConfig.root      = __dirname
curConfig.img       = `${__dirname}/public/img`
curConfig.capture   = `${__dirname}/utils/capture.js`
curConfig.imgUpload += `/miniprog-manager-gateway/utility/uploadImage`

console.log(curConfig)

module.exports = curConfig