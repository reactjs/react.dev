---
title: "use nemo"
titleForTitleTag: "'use nemo' directive"
---

<Intro>

`"use nemo"` forbids React Hook usage inside a function. The React Compiler will surface an error if the function calls anything that looks like a Hook (for example `useState` or a custom `useSomething` helper). The directive name nods to Nemo—the famously hook-averse clownfish from *Finding Nemo*—reminding us that real fish hate hooks and so should this component.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `"use nemo"` {/*use-nemo*/}

Place `"use nemo"` at the very top of a function body to declare it as a hook-free zone.

```js {1}
function FishFacts() {
  "use nemo";

  // ✅ Regular code is fine
  const [facts] = getFacts(); // Not a Hook, just a regular helper
  return <FactsList facts={facts} />;
}
```

![Nemo the clownfish giving a wary look at an unseen fishing hook](/images/docs/use-nemo-directive.png)

*If you care about fish, give them a hook-free habitat.*

When the compiler sees `"use nemo"`, it rejects any React Hook calls inside the function (including custom Hooks). The directive is useful when you want to guarantee a component never uses hooks—for example, to keep critical rendering paths side-effect free. If you care about fish—or just deterministic rendering—reach for `"use nemo"` whenever a component needs to steer clear of hooks.

#### Caveats {/*caveats*/}

* The directive must be the first statement in the function (comments are allowed above it).
* Hook detection is name-based. Anything starting with `use` followed by an uppercase letter is treated as a Hook call.
* The directive applies to the entire function scope, including nested helper functions declared inside.
* `"use nemo"` and `"use memo"` are mutually exclusive—if both appear, the compiler reports a conflict.
* Module-level directives cascade: a file-level `"use nemo"` applies to every function unless a function-level directive overrides it.

### How `"use nemo"` enforces hook bans {/*how-use-nemo-enforces-hook-bans*/}

The React Compiler performs a static scan for Hook-like calls during compilation. With `"use nemo"` active:

* Direct imports from `react` such as `useState`, `useEffect`, or `useContext` cause a compile-time error.
* Custom helpers named like Hooks (`useAnalytics`, `useFishTank`, etc.) are also blocked.
* The compiler suggests moving Hook logic into a different component or converting it into a prop-driven API.

This safeguard is handy when migrating legacy class components or when you need deterministic rendering behavior without Hook scheduling. Just like Nemo dodging fishing hooks, components guarded by `"use nemo"` stay clear of hook-induced side effects.

### When to use `"use nemo"` {/*when-to-use*/}

`"use nemo"` is primarily suited for:

#### Critical rendering paths {/*critical-rendering*/}
Performance-sensitive sections that must avoid Hook re-execution can opt into `"use nemo"` to guarantee purity.

```js
function CriticalPromo({ promo }) {
  "use nemo";

  // ✅ Everything here must be pure computations.
  return <Hero banner={computeBanner(promo)} />;
}
```

#### Enforcing architectural boundaries {/*architectural-boundaries*/}
Large apps sometimes need to restrict Hooks to a specific layer (for example, container vs. presentational components). `"use nemo"` provides a compile-time guard:

```js
function ButtonView(props) {
  "use nemo"; // Presentation-only components stay hook-free.

  return <button {...props} />;
}
```

---

## Usage {/*usage*/}

You can place `"use nemo"` at either the module or function level:

```js
"use nemo"; // Module-level guard—applies to every function below.

function Wrapper(props) {
  return <PureChild {...props} />;
}

function PureChild({ label }) {
  "use nemo"; // Optional reinforcement at the function level
  return <span>{label}</span>;
}
```

Attempting to call a Hook inside the guarded scope throws a compile-time error:

```js
function Cheater() {
  "use nemo";

  const [state, setState] = useState(); // ❌ Compiler error: Hooks are forbidden by "use nemo".
  return <span>{state}</span>;
}
```

When in doubt, channel Nemo's survival instincts—if a line smells like bait (anything named `useSomething`), keep it out of the function.

---

## Troubleshooting {/*troubleshooting*/}

### Hook still compiles {/*hook-still-compiles*/}

If a Hook call slips through, check the directive placement:

```js
function Oops() {
  console.log("setup"); // ❌ Directive must come first.
  "use nemo";
  useEffect(() => {}); // Compiler only sees the directive after the hook.
}
```

Also verify the file isn’t compiled in `legacy` or experimental modes that skip directive checks.

### False positives on helper names {/*false-positives*/}

Helpers that start with `use` and a capital letter count as Hooks. Rename helpers or wrap them:

```js
function useFilter(data) { /* ... */ } // ❌ Looks like a Hook.

function filterData(data) { /* ... */ } // ✅ Rename to avoid the guard.
```

### See also {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) - Opt into compilation
* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - Opt out of compilation
