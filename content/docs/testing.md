---
id: testing
title: Testing Overview
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-environments.html
---

Writing tests for React components ensures that its behavior matches your expectations and requirements.

Tests can guarantee that components' behavior don't break in the future, even as you iterate and make changes to them. They are also useful as readable specifications for learning about your components, and how they interact with each other.

- [_Environments_](/docs/testing-environments.html): Setting up a testing environment for React components.
- [_Recipes_](/docs/testing-recipes.html): Common patterns when writing tests for React components.

### Recommended Tools {#tools}

- **[Jest](https://facebook.github.io/jest/):** A test runner that lets you write and run test suites for JavaScript, with support for features like mocked [modules](#mocking-modules) and [timers](#mocking-timers), [`jsdom`](#mocking-a-rendering-surface), etc.
- **[React Testing Library](https://testing-library.com/react):** React DOM testing utilities that encourage good testing practices by focusing on accessibility and stability.
