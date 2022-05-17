<Sandpack>

```js
import { useState, useEffect } from "react"

const foo = ""
foo = 123

export default function App() {
  const [a, setA] = useState("");

  useEffect(() => {
    console.log(a);
  }, []);
  
  if(a) {
    const foo = useState()
  }

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
```
</Sandpack>