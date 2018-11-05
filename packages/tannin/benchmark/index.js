const Benchmark = require( 'benchmark' );
const Tannin = require( '..' );
const Jed = require( 'jed' );

const suite = new Benchmark.Suite;

const localeData = {
	default: {
		'': {
			domain: 'default',
			lang: 'en',
			plural_forms: 'nplurals=2; plural=(n != 1);',
		},
		test: [ 'Singular', 'Plural' ],
	},
};

[
	[
		'Tannin',
		() => new Tannin( localeData ),
	],
	[
		'Jed',
		() => new Jed( {
			locale_data: localeData,
			domain: 'default',
		} ),
	],
].forEach( ( [ name, setup ] ) => {
	let i18n = setup();
	suite.on( 'cycle', () => i18n = setup() );

	suite
		.add( name + ' - Singular', () => {
			i18n.dcnpgettext( 'default', undefined, 'test' );
		} )
		.add( name + ' - Singular (Untranslated)', () => {
			i18n.dcnpgettext( 'default', undefined, 'untranslated' );
		} )
		.add( name + ' - Plural', () => {
			i18n.dcnpgettext( 'default', undefined, 'test', 'tests', 2 );
		} );
} );

suite
	.on( 'cycle', ( event ) => console.log( event.target.toString() ) )
	.run( { async: true } );
