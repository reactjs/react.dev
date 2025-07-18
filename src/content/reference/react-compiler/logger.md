---
title: logger
---

<Intro>

The `logger` option provides custom logging for React Compiler events during compilation.

</Intro>

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[Compiler] ${event.kind}: ${filename}`);
    }
  }
}
```

<InlineToc />

---

## Reference {/*reference*/}

### `logger` {/*logger*/}

Configures custom logging to track compiler behavior and debug issues.

#### Type {/*type*/}

```
{
  logEvent: (filename: string | null, event: LoggerEvent) => void;
} | null
```

#### Default value {/*default-value*/}

`null`

#### Methods {/*methods*/}

- **`logEvent`**: Called for each compiler event with the filename and event details

#### Event types {/*event-types*/}

- **`CompileSuccess`**: Function successfully compiled
- **`CompileError`**: Function skipped due to errors
- **`CompileDiagnostic`**: Non-fatal diagnostic information
- **`CompileSkip`**: Function skipped for other reasons
- **`PipelineError`**: Unexpected compilation error
- **`Timing`**: Performance timing information

#### Caveats {/*caveats*/}

- Event structure may change between versions
- Large codebases generate many log entries

---

## Usage {/*usage*/}

### Basic logging {/*basic-logging*/}

Track compilation success and failures:

```js
{
  logger: {
    logEvent(filename, event) {
      switch (event.kind) {
        case 'CompileSuccess': {
          console.log(`✅ Compiled: ${filename}`);
          break;
        }
        case 'CompileError': {
          console.log(`❌ Skipped: ${filename}`);
          break;
        }
        default: {}
      }
    }
  }
}
```

### Detailed error logging {/*detailed-error-logging*/}

Get specific information about compilation failures:

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileError') {
        console.error(`\nCompilation failed: ${filename}`);
        console.error(`Reason: ${event.detail.reason}`);

        if (event.detail.description) {
          console.error(`Details: ${event.detail.description}`);
        }

        if (event.detail.loc) {
          const { line, column } = event.detail.loc.start;
          console.error(`Location: Line ${line}, Column ${column}`);
        }

        if (event.detail.suggestions) {
          console.error('Suggestions:', event.detail.suggestions);
        }
      }
    }
  }
}
```

