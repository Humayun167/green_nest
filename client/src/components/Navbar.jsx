import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from './../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {
     const [open, setOpen] = React.useState(false)
     const {user, setUser,setShowUserLogin,navigate, setSearchQuery, searchQuery, getCartCount,axios}= useAppContext();

     const logout = async ()=>{
       try {
        const {data} = await axios.get('/api/user/logout');
        if(data.success){
            toast.success(data.message);
            setUser(null);
            navigate('/');
        }else{
              toast.success(data.message);
        }
       } catch (error) {
          toast.success(error.message);
       }
       
       
     }

     useEffect(()=>{
if(searchQuery.length>0){
    navigate("/products");
}
     },[searchQuery])

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to={"/"}  onClick={()=>setOpen(false)} className="flex items-center gap-2">
                <img className="h-12 " src={assets.logo} alt="dummyLogoColored" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/products'>All Product</NavLink>
                <NavLink to='/contact'>Contact</NavLink>
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e)=>setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                </div>

                <div onClick={()=>navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart" className='w-6 opacity-60'  />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? (
                    <button onClick={()=>setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Login
                </button>)
                :(
                    <div className='relative group'>
                        <img 
                            src={user.profileImage || assets.profile_icon} 
                            className='w-10 h-10 rounded-full object-cover border-2 border-gray-200' 
                            alt="Profile"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = assets.profile_icon;
                            }}
                        />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={()=> navigate("profile")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Profile</li>
                            <li onClick={()=> navigate("my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Order</li>
                            <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logut</li>
                        </ul>

                    </div>
                                )}
            </div>
            
            <div className='flex items-center gap-6 sm:hidden'>
                 <div onClick={()=>navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart" className='w-6 opacity-60'  />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
               <img src={assets.menu_icon} alt="menu" />
            </button>
            </div>

            

            {/* Mobile Menu */}
           { open && (
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink onClick={()=>setOpen(false)} to='/'>Home</NavLink>
                <NavLink onClick={()=>setOpen(false)} to='/products'>All Product</NavLink>
                {user && 
                   <>
                   <NavLink onClick={()=>setOpen(false)} to='/profile'>Profile</NavLink>
                   <NavLink onClick={()=>setOpen(false)} to='/my-orders'>My Orders</NavLink>
                   </>
                }
                <NavLink onClick={()=>setOpen(false)} to='/contact'>Contact</NavLink>
                

                {!user ? (
                       <button onClick={()=>{
                        setOpen(false); 
                        setShowUserLogin(true);
                        }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull    transition text-white rounded-full text-sm">
                    Login 
                </button>
                   ): (
                <button onClick={logout}  className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull    transition text-white rounded-full text-sm">
                    Logout 
                </button>)}
              
            </div>
            )}

        </nav>
    )
};

export default Navbar;