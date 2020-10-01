/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

function debounce( fn, ms, context = {} ) {
	let cancel;

	return function( ...args ) {
		clearTimeout( cancel );
		cancel = setTimeout( fn.bind( context, ...args ), ms );
	};
}

export default debounce;
