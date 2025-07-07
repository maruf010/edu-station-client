import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import DashBoardLayout from "../layouts/DashBoardLayout";
import AllClasses from "../pages/AllClasses/AllClasses";
import ApplyTeacher from "../pages/ApplyTeacher/ApplyTeacher";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/allClasses',
                Component: AllClasses
            },
            {
                path: '/teach',
                Component: ApplyTeacher
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: '/login',
                Component: Login
            },
            {
                path: '/register',
                Component: Register
            }
        ]
    },
    {
        path: '/dashboard',
        element: DashBoardLayout,
    }
]);