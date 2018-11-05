const pluralForms = require( '..' );

describe( 'pluralForms', () => {
	it( 'converts boolean values to numeric equivalent', () => {
		const getPluralForm = pluralForms( 'n != 1' );

		expect( getPluralForm( 0 ) ).toBe( 1 );
		expect( getPluralForm( 1 ) ).toBe( 0 );
	} );
} );
