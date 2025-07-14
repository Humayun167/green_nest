import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
    const { products } = useAppContext(); 
    
    // Debug logging
    console.log('BestSeller - Total products:', products.length);
    console.log('BestSeller - In stock products:', products.filter(p => p.inStock).length);
    console.log('BestSeller - First few products:', products.slice(0, 3));
    
    const inStockProducts = products.filter((product)=>product.inStock);
    const displayProducts = inStockProducts.slice(0,5);
    
    return (
        <div className='mt-16'>
            <p className='text-2xl md:text-3xl font-medium'>Best seller</p>
            
            {/* Debug info - remove this in production */}
            <div className='text-sm text-gray-500 mb-2'>
                Debug: {products.length} total products, {inStockProducts.length} in stock, showing {displayProducts.length}
            </div>
            
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                {displayProducts.length > 0 ? (
                    displayProducts.map((product, index) => (
                        <ProductCard key={index} product={product}/>
                    ))
                ) : (
                    <div className='col-span-full text-center py-8'>
                        <p className='text-gray-500'>No products available</p>
                        <p className='text-sm text-gray-400 mt-2'>
                            <a href='/debug-products' className='text-blue-500 hover:underline'>
                                Debug Products →
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BestSeller;