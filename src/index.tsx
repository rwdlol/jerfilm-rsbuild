import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App';
import './index.css';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <ReactLenis root />
        <App />
      </HashRouter>
    </React.StrictMode>,
  );
}
