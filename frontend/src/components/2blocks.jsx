import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../config/api';

function Dblocks() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/dblocks/`)
      .then(res => res.json())
      .then(data => setBlocks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container px-3 sm:px-4 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4">

        {blocks.map((item) => (
          <div
            key={item.id}
            className="
              flex-1 relative overflow-hidden rounded-2xl
              bg-[linear-gradient(63deg,_#EDF0F2_0%,_#DADDEB_100%)]
              dark:Caro-bg
              p-5
            "
          >
            {/* Image from API */}
            <img
              src={item.image}
              alt={item.title}
              className="
                absolute bottom-2 right-2
                h-32 sm:h-40 md:h-44
                object-contain
              "
            />

           <div className="relative z-10 pr-20">
            <div className="text-yellow-600 text-xl sm:text-2xl font-bold">
              {item.promotion}
            </div>

            <h3 className="text-dark dark:text-white text-xl sm:text-2xl font-semibold mt-2">
              {item.title}
            </h3>

            <p className="text-dark mt-1 text-sm sm:text-base dark:text-gray-300">
              {item.detail}
            </p>

              <a
                href={item.link}
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
        ))}

      </div>
    </div>
  );
}

export default Dblocks;
