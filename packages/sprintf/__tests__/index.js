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

	it( 'supports named arguments', () => {
		const result = sprintf( 'Hello %(place)s! From %(name)s.', { place: 'world', name: 'Andrew' } );

		expect( result ).toBe( 'Hello world! From Andrew.' );
	} );

	it( 'handles named argument edge cases correctly', () => {
		expect( sprintf( 'My name is %(name)s', 0 ) ).toBe( 'My name is ' );
		expect( sprintf( 'My name is %(name)s', 1 ) ).toBe( 'My name is ' );
		expect( sprintf( 'My name is %(valueOf)s', {} ) ).toBe( 'My name is ' );
		expect( sprintf( 'My name is %(toString)s', {} ) ).toBe( 'My name is ' );
		expect( sprintf( 'My name is %(length)s', 'a' ) ).toBe( 'My name is ' );
	} );

	it( 'ignores undefined placeholders', () => {
		expect( sprintf( '%s & %s', 'Family' ) ).toBe( 'Family & ' );
		expect( sprintf( '%1$s & %2$s', 'Family' ) ).toBe( 'Family & ' );
		expect( sprintf( '%(group1)s & %(group2)s', { group1: 'Family' } ) ).toBe( 'Family & ' );
	} );

	it( 'ignores additional arguments', () => {
		expect( sprintf( '%s', 'Family', 'Friends' ) ).toBe( 'Family' );
		expect( sprintf( '%1$s', 'Family', 'Friends' ) ).toBe( 'Family' );
		expect( sprintf( '%(a)s', { a: 'Family', b: 'Friends' } ) ).toBe( 'Family' );
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

	it( 'handles type coersion correctly', () => {
		expect( sprintf( 'Value: %d', '123' ) ).toBe( 'Value: 123' );
		expect( sprintf( 'Value: %d', 'string' ) ).toBe( 'Value: 0' );
		expect( sprintf( 'Value: %d', 0 ) ).toBe( 'Value: 0' );
		expect( sprintf( 'Value: %d', false ) ).toBe( 'Value: 0' );
		expect( sprintf( 'Value: %d', null ) ).toBe( 'Value: 0' );
		expect( sprintf( 'Value: %d', undefined ) ).toBe( 'Value: 0' );

		expect( sprintf( 'Value: %s', 0 ) ).toBe( 'Value: 0' );
		expect( sprintf( 'Value: %s', false ) ).toBe( 'Value: false' );
		expect( sprintf( 'Value: %s', null ) ).toBe( 'Value: ' );
		expect( sprintf( 'Value: %s', undefined ) ).toBe( 'Value: ' );
	} );
} );
