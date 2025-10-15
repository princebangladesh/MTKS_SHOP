import React from 'react'
import btspeaker from '../assets/hero/btspeaker.png'
import drone from '../assets/hero/drone.png'
function Dblocks() {
  return (
    <div className="container">
    <div className="flex flex-col md:flex-row gap-4 mx-2">
  {/* Banner 1 */}
  <div className="flex-1 relative bg-[linear-gradient(63deg,_#DADDEB_0%,_#EDF0F2_100%)] dark:Cat-bg mb-3 md:mb-0 overflow-hidden rounded-3xl group">
    <div className=''>
    <img
      src={btspeaker}
      alt="Luxury Gadgets"
      className="absolute bottom-0 right-0 h-[200px] w-auto object-contain group-hover:scale-[1.3] transition-transform duration-500 ease-in-out"
    />
    </div>
    <div className="p-5 relative z-10">
      <div className="text-yellow-600 text-2xl font-bold">Upto 25% Off</div>
      <h3 className="text-dark text-2xl font-semibold mt-2">Luxury Gadgets</h3>
      <p className="text-dark mt-1">Grab the offer for whole month.</p>
      <a
        href="#"
        className="rounded-full inline-block mt-4 bg-black text-white uppercase py-2 px-4 text-sm"
      >
        Show Now
      </a>
    </div>
  </div>

  {/* Banner 2 */}
  <div className="flex-1 relative bg-[linear-gradient(63deg,_#EDF0F2_0%,_#DADDEB_100%)] dark:Caro-bg overflow-hidden rounded-3xl group">
    <img
      src={drone}
      alt="Creamy Muffins"
      className="absolute bottom-0 right-0 h-[200px] w-auto object-contain group-hover:scale-[1.3] transition-transform duration-500 ease-in-out"
    />
    <div className="p-5 relative z-10">
      <div className="text-yellow-600 text-2xl font-bold">Upto 10% Off</div>
      <h3 className="text-dark dark:text-white text-2xl font-semibold mt-2">Super Drone</h3>
      <p className="text-black dark:text-white mt-1">Experience the real flight</p>
      <a
        href="#"
        className="inline-block mt-4 bg-black text-white uppercase py-2 px-4 text-sm rounded-full "
      >
        Show Now
      </a>
    </div>
  </div>
</div>
</div>
  )
}

export default Dblocks