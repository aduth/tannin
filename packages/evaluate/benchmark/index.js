const Benchmark = require('benchmark');
const evaluate = require('..');

const suite = new Benchmark.Suite();

suite
	.add('n != 1', () => {
		evaluate(['n', '1', '!='], { n: 2 });
	})
	.add('3 + 4 * 5 / 6', () => {
		evaluate(['3', '4', '5', '*', '6', '/', '+'], {});
	})
	.on('cycle', (event) => console.log(event.target.toString()))
	.run({ async: true });
