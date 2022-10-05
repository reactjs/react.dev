# Test {/*test*/}

Mussum Ipsum, cacilds vidis litro abertis.

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

Praesent malesuada urna nisi, quis volutpat erat hendrerit non. Nam vulputate dapibus.Tá deprimidis, eu conheço uma cachacis que pode alegrar sua vidis.Em pé sem cair, deitado sem dormir, sentado sem cochilar e fazendo pose.A ordem dos tratores não altera o pão duris.

<Sandpack>





```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>