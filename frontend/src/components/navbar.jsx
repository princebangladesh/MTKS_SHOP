import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { IoMdSearch } from 'react-icons/io'
import Sidebar from './sidebar';
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart,FaRegUser } from "react-icons/fa";
import DarkModeToggle from './darkmode';

import { useCart } from './shared/cartContext'
import { useWishlist } from './shared/wishlistcontext';



function Navbar() {
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);


   const [ActiveSide,setActiveSide]=React.useState(true)
   const handleBar=()=>{
    setActiveSide(!ActiveSide)
  }
  return (
    <div className="bg-brandWhite dark:bg-brandGreen duration-200 relative z-40">
      <div className='py-4'>
        <div className="mx-5 flex justify-between items-center ">
          <div className=" flex items-center gap-4">
            <a href="/" 
            className="font-semibold text-2xl text-brandGreen dark:text-brandWhite
            tracking-wideset text-2xl sm:text-3xl ">
              MTKS
            </a>
            {/* Navbar Section */}
            
              <ul className="hidden lg:block flex absolute left-1/2 transform -translate-x-1/2 space-x-6 text-teal-900 font-medium">
                <li className='inline-block  font-semibold text-lg'>
                  <a href="/" className="text-brandGreen dark:text-brandWhite hover:font-bold transition duration-300 tracking-widest">Home</a>
                </li>
                <li className='inline-block font-semibold text-lg'>
                  <Link to="/productlist" className="text-brandGreen dark:text-brandWhite hover:font-bold transition duration-300 tracking-widest">Shop</Link>
                </li>
                <li className='inline-block  font-semibold text-lg'>
                    <Link to="/about" className="text-brandGreen dark:text-brandWhite hover:font-bold transition duration-300 tracking-widest">About</Link>
                </li>
                <li className='inline-block  font-semibold text-lg'>
                    <Link to="/contact" className="text-brandGreen dark:text-brandWhite hover:font-bold transition duration-300 ease-in-out tracking-widest">Contact</Link>
                </li>
                
              </ul>
          </div>
          {/* SideBar */}
          <Sidebar ActiveSide={ActiveSide} setActiveSide={setActiveSide} handleBar={handleBar}/>

          { /* Search Button */}
          <div className='flex justify-between items-center gap-4'>

              <div className='relative group hidden sm:block'>
                <input className='search-bar dark:bg-brandGreen' 
                type="text" placeholder='Search'/>
                <IoMdSearch
                className="text-xl text-brandGreen dark:text-brandWhite 
                text-gray-500 absolute top-1/2 -translate-y-1/2 right-3
                group-hover:text-pretty dark:group-hover:text-brandWhite"
                />
              </div>
              <DarkModeToggle />
            <Link to="/login" className='relative p-1'>
              <FaRegUser className='text-2xl text-brandGreen dark:text-brandWhite' />
            </Link>
            <Link to="/wishlist" className='relative p-1'>
              <FaRegHeart className='text-2xl text-brandGreen dark:text-brandWhite' />
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1'>{Array.isArray(wishlist) ? wishlist.length : 0}</span>

            </Link>
            <Link to="/cart" className='relative p-1'>
              <FaCartShopping className='text-2xl text-brandGreen dark:text-brandWhite' />
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1'>{totalQuantity}</span>
            </Link >

          <button className="relative group lg:hidden" onClick={handleBar}>
            <div className={`relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all ring-0 ring-gray-300 hover:ring-8 ${ActiveSide?"":"ring-4"}  ring-opacity-30 duration-200`}>
              <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                <div className={` bg-brandGreen dark:bg-brandWhite h-[2px] w-7 transform transition-all duration-300 origin-left ${ActiveSide?"":"rotate-[42deg]"}`}></div>
                <div className={`bg-brandGreen dark:bg-brandWhite h-[2px] w-1/2 rounded transform transition-all duration-300 ${ActiveSide?"":"-translate-x-10"}`}></div>
                <div className={`bg-brandGreen dark:bg-brandWhite h-[2px] w-7 transform transition-all duration-300 origin-left ${ActiveSide?"":"-rotate-[42deg]"}`}></div>
              </div>
            </div>
          </button>
            

          </div>
        </div>
      </div>
    </div>

  )
}

export default Navbar