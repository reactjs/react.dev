---
title: "use php"
titleForTitleTag: "'use php' directive"
---

<Intro>

`"use php"` unlocks PHP snippets inside a React component. When the compiler sees the directive, it forwards tagged template literals (`php``…```) to the embedded PHP runtime instead of treating them as plain strings.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `"use php"` {/*use-php*/}

Add `"use php"` to the top of a function to opt that scope into PHP interop mode.

```js {1,5-9}
function LegacyInvoice({ items }) {
  "use php";

  return (
    <section>
      {php`
        <?php foreach ($items as $item) { ?>
          <li><?= strtoupper($item["name"]) ?></li>
        <?php } ?>
      `}
    </section>
  );
}
```

With the directive enabled, the compiler:

* Keeps all `php``…`` `template literals as runtime calls to the PHP bridge.
* Skips React Hook checks inside the literal, deferring execution to PHP.
* Emits hydration boundaries so the server-rendered PHP markup can slot back into the React tree.

#### Caveats {/*caveats*/}

* The directive must be the first statement in the function body (comments above it are fine).
* You must provide a `php` tagged template helper that proxies to your PHP engine.
* The function cannot contain `"use memo"`—the compiler treats `use php` as mutually exclusive with other opt-in directives.
* Only synchronous PHP execution is supported; asynchronous bridges should wrap results in `await phpAsync\`\`` calls outside the template literal.

### How `"use php"` bridges runtimes {/*how-use-php-bridges-runtimes*/}

`"use php"` tells the React Compiler to…

1. Mark the component as requiring the PHP bridge.
2. Hoist each `php``…`` ` literal into a server call site.
3. Serialize props referenced inside the literal using JSON, making them available to the PHP runtime as `$props`.
4. Reinsert the rendered HTML back into the React output before hydration.

Because the compiler controls serialization, it enforces deterministic input (no functions or Symbols). Violations trigger build-time errors with instructions to precompute data on the JavaScript side.

### When to use `"use php"` {/*when-to-use*/}

`"use php"` shines in hybrid applications migrating from PHP templates:

#### Gradual rewrites {/*gradual-rewrites*/}
Keep critical pages rendering through legacy PHP while incrementally moving logic to React.

```js
function AccountSettings({ user }) {
  "use php";

  return (
    <div>
      <ReactSummary user={user} />
      {php`
        <?php include 'settings-form.php'; // TODO: migrate ?>
      `}
    </div>
  );
}
```

#### Server-side utilities {/*server-side-utilities*/}
Call into established PHP libraries (PDF generation, currency formatting) without abandoning React.

```js
function DownloadReceipt({ order }) {
  "use php";

  const receiptPath = php`
    <?php return generate_receipt_pdf($props["order"]); ?>
  `;

  return <a href={receiptPath}>Download receipt</a>;
}
```

---

## Usage {/*usage*/}

You can enable PHP interop at the file level or per function:

```js
"use php"; // Module-level opt-in for every function below.

function Bootstrapper(props) {
  return php`
    <?php bootstrap_app($props); ?>
  `;
}

function ExplicitComponent() {
  "use php"; // Reinforces the directive on a single component.

  return php`
    <div><?= render_navigation(); ?></div>
  `;
}
```

Every tagged template literal receives a `$props` array containing the JavaScript props serialized by the compiler. Nested functions inherit the directive, so helper functions declared inside the component can also emit PHP.

---

## Troubleshooting {/*troubleshooting*/}

### `ReferenceError: php is not defined` {/*php-helper-missing*/}

Ensure you provide a `php` tagged template helper:

```js
import { php } from "@company/react-php-bridge";
```

Without this import the compiler leaves a direct call to `php([...])`, which will fail at runtime.

### Props missing inside PHP {/*props-missing*/}

Only serializable values are forwarded. Convert non-serializable props before entering the literal:

```js
const safeProps = {
  ...props,
  onSubmit: undefined, // Functions can't cross the runtime boundary.
};

return php`<?php render_form($props["safeProps"]); ?>`;
```

### Hydration mismatch warnings {/*hydration-mismatch*/}

The PHP output must remain stable between server and client. Avoid calling time-based helpers (`time()`, `rand()`) directly; precompute values in JavaScript and pass them through `$props`.

### See also {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) - Force React Compiler optimizations
* [`"use nemo"`](/reference/react-compiler/directives/use-nemo) - Keep functions hook-free
* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - Opt out of compilation entirely
