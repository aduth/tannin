import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { exec as baseExec } from 'node:child_process';
import { promisify } from 'node:util';
import Benchmark from 'benchmark';
import current from '../index.js';

const exec = promisify(baseExec);
const { dirname } = import.meta;

const { version } = JSON.parse(
	await readFile(resolve(dirname, '../package.json'), 'utf8'),
);
const tag = `@tannin/sprintf@${version}`;
const outfile = resolve(dirname, `sprintf-${version}.js`);
await exec(
	`git show ${tag}:${relative(process.cwd(), resolve(dirname, '../index.js'))} > ${outfile}`,
);
const { default: lastTag } = await import(outfile);

const suite = new Benchmark.Suite();

suite
	.add('current', () => {
		current('Hello %s!', 'world');
	})
	.add('last tag', () => {
		lastTag('Hello %s!', 'world');
	})
	.on('cycle', (event) => console.log(event.target.toString()))
	.run({ async: true });
