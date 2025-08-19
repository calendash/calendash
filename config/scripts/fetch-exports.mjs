#!/usr/bin/env node
'use strict';

import { fileURLToPath } from 'node:url';
import { chalk, fs, path, echo } from 'zx';

async function validateExports(exports, rootPath) {
	// Fetch misssing export files
	const missingFiles = await Promise.all(
		Object.values(exports).map((xport) => {
			if (typeof xport === 'string') return [];
			echo(
				chalk.cyan(`→ Validating exports:`) + chalk.yellowBright(`\n\n${JSON.stringify(xport)}\n`)
			);
			return Promise.all([
				fs.exists(xport.default),
				fs.exists(xport.module),
				fs.exists(xport.types),
			]).then(([main, module, types]) =>
				[
					!main && path.relative(rootPath, xport.default),
					!module && path.relative(rootPath, xport.module),
					!types && path.relative(rootPath, xport.types),
				].filter((value) => Boolean(value))
			);
		})
	).then((files) => files.flat());

	// Exit with error if missing files exist.
	if (missingFiles.length > 0) {
		echo(
			chalk.redBright(`✖ Missing files:\n\n\t${missingFiles.join(',\v\r\t  ')}`) +
				chalk.bgGray('\n Script failed. Did you forget to build? \n')
		);
		process.exit(1);
	}

	process.exit(0);
}

async function run() {
	// Get project package "exports" section
	const rootPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
	const { exports } = await fs.readJSON('./package.json');

	echo(
		chalk.cyan(`→ Fetching package.json exports from path:`) +
			chalk.whiteBright(`\n\n\t${rootPath}\n`)
	);

	// Exit script with no error, if no exports
	if (!exports) process.exit(0);

	// Validate presence of export files
	await validateExports(exports, rootPath);

	// Copying files to specified path (except for root path)
	for (const [key, xport] of Object.entries(exports)) {
		if (path.extname(key) || typeof xport === 'string' || key === '.') continue;
		const { default: main, module, types } = xport;
		await fs.mkdirp(key);
		await Promise.all([
			fs.copyFile(main, `${key}/${path.basename(main)}`),
			fs.copyFile(module, `${key}/${path.basename(module)}`),
			fs.copyFile(types, `${key}/${path.basename(types)}`),
			fs.writeJson(
				`${key}/package.json`,
				{
					sideEffects: false,
					main: path.basename(main),
					module: path.basename(module),
					types: path.basename(types),
				},
				{ spaces: 2 }
			),
		]);
	}
	process.exit(0);
}

run();
