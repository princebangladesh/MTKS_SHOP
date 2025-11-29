import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useLoader } from "./shared/loaderContext";
import { getIconByName } from "./utils/getIconByName";
import { BASE_URL } from "../config/api";

const BrandSlider = () => {
  const [BrandData, setBrandData] = React.useState([]);
  const { loading, setLoading } = useLoader();

  React.useEffect(() => {
    fetch(`${BASE_URL}/brand_land/`)
      .then((res) => res.json())
      .then((data) => {
        setBrandData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const settings = {
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3500,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="w-full my-4">

      <h2 className="text-center text-2xl font-bold mb-6 text-dark dark:text-brandWhite">
        Most Popular Brands
      </h2>

      {/* Slider section NO padding/margin */}
      <div className="w-full border-t-2 border-b-2 border-brandBlue dark:Caro-bg">

        <Slider {...settings}>
          {BrandData.map((brand) => {
            const BrandIcon = getIconByName(brand.icon_tag);

            return (
              <div key={brand.id} className="m-0 p-0">
                <Link to={`/brands/${brand.slug}`}>
                  <div className="flex justify-center items-center h-16">
                    <BrandIcon size={48} className="text-brandDark dark:text-brandWhite" />
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>

      </div>
    </div>
  );
};

export default BrandSlider;
