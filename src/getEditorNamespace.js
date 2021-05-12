/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import loadScript from './loadScript';

/* global CKEDITOR */

let promise;

/**
 * Loads `CKEDITOR` script using the given URL.
 *
 * ```js
 * getEditorNamespace( 'https://cdn.ckeditor.com/4.15.0/standard/ckeditor.js' ).then( CKEDITOR => {
 *		console.log( CKEDITOR.version );
 * } );
 * ```
 *
 * Note that this function won't load provided URL if `CKEDITOR` namespace is already available
 * in the global namespace.
 *
 * You can also provide additional `onNamespaceLoaded` callback which will be called only when the given
 * URL has been used to load `CKEDITOR` namespace.
 *
 * ```js
 * getEditorNamespace( 'https://cdn.ckeditor.com/4.15.0/standard/ckeditor.js', function( CKEDITOR ) {
 *		console.log( CKEDITOR.version );
 * } );
 * ```
 *
 * @param {String} editorURL
 * @param {Function} onNamespaceLoaded
 * @returns {Promise}
 */
export default function getEditorNamespace( editorURL, onNamespaceLoaded ) {
	if ( 'CKEDITOR' in window ) {
		return Promise.resolve( CKEDITOR );
	}

	if ( typeof editorURL !== 'string' || editorURL.length < 1 ) {
		return Promise.reject( new TypeError( 'CKEditor URL must be a non-empty string.' ) );
	}

	if ( !promise ) {
		promise = getEditorNamespace.scriptLoader( editorURL ).then( res => {
			// Call this callback only if CKEDITOR namespace
			// has been loaded by external script for the first time.
			if ( onNamespaceLoaded ) {
				onNamespaceLoaded( res );
			}

			return res;
		} );
	}

	return promise;
}

getEditorNamespace.scriptLoader = editorURL => new Promise( ( scriptResolve, scriptReject ) => {
	loadScript( editorURL, err => {
		promise = undefined;

		if ( err ) {
			return scriptReject( err );
		} else if ( !window.CKEDITOR ) {
			return scriptReject( new Error( 'Script loaded from editorUrl doesn\'t provide CKEDITOR namespace.' ) );
		}

		scriptResolve( CKEDITOR );
	} );
} );
