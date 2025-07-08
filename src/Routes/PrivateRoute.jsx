import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Shared/Loading';



const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    // console.log(user);

    const location = useLocation();
    // console.log(location);

    if (loading) {
        return <Loading></Loading>
    }

    if (user && user?.email) {
        return children;
    }
    else {
        return <Navigate state={location.pathname} to="/login"></Navigate>
    }

};

export default PrivateRoute;