const config = {
	defaults: {
		page: {
			headers: {
				"Cookie": "next-flags=ads:off,cookieMessage:off; secure=true"
			}
		},
		timeout: 25000
	},
	urls: ['http://localhost:5005']
}

module.exports = config;
