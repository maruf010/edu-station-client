import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import logo from '../../../public/eduNav.png';
import useAuth from '../../hooks/useAuth';
import { FaBookOpen, FaChalkboardTeacher, FaHome } from 'react-icons/fa';
import Button from '../Shared/Button';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import Loading from '../Shared/Loading';


const Navbar = () => {
    const { user, logOut, loading } = useAuth();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);


    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close menu after clicking any link
    const handleItemClick = () => {
        setOpen(false);
    };


    if (loading) {
        return <Loading></Loading>
    }

    const links = (
        <div className='flex flex-col lg:flex-row gap-3  text-[18px] lg:text-[17px] lg:gap-5 pl-2 list-none'>
            <li>
                <NavLink to='/'
                    onClick={() => {
                        ; (prev) => !prev
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={({ isActive }) =>
                        `group relative flex items-center  gap-1 px-2 py-1
                            ${isActive
                            ? 'text-[#FE7743]'
                            : 'text-gray-300 hover:text-white transition-colors duration-200'}`}>
                    <FaHome />
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-200 transition-all duration-400 group-hover:w-full"></span>
                </NavLink>
            </li>
            <li>
                <NavLink to='/allClasses' className={({ isActive }) =>
                    `group relative flex items-center gap-1 px-2 py-1
                            ${isActive
                        ? 'text-[#FE7743]'
                        : 'text-gray-300 hover:text-white transition-colors duration-200'}`
                }>
                    <FaBookOpen />
                    All Classes
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-200 transition-all duration-400 group-hover:w-full"></span>
                </NavLink>
            </li>
            {

                <li>
                    <NavLink
                        to="/teach"
                        className={({ isActive }) =>
                            `group relative flex items-center gap-1 px-2 py-1
                            ${isActive
                                ? 'text-[#FE7743]'
                                : 'text-gray-300 hover:text-white transition-colors duration-200'}`
                        }
                    >
                        <FaChalkboardTeacher />
                        Teach on EduStation
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                    </NavLink>
                </li>


            }


        </div >
    )

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
    }


    //theme
    // const [theme, setTheme] = useState(() => {
    //     return localStorage.getItem('theme') || 'light';
    // });
    // useEffect(() => {
    //     document.documentElement.setAttribute('data-theme', theme);
    //     localStorage.setItem('theme', theme);
    // }, [theme]);
    // Toggle between light and dark
    // const toggleTheme = () => {
    //     setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    // };



    return (
        <div className="sticky top-0 z-50 navbar bg-gradient-to-r from-slate-800 to-slate-600  px-2 md:px-7 lg:py-3 lg:px-20 py-2  backdrop-blur-sm">
            <div className="navbar-start">
                {/* <div className="dropdown">
                    <div tabIndex={0} role="button" className="mr-2 lg:hidden cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu  dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow bg-white">
                        {links}

                        {
                            !user && (
                                <div className='space-y-2 mt-2 '>
                                    <div>
                                        <Link
                                            to='/login'
                                            className='flex items-center gap-2 ml-2 pb-2 text-start cursor-pointer text-[16px] text-gray-500 hover:text-green-500'
                                        >
                                            <FiLogIn />
                                            Login
                                        </Link>
                                    </div>
                                    <div>
                                        <Link
                                            to='/register'
                                            className='flex items-center gap-2 ml-2 pb-2 text-start cursor-pointer text-[16px] text-gray-500 hover:text-green-500'
                                        >
                                            <FiUserPlus />
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            )
                        }
                    </ul>
                </div> */}
                <div className="relative lg:hidden" ref={dropdownRef}>
                    {/* Hamburger Icon */}
                    <button
                        onClick={() => setOpen(!open)}
                        className=" focus:outline-none p-0 text-gray-400"
                        aria-label="Toggle menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h10m-10 6h16" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute left-0 mt-2 w-56 bg-gradient-to-r from-slate-500 to-slate-700 rounded-lg shadow-lg z-50 py-2">
                            {/* Dynamic Links */}
                            <div onClick={handleItemClick}>
                                {links}
                            </div>

                            {/* Guest Options */}
                            {!user && (
                                <div className="mt-2 space-y-2 px-4" onClick={handleItemClick}>
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 text-[18px] lg:text-[17px] text-gray-300 hover:text-white transition-colors"
                                    >
                                        <FiLogIn /> Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center gap-2 text-[18px] lg:text-[17px] text-gray-300 hover:text-white transition-colors"
                                    >
                                        <FiUserPlus /> Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Link to='/'>
                    <div className='flex-1 ml-2 lg:ml-0 flex items-center'>
                        <img src={logo} alt="Coming soon" className="w-20 md:w-24  " />
                        {/* <span className='text-blue-500 font-medium ml-1 text-lg lg:text-2xl font-des' onClick={() => {
                            ; (prev) => !prev
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}>Edu<span className='text-gray-500'>Station</span></span> */}
                    </div>
                </Link>
            </div>
            <div className="navbar-end hidden lg:flex mr-4">
                <ul className="menu menu-horizontal px-2 rounded-xl  font-medium">
                    {links}
                </ul>
            </div>

            {/* md size */}
            <div className='flex items-center navbar-end lg:hidden'>
                {/* theme changer */}
                {/* <div className='mr-4'>
                    <label className="swap swap-rotate " >
                        <button type="checkbox m-0"
                            onClick={toggleTheme}
                            className="theme-controller text-green-500"
                        />
                        {theme === 'light' ?
                            <svg
                                className="swap-off   h-8 w-8 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                            :
                            <svg
                                className="swap-off h-8 w-8 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                        }
                    </label>
                </div> */}
                {/* user rounded animated*/}
                <span className="relative flex mr-2">
                    <span
                        className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-gray-400 opacity-100 ml-1 mt-1">
                    </span>
                    {/* user profile */}
                    <div className='dropdown dropdown-end duration-600 relative '>

                        <div
                            tabIndex={0}
                            role='button'
                            className='btn btn-ghost btn-circle avatar relative group'
                        >
                            <div className='w-10 rounded-full border border-gray-500'>

                                <img alt='coming' src={user ? user.photoURL : "https://i.ibb.co.com/84TKBCHZ/user-icon-1024x1024-dtzturco.png"} />

                                {/* hover profile name */}
                                <div className='absolute top-full  transform -translate-x-1/2 mt-5 px-3 bg-gray-500 text-white py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap  right-0  -mr-8'>
                                    {user ? user.displayName : 'Please Login'}
                                </div>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border border-gray-500'
                        >
                            <div>
                                {user ? (
                                    <div>
                                        <h2 className='text-lg px-2 font-bold py-2 rounded-lg text-gray-500  hover:text-green-500 cursor-pointer transition-colors delay-100 duration-200'>
                                            {user?.displayName}
                                        </h2>
                                        <div>
                                            <Link to='/dashboard' className='text-lg'>
                                                <div className=' px-2 font-bold py-2 rounded-lg text-gray-500  hover:text-green-500 cursor-pointer transition-colors delay-100 duration-200'>
                                                    Dashboard
                                                </div>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className='text-lg  px-2 font-bold py-2 rounded-lg text-gray-500   hover:text-green-500 cursor-pointer transition-colors delay-100 duration-200'
                                        >
                                            Logout
                                        </button>
                                    </div>

                                ) : (
                                    <Link to='/login' className='text-gray-500 px-4 py-2 text-lg'>
                                        Login
                                    </Link>
                                )}
                            </div>
                        </ul>
                    </div>
                </span>
            </div>
            {/* lg size */}
            <div className=' items-center hidden lg:flex'>
                {/* theme changer */}
                {/* <div className='mr-4'>
                    <label className="swap swap-rotate " >
                        <button type="checkbox m-0"
                            onClick={toggleTheme}
                            className="theme-controller text-green-500"
                        />
                        {theme === 'light' ?
                            <svg
                                className="swap-off   h-8 w-8 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                            :
                            <svg
                                className="swap-off h-8 w-8 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                        }
                    </label>
                </div> */}
                {/* user rounded animated*/}
                <span className="relative flex">
                    {
                        user &&
                        <span
                            className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-gray-300 opacity-100 ml-1 mt-1">
                        </span>
                    }
                    {/* user profile */}
                    <div className='dropdown dropdown-end duration-600 relative'>

                        <div
                            tabIndex={0}
                            role='button'
                            className='btn btn-ghost btn-circle avatar relative group'
                        >
                            <div className='w-10 rounded-full border border-gray-400'>

                                <img alt='coming' src={user ? user.photoURL : "https://i.ibb.co.com/84TKBCHZ/user-icon-1024x1024-dtzturco.png"} />

                                {/* hover profile name */}
                                <div className='absolute top-full  transform -translate-x-1/2 mt-5 px-3 bg-gray-500 text-white py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap  right-0  -mr-10 font-des'>
                                    {user ? user.displayName : 'Please Login'}
                                </div>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border border-gray-500'
                        >
                            <div className='text-gray-500'>
                                {user ? (
                                    <div className=''>
                                        <h2 className='text-lg px-2 font-medium py-2 rounded-lg text-gray-500  hover:text-green-500 cursor-pointer transition-colors delay-100 duration-200'>
                                            {user?.displayName}
                                        </h2>
                                        <div>
                                            <Link to='/dashboard' className='text-lg'>
                                                <div className=' px-2 font-medium py-2 rounded-lg text-gray-500  hover:text-green-500 cursor-pointer transition-colors delay-100 duration-200'>
                                                    Dashboard
                                                </div>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className='text-lg  px-2 font-medium py-2 rounded-lg text-gray-500   hover:text-green-500 cursor-pointer transition-colors delay-100 duration-200'
                                        >
                                            Logout
                                        </button>
                                    </div>

                                ) : (
                                    <Link to='/login' className='px-4 py-2 text-lg'>
                                        Login
                                    </Link>
                                )}
                            </div>
                        </ul>
                    </div>
                </span>
            </div>

            {/* login & register button */}
            <div className="">
                <div className='hidden lg:flex font-two font-bold'>
                    {user ? (
                        ''
                    ) : (
                        <div className='flex gap-4'>
                            <div className='ml-4'>
                                <Link
                                    to='/login'
                                >
                                    <Button label='Login'></Button>
                                </Link>
                            </div>
                            <div>
                                <Link
                                    to='/register'
                                >
                                    <Button label='Register' ></Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;