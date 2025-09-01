import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import HomePage from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ErrorPage from './Pages/ErrorPage';
import ProtectedRoute from './Components/ProtectedRoute';
import { OrbitProgress } from 'react-loading-indicators';
import Features from './Pages/Features';

const LazyChatbot = React.lazy(() => import('./Pages/Chatbot'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/chatbot/features', element: <Features /> },
      {
        path: '/chatbot',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: (
              <Suspense
                fallback={
                  <div className="loader-container">
                    <div className="loader-content">
                      <OrbitProgress variant="dotted" color="black" size="large" />
                      <p className="loader-text">Loading your experience...</p>
                    </div>
                  </div>
                }>
                <LazyChatbot />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
