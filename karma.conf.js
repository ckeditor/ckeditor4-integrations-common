// Karma configuration
// Generated on Fri Sep 25 2020 11:02:54 GMT+0200 (Central European Summer Time)

const { join: joinPath } = require( 'path' );

const basePath = process.cwd();
const coverageDir = joinPath( basePath, 'coverage' );

module.exports = function( config ) {
	config.set( {

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath,

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [ 'mocha', 'chai', 'sinon' ],

		plugins: [
			'karma-browserstack-launcher',
			'karma-chai',
			'karma-chrome-launcher',
			'karma-coverage',
			'karma-firefox-launcher',
			'karma-mocha',
			'karma-mocha-reporter',
			'karma-sinon',
			'karma-webpack'
		],

		// list of files / patterns to load in the browser
		files: [
			'tests/**/*.js'
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'tests/**/*.js': [ 'webpack' ]
		},

		webpack: {
			mode: 'development',
			devtool: 'inline-source-map',

			module: {
				rules: [
					{
						test: /\.js$/,
						loader: 'babel-loader',
						exclude: /node_modules/,
						query: {
							compact: false,
							presets: [ '@babel/preset-env' ]
						}
					},
					{
						test: /\.js$/,
						loader: 'istanbul-instrumenter-loader',
						include: /src/,
						exclude: [
							/node_modules/
						],
						query: {
							esModules: true
						}
					}
				]
			}
		},

		webpackMiddleware: {
			noInfo: true,
			stats: 'minimal'
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [
			'mocha',
			'coverage'
		],

		coverageReporter: {
			reporters: [
				// Prints a table after tests result.
				{
					type: 'text'
				},
				// Generates HTML tables with the results.
				{
					dir: coverageDir,
					type: 'html'
				},
				// Generates "lcov.info" file. It's used by external code coverage services.
				{
					type: 'lcovonly',
					dir: coverageDir
				}
			]
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: getBrowsers(),

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		mochaReporter: {
			showDiff: true
		},

		specReporter: {
			suppressPassed: shouldEnableBrowserStack()
		},

		customLaunchers: {
			BrowserStack_Edge: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'edge'
			},
			BrowserStack_IE11: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'ie',
				browser_version: '11.0'
			},
			BrowserStack_Safari: {
				base: 'BrowserStack',
				os: 'OS X',
				os_version: 'High Sierra',
				browser: 'safari'
			}
		},

		browserStack: {
			username: process.env.BROWSER_STACK_USERNAME,
			accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
			build: getBuildName(),
			project: 'ckeditor4-integrations-common'
		}
	} );
};

// Formats name of the build for BrowserStack. It merges a repository name and current timestamp.
// If env variable `TRAVIS_REPO_SLUG` is not available, the function returns `undefined`.
//
// @returns {String|undefined}
function getBuildName() {
	const repoSlug = process.env.TRAVIS_REPO_SLUG;

	if ( !repoSlug ) {
		return;
	}

	const repositoryName = repoSlug.split( '/' )[ 1 ].replace( /-/g, '_' );
	const date = new Date().getTime();

	return `${ repositoryName } ${ date }`;
}

function getBrowsers() {
	if ( shouldEnableBrowserStack() ) {
		return [
			'Chrome',
			'BrowserStack_Safari',
			'Firefox',
			'BrowserStack_Edge',
			'BrowserStack_IE11'
		];
	}

	return [
		'Chrome',
		'Firefox'
	];
}

function shouldEnableBrowserStack() {
	if ( !process.env.BROWSER_STACK_USERNAME ) {
		return false;
	}

	if ( !process.env.BROWSER_STACK_ACCESS_KEY ) {
		return false;
	}

	// If the repository slugs are different, the pull request comes from the community (forked repository).
	// For such builds, BrowserStack will be disabled. Read more: https://github.com/ckeditor/ckeditor5-dev/issues/358.
	return ( process.env.TRAVIS_EVENT_TYPE !== 'pull_request' || process.env.TRAVIS_PULL_REQUEST_SLUG === process.env.TRAVIS_REPO_SLUG );
}
