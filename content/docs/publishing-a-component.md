---
id: publishing-a-component
title: Publishing a Component
permalink: docs/publishing-a-component.html
---

A [React component](/docs/components-and-props.html) can be published so that it is reusable and shareable. This guide will show you the necessary steps and offer a few recommendations to publish your own React component.

### Assumptions

The instructions in this guide assume you have [Node](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/lang/en/docs/install/), and [Git](https://git-scm.com/downloads) installed.
You should know [how to create a repository on GitHub and commit changes to it](https://help.github.com/articles/create-a-repo/).
You should also have basic proficiency in Node, Yarn, Git, GitHub, JavaScript and React.

## Create

We will use and expand upon the `Welcome` React component that was introduced in the [Components and Props](/docs/components-and-props.html) quick start section of the docs.

First, we will create a new repository for our project on GitHub by going to [https://github.com/new](https://github.com/new). We will enter a repository name for our component, a description, select `Initialize this repository with a README`, choose `Node` from the `Add .gitignore` dropdown menu and choose a license from the `Add a license` drop down menu. We will use the `MIT` license for this component. Click `Create Repository` to finish.

Next, we will copy the location of our newly created remote repository and clone it to our local system:
```bash
git clone git@github.com:mateoholman/react-welcome-user.git
```

Then, we will create a `package.json` file. We will be using [Yarn](https://yarnpkg.com/lang/en/docs/install/) as our package manager and will initialize our project with a `package.json` by executing the following command:

```bash
yarn init
```

This command walks through several steps to create our package.json file. Yarn also has several [other configuration commands and options](https://yarnpkg.com/en/docs/cli/init).

After we create our package.json file, we will save the current changes to our project:

```bash
git add -A
```
Stage the changes to be committed to our remote repository:
```bash
git commit -m "Initial commit"
```

 and make our initial commit to GitHub.
 ```bash
 git push -u origin master
 ```

 Next, we will install our primary dependencies, React and prop-types.
 ```bash
 yarn add react prop-types
 ```

 We will be using ES6 in our code, but will want to transpile it to ES5 for broader use in other projects. Let's create a `/src` for our ES6 source and a `/dist` directory to hold our transpiled files. After creating the two directories, we will create `/src/index.js` to hold the source code of our React component:

 ``` javascript
 import React from 'react';
 import PropTypes from 'prop-types';

 const Welcome = props => {
   return <h1>Welcome {props.user}!</h1>;
 };

 Welcome.defaultProps = {
   user: 'User'
 };

 Welcome.propTypes = {
   user: PropTypes.string.isRequired
 };

 export default Welcome;
 ```

 Our component is a stateless functional component that will render a welcome message to whatever user is passed through props. Please refer to the [Components and Props](https://facebook.github.io/react/docs/components-and-props.html) section of the docs for more information on stateless functional components.

It is a best practice not to force our users to pass any props to our component in order to use it. The defaultProps will be used to ensure props.user has a value if none is specified. We will use the `prop-types` package to typecheck any props being passed to our component.  Please refer to the [Typechecking with propTypes](/docs/typechecking-with-proptypes.html#proptypes) section of the docs for more information about Typechecking and default props.

Now we are ready to move on to the build.

## Build

We used several [ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_support_in_Mozilla) features in our component code. Although ES6 is becoming widely supported, it is best practice to compile our code to [ES5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_5_support_in_Mozilla) for broader support. We will be using [Babel](https://babeljs.io/), several Babel [presets](http://babeljs.io/docs/plugins), [babel-loader](https://github.com/babel/babel-loader) and [Webpack](https://webpack.js.org/) to transpile and bundle our code for publishing.

First, we will install all the dependencies that will allow us to compile our code to ES5:

``` bash
yarn add --dev babel-core babel-preset-env babel-preset-react babel-loader webpack path
```

Next, we will create a `.babelrc` file to store our presets:

```
{
  "presets": ["env", "react"]
}
```

Then, we will create a `webpack.config.js` file to store our webpack configuration options:

``` javascript
const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'Welcome'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        include: APP_DIR,
        options: {
          presets: ['env', 'react']
        }
      }
    ]
  }
};
```

For more information on the webpack configuration, please refer to the [webpack configuration docs](https://webpack.js.org/concepts/configuration/).

Next, we will add a "build" script to transpile our code with webpack. We will add the following to the "scripts" section of our `package.json` file:

``` javascript
"build": "webpack"
```

Now that we have setup our build, let's generate the build file with the following command:

``` bash
yarn build
```

After running the build, our transpiled code should be available in the `/dist` directory.

## Test

Testing is not required, but is another best practice if you are publishing your component for others to use on their projects.

We will use [Jest](https://facebook.github.io/jest/), [Enzyme](http://airbnb.io/enzyme/), [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest), [enzyme-adapter-react-16](), [react-dom](), and [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) for test coverage.

We will add our new dependencies to our `package.json` with the following command:

```bash
yarn add --dev jest enzyme babel-jest enzyme-adapter-react-16 react-dom react-test-renderer
```

Next, we will add a "test" script and configure Jest to run with Enzyme within our `package.json`:
``` javascript
"scripts": {
   "test": "jest",
   "build": "webpack"
},
"jest": {
  "setupTestFrameworkScriptFile": "./enzymeSetup.js"
}
```

Then we will create our [Enzyme setup file](http://airbnb.io/enzyme/docs/installation/), which is required when working with React 16. We will create a new file called `enzymeSetup.js` and add the following code:

``` javascript
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

Next, we will add some minimal test coverage to both our source and distribution component. Create an `index.test.js` file and add the following code:

``` javascript
import React from 'react';
import { shallow, render } from 'enzyme';
import Welcome from './src/index';
import WelcomeDist from './dist/index';

describe('Welcome', () => {
  describe('when rendered', () => {
    it('should not throw an error', () => {
      const wrapper = shallow(<Welcome />);
      expect(wrapper.length).toBe(1);
    });

    it('should render "Welcome User!" when no props are passed', () => {
      expect(render(<Welcome />).text()).toBe('Welcome User!');
    });

    it('should render "Welcome Matt!" when "Matt" is passed as a user prop', () => {
      expect(render(<Welcome user={'Matt'} />).text()).toBe('Welcome Matt!');
    });
  });
});

describe('WelcomeDist', () => {
  describe('when rendered', () => {
    it('should not throw an error', () => {
      const wrapper = shallow(<WelcomeDist />);
      expect(wrapper.length).toBe(1);
    });

    it('should render "Welcome User!" when no props are passed', () => {
      expect(render(<WelcomeDist />).text()).toBe('Welcome User!');
    });

    it('should render "Welcome Matt!" when "Matt" is passed as a user prop', () => {
      expect(render(<WelcomeDist user={'Matt'} />).text()).toBe(
        'Welcome Matt!'
      );
    });
  });
});
```

We can then run our test from the command line with:
```bash
yarn test
```

## Document

Although not required, it is a best practice to add documentation to our React component because we are publishing it. At the very least we should edit our current `Readme.md` file and add some wording that informs other potential users what the Welcome component is and how they can use it in their projects. After editing our `Readme.md` we will be ready to publish.

## Publish

Let's finally publish our React component to the npm registry!

First, we will need to sign up on [npmjs](https://npmjs.com/signup).

After we have set up our account on the npm registry, we will use npm to locally store our credentials:

```bash
npm login
```

It will prompt us for our `username`, `password` and `e-mail`.

Before we publish, we need to make sure that `package.json` lists our "main" as `./dist/index.js` so that we are publishing the transpiled component. We also want to check the npm registry to make sure that someone else has not already published a package with the same name.

Next, we will issue the command to publish our React component. Once a package is published, you can never modify that specific version, so take care before publishing!

```bash
npm publish
```
Our React component has now been published under the name we specified in our `package.json` which in the case for our component is `react-welcome-user`.

We can go to https://npmjs.com/package/react-welcome-user to make sure the package was successfully published.

Now we can simply install our package and consume it in any other react project by importing it.

``` javascript
import Welcome from 'react-welcome-user';
```

Congratulations, you have published a React component!

## Final Results

Our final `package.json`:
``` javascript
{
  "name": "react-welcome-user",
  "version": "1.0.4",
  "description": "A simple React welcome component",
  "main": "./dist/index.js",
  "repository": "git@github.com:mateoholman/react-welcome-user.git",
  "author": "Matthew Holman <mateoholman@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "prop-types": "^15.6.0",
    "react": "^16.0.0"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-jest": "^21.2.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "babel-preset-react": "^6.24.1",
    "enzyme": "^3.1.0",
    "enzyme-adapter-react-16": "^1.0.2",
    "jest": "^21.2.1",
    "path": "^0.12.7",
    "react-dom": "^16.0.0",
    "react-test-renderer": "^16.0.0",
    "webpack": "^3.8.1"
  },
  "jest": {
    "setupTestFrameworkScriptFile": "./enzymeSetup.js"
  },
  "scripts": {
    "test": "jest",
    "build": "webpack"
  }
}
```
Our final `webpack.config.js`:

``` javascript
const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'Welcome'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        include: APP_DIR,
        options: {
          presets: ['env', 'react']
        }
      }
    ]
  }
};
```

Our final `/src/index.js`:
``` javascript
import React from 'react';
import PropTypes from 'prop-types';

const Welcome = props => {
  return <h1>Welcome {props.user}!</h1>;
};

Welcome.defaultProps = {
  user: 'User'
};

Welcome.propTypes = {
  user: PropTypes.string.isRequired
};

export default Welcome;
```
Our final `index.test.js`:
``` javascript
import React from 'react';
import { shallow, render } from 'enzyme';
import Welcome from './src/index';
import WelcomeDist from './dist/index';

describe('Welcome', () => {
  describe('when rendered', () => {
    it('should not throw an error', () => {
      const wrapper = shallow(<Welcome />);
      expect(wrapper.length).toBe(1);
    });

    it('should render "Welcome User!" when no props are passed', () => {
      expect(render(<Welcome />).text()).toBe('Welcome User!');
    });

    it('should render "Welcome Matt!" when "Matt" is passed as a user prop', () => {
      expect(render(<Welcome user={'Matt'} />).text()).toBe('Welcome Matt!');
    });
  });
});

describe('WelcomeDist', () => {
  describe('when rendered', () => {
    it('should not throw an error', () => {
      const wrapper = shallow(<WelcomeDist />);
      expect(wrapper.length).toBe(1);
    });

    it('should render "Welcome User!" when no props are passed', () => {
      expect(render(<WelcomeDist />).text()).toBe('Welcome User!');
    });

    it('should render "Welcome Matt!" when "Matt" is passed as a user prop', () => {
      expect(render(<WelcomeDist user={'Matt'} />).text()).toBe(
        'Welcome Matt!'
      );
    });
  });
});
```

Our final `enzymeSetup.js`:
``` javascript
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

Our final `.babelrc`:

``` javascript
{
  "presets": ["env", "react"]
}
```
