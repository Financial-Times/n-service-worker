const path = require('path');
const nWebpack = require('@financial-times/n-webpack');

module.exports = nWebpack({
	withBabelPolyfills: false,
	output: {
		filename: '[name]',
		devtoolModuleFilenameTemplate: 'n-service-worker//[resource-path]?[loaders]'
	},
	entry: {
		'./dist/__sw.js': './src/__sw.js'
	},
	include: [path.resolve('./src')],
	loaders: [
		{
			test: /indexeddb-promised\.js$/,
			loader: require.resolve('imports-loader'),
			query: 'window=>self'
		}
	]
});
