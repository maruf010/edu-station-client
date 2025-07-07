import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import bannerImg1 from '../../assets/Coursera-Logo.jpg'
import bannerImg2 from '../../assets/edureka.jpeg'
import bannerImg3 from '../../assets/programminghero_logo.jpeg'

const Banner = () => {
    return (
        <Carousel autoPlay={true} infiniteLoop={true} interval={2500} showThumbs={false}>
            <div>
                <img src={bannerImg1} />
                <p className="legend">Legend 1</p>
            </div>
            <div>
                <img src={bannerImg2} />
                <p className="legend">Legend 2</p>
            </div>
            <div>
                <img src={bannerImg3} />
                <p className="legend">Legend 3</p>
            </div>
        </Carousel>
    );
};

export default Banner;