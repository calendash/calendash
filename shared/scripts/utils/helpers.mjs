"use strict";

import { runGitCommand } from "./commands.mjs";
import { warn, info } from "./loggers.mjs";
import { GIT } from "./constants.mjs";

function isEmptyString(value) {
  return value == null || (typeof value === "string" && value.trim() === "");
}

function fetchLastTagByProject(projectName) {
  // Get the most recent Git tag for the specified project, sorted by creation date.
  const tag = runGitCommand(GIT.BRANCH.LATEST_TAG(projectName), {
    silence: true,
  });

  if (isEmptyString(tag)) {
    warn(`No tags found for ${projectName}`);
    return null;
  }

  info(`Using latest tag: "${tag}"`);
  return tag;
}

function getCommitFromTag(tag) {
  const commit = runGitCommand(GIT.LOG.LAST_COMMIT_FROM_BRANCH(tag), {
    silence: true,
  });
  return isEmptyString(commit) ? null : commit;
}

function getTagInfo(projectName) {
  info(`Searching tag information for ${projectName} project...`);
  const tag = fetchLastTagByProject(projectName);
  const baseCommit = !!tag
    ? getCommitFromTag(tag)
    : runGitCommand(GIT.LOG.FIRST_COMMIT());
  const headCommit = runGitCommand(GIT.LOG.LAST_COMMIT());
  const commitsBetween = runGitCommand(
    GIT.LOG.COMMITS_BETWEEN(baseCommit, headCommit),
  );

  return {
    tag,
    base: baseCommit,
    head: headCommit,
    commits: commitsBetween,
  };
}

export { isEmptyString, getTagInfo };
