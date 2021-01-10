import sprintf from '../index.js';

describe('sprintf', () => {
	it('does nothing to a string without placeholders', () => {
		const result = sprintf('Hello world!');

		expect(result).to.equal('Hello world!');
	});

	it('substitutes placeholders from arguments', () => {
		const result = sprintf('Hello %s! From %s.', 'world', 'Andrew');

		expect(result).to.equal('Hello world! From Andrew.');
	});

	it('handles positional placeholders', () => {
		const result = sprintf('Hello %2$s! From %1$s.', 'Andrew', 'world');

		expect(result).to.equal('Hello world! From Andrew.');
	});

	it('supports args as array', () => {
		const result = sprintf('Hello %s! From %s.', ['world', 'Andrew']);

		expect(result).to.equal('Hello world! From Andrew.');
	});

	it('supports named arguments', () => {
		const result = sprintf('Hello %(place)s! From %(name)s.', {
			place: 'world',
			name: 'Andrew',
		});

		expect(result).to.equal('Hello world! From Andrew.');
	});

	it('handles named argument edge cases correctly', () => {
		expect(sprintf('My name is %(name)s', 0)).to.equal('My name is ');
		expect(sprintf('My name is %(name)s', 1)).to.equal('My name is ');
		expect(sprintf('My name is %(valueOf)s', {})).to.equal('My name is ');
		expect(sprintf('My name is %(toString)s', {})).to.equal('My name is ');
		expect(sprintf('My name is %(length)s', 'a')).to.equal('My name is ');
	});

	it('ignores undefined placeholders', () => {
		expect(sprintf('%s & %s', 'Family')).to.equal('Family & ');
		expect(sprintf('%1$s & %2$s', 'Family')).to.equal('Family & ');
		expect(sprintf('%(group1)s & %(group2)s', { group1: 'Family' })).to.equal(
			'Family & '
		);
	});

	it('ignores additional arguments', () => {
		expect(sprintf('%s', 'Family', 'Friends')).to.equal('Family');
		expect(sprintf('%1$s', 'Family', 'Friends')).to.equal('Family');
		expect(sprintf('%(a)s', { a: 'Family', b: 'Friends' })).to.equal('Family');
	});

	it('handles precision', () => {
		expect(sprintf('Pi: %.5f', Math.PI)).to.equal('Pi: 3.14159');
		expect(sprintf('%.*s', 3, 'abcdef')).to.equal('abc');
		expect(sprintf('%.5f', 'abcdef')).to.equal('0.00000');
		expect(sprintf('%.5s', 'abcdef')).to.equal('abcde');
	});

	it('handles escaped %', () => {
		expect(sprintf('Grade: %d%%.', '100')).to.equal('Grade: 100%.');
		expect(sprintf('%s%%s', 'a', 'b')).to.equal('a%s');
		expect(sprintf('%s%%%s', 'a', 'b')).to.equal('a%b');
	});

	it('handles type coersion correctly', () => {
		expect(sprintf('Value: %d', '123')).to.equal('Value: 123');
		expect(sprintf('Value: %d', 'string')).to.equal('Value: 0');
		expect(sprintf('Value: %d', 0)).to.equal('Value: 0');
		expect(sprintf('Value: %d', false)).to.equal('Value: 0');
		expect(sprintf('Value: %d', null)).to.equal('Value: 0');
		expect(sprintf('Value: %d', undefined)).to.equal('Value: 0');

		expect(sprintf('Value: %s', 0)).to.equal('Value: 0');
		expect(sprintf('Value: %s', false)).to.equal('Value: false');
		expect(sprintf('Value: %s', null)).to.equal('Value: ');
		expect(sprintf('Value: %s', undefined)).to.equal('Value: ');
	});
});
