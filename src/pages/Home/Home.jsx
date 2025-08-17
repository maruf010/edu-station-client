import React, { useEffect } from 'react';
import Partners from './Partners';
import Banner from './Banner';
import PerformanceStats from './PerformanceStats';
import YouCanLearn from './YouCanLearn';
import WhyChooseUs from './WhyChooseUs';
import InspireTeachers from './InspireTeachers';
import FeedbackCarousel from './FeedbackCarousel';
import PopularClasses from './PopularClasses';
import BeamsPage from '../../components/BackgroundEffect/BeamsPage';
import Contact from './Contact';


const Home = () => {

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="relative  overflow-hidden">
            <BeamsPage></BeamsPage>
            <div className=" z-10 overflow-hidden">
                <Banner></Banner>
                <YouCanLearn></YouCanLearn>
                <Partners></Partners>
                <PopularClasses></PopularClasses>
                <InspireTeachers></InspireTeachers>
                <FeedbackCarousel></FeedbackCarousel>
                <PerformanceStats></PerformanceStats>
                <Contact></Contact>
                <WhyChooseUs></WhyChooseUs>
            </div>
        </div>
    );
};

export default Home;