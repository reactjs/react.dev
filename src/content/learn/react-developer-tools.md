---
title: React Developer Tools
---

<Intro>

Use React Developer Tools to inspect React [components](/learn/your-first-component), edit [props](/learn/passing-props-to-a-component) and [state](/learn/state-a-components-memory), and identify performance problems.

</Intro>

<YouWillLearn>

* How to install React Developer Tools

</YouWillLearn>

## Browser extension {/*browser-extension*/}

The easiest way to debug websites built with React is to install the React Developer Tools browser extension. It is available for several popular browsers:

* [Install for **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Install for **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Install for **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Now, if you visit a website **built with React,** you will see the _Components_ and _Profiler_ panels.

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Troubleshooting the browser extension {/*troubleshooting-browser-extension*/}

If the dev tools do not recognize your application, here are some steps you can try:

- Make Sure You Have a React Project: Ensure that you indeed have a React application running on localhost. React DevTools only work on applications that use React.

- Update React DevTools: Make sure you have updated React DevTools to the latest version. Go to the Chrome Web Store, search for `React Developer Tools`, and update the extension if necessary.

- Update Chrome: Ensure that you are running the latest version of Google Chrome. Go to `chrome://settings/help` to check for updates and install them if available.

- Disable Other Extensions: Some Chrome extensions can interfere with React DevTools and cause issues. Disable other extensions you have to see if the problem persists.

- Try Incognito Mode: Try running your application in Chrome's incognito mode. Sometimes, unusual extensions or settings can cause issues.

- Disable Cache: Open DevTools by right-clicking and selecting "Inspect" on your application in Chrome. Then, open the "Network" tab and check the "Disable cache" option. Refresh the page and see if React DevTools start working.

- Check Console for Errors: Open Chrome DevTools (`Ctrl + Shift + J` or `Cmd + Option + J` on Mac), then check the "Console" tab to see if there are any errors related to React DevTools.

- Check for Variable Name Conflicts: Ensure you are not using variables or names that clash with those used by React DevTools in your code, as this can cause conflicts.

- Clear Cache and Cookies: Try clearing the cache and cookies for your localhost website and refresh the page.

- Reinstall React DevTools: If none of the above steps work, you may need to try uninstalling and reinstalling React DevTools.

### Safari and other browsers {/*safari-and-other-browsers*/}
For other browsers (for example, Safari), install the [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm package:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Next open the developer tools from the terminal:
```bash
react-devtools
```

Then connect your website by adding the following `<script>` tag to the beginning of your website's `<head>`:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Reload your website in the browser now to view it in developer tools.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}
React Developer Tools can be used to inspect apps built with [React Native](https://reactnative.dev/) as well.

The easiest way to use React Developer Tools is to install it globally:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Next open the developer tools from the terminal.
```bash
react-devtools
```

It should connect to any local React Native app that's running.

> Try reloading the app if developer tools doesn't connect after a few seconds.

[Learn more about debugging React Native.](https://reactnative.dev/docs/debugging)
