import React from 'react';
import { useCart } from './shared/cartContext';
import { Link } from 'react-router-dom';
import { useWishlist } from './shared/wishlistcontext';
import Toast from './shared/toast';

const WishlistPage = () => {
  const { addToCart } = useCart();
  const [toast, setToast] = React.useState(null);
  const { wishlist, removeFromWishlist, loading } = useWishlist();

  const showToast = (message, name, type) => {
    setToast({ message, name, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleRemovefromWishlist = (productId) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      showToast('Item Removed from Wishlist', product.name, 'error');
      removeFromWishlist(productId);
    } else {
      console.error('Product not found');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        My Wishlist <span role="img" aria-label="heart">❤️</span>
      </h2>

      {(!wishlist || wishlist.length === 0) ? (
        <div className="text-center text-gray-500">
          Your wishlist is empty.
          <Link to="/shop" className="text-blue-500 underline ml-2">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition duration-300 flex flex-col items-center bg-white"
            >
              <img
                src={item.image1 || '/fallback-image.png'}
                alt={item.name}
                className="w-32 h-32 object-contain mb-4"
              />

              <h3 className="text-lg font-medium text-center">{item.name}</h3>
              <p className="text-gray-600 mt-1 mb-4">${item.current_price}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToCart(item);
                    showToast('Item added to Cart', item.name, 'success');
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded transition"
                  disabled={loading}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleRemovefromWishlist(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Toast rendered once outside buttons */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          title={toast.name}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default WishlistPage;
