import React from 'react'

function Services() {
  return (
    <div className="container">
      <div
        className="
          flex flex-wrap justify-center 
          gap-6 sm:gap-10 lg:gap-16 
          text-center text-gray-800 dark:text-brandWhite 
          py-10
        "
      >

        {/* Service Item */}
        <div className="flex flex-col items-center max-w-[200px] cursor-pointer hover:scale-105 transition-all duration-300">
          <i className="text-3xl sm:text-4xl fi fi-ts-shipping-fast mb-3 text-brandPrimary dark:text-brandWhite" />
          <h3 className="text-base sm:text-lg font-serif mb-1">Free Delivery</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Enjoy free delivery on orders up to $99
          </p>
        </div>

        {/* Service Item */}
        <div className="flex flex-col items-center max-w-[200px] cursor-pointer hover:scale-105 transition-all duration-300">
          <i className="text-3xl sm:text-4xl fi fi-ts-wallet-buyer mb-3 text-brandPrimary dark:text-brandWhite" />
          <h3 className="text-base sm:text-lg font-serif mb-1">Secure Payment</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Supports all major payment methods
          </p>
        </div>

        {/* Service Item */}
        <div className="flex flex-col items-center max-w-[200px] cursor-pointer hover:scale-105 transition-all duration-300">
          <i className="text-3xl sm:text-4xl fi fi-tr-hand-holding-usd mb-3 text-brandPrimary dark:text-brandWhite" />
          <h3 className="text-base sm:text-lg font-serif mb-1">Refund Policy</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Return products within 30 days
          </p>
        </div>

        {/* Service Item */}
        <div className="flex flex-col items-center max-w-[200px] cursor-pointer hover:scale-105 transition-all duration-300">
          <i className="text-3xl sm:text-4xl fi fi-tr-user-headset mb-3 text-brandPrimary dark:text-brandWhite" />
          <h3 className="text-base sm:text-lg font-serif mb-1">24/7 Support</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Our customer support is active 24/7
          </p>
        </div>

      </div>
    </div>
  )
}

export default Services
