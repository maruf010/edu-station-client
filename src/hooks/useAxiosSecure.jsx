import axios from 'axios';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';
import { useEffect } from 'react';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000', // or your deployed URL
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const setInterceptor = async () => {
            axiosSecure.interceptors.request.use(
                async config => {
                    if (user) {
                        const token = await user.getIdToken(); // 🔥 Correct way to get Firebase token
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                },
                error => Promise.reject(error)
            );
        };
        setInterceptor();
    }, [user]);

    axiosSecure.interceptors.response.use(
        res => res,
        error => {
            const status = error.response?.status;
            if (status === 403) {
                navigate('/forbidden');
            } else if (status === 401) {
                logOut()
                    .then(() => navigate('/login'))
                    .catch(() => { });
            }
            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;
