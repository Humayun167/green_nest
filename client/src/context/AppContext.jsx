import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Add axios interceptor to include Authorization header as fallback
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage as fallback for cross-origin cookie issues
    const sellerToken = localStorage.getItem('sellerToken');
    const userToken = localStorage.getItem('userToken');
    
    // Add seller token to header if making seller-related requests
    if (sellerToken && config.url.includes('/seller')) {
      config.headers.Authorization = `Bearer ${sellerToken}`;
    }
    
    // Add user token to header if making user-related requests or post requests
    if (userToken && (config.url.includes('/user') || config.url.includes('/post'))) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // Fetch Seller details     
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  }
  // Fetch User auth,user details, cart items
  const fetchUser = async ()=>{
    try {
      const {data} = await axios.get("/api/user/is-auth");
      if(data.success){
        setUser(data.user);
        setCartItems(data.user.cartItems);
        console.log('User authentication successful:', data.user);
      } else {
        console.log('User authentication failed:', data.message);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error.response?.data || error.message);
      setUser(null);
    }
  }


   

  // Fetch All products
  const fetchProducts = async () => {
   try {
    console.log('Fetching products...');
    const {data} = await axios.get("/api/product/list");
    if(data.success){
      console.log('Products fetched successfully:', data.products.length, 'products');
      setProducts(data.products)
    }
    else{
      console.error('Failed to fetch products:', data.message);
      toast.error(data.message)
    }
   } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    toast.error('Failed to load products');
   }
  };

  // Add product to cart

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // update cart item quantity

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from cart");
    setCartItems(cartData);
  };

  // get cart item count

  const getCartCount=()=>{
    let totalCount = 0;  
    for(const item in cartItems){
      totalCount += cartItems[item];
    }
    return totalCount;
  }


  // get cart total amount

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if(cartItems[items]>0){
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100; // Round to 2 decimal places  
  }

  // Logout function
  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      if (data.success) {
        // Clear localStorage token
        localStorage.removeItem('userToken');
        // Reset user state
        setUser(null);
        setCartItems({});
        toast.success(data.message);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, clear local state
      localStorage.removeItem('userToken');
      setUser(null);
      setCartItems({});
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  useEffect(() => {
    fetchUser()
    fetchSeller();
    fetchProducts();
  },[]);
// update database cart items
  useEffect(()=>{
   const updateCart = async()=>{
    try{
      const {data} = await axios.post('/api/cart/update',{cartItems});
      if(!data.success){
        toast.error(data.message);
      }
    }catch(error){
        toast.error(error.message);
    }
    }
    if(user){
    updateCart();
    }
  },[cartItems])

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    logout

  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
