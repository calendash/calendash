#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { releaseVersion, releaseChangelog } = require('nx/release');
const { runCommand } = require('./utils/helpers');
const { error, heading, info, warn, success, results } = require('./utils/loggers');

/**
 * Retrieves commit information between a given Git branch (or the repository's first commit)
 * and the current HEAD.
 *
 * @param {string} [branch] - An optional Git branch name to use as the base commit. If omitted, the first commit is used.
 * @returns {{ commits: string, base: string, head: string }} An object containing:
 *  - `commits`: The list of commits (oneline format) between base and head
 *  - `base`: The base commit SHA
 *  - `head`: The head commit SHA
 */
function getBranchProps(branch) {
	const baseCommitCmd = branch
		? `git rev-list -n 1 ${branch}`
		: 'git rev-list --max-parents=0 HEAD';
	const baseCommit = runCommand(baseCommitCmd);
	const headCommit = runCommand('git rev-list -n 1 HEAD');
	const commits = runCommand(`git log --oneline ${baseCommit}..${headCommit}`);

	return {
		commits,
		base: baseCommit,
		head: headCommit,
	};
}

async function run({ dryRun, verbose, specifier, packages }) {
	if (packages.length === 0) {
		error('No packages to be released.');
		process.exit(1);
	}

	heading({
		title: 'Calendash Release Script',
		script: 'scripts/release.js',
		purpose: 'Automate versioning and changelog generation',
	});

	info(`Releasing package${packages.length > 1 ? 's' : ''}:\n\n\t${packages.join(',\v\r\t  ')}\n`);

	for (const packageName of packages) {
		try {
			info(`Searching tag information for ${packageName} package...`);
			const tag = runCommand(`git tag --list "${packageName}@*" --sort=-creatordate | head -n 1`, {
				silenceError: true,
			});

			if (!tag) {
				warn(`No tags found for ${packageName}`);
			} else {
				info(`Using latest tag: "${tag}"`);
			}

			const { base, head, commits } = getBranchProps(tag);

			if (!commits) {
				warn(`No commits found. Skipping release for '${packageName}' package`);
				continue;
			}

			const commonProps = {
				base,
				head,
				dryRun,
				verbose,
				firstRelease: !tag,
				projects: [packageName],
			};

			const { projectsVersionData, workspaceVersion } = await releaseVersion({
				...commonProps,
				specifier,
				generatorOptionsOverrides: {
					currentVersionResolver: 'git',
					fallbackCurrentVersionResolver: 'disk',
					specifierSource: 'conventional-commits',
				},
				stageChanges: true,
				gitCommit: false,
				gitPush: false,
				gitTag: false,
			});

			if (!projectsVersionData[packageName]) {
				throw new Error(
					`Project "${packageName}" was not processed correctly by Nx releaseVersion.`
				);
			}

			const { projectChangelogs } = await releaseChangelog({
				...commonProps,
				version: workspaceVersion,
				versionData: projectsVersionData,
				stageChanges: true,
				gitCommit: true,
				gitCommitArgs: '--no-verify',
				gitTag: true,
				gitPush: true,
				gitCommitMessage: `chore(release): ${packageName} release changes`,
			});

			if (!projectChangelogs[packageName]) {
				throw new Error(
					`Package "${packageName}" was not processed correctly by Nx releaseChangelog.`
				);
			}

			success('¡Documentation release completed successfully!');
			results({
				tag: projectChangelogs[packageName].releaseVersion.gitTag,
				packageName,
				dryRun,
				verbose,
			});
		} catch (err) {
			error('Release script failed with following error →', err);
			process.exit(1);
		}
	}

	process.exit(0);
}

const { argv } = yargs(hideBin(process.argv))
	.option('specifier', {
		description:
			'Specifier types (e.g., patch, minor, major, prerelease, prepatch, preminor, premajor, rc)',
		type: 'string',
		default: 'patch',
	})
	.option('dryRun', {
		description: 'Run without making changes',
		type: 'boolean',
		default: false,
	})
	.option('verbose', {
		description: 'Enable verbose output',
		type: 'boolean',
		default: false,
	})
	.option('packages', {
		description: 'List of packages to be released',
		type: 'array',
		default: [],
	})
	.option('defaultBranch', {
		description: 'Default repository branch',
		type: 'string',
		default: 'master',
	});

run(argv);
