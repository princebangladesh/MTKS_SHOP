import React from 'react'
function Services() {
  return (
      <div className="container">
            <div className="flex justify-center lg:gap-16 sm:gap-4 text-center text-gray-800 py-12">
                  <div className="flex flex-col items-center max-w-xs cursor-pointer hover:scale-105 duration-300 transition-all ease-in-out">
                  <i className="text-4xl fi fi-ts-shipping-fast h-8 w-8 mb-2 text-brandPrimary dark:text-brandWhite" />
                  <h3 className="text-lg font-serif mb-1 dark:text-brandWhite">Free Delivery</h3>
                  <p className="text-sm text-gray-400">
                  Enjoy Free delivery upto 99$ order
                  </p>      
                  </div>
                  <div className="flex flex-col items-center max-w-xs cursor-pointer hover:scale-105 duration-300">
                  <i className="text-4xl fi fi-ts-wallet-buyer h-8 w-8 mb-2 text-brandPrimary dark:text-brandWhite" />
                  <h3 className="text-lg font-serif mb-1 dark:text-brandWhite">Secure Payment</h3>
                  <p className="text-sm text-gray-400">
                  Support all type of payment
                  </p>      
                  </div>
                  <div className="flex flex-col items-center max-w-xs cursor-pointer hover:scale-105 duration-300">
                  <i className="text-4xl fi fi-tr-hand-holding-usd h-8 w-8 mb-2 text-brandPrimary dark:text-brandWhite" />
                  <h3 className="text-lg font-serif mb-1 dark:text-brandWhite">Refund Policy</h3>
                  <p className="text-sm text-gray-400">
                  Return any product within 30 Days
                  </p>      
                  </div>
                  <div className="flex flex-col items-center max-w-xs cursor-pointer hover:scale-105 duration-300">
                  <i className="text-4xl fi fi-tr-user-headset h-8 w-8 mb-2 text-brandPrimary dark:text-brandWhite" />
                  <h3 className="text-lg font-serif mb-1 dark:text-brandWhite">Customer Support</h3>
                  <p className="text-sm text-gray-400">
                  Our Customer service is responsive for 24/7 days
                  </p>      
                  </div>
            </div>
      </div>
  )
}

export default Services