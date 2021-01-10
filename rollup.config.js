import { join, basename } from 'path';
import { readdirSync, statSync } from 'fs';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';

const PACKAGES_DIR = join('.', 'packages');

const packages = readdirSync(PACKAGES_DIR).filter((file) => {
	return statSync(join(PACKAGES_DIR, file)).isDirectory();
});

export default packages.reduce((result, pkg) => {
	const pkgRoot = join(PACKAGES_DIR, pkg);
	const manifest = require('./' + join(pkgRoot, 'package.json'));
	const { module, dependencies = {}, moduleName = pkg } = manifest;

	return result.concat([
		// CommonJS (Node)
		{
			input: join(pkgRoot, module),
			output: {
				format: 'cjs',
				file: join(pkgRoot, '/build/' + basename(module)),
				exports: 'default',
			},
			external: Object.keys(dependencies),
		},

		// IIFE (Browser)
		{
			input: join(pkgRoot, module),
			output: {
				format: 'iife',
				name: moduleName,
				file: join(pkgRoot, '/dist/' + pkg + '.js'),
				exports: 'default',
			},
			plugins: [resolve()],
		},

		// IIFE (Browser, Minified)
		{
			input: join(pkgRoot, module),
			output: {
				format: 'iife',
				name: moduleName,
				file: join(pkgRoot, '/dist/' + pkg + '.min.js'),
				exports: 'default',
			},
			plugins: [resolve(), terser()],
		},
	]);
}, []);
