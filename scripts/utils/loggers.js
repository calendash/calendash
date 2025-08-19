'use strict';

const { chalk, echo } = require('zx');

/**
 * @typedef {(
 * 'yellow'
 * | 'yellowBright'
 * | 'blue'
 * | 'blueBright'
 * | 'black'
 * | 'blackBright'
 * | 'cyan'
 * | 'cyanBright'
 * | 'green'
 * | 'greenBright'
 * | 'magenta'
 * | 'magentaBright'
 * | 'red'
 * | 'redBright'
 * | 'white'
 * | 'whiteBright'
 * | 'gray'
 * | 'grey'
 * )} BgColorType
 */

/**
 * The options for a heading.
 *
 * @typedef {object} HeadingOptions
 * @property {string} title - The heading title.
 * @property {string} script - The script name.
 * @property {string} purpose - The heading purpose.
 */

/**
 * The options for a results message.
 *
 * @typedef {object} ResultsOptions
 * @property {string} tag - The version tag.
 * @property {string} projectName - The project name.
 * @property {boolean} dryRun - Whether to run in dry-run mode.
 * @property {boolean} verbose - Whether to enable verbose mode.
 */

const WIDTH = 80;

/**
 * Generates a centered Calendash banner with a specified Chalk background color.
 *
 * @param {BgColorType} color - The color name to apply as the background using Chalk (e.g., 'blueBright' will use `chalk.bgBlueBright`).
 * @returns {string} A styled and bold 'CALENDASH' banner string with the chosen background color.
 */
const banner = (color) =>
	chalk[`bg${color.charAt(0).toUpperCase() + color.slice(1)}`].bold(' CALENDASH ');

/**
 * Centers the given string within a fixed banner width, accounting for ANSI escape codes.
 *
 * @param {string} [text=''] - The string to center. May include ANSI escape codes (e.g., Chalk styles).
 * @returns {string} The input string padded with spaces to be horizontally centered within the defined banner width.
 */
const center = (text = '') => {
	const strippedLength = text.replace(/\033\[[0-9;]*m/g, '').length; // remove ANSI colors
	const padding = WIDTH - 2 - strippedLength;
	const left = Math.floor(padding / 2);
	const right = padding - left;
	return ' '.repeat(left) + text + ' '.repeat(right);
};

/**
 * Logs a warning message with a Calendash banner.
 *
 * @param {string} msg - The warning message to log.
 */
function warn(msg) {
	echo(banner('yellow') + chalk.yellowBright(` ⚠ ${msg}\n`));
}

/**
 * Logs an informational message with a Calendash banner.
 *
 * @param {string} msg - The informational message to log.
 */
function info(msg) {
	echo(banner('cyan') + chalk.whiteBright(` → ${msg}\n`));
}

/**
 * Logs an error message with a Calendash banner.
 *
 * @param {string} msg - The error message to log.
 * @param {string | undefined} [cause] - An optional error cause message to log.
 */
function error(msg, cause) {
	const output =
		banner('red') + chalk.red(` ✖ ${msg}`) + (cause ? chalk.bgGray(`\n ${cause} `) : '');
	echo(output + '\n');
}

/**
 * Logs a success message with a Calendash banner.
 *
 * @param {string} msg - The success message to log.
 */
function success(msg) {
	echo(banner('greenBright') + chalk.whiteBright(` ✔ ${msg}\n`));
}

/**
 * Logs a dry-run message with a Calendash banner.
 *
 * @param {string} msg - The dry-run message to log.
 */
function logDryRun(msg) {
	echo(
		banner('magenta') + chalk.magentaBright.bold(' [dry-run] ') + chalk.magentaBright(`${msg}\n`)
	);
}

/**
 * Logs a heading with a Calendash banner.
 *
 * @param {HeadingOptions} opts - The heading options.
 */
function heading({ title, script, purpose }) {
	const lines = [
		'┌' + '─'.repeat(WIDTH - 2) + '┐',
		'│' + center() + '│',
		'│' + center(chalk.bold.underline(title)) + '│',
		'│' + center() + '│',
		'│' + center(chalk.gray('Script:') + ' ' + chalk.white(script)) + '│',
		'│' + center(chalk.gray('Purpose:') + ' ' + chalk.white(purpose)) + '│',
		'│' + center() + '│',
		'└' + '─'.repeat(WIDTH - 2) + '┘',
	];

	echo('\n' + chalk.cyanBright(lines.join('\n')) + '\n');
}

/**
 * Logs a results message with a Calendash banner.
 *
 * @param {ResultsOptions} opts - The results options.
 */
function results({ tag, projectName, dryRun, verbose }) {
	const lines = [
		'┌' + '─'.repeat(WIDTH - 2) + '┐',
		'│' + center() + '│',
		'│' + center(chalk.gray('Version:') + ' ' + chalk.white(tag)) + '│',
		'│' + center(chalk.gray('Project:') + ' ' + chalk.white(projectName)) + '│',
		'│' + center(chalk.gray('Dry Run:') + ' ' + chalk.white(dryRun ? 'Yes' : 'No')) + '│',
		'│' +
			center(chalk.gray('Verbose Mode:') + ' ' + chalk.white(verbose ? 'Enabled' : 'Disabled')) +
			'│',
		'│' + center() + '│',
		'└' + '─'.repeat(WIDTH - 2) + '┘',
	];

	echo('\n' + chalk.greenBright(lines.join('\n')) + '\n');
}

module.exports = {
	warn,
	info,
	error,
	success,
	heading,
	results,
	logDryRun,
};
