import React from "react";
import Slider from "react-slick";
import { SiXiaomi,SiSamsung,SiBose,SiHp,SiDell,SiSandisk,SiSony,SiHuawei, SiApple   } from "react-icons/si";
import { useLoader } from "./shared/loaderContext";
import { Link } from "react-router-dom";
import { getIconByName } from './utils/getIconByName';
import { BASE_URL } from "../config/api";



const BrandSlider = () => {
  const [BrandData, setBrandData] = React.useState([]);
  const { loading, setLoading } = useLoader();
  React.useEffect(() => {
    // Replace this with your actual API URL
    fetch(`${BASE_URL}/brand_land/`)
      .then(res => res.json())
      .then(data => {
        setBrandData(data);
        setLoading(false);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);





  const settings = {
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3500,
    infinite: true,
    slidesToShow: 6, // Adjust for responsiveness
    slidesToScroll: 1,

    cssEase: "linear",
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="container my-4">
      
    <h2 className="text-center text-2xl font-bold mb-6 text-dark dark:text-brandWhite">Most Popular Brands</h2>  
    <div className="dark:Caro-bg py-8 px-4 border-brandBlue border-t-2 border-b-2">
      <Slider {...settings}>
        {BrandData.map((brand, index) => {
          const BrandIcon = getIconByName(brand.icon_tag);

          return (
            <div key={brand.id} className="px-2">
              <div className="h-16 w-auto mx-auto object-contain">
                <Link to={`/brands/${brand.slug}`}>
                  <div className="flex justify-center items-center">
                    <BrandIcon size={48} className="text-brandDark dark:text-brandWhite" />
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
    </div>
  );
};

export default BrandSlider;