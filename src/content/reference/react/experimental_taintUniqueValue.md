---
title: experimental_taintUniqueValue
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

`taintUniqueValue` lets you prevent a passing a password, crypto graphic key or token, as a string, bigint or typed array, to a Client Component. It blocks this string completely so it cannot be a value that's also used in other contexts. It needs to be unique.

```js
taintUniqueValue(message, lifetime, value)
```

To prevent passing an object containing sensitive data, see [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Call `taintUniqueValue` with a password, token, key or hash to register it with React as something that should not be allowed to be passed to the Client as is:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass super secret keys to the client.',
  process,
  process.env.SUPER_SECRET_KEY
);
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `message`: The message you want to display if the object gets passed to a Client Component. It's logged as any other Error that is thrown.

* `lifetime`: Any object that indicates how long to block it. The value remains blocked as long as this object is still around. For example, passing `globalThis` blocks the value for the life time of an app. Typically it would an object whose properties contains the value.

* `value`: A string, bigint or TypedArray. This value must be a unique sequence of characters/bytes with high entropy such as a cryptographic token, private key, hash or a long password. This value gets banned for passing to any Client Component in the whole app.

#### Returns {/*returns*/}

`experimental_taintUniqueValue` returns `undefined`.

---

## Usage {/*usage*/}

If you're running a Server Components that has access to private keys or passwords such as database passwords, you have to be careful not to pass that to a Client Component.

```js
export async function Dashboard(props) {
  // DO NOT DO THIS
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

This example would leak the secret API token to the client. If this API token can be used to access data this particular user shouldn't have access to, it's a security problem.

Ideally, secrets like this are abstracted into a single helper file that can only be imported by trusted data utilities on the server. The helper can even be tagged with `server-only` to ensure that this file isn't imported on the client.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

Sometimes mistakes happen during refactoring and not all of your colleagues might know about this. 
To protect against this mistakes happening down the line we can "taint" the actual password:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.'
  process,
  process.env.API_PASSWORD
);
```

Now whenever anyone tries to pass this password to a Client Component, or bound to a Server Action, it'll error with the passed in error message instead.

#### Lifetime {/*lifetime*/}

Whenever we taint a value, we need to provide a lifetime argument to define how long the value should be tainted. Otherwise, it might just grow indefinitely in memory until you run out of memory. In many cases, such as the examples above, this is just fine. We can pass an object that lives forever such as `globalThis` or `process` for this use case.

If we're tainting a value that just lives for one request or for the lifetime of some cached object, or if we don't know how long it'll be kept around, we need to provide a different object.

Typically this would be the object that ends up getting passed around and cached.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Do not pass a user session token to the client.',
    user,
    user.session.token,
  );
  return user;
}
```

This ensures that if this `user` object gets stored in some global store, and another request can read from it, the token is still tainted. If it gets cleaned up then we don't end up leaking memory.

If the lifetime object gets GC:ed during an on-going request, React will still keep the value tainted for the duration of this request.


<Pitfall>

**Do not rely on just tainting for security.** You should design your data access APIs and access to private keys in an isolated way such that you don't easily leak it into the Component rendering in the first place. Tainting is opt-in and easy to forget.

Tainting provides an extra layer of protection if someone on your team still makes a mistake but it's not intended as the primary solution.

Tainting a value doesn't block every possible derived value. For example, converting it to upper case, concatenating it into a larger string, converting it to base64, returning a substring etc, will still be allowed. It only protects against simple mistakes like passing it straight through.

If you cache the value in a global store outside of React, without the corresponding lifetime object, the value will be untainted eventually.

</Pitfall>
