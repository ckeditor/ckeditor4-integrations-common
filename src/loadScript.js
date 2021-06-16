/**
 * The script below was copied over from https://github.com/eldargab/load-script, because the repo seems to be not maintained anymore.
 *
 * Version at commit: https://github.com/eldargab/load-script/blob/318ead6c590d403e0fbd4ae6e76b0407614addec/index.js
 */

export default function( src, opts, cb ) {
	const head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
	const script = document.createElement( 'script' );

	if ( typeof opts === 'function' ) {
		cb = opts;
		opts = {};
	}

	opts = opts || {};
	cb = cb || function() {};

	script.type = opts.type || 'text/javascript';
	script.charset = opts.charset || 'utf8';
	script.async = 'async' in opts ? !!opts.async : true;
	script.src = src;

	if ( opts.attrs ) {
		setAttributes( script, opts.attrs );
	}

	if ( opts.text ) {
		script.text = String( opts.text );
	}

	const onend = 'onload' in script ? stdOnEnd : ieOnEnd;
	onend( script, cb );

	// some good legacy browsers (firefox) fail the 'in' detection above
	// so as a fallback we always set onload
	// old IE will ignore this and new IE will set onload
	if ( !script.onload ) {
		stdOnEnd( script, cb );
	}

	head.appendChild( script );
}

function setAttributes( script, attrs ) {
	for ( const attr in attrs ) {
		script.setAttribute( attr, attrs[ attr ] );
	}
}

function stdOnEnd( script, cb ) {
	script.onload = function() {
		this.onerror = this.onload = null;
		cb( null, script );
	};
	script.onerror = function() {
		// this.onload = null here is necessary
		// because even IE9 works not like others
		this.onerror = this.onload = null;
		cb( new Error( 'Failed to load ' + this.src ), script );
	};
}

function ieOnEnd( script, cb ) {
	script.onreadystatechange = function() {
		if ( this.readyState != 'complete' && this.readyState != 'loaded' ) {
			return;
		}
		this.onreadystatechange = null;
		cb( null, script ); // there is no way to catch loading errors in IE8
	};
}
