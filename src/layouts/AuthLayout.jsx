import React from 'react';
import { Link, Outlet } from 'react-router';
// import logo from '../../public/eduNav.png';

const AuthLayout = () => {
    return (
        <div className=" bg-base-200 ">
            {/* <Link to='/'>
                <img src={logo} alt="Logo" className="w-20 md:w-24 lg:w-30 " />
            </Link> */}
            {/* <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='flex-1 flex justify-center bg-green-200'>
                    <img
                        src=''
                        className=" md:max-w-sm rounded-lg"
                    />
                </div>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div> */}
            <div className=''>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AuthLayout;