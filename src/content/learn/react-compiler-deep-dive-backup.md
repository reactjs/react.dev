<DeepDive>
#### What kind of memoization does React Compiler add? {/*what-kind-of-memoization-does-react-compiler-add*/}

The initial release of React Compiler is primarily focused on **improving update performance** (re-rendering existing components), so it focuses on these two use cases:

1. **Skipping cascading re-rendering of components**
    * Re-rendering `<Parent />` causes many components in its component tree to re-render, even though only `<Parent />` has changed
1. **Skipping expensive calculations from outside of React**
    * For example, calling `expensivelyProcessAReallyLargeArrayOfObjects()` inside of your component or hook that needs that data

#### Optimizing Re-renders {/*optimizing-re-renders*/}

React lets you express your UI as a function of their current state (more concretely: their props, state, and context). In its current implementation, when a component's state changes, React will re-render that component _and all of its children_ — unless you have applied some form of manual memoization with `useMemo()`, `useCallback()`, or `React.memo()`. For example, in the following example, `<MessageButton>` will re-render whenever `<FriendList>`'s state changes:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_See this example in the React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler automatically applies the equivalent of manual memoization, ensuring that only the relevant parts of an app re-render as state changes, which is sometimes referred to as "fine-grained reactivity". In the above example, React Compiler determines that the return value of `<FriendListCard />` can be reused even as `friends` changes, and can avoid recreating this JSX _and_ avoid re-rendering `<MessageButton>` as the count changes.

#### Expensive calculations also get memoized {/*expensive-calculations-also-get-memoized*/}

React Compiler can also automatically memoize for expensive calculations used during rendering:

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_See this example in the React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

However, if `expensivelyProcessAReallyLargeArrayOfObjects` is truly an expensive function, you may want to consider implementing its own memoization outside of React, because:

- React Compiler only memoizes React components and hooks, not every function
- React Compiler's memoization is not shared across multiple components or hooks

So if `expensivelyProcessAReallyLargeArrayOfObjects` was used in many different components, even if the same exact items were passed down, that expensive calculation would be run repeatedly. We recommend [profiling](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) first to see if it really is that expensive before making code more complicated.
</DeepDive>