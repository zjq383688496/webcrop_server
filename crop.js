var system   = require('system'),
	page     = require('webpage').create(),
	array    = []

console.log(system.args)
var settings = {
}

// 获取系统参数
var args   = system.args,
	url    = args[1],		// 参数1: url
	format = args[2],		// 参数2: 保存格式
	type   = args[3],		// 参数3: 类型 0: 默认 1: 移动端
	file   = args[4],		// 参数4: 文件名
	q      = args[5]		// 参数4: 质量

console.log(url === '')

if (url === '') {
	console.log('========== URL不能为空 ==========')
	phantom.exit()
}

// 功能设置
var ua = {
	0: 'mozilla/5.0 (macintosh; intel mac os x 10_13_0) applewebkit/537.36 (khtml, like gecko) chrome/65.0.3325.181 safari/537.36',
	1: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
},
view = {
	0: {
		width: 1440,
		height: 1080
	},
	1: {
		width: 375,
		height: 667
	}
}

// page.zoomFactor = 0.5
view = view[type]

page.clipRect = {
	top:  0,
	left: 0,
	width:  view.width,
	height: view.height
}
page.settings = {
	javascriptEnabled: true,	// 允许加载JS
	loadImages: true,			// 允许加载图片
	userAgent: ua[type],		// 使用userAgent
	resourceTimeout: 10000,		// 超时时间
}
page.viewportSize = view
page.onResourceRequested = function(requestData, networkRequest) {
	array.push(requestData.id)
}

page.onResourceReceived = function(response) {
	var index = array.indexOf(response.id)
	array.splice(index, 1)
}

page.evaluate(function() {
	window.scrollTo(0, view.height)
})

page.open(url, settings, function(status) {
	console.log(status)
	page.evaluate(function() {
		window.scrollTo(0, view.height)
	})
	var interval = setInterval(function () {
		console.log(array.length)
		if (array.length === 0) {
			clearInterval(interval)
			page.render('public/img/' + file + '.' + format.replace('jpeg', 'jpg'), { format: format, quality: q })
			phantom.exit()
		}
	}, 100)
})