<Sandpack>

```js
let name = ''

  if (name !== '') {
    useEffect(function persistForm() {
console.log('e')
    });
  }

import { useState, useEffect } from "react"



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