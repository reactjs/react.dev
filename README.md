# reactjs.org

This repo contains the source code and documentation powering [reactjs.org](https://reactjs.org/).

## Getting started

### Prerequisites

1. Git
2. Node: any 12.x version starting with v12.0.0 or greater.
3. Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/).
4. A fork of the repo (for any contributions).
5. A clone of the [reactjs.org repo](https://github.com/reactjs/reactjs.org) on your local machine.

### Installation

1. `cd reactjs.org` to go into the project root.
2. `yarn` to install the website's npm dependencies.

### Running locally

1. `yarn dev` to start the hot-reloading development server (powered by [Gatsby](https://www.gatsbyjs.org)).
2. `open http://localhost:8000` to open the site in your favorite browser.

## Contributing

### Guidelines

The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/reactjs.org/blob/master/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.

### Create a branch

1. `git checkout master` from any folder in your local `reactjs.org` repository.
2. `git pull origin master` to ensure you have the latest main code.
3. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch.

### Make the change

1. Follow the ["Running locally"](#running-locally) instructions.
2. Save the files and check in the browser.
  2.1. Changes to React components in `src` will hot-reload.
  2.2. Changes to markdown files in `content` will hot-reload.
  2.3. If working with plugins, you may need to remove the `.cache` directory and restart the server.

### Test the change

1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
2. Run `yarn check-all` from the project root. (This will run Prettier, ESLint, and Flow.)

### Push it

1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fix header logo on Android`) to stage and commit your changes.
2. `git push my-fork-name the-name-of-my-branch`
3. Go to the [reactjs.org repo](https://github.com/reactjs/reactjs.org) and you should see recently pushed branches.
4. Follow GitHub's instructions.
5. If possible, include screenshots of visual changes. A Netlify build will also be automatically created once you make your PR so other people can see your change.

## Translation

If you are interested in translating `reactjs.org`, please see the current translation efforts at [isreacttranslatedyet.com](https://www.isreacttranslatedyet.com/).


If your language does not have a translation and you would like to create one, please follow the instructions at [reactjs.org Translations](https://github.com/reactjs/reactjs.org-translation#translating-reactjsorg).

## Troubleshooting

- `yarn reset` to clear the local cache

## License
Content submitted to [reactjs.org](https://reactjs.org/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md) file.
