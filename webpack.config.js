const path = require('path');
const webpack = require('webpack');

const browsers = ['> 1%', 'last 2 versions', 'ie >= 9', 'ff ESR', 'bb >= 7', 'iOS >= 5'];

const getEnvironment = () => {
	if (!process.env.CIRCLE_BUILD_NUM) {
		return 'prod';
	}
	let env = 'master';
	if (process.env.CIRCLE_TAG) {
		const customEnv = (/prod|qa|canary/.exec(process.env.CIRCLE_TAG) || [])[0];
		if (customEnv) {
			env = customEnv;
		}
	}
	return env;
};

module.exports = {

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]',
		devtoolModuleFilenameTemplate: 'n-service-worker//[resource-path]?[loaders]',
	},

	entry: {
		[`__sw-${getEnvironment()}.js`]: './src/__sw.js',
	},

	bail: true,

	devtool: 'source-map',

	performance: {
		hints: 'warning', // enum
		maxAssetSize: 200000, // 200 kB,
		maxEntrypointSize: 500000, // 500 kB
		assetFilter: (assetFilename) => assetFilename.endsWith('.js'),
	},

	resolve: {
		plugins: [
			// Scope hoisting
			new webpack.optimize.ModuleConcatenationPlugin()
		],
		modules: [
			'node_modules'
		]
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: [
					path.resolve('./node_modules')
				],
				include: [
					path.resolve('./src'),
					path.resolve('./node_modules/indexeddb'),
					path.resolve('./node_modules/promise-rat-race')
				],
				query: {
					babelrc: false,
					cacheDirectory: true,
					plugins: [
						require.resolve('babel-plugin-add-module-exports', true),
						[
							require.resolve('babel-plugin-transform-runtime'),
							{
								helpers: false,
								polyfill: false,
							}
						],
					],
					presets: [
						[
							require.resolve('babel-preset-env'), {
								include: [
									'transform-es2015-classes',
									'transform-es2015-modules-commonjs'
								],
								targets: { browsers },
								loose: true
							}
						]
					]
				}
			},
			{
				test: /\.json$/,
				loader: require.resolve('json-loader')
			},
			{
				test: /indexeddb-promised\.js$/,
				loader: require.resolve('imports-loader'),
				query: 'window=>self'
			}
		]
	}
};
