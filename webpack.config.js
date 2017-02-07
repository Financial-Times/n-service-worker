const path = require('path');
const nWebpack = require('@financial-times/n-webpack');

module.exports = nWebpack({
	withBabelPolyfills: false,
	output: {
		filename: '[name]',
		devtoolModuleFilenameTemplate: 'n-service-worker//[resource-path]?[loaders]'
	},
	entry: (() => {
		// A bit hacky, but in dev we want to generate a sw on the prod url,
		// which is the default when no flags are on
		if (process.env.CIRCLE_BUILD_NUM) {
			return {'./dist/__sw.js': './src/__sw.js'}
		} else {
			return {'./dist/__sw-prod.js': './src/__sw.js'}
		}
	})(),
	language: 'js',
	include: [
		path.resolve('./src'),
		path.resolve('./node_modules/indexeddb'),
			path.resolve('./node_modules/promise-rat-race')
	],
	loaders: [
		{
			test: /indexeddb-promised\.js$/,
			loader: require.resolve('imports-loader'),
			query: 'window=>self'
		}
	]
});
