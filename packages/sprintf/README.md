`@tannin/sprintf`
=================

Given a format string, returns string with arguments interpolatation. Arguments can either be provided directly via function arguments spread, or with an array as the second argument.

See: [https://en.wikipedia.org/wiki/Printf_format_string](https://en.wikipedia.org/wiki/Printf_format_string)

In addition to basic placeholder substitution, the following options a placeholder are implemented:

- Positional index
- Precision / maximum width (including `*` precision)
- Type (only the behaviors of `f`, `d`, `s`, and `%` are applied)

Notably, this excludes:

- Flags
- Minimum width (padding)
- Length

## Installation

Using [npm](https://www.npmjs.com/) as a package manager:

```
npm install @tannin/sprintf
```

Otherwise, download a pre-built copy from unpkg:

[https://unpkg.com/@tannin/sprintf/dist/@tannin/sprintf.min.js](https://unpkg.com/@tannin/sprintf/dist/@tannin/sprintf.min.js)

## Usage

```js
import sprintf from '@tannin/sprintf';

sprintf( 'Hello %s!', 'world' );
// ⇒ 'Hello world!'
```

## License

Copyright 2018 Andrew Duthie

Released under the [MIT License](https://opensource.org/licenses/MIT).
