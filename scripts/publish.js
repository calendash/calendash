#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { releasePublish } = require('nx/release');
const { error, success, heading, results, info, warn } = require('./utils/loggers');
const { dryRunCommand } = require('./utils/helpers');

async function run({ dryRun, tag, verbose }) {
	heading({
		title: 'Calendash Publish Script',
		script: 'scripts/publish.js',
		purpose: 'Automate NPM publish task',
	});

	const match = tag?.match(/^(.*?)@.*$/i);
	const packageName = match?.[1];

	if (!packageName) {
		error(`Invalid tag name expression: ${tag} →`, `Expected pattern: <package>@<semver>`);
		process.exit(1);
	}

	info(`Searching latest tag information for ${packageName} package...`);
	const latestTag = dryRunCommand(
		dryRun,
		`git tag --list "${packageName}@*" --sort=-creatordate | head -n 1`,
		{ silenceError: true }
	);

	if (!latestTag) {
		warn(`No tags found for ${packageName}`);
	} else {
		success(`Using latest tag: "${latestTag}"`);
	}

	try {
		const publishStatus = await releasePublish({
			dryRun,
			verbose,
			projects: [packageName],
			firstRelease: !latestTag,
			tag: 'latest',
		});

		const code = publishStatus?.[packageName]?.code ?? 1;

		if (code !== 0) {
			throw Error(`NPM publish script failed for '${packageName}'`);
		}

		success(`Version '${tag}' successfully published to NPM !!!`);
		results({
			tag,
			packageName,
			dryRun,
			verbose,
		});

		process.exit(code);
	} catch (err) {
		error('Publish script failed with following error →', err);
		process.exit(1);
	}
}

const { argv } = yargs(hideBin(process.argv))
	.option('dryRun', {
		description: 'Whether or not to perform a dry-run of the release process, defaults to true',
		type: 'boolean',
		default: false,
	})
	.option('tag', {
		description: 'This value matches the tag name shown on GitHub.',
		type: 'string',
		default: null,
	})
	.option('verbose', {
		description: 'Whether or not to enable verbose logging, defaults to false',
		type: 'boolean',
		default: false,
	});

run(argv);
