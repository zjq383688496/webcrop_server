var page = require('webpage').create()
// page.open('https://www.jd.com/', function(status) {
// 	console.log('======= status =======')
// 	console.log(status)
// 	page.render('jd.png')
// 	phantom.exit()
// })
// page.evaluate(function() {
// 	window.scrollTo(0, 10000)
// 	console.log(document.title)
// })

var array  = []

page.settings = {
	javascriptEnabled: true,
	loadImages: true
}
page.viewportSize = { width: 1200, height: 10000 }
page.onResourceRequested = function(requestData, networkRequest) {
	array.push(requestData.id)
}

page.onResourceReceived = function(response) {
	var index = array.indexOf(response.id)
	array.splice(index, 1)
}

page.evaluate(function() {
	window.scrollTo(0, 20000)
})

page.open('https://www.jd.com/', function(status) {
	console.log(status)
	page.evaluate(function() {
		// document.body.innerHTML = ''
		window.scrollTo(0, 20000)
	})
	// setTimeout(function() {
	// 	page.render('jd.png')
	// 	console.log(status)
	// 	phantom.exit()
	// }, 30000)
	var interval = setInterval(function () {
		// page.evaluate(function() {
		// 	document.body.innerHTML = ''
		// 	window.scrollTo(0, 20000)
		// })
		if(array.length === 0) {
			clearInterval(interval)
			// setTimeout(function() {
				page.render('jd.png', { format: 'jpeg', quality: '100' })

				// page.render('taobao.png')
				console.log(status)
				phantom.exit()
			// }, 10000)
		}
	}, 100)
})