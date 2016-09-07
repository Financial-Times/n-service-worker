const path = require('path');
const nWebpack = require('@financial-times/n-webpack');

const webpackConfig = nWebpack({
	withBabelPolyfills: false,
	output: {
		filename: '[name]',
		devtoolModuleFilenameTemplate: 'n-service-worker//[resource-path]?[loaders]'
	},
	entry: {
		'./dist/__sw.js': './src/__sw.js'
	},
	language: 'js',
	include: [path.resolve('./src'), path.resolve('./node_modules/indexeddb')],
	loaders: [
		{
			test: /indexeddb-promised\.js$/,
			loader: require.resolve('imports-loader'),
			query: 'window=>self'
		}
	]
});

module.exports = webpackConfig;
