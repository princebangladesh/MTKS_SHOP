import React from 'react';
import Slider from 'react-slick';
import Button from './shared/button';
import { useLoader } from './shared/loaderContext';
import { BASE_URL } from '../config/api';
import AOS from "aos";
import "aos/dist/aos.css";

function Hero() {
  const [CaroData, setCaroData] = React.useState([]);
  const { setLoading } = useLoader();

  React.useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  React.useEffect(() => {
    fetch(`${BASE_URL}/carousel/`)
      .then(res => res.json())
      .then(data => {
        setCaroData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3500,
    beforeChange: () => {
      // ➜ Re-trigger AOS animations every time slide changes
      setTimeout(() => {
        AOS.refreshHard();
      }, 50);
    }
  };

  return (
    <div className="container">
      <div className="Caro-bg rounded-3xl overflow-hidden min-h-[550px] sm:min-h-[650px] flex justify-center items-center">
        <div className="container pb-8 sm:pb-0">
          <Slider {...settings}>
            {CaroData.map((data) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2">

                  {/* LEFT TEXT AREA */}
                  <div
                    className="flex flex-col justify-center text-center relative z-10 order-2 gap-4 pt-12 
                    sm:pt-0 sm:pl-3 sm:text-left sm:order-1"
                  >
                    <h1
                      className="text-[15px] sm:text-[20px] lg:text-[30px] font-bold text-brandGreen-600 dark:text-gray-300"
                      data-aos="fade-up"
                    >
                      {data.title}
                    </h1>

                    <h1
                      className="text-[30px] lg:text[50px] font-bold dark:text-cyan-300"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      {data.subtitle}
                    </h1>

                    <h1
                      className="font-bold uppercase text-5xl sm:text-[80px] md:text-[40px] 
                      lg:text-[145px] text-[#2C2C2C] dark:text-[#D7D7D7]"
                      data-aos="zoom-in"
                      data-aos-delay="500"
                    >
                      {data.category?.name || ""}
                    </h1>

                    <div data-aos="fade-up" data-aos-delay="200">
                      <Button
                        text="Shop Now"
                        bgColor="bg-brandGreen dark:bg-brandWhite"
                        textColor="text-white dark:text-brandGreen font-bold"
                      />
                    </div>
                  </div>

                  {/* RIGHT IMAGE AREA */}
                  <div className="order-1 sm:order-2">
                    <img
                      src={data.image}
                      alt={data.title}
                      className="relative z-40 mx-auto object-contain w-[300px] h-[300px] 
                        sm:h-[450px] sm:w-[450px] sm:scale-105 lg-scale-110 
                        drop-shadow-[-8px_4px_6px_rgba(0,0,0,0.4)]"
                      data-aos="fade-left"
                      data-aos-delay="200"
                    />
                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default Hero;
