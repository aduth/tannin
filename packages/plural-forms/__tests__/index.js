import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import pluralForms from '../index.js';

describe('pluralForms', () => {
	it('converts boolean values to numeric equivalent', () => {
		const getPluralForm = pluralForms('n != 1');

		assert.equal(getPluralForm(0), 1);
		assert.equal(getPluralForm(1), 0);
	});

	it('evaluates conditionals without whitespace around the colon', () => {
		const getPluralForm = pluralForms('n==1?0:n==2?1:2');

		assert.equal(getPluralForm(1), 0);
		assert.equal(getPluralForm(2), 1);
		assert.equal(getPluralForm(5), 2);
	});

	it('evaluates a parenthesized conditional only when its branch is taken', () => {
		const getPluralForm = pluralForms('n == 1 ? 0 : (n % 10 == 1 ? 1 : 2)');

		assert.equal(getPluralForm(1), 0);
		assert.equal(getPluralForm(21), 1);
		assert.equal(getPluralForm(5), 2);
	});
});
