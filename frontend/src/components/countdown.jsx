import React, { useEffect, useState } from "react";
import Timer from "./timer";
import { BASE_URL } from "../config/api";

const Countdown = () => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/offer-banners/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setBanner(data[0]);  // latest banner
      })
      .catch((err) => console.error("Error fetching banner:", err));
  }, []);

  if (!banner) return null; // or a loader

  const timerConfig = {
    title: banner.limited_time_text,
    deadline: banner.end_date,
  };

  return (
    <div className="container">
      <div className="flex items-center justify-center min-h-[300px] py-5">
        <div className="container text-brandBlue dark:text-brandWhite bg-brandWhite dark:bg-brandBlue rounded-3xl p-6 md:p-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            {/* -------- LEFT TEXT -------- */}
            <div className="p-6 sm:p-8 justify-center items-center md:items-start flex flex-col">
              <p className="text-xl font-bold py-1">{banner.promotion}</p>
              <p className="text-4xl uppercase lg:text-5xl font-bold">{banner.title}</p>
              <p className="text-sm mt-5">{banner.subtitle}</p>
            </div>

            {/* -------- CENTER IMAGE -------- */}
            <div className="h-full flex items-center justify-center overflow-hidden">
              <img
                src={banner.image}
                alt={banner.title}
                className="scale-125 w-[250px] md:w-[340px]"
                data-aos="fade-up"
                data-aos-delay="200"
              />
            </div>

            {/* -------- RIGHT TIMER -------- */}
            <div className="flex justify-center md:justify-start overflow-hidden w-full">
              <Timer config={timerConfig} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
