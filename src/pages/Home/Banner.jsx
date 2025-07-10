import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import animation1 from '../../assets/Animation1.json';
import animation2 from '../../assets/Animation2.json';
import animation3 from '../../assets/Animation3.json';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import Button from '../../components/Shared/Button';
import { motion } from 'framer-motion';

const Banner = () => {
    return (
        <div className="relative overflow-hidden py-16 md:py-24 px-4 md:px-8 bg-[#f9f9f9]">
            {/* Gradient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffe0f0] via-[#c3f0ff] to-[#e0ffe0] blur-2xl opacity-50 -z-10"></div>

            {/* Blob SVG for depth */}
            <svg className="absolute top-[-50px] left-[-60px] w-[300px] md:w-[400px] opacity-30 z-0" viewBox="0 0 200 200">
                <path fill="#A0E9FF" d="M45.4,-57.4C58.1,-48.4,67.8,-32.3,68.2,-16.6C68.6,-0.9,59.7,14.4,50.1,27.9C40.4,41.3,30,53,15.4,62.3C0.8,71.6,-18.1,78.5,-33.1,72.2C-48.1,65.9,-59.3,46.4,-60.7,28.6C-62,10.9,-53.4,-5.2,-45.3,-20.1C-37.2,-35,-29.6,-48.6,-17.5,-58.5C-5.4,-68.3,11.3,-74.5,26.7,-70.3C42.1,-66.1,56.6,-51.1,45.4,-57.4Z" transform="translate(100 100)" />
            </svg>

            {/* Floating Shape (animated) */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float-slow z-0"></div>

            <motion.div
                className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {/* Text Section */}
                <motion.div
                    className="md:w-1/2 text-center md:text-left space-y-6 relative z-10"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 drop-shadow-md">
                        Welcome to Our Learning Platform
                    </h1>
                    <p className="text-lg text-gray-700">
                        Empowering your learning journey with innovative tools and resources.
                    </p>
                    <div className="flex items-center justify-center md:justify-start space-x-4">
                        <Link to="/allClasses">
                            <Button label="Get Started" />
                        </Link>
                        <Link to="/allClasses">
                            <Button label="Our Courses" />
                        </Link>
                    </div>
                </motion.div>

                {/* Carousel Section */}
                <motion.div
                    className="md:w-[400px] w-full"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <Carousel
                        autoPlay
                        infiniteLoop
                        interval={2500}
                        showThumbs={false}
                        showArrows={false}
                        showStatus={false}
                        emulateTouch
                        stopOnHover
                        showIndicators={true}
                    >
                        <div>
                            <Lottie animationData={animation1} loop style={{ height: '400px' }} />
                        </div>
                        <div>
                            <Lottie animationData={animation2} loop style={{ height: '400px' }} />
                        </div>
                        <div>
                            <Lottie animationData={animation3} loop style={{ height: '400px' }} />
                        </div>
                    </Carousel>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Banner;
