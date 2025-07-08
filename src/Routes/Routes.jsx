import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import AllClasses from "../pages/AllClasses/AllClasses";
import ApplyTeacher from "../pages/ApplyTeacher/ApplyTeacher";
import Profile from "../pages/Profile/Profile";
import UpdateProfile from "../pages/Profile/UpdateProfile";
import PrivateRoute from "./PrivateRoute";
import DashBoardLayout from "../layouts/DashBoardLayout";
import DashBoardHome from "../pages/Dashboard/DashBoardHome";
import MyEnrollClass from "../pages/Dashboard/Student/MyEnrollClass";
import MyClass from "../pages/Dashboard/Teacher/MyClass";
import AddClass from "../pages/Dashboard/Teacher/AddClass";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import ForgetPassword from "../pages/Authentication/ForgetPassword";
import TeacherRequests from "../pages/Dashboard/Admin/TeacherRequests";
import ActiveTeacher from "../pages/Dashboard/Admin/ActiveTeacher";
import MakeAdmin from "../pages/Dashboard/Admin/MakeAdmin";



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
            },

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
            },
            {
                path: '/forget-password',
                Component: ForgetPassword
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashBoardLayout></DashBoardLayout>
        </PrivateRoute>,
        children: [
            {
                index: true,
                Component: DashBoardHome
            },
            {
                path: 'profile',
                Component: Profile
            },
            {
                path: 'updateProfile',
                Component: UpdateProfile
            },
            //student routes
            {
                path: 'my-enroll-class',
                element: <MyEnrollClass></MyEnrollClass>
            },
            //teacher routes
            {
                path: 'add-class',
                element: <AddClass></AddClass>
            },
            {
                path: 'my-class',
                element: <MyClass></MyClass>
            },
            //Admin routes
            {
                path: 'teacher-requests',
                element: <TeacherRequests></TeacherRequests>
            },
            {
                path: 'active-teachers',
                element: <ActiveTeacher></ActiveTeacher>
            },
            {
                path: 'make-admin',
                element: <MakeAdmin></MakeAdmin>
            },
            {
                path: 'all-users',
                element: <AllUsers></AllUsers>
            },
            {
                path: 'all-classes',
                element: <AllClasses></AllClasses>
            }
        ]
    }
]);