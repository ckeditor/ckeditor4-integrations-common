/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global assert */

import { getEditorNamespace } from '../src';
import sinon from 'sinon';

describe( 'getEditorNamespace', () => {
	const fakeScriptWithNamespace = 'data:text/javascript;base64,d2luZG93LkNLRURJVE9SID0ge307';
	const fakeScriptWithoutNamespace = 'data:text/javascript;base64,d2luZG93LkNLRURJVE9SID0gdW5kZWZpbmVkOw==';

	beforeEach( () => {
		delete window.CKEDITOR;
	} );

	it( 'should load script and resolve with loaded namespace', () => {
		return getEditorNamespace( fakeScriptWithNamespace ).then( namespace => {
			expect( namespace ).to.equal( window.CKEDITOR );
		} );
	} );

	it( 'when namespace loaded for the first time should pre-call callback', () => {
		const spy = sinon.spy();

		return getEditorNamespace( fakeScriptWithNamespace, spy ).then( namespace => {
			expect( spy.calledWith( namespace ) ).to.equal( true );
		} );
	} );

	it( 'when script doesn\'t provide namespace should reject with an error', () => {
		return getEditorNamespace( fakeScriptWithoutNamespace ).catch( err => {
			expect( err ).to.be.an( 'error' );
			expect( err.message ).to.equal( 'Script loaded from editorUrl doesn\'t provide CKEDITOR namespace.' );
		} );
	} );

	it( 'when script cannot be loaded should reject with an error', () => {
		return getEditorNamespace( 'non-existent.js' ).catch( err => {
			expect( err ).to.be.an( 'error' );
		} );
	} );

	it( 'should return the same promise', () => {
		const promise1 = getEditorNamespace( fakeScriptWithNamespace );
		const promise2 = getEditorNamespace( fakeScriptWithNamespace );

		expect( promise1 ).to.equal( promise2 );

		return Promise.all( [ promise1, promise2 ] );
	} );

	it( 'when empty string passed should throw', () => {
		return getEditorNamespace( '' ).catch( err => {
			expect( err ).to.be.an( 'error' );
			expect( err.message ).to.equal( 'CKEditor URL must be a non-empty string.' );
		} );
	} );

	it( 'when undefined passed should throw', () => {
		return getEditorNamespace( undefined ).catch( err => {
			expect( err ).to.be.an( 'error' );
			expect( err.message ).to.equal( 'CKEditor URL must be a non-empty string.' );
		} );
	} );

	it( 'when null passed should throw', () => {
		return getEditorNamespace( null ).catch( err => {
			expect( err ).to.be.an( 'error' );
			expect( err.message ).to.equal( 'CKEditor URL must be a non-empty string.' );
		} );
	} );

	it( 'when 1 passed should throw', () => {
		return getEditorNamespace( 1 ).catch( err => {
			expect( err ).to.be.an( 'error' );
			expect( err.message ).to.equal( 'CKEditor URL must be a non-empty string.' );
		} );
	} );

	describe( 'when namespace is present', () => {
		beforeEach( () => {
			window.CKEDITOR = {};
		} );

		it( 'should return a promise', () => {
			const promise = getEditorNamespace( fakeScriptWithNamespace );

			expect( promise ).to.be.a( 'promise' );

			return promise;
		} );

		it( 'promise should resolve with CKEditor namespace', () => {
			return getEditorNamespace( fakeScriptWithNamespace ).then( namespace => {
				expect( namespace ).to.equal( window.CKEDITOR );
			} );
		} );

		it( 'and empty string passed shouldn\'t throw', () => {
			return getEditorNamespace( fakeScriptWithNamespace ).catch( () => {
				assert.fail();
			} );
		} );

		it( 'shouldn\'t call callback for the second time', () => {
			const spy = sinon.spy();

			return getEditorNamespace( fakeScriptWithNamespace ).then( () => {
				return getEditorNamespace( fakeScriptWithNamespace, spy );
			} ).then( () => {
				expect( spy.called ).to.equal( false );
			} );
		} );
	} );
} );
