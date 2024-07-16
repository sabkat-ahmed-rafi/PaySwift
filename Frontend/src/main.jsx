import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Root from './Root/Root';
import Dashboard from './Components/Dashboard/Dashboard';
import Register from './Authentication/Register';
import Login from './Authentication/Login';
import Authentication from './Authentication/Authentication';
import { Toaster } from 'react-hot-toast';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'




const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>
      }
    ]
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/login",
    element: <Login/>
  }
]);




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider  client={queryClient}>   
    <Authentication>
    <Toaster />
    <RouterProvider router={router} />
    </Authentication>
    </QueryClientProvider>
  </React.StrictMode>
)
