import React from 'react';
import Partners from './Partners';
import Banner from './Banner';
import PerformanceStats from './PerformanceStats';
import YouCanLearn from './YouCanLearn';
import WhyChooseUs from './WhyChooseUs';
import InspireTeachers from './InspireTeachers';
import FeedbackCarousel from './FeedbackCarousel';
import PopularClasses from './PopularClasses';


const Home = () => {
    return (
        <div className=''>
            <Banner></Banner>
            <YouCanLearn></YouCanLearn>
            <Partners></Partners>
            <PopularClasses></PopularClasses>
            <FeedbackCarousel></FeedbackCarousel>
            <PerformanceStats></PerformanceStats>
            <InspireTeachers></InspireTeachers>
            <WhyChooseUs></WhyChooseUs>
        </div>
    );
};

export default Home;