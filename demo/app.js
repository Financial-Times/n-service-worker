const internalTool = require('@financial-times/n-internal-tool');
const chalk = require('chalk');
const path = require('path');

const fixtures = require('./fixtures.json');

const errorHighlight = chalk.bold.red;
const highlight = chalk.bold.green;

const app = internalTool({
	s3o: false,
	partialsDirectory: path.resolve(__dirname, '..'),
	systemCode: 'n-service-worker',
	viewsDirectory: '/demo'
});

app.get('/', (req, res) => {
	res.render('demo', Object.assign({
		title: 'Test App',
		layout: 'vanilla',
	}, fixtures));
});

function runPa11yTests () {
	const spawn = require('child_process').spawn;
	const pa11y = spawn('pa11y-ci');

	pa11y.stdout.on('data', (data) => {
		console.log(highlight(`${data}`)); //eslint-disable-line
	});

	pa11y.stderr.on('data', (error) => {
		console.log(errorHighlight(`${error}`)); //eslint-disable-line
	});

	pa11y.on('close', (code) => {
		process.exit(code);
	});
}

const listen = app.listen(5005);

if (process.env.PA11Y === 'true') {
	listen.then(runPa11yTests);
}
