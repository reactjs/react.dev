import React from 'react';
import ReactDOM from 'react-dom';

import Clock from './Clock';

function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
