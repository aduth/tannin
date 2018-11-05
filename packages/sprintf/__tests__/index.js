const sprintf = require( '..' );

describe( 'sprintf', () => {
	it( 'does nothing to a string without placeholders', () => {
		const result = sprintf( 'Hello world!' );

		expect( result ).toBe( 'Hello world!' );
	} );

	it( 'substitutes placeholders from arguments', () => {
		const result = sprintf( 'Hello %s! From %s.', 'world', 'Andrew' );

		expect( result ).toBe( 'Hello world! From Andrew.' );
	} );

	it( 'handles positional placeholders', () => {
		const result = sprintf( 'Hello %2$s! From %1$s.', 'Andrew', 'world' );

		expect( result ).toBe( 'Hello world! From Andrew.' );
	} );

	it( 'supports args as array', () => {
		const result = sprintf( 'Hello %s! From %s.', [ 'world', 'Andrew' ] );

		expect( result ).toBe( 'Hello world! From Andrew.' );
	} );

	it( 'ignores undefined placeholders', () => {
		expect( sprintf( '%s & %s', 'Family' ) ).toBe( 'Family & ' );
		expect( sprintf( '%1$s & %2$s', 'Family' ) ).toBe( 'Family & ' );
	} );

	it( 'ignores additional arguments', () => {
		expect( sprintf( '%s', 'Family', 'Friends' ) ).toBe( 'Family' );
		expect( sprintf( '%1$s', 'Family', 'Friends' ) ).toBe( 'Family' );
	} );

	it( 'handles precision', () => {
		expect( sprintf( 'Pi: %.5f', Math.PI ) ).toBe( 'Pi: 3.14159' );
		expect( sprintf( '%.*s', 3, 'abcdef' ) ).toBe( 'abc' );
		expect( sprintf( '%.5f', 'abcdef' ) ).toBe( '0.00000' );
		expect( sprintf( '%.5s', 'abcdef' ) ).toBe( 'abcde' );
	} );

	it( 'handles escaped %', () => {
		expect( sprintf( 'Grade: %d%%.', '100' ) ).toBe( 'Grade: 100%.' );
		expect( sprintf( '%s%%s', 'a', 'b' ) ).toBe( 'a%s' );
		expect( sprintf( '%s%%%s', 'a', 'b' ) ).toBe( 'a%b' );
	} );
} );
