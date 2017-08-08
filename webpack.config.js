const path = require('path');
const nWebpack = require('@financial-times/n-webpack');

module.exports = nWebpack({
	withBabelPolyfills: false,
	output: {
		filename: '[name]',
		devtoolModuleFilenameTemplate: 'n-service-worker//[resource-path]?[loaders]'
	},
	entry: (() => {
		if (process.env.CIRCLE_BUILD_NUM) {
			let env = 'master';
			if (process.env.CIRCLE_TAG) {
				const customEnv = (/prod|qa|canary/.exec(process.env.CIRCLE_TAG) || [])[0];
				if (customEnv) {
					env = customEnv;
				}
			}
			const entry = {};
			entry[`./dist/__sw-${env}.js`] = './src/__sw.js';
			return entry;
		} else {
			return {'./dist/__sw-prod.js': './src/__sw.js'};
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
