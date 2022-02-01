/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { debounce } from '../src/';

describe( 'debounce', () => {
	it( 'should postpone call', () => {
		const clock = sinon.useFakeTimers();
		const spy = sinon.spy();
		const fn = debounce( spy, 60 );

		fn( 1 );
		clock.tick( 20 );

		fn( 2 );
		clock.tick( 40 );

		fn( 3 );
		clock.tick( 60 );

		expect( spy.calledOnceWithExactly( 3 ) ).to.equal( true );

		clock.restore();
	} );

	it( 'should have correct context object', () => {
		const clock = sinon.useFakeTimers();
		const context = { called: false };

		const fn = debounce( function() {
			this.called = true;
		}, 100, context );

		fn();

		clock.tick( 100 );

		expect( context.called ).to.equal( true );
	} );
} );
