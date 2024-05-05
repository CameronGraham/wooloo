import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, createRoutesFromChildren, matchRoutes, RouterProvider, useLocation, useNavigationType } from 'react-router-dom';
import './index.css';
import App from './App';

import { HomePage } from 'pages/Home';
import { Movie } from 'pages/Movie';

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://767bc03de8f93f21d7e873fafa3a62a4@o4507129654607872.ingest.de.sentry.io/4507203035005008",
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
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