const { module: moduleRules, resolve } = require('./webpack.config');

module.exports = function (karma) {
	const config = {
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

		// list of files / patterns to load in the browser
		files: [

			'test/integration/main.spec.js',
			'test/integration/cache.spec.js',
			{ pattern: 'test/integration/helpers-browser.js', served: true },
			'test/integration/setup.js',
			{ pattern: 'test/sw/*.js', served: true, included: false },
			{ pattern: 'test/fixtures/files/*', served: true, included: false },
			{ pattern: 'test/**/*.js.map', served: true, included: false },
		],
		proxies: {
			'/integration-sw.js': '/base/test/sw/integration.js',
			'/files': '/base/test/fixtures/files',
			'/__origami': {
				target: 'https://www.ft.com/__origami',
				changeOrigin: true
			},
			'/__assets': {
				target: 'https://www.ft.com/__assets',
				changeOrigin: true
			}
		},
		preprocessors: {
			'test/integration/helpers-browser.js': ['webpack', 'sourcemap'],
			'test/integration/setup.js': ['webpack', 'sourcemap'],
			'test/integration/**/*.spec.js': ['webpack', 'sourcemap'],
			'test/sw/*.js': ['webpack', 'sourcemap']
		},
		webpack:  {
			devtool: 'inline-source-map',
			resolve,
			module: moduleRules
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
			require('karma-firefox-launcher'),
			require('karma-browserstack-launcher'),
			require('karma-html-reporter')
		],
		client: {
			mocha: {
				reporter: 'html',
				ui: 'bdd',
				timeout: 5000
			}
		},
		singleRun: true
	};

	if (process.env.CI) {
		config.browserStack = {
			username: process.env.BROWSERSTACK_USER,
			accessKey: process.env.BROWSERSTACK_KEY,
			project: 'n-service-worker',
			name: 'Unit Tests'
		};

		config.customLaunchers = {
			chromeLatest: {
				base: 'BrowserStack',
				browser: 'chrome',
				browser_version: 'latest',
				os: 'Windows',
				os_version: '10'
			},
			// TODO - unpin firefox version once browserstack bug is fixed
			firefoxLatest: {
				base: 'BrowserStack',
				browser: 'firefox',
				browser_version: '64',
				os: 'Windows',
				os_version: '10'
			},
			safariLatest: {
				base: 'BrowserStack',
				browser: 'safari',
				browser_version: 'latest',
				os: 'OS X',
				os_version: 'High Sierra'
			}
		};

		config.browsers = Object.keys(config.customLaunchers);

		config.reporters.push('BrowserStack');
	}

	karma.set(config);
};
