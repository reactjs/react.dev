---
title: React Compiler
---

<Intro>
Welcome to the React Compiler documentation! This section will give you an introduction to the new experimental React Compiler and how to use it successfully.
</Intro>

<YouWillLearn isChapter={true}>

* Getting started with the compiler
* Installing the compiler
* Reporting issues
* Debugging

</YouWillLearn>

React Compiler is a new experimental compiler that we've open sourced to get feedback from the community. It is a build-time only tool that automatically optimizes your React app. It works with plain JavaScript, and understands the [Rules of React](/reference/rules), so you don't need to rewrite any code to use it.

The compiler also includes an eslint plugin that surfaces the analysis from the compiler right in your editor. The plugin runs independently of the compiler and can be used even if you aren't using the compiler in your app. We recommend all React developers to use this eslint plugin to help improve the quality of your codebase.

## What does the compiler do? {/*what-does-the-compiler-do*/}

The compiler understands your code at a deep level through its understanding of plain JavaScript semantics and the Rules of React. This allows it to add automatic optimizations to your code.

### Automatic Memoization {/*automatic-memoization*/}
The first optimization that we've added is **auto-memoization**. You may be familiar today with manual memoization through [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), and [`React.memo`](/reference/react/memo). The compiler can automatically do this for you, if your code follows the Rules of React. Where it can detect breakages of the rules, it can automatically skip over just those components or hooks, and continue compiling other code.

If your codebase is already very well memoized, you might not expect to see major performance improvements with the compiler.

## Trying out the compiler {/*trying-out-the-compiler*/}

Please note that the compiler is still experimental and has many rough edges. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).

You don't have to rush into using the compiler now. It's okay to wait until it reaches a stable release before adopting it. However, we do appreciate trying it out in small experiments in your apps so that you can provide feedback to us to help make the compiler better.