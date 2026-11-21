import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import evaluate from '../index.js';

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
	{
		source: '1 ? 4 : (1 ? 2 : 3)',
		postfix: ['1', '4', '1', '2', '3', '?:', '?:'],
	},
	{
		source: '0 ? (1 ? 2 : 3) : 4',
		postfix: ['0', '1', '2', '3', '?:', '4', '?:'],
	},
	{
		source: '0 ? 1 : 0 ? 2 : 3',
		postfix: ['0', '1', '0', '2', '3', '?:', '?:'],
	},
];

describe('evaluate', () => {
	describe('fixtures', () => {
		FIXTURES.forEach(({ source, postfix }) => {
			it(source, () => assert.deepEqual(evaluate(postfix, {}), eval(source)));
		});
	});
});
