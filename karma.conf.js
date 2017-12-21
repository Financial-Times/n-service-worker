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
			'test/main.spec.js',
			{ pattern: 'test/helpers-browser.js', served: true },
			{ pattern: 'test/test-bundles.js', served: true },
			'test/setup.js',
			// `test/caches/*spec.js` files MUST be run before the utils ones!!
			'test/caches/image.spec.js',
			// 'test/caches/fonts.spec.js',
			// 'test/caches/ads.spec.js',
			// 'test/caches/built-assets.spec.js',
			// 'test/caches/comments.spec.js',
			// 'test/caches/polyfill.spec.js',
			// 'test/utils/*.spec.js',
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
			'test/helpers-browser.js': ['webpack', 'sourcemap'],
			'test/test-bundles.js': ['webpack', 'sourcemap'],
			'test/setup.js': ['webpack', 'sourcemap'],
			'test/**/*.spec.js': ['webpack', 'sourcemap'],
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
			require('karma-sauce-launcher'),
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
		const nightwatchBrowsers = require('@financial-times/n-heroku-tools/config/nightwatch').test_settings;
		const whitelistedBrowsers = ['firefox', 'chrome'];
		const sauceBrowsers = Object.keys(nightwatchBrowsers).reduce((browserList, browserName) => {
			if (browserName === 'default' || whitelistedBrowsers.indexOf(browserName) === -1) {
				return browserList;
			}
			browserList[`${browserName}_sauce`] = Object.assign({ base: 'SauceLabs' }, nightwatchBrowsers[browserName].desiredCapabilities);
			return browserList;
		}, {});
		config.customLaunchers = sauceBrowsers;
		config.sauceLabs = {
			testName: 'n-service-worker unit tests',
			username: process.env.SAUCE_USER,
			accessKey: process.env.SAUCE_KEY,
			recordScreenshots: true
		};

		config.browsers = Object.keys(sauceBrowsers);
		config.reporters.push('saucelabs');
	}

	karma.set(config);
};
