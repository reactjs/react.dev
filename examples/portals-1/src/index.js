import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './index.css';

// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');

ReactDOM.render(<App />, appRoot);
