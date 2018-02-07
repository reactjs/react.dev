import React from 'react';

// highlight-next-line
const {StrictMode} = React;

function ExampleApplication() {
  return (
    <div>
      <Header />
      {/* highlight-next-line */}
      <StrictMode>
        <>
          <RouteOne />
          <RouteTwo />
        </>
        {/* highlight-next-line */}
      </StrictMode>
      <Footer />
    </div>
  );
}
