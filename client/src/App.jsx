import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';

import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import MySalesOrders from './pages/MySalesOrders';
import UserProfile from './pages/UserProfile';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import UserProductRequests from './pages/seller/UserProductRequests';
import CommunityPosts from './pages/seller/CommunityPosts';
import AllUsers from './pages/seller/AllUsers';
import AddProductRequest from './pages/AddProductRequest';
import MyProductRequests from './pages/MyProductRequests';
import SocialMedia from './pages/SocialMedia';
import MyPosts from './pages/MyPosts';
import AuthDebugger from './components/AuthDebugger';
import ProductDebugger from './components/ProductDebugger';
import AI from './pages/AI';

const App = () => {

  const isSellerPath = useLocation().pathname.includes('/seller');
  const {showUserLogin,isSeller} = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white '>
      {isSellerPath? null: <Navbar/>}
      {showUserLogin ? <Login/>: null}
      <Toaster/>

       <div className={`${isSellerPath ?"":"px-6 md:px-16 lg:px-24 xl:px-32" }`}>
        <Routes>
          <Route path='/' element={<Home></Home>}/>
          <Route path='/products' element={<AllProducts/>}/>
          <Route path='/products/:category' element={<ProductCategory/>}/>
          <Route path='/products/:category/:id' element={<ProductDetails/>}/> 
          <Route path='/cart' element={<Cart/>}/> 
          <Route path='/add-address' element={<AddAddress/>}/> 
          <Route path='/my-orders' element={<MyOrders/>}/> 
          <Route path='/my-sales' element={<MySalesOrders/>}/> 
          <Route path='/profile' element={<UserProfile/>}/> 
          <Route path='/add-product-request' element={<AddProductRequest/>}/> 
          <Route path='/my-product-requests' element={<MyProductRequests/>}/> 
          <Route path='/community' element={<SocialMedia/>}/> 
          <Route path='/my-posts' element={<MyPosts/>}/>
          <Route path='/ask' element={<AI/>}/>
          <Route path='/debug-auth' element={<AuthDebugger/>}/>
          <Route path='/debug-products' element={<ProductDebugger/>}/> 
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null} />
            <Route path='product-list' element={<ProductList/>}/>
            <Route path='orders' element={<Orders></Orders>}/>
            <Route path='user-requests' element={<UserProductRequests/>}/>
            <Route path='community-posts' element={<CommunityPosts/>}/>
            <Route path='users' element={<AllUsers/>}/>           
          </Route>
        </Routes>
       </div>
      {!isSellerPath && <Footer/>}
    </div>
  );
};

export default App;