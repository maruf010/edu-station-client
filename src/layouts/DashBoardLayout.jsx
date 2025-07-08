import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { FaHome, FaUserEdit, FaUser, FaChalkboardTeacher, FaBookOpen, FaClipboardList, FaSignOutAlt, FaUserTie, FaUserShield } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import { HiOutlineUsers } from "react-icons/hi";
import { GiNotebook } from "react-icons/gi";
import { MdOutlinePendingActions } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import logo from "../../public/logo.jpg"
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import useUserRole from "../hooks/useUserRole";


const DashBoardLayout = () => {

    const { logOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const sidebarRef = useRef();


    const { role, roleLoading } = useUserRole();
    console.log(role);

    const handleLogout = () => {
        logOut()
            .then(() => {
                toast.success('Logout successfully !', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#fff',
                        color: '#333',
                    },
                    icon: '👏',
                })
                navigate('/login')
            })
            .catch((error) => {
                console.log(error)
            })
    };

    const handleMobileNav = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                window.innerWidth < 1024
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className="flex  min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`bg-white shadow-md w-64 p-6 space-y-4 fixed lg:static z-20 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                <Link to='/' className=" ">
                    <img src={logo} alt="Logo" className="h-10" />

                </Link>

                <nav className="space-y-2">
                    {/* Dashboard Home */}
                    <NavLink
                        to="/dashboard"
                        onClick={handleMobileNav}
                        className='flex items-center gap-2 p-2 rounded transition-colors duration-200'
                    >
                        <FaHome /> Dashboard Home
                    </NavLink>


                    {/* Student Links */}
                    {
                        !roleLoading && role === 'student' && (
                            <>
                                <hr />
                                <h3 className="font-semibold text-gray-600">Student</h3>
                                <NavLink
                                    to="/dashboard/my-enroll-class"
                                    onClick={handleMobileNav}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    <FaBookOpen /> My Enrolled Classes
                                </NavLink>
                            </>
                        )
                    }

                    {/* Teacher Links */}
                    {
                        !roleLoading && role === 'teacher' && (
                            <>
                                <hr />
                                <h3 className="font-semibold text-gray-600">Teacher</h3>
                                <NavLink
                                    to="/dashboard/add-class"
                                    onClick={handleMobileNav}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    <IoMdPersonAdd /> Add Class
                                </NavLink>
                                <NavLink
                                    to="/dashboard/my-classes"
                                    onClick={handleMobileNav}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    <GiNotebook /> My Classes
                                </NavLink></>
                        )
                    }

                    {/* Admin Links */}
                    {
                        !roleLoading && role === 'admin' && (
                            <>
                                <hr />
                                <h3 className="font-semibold text-gray-600">Admin</h3>
                                <NavLink
                                    to="/dashboard/teacher-requests"
                                    onClick={handleMobileNav}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    <FaChalkboardTeacher /> Teacher Requests
                                </NavLink>
                                <NavLink
                                    to="/dashboard/pending-classes"
                                    onClick={handleMobileNav}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    <MdOutlinePendingActions /> Pending Classes
                                </NavLink>
                                <NavLink
                                    to="/dashboard/active-teachers"
                                    onClick={handleMobileNav}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    <FaUserTie /> Active Teachers
                                </NavLink>
                                <NavLink
                                    to="/dashboard/all-users"
                                    onClick={handleMobileNav}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    <HiOutlineUsers /> All Users
                                </NavLink>
                                <NavLink
                                    to="/dashboard/make-admin"
                                    onClick={handleMobileNav}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                                        }`
                                    }
                                >
                                    <FaUserShield /> Make Admin
                                </NavLink>
                            </>
                        )
                    }

                    <hr />
                    <NavLink
                        to="/dashboard/profile"
                        onClick={handleMobileNav}
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                            }`
                        }
                    >
                        <FaUser /> Profile
                    </NavLink>
                    <NavLink
                        to="/dashboard/updateProfile"
                        onClick={handleMobileNav}
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded transition-colors duration-200 ${isActive ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                            }`
                        }
                    >
                        <FaUserEdit /> Update Profile
                    </NavLink>

                    <button
                        onClick={() => {
                            handleLogout();
                            handleMobileNav();
                        }}
                        className="flex items-center gap-2 p-2 rounded text-gray-500 hover:bg-gray-200 transition-colors duration-200"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>

            </aside>

            {/* Main Content */}
            <div className="flex-1  w-full">
                {/* Topbar for mobile */}
                <div className="bg-white p-4 shadow flex items-center justify-between lg:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-xl font-bold">☰</button>
                    <Link to='/'>
                        <img src={logo} alt="Logo" className="h-8" />
                    </Link>
                </div>

                {/* Page Content */}
                <main className="">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashBoardLayout;
