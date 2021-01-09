import { join, basename } from 'path';
import { readdirSync, statSync } from 'fs';
import { uglify } from 'rollup-plugin-uglify';
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
			},
			plugins: [resolve(), uglify()],
		},
	]);
}, []);
