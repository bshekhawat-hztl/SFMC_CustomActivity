const JWT = require('jsonwebtoken');

module.exports = (body, secret, cb) => {
	require('jsonwebtoken').verify(body.toString('utf8'), secret, {
		algorithm: 'HS256'
	}, cb);
};
