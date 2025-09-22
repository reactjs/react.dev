---
title: config
version: rc
---

<Intro>

Validates the compiler [configuration options](/reference/react-compiler/configuration).

</Intro>

<RC>

This rule is available in the RC version of `eslint-plugin-react-hooks`.

You can try it by upgrading the lint plugin [to the most recent RC version](/learn/react-compiler/installation#eslint-integration).

</RC>

## Rule Details {/*rule-details*/}

React Compiler accepts various [configuration options](/reference/react-compiler/configuration)  to control its behavior. This rule validates that your configuration uses correct option names and value types, preventing silent failures from typos or incorrect settings.

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js
// ❌ Unknown option name
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // Typo: should be compilationMode
    }]
  ]
};

// ❌ Invalid option value
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // Invalid: use 'all' or 'infer'
    }]
  ]
};
```

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// ✅ Valid compiler configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## Troubleshooting {/*troubleshooting*/}

### Configuration not working as expected {/*config-not-working*/}

Your compiler configuration might have typos or incorrect values:

```js
// ❌ Wrong: Common configuration mistakes
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Typo in option name
      compilationMod: 'all',
      // Wrong value type
      panicThreshold: true,
      // Unknown option
      optimizationLevel: 'max'
    }]
  ]
};
```

Check the [configuration documentation](/reference/react-compiler/configuration) for valid options:

```js
// ✅ Better: Valid configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // or 'infer'
      panicThreshold: 'none', // or 'critical_errors', 'all_errors'
      // Only use documented options
    }]
  ]
};
```
