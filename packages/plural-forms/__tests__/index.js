import pluralForms from '../index.js';

describe('pluralForms', () => {
	it('converts boolean values to numeric equivalent', () => {
		const getPluralForm = pluralForms('n != 1');

		expect(getPluralForm(0)).to.equal(1);
		expect(getPluralForm(1)).to.equal(0);
	});
});
