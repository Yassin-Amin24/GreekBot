import React from 'react';
import ReactDOM from 'react-dom/client';
import './styling.css';
import Chatapp from './Chatapp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Chatapp />
  </React.StrictMode>
);
