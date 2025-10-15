import React from 'react'
import { FaHeart, FaEye, FaRegSquare,FaCartPlus } from "react-icons/fa";

import Toast from './toast';
import { useCart } from './cartContext';


function ProductListView({ product }) {
  const [toast, setToast] = React.useState(null);
    
      const showToast = (message,name,type) => {
        setToast({ message,name, type });
    
        setTimeout(() => {
          setToast(null);
        }, 3000); // 3 seconds
      };
    const { addToCart,addToWishlist } = useCart();
    const handleAdd=()=>{
      addToCart(product)
      showToast('Item Added', product?.name,'success');
    }
    const handleWishlist = () => {
    addToWishlist(product);
    showToast('Item Added to Wishlist', product?.name,'success');
  }
  const safeRating = Math.max(0, Math.min(5, Math.round(product?.rating || 0)));
  return (
    <div>
      <div

            className="Caro-bg text-white rounded-xl overflow-hidden hover:shadow-xl flex items-center space-x-6 p-4 group transition-all duration-500 cursor-pointer"
          >
            <img
              src={product?.image1}
              alt={product?.name}
              className='w-32 h-32 object-cover rounded group-hover:scale-125 transition-all duration-500 '
            />
            <div className="flex-1">
              <span className="text-xs uppercase text-brandBlue dark:text-brandWhite">{product?.category_name}</span>
              <h3 className="text-lg font-bold text-brandGreen dark:text-white">{product?.name}</h3>
              <div className="flex items-center space-x-1 text-black dark:text-brandWhite text-sm">
                {'★'.repeat(safeRating)}{'☆'.repeat(5 - safeRating)}
                <span className="ml-1 text-black dark:text-brandWhite">({product?.rating.toFixed(1)})</span>
              </div>
              <div className="mt-1">
                <span className="text-brandGreen dark:text-brandWhite font-semibold">${product?.current_price}</span>
                <span className="line-through ml-2 text-gray-400">${product?.previous_price}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 relative">

                <button onClick={handleAdd} className="absolute bottom-10 group-hover:right-5 right-[-200px] bg-brandGreen text-white px-4 py-1 rounded-md text-sm font-medium 
                 transition-all duration-500">
                  <FaCartPlus className='my-1' size={32}/>
                </button>
                {toast && <Toast message={toast.message} type={toast.type} title={toast.name} onClose={()=>setToast(null)}/>}
              </div>  
            </div>
          </div>
    </div>
  )
}

export default ProductListView