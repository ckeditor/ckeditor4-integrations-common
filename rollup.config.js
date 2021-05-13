import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import { babel } from '@rollup/plugin-babel';

const input = 'src/index.js';
const banner = `/**
* @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.md.
*/`;

export default [
	// Creates `umd` build that can be directly consumed via <script /> tag.
	{
		input,
		output: {
			banner,
			format: 'umd',
			file: 'dist/index.umd.min.js',
			name: 'CKEditor4IntegrationsCommon'
		},
		plugins: [ babelPlugin(), commonjs(), cleanupPlugin(), terser() ]
	},
	// Creates `cjs` build that can be further optimized downstream.
	{
		input,
		output: {
			banner,
			format: 'cjs',
			file: 'dist/index.cjs.js'
		},
		plugins: [ babelPlugin(), commonjs(), cleanupPlugin() ]
	},
	// Creates `esm` build that can be further optimized downstream.
	{
		input,
		output: {
			banner,
			format: 'esm',
			file: 'dist/index.esm.js'
		},
		plugins: [ babelPlugin(), commonjs(), cleanupPlugin() ]
	}
];

function babelPlugin() {
	return babel( { babelHelpers: 'bundled', presets: [ '@babel/preset-env' ] } );
}

function cleanupPlugin() {
	return cleanup( {
		extensions: [ 'js' ],
		comments: [
			/@license Copyright (c) 2003-2021, CKSource - Frederico Knabben./
		]
	} );
}
