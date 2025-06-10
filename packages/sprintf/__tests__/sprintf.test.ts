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
// @ts-expect-error - argument mismatch, int expected
sprintf('Number %d', '1');
// @ts-expect-error - argument mismatch, float expected
sprintf('%f', '1.2');

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
// @ts-expect-error - argument mismatch, int expected
sprintf('Number %1$d, %2$d', '1', 2);
// @ts-expect-error - argument mismatch, int expected
sprintf('Number %1$d, %2$d', ['1', 2]);
// @ts-expect-error - argument mismatch, float expected
sprintf('%1$f, %2$f', '1.2', 1.4);
// @ts-expect-error - argument mismatch, float expected
sprintf('%1$f, %2$f', ['1.2', 1.4]);
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
// @ts-expect-error - argument mismatch, int expected
sprintf('Number %(num)d', { num: '1' });
// @ts-expect-error - argument mismatch, float expected
sprintf('Float %(num)f', { num: '1.2' });
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

// Precision
// / Correct
sprintf('Float %.2s', 'abcdef');
sprintf('Float %.2f', [1.23456]);
sprintf('Float %.*f', 2, 1.23456);
sprintf('Float %.*f', [2, 1.23456]);
sprintf('%.*f, %.*s', 2, 1.23456, 3, 'aabcdef');
sprintf('%.*f, %.*s', [2, 1.23456, 3, 'aabcdef']);

// / InCorrect
// @ts-expect-error - argument mismatch, string expected
sprintf('Float %.2s', 123456);
// @ts-expect-error - argument mismatch, float expected
sprintf('Float %.2f', ['123456']);
// @ts-expect-error - argument mismatch, int expected for precision
sprintf('Float %.*f', '2', 1.23456);

// Escaped Percent
// / Correct
sprintf('Grade: %d%%d.', 100);
sprintf('%s%%%s', 'a', 'b');
sprintf('%s%%', 'a');
sprintf('%% %s %%', 'a');
sprintf('%% %s %%', ['a']);

// / InCorrect
// @ts-expect-error - argument mismatch, int expected
sprintf('Grade: %d%%d.', '100');
// @ts-expect-error - argument mismatch, string expected
sprintf('%s%%%s', 1, 'b');
// @ts-expect-error - too many arguments
sprintf('%s%%s', 'a', 'b');
// @ts-expect-error - too few arguments
sprintf('%s%s%s%%%s', 'a', 'b');

// Misc
// / InCorrect
// @ts-expect-error - int expected
sprintf('Value: %d', false);
// @ts-expect-error - int expected
sprintf('Value: %d', null);
// @ts-expect-error - int expected
sprintf('Value: %d', undefined);
// @ts-expect-error - string expected
sprintf('Value: %s', 0);
// @ts-expect-error - string expected
sprintf('Value: %s', false);
// @ts-expect-error - string expected
sprintf('Value: %s', null);
// @ts-expect-error - string expected
sprintf('Value: %s', undefined);
