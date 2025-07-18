import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from './../components/ProductCard';

const AllProducts = () => {

    const {products ,searchQuery} = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    console.log('AllProducts render - products:', products.length, 'filtered:', filteredProducts.length);
    
    const inStockFilteredProducts = filteredProducts.filter((product)=>product.inStock);
    console.log('AllProducts - In stock filtered products:', inStockFilteredProducts.length);


    useEffect(()=>{
        console.log('AllProducts - Products changed:', products.length);
        console.log('AllProducts - Search query:', searchQuery);
        
        if(searchQuery.length>0){
            const filtered = products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log('AllProducts - Filtered by search:', filtered.length);
            setFilteredProducts(filtered);
        }else{
            setFilteredProducts(products);
        }
    },[products, searchQuery])

    return (
        <div className='mt-16 flex flex-col'>
             <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>All Product</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
             </div>
             <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                {filteredProducts.filter((product)=>product.inStock).map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
             </div>

        </div>
    );
};

export default AllProducts;