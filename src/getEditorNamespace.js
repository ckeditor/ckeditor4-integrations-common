/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import loadScript from 'load-script';

/* global CKEDITOR */

let promise;

export default function getEditorNamespace( editorURL, namespaceLoaded ) {
	if ( 'CKEDITOR' in window ) {
		return Promise.resolve( CKEDITOR );
	}

	if ( editorURL.length < 1 ) {
		throw new TypeError( 'CKEditor URL must be a non-empty string.' );
	}

	if ( !promise ) {
		promise = getEditorNamespace.scriptLoader( editorURL ).then( res => {
			promise = undefined;

			// Call this callback only if CKEDITOR namespace
			// has been loaded by external script for the first time.
			if ( namespaceLoaded ) {
				namespaceLoaded( res );
			}

			return res;
		} );
	}

	return promise;
}

getEditorNamespace.scriptLoader = editorURL => new Promise( ( scriptResolve, scriptReject ) => {
	loadScript( editorURL, err => {
		if ( err ) {
			return scriptReject( err );
		} else if ( !window.CKEDITOR ) {
			return scriptReject( new Error( 'Script loaded from editorUrl doesn\'t provide CKEDITOR namespace.' ) );
		}

		scriptResolve( CKEDITOR );
	} );
} );
