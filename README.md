# react.dev

This repository contains the source code and documentation that powers [react.dev](https://react.dev/).

## Getting Started

### Prerequisites

1. Git
2. Node: Any version 12.x starting with v12.0.0 or greater
3. Yarn: Refer to the [Yarn website](https://yarnpkg.com/lang/en/docs/install/) for installation instructions
4. A fork of the repository (for any contributions)
5. A clone of the [react.dev repository](https://github.com/reactjs/react.dev) on your local machine

### Installation

1. Run `cd react.dev` to navigate to the project root
2. Run `yarn` to install the website's npm dependencies

### Running Locally

1. Run `yarn dev` to start the development server (powered by [Next.js](https://nextjs.org/))
2. Open http://localhost:3000 to view the site in your preferred browser

## Contributing

### Guidelines

The documentation is divided into several sections with different tones and purposes. If you plan to write more than a few sentences, it might be helpful to familiarize yourself with the [contributing guidelines](https://github.com/reactjs/react.dev/blob/main/CONTRIBUTING.md#guidelines-for-text) for the relevant sections.

### Create a Branch

1. Run `git checkout main` from any folder in your local `react.dev` repository
2. Run `git pull origin main` to ensure you have the latest main code
3. Run `git checkout -b the-name-of-my-branch` (replace `the-name-of-my-branch` with a suitable name) to create a branch

### Make the Change

1. Follow the ["Running Locally"](#running-locally) instructions
2. Save the files and check in the browser
   1. Changes to React components in `src` will hot-reload
   2. Changes to markdown files in `content` will hot-reload
   3. If working with plugins, you may need to remove the `.cache` directory and restart the server

### Test the Change

1. If possible, test any visual changes in all the latest versions of common browsers, on both desktop and mobile.
2. Run `yarn check-all`. (This will run Prettier, ESLint, and validate types.)

### Push It

1. Run `git add -A && git commit -m "My message"` (replace `My message` with a commit message, such as `Fix header logo on Android`) to stage and commit your changes
2. Run `git push my-fork-name the-name-of-my-branch`
3. Go to the [react.dev repository](https://github.com/reactjs/react.dev), and you should see the recently pushed branches.
4. Follow GitHub's instructions.
5. If possible, include screenshots of visual changes. A preview build is triggered after your changes are pushed to GitHub.

## Translation

If you are interested in translating `react.dev`, please refer to the current translation efforts [here](https://github.com/reactjs/react.dev/issues/4135).

## License

Content submitted to [react.dev](https://react.dev/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md) file.