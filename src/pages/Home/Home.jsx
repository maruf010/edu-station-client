import React from 'react';
import Partners from './Partners';
import Banner from './Banner';
import PerformanceStats from './PerformanceStats';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Partners></Partners>
            <PerformanceStats></PerformanceStats>
        </div>
    );
};

export default Home;