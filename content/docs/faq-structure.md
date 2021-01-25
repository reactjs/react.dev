---
id: faq-structure
title: File Structure
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### Is there a recommended way to structure React projects? {#is-there-a-recommended-way-to-structure-react-projects}

React doesn't have opinions on how you put files into folders. That said there are a few common approaches popular in the ecosystem you may want to consider.

#### Grouping by features or routes {#grouping-by-features-or-routes}

One common way to structure projects is to locate CSS, JS, and tests together inside folders grouped by feature or route.

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

The definition of a "feature" is not universal, and it is up to you to choose the granularity. If you can't come up with a list of top-level folders, you can ask the users of your product what major parts it consists of, and use their mental model as a blueprint.

#### Grouping by file type {#grouping-by-file-type}

Another popular way to structure projects is to group similar files together, for example:

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Some people also prefer to go further, and separate components into different folders depending on their role in the application. For example, [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) is a design methodology built on this principle. Remember that it's often more productive to treat such methodologies as helpful examples rather than strict rules to follow.

#### Avoid too much nesting {#avoid-too-much-nesting}

There are many pain points associated with deep directory nesting in JavaScript projects. It becomes harder to write relative imports between them, or to update those imports when the files are moved. Unless you have a very compelling reason to use a deep folder structure, consider limiting yourself to a maximum of three or four nested folders within a single project. Of course, this is only a recommendation, and it may not be relevant to your project.

#### Don't overthink it {#dont-overthink-it}

If you're just starting a project, [don't spend more than five minutes](https://en.wikipedia.org/wiki/Analysis_paralysis) on choosing a file structure. Pick any of the above approaches (or come up with your own) and start writing code! You'll likely want to rethink it anyway after you've written some real code.

If you feel completely stuck, start by keeping all files in a single folder. Eventually it will grow large enough that you will want to separate some files from the rest. By that time you'll have enough knowledge to tell which files you edit together most often. In general, it is a good idea to keep files that often change together close to each other. This principle is called "colocation".

As projects grow larger, they often use a mix of both of the above approaches in practice. So choosing the "right" one in the beginning isn't very important.
