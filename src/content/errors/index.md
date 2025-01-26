<Intro>

In the minified production build of React, we avoid sending down full error messages in order to reduce the number of bytes sent over the wire.

</Intro>


We highly recommend using the development build locally when debugging your app since it tracks additional debug info and provides helpful warnings about potential problems in your apps, but if you encounter an exception while using the production build, the error message will include just a link to the docs for the error.

For an example, see: [https://react.dev/errors/149](/errors/421).
