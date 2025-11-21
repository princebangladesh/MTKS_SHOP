import React from 'react'
import btspeaker from '../assets/hero/btspeaker.png'
import drone from '../assets/hero/drone.png'

function Dblocks() {
  return (
    <div className="container px-3 sm:px-4">
      <div className="flex flex-col md:flex-row gap-4">

        {/* ---------- Banner 1 ---------- */}
        <div className="
          flex-1 relative overflow-hidden rounded-2xl
          bg-[linear-gradient(63deg,_#DADDEB_0%,_#EDF0F2_100%)]
          dark:Cat-bg 
          p-5
        ">
          {/* Image */}
          <img
            src={btspeaker}
            alt="Luxury Gadgets"
            className="
              absolute bottom-2 right-2
              h-32 sm:h-40 md:h-44
              w-auto object-contain
              transition-transform duration-500 ease-in-out
              group-hover:scale-110
            "
          />

          {/* Text */}
          <div className="relative z-10 pr-20">
            <div className="text-yellow-600 text-xl sm:text-2xl font-bold">
              Upto 25% Off
            </div>

            <h3 className="text-dark text-xl sm:text-2xl font-semibold mt-2">
              Luxury Gadgets
            </h3>

            <p className="text-dark mt-1 text-sm sm:text-base">
              Grab the offer for the whole month.
            </p>

            <a
              href="#"
              className="
                inline-block mt-4
                bg-black text-white text-sm sm:text-base
                uppercase py-2 px-5 
                rounded-full
              "
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* ---------- Banner 2 ---------- */}
        <div className="
          flex-1 relative overflow-hidden rounded-2xl
          bg-[linear-gradient(63deg,_#EDF0F2_0%,_#DADDEB_100%)]
          dark:Caro-bg 
          p-5
        ">
          {/* Image */}
          <img
            src={drone}
            alt="Super Drone"
            className="
              absolute bottom-2 right-2
              h-32 sm:h-40 md:h-44
              w-auto object-contain
              transition-transform duration-500 ease-in-out
              group-hover:scale-110
            "
          />

          {/* Text */}
          <div className="relative z-10 pr-20">
            <div className="text-yellow-600 text-xl sm:text-2xl font-bold">
              Upto 10% Off
            </div>

            <h3 className="text-dark dark:text-white text-xl sm:text-2xl font-semibold mt-2">
              Super Drone
            </h3>

            <p className="text-black dark:text-white mt-1 text-sm sm:text-base">
              Experience real flight
            </p>

            <a
              href="#"
              className="
                inline-block mt-4
                bg-black text-white text-sm sm:text-base
                uppercase py-2 px-5 
                rounded-full
              "
            >
              Shop Now
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dblocks
