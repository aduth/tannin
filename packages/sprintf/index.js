/**
 * Regular expression matching format placeholder syntax.
 *
 * @see http://www.pixelbeat.org/programming/gcc/format_specs.html
 *
 * @type {RegExp}
 */
var PATTERN = /%((\d+)\$)?[ +0#-]*\d*(\.(\d+|\*))?(ll|[lhqL])?([cduxXefgsp%])/g;
//              ▲         ▲       ▲  ▲            ▲           ▲ type
//              │         │       │  │            └ Length (unsupported)
//              │         │       │  └ Precision / max width
//              │         │       └ Min width (unsupported)
//              │         └ Flags (unsupported)
//              └ Index

/**
 * Given a format string, returns string with arguments interpolatation.
 * Arguments can either be provided directly via function arguments spread, or
 * with an array as the second argument.
 *
 * @see https://en.wikipedia.org/wiki/Printf_format_string
 *
 * @example
 *
 * ```js
 * import sprintf from '@tannin/sprintf';
 *
 * sprintf( 'Hello %s!', 'world' );
 * // ⇒ 'Hello world!'
 * ```
 *
 * @param {string} string printf format string
 * @param {?Array} args   String arguments.
 *
 * @return {string} Formatted string.
 */
export default function sprintf( string, args ) {
	var i;

	if ( ! Array.isArray( args ) ) {
		// Construct a copy of arguments from index one, used for replace
		// function placeholder substitution.
		args = new Array( arguments.length - 1 );
		for ( i = 1; i < arguments.length; i++ ) {
			args[ i - 1 ] = arguments[ i ];
		}
	}

	i = 1;

	return string.replace( PATTERN, function() {
		var index, precision, type, value;

		index = arguments[ 2 ];
		precision = arguments[ 4 ];
		type = arguments[ 6 ];

		// There's no placeholder substitution in the explicit "%", meaning it
		// is not necessary to increment argument index.
		if ( type === '%' ) {
			return '%';
		}

		// Asterisk precision determined by peeking / shifting next argument.
		if ( precision === '*' ) {
			precision = args[ i - 1 ];
			i++;
		}

		// If not a positional argument, use counter value.
		if ( index === undefined ) {
			index = i;
		}

		i++;

		value = args[ index - 1 ];

		// Parse as type.
		if ( type === 'f' ) {
			value = parseFloat( value ) || 0;
		} else if ( type === 'd' ) {
			value = parseInt( value ) || 0;
		}

		// Apply precision.
		if ( precision !== undefined ) {
			if ( type === 'f' ) {
				value = value.toFixed( precision );
			} else if ( type === 's' ) {
				value = value.substr( 0, precision );
			}
		}

		// To avoid "undefined" concatenation, return empty string if no
		// placeholder substitution can be performed.
		return value || '';
	} );
}
