import React from 'react';
import { assets } from '../assets/assets';

const MainBanner = () => {
    return (
        <div>
            <img className='w-full hidden md:block' src={assets.main_banner_bg} alt="" />
            <img className='w-full md:hidden' src={assets.main_banner_bg_sm} alt="" />
        </div>
    );
};

export default MainBanner;