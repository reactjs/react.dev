---
title: experimental_taintObjectReference
---

<Wip>

**This API is experimental and is not available in a stable version of React yet.**

You can try it by upgrading React packages to the most recent experimental version:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Experimental versions of React may contain bugs. Don't use them in production.

This API is only available inside React Server Components.

</Wip>


<Intro>

`taintObjectReference` lets you prevent a passing a specific object instance to a Client Component by mistake.

```js
experimental_taintObjectReference(message, object);
```

To prevent passing a crypto key, hash or token, see [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Call `taintObjectReference` with an object to register it with React as something that should not be allowed to be passed to the Client as is:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `message`: The message you want to display if the object gets passed to a Client Component. It's logged as any other Error that is thrown.

* `object`: Any kind of object that should be tainted. You can pass functions and class instances here too. They're already blocked from being passed to Client Components but this lets you customize the error message. You can also taint a specific instance of a Typed Array without tainting the value in other Typed Array copies.

#### Returns {/*returns*/}

`experimental_taintObjectReference` returns `undefined`.

---

## Usage {/*usage*/}

If you're running a Server Components environment that has access to sensitive data, you have to be careful not to pass objects straight through:

```js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from '...';
import { InfoCard } from '...';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

A `"use client"` component should never accept objects that might be carrying sensitive data. Ideally, the getUser helper should not expose data that the current user can't see. Sometimes mistakes happen during refactoring.

To protect against this mistakes happening down the line we can "taint" the user object in our data API.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

Now whenever anyone tries to pass this object to a Client Component, or bound to a Server Action, it'll error with the passed in error message instead.

<Pitfall>

**Do not rely on just tainting for security.** You should design your data access APIs and access to private keys in an isolated way such that you don't easily leak it into the Component rendering in the first place. Tainting is opt-in and easy to forget.

Tainting provides an extra layer of protection if someone on your team still makes a mistake but it's not intended as the primary solution.

Tainting an object doesn't prevent leaking of every possible derived value. For example, `const userInfo = {name: user.name, ssn: user.ssn}` create a new object which is not tainted. Creating a new object by just cloning it means it's no longer tainted `{...object}`. It only protects against simple mistakes when the object is passed straight through unchanged.

</Pitfall>
