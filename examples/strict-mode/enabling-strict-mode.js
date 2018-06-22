import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      {/* highlight-next-line */}
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
        {/* highlight-next-line */}
      </React.StrictMode>
      <Footer />
    </div>
  );
}
