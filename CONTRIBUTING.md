# Contributing

Thank you for your interest in contributing to the React Docs!

## Code of Conduct

Facebook has adopted a Code of Conduct that we expect project
participants to adhere to. Please [read the full text](https://code.facebook.com/codeofconduct)
so that you can understand what actions will and will not be tolerated.

## Guidelines for Documentation

### Syntax

**Prefer JSX to `createElement`.**

Ignore this if you're specifically describing `createElement`.

**Use `const` where possible, otherwise `let`. Don't use `var`.**

Ignore this if you're specifically writing about ES5.

**Don't use features that aren't standardized yet.**

For example, **don't** write this:

```js
class MyComponent extends React.Component {
  state = {value: ''};
  handleChange = (e) => {
    this.setState({value: e.target.value});
  };
}
```

Instead, **do** write this:

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: ''};
  }
  handleChange(e) {
    this.setState({value: e.target.value});
  }
}
```

Ignore this rule if you're specifically describing an experimental proposal. Make sure to mention its experimental nature in the code and in the surrounding text.

### Style

- Use semicolons.
- No space between function names and parens (`method() {}` not `method () {}`).
- When in doubt, use the default style favored by [Prettier](https://prettier.io/playground/).
