const Benchmark = require('benchmark');
const Tannin = require('..');
const Jed = require('jed');

const impl = {
	Tannin: new Tannin({
		default: {
			'': {
				domain: 'default',
				lang: 'en',
				plural_forms: 'nplurals=2; plural=(n != 1);',
			},
			test: ['Singular', 'Plural'],
		},
	}),
	'Tannin (Optimized Default)': new Tannin({
		default: {
			'': {
				domain: 'default',
				lang: 'en',
				plural_forms: (n) => (n === 1 ? 0 : 1),
			},
			test: ['Singular', 'Plural'],
		},
	}),
	Jed: new Jed({
		locale_data: {
			default: {
				'': {
					domain: 'default',
					lang: 'en',
					plural_forms: 'nplurals=2; plural=(n != 1);',
				},
				test: ['Singular', 'Plural'],
			},
		},
		domain: 'default',
	}),
};

Object.entries({
	Singular(i18n) {
		i18n.dcnpgettext('default', undefined, 'test');
	},
	'Singular (Untranslated)'(i18n) {
		i18n.dcnpgettext('default', undefined, 'untranslated');
	},
	Plural(i18n) {
		i18n.dcnpgettext('default', undefined, 'test', 'tests', 2);
	},
}).forEach(([label, fn]) => {
	const suite = new Benchmark.Suite(label);

	for (const [name, i18n] of Object.entries(impl)) {
		suite.add(name, () => fn(i18n));
	}

	suite
		.on('start', () => console.log(label + '\n---'))
		.on('cycle', (event) => console.log(event.target.toString()))
		.on('complete', () => console.log('\n'))
		.run();
});
