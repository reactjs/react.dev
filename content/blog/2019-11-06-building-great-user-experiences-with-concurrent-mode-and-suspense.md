---
title: "Building Great User Experiences with Concurrent Mode and Suspense"
author: [josephsavona]
---

At React Conf 2019 we announced an [experimental release](/docs/concurrent-mode-adoption.html#installation) of React that supports Concurrent Mode and Suspense. In this post we'll introduce best practices for using them that we've identified through the process of building [the new facebook.com](https://twitter.com/facebook/status/1123322299418124289).

> This post will be most relevant to people working on _data fetching libraries_ for React. 
>
>It shows how to best integrate them with Concurrent Mode and Suspense. The patterns introduced here are based on [Relay](https://relay.dev/docs/en/experimental/step-by-step) -- our library for building data-driven UIs with GraphQL. However, the ideas in this post **apply to other GraphQL clients as well as libraries using REST** or other approaches.

This post is **aimed at library authors**. If you're primarily an application developer, you might still find some interesting ideas here, but don't feel like you have to read it in its entirety.

## Talk Videos {#talk-videos}

If you prefer to watch videos, some of the ideas from this blog post have been referenced in several React Conf 2019 presentations:

* [Data Fetching with Suspense in Relay](https://www.youtube.com/watch?v=Tl0S7QkxFE4&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=15&t=0s) by [Joe Savona](https://twitter.com/en_JS)
* [Building the New Facebook with React and Relay](https://www.youtube.com/watch?v=KT3XKDBZW7M&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=4) by [Ashley Watkins](https://twitter.com/catchingash)
* [React Conf Keynote](https://www.youtube.com/watch?v=uXEEL9mrkAQ&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=2) by [Yuzhi Zheng](https://twitter.com/yuzhiz)

This post presents a deeper dive on implementing a data fetching library with Suspense.

## Putting User Experience First {#putting-user-experience-first}

The React team and community has long placed a deserved emphasis on developer experience: ensuring that React has good error messages, focusing on components as a way to reason locally about app behavior, crafting APIs that are predictable and encourage correct usage by design, etc. But we haven't provided enough guidance on the best ways to achieve a great *user* experience in large apps.

For example, the React team has focused on *framework* performance and providing tools for developers to debug and tune application performance (e.g. `React.memo`). But we haven't been as opinionated about the *high-level patterns* that make the difference between fast, fluid apps and slow, janky ones. We always want to ensure that React remains approachable to new users and supports a variety of use-cases -- not every app has to be "blazing" fast. But as a community we can and should aim high. **We should make it as easy as possible to build apps that start fast and stay fast,** even as they grow in complexity, for users on varying devices and networks around the world. 

[Concurrent Mode](/docs/concurrent-mode-intro.html) and [Suspense](/docs/concurrent-mode-suspense.html) are experimental features that can help developers achieve this goal. We first introduced them at [JSConf Iceland in 2018](/blog/2018/03/01/sneak-peek-beyond-react-16.html), intentionally sharing details very early to give the community time to digest the new concepts and to set the stage for subsequent changes. Since then we've completed related work, such as the new Context API and the introduction of Hooks, which are designed in part to help developers naturally write code that is more compatible with Concurrent Mode. But we didn't want to implement these features and release them without validating that they work. So over the past year, the React, Relay, web infrastructure, and product teams at Facebook have all collaborated closely to build a new version of facebook.com that deeply integrates Concurrent Mode and Suspense to create an experience with a more fluid and app-like feel. 

Thanks to this project, we're more confident than ever that Concurrent Mode and Suspense can make it easier to deliver great, *fast* user experiences. But doing so requires rethinking how we approach loading code and data for our apps. Effectively all of the data-fetching on the new facebook.com is powered by [Relay Hooks](https://relay.dev/docs/en/experimental/step-by-step) -- new Hooks-based Relay APIs that integrate with Concurrent Mode and Suspense out of the box.

Relay Hooks -- and GraphQL -- won't be for everyone, and that's ok! Through our work on these APIs we've identified a set of more general patterns for using Suspense. **Even if Relay isn't the right fit for you, we think the key patterns we've introduced with Relay Hooks can be adapted to other frameworks.**

## Best Practices for Suspense {#best-practices-for-suspense}

It's tempting to focus only on the total startup time for an app -- but it turns out that users' perception of performance is determined by more than the absolute loading time. For example, when comparing two apps with the same absolute startup time, our research shows that users will generally perceive the one with fewer intermediate loading states and fewer layout changes as having loaded faster. Suspense is a powerful tool for carefully orchestrating an elegant loading sequence with a few, well-defined states that progressively reveal content. But improving perceived performance only goes so far -- our apps still shouldn't take forever to fetch all of their code, data, images, and other assets.

The traditional approach to loading data in React apps involves what we refer to as ["fetch-on-render"](/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense). First we render a component with a spinner, then fetch data on mount (`componentDidMount` or `useEffect`), and finally update to render the resulting data. It's certainly *possible* to use this pattern with Suspense: instead of initially rendering a placeholder itself, a component can "suspend" -- indicate to React that it isn't ready yet. This will tell React to find the nearest ancestor `<Suspense fallback={<Placeholder/>}>`, and render its fallback instead. If you watched earlier Suspense demos this example may feel familiar -- it's how we originally imagined using Suspense for data-fetching. 

It turns out that this approach has some limitations. Consider a page that shows a social media post by a user, along with comments on that post. That might be structured as a `<Post>` component that renders both the post body and a `<CommentList>` to show the comments. Using the fetch-on-render approach described above to implement this could cause sequential round trips (sometimes referred to as a "waterfall"). First the data for the `<Post>` component would be fetched and then the data for `<CommentList>` would be fetched, increasing the time it takes to show the full page.

There's also another often-overlooked downside to this approach. If `<Post>` eagerly requires (or imports) the `<CommentList>` component, our app will have to wait to show the post *body* while the code for the *comments* is downloading. We could lazily load `<CommentList>`, but then that would delay fetching comments data and increase the time to show the full page. How do we resolve this problem without compromising on the user experience?

## Render As You Fetch {#render-as-you-fetch}

The fetch-on-render approach is widely used by React apps today and can certainly be used to create great apps. But can we do even better? Let's step back and consider our goal.

In the above `<Post>` example, we'd ideally show the more important content -- the post body -- as early as possible, *without* negatively impacting the time to show the full page (including comments). Let's consider the key constraints on any solution and look at how we can achieve them:

* Showing the more important content (the post body) as early as possible means that we need to load the code and data for the view incrementally. We *don't want to block showing the post body* on the code for `<CommentList>` being downloaded, for example.
* At the same time we don't want to increase the time to show the full page including comments. So we need to *start loading the code and data for the comments* as soon as possible, ideally *in parallel* with loading the post body.

This might sound difficult to achieve -- but these constraints are actually incredibly helpful. They rule out a large number of approaches and spell out a solution for us. This brings us to the key patterns we've implemented in Relay Hooks, and that can be adapted to other data-fetching libraries. We'll look at each one in turn and then see how they add up to achieve our goal of fast, delightful loading experiences:

1. Parallel data and view trees
2. Fetch in event handlers
3. Load data incrementally
4. Treat code like data

### Parallel Data and View Trees {#parallel-data-and-view-trees}

One of the most appealing things about the fetch-on-render pattern is that it colocates *what* data a component needs with *how* to render that data. This colocation is great -- an example of how it makes sense to group code by concerns and not by technologies. All the issues we saw above were due to *when* we fetch data in this approach: upon rendering. We need to be able to fetch data *before* we've rendered the component. The only way to achieve that is by extracting the data dependencies into parallel data and view trees. 

Here's how that works in Relay Hooks. Continuing our example of a social media post with body and comments, here's how we might define it with Relay Hooks:

```javascript
// Post.js
function Post(props) {
  // Given a reference to some post - `props.post` - *what* data
  // do we need about that post?
  const postData = useFragment(graphql`
    fragment PostData on Post @refetchable(queryName: "PostQuery") {
      author
      title
      # ...  more fields ...
    }
  `, props.post);

  // Now that we have the data, how do we render it?
  return (
    <div>
      <h1>{postData.title}</h1>
      <h2>by {postData.author}</h2>
      {/* more fields  */}
    </div>
  );
}
```

Although the GraphQL is written within the component, Relay has a build step (Relay Compiler) that extracts these data-dependencies into separate files and aggregates the GraphQL for each view into a single query. So we get the benefit of colocating concerns, while at runtime having parallel data and view trees. Other frameworks could achieve a similar effect by allowing developers to define data-fetching logic in a sibling file (maybe `Post.data.js`), or perhaps integrate with a bundler to allow defining data dependencies with UI code and automatically extracting it, similar to Relay Compiler.

The key is that regardless of the technology we're using to load our data -- GraphQL, REST, etc -- we can separate *what* data to load from how and when to actually load it. But once we do that, how and when *do* we fetch our data?

### Fetch in Event Handlers {#fetch-in-event-handlers}

Imagine that we're about to navigate from a list of a user's posts to the page for a specific post. We'll need to download the code for that page -- `Post.js` -- and also fetch its data.

Waiting until we render the component has problems as we saw above. The key is to start fetching code and data for a new view *in the same event handler that triggers showing that view*. We can either fetch the data within our router -- if our router supports preloading data for routes -- or in the click event on the link that triggered the navigation. It turns out that the React Router folks are already hard at work on building APIs to support preloading data for routes. But other routing frameworks can implement this idea too. 

Conceptually, we want every route definition to include two things: what component to render and what data to preload, as a function of the route/url params. Here's what such a route definition *might* look like. This example is loosely inspired by React Router's route definitions and is *primarily intended to demonstrate the concept, not a specific API*:

```javascript
// PostRoute.js (GraphQL version)

// Relay generated query for loading Post data
import PostQuery from './__generated__/PostQuery.graphql';

const PostRoute = {
  // a matching expression for which paths to handle
  path: '/post/:id',

  // what component to render for this route
  component: React.lazy(() => import('./Post')),

  // data to load for this route, as function of the route
  // parameters
  prepare: routeParams => {
    // Relay extracts queries from components, allowing us to reference
    // the data dependencies -- data tree -- from outside.
    const postData = preloadQuery(PostQuery, {
      postId: routeParams.id,
    });

    return { postData };
  },
};

export default PostRoute;
```

Given such a definition, a router can:

* Match a URL to a route definition.
* Call the `prepare()` function to start loading that route's data. Note that `prepare()` is synchronous -- *we don't wait for the data to be ready*, since we want to start rendering more important parts of the view (like the post body) as quickly as possible.
* Pass the preloaded data to the component. If the component is ready -- the `React.lazy` dynamic import has completed -- the component will render and try to access its data. If not, `React.lazy` will suspend until the code is ready.

This approach can be generalized to other data-fetching solutions. An app that uses REST might define a route like this:

```javascript
// PostRoute.js (REST version)

// Manually written logic for loading the data for the component
import PostData from './Post.data';

const PostRoute = {
  // a matching expression for which paths to handle
  path: '/post/:id',

  // what component to render for this route
  component: React.lazy(() => import('./Post')),

  // data to load for this route, as function of the route
  // parameters
  prepare: routeParams => {
    const postData = preloadRestEndpoint(
      PostData.endpointUrl, 
      {
        postId: routeParams.id,
      },
    );
    return { postData };
  },
};

export default PostRoute;
```

This same approach can be employed not just for routing, but in other places where we show content lazily or based on user interaction. For example, a tab component could eagerly load the first tab's code and data, and then use the same pattern as above to load the code and data for other tabs in the tab-change event handler. A component that displays a modal could preload the code and data for the modal in the click handler that triggers opening the modal, and so on. 

Once we've implemented the ability to start loading code and data for a view independently, we have the option to go one step further. Consider a `<Link to={path} />` component that links to a route. If the user hovers over that link, there's a reasonable chance they'll click it. And if they press the mouse down, there's an even better chance that they'll complete the click. If we can load code and data for a view *after* the user clicks, we can also start that work *before* they click, getting a head start on preparing the view.

Best of all, we can centralize that logic in a few key places -- a router or core UI components -- and get any performance benefits automatically throughout our app. Of course preloading isn't always beneficial. It's something an application would tune based on the user's device or network speed to avoid eating up user's data plans. But the pattern here makes it easier to centralize the implementation of preloading and the decision of whether to enable it or not.

### Load Data Incrementally {#load-data-incrementally}

The above patterns -- parallel data/view trees and fetching in event handlers -- let us start loading all the data for a view earlier. But we still want to be able to show more important parts of the view without waiting for *all* of our data. At Facebook we've implemented support for this in GraphQL and Relay in the form of some new GraphQL directives (annotations that affect how/when data is delivered, but not what data). These new directives, called `@defer` and `@stream`, allow us to retrieve data incrementally. For example, consider our `<Post>` component from above. We want to show the body without waiting for the comments to be ready. We can achieve this with `@defer` and `<Suspense>`:

```javascript
// Post.js
function Post(props) {
  const postData = useFragment(graphql`
    fragment PostData on Post {
      author
      title

      # fetch data for the comments, but don't block on it being ready
      ...CommentList @defer
    }
  `, props.post);

  return (
    <div>
      <h1>{postData.title}</h1>
      <h2>by {postData.author}</h2>
      {/* @defer pairs naturally with <Suspense> to make the UI non-blocking too */}
      <Suspense fallback={<Spinner/>}>
        <CommentList post={postData} />
      </Suspense>
    </div>
  );
}
```

Here, our GraphQL server will stream back the results, first returning the `author` and `title` fields and then returning the comment data when it's ready. We wrap `<CommentList>` in a `<Suspense>` boundary so that we can render the post body before `<CommentList>` and its data are ready. This same pattern can be applied to other frameworks as well. For example, apps that call a REST API might make parallel requests to fetch the body and comments data for a post to avoid blocking on all the data being ready.

### Treat Code Like Data {#treat-code-like-data}

But there's one thing that's still missing. We've shown how to preload *data* for a route -- but what about code? The example above cheated a bit and used `React.lazy`. However, `React.lazy` is, as the name implies, *lazy*. It won't start downloading code until the lazy component is actually rendered -- it's "fetch-on-render" for code!

To solve this, the React team is considering APIs that would allow bundle splitting and eager preloading for code as well. That would allow a user to pass some form of lazy component to a router, and for the router to trigger loading the code alongside its data as early as possible.

## Putting It All Together {#putting-it-all-together}

To recap, achieving a great loading experience means that we need to **start loading code and data as early as possible, but without waiting for all of it to be ready**. Parallel data and view trees allow us to load the data for a view in parallel with loading the view (code) itself. Fetching in an event handler means we can start loading data as early as possible, and even optimistically preload a view when we have enough confidence that a user will navigate to it. Loading data incrementally allows us to load important data earlier without delaying the fetching of less important data. And treating code as data -- and preloading it with similar APIs -- allows us to load it earlier too.

## Using These Patterns {#using-these-patterns}

These patterns aren't just ideas -- we've implemented them in Relay Hooks and are using them in production throughout the new facebook.com (which is currently in beta testing). If you're interested in using or learning more about these patterns, here are some resources:

* The [React Concurrent docs](/docs/concurrent-mode-intro.html) explore how to use Concurrent Mode and Suspense and go into more detail about many of these patterns. It's a great resource to learn more about the APIs and use-cases they support.
* The [experimental release of Relay Hooks](https://relay.dev/docs/en/experimental/step-by-step) implements the patterns described here. 
* We've implemented two similar example apps that demonstrate these concepts:
  * The [Relay Hooks example app](https://github.com/relayjs/relay-examples/tree/main/issue-tracker) uses GitHub's public GraphQL API to implement a simple issue tracker app. It includes nested route support with code and data preloading. The code is fully commented -- we encourage cloning the repo, running the app locally, and exploring how it works.
  * We also have a [non-GraphQL version of the app](https://github.com/gaearon/suspense-experimental-github-demo) that demonstrates how these concepts can be applied to other data-fetching libraries.

While the APIs around Concurrent Mode and Suspense are [still experimental](/docs/concurrent-mode-adoption.html#who-is-this-experimental-release-for), we're confident that the ideas in this post are proven by practice. However, we understand that Relay and GraphQL aren't the right fit for everyone. That's ok! **We're actively exploring how to generalize these patterns to approaches such as REST,** and are exploring ideas for a more generic (ie non-GraphQL) API for composing a tree of data dependencies. In the meantime, we're excited to see what new libraries will emerge that implement the patterns described in this post to make it easier to build great, *fast* user experiences.

