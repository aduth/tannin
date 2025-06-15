import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import sprintf from '../src/index.js';

describe('sprintf', () => {
	it('does nothing to a string without placeholders', () => {
		const result = sprintf('Hello world!');

		assert.equal(result, 'Hello world!');
	});

	it('substitutes placeholders from arguments', () => {
		const result = sprintf('Hello %s! From %s.', 'world', 'Andrew');

		assert.equal(result, 'Hello world! From Andrew.');
	});

	it('handles positional placeholders', () => {
		const result = sprintf('Hello %2$s! From %1$s.', 'Andrew', 'world');

		assert.equal(result, 'Hello world! From Andrew.');
	});

	it('supports args as array', () => {
		const result = sprintf('Hello %s! From %s.', ['world', 'Andrew']);

		assert.equal(result, 'Hello world! From Andrew.');
	});

	it('supports named arguments', () => {
		const result = sprintf('Hello %(place)s! From %(name)s.', {
			place: 'world',
			name: 'Andrew',
		});

		assert.equal(result, 'Hello world! From Andrew.');
	});

	it('handles named argument edge cases correctly', () => {
		assert.equal(sprintf('My name is %(name)s', 0), 'My name is ');
		assert.equal(sprintf('My name is %(name)s', 1), 'My name is ');
		assert.equal(sprintf('My name is %(valueOf)s', {}), 'My name is ');
		assert.equal(sprintf('My name is %(toString)s', {}), 'My name is ');
		assert.equal(sprintf('My name is %(length)s', 'a'), 'My name is ');
	});

	it('ignores undefined placeholders', () => {
		assert.equal(sprintf('%s & %s', 'Family'), 'Family & ');
		assert.equal(sprintf('%1$s & %2$s', 'Family'), 'Family & ');
		assert.equal(
			sprintf('%(group1)s & %(group2)s', { group1: 'Family' }),
			'Family & ',
		);
	});

	it('ignores additional arguments', () => {
		assert.equal(sprintf('%s', 'Family', 'Friends'), 'Family');
		assert.equal(sprintf('%1$s', 'Family', 'Friends'), 'Family');
		assert.equal(sprintf('%(a)s', { a: 'Family', b: 'Friends' }), 'Family');
	});

	it('handles precision', () => {
		assert.equal(sprintf('Pi: %.5f', Math.PI), 'Pi: 3.14159');
		assert.equal(sprintf('%.*s', 3, 'abcdef'), 'abc');
		assert.equal(sprintf('%.5f', 'abcdef'), '0.00000');
		assert.equal(sprintf('%.5s', 'abcdef'), 'abcde');
	});

	it('handles escaped %', () => {
		assert.equal(sprintf('Grade: %d%%.', '100'), 'Grade: 100%.');
		assert.equal(sprintf('%s%%s', 'a', 'b'), 'a%s');
		assert.equal(sprintf('%s%%%s', 'a', 'b'), 'a%b');
	});

	it('handles type coersion correctly', () => {
		assert.equal(sprintf('Value: %d', '123'), 'Value: 123');
		assert.equal(sprintf('Value: %d', 'string'), 'Value: 0');
		assert.equal(sprintf('Value: %d', 0), 'Value: 0');
		assert.equal(sprintf('Value: %d', false), 'Value: 0');
		assert.equal(sprintf('Value: %d', null), 'Value: 0');
		assert.equal(sprintf('Value: %d', undefined), 'Value: 0');
		assert.equal(sprintf('Value: %s', 0), 'Value: 0');
		assert.equal(sprintf('Value: %s', false), 'Value: false');
		assert.equal(sprintf('Value: %s', null), 'Value: ');
		assert.equal(sprintf('Value: %s', undefined), 'Value: ');
	});
});
