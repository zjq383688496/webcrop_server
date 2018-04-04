var system   = require('system'),
	page     = require('webpage').create(),
	array    = [],
	settings

console.log(system.args)

// 获取系统参数
var args     = system.args,
	url      = args[1],		// 参数1: url
	format   = args[2],		// 参数2: 保存格式
	type     = args[3],		// 参数3: 类型 0: 默认 1: 移动端
	fileName = args[4],		// 参数4: 文件名
	quality  = args[5]*1,	// 参数5: 质量
	width    = args[6]*1,	// 参数6: 宽度
	height   = args[7]*1,	// 参数7: 高度
	scale    = args[8]*1,	// 参数8: 缩放倍率
	timeout  = args[9]*1	// 参数9: 资源过期时间(ms)
	loadTime = args[10]*1	// 参数10: 页面加载延迟(ms)

console.log(url === '')

if (url === '') {
	console.log('========== URL不能为空 ==========')
	phantom.exit()
}

// 功能设置 根据type
var ua = {
	0: 'mozilla/5.0 (macintosh; intel mac os x 10_13_0) applewebkit/537.36 (khtml, like gecko) chrome/65.0.3325.181 safari/537.36',
	1: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
}
var view = {
	0: {
		width:  width  || 1280,
		height: height || 1080
	},
	1: {
		width:  width  || 375,
		height: height || 667
	}
}

view = view[type]
page.zoomFactor = scale

page.clipRect = {
	top:  0,
	left: (view.width - view.width  * scale) / 2,
	width:  view.width  * scale,
	height: view.height * scale
}
console.log((view.width - view.width  * scale) / 2)
console.log(view.width  * scale)
console.log(view.height * scale)
settings = {
	javascriptEnabled: true,	// 允许加载JS
	loadImages: true,			// 允许加载图片
	userAgent: ua[type]			// 使用userAgent
	// XSSAuditingEnabled: true
}
if (timeout) settings.resourceTimeout = timeout * 1000
page.settings = settings
page.viewportSize = {
	width:  view.width,
	height: view.height * 2
}
page.onResourceRequested = function(requestData, networkRequest) {
	array.push(requestData.id)
}

page.onResourceReceived = function(response) {
	var index = array.indexOf(response.id)
	array.splice(index, 1)
}

page.evaluate(function(h) {
	window.scrollTo(0, h)
}, view.height)

page.open(url, settings, function(status) {
	console.log(status)
	page.evaluate(function(h) {
		window.scrollTo(0, h)
	}, view.height)
	var interval = setInterval(function () {
		console.log(array.length)
		if (array.length === 0) {
			clearInterval(interval)
			setTimeout(function() {
				page.render('public/img/' + fileName + '.' + format.replace('jpeg', 'jpg'), { format: format, quality: quality })
				phantom.exit()
			}, loadTime * 1000)
		}
	}, 100)
})