```jsx title="Counter" {expectedErrors: {'react-compiler': [99]}} {expectedErrors: {'react-compiler': [2]}}
import {useState} from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  setCount(count + 1);
  return <div>{count}</div>;
}
```
