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
	include: [path.resolve('./src'), path.resolve('./node_modules/indexeddb')],
	loaders: [
		{
			test: /indexeddb-promised\.js$/,
			loader: require.resolve('imports-loader'),
			query: 'window=>self'
		}
	]
});
