---
title: 'Using functions in Effects'
---

<Intro>

In some rare cases, using functions in Effects is could be tricky to pull off
correctly.

</Intro>

<YouWillLearn>

* Using a function inside Effects
* useCallback hook to perserve the identity of a function

</YouWillLearn>

## Using a function inside an Effect {/*using-a-function-inside-an-effect*/}

Consider the following example:

```js {10}
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [data, setData] = useState();
    function getFetchUrl() {
        return "https://hn.algolia.com/api/v1/search?query=" + query;
    }
    useEffect(() => {
        const result = axios(getFetchUrl('react'));
        setData(result);
    }, []); // is this correct?
};
```

The first thing you will encounter is a warning telling you that `useEffect` has a missing dependency `getFetchUrl`. That's because our Effect depends on it but it is not specified in the deps array.

If we do not include it, the Effect will not re-run when `query` changes but If we include it, we will run into a problem since our Effect now depends on `getFetchUrl` which is different in each render because on each render our component runs again, therefore, the `getFetchUrl` get created again every render, so including it in the deps array will cause an infinite loop.

```js {4-7,11}
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [data, setData] = useState();
    // 🔴 Different on every render
    function getFetchUrl() {
        return "https://hn.algolia.com/api/v1/search?query=" + query;
    }
    useEffect(() => {
        const result = axios(getFetchUrl('react'));
        setData(result);
    }, [getFetchUrl]); // Will cause an infinite loop since the function always changes
    // ...
};
```

<Note>
If you try to include `query` in the deps array, the linter will keep saying that the Effect has a missing dependency `getFetchUrl`.

TODO: why such behavior
TODO: also maybe talk about what a transitive dependency is
</Note>


An easy solution is to move the function inside the Effect and add `query` to the deps array. Now we do not have to think about transitive dependencies anymore and our Effect only depends on `query`.

```js {6,10}
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [data, setData] = useState();
    useEffect(() => {
        function getFetchUrl() {
            return "https://hn.algolia.com/api/v1/search?query=" + query;
        }
        const result = axios(getFetchUrl('react'));
        setData(result);
    }, [query]); 
    // ...
};
```

## Perserving the identity of a function {/*Perserving-the-identity-of-a-function*/}

What if we do not want to move `getFetchUrl` inside the Effect? What if we want to reuse this function somewhere else? Of course we are not going to repeat that code everywhere, that will not be ideal. Alternatively we can use the `useCallback` hook to create a memoized version of the function.

```js {4-6}
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [data, setData] = useState();
    const getFetchUrl = useCallback(() => {
        return "https://hn.algolia.com/api/v1/search?query=" + query;
    }, [query])
    useEffect(() => {
        const result = axios(getFetchUrl('react'));
        setData(result);
    }, [getFetchUrl]); 
    // ...
};
```

The `useCallback` hook takes a function and a dependency array. The purpose of this hook is to prevent the function from changing on each render (Perserving its identity) unless one of the dependencies change. To further understand, React will not change `getFetchUrl` but when `query` changes, React will change `getFetchUrl`. That makes `getFetchUrl` a usable dependency now since it only changes when the query changes. 

To summerize, `getFetchUrl` will only change when `query` changes and when `getFetchUrl` changes our Effect will re-run

<DeepDive title="useCallback is not for optimization">
the `useCallback` hook is not for optimization. It is for perserving functions' identity. Do not use it everywhere. To unnderstand, ponder at the two examples below:

```js {4-6}
const getFetchUrl = useCallback(() => {
    return "https://hn.algolia.com/api/v1/search?query=" + query
}, [])
```
```js {4-6}
const getFetchUrl = () => "https://hn.algolia.com/api/v1/search?query=" + query
const getFetchUrlCallback = useCallback(getFetchUrl, [])
```
They are identical! The `getFetchUrl` gets re-created on each render no matter what! When using `useCallback`, React just holds on `getFetchUrl` and throws any other instances of it unless one of the dependencies changed. Applying this, the second example does more work so you are better off without `useCallback` in this case.
</DeepDive>
