const fs     = require('fs')
const uuid   = require('uuid/v4')
const crypto = require('crypto')

const typeMap = {
	sha128: 1,
	sha256: 1,
	sha512: 1,
	md5: 1
}

const hashFile = function(path, type, cb) {
	var stream = fs.createReadStream(path)
	let Chunk = '',
		_type = typeof type === 'string'? type: 'md5',
		_cb   = typeof type === 'function'? type: ''
	if (!typeMap[_type]) _type = 'md5'
	stream.on('error', err => {
		_cb && _cb(err)
	})
	stream.on('data', chunk => {
		Chunk += chunk.toString('binary')
	})
	stream.on('end', (e) => {
		const buf   = new Buffer(Chunk, 'binary')
		const hash = crypto.createHash(_type)
		hash.update(buf)
		const str = hash.digest('hex')
		const nPath = path.replace(/([^\/]+)\.(jpg|png)$/, `${str}.$2`)
		fs.rename(path, nPath)
		_cb && _cb(null, nPath)
	})
}

module.exports = hashFile