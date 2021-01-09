/**
 * Internal dependencies
 */
const postfix = require('..');

const FIXTURES = [
	{
		input: '3+4*5/6',
		output: ['3', '4', '5', '*', '6', '/', '+'],
	},
	{
		input: '(3+4)*5',
		output: ['3', '4', '+', '5', '*'],
	},
	{
		input: '(300+23)*(43-21)/(84+7)',
		output: ['300', '23', '+', '43', '21', '-', '*', '84', '7', '+', '/'],
	},
	{
		input: '(4+8)*(6-5)/((3-2)*(2+2))',
		output: [
			'4',
			'8',
			'+',
			'6',
			'5',
			'-',
			'*',
			'3',
			'2',
			'-',
			'2',
			'2',
			'+',
			'*',
			'/',
		],
	},
	{
		input: '((15/(7-(1+1)))*3)-(2+(1+1))',
		output: [
			'15',
			'7',
			'1',
			'1',
			'+',
			'-',
			'/',
			'3',
			'*',
			'2',
			'1',
			'1',
			'+',
			'+',
			'-',
		],
	},
	{
		input: 'a ? b : c',
		output: ['a', 'b', 'c', '?:'],
	},
	{
		input: 'a ? b : c ? d : e',
		output: ['a', 'b', 'c', '?:', 'd', 'e', '?:'],
	},
	{
		input: 'n==1 ? 0 : n==2 ? 1 : 2',
		output: ['n', '1', '==', '0', 'n', '2', '==', '?:', '1', '2', '?:'],
	},
];

describe('postfix', () => {
	describe('fixtures', () => {
		FIXTURES.forEach(({ input, output }) => {
			it(input, () => expect(postfix(input)).toEqual(output));
		});
	});

	it('ignores whitespace', () => {
		expect(postfix('3 + 4   * 5 / 6')).toEqual([
			'3',
			'4',
			'5',
			'*',
			'6',
			'/',
			'+',
		]);
	});

	it('does not prematurely evaluate prefix operator', () => {
		// != vs !
		expect(postfix('n != 1')).toEqual(['n', '1', '!=']);

		// >= vs >
		expect(postfix('n >= 1')).toEqual(['n', '1', '>=']);

		// <= vs <
		expect(postfix('n <= 1')).toEqual(['n', '1', '<=']);
	});

	it('handles multi-character operand', () => {
		expect(postfix('foo != 121')).toEqual(['foo', '121', '!=']);
	});
});
