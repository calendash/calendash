#!/usr/bin/env node
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { $, chalk, echo, fs } from 'zx';

async function run({ tsConfig, aeConfig }) {
	echo(
		chalk.cyan(`→ Building TS file${tsConfig.length > 1 ? 's' : ''}:`) +
			chalk.whiteBright(`\n\n\t${tsConfig.join(',\v\r\t')}\n`)
	);

	// Exec TypeScript build for each tsconfig file
	await Promise.all(tsConfig.map((tscPath) => $`npx tsc -b ${tscPath}`)).catch((err) => {
		echo(chalk.redBright(`✖ Failed to build TS`) + chalk.bgGray(`\n ${err} \n`));
		process.exit(1);
	});

	echo(
		chalk.cyan(`→ Running API Extractor${aeConfig.length > 1 ? 's' : ''}:`) +
			chalk.whiteBright(`\n\n\t${aeConfig.join(',\v\r\t')}\n`)
	);

	// Exec API Extractor command for each config file
	await Promise.all(
		aeConfig.map(async (aecPath) => {
			await $`npx api-extractor run --local --verbose -c ${aecPath}`;
			const configFile = await fs.readJson(aecPath);
			const filePath = configFile.dtsRollup?.untrimmedFilePath;
			if (filePath) {
				const path = filePath.replace('<projectFolder>', configFile.projectFolder ?? '.');
				const dtsFile = await fs.readFile(path, 'utf-8');
				if (dtsFile.includes('React_2')) {
					echo(chalk.cyan(`→ Replacing "React_2" with "React" in `) + chalk.greenBright(path));
					await fs.writeFile(path, dtsFile.replace(/React_2/g, 'React'));
				}

				const mdtsPath = path.replace(/\.d\.ts$/, '.d.mts');
				echo(
					chalk.cyan(
						'→ Creating file ' + chalk.greenBright(mdtsPath) + ' out of ' + chalk.greenBright(path)
					)
				);
				await fs.copyFile(path, mdtsPath);
			}
		})
	).catch((err) => {
		echo(chalk.redBright(`✖ Failed to run API extractor`) + chalk.bgGray(`\n ${err} \n`));
		process.exit(1);
	});

	process.exit(0);
}

const { argv } = yargs(hideBin(process.argv))
	.option('tsConfig', {
		alias: 'tsc',
		description: 'TypeScript build configuration file.',
		type: 'array',
		default: ['./tsconfig.json'],
	})
	.option('aeConfig', {
		alias: 'aec',
		description: 'API Extractor configuration file.',
		type: 'array',
		default: ['./api-extractor.json'],
	});

run(argv);
