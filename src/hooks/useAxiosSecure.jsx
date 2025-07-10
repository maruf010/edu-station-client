import axios from 'axios';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';
import { useEffect } from 'react';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // 🔒 Request Interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // 🚨 Response Interceptor
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (res) => res,
            (error) => {
                const status = error.response?.status;
                if (status === 403) {
                    navigate('/forbidden');
                } else if (status === 401) {
                    logOut().then(() => navigate('/login')).catch(() => { });
                }
                return Promise.reject(error);
            }
        );

        // 🧹 Clean up interceptors when component unmounts or dependencies change
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [user, navigate, logOut]);

    return axiosSecure;
};

export default useAxiosSecure;





// import axios from 'axios';
// import React from 'react';
// import { useNavigate } from 'react-router';
// import useAuth from './useAuth';


// const axiosSecure = axios.create({
//     baseURL: `http://localhost:5000`
//     // baseURL: `https://daily-percel-server.vercel.app`
// });


// const useAxiosSecure = () => {

//     const { user, logOut } = useAuth();
//     const navigate = useNavigate();

//     axiosSecure.interceptors.request.use(config => {
//         config.headers.Authorization = `Bearer ${user.accessToken}`
//         return config;
//     }, error => {
//         return Promise.reject(error);
//     });

//     axiosSecure.interceptors.response.use(res => {
//         return res;
//     }, error => {
//         // console.log('inside res interceptors', error);
//         const status = error.status;
//         if (status === 403) {
//             navigate('/forbidden')
//         }
//         else if (status === 401) {
//             logOut()
//                 .then(() => {
//                     navigate('/login')
//                 })
//                 .catch(() => { })
//         }
//         return Promise.reject(error);
//     })

//     return axiosSecure;

// };

// export default useAxiosSecure;