/**
 * Operator callback functions.
 *
 * @type {Object}
 */
var OPERATORS = {
	'!': function (a) {
		return !a;
	},
	'*': function (a, b) {
		return a * b;
	},
	'/': function (a, b) {
		return a / b;
	},
	'%': function (a, b) {
		return a % b;
	},
	'+': function (a, b) {
		return a + b;
	},
	'-': function (a, b) {
		return a - b;
	},
	'<': function (a, b) {
		return a < b;
	},
	'<=': function (a, b) {
		return a <= b;
	},
	'>': function (a, b) {
		return a > b;
	},
	'>=': function (a, b) {
		return a >= b;
	},
	'==': function (a, b) {
		return a === b;
	},
	'!=': function (a, b) {
		return a !== b;
	},
	'&&': function (a, b) {
		return a && b;
	},
	'||': function (a, b) {
		return a || b;
	},
	'?:': function (a, b, c) {
		if (a) {
			throw b;
		}

		return c;
	},
};

/**
 * Given an array of postfix terms and operand variables, returns the result of
 * the postfix evaluation.
 *
 * @example
 *
 * ```js
 * import evaluate from '@tannin/evaluate';
 *
 * // 3 + 4 * 5 / 6 ⇒ '3 4 5 * 6 / +'
 * const terms = ['3', '4', '5', '*', '6', '/', '+'];
 *
 * evaluate(terms, {});
 * // ⇒ 6.333333333333334
 * ```
 *
 * @param {string[]} postfix   Postfix terms.
 * @param {Object}   variables Operand variables.
 *
 * @return {*} Result of evaluation.
 */
export default function evaluate(postfix, variables) {
	var stack = [],
		i,
		j,
		args,
		getOperatorResult,
		term,
		value;

	for (i = 0; i < postfix.length; i++) {
		term = postfix[i];

		getOperatorResult = OPERATORS[term];
		if (getOperatorResult) {
			// Pop from stack by number of function arguments.
			j = getOperatorResult.length;
			args = Array(j);
			while (j--) {
				args[j] = stack.pop();
			}

			try {
				value = getOperatorResult.apply(null, args);
			} catch (earlyReturn) {
				return earlyReturn;
			}
		} else if (variables.hasOwnProperty(term)) {
			value = variables[term];
		} else {
			value = +term;
		}

		stack.push(value);
	}

	return stack[0];
}
