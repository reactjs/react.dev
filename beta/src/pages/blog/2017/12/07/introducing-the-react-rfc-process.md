---
title: 'Introducing the React RFC Process'
author: [acdlite]
---

We're adopting an RFC ("request for comments") process for contributing ideas to React.

Inspired by [Yarn](https://github.com/yarnpkg/rfcs), [Ember](https://github.com/emberjs/rfcs), and [Rust](https://github.com/rust-lang/rfcs), the goal is to allow React core team members and community members to collaborate on the design of new features. It's also intended to provide a clear path for ideas to enter the project:

- Create an RFC document detailing your proposal.
- Submit a PR to the [RFC repository](https://github.com/reactjs/rfcs).
- Incorporate feedback into the proposal.
- After discussion, the core team may or may not accept the RFC.
- If the RFC is accepted, the PR is merged.

RFCs are accepted when they are approved for implementation in React. A more thorough description of the process is available in the repository's [README](https://github.com/reactjs/rfcs/blob/master/README.md). The exact details may be refined in the future.

## Who Can Submit RFCs? {/*who-can-submit-rfcs*/}

Anyone! No knowledge of React's internals is required, nor are you expected to implement the proposal yourself.

As with our other repositories, we do ask that you complete a [Contributor License Agreement](https://github.com/reactjs/rfcs#contributor-license-agreement-cla) before we can accept your PR.

## What Types of Changes Should Be Submitted As RFCs? {/*what-types-of-changes-should-be-submitted-as-rfcs*/}

Generally, any idea that would benefit from additional review or design before being implemented is a good candidate for an RFC. As a rule of thumb, this means any proposal that adds, changes, or removes a React API.

Not every change must go through the RFC process. Bug fixes or performance improvements that don't touch the API can be submitted directly to the main library.

We now have several repositories where you can submit contributions to React:

- **Issues, bugfixes, and code changes to the main library**: [facebook/react](https://github.com/facebook/react)
- **Website and documentation**: [reactjs/reactjs.org](https://github.com/reactjs/reactjs.org)
- **Ideas for changes that need additional review before being implemented**: [reactjs/rfcs](https://github.com/reactjs/rfcs)

## RFC for A New Context API {/*rfc-for-a-new-context-api*/}

Coinciding with the launch of our RFC process, we've submitted a [proposal for a new version of context](https://github.com/reactjs/rfcs/pull/2). The proposal has already received many valuable comments from the community that we will incorporate into the design of the new API.

The context PR is a good example of how a typical RFC should be structured. We're excited to start receiving your proposals!
