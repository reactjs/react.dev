---
title: incompatible-library
version: rc
---

<Intro>

Validates against usage of libraries which are incompatible with memoization (manual or automatic).

</Intro>

<RC>

This rule is available in the RC version of `eslint-plugin-react-hooks`.

You can try it by upgrading the lint plugin [to the most recent RC version](/learn/react-compiler/installation#eslint-integration).

</RC>

<Note>

These libraries were designed before React's memoization rules were fully documented. They made the correct choices at the time to optimize for ergonomic ways to keep components just the right amount of reactive as app state changes. While these legacy patterns worked, we have since discovered that it's incompatible with React's programming model. We will continue working with library authors to migrate these libraries to use patterns that follow the Rules of React.

</Note>

## Rule Details {/*rule-details*/}

Some libraries use patterns that aren't supported by React. When the linter detects usages of these APIs from a [known list](https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/HIR/DefaultModuleTypeProvider.ts), it flags them under this rule. This means that React Compiler can automatically skip over components that use these incompatible APIs, in order to avoid breaking your app.

```js
// Example of how memoization breaks with these libraries
function Form() {
  const { watch } = useForm();

  // ❌ This value will never update, even when 'name' field changes
  const name = useMemo(() => watch('name'), [watch]);

  return <div>Name: {name}</div>; // UI appears "frozen"
}
```

React Compiler automatically memoizes values following the Rules of React. If something breaks with manual `useMemo`, it will also break the compiler's automatic optimization. This rule helps identify these problematic patterns.

<DeepDive>

#### Designing APIs that follow the Rules of React {/*designing-apis-that-follow-the-rules-of-react*/}

One question to think about when designing a library API or hook is whether calling the API can be safely memoized with `useMemo`. If it can't, then both manual and React Compiler memoizations will break your user's code.

For example, one such incompatible pattern is "interior mutability". Interior mutability is when an object or function keeps its own hidden state that changes over time, even though the reference to it stays the same. Think of it like a box that looks the same on the outside but secretly rearranges its contents. React can't tell anything changed because it only checks if you gave it a different box, not what's inside. This breaks memoization, since React relies on the outer object (or function) changing if part of its value has changed.

As a rule of thumb, when designing React APIs, think about whether `useMemo` would break it:

```js
function Component() {
  const { someFunction } = useLibrary();
  // it should always be safe to memoize functions like this
  const result = useMemo(() => someFunction(), [someFunction]);
}
```

Instead, design APIs that return immutable state and use explicit update functions:

```js
// ✅ Good: Return immutable state that changes reference when updated
function Component() {
  const { field, updateField } = useLibrary();
  // this is always safe to memo
  const greeting = useMemo(() => `Hello, ${field.name}!`, [field.name]);

  return (
    <div>
      <input
        value={field.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <p>{greeting}</p>
    </div>
  );
}
```

</DeepDive>

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js
// ❌ react-hook-form `watch`
function Component() {
  const {watch} = useForm();
  const value = watch('field'); // Interior mutability
  return <div>{value}</div>;
}

// ❌ TanStack Table `useReactTable`
function Component({data}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // table instance uses interior mutability
  return <Table table={table} />;
}
```

<Pitfall>

#### MobX {/*mobx*/}

MobX patterns like `observer` also break memoization assumptions, but the linter does not yet detect them. If you rely on MobX and find that your app doesn't work with React Compiler, you may need to use the `"use no memo" directive`.

```js
// ❌ MobX `observer`
const Component = observer(() => {
  const [timer] = useState(() => new Timer());
  return <span>Seconds passed: {timer.secondsPassed}</span>;
});
```

</Pitfall>

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// ✅ For react-hook-form, use `useWatch`:
function Component() {
  const {register, control} = useForm();
  const watchedValue = useWatch({
    control,
    name: 'field'
  });

  return (
    <>
      <input {...register('field')} />
      <div>Current value: {watchedValue}</div>
    </>
  );
}
```

Some other libraries do not yet have alternative APIs that are compatible with React's memoization model. If the linter doesn't automatically skip over your components or hooks that call these APIs, please [file an issue](https://github.com/facebook/react/issues) so we can add it to the linter.
