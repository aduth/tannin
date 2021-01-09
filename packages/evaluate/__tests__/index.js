/**
 * Internal dependencies
 */
const evaluate = require('..');

const FIXTURES = [
	{
		source: '3+4*5/6',
		postfix: ['3', '4', '5', '*', '6', '/', '+'],
	},
	{
		source: '(300+23)*(43-21)/(84+7)',
		postfix: ['300', '23', '+', '43', '21', '-', '*', '84', '7', '+', '/'],
	},
	{
		source: '(4+8)*(6-5)/((3-2)*(2+2))',
		postfix: [
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
		source: '((15/(7-(1+1)))*3)-(2+(1+1))',
		postfix: [
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
];

describe('evaluate', () => {
	describe('fixtures', () => {
		FIXTURES.forEach(({ source, postfix }) => {
			// eslint-disable-next-line no-eval
			it(source, () => expect(evaluate(postfix, {})).toEqual(eval(source)));
		});
	});
});
