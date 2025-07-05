"use strict";

import { chalk, echo } from "zx";

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
 * The total width of the banner including padding.
 * @type {number}
 */
const WIDTH = 80;

/**
 * Generates a centered CALENDASH banner with a specified Chalk background color.
 *
 * @param {BgColorType} color - The color name to apply as the background using Chalk (e.g., 'blueBright' will use `chalk.bgBlueBright`).
 * @returns {string} A styled and bold 'CALENDASH' banner string with the chosen background color.
 */
const banner = (color) =>
  chalk[`bg${color.charAt(0).toUpperCase() + color.slice(1)}`].bold(
    " CALENDASH ",
  );

/**
 * Centers the given string within a fixed banner width, accounting for ANSI escape codes.
 *
 * @param {string} [text=''] - The string to center. May include ANSI escape codes (e.g., Chalk styles).
 * @returns {string} The input string padded with spaces to be horizontally centered within the defined banner width.
 */
const center = (text = "") => {
  const strippedLength = text.replace(/\u001b\[[0-9;]*m/g, "").length; // remove ANSI colors
  const padding = WIDTH - 2 - strippedLength;
  const left = Math.floor(padding / 2);
  const right = padding - left;
  return " ".repeat(left) + text + " ".repeat(right);
};

export function warn(msg) {
  echo(banner("yellow") + chalk.yellowBright(` ⚠ ${msg}\n`));
}

export function info(msg) {
  echo(banner("cyan") + chalk.whiteBright(` → ${msg}\n`));
}

export function error(msg, cause) {
  const output =
    banner("red") +
    chalk.redBright(` ✖ ${msg}`) +
    (cause ? chalk.bgGray(`\n ${cause} `) : "");
  echo(output + "\n");
}

export function success(msg) {
  echo(banner("greenBright") + chalk.whiteBright(` ✔ ${msg}\n`));
}

export function logDryRun(msg) {
  echo(
    banner("magenta") +
      chalk.magentaBright.bold(" [dry-run] ") +
      chalk.magentaBright(`${msg}\n`),
  );
}

export function heading({ title, script, purpose }) {
  const lines = [
    "┌" + "─".repeat(WIDTH - 2) + "┐",
    "│" + center() + "│",
    "│" + center(chalk.bold.underline(title)) + "│",
    "│" + center() + "│",
    "│" + center(chalk.gray("Script:") + " " + chalk.white(script)) + "│",
    "│" + center(chalk.gray("Purpose:") + " " + chalk.white(purpose)) + "│",
    "│" + center() + "│",
    "└" + "─".repeat(WIDTH - 2) + "┘",
  ];

  echo("\n" + chalk.cyanBright(lines.join("\n")) + "\n");
}

export function results({ tag, projectName, dryRun, verbose }) {
  const lines = [
    "┌" + "─".repeat(WIDTH - 2) + "┐",
    "│" + center() + "│",
    "│" + center(chalk.gray("Version:") + " " + chalk.white(tag)) + "│",
    "│" + center(chalk.gray("Project:") + " " + chalk.white(projectName)) + "│",
    "│" +
      center(
        chalk.gray("Dry Run:") + " " + chalk.white(dryRun ? "Yes" : "No"),
      ) +
      "│",
    "│" +
      center(
        chalk.gray("Verbose Mode:") +
          " " +
          chalk.white(verbose ? "Enabled" : "Disabled"),
      ) +
      "│",
    "│" + center() + "│",
    "└" + "─".repeat(WIDTH - 2) + "┘",
  ];

  echo("\n" + chalk.greenBright(lines.join("\n")) + "\n");
}
