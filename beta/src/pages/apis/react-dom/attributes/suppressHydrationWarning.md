---
title: suppressHydrationWarning
---

<Wip>

This section is incomplete, please see the old docs for [suppressHydrationWarning](https://reactjs.org/docs/dom-elements.html#suppresshydrationwarning).

</Wip>

<Intro>

React expects that the rendered content is identical between the server and the client. It can patch up differences in text content, but you should treat mismatches as bugs and fix them. In development mode, **React warns about mismatches during hydration**. There are no guarantees that attribute differences will be patched up in case of mismatches. This is important for performance reasons because, in most apps, mismatches are rare, so validating all markup would be prohibitively expensive.

If a single element’s attribute or text content is unavoidably different between the server and the client (for example, a timestamp), you may silence the warning by adding `suppressHydrationWarning={true}` to the element. It only works one level deep and is intended to be an escape hatch. Don’t overuse it. Unless it’s text content, React still won’t attempt to patch it up, so it may remain inconsistent until future updates.

</Intro>
