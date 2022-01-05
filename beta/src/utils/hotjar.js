/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

export function hotjar(id, sv) {
  (function (h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = {hjid: id, hjsv: sv};
    h._scriptPath = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    if (!document.querySelector('script[src*="' + h._scriptPath + '"]')) {
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = h._scriptPath;
      a.appendChild(r);
    }
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
}
