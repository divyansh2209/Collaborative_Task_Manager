import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import RootLayout from '../layout/RootLayout';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <PrivateRoute>
                <RootLayout />
            </PrivateRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <Login />
        )
    },
    {
        path: "/signup",
        element: <Signup />,
    },
]);

export default router