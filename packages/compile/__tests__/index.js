import compile from '../index.js';

const FIXTURES = [
	[
		'n!=1',
		new Map([
			[0, true],
			[1, false],
			[2, true],
		]),
	],
	[
		'n==1 ? 0 : 1',
		new Map([
			[0, 1],
			[1, 0],
			[2, 1],
		]),
	],
	[
		'n==1 ? 0 : n==2 ? 1 : 2',
		new Map([
			[0, 2],
			[1, 0],
			[2, 1],
			[3, 2],
		]),
	],
	[
		'n>1',
		new Map([
			[0, false],
			[1, false],
			[2, true],
		]),
	],
	[
		'n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2',
		new Map([
			[0, 2],
			[1, 0],
			[2, 1],
			[3, 1],
			[4, 1],
			[5, 2],
		]),
	],
];

describe('compile', () => {
	describe('fixtures', () => {
		FIXTURES.forEach(([expression, variables]) => {
			const evaluate = compile(expression);

			describe(expression, () => {
				for (const [n, expected] of variables) {
					it('n = ' + n, () => {
						expect(evaluate({ n })).to.deep.equal(expected);
					});
				}
			});
		});
	});
});
