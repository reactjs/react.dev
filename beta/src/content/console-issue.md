# Test {/*test*/}

<Sandpack>

```js
import { useEffect } from "react";
        
export default function App() {
  useEffect(() => {
    console.log("fire")
  }, [])
  
  return <h1>Hello World</h1>
}
```

</Sandpack>