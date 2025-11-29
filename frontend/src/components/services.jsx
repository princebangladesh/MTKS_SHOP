import React from 'react'

function Services() {
  return (
    <div className="container py-12">

      {/* FIXED 2 OR 4 COLUMN GRID */}
      <div
        className="
          grid 
          grid-cols-2         /* mobile = 2 columns */
          sm:grid-cols-2      
          md:grid-cols-2      /* tablet = 2 columns */
          lg:grid-cols-4      /* desktop = 4 columns */
          xl:grid-cols-4
          gap-8
          text-center text-gray-800 dark:text-brandWhite
        "
      >
        {/* Service Item */}
        <div className="
          flex flex-col items-center 
          p-6 rounded-xl min-h-[180px]
          hover:shadow-lg hover:scale-105 
          transition-all duration-300 cursor-pointer
        ">
          <i className="text-4xl fi fi-ts-shipping-fast mb-3 text-brandPrimary dark:text-brandWhite"></i>
          <h3 className="text-lg font-semibold mb-1">Free Delivery</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Enjoy free delivery on orders up to $99
          </p>
        </div>

        {/* Service Item */}
        <div className="
          flex flex-col items-center 
          p-6 rounded-xl min-h-[180px]
          hover:shadow-lg hover:scale-105 
          transition-all duration-300 cursor-pointer
        ">
          <i className="text-4xl fi fi-ts-wallet-buyer mb-3 text-brandPrimary dark:text-brandWhite"></i>
          <h3 className="text-lg font-semibold mb-1">Secure Payment</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Supports all major payment methods
          </p>
        </div>

        {/* Service Item */}
        <div className="
          flex flex-col items-center 
          p-6 rounded-xl min-h-[180px]
          hover:shadow-lg hover:scale-105 
          transition-all duration-300 cursor-pointer
        ">
          <i className="text-4xl fi fi-tr-hand-holding-usd mb-3 text-brandPrimary dark:text-brandWhite"></i>
          <h3 className="text-lg font-semibold mb-1">Refund Policy</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Return products within 30 days
          </p>
        </div>

        {/* Service Item */}
        <div className="
          flex flex-col items-center 
          p-6 rounded-xl min-h-[180px]
          hover:shadow-lg hover:scale-105 
          transition-all duration-300 cursor-pointer
        ">
          <i className="text-4xl fi fi-tr-user-headset mb-3 text-brandPrimary dark:text-brandWhite"></i>
          <h3 className="text-lg font-semibold mb-1">24/7 Support</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Our customer support is active 24/7
          </p>
        </div>

      </div>
    </div>
  )
}

export default Services;
