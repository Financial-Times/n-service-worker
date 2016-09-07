// Karma configuration
// Generated on Fri Apr 18 2014 18:19:03 GMT+0100 (BST)

const path = require('path');

module.exports = function (karma) {

	const config = {

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

		// list of files / patterns to load in the browser
		files: [
			'test/**/*.spec.js',
			{pattern: 'test/helpers.js', served: true},
			{pattern: 'src/__sw.js', served: true, included: false}
		],
		proxies: {
		  '/__sw.js': '/base/src/__sw.js'
		},

		preprocessors: {
			'test/helpers.js': ['webpack', 'sourcemap'],
			'test/**/*.spec.js': ['webpack', 'sourcemap'],
			'src/__sw.js': ['webpack', 'sourcemap']
		},
		webpack: {
			module: {
				loaders: [
					{
						test: /\.js$/,
						loader: 'babel',
						exclude: [
							path.resolve('./node_modules')
						],
						query: {
							cacheDirectory: true,
							// presets: ['es2015'],
							plugins: [
								['add-module-exports', {loose: true}],
								['transform-es2015-classes', { loose: true }],
								['transform-es2015-modules-commonjs', {loose: true}]
							]
						}
					},
					{
						test: /indexeddb-promised\.js$/,
						loader: require.resolve('imports-loader'),
						query: 'window=>self'
					}
				]
			},
			resolve: {
				root: [
					path.join(__dirname, 'node_modules')
				]
			}
		},
		reporters: ['progress'],
		port: 9876,
		colors: true,
		// possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
		logLevel: karma.LOG_INFO,
		autoWatch: false,
		browsers: ['Chrome'],
		plugins: [
			require('karma-mocha'),
			require('karma-chai'),
			require('karma-sinon'),
			require('karma-sinon-chai'),
			require('karma-sourcemap-loader'),
			require('karma-webpack'),
			require('karma-chrome-launcher'),
			require('karma-html-reporter')
		],
		client: {
				mocha: {
						reporter: 'html',
						ui: 'bdd',
						timeout: 0
				}
		},
		singleRun: true
	};

	karma.set(config);
};
