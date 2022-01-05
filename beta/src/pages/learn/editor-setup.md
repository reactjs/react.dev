---
title: Editor Setup
---

<Intro>

A properly configured editor can make code clearer to read and faster to write. It can even help you catch bugs as your write them! If this is your first time setting up an editor or you're looking to tune up your current editor, we have a few recommendations.

</Intro>

## Your editor {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) is one of the most popular editors in use today. It has a large marketplace of extensions and integrates well with popular services like GitHub. Most of the features listed below can be added to VS Code as extensions as well, making it highly configurable!

Other popular text editors used in the React community include:

* [WebStorm](https://www.jetbrains.com/webstorm/)—an integrated development environment designed specifically for JavaScript.
* [Sublime Text](https://www.sublimetext.com/)—has support for JSX and TypeScript, syntax highlighting and autocomplete built in.
* [Vim](https://www.vim.org/)—a highly configurable text editor built to make creating and changing any kind of text very efficient. It is included as "vi" with most UNIX systems and with Apple OS X.

## Recommended text editor features {/*recommended-text-editor-features*/}

Some editors come with these features built in, but others might require adding an extension. Check to see what support your editor of choice provides to be sure!

### Linting {/*linting*/}

Code linters find problems in your code as you write, helping you fix them early. [ESLint](https://eslint.org/) is a popular, open source linter for JavaScript. 

* [Install ESLint with the recommended configuration for React](https://www.npmjs.com/package/eslint-config-react-app) (be sure you have [Node installed!](https://nodejs.org/en/download/current/))
* [Integrate ESLint in VSCode with the official extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Formatting {/*formatting*/}

The last thing you want to do when sharing your code with another contributor is get into an discussion about [tabs vs spaces](https://www.google.com/search?q=tabs+vs+spaces)! Fortunately, [Prettier](https://prettier.io/) will clean up your code by reformatting it to conform to preset, configurable rules. Run Prettier, and all your tabs will be converted to spaces—and your indentation, quotes, etc will also all be changed to conform to the configuration. In the ideal setup, Prettier will run when you save your file, quickly making these edits for you.

You can install the [Prettier extension in VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) by following these steps:

1. Launch VS Code
2. Use Quick Open (press `CTRL/CMD + P`)
3. Paste in `ext install esbenp.prettier-vscode`
4. Press enter

#### Formatting on save {/*formatting-on-save*/}

Ideally, you should format your code on every save. VS Code has settings for this!

1. In VS Code, press `CTRL/CMD + SHIFT + P`.
2. Type "settings"
3. Hit enter
4. In the search bar, type "format on save"
5. Be sure the "format on save" option is ticked!

> Prettier can sometimes conflict with other linters. But there's usually a way to get them to run nicely together. For instance, if you're using Prettier with ESLint, you can use [eslint-prettier](https://github.com/prettier/eslint-plugin-prettier) plugin to run prettier as an ESLint rule.
