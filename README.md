# react.dev

This repo contains the source code and documentation powering [react.dev](https://react.dev/).

## Getting started

### Prerequisites

1. Git
1. Node.js 24.x (LTS), matching [`.nvmrc`](./.nvmrc) and CI
1. Yarn Classic 1.22.22: See the [installation instructions](https://classic.yarnpkg.com/en/docs/install/)

### Installation

1. [Fork the repo](https://github.com/reactjs/react.dev/fork), then clone your fork. Replace `YOUR_USERNAME` with your GitHub username:

   ```bash
   git clone https://github.com/YOUR_USERNAME/react.dev.git
   cd react.dev
   git remote add upstream https://github.com/reactjs/react.dev.git
   ```

1. `yarn install --frozen-lockfile` to install the website's dependencies

### Running locally

1. `yarn dev` to start the development server (powered by [Next.js](https://nextjs.org/))
1. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

### Guidelines

The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/react.dev/blob/main/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.

### Create a branch

1. `git checkout main` from any folder in your local `react.dev` repository
1. `git fetch upstream` to get the latest changes from the source repo
1. `git merge --ff-only upstream/main` to update your local `main`
1. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch

### Make the change

1. Follow the ["Running locally"](#running-locally) instructions
1. Save the files and check in the browser
   1. Changes to React components in `src` will hot-reload
   1. Changes to Markdown files in `src/content` will hot-reload
   1. If changes to MDX plugins aren't reflected, stop the server, remove `node_modules/.cache/react-docs-mdx`, and restart it

### Test the change

1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
1. Run `yarn ci-check` to run the same checks as CI: formatting, ESLint, local ESLint rule tests, TypeScript, heading IDs, RSS generation, and internal links.
1. To apply formatting and ESLint fixes, run `yarn check-all`. This command modifies files and also checks types and generates RSS. Review the resulting changes before committing.

### Push it

1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fix header logo on Android`) to stage and commit your changes
1. `git push -u origin the-name-of-my-branch` to push the branch to your fork
1. Go to the [react.dev repo](https://github.com/reactjs/react.dev) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. If possible, include screenshots of visual changes. A preview build is triggered after your changes are pushed to GitHub.

## Translation

If you are interested in translating `react.dev`, see the [translation guide](https://react.dev/community/translations) and [current translation progress](https://translations.react.dev/).

## License
Content submitted to [react.dev](https://react.dev/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md) file.
