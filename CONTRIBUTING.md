# Contributing Guidelines

Thank you for your interest in contributing to this project! Please follow these guidelines to help us maintain consistency, quality, and a smooth workflow.

---

## 📦 Branching Strategy

All new work should begin from a new branch created off the latest `master` branch.

### ✅ Accepted Branch Name Formats:

- `feat/<short-description>` — New feature implementation
- `fix/<short-description>` — Bug fixes
- `chore/<short-description>` — Maintenance tasks
- `docs/<short-description>` — Documentation updates
- `style/<short-description>` — Code style or formatting changes
- `refactor/<short-description>` — Code restructuring
- `ci/<short-description>` — CI/CD pipeline or config updates
- `revert/<short-description>` — Reverts to a previous state
- `build/<short-description>` — Build system updates
- `perf/<short-description>` — Performance improvements
- `test/<short-description>` — Add or update tests

---

## ✏️ Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard to keep commit history readable and consistent.

### Format:

> [!IMPORTANT]  
> The `scope` is **optional**, but recommended to improve clarity and traceability.

```
<type>(<scope>): <description>
```

### Examples:

- `docs: update installation guide`
- `fix(react): handle null pointer in user model`
- `feat(core): add search endpoint for articles`
- `chore(release): bump dependencies`
- `refactor(utils): simplify date parsing logic`
- `style(vue): apply prettier formatting`
- `test(core): add unit test for login flow`
- `ci(workflow): update GitHub Actions node version`
- `perf(utils): improve search logic`
- `build: update nx build process`
- `revert(root): nx build update`

### Avoid:

- `updated code`
- `fixed stuff`
- `final changes`
- `misc updates`

---

## ⚙️ Development Workflow

1. **Fork the repository** (if you don't have write access).
2. **Create your branch** using a name format from the list above.
3. Make your changes and ensure:
   - Code follows the project’s conventions and formatting.
   - All existing and new tests pass.
   - Linting rules are respected (npm run lint, if applicable).
   - Documentation is updated, if necessary.
4. **Commit your changes** with meaningful commit messages.
5. **Push your branch** and open a **Pull Request (PR)** against the `master` branch.

---

## 🚀 Pull Request Lifecycle

- PR must target `master` branch.
- Draft PRs are welcome for early feedback.
- All status checks (tests, CI, linters) must pass before review.
- At least **one approval from a maintainer** is required before merging.
- Use a clear title and description for your PR, referencing issues when applicable (e.g. `Closes #42`).

---

## 📦 Release Process

After a PR is merged into `master`, the release is triggered **manually** by maintainers.   
If your PR affects production behavior, maintainers will determine whether a new version should be published.

---

## 🧪 Testing & Linting

Please run tests locally before submitting a PR:

```bash
# example
npm run lint
npm run test
```

> [!NOTE]   
> Check the [package.json](./package.json) file for available scripts.

---

## 🛡️ Signed Commits (Required)

All commits **must be signed** using a verified GPG or SSH key. Unsigned commits will be rejected by GitHub and cannot be merged.

### Why we require this:
- Ensures authenticity and verified authorship
- Prevents impersonation and spoofing
- Maintains a secure and auditable commit history

See: [GitHub Docs – Sign commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

---

## 🤝 Contributions Beyond Code

We value all forms of contribution! That includes:

- Reporting bugs
- Improving documentation
- Suggesting features or design ideas
- Helping review PRs or answer questions in Discussions

---

## ❓ Questions or Suggestions?

Please open a [Discussion](https://github.com/calendash/calendash/discussions) or create an [Issue](https://github.com/calendash/calendash/issues) if you have questions, suggestions, or feedback.

---

Thank you for helping improve this project! 💙
