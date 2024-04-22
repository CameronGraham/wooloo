import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';

import { HomePage } from 'pages/Home';
import { Movie } from 'pages/Movie';

import * as Sentry from "@sentry/react";

// Initialize Sentry
Sentry.init({
  dsn: 'https://c431b86b4e2edb328f49718e83570f10@o4507129654607872.ingest.de.sentry.io/4507129656901712',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, 
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/:movieId',
        element: <Movie />,
      },
    ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('root')
);