'use strict';

const { execSync } = require('child_process');
const { logDryRun, info, warn } = require('./loggers');

/**
 * Command line configuration options.
 * These options are passed to the child_process execSync command.
 *
 * @typedef {object} CmdOptions
 * @property {NodeJS.ProcessEnv} [env] - Environment variables to use during execution.
 * @property {string | URL} [cwd] - Working directory for the command.
 * @property {string} [shell] - Shell to use for command execution (defaults to /bin/sh).
 * @property {boolean} [silenceError] - If true, suppresses command stderr and returns stdout on failure.
 */

/**
 * Executes a generic shell command synchronously with customizable options.
 *
 * @param {string} command - The command line to execute.
 * @param {CmdOptions} [opts={}] - Optional execution settings like cwd, env, shell, and silenceError.
 * @returns {string | null} The trimmed stdout from the command, or null if error is silenced.
 * @throws {Error} If the command fails and silenceError is false, rethrows the error.
 */
function runCommand(command, opts = {}) {
	const { cwd, env, shell, silenceError = false } = opts;

	try {
		info(`Running command: ${command}`);
		const raw = execSync(command, {
			cwd: cwd ?? './',
			shell: shell ?? '/bin/sh',
			env: { ...process.env, ...env },
			stdio: ['pipe', 'pipe', 'pipe'],
			windowsHide: false,
		})
			.toString()
			.trim();
		return raw && raw.length > 0 ? raw : null;
	} catch (err) {
		if (silenceError && err?.stderr) {
			warn(`Command failed with error: ${String(err.stderr)}`);
			return null;
		}
		throw err;
	}
}

/**
 * Executes a command with support for dry-run mode.
 * If `dryRun` is true, the command will not be executed.
 * Instead, a log message will indicate what would have been run.
 * If `dryRun` is false, the actual command is executed with the given options.
 *
 * @param {boolean} dryRun - Whether to run in dry-run mode (simulate execution without side effects).
 * @param {string} command - The command to execute.
 * @param {object} [opts={}] - Additional options passed to `runCommand`.
 * @returns {any|null} The result of `runCommand` if executed, otherwise `null` when in dry-run mode.
 */
function dryRunCommand(dryRun, command, opts = {}) {
	if (dryRun) {
		logDryRun(`Would have run command: "${command}"`);
		return null;
	}
	return runCommand(command, opts);
}

module.exports = {
	dryRunCommand,
	runCommand,
};
