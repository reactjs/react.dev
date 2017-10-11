import React from 'react';
import ReactDOM from 'react-dom';

import Parent from './Parent';
import './index.css';

// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');

ReactDOM.render(<Parent />, appRoot);
