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
import AddClass from "../pages/Dashboard/Teacher/AddClass";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import ForgetPassword from "../pages/Authentication/ForgetPassword";
import TeacherRequests from "../pages/Dashboard/Admin/TeacherRequests";
import ActiveTeacher from "../pages/Dashboard/Admin/ActiveTeacher";
import MakeAdmin from "../pages/Dashboard/Admin/MakeAdmin";
import AdminRoute from "./AdminRoute";
import Forbidden from "../components/Shared/Forbidden";
import StudentRoute from "./StudentRoute";
import MyClasses from "../pages/Dashboard/Teacher/MyClasses";
import PendingClasses from "../pages/Dashboard/Admin/PendingClasses";
import ClassDetails from "../pages/ClassDetails/ClassDetails";
import PaymentsHistory from "../pages/Payment/PaymentsHistory";
import AllPayments from "../pages/Dashboard/Admin/AllPayments";
import Wishlist from "../pages/Dashboard/Student/Wishlist";
import MyClassDetails from "../pages/Dashboard/Teacher/MyClassDetails";
import StudentAssignments from "../pages/Dashboard/Student/StudentAssignments";
import TeacherRoute from "./TeacherRoute";
import AllClassesByAdmin from "../pages/Dashboard/Admin/AllClassesByAdmin";



export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        errorElement: <Forbidden></Forbidden>,
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
                element: <PrivateRoute>
                    <ApplyTeacher></ApplyTeacher>
                </PrivateRoute>
            },
            {
                path: '/forbidden',
                Component: Forbidden
            },
            {
                path: '/classes/approved/:id',
                element: <PrivateRoute>
                    <ClassDetails></ClassDetails>
                </PrivateRoute>
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        errorElement: <Forbidden></Forbidden>,
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
        errorElement: <Forbidden></Forbidden>,
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
                element: <StudentRoute>
                    <MyEnrollClass></MyEnrollClass>
                </StudentRoute>
            },
            {
                path: 'assignments/:classId',
                element: <StudentRoute>
                    <StudentAssignments></StudentAssignments>
                </StudentRoute>
            },
            {
                path: 'payments',
                element: <StudentRoute>
                    <PaymentsHistory></PaymentsHistory>
                </StudentRoute>
            },
            {
                path: 'wishlist',
                element: <StudentRoute>
                    <Wishlist></Wishlist>
                </StudentRoute>
            },

            //teacher routes
            {
                path: 'add-class',
                element: <TeacherRoute>
                    <AddClass></AddClass>
                </TeacherRoute>
            },
            {
                path: 'my-classes',
                element: <TeacherRoute>
                    <MyClasses></MyClasses>
                </TeacherRoute>
            },
            {
                path: 'my-class/:id',
                element: <TeacherRoute>
                    <MyClassDetails></MyClassDetails>
                </TeacherRoute>
            },

            //Admin routes
            {
                path: 'teacher-requests',
                element: <AdminRoute>
                    <TeacherRequests></TeacherRequests>
                </AdminRoute>
            },
            {
                path: 'active-teachers',
                element: <AdminRoute>
                    <ActiveTeacher></ActiveTeacher>
                </AdminRoute>
            },
            // {
            //     path: 'make-admin',
            //     element: <AdminRoute>
            //         <MakeAdmin></MakeAdmin>
            //     </AdminRoute>
            // },
            // {
            //     path: 'pending-classes',
            //     element: <AdminRoute>
            //         <PendingClasses></PendingClasses>
            //     </AdminRoute>
            // },
            {
                path: 'all-classes',
                element: <AdminRoute>
                    <AllClassesByAdmin></AllClassesByAdmin>
                </AdminRoute>
            },
            {
                path: 'all-users',
                element: <AdminRoute>
                    <AllUsers></AllUsers>
                </AdminRoute>
            },
            {
                path: 'allPayments',
                element: <AdminRoute>
                    <AllPayments></AllPayments>
                </AdminRoute>
            }
        ]
    }
]);