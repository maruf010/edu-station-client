import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';


const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-lg mx-auto block mt-8"></span>;
    }

    if (!user || role !== 'admin') {
        return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute;