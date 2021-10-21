/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/**
 * Ported from gatsby-plugin-twitter
 * https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-twitter
 */
import * as React from 'react';

const injectTwitterScript = function injectTwitterScript() {
  function addJS(jsCode: any) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.innerText = jsCode;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  addJS(
    '\n    window.twttr = (function(d, s, id) {\n      var js,\n        fjs = d.getElementsByTagName(s)[0],\n        t = window.twttr || {};\n      if (d.getElementById(id)) return t;\n      js = d.createElement(s);\n      js.id = id;\n      js.src = "https://platform.twitter.com/widgets.js";\n      fjs.parentNode.insertBefore(js, fjs);\n      t._e = [];\n      t.ready = function(f) {\n        t._e.push(f);\n      };\n      return t;\n    })(document, "script", "twitter-wjs");\n  '
  );
};

let injectedTwitterScript = false;
const embedClasses = [
  '.twitter-tweet',
  '.twitter-timeline',
  '.twitter-follow-button',
  '.twitter-share-button',
].join(',');

export function useTwitter() {
  React.useEffect(() => {
    if (document.querySelector(embedClasses) !== null) {
      if (!injectedTwitterScript) {
        injectTwitterScript();
        injectedTwitterScript = true;
      }

      if (
        typeof (window as any).twttr !== 'undefined' &&
        (window as any).twttr.widgets &&
        typeof (window as any).twttr.widgets.load === 'function'
      ) {
        (window as any).twttr.widgets.load();
      }
    }
  }, []);
}
