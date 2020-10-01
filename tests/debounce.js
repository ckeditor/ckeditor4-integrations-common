/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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
} );
