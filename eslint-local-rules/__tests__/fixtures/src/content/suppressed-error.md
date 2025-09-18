```jsx {expectedErrors: {'react-compiler': [4]}}
import {useState} from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  setCount(count + 1);
  return <div>{count}</div>;
}
```
