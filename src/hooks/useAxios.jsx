import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
    baseURL: `http://localhost:5000`
    // baseURL: `https://daily-percel-server.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;
