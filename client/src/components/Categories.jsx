import {  categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Categories = () => {

    const {navigate} = useAppContext()



    return (
        <div className='mt-8 md:mt-16 px-4 sm:px-6 lg:px-8'>
            <p className='text-xl sm:text-2xl md:text-3xl font-medium text-center sm:text-left'>Categories</p>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 mt-4 md:mt-6 gap-3 sm:gap-4 md:gap-6'>


            {categories.map((category, index) => (
                <div key={index} className='group cursor-pointer py-3 sm:py-4 md:py-5 px-2 sm:px-3 gap-1 sm:gap-2 rounded-lg flex flex-col justify-center items-center hover:shadow-lg transition-all duration-300'
                style={{backgroundColor: category.bgColor}}
                onClick={() => {
                    navigate(`/products/${category.path.toLowerCase()}`);
                    scrollTo(0, 0)

                }}
                >
                    <img className='group-hover:scale-105 sm:group-hover:scale-108 transition-transform duration-300 w-16 sm:w-20 md:w-24 lg:w-28 max-w-full h-auto' src={category.image} alt={category.text} />
                    <p className='text-xs sm:text-sm font-medium text-center leading-tight'>{category.text}</p>
                </div>
        ))}

                
            </div>
        </div>
    );
};

export default Categories;