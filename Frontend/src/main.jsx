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
import ManageUsers from './Components/Dashboard/Admin/ManageUsers';
import SendMoney from './Components/Dashboard/User/SendMoney';
import SendAmount from './Components/Dashboard/User/SendAmount';
import CheckPassword from './Components/CheckPassword';
import CashOut from './Components/Dashboard/User/CashOut';
import CashOutAmount from './Components/Dashboard/User/CashOutAmount';
import CashoutPinCheck from './Components/Dashboard/User/CashoutPinCheck';
import CashIn from './Components/Dashboard/User/CashIn';
import CashInAmount from './Components/Dashboard/User/CashInAmount';
import UserTransaction from './Components/Dashboard/User/UserTransaction';




const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>
      },
      {
        path: "/manageUsers",
        element: <ManageUsers></ManageUsers>
      },
      {
        path: "/sendMoney",
        element: <SendMoney></SendMoney>
      },
      {
        path: "/sendAmount/:id",
        element: <SendAmount></SendAmount>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_BACKEND_URL}/sendAmount/${params.id}`)
      },
      {
        path: "/checkPassword",
        element: <CheckPassword></CheckPassword>
      },
      {
        path: "/cashOut",
        element: <CashOut></CashOut>,
      },
      {
        path: '/cashoutPinCheck',
        element: <CashoutPinCheck></CashoutPinCheck>
      },
      {
        path: '/cashOutAmount/:id',
        element: <CashOutAmount></CashOutAmount>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_BACKEND_URL}/cashOutAmount/${params.id}`)
      },
      {
        path: "/cashIn",
        element: <CashIn></CashIn>
      },
      {
        path: "/cashInAmount/:id",
        element: <CashInAmount></CashInAmount>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_BACKEND_URL}/cashInAmount/${params.id}`)
      },
      {
        path: "/userTransaction",
        element: <UserTransaction></UserTransaction>
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
