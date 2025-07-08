import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const StudentRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-lg block mx-auto mt-10"></span>;
    }

    if (!user || role !== 'student') {
        return <Navigate to="/forbidden" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default StudentRoute;
