---
name: docs-sandpack
description: Sandpack patterns for React documentation. Invoke when adding interactive code examples.
---

# Sandpack Patterns

## File Naming

| Pattern | Usage |
|---------|-------|
| ` ```js ` | Main file (no prefix) |
| ` ```js src/FileName.js ` | Supporting files |
| ` ```js src/File.js active ` | Active file (reference pages) |
| ` ```js src/data.js hidden ` | Hidden files |
| ` ```css ` | CSS styles |
| ` ```json package.json ` | External dependencies |

**Critical:** Main file must have `export default`.

## Line Highlighting

```mdx
```js {2-4}
function Example() {
  // Lines 2-4
  // will be
  // highlighted
  return null;
}
```

## Code References (numbered callouts)

```mdx
```js [[1, 4, "age"], [2, 4, "setAge"]]
// Creates numbered markers pointing to "age" and "setAge" on line 4
```

## Expected Errors (intentionally broken examples)

```mdx
```js {expectedErrors: {'react-compiler': [7]}}
// Line 7 shows as expected error
```

## Multi-File Example

```mdx
<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return <Gallery />;
}
```

```js src/Gallery.js
export default function Gallery() {
  return <h1>Gallery</h1>;
}
```

```css
h1 { color: purple; }
```

</Sandpack>
```

## External Dependencies

```mdx
<Sandpack>

```js
import { useImmer } from 'use-immer';
// ...
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "use-immer": "0.5.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  }
}
```

</Sandpack>
```

## Code Style in Sandpack (Required)

Sandpack examples are held to strict code style standards:

1. **Function declarations** for components (not arrows)
2. **`e`** for event parameters
3. **Single quotes** in JSX
4. **`const`** unless reassignment needed
5. **Spaces in destructuring**: `({ props })` not `({props})`
6. **Two-line createRoot**: separate declaration and render call
7. **Multiline if statements**: always use braces

### Don't Create Hydration Mismatches

Sandpack examples must produce the same output on server and client:

```js
// 🚫 This will cause hydration warnings
export default function App() {
  const isClient = typeof window !== 'undefined';
  return <div>{isClient ? 'Client' : 'Server'}</div>;
}
```

### Use Ref for Non-Rendered State

```js
// 🚫 Don't trigger re-renders for non-visual state
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);

// ✅ Use ref instead
const mounted = useRef(false);
useEffect(() => { mounted.current = true; }, []);
```

## Additional Code Quality Rules

### Always Include Keys in Lists
```js
// ✅ Correct
{items.map(item => <li key={item.id}>{item.name}</li>)}

// 🚫 Wrong - missing key
{items.map(item => <li>{item.name}</li>)}
```

### Use Realistic Import Paths
```js
// ✅ Correct - descriptive path
import { fetchData } from './your-data-layer';

// 🚫 Wrong - looks like a real npm package
import { fetchData } from 'cool-data-lib';
```

### Console.log Labels
```js
// ✅ Correct - labeled for clarity
console.log('User:', user);
console.log('Component Stack:', errorInfo.componentStack);

// 🚫 Wrong - unlabeled
console.log(user);
```

### Keep Delays Reasonable
```js
// ✅ Correct - 1-1.5 seconds
setTimeout(() => setLoading(false), 1000);

// 🚫 Wrong - too long, feels sluggish
setTimeout(() => setLoading(false), 3000);
```

## Updating Line Highlights

When modifying code in examples with line highlights (`{2-4}`), **always update the highlight line numbers** to match the new code. Incorrect line numbers cause rendering crashes.

## File Name Conventions

- Capitalize file names for component files: `Gallery.js` not `gallery.js`
- After initially explaining files are in `src/`, refer to files by name only: `Gallery.js` not `src/Gallery.js`

---

## Sandpack Example Guidelines

### Package.json Rules

**Include package.json when:**
- Using external npm packages (immer, remarkable, leaflet, toastify-js, etc.)
- Demonstrating experimental/canary React features
- Requiring specific React versions (`react: beta`, `react: 19.0.0-rc-*`)

**Omit package.json when:**
- Example uses only built-in React features
- No external dependencies needed
- Teaching basic hooks, state, or components

**Always mark package.json as hidden:**
```mdx
```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "immer": "1.7.3"
  }
}
```
```

**Version conventions:**
- Use `"latest"` for stable features
- Use exact versions only when compatibility requires it
- Include minimal dependencies (just what the example needs)

### Hidden File Patterns

**Always hide these file types:**

| File Type | Reason |
|-----------|--------|
| `package.json` | Configuration not the teaching point |
| `sandbox.config.json` | Sandbox setup is boilerplate |
| `public/index.html` | HTML structure not the focus |
| `src/data.js` | When it contains sample/mock data |
| `src/api.js` | When showing API usage, not implementation |
| `src/styles.css` | When styling is not the lesson |
| `src/router.js` | Supporting infrastructure |
| `src/actions.js` | Server action implementation details |

**Rationale:**
- Reduces cognitive load
- Keeps focus on the primary concept
- Creates cleaner, more focused examples

**Example:**
```mdx
```js src/data.js hidden
export const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];
```
```

### Active File Patterns

**Mark as active when:**
- File contains the primary teaching concept
- Learner should focus on this code first
- Component demonstrates the hook/pattern being taught

**Effect of the `active` marker:**
- Sets initial editor tab focus when Sandpack loads
- Signals "this is what you should study"
- Works with hidden files to create focused examples

**Most common active file:** `src/index.js` or `src/App.js`

**Example:**
```mdx
```js src/App.js active
// This file will be focused when example loads
export default function App() {
  // ...
}
```
```

### File Structure Guidelines

| Scenario | Structure | Reason |
|----------|-----------|--------|
| Basic hook usage | Single file | Simple, focused |
| Teaching imports | 2-3 files | Shows modularity |
| Context patterns | 4-5 files | Realistic structure |
| Complex state | 3+ files | Separation of concerns |

**Single File Examples (70% of cases):**
- Use for simple concepts
- 50-200 lines typical
- Best for: Counter, text inputs, basic hooks

**Multi-File Examples (30% of cases):**
- Use when teaching modularity/imports
- Use for context patterns (4-5 files)
- Use when component is reused

**File Naming:**
- Main component: `App.js` (capitalized)
- Component files: `Gallery.js`, `Button.js` (capitalized)
- Data files: `data.js` (lowercase)
- Utility files: `utils.js` (lowercase)
- Context files: `TasksContext.js` (named after what they provide)

### Code Size Limits

- Single file: **<200 lines**
- Multi-file total: **150-300 lines**
- Main component: **100-150 lines**
- Supporting files: **20-40 lines each**

### CSS Guidelines

**Always:**
- Include minimal CSS for demo interactivity
- Use semantic class names (`.panel`, `.button-primary`, `.panel-dark`)
- Support light/dark themes when showing UI concepts
- Keep CSS visible (never hidden)

**Size Guidelines:**
- Minimal (5-10 lines): Basic button styling, spacing
- Medium (15-30 lines): Panel styling, form layouts
- Complex (40+ lines): Only for layout-focused examples
