---
id: cdn-links
title: CDN Links
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

هر دوی  React  و ReactDom برروی CDN در دسترس می باشند.

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

نسخه های بالا تنهای برای توسعه هستند و برای نسخه production نیاز به نسخه کم حجم شده و بهینه شده react داریم : 

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

بی بارگزاری نسخه خاصی از `react` و `react-dom`،  نسخه مورد نظر را با شماره نسخه جایگزین کنید.

### چرا استفاده از خصوصیت ؟  `crossorigin` ? {#why-the-crossorigin-attribute}

اگر ریکت را از CDN استفاده میکنید توصیه می کنیم این خصوصیت را فعال نگه دارید.
[`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)

```html
<script crossorigin src="..."></script>
```

همچنین توصیه میکنیم تا جهت تایید CDN  که استفاده میکنید این خصوصیت رو هم فعال کنید.  `Access-Control-Allow-Origin: *` HTTP header:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

این خصوصیت خطایابی بهتری در ریکت 16 و به بعد انجام میدهد. [error handling experience](/blog/2017/07/26/error-handling-in-react-16.html) 
