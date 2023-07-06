# Notes:

## TODO: Deciding between using `rtl-detect` or manually setting `isRTL` prop in `siteConfig.js`.

1. Manully: 
```js
exports.siteConfig = {
  // ...
  languageCode: 'ar',
  isRTL: true,
  // ...
};
```

2. Using `rtl-detect`:
```js
const siteConfig = {
  // ...
  languageCode: 'ar',
  hasLegacySite: true,
  isRTL: false, // Do NOT ever set this to true. It is deprecated.
  // ...
};

const rtlDetect = require('rtl-detect');
siteConfig.isRTL = rtlDetect.isRtlLang(siteConfig.languageCode);

exports.siteConfig = siteConfig;
```