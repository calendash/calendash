---
name: 🧹 Refactor / Code Cleanup
about: Propose code restructuring, simplification, or cleanup without changing existing behavior
title: "[Refactor]: Clear and descriptive title"
labels: [refactor]
assignees: ''
---

## 📍 Scope of Refactor

What part(s) of the codebase should be refactored?  
> Be specific: file names, modules, functions, or components.

---

## 🤔 Why is this refactor necessary?

What’s the motivation behind this refactor?  
> Examples: technical debt, low readability, duplication, testability, architecture alignment, performance concerns, etc.

---

## 🎯 Expected Outcome

Describe the intended state after the refactor.  
What should improve (without altering the functional behavior)?

> Example: “Code should be easier to unit test”, or “This logic should be moved to a utility for reuse.”

---

## 📊 Impact Assessment (Optional but recommended)

> How will this change improve the codebase?

- [ ] Improves maintainability
- [ ] Reduces complexity or duplication
- [ ] Aligns with style/conventions
- [ ] Enables easier testing or extension
- [ ] Other: (specify)

---

## ⚠️ Potential Risks or Blockers

Are there risks or edge cases to be aware of?  
Do any dependencies, tests, or legacy logic limit this?

---

## 📎 Additional context or references

Include any links to related code standards, design docs, discussions, or tools.

---

<details>
<summary>💡 Before / After Code Example (Optional)</summary>

```ts
// Before
function example(input) {
  // unclear branching
}

// After
function example(input) {
  // clearer structure, reused helper
}
```
</details> 