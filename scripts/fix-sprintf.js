import { readFile, writeFile } from 'fs/promises';

const content = await readFile('./packages/sprintf/src/index.d.ts', 'utf8'),
	updatedContent = content.replace(
		'...args: import("../types/index.d.ts").SprintfArgs<T>[]',
		'...args: import("../types/index.d.ts").SprintfArgs<T>',
	);

await writeFile('./packages/sprintf/src/index.d.ts', updatedContent, 'utf8');

// eslint-disable-next-line no-console
console.log('Updated index.d.ts in sprintf package');
