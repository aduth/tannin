import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import pluralForms from '../index.js';

describe('pluralForms', () => {
	it('converts boolean values to numeric equivalent', () => {
		const getPluralForm = pluralForms('n != 1');

		assert.equal(getPluralForm(0), 1);
		assert.equal(getPluralForm(1), 0);
	});
});
