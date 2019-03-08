Tannin
======

Tannin is a [gettext](https://www.gnu.org/software/gettext/) localization library.

Inspired by [Jed](https://github.com/messageformat/Jed), it is built to be largely compatible with Jed-formatted locale data, and even offers a [Jed drop-in replacement compatibility shim](#jed-compatibility) to easily convert an existing project. Contrasted with Jed, it is more heavily optimized for performance and bundle size. While Jed works well with one-off translations, it suffers in single-page applications with repeated rendering of elements. Using Tannin, you can expect a bundle size **20% that of Jed** (**936 bytes gzipped**) and upwards of **330x better performance** ([see benchmarks](#benchmarks)). It does so without sacrificing the safety of plural forms evaluation, using a hand-crafted expression parser in place of the verbose compiled grammar included in Jed.

Furthermore, the project is architected as a mono-repo, published on npm under the `@tannin` scope. These modules can be used standalone, with or without Tannin. For example, you may find value in [`@tannin/compile`](https://www.npmjs.com/package/@tannin/compile) for creating an expression evaluator, or [`@tannin/sprintf`](https://www.npmjs.com/package/@tannin/sprintf) as a minimal [printf](https://en.wikipedia.org/wiki/Printf_format_string) string formatter.

The following modules are available:

- [`tannin`](https://www.npmjs.com/package/tannin)
- [`@tannin/compat`](https://www.npmjs.com/package/@tannin/compat)
- [`@tannin/compile`](https://www.npmjs.com/package/@tannin/compile)
- [`@tannin/evaluate`](https://www.npmjs.com/package/@tannin/evaluate)
- [`@tannin/plural-forms`](https://www.npmjs.com/package/@tannin/plural-forms)
- [`@tannin/compat`](https://www.npmjs.com/package/@tannin/compat)
- [`@tannin/postfix`](https://www.npmjs.com/package/@tannin/postfix)
- [`@tannin/sprintf`](https://www.npmjs.com/package/@tannin/sprintf)

## Installation

Using [npm](https://www.npmjs.com/) as a package manager:

```
npm install tannin
```

Otherwise, download a pre-built copy from unpkg:

[https://unpkg.com/tannin/dist/tannin.min.js](https://unpkg.com/tannin/dist/tannin.min.js)

## Usage

Construct a new instance of `Tannin`, passing locale data in the form of a [Jed-formatted JSON object](http://messageformat.github.io/Jed/).

The returned `Tannin` instance includes the fully-qualified `dcnpgettext` function to retrieve a translated string.

```js
import Tannin from 'tannin';

const i18n = new Tannin( {
	the_domain: {
		'': {
			domain: 'the_domain',
			lang: 'en',
			plural_forms: 'nplurals=2; plural=(n != 1);',
		},
		example: [ 'singular translation', 'plural translation' ],
	},
} );

i18n.dcnpgettext( 'the_domain', undefined, 'example' );
// ⇒ 'singular translation'
```

## Jed Compatibility

For a more human-friendly API, or to more easily transition an existing project, consider using [`@tannin/compat`](https://www.npmjs.com/package/@tannin/compat) as a drop-in replacement for Jed.

```js
import Jed from '@tannin/compat';

const i18n = new Jed( {
	locale_data: {
		the_domain: {
			'': {
				domain: 'the_domain',
				lang: 'en',
				plural_forms: 'nplurals=2; plural=(n != 1);',
			},
			example: [ 'singular translation', 'plural translation' ],
		},
	},
	domain: 'the_domain',
} );

i18n.translate( 'example' ).fetch();
// ⇒ 'singular translation'
```

## Benchmarks

The following benchmarks are performed in Node 10.12.0 on a MacBook Pro (Late 2016), 2.9 GHz Intel Core i7.

```
Tannin - Singular x 150,234,530 ops/sec ±0.65% (90 runs sampled)
Tannin - Singular (Untranslated) x 53,480,670 ops/sec ±0.66% (92 runs sampled)
Tannin - Plural x 5,480,067 ops/sec ±0.24% (96 runs sampled)
Jed - Singular x 38,802,476 ops/sec ±0.74% (93 runs sampled)
Jed - Singular (Untranslated) x 184,813 ops/sec ±0.64% (92 runs sampled)
Jed - Plural x 182,830 ops/sec ±0.54% (95 runs sampled)
```

To run benchmarks on your own machine:

```
git clone https://github.com/aduth/tannin.git
cd tannin
npm install
node packages/tannin/benchmark
```

## License

Copyright 2018 Andrew Duthie

Released under the [MIT License](https://opensource.org/licenses/MIT).
