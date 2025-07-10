# Contributing Guidelines

Thank you for your interest in contributing to this project!  
These guidelines help ensure a smooth, consistent, and high-quality development process.

---

## 🌿 Branching Strategy

All new work should start from the latest `master` branch.

### ✅ Branch naming convention:

Use lowercase, hyphenated branch names prefixed with the type of change:

| Type       | Purpose                               | Example                          |
|------------|----------------------------------------|----------------------------------|
| `feat/`    | New feature                            | `feat/login-form-validation`     |
| `fix/`     | Bug fix                                | `fix/navbar-overlap`             |
| `docs/`    | Documentation                          | `docs/api-endpoints`             |
| `style/`   | Formatting or style changes            | `style/button-spacing`           |
| `refactor/`| Code restructure (no behavior change)  | `refactor/utils-date-helpers`    |
| `test/`    | Add or update tests                    | `test/form-validation`           |
| `chore/`   | Maintenance tasks                      | `chore/update-eslint-config`     |
| `ci/`      | CI/CD pipeline or workflow changes     | `ci/deploy-workflow`             |
| `build/`   | Build system or dependency updates     | `build/upgrade-deps`             |
| `perf/`    | Performance improvements               | `perf/image-loading`             |
| `revert/`  | Reverts previous commits               | `revert/broken-refactor`         |

---

## ✏️ Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

```bash
<type>(<optional-scope>): <short, imperative summary>
```

### Examples:

- `feat(auth): add support for OAuth login`
- `fix(api): handle 500 errors for invalid payloads`
- `docs: update contributing guidelines`
- `style(ui): apply prettier formatting`
- `refactor(utils): simplify slug generator`
- `test(core): add unit test for pricing rules`

### Avoid:

- `update code`
- `fix stuff`
- `final changes`

---

## ⚙️ Development Workflow

1. Fork the repository (if needed).
2. Create your branch from master using the branch naming convention table above.
3. Make your changes, ensuring:
   - Code follows formatting and naming conventions
   - All tests pass and are updated/added as needed
   - Linting succeeds (`npm run lint`, if available)
   - Documentation is updated, if necessary
4. Commit changes with meaningful messages
5. Push your branch and open a **Pull Request** targeting `master`

---

## 🚀 Pull Request Lifecycle

- Pull Requests **must target** the `master` branch.
- Draft PRs are welcome for early feedback.
- All status checks (tests, CI, linters) must pass.
- At least **one maintainer approval** is required to merge.
- Use a clear, descriptive title and summary.
- Link related issues (e.g., `Closes #123`).

---

## 🧪 Testing & Linting

Run the following before submitting your PR:

```bash
# example
npm run lint
npm run test
```

> [!NOTE]   
> See available scripts in [package.json](./package.json).

---

## 🛡️ Signed Commits & DCO Compliance (Required)

All commits must meet the following criteria **to be eligible for merging**:

- **Signed using a verified GPG or SSH key**
- **Include a "Signed-off-by" line** to comply with the [Developer Certificate of Origin (DCO)](https://developercertificate.org)

> 🚫 Commits that do not meet these requirements will be rejected by GitHub checks and cannot be merged.

### 🔐 Why We Require This

- Ensures verified authorship
- Prevents impersonation or spoofing
- Maintains a secure and auditable contribution history
- Affirms that contributors agree to the terms of the DCO

### 📚 Resources

- [GitHub Docs – Sign commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
- [DCO – Developer Certificate of Origin](https://developercertificate.org)

---

## 💬 Contributions Beyond Code

We value all types of contributions, including:

- Reporting bugs
- Suggesting new features or ideas
- Improving documentation
- Reviewing pull requests
- Participating in Discussions

---

## ❓ Questions or Feedback?

Please open a [Discussion](https://github.com/calendash/calendash/discussions) or create an [Issue](https://github.com/calendash/calendash/issues) if you have questions, suggestions, or feedback.

---

Thank you for contributing to this project! 🙌
