import sprintf from '..';

// Basic
// / Correct
sprintf('Hello World');
sprintf('Hello %s', 'world');
sprintf('%s %s', 'Hello', 'World');
sprintf('%s %s', ['Hello', 'World']);
sprintf('Number %d', 1);
sprintf('%d%d', 1, 2);
sprintf('%d %d', [1, 2]);
sprintf('%f', 1.2);
sprintf('%f -> %f', 1.2, 1.4);
sprintf('%f -> %f', [1.2, 1.4]);

// / InCorrect
// @ts-expect-error - argument mismatch, string expected
sprintf('Hello %s', 1);
// @ts-expect-error - argument mismatch, string expected
sprintf('%s %s', 'Hello', 2);
// @ts-expect-error - argument mismatch, string expected
sprintf('%s %s', ['Hello', 2]);

// Positional Arguments
// / Correct
sprintf('Hello %1$s, %2$s', 'world', '!');
sprintf('Hello %1$s, %2$s', ['world', '!']);
sprintf('Hello %2$s, %1$s', 'world', '!');
sprintf('Hello %2$s, %1$s', ['world', '!']);
sprintf('Number %1$d, %2$d', 1, 2);
sprintf('Number %1$d, %2$d', [1, 2]);
sprintf('Number %2$d, %1$d', 1, 2);
sprintf('Number %2$d, %1$d', [1, 2]);
sprintf('%1$f, %2$f', 1.2, 1.4);
sprintf('%1$f, %2$f', [1.2, 1.4]);
sprintf('%2$f, %1$f', 1.2, 1.4);
sprintf('%2$f, %1$f', [1.2, 1.4]);
sprintf('Hello %2$d, Number %1$d, Float %3$f', 1, 1, 1.2);

// / InCorrect
// @ts-expect-error - argument mismatch, string expected
sprintf('Hello %1$s, %2$s', 1, '!');
// @ts-expect-error - argument mismatch, string expected
sprintf('Hello %1$s, %2$s', [1, '!']);
// @ts-expect-error - missing arg
sprintf('Hello %1$s, %2$s', 'world');

// Named Arguments
// / Correct
sprintf('Hello %(name)s', { name: 'world' });
sprintf('Hello %(name)s, %(punctuation)s', {
	name: 'world',
	punctuation: '!',
});
sprintf('Number %(num)d', { num: 1 });
sprintf('Float %(num)f', { num: 1.2 });
sprintf('Hello %(name)s, Number %(num)d, Float %(float)f', {
	name: 'world',
	num: 1,
	float: 1.2,
});

// / InCorrect
// @ts-expect-error - argument mismatch, string expected
sprintf('Hello %(name)s', { name: 1 });
// @ts-expect-error - wrong named argument
sprintf('Hello %(name)s', { punctuation: '!' });
// @ts-expect-error - missing named argument
sprintf('Hello %(name)s, %(punctuation)s', {
	name: 'world',
});
// @ts-expect-error - extra named argument
sprintf('Hello %(name)s', {
	name: 'world',
	punctuation: '!',
});
// @ts-expect-error - dot notation not supported
sprintf('Hello %(user.name)s', { user: { name: 'John' } });
// @ts-expect-error - named placeholders not supported with unnamed placeholders
sprintf('%(named)s %s', { named: 'Hello' }, 'world');
// @ts-expect-error - named placeholders not supported with positional placeholders
sprintf('%(named)s %1$s', { named: 'Hello' }, 'world');

// Precision
// / Correct
sprintf('Float %.2s', 'abcdef');
sprintf('Float %.*s', 3, 'abcdef');
sprintf('Float %.2f', [1.23456]);
sprintf('Float %.*f', 2, 1.23456);
sprintf('Float %.*f', [2, 1.23456]);
sprintf('%.*f, %.*s', 2, 1.23456, 3, 'aabcdef');
sprintf('%.*f, %.*s', [2, 1.23456, 3, 'aabcdef']);
sprintf('%1$.*f', 2, 3.14159);
sprintf('%1$.*s', 3, 'abcdef');
sprintf('%1$.*f and %2$.*s', 2, 3.1415, 3, 'abcdef');
sprintf('%1$.*f and %2$.*s', [2, 3.1415, 3, 'abcdef']);
sprintf('Id: %(id)d, price: %(price).2f', {
	id: 123,
	price: 45.6789,
});

// / InCorrect
// @ts-expect-error - argument mismatch, string expected
sprintf('Float %.2s', 123456);
// @ts-expect-error - precision must be int
sprintf('Float %.*f', '2', 1.23456);
// @ts-expect-error - precision must be int
sprintf('%2$.*f', '2', 3.1415);
// @ts-expect-error - precision must be int
sprintf('%.*s', '3', 'abcdef');
// @ts-expect-error - dynamic precision not allowed on named placeholders
sprintf('Dynamic precision not allowed on named placeholders: %(named).*f', {
	named: 1.23456,
});

// Escaped Percent
// / Correct
sprintf('Grade: %d%%d.', 100);
sprintf('%s%%%s', 'a', 'b');
sprintf('%s%%', 'a');
sprintf('%% %s %%', 'a');
sprintf('%% %s %%', ['a']);

// / InCorrect
// @ts-expect-error - argument mismatch, string expected
sprintf('%s%%%s', 1, 'b');
// @ts-expect-error - too many arguments
sprintf('%s%%s', 'a', 'b');
// @ts-expect-error - too few arguments
sprintf('%s%s%s%%%s', 'a', 'b');
// @ts-expect-error - missing substitution
sprintf('%s%%%s%s', 'a', 'b');

// Unsupported Format Specifiers
// @ts-expect-error - unsupported: %x
sprintf('Hex: %x', 255);
// @ts-expect-error - unsupported: %X
sprintf('Hex: %X', 255);
// @ts-expect-error - unsupported: %c
sprintf('Char: %c', 'A');
// @ts-expect-error - unsupported: %u
sprintf('Unsigned: %u', 42);
// @ts-expect-error - unsupported: %e
sprintf('Scientific: %e', 1.2);
// @ts-expect-error - unsupported: %g
sprintf('General float: %g', 3.14);
// @ts-expect-error - unsupported: %p
sprintf('Pointer: %p', {});
// @ts-expect-error - unsupported: %o
sprintf('Octal: %o', 8);

// Flags / Width / Length
// @ts-expect-error - unsupported: flags %+d
sprintf('Signed: %+d', 42);
// @ts-expect-error - unsupported: padded width
sprintf('Padded: %5d', 42);
// @ts-expect-error - unsupported: precision with hex
sprintf('Hex: %.2x', 255);
// @ts-expect-error - unsupported: length modifier
sprintf('Long: %llf', 3.14);

// Misc
// / Correct
const a = 'Hello %s';
const b = 'Hello %s, %s';
sprintf(a, 'world');
sprintf(b, 'world', '!');

// / InCorrect
// @ts-expect-error - sptintf format expected to be constant and not a dynamic string
sprintf(a + b, 'world');
// @ts-expect-error - string expected
sprintf('Value: %s', 0);
// @ts-expect-error - string expected
sprintf('Value: %s', false);
// @ts-expect-error - string expected
sprintf('Value: %s', null);
// @ts-expect-error - string expected
sprintf('Value: %s', undefined);
