import { join, basename } from 'path';
import { readdirSync, readFileSync, statSync } from 'fs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

const PACKAGES_DIR = join('.', 'packages');

const packages = readdirSync(PACKAGES_DIR).filter((file) => {
	return statSync(join(PACKAGES_DIR, file)).isDirectory();
});

export default packages.reduce((result, pkg) => {
	const pkgRoot = join(PACKAGES_DIR, pkg);
	const manifest = JSON.parse(
		readFileSync('./' + join(pkgRoot, 'package.json')),
	);
	const { exports, dependencies = {}, moduleName = pkg } = manifest;
	const { import: src } = exports['.'];

	return result.concat([
		// CommonJS (Node)
		{
			input: join(pkgRoot, src),
			output: {
				format: 'cjs',
				file: join(pkgRoot, '/build/' + basename(src, '.js') + '.cjs'),
				exports: 'default',
			},
			external: Object.keys(dependencies),
		},

		// IIFE (Browser)
		{
			input: join(pkgRoot, src),
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
			input: join(pkgRoot, src),
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
