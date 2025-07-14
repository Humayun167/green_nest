import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {

  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="border border-gray-500/20 rounded-md px-3 sm:px-4 py-3 bg-white w-full max-w-xs mx-auto hover:shadow-lg transition-shadow duration-200">
        <div className="group cursor-pointer flex items-center justify-center px-2 mb-3">
          <img
            className="group-hover:scale-105 transition-transform duration-200 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
            src={product.image[0]}
            alt={product.name}
          />
        </div>
        <div className="text-gray-500/60 text-xs sm:text-sm">
          <p className="mb-1">{product.category}</p>
          <p className="text-gray-700 font-medium text-sm sm:text-base md:text-lg truncate w-full mb-2">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5 mb-3">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-3 sm:w-3.5"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
            <p className="ml-1 text-xs sm:text-sm">(4)</p>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-2">
              <p className="text-base sm:text-lg md:text-xl font-medium text-primary">
                {currency}{product.offerPrice}
              </p>
              <span className="text-gray-500/60 text-xs sm:text-sm line-through">
                {currency}{product.price}
              </span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-primary"
            >
              {!cartItems[product._id] ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary border border-primary md:w-[80px] w-[64px] h-[34px] rounded text-white font-medium cursor-pointer"
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="cart_icon" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary-dull rounded select-none">
                  <button
                    onClick={() => {
                      removeFromCart(product._id);
                    }}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(product._id);
                    }}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
