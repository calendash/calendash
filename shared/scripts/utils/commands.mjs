"use strict";

import { execSync } from "child_process";
import { warn, logDryRun, info } from "./loggers.mjs";

/**
 * Command line configuration options.
 * These options are passed to the child_process execSync command.
 *
 * @typedef {Object} Options
 * @property {NodeJS.ProcessEnv} [env] - Environment variables to use during execution.
 * @property {string | URL} [cwd] - Working directory for the command.
 * @property {string} [shell] - Shell to use for command execution (defaults to /bin/sh).
 * @property {boolean} [silenceError] - If true, suppresses command stderr and returns stdout on failure.
 */

/**
 * Command options specific to git operations.
 *
 * @typedef {Object} CmdOptions
 * @property {boolean} [dryRun] - If true, simulate the command execution without running it.
 * @property {boolean} [silence] - If true, suppress command errors.
 * @property {string | null} [mockReturn] - Optional mock return value used during dry run.
 */

/**
 * Executes a generic shell command synchronously with customizable options.
 *
 * @param {string} command - The full command line string to execute.
 * @param {Options} [opts={}] - Optional execution settings like cwd, env, shell, and silenceError.
 * @returns {string | null} The trimmed stdout from the command, or null if error is silenced.
 * @throws {Error} If the command fails and silenceError is false, rethrows the error.
 */
function runCommand(command, opts = {}) {
  const { cwd, env, shell, silenceError = false } = opts;

  try {
    info(`Running: ${command}`);
    return execSync(command, {
      cwd: cwd ?? "./",
      shell: shell ?? "/bin/sh",
      env: { ...process.env, ...env },
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: false,
    })
      .toString()
      .trim();
  } catch (err) {
    if (silenceError && err?.stderr) {
      warn(err.stderr.toString());
      return err?.stdout?.toString() ?? null;
    }
    throw err;
  }
}

/**
 * Runs a Git command with optional dry-run and silence behavior.
 *
 * @param {string} command - The Git subcommand to execute (e.g., 'status', 'log').
 * @param {CmdOptions} [opts={}] - Optional settings to control execution behavior.
 * @returns {string | null} The output from the Git command, or the mock return if dryRun is enabled.
 */
export function runGitCommand(command, opts = {}) {
  const { dryRun = false, silence = false, mockReturn = null } = opts;
  const fullCommand = ["git", command].join(" ");
  if (dryRun) {
    logDryRun(`Would have run GIT command: "${fullCommand}"`);
    return mockReturn;
  }

  return runCommand(fullCommand, { silenceError: silence });
}
