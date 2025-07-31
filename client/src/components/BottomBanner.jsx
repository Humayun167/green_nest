import { assets, features } from '../assets/assets';

const BottomBanner = () => {
    return (
        <div className='relative mt-12 sm:mt-16 md:mt-20 lg:mt-24'>
            <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block' />
            <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden' />
            <div className='absolute inset-0 flex flex-col items-center md:items-end justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24'>
                <div className='max-w-md lg:max-w-lg xl:max-w-xl'>
                    <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-4 sm:mb-6 text-center md:text-left capitalize'>
                        why we are the best
                    </h1>
                    {features.map((feature, index) => (
                        <div key={index} className='flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4'>
                            <img 
                                src={feature.icon} 
                                alt={feature.title} 
                                className='w-8 sm:w-9 md:w-10 lg:w-11 flex-shrink-0' 
                            />
                            <div className='flex-1'>
                                <h3 className='text-base sm:text-lg md:text-xl font-semibold text-gray-800'>
                                    {feature.title}
                                </h3>
                                <p className='text-gray-700/70 text-xs sm:text-sm md:text-base leading-relaxed'>
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BottomBanner;