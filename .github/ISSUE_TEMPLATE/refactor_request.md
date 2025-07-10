---
name: 🧹 Refactor / Code Cleanup
about: Propose code improvements that do not alter functionality
title: "[Refactor]: <clear and descriptive title>"
labels: [refactor]
assignees: ''
---

## 📍 Scope of Refactor

Specify the area(s) of the codebase this refactor applies to:  
> Include file names, modules, components, functions, or architectural layers.

---

## 💡 Motivation

What is the rationale for this refactor?  
> Common reasons: technical debt, code readability, performance bottlenecks, testability, separation of concerns, or architectural consistency.

---

## 🎯 Objective

Describe the intended result or improvement of the refactor.  
> What should become easier, cleaner, or more aligned with best practices—**without changing current behavior**?

---

## 📊 Benefits and Impact *(Optional but encouraged)*

Check all that apply, or describe others:

- [ ] Improves code readability and clarity
- [ ] Reduces complexity or duplication
- [ ] Aligns with existing code standards or architecture
- [ ] Facilitates unit testing or future extensions
- [ ] Enhances performance or memory usage
- [ ] Other: _(please specify)_

---

## ⚠️ Risks or Dependencies

Are there any potential risks, blockers, or constraints?

- Will this impact legacy code?
- Are there untested side effects?
- Could it conflict with ongoing development?

---

## 📎 Additional Context

Include links to design documents, code style guides, discussions, or architectural decisions that support the refactor.

---

<details>
<summary>💡 Before / After Code Example *(Optional)*</summary>

```ts
// Before
function example(input) {
  // hard to follow
}

// After
function example(input) {
  // modular and easier to test
}
```
</details> 