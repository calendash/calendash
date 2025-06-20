export const GIT = {
  BRANCH: {
    LATEST_TAG: (tag) =>
      `tag --list "${tag}@*" --sort=-creatordate | head -n 1`,
    CONTAINS_BRANCH: (branch) => `branch --contains ${branch}`,
  },
  LOG: {
    COMMITS_BETWEEN: (baseCommit, headCommit) =>
      `log --oneline ${baseCommit}..${headCommit}`,
    LAST_COMMIT_FROM_BRANCH: (branch) => `rev-list -n 1 ${branch}`,
    FIRST_COMMIT: () => "rev-list --max-parents=0 HEAD",
    LAST_COMMIT: () => `rev-parse HEAD`,
  },
};
