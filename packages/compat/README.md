`@tannin/compat`
================

A Jed drop-in replacement shim for Tannin.

## Installation

Using [npm](https://www.npmjs.com/) as a package manager:

```
npm install @tannin/compat
```

Otherwise, download a pre-built copy from unpkg:

[https://unpkg.com/@tannin/compat/dist/compat.min.js](https://unpkg.com/@tannin/compat/dist/compat.min.js)

## Usage

Construct a new instance with the same options supported by Jed.

See: [https://messageformat.github.io/Jed/](https://messageformat.github.io/Jed/)

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

## License

Copyright 2019 Andrew Duthie

Released under the [MIT License](https://opensource.org/licenses/MIT).
